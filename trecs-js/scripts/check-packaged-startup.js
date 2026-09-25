const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const root = path.resolve(__dirname, '../..');
const exportsFolder = path.join(root, 'exports');
const executable = path.join(root, 'build', 'single', 'win-unpacked', 'TRECS.exe');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  if (!fs.existsSync(executable)) throw new Error('Build the portable app before running this check.');
  fs.mkdirSync(exportsFolder, { recursive: true });
  const fixture = fs.mkdtempSync(path.join(exportsFolder, '_packaged-startup-'));
  const env = { ...process.env, TRECS_DATA_ROOT: fixture, TRECS_UI_TEST: '1' };
  delete env.ELECTRON_RUN_AS_NODE;
  const child = spawn(executable, [], { env, windowsHide: true, stdio: 'pipe' });
  let stderr = '';
  child.stderr.on('data', (data) => { stderr += data; });
  const exited = new Promise((resolve) => { child.once('exit', resolve); child.once('error', resolve); });
  try {
    const deadline = Date.now() + 20000;
    let log = '';
    while (Date.now() < deadline) {
      const logPath = path.join(fixture, 'portable-startup.log');
      if (fs.existsSync(logPath)) log = fs.readFileSync(logPath, 'utf8');
      if (log.includes('database ready') && log.includes('createWindow')) break;
      if (child.exitCode !== null) throw new Error(`Packaged app exited before opening: ${log}\n${stderr}`);
      await delay(200);
    }
    if (!log.includes('database ready') || !log.includes('createWindow') || !fs.existsSync(path.join(fixture, 'database', 'ProgramData.db'))) {
      throw new Error(`Packaged startup timed out: ${log}\n${stderr}`);
    }
    // Let the local renderer/preload finish loading after window creation.
    await delay(1000);
    if (child.exitCode !== null) throw new Error(`Packaged app exited unexpectedly: ${stderr}`);
    console.log('PASS: packaged executable initializes bundled schema/sql.js and opens its application window using isolated data.');
  } finally {
    if (child.exitCode === null) child.kill();
    await Promise.race([exited, delay(5000)]);
    if (path.dirname(fixture) !== exportsFolder || !path.basename(fixture).startsWith('_packaged-startup-')) throw new Error('Unsafe test cleanup path');
    fs.rmSync(fixture, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
