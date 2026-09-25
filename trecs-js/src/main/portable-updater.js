const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const UPDATE_MANIFEST_NAME = 'TRECS-update.json';
const UPDATE_SCRIPT_NAME = 'apply-portable-update.ps1';
const UPDATE_STATUS_NAME = 'update-status.json';

function updateError(code, message, cause) {
  const error = new Error(message, cause ? { cause } : undefined);
  error.code = code;
  return error;
}

function isUncPath(value) {
  return /^\\\\[^\\]+\\[^\\]+(?:\\|$)/.test(String(value || ''));
}

function normalizeHash(value) {
  return String(value || '').trim().toLowerCase();
}

function validateManifest(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw updateError('TRECS_UPDATE_INVALID_MANIFEST', 'The TRECS update manifest is not a JSON object.');
  }
  if (value.schemaVersion !== 1) {
    throw updateError('TRECS_UPDATE_INVALID_MANIFEST', 'The TRECS update manifest uses an unsupported format.');
  }
  const fileName = String(value.fileName || '').trim();
  if (!fileName || path.basename(fileName) !== fileName || !/\.exe$/i.test(fileName)) {
    throw updateError('TRECS_UPDATE_INVALID_MANIFEST', 'The TRECS update manifest has an unsafe executable filename.');
  }
  const sha256 = normalizeHash(value.sha256);
  if (!/^[a-f0-9]{64}$/.test(sha256)) {
    throw updateError('TRECS_UPDATE_INVALID_MANIFEST', 'The TRECS update manifest has an invalid SHA-256 value.');
  }
  const size = Number(value.size);
  if (!Number.isSafeInteger(size) || size <= 0) {
    throw updateError('TRECS_UPDATE_INVALID_MANIFEST', 'The TRECS update manifest has an invalid executable size.');
  }
  const version = String(value.version || '').trim();
  if (!version || version.length > 64) {
    throw updateError('TRECS_UPDATE_INVALID_MANIFEST', 'The TRECS update manifest has an invalid version.');
  }
  const buildId = String(value.buildId || sha256.slice(0, 12)).trim();
  if (!/^[a-z0-9._-]{1,64}$/i.test(buildId)) {
    throw updateError('TRECS_UPDATE_INVALID_MANIFEST', 'The TRECS update manifest has an invalid build identifier.');
  }
  const publishedAt = value.publishedAt == null ? '' : String(value.publishedAt).trim();
  if (publishedAt && !Number.isFinite(Date.parse(publishedAt))) {
    throw updateError('TRECS_UPDATE_INVALID_MANIFEST', 'The TRECS update manifest has an invalid publication date.');
  }
  return { schemaVersion: 1, version, buildId, publishedAt, fileName, size, sha256 };
}

async function hashFile(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const input = fs.createReadStream(filePath);
    input.on('error', reject);
    input.on('data', (chunk) => hash.update(chunk));
    input.on('end', () => resolve(hash.digest('hex')));
  });
}

async function syncFile(filePath) {
  const handle = await fs.promises.open(filePath, 'r+');
  try { await handle.sync(); } finally { await handle.close(); }
}

