const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const appRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(appRoot, '..');

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || repoRoot,
    stdio: 'inherit',
    shell: options.shell || false,
    windowsHide: true
  });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`${command} exited with code ${result.status}`);
  }
}

function compileAccessReader() {
  const source = path.join(repoRoot, 'tools', 'AccessJobImportJson.java');
  const output = path.join(repoRoot, 'tools', 'AccessJobImportJson.class');
  if (fs.existsSync(output) && fs.statSync(output).mtimeMs >= fs.statSync(source).mtimeMs) {
    return;
  }

  run('javac', [
    '-cp',
    [
      path.join(repoRoot, 'JARS', 'jackcess-4.0.0.jar'),
      path.join(repoRoot, 'JARS', 'commons-lang3-3.11.jar'),
      path.join(repoRoot, 'JARS', 'commons-logging-1.2.jar')
    ].join(path.delimiter),
    source
  ]);
}

function compileDeliveryEnvelopeCoverRenderer() {
  const source = path.join(repoRoot, 'tools', 'DeliveryEnvelopeCoverRenderer.java');
  const output = path.join(repoRoot, 'tools', 'DeliveryEnvelopeCoverRenderer.class');
  if (fs.existsSync(output) && fs.statSync(output).mtimeMs >= fs.statSync(source).mtimeMs) {
    return;
  }

  run('javac', [source]);
}

function compileSchoolDirectoryRenderer() {
  const source = path.join(repoRoot, 'tools', 'SchoolDirectoryRenderer.java');
  const output = path.join(repoRoot, 'tools', 'SchoolDirectoryRenderer.class');
  if (fs.existsSync(output) && fs.statSync(output).mtimeMs >= fs.statSync(source).mtimeMs) {
    return;
  }

  run('javac', [source]);
}

function compileIdCardSheetRenderer() {
  const source = path.join(repoRoot, 'tools', 'IdCardSheetRenderer.java');
  const output = path.join(repoRoot, 'tools', 'IdCardSheetRenderer.class');
  if (fs.existsSync(output) && fs.statSync(output).mtimeMs >= fs.statSync(source).mtimeMs) {
    return;
  }

  run('javac', [
    '-cp',
    [
      path.join(repoRoot, 'tools'),
      path.join(repoRoot, 'JARS', 'zxing-core-1.7.jar'),
      path.join(repoRoot, 'JARS', 'json-20210307.jar')
    ].join(path.delimiter),
    source
  ]);
}

function compileCameraCardSheetRenderer() {
  const source = path.join(repoRoot, 'tools', 'CameraCardSheetRenderer.java');
  const output = path.join(repoRoot, 'tools', 'CameraCardSheetRenderer.class');
  if (fs.existsSync(output) && fs.statSync(output).mtimeMs >= fs.statSync(source).mtimeMs) {
    return;
  }

  run('javac', [
    '-cp',
    [
      path.join(repoRoot, 'tools'),
      path.join(repoRoot, 'JARS', 'zxing-core-1.7.jar')
    ].join(path.delimiter),
    source
  ]);
}

function main() {
  compileAccessReader();
  compileDeliveryEnvelopeCoverRenderer();
  compileSchoolDirectoryRenderer();
  compileIdCardSheetRenderer();
  compileCameraCardSheetRenderer();
  const builderCli = path.join(appRoot, 'node_modules', 'electron-builder', 'out', 'cli', 'cli.js');
  run(process.execPath, [builderCli, '--win', 'portable', '--x64'], { cwd: appRoot });
  console.log(`Single EXE created at ${path.join(repoRoot, 'build', 'single', 'TRECS-Portable.exe')}`);
}

main();
