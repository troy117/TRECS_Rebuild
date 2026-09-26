const { spawn } = require('node:child_process');
const path = require('node:path');
const name = process.argv[2];
if (!/^check-[a-z0-9-]+\.js$/.test(name || '')) throw new Error('Choose a check script by basename');
const env = { ...process.env }; delete env.ELECTRON_RUN_AS_NODE;
const child = spawn(require('electron'), [path.join(__dirname, name), ...process.argv.slice(3)], { env, windowsHide: true, stdio: ['ignore', 'pipe', 'inherit'] });
let output = '';
child.stdout.on('data', bytes => { process.stdout.write(bytes); output = (output + bytes.toString()).slice(-100000); });
child.on('error', error => { console.error(error); process.exitCode = 1; });
child.on('close', code => {
  const completed = output.split(/\r?\n/).some(line => { try { return JSON.parse(line).passed === true; } catch { return false; } });
  if (code === 0 && !completed) console.error('Electron exited before the test completion marker.');
  process.exitCode = code === 0 && completed ? 0 : (code || 1);
});