async function readManifest(manifestPath) {
  let text;
  try {
    text = await fs.promises.readFile(manifestPath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw updateError('TRECS_UPDATE_MANIFEST_UNAVAILABLE', `TRECS could not read the update manifest at ${manifestPath}.`, error);
  }
  try {
    return validateManifest(JSON.parse(text.replace(/^\uFEFF/, '')));
  } catch (error) {
    if (error.code === 'TRECS_UPDATE_INVALID_MANIFEST') throw error;
    throw updateError('TRECS_UPDATE_INVALID_MANIFEST', `The TRECS update manifest at ${manifestPath} is not valid JSON.`, error);
  }
}

async function verifiedFile(filePath, manifest) {
  let stat;
  try { stat = await fs.promises.stat(filePath); }
  catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
  if (!stat.isFile() || stat.size !== manifest.size) return false;
  return (await hashFile(filePath)) === manifest.sha256;
}

async function inspectPortableUpdate(options) {
  const serverRoot = path.resolve(options.serverRoot);
  const currentExecutablePath = path.resolve(options.currentExecutablePath);
  const stagingRoot = path.resolve(options.stagingRoot);
  const manifestPath = path.join(serverRoot, UPDATE_MANIFEST_NAME);
  const manifest = await readManifest(manifestPath);
  if (!manifest) {
    return { status: 'no_manifest', manifestPath };
  }

  let currentStat;
  try { currentStat = await fs.promises.stat(currentExecutablePath); }
  catch (error) {
    throw updateError('TRECS_UPDATE_CURRENT_EXE_UNAVAILABLE', `TRECS could not read its local executable at ${currentExecutablePath}.`, error);
  }
  if (!currentStat.isFile()) {
    throw updateError('TRECS_UPDATE_CURRENT_EXE_UNAVAILABLE', `The local TRECS executable is not a file: ${currentExecutablePath}.`);
  }
  const currentSha256 = await hashFile(currentExecutablePath);
  if (currentSha256 === manifest.sha256) {
    return { status: 'current', manifestPath, manifest, currentSha256 };
  }

  const serverExecutablePath = path.join(serverRoot, manifest.fileName);
  const relativeServerPath = path.relative(serverRoot, serverExecutablePath);
  if (relativeServerPath.startsWith('..') || path.isAbsolute(relativeServerPath)) {
    throw updateError('TRECS_UPDATE_INVALID_MANIFEST', 'The TRECS update executable is outside the configured server folder.');
  }
  let serverStat;
  try { serverStat = await fs.promises.stat(serverExecutablePath); }
  catch (error) {
    throw updateError('TRECS_UPDATE_EXE_UNAVAILABLE', `The published TRECS update is missing or unavailable: ${serverExecutablePath}.`, error);
  }
  if (!serverStat.isFile() || serverStat.size !== manifest.size) {
    throw updateError('TRECS_UPDATE_EXE_INCOMPLETE', 'The published TRECS update has not finished copying or has the wrong size. Ask the lab administrator to republish it.');
  }

  await fs.promises.mkdir(stagingRoot, { recursive: true });
  const stagedPath = path.join(stagingRoot, `TRECS-Portable-${manifest.sha256}.exe`);
  if (!(await verifiedFile(stagedPath, manifest))) {
    const temporaryPath = `${stagedPath}.${crypto.randomUUID()}.part`;
    try {
      await fs.promises.copyFile(serverExecutablePath, temporaryPath, fs.constants.COPYFILE_EXCL);
      await syncFile(temporaryPath);
      if (!(await verifiedFile(temporaryPath, manifest))) {
        throw updateError('TRECS_UPDATE_HASH_MISMATCH', 'The copied TRECS update failed verification. The current version was not changed.');
      }
      await fs.promises.unlink(stagedPath).catch((error) => {
        if (error.code !== 'ENOENT') throw error;
      });
      await fs.promises.rename(temporaryPath, stagedPath);
    } finally {
      await fs.promises.unlink(temporaryPath).catch((error) => {
        if (error.code !== 'ENOENT') throw error;
      });
    }
  }

  return {
    status: 'ready',
    manifestPath,
    manifest,
    currentSha256,
    serverExecutablePath,
    stagedPath,
    targetPath: currentExecutablePath
  };
}

function createReleaseManifest(filePath, version, publishedAt = new Date().toISOString()) {
  const stat = fs.statSync(filePath);
  if (!stat.isFile() || stat.size <= 0) throw new Error(`Release executable is missing or empty: ${filePath}`);
  const sha256 = crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
  return validateManifest({
    schemaVersion: 1,
    version: String(version),
    buildId: sha256.slice(0, 12),
    publishedAt,
    fileName: path.basename(filePath),
    size: stat.size,
    sha256
  });
}

async function atomicJson(filePath, value) {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.${crypto.randomUUID()}.tmp`;
  let handle;
  try {
    handle = await fs.promises.open(temporaryPath, 'wx');
    await handle.writeFile(`${JSON.stringify(value, null, 2)}\n`);
    await handle.sync();
    await handle.close();
    handle = null;
    for (let attempt = 0; ; attempt += 1) {
      try { await fs.promises.rename(temporaryPath, filePath); break; }
      catch (error) {
        if (!['EPERM', 'EACCES', 'EBUSY'].includes(error.code) || attempt >= 5) throw error;
        await new Promise((resolve) => setTimeout(resolve, 50 * (attempt + 1)));
      }
    }
  } finally {
    if (handle) await handle.close();
    await fs.promises.unlink(temporaryPath).catch((error) => {
      if (error.code !== 'ENOENT') throw error;
    });
  }
}

const APPLY_UPDATE_SCRIPT = String.raw`param(
  [Parameter(Mandatory=$true)][string]$StagedPath,
  [Parameter(Mandatory=$true)][string]$TargetPath,
  [Parameter(Mandatory=$true)][string]$ExpectedSha256,
  [Parameter(Mandatory=$true)][int]$ParentPid,
  [Parameter(Mandatory=$true)][string]$WorkingDirectory,
  [Parameter(Mandatory=$true)][string]$HandshakePath,
  [Parameter(Mandatory=$true)][string]$StatusPath
)

$ErrorActionPreference = 'Stop'
$backupPath = [IO.Path]::Combine(
  [IO.Path]::GetDirectoryName($TargetPath),
  ([IO.Path]::GetFileNameWithoutExtension($TargetPath) + '.previous.exe')
)
$updatedProcess = $null

function Write-UpdateStatus([string]$State, [string]$Message) {
  $status = @{
    state = $State
    message = $Message
    expectedSha256 = $ExpectedSha256.ToLowerInvariant()
    updatedAt = [DateTime]::UtcNow.ToString('o')
  } | ConvertTo-Json
  $temporary = "$StatusPath.$([guid]::NewGuid().ToString('N')).tmp"
  [IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($StatusPath)) | Out-Null
  [IO.File]::WriteAllText($temporary, $status)
  Move-Item -LiteralPath $temporary -Destination $StatusPath -Force
}

function Invoke-WithRetry([scriptblock]$Action) {
  $lastError = $null
  for ($attempt = 0; $attempt -lt 40; $attempt += 1) {
    try { & $Action; return }
    catch {
      $lastError = $_
      Start-Sleep -Milliseconds ([Math]::Min(1000, 100 + ($attempt * 50)))
    }
  }
  throw $lastError
}

function Test-ExpectedHash([string]$FilePath) {
  if (-not (Test-Path -LiteralPath $FilePath -PathType Leaf)) { return $false }
  return ((Get-FileHash -LiteralPath $FilePath -Algorithm SHA256).Hash.ToLowerInvariant() -eq $ExpectedSha256.ToLowerInvariant())
}

try {
  Write-UpdateStatus 'waiting' 'Waiting for TRECS to close.'
  for ($attempt = 0; $attempt -lt 180; $attempt += 1) {
    if (-not (Get-Process -Id $ParentPid -ErrorAction SilentlyContinue)) { break }
    Start-Sleep -Milliseconds 500
  }
  if (Get-Process -Id $ParentPid -ErrorAction SilentlyContinue) {
    throw 'TRECS did not close within 90 seconds.'
  }
  if (-not (Test-ExpectedHash $StagedPath)) {
    throw 'The staged TRECS update failed verification.'
  }

  Remove-Item -LiteralPath $HandshakePath -Force -ErrorAction SilentlyContinue
  if (Test-Path -LiteralPath $backupPath -PathType Leaf) {
    Invoke-WithRetry { Remove-Item -LiteralPath $backupPath -Force }
  }
  if (Test-Path -LiteralPath $TargetPath -PathType Leaf) {
    Invoke-WithRetry { Move-Item -LiteralPath $TargetPath -Destination $backupPath -Force }
  }
  Invoke-WithRetry { Move-Item -LiteralPath $StagedPath -Destination $TargetPath -Force }
  if (-not (Test-ExpectedHash $TargetPath)) {
    throw 'The installed TRECS update failed verification.'
  }

  Write-UpdateStatus 'starting' 'Starting the updated TRECS version.'
  $env:TRECS_UPDATE_HANDSHAKE = $HandshakePath
  $updatedProcess = Start-Process -FilePath $TargetPath -WorkingDirectory $WorkingDirectory -PassThru
  $startedSuccessfully = $false
  for ($attempt = 0; $attempt -lt 180; $attempt += 1) {
    if (Test-Path -LiteralPath $HandshakePath -PathType Leaf) {
      $startedSuccessfully = $true
      break
    }
    $updatedProcess.Refresh()
    if ($updatedProcess.HasExited) { break }
    Start-Sleep -Milliseconds 500
  }
  if (-not $startedSuccessfully) {
    throw 'The updated TRECS version did not finish starting within 90 seconds.'
  }
  Remove-Item Env:TRECS_UPDATE_HANDSHAKE -ErrorAction SilentlyContinue
  Write-UpdateStatus 'installed' 'The TRECS update was installed and started successfully.'
  exit 0
}
catch {
  $failureMessage = $_.Exception.Message
  if ($null -ne $updatedProcess) {
    try {
      $updatedProcess.Refresh()
      if (-not $updatedProcess.HasExited) {
        Stop-Process -Id $updatedProcess.Id -Force
        $updatedProcess.WaitForExit()
      }
    } catch {}
  }
  try {
    if (Test-Path -LiteralPath $backupPath -PathType Leaf) {
      if (Test-Path -LiteralPath $TargetPath -PathType Leaf) {
        Invoke-WithRetry { Remove-Item -LiteralPath $TargetPath -Force }
      }
      Invoke-WithRetry { Move-Item -LiteralPath $backupPath -Destination $TargetPath -Force }
    }
    Remove-Item Env:TRECS_UPDATE_HANDSHAKE -ErrorAction SilentlyContinue
    $env:TRECS_SKIP_UPDATE_ONCE = '1'
    if (Test-Path -LiteralPath $TargetPath -PathType Leaf) {
      Start-Process -FilePath $TargetPath -WorkingDirectory $WorkingDirectory | Out-Null
      Write-UpdateStatus 'rolled_back' ("Update failed and the previous TRECS version was restarted: " + $failureMessage)
    } else {
      Write-UpdateStatus 'failed' ("Update failed and TRECS could not be restarted: " + $failureMessage)
    }
  } catch {
    Write-UpdateStatus 'failed' ("Update failed; rollback also failed: " + $failureMessage + ' / ' + $_.Exception.Message)
  }
  exit 1
}
`;

async function launchPortableUpdate(options) {
  const stagingRoot = path.resolve(options.stagingRoot);
  const stagedPath = path.resolve(options.stagedPath);
  const targetPath = path.resolve(options.targetPath);
  const expectedSha256 = normalizeHash(options.expectedSha256);
  if (!/^[a-f0-9]{64}$/.test(expectedSha256)) {
    throw updateError('TRECS_UPDATE_LAUNCH_REJECTED', 'The update helper received an invalid SHA-256 value.');
  }
  const relativeStage = path.relative(stagingRoot, stagedPath);
  if (relativeStage.startsWith('..') || path.isAbsolute(relativeStage)) {
    throw updateError('TRECS_UPDATE_LAUNCH_REJECTED', 'The staged update is outside the local TRECS update folder.');
  }
  if (isUncPath(targetPath) || !/\.exe$/i.test(targetPath)) {
    throw updateError('TRECS_UPDATE_LAUNCH_REJECTED', 'TRECS will only replace a local portable executable.');
  }
  await fs.promises.mkdir(stagingRoot, { recursive: true });
  const scriptPath = path.join(stagingRoot, UPDATE_SCRIPT_NAME);
  const statusPath = path.join(stagingRoot, UPDATE_STATUS_NAME);
  const handshakePath = path.join(stagingRoot, `${expectedSha256}.ready.json`);
  await fs.promises.writeFile(scriptPath, APPLY_UPDATE_SCRIPT, 'utf8');
  await atomicJson(statusPath, {
    state: 'staged',
    message: 'The verified TRECS update is ready to install.',
    expectedSha256,
    updatedAt: new Date().toISOString()
  });
  const powershellPath = process.env.SystemRoot
    ? path.join(process.env.SystemRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe')
    : 'powershell.exe';
  const child = spawn(powershellPath, [
    '-NoLogo', '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass',
    '-File', scriptPath,
    '-StagedPath', stagedPath,
    '-TargetPath', targetPath,
    '-ExpectedSha256', expectedSha256,
    '-ParentPid', String(process.pid),
    '-WorkingDirectory', path.dirname(targetPath),
    '-HandshakePath', handshakePath,
    '-StatusPath', statusPath
  ], { detached: true, stdio: 'ignore', windowsHide: true });
  await new Promise((resolve, reject) => {
    child.once('spawn', resolve);
    child.once('error', (error) => reject(updateError(
      'TRECS_UPDATE_HELPER_FAILED',
      'TRECS could not start its local update helper. The current executable was not changed.',
      error
    )));
  });
  child.unref();
  return { scriptPath, statusPath, handshakePath, pid: child.pid };
}

function writeStartupHandshake(handshakePath, stagingRoot, value) {
  if (!handshakePath) return false;
  const root = path.resolve(stagingRoot);
  const destination = path.resolve(handshakePath);
  const relative = path.relative(root, destination);
  if (relative.startsWith('..') || path.isAbsolute(relative) || path.extname(destination).toLowerCase() !== '.json') {
    throw updateError('TRECS_UPDATE_HANDSHAKE_REJECTED', 'The updater startup handshake path is not inside the local TRECS update folder.');
  }
  fs.mkdirSync(root, { recursive: true });
  const temporaryPath = `${destination}.${crypto.randomUUID()}.tmp`;
  try {
    const fd = fs.openSync(temporaryPath, 'wx');
    try {
      fs.writeFileSync(fd, `${JSON.stringify(value, null, 2)}\n`);
      fs.fsyncSync(fd);
    } finally {
      fs.closeSync(fd);
    }
    fs.renameSync(temporaryPath, destination);
  } finally {
    if (fs.existsSync(temporaryPath)) fs.unlinkSync(temporaryPath);
  }
  return true;
}

module.exports = {
  APPLY_UPDATE_SCRIPT,
  UPDATE_MANIFEST_NAME,
  UPDATE_STATUS_NAME,
  atomicJson,
  createReleaseManifest,
  hashFile,
  inspectPortableUpdate,
  isUncPath,
  launchPortableUpdate,
  readManifest,
  validateManifest,
  verifiedFile,
  writeStartupHandshake
};
