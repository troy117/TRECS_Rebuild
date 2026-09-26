const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const updater = require('../src/main/portable-updater');

async function writeManifest(serverRoot, executableName, contents, overrides = {}) {
  const executablePath = path.join(serverRoot, executableName);
  fs.writeFileSync(executablePath, contents);
  const manifest = updater.createReleaseManifest(executablePath, '9.8.7', '2026-09-11T12:00:00.000Z');
  const published = { ...manifest, fileName: executableName, ...overrides };
  await updater.atomicJson(path.join(serverRoot, updater.UPDATE_MANIFEST_NAME), published);
  return published;
}

async function main() {
  const testRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'trecs-portable-updater-'));
  try {
    const noManifestRoot = path.join(testRoot, 'no-manifest');
    const noManifestCurrent = path.join(testRoot, 'no-manifest-current.exe');
    fs.mkdirSync(noManifestRoot, { recursive: true });
    fs.writeFileSync(noManifestCurrent, 'current');
    const absent = await updater.inspectPortableUpdate({
      serverRoot: noManifestRoot,
      currentExecutablePath: noManifestCurrent,
      stagingRoot: path.join(testRoot, 'no-manifest-stage')
    });
    assert.equal(absent.status, 'no_manifest');

    const serverRoot = path.join(testRoot, 'server');
    const stagingRoot = path.join(testRoot, 'stage');
    const currentExecutablePath = path.join(testRoot, 'TRECS-Portable.exe');
    fs.mkdirSync(serverRoot, { recursive: true });
    fs.writeFileSync(currentExecutablePath, 'old portable application');
    const published = await writeManifest(serverRoot, 'TRECS-Portable-build987.exe', 'new portable application');
    const ready = await updater.inspectPortableUpdate({ serverRoot, currentExecutablePath, stagingRoot });
    assert.equal(ready.status, 'ready');
    assert.equal(await updater.hashFile(ready.stagedPath), published.sha256);
    assert.equal(fs.readFileSync(currentExecutablePath, 'utf8'), 'old portable application');

    fs.writeFileSync(currentExecutablePath, 'new portable application');
    const current = await updater.inspectPortableUpdate({ serverRoot, currentExecutablePath, stagingRoot });
    assert.equal(current.status, 'current');
    assert.equal(current.manifest.buildId, published.buildId);

    const corruptRoot = path.join(testRoot, 'corrupt-server');
    fs.mkdirSync(corruptRoot, { recursive: true });
    const corruptManifest = await writeManifest(corruptRoot, 'TRECS-Portable-corrupt.exe', 'valid bytes');
    fs.writeFileSync(path.join(corruptRoot, corruptManifest.fileName), 'xxxxx bytes');
    fs.writeFileSync(currentExecutablePath, 'old portable application');
    await assert.rejects(
      updater.inspectPortableUpdate({
        serverRoot: corruptRoot,
        currentExecutablePath,
        stagingRoot: path.join(testRoot, 'corrupt-stage')
      }),
      (error) => error.code === 'TRECS_UPDATE_HASH_MISMATCH'
    );
    assert.equal(fs.readFileSync(currentExecutablePath, 'utf8'), 'old portable application');

    assert.throws(() => updater.validateManifest({
      schemaVersion: 1,
      version: '1.0.0',
      buildId: 'unsafe',
      publishedAt: '2026-09-11T12:00:00.000Z',
      fileName: '..\\TRECS-Portable.exe',
      size: 10,
      sha256: 'a'.repeat(64)
    }), (error) => error.code === 'TRECS_UPDATE_INVALID_MANIFEST');

    const overwrittenManifest = path.join(testRoot, 'atomic.json');
    await updater.atomicJson(overwrittenManifest, { sequence: 1 });
    await updater.atomicJson(overwrittenManifest, { sequence: 2 });
    assert.deepEqual(JSON.parse(fs.readFileSync(overwrittenManifest, 'utf8')), { sequence: 2 });

    const handshakeRoot = path.join(testRoot, 'handshakes');
    const handshakePath = path.join(handshakeRoot, 'ready.json');
    assert.equal(updater.writeStartupHandshake(handshakePath, handshakeRoot, { ready: true }), true);
    assert.equal(JSON.parse(fs.readFileSync(handshakePath, 'utf8')).ready, true);
    assert.throws(
      () => updater.writeStartupHandshake(path.join(testRoot, 'outside.json'), handshakeRoot, { ready: true }),
      (error) => error.code === 'TRECS_UPDATE_HANDSHAKE_REJECTED'
    );

    assert.equal(updater.isUncPath('\\\\server\\share\\TRECS'), true);
    assert.equal(updater.isUncPath('C:\\TRECS'), false);
    assert.match(updater.APPLY_UPDATE_SCRIPT, /Get-FileHash/);
    assert.match(updater.APPLY_UPDATE_SCRIPT, /TRECS_SKIP_UPDATE_ONCE/);
    assert.match(updater.APPLY_UPDATE_SCRIPT, /rolled_back/);

    if (process.platform === 'win32') {
      const scriptPath = path.join(testRoot, 'apply-portable-update.ps1');
      fs.writeFileSync(scriptPath, updater.APPLY_UPDATE_SCRIPT);
      const syntax = spawnSync('powershell.exe', [
        '-NoLogo', '-NoProfile', '-NonInteractive', '-Command',
        `[void][scriptblock]::Create([IO.File]::ReadAllText('${scriptPath.replace(/'/g, "''")}'))`
      ], { encoding: 'utf8', windowsHide: true });
      assert.equal(syntax.status, 0, syntax.stderr || syntax.stdout);
    }

    console.log('Portable updater checks passed.');
  } finally {
    fs.rmSync(testRoot, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
