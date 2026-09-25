const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const { atomicJson, createReleaseManifest, UPDATE_MANIFEST_NAME } = require('../src/main/portable-updater');

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

async function main() {
  compileAccessReader();
  compileDeliveryEnvelopeCoverRenderer();
  compileSchoolDirectoryRenderer();
  compileIdCardSheetRenderer();
  compileCameraCardSheetRenderer();
  const builderCli = path.join(appRoot, 'node_modules', 'electron-builder', 'out', 'cli', 'cli.js');
  const configuredOutput = process.env.TRECS_BUILD_OUTPUT
    ? path.resolve(appRoot, process.env.TRECS_BUILD_OUTPUT)
    : path.join(repoRoot, 'build', 'single');
  run(process.execPath, [
    builderCli,
    '--win',
    'portable',
    '--x64',
    `--config.directories.output=${configuredOutput}`
  ], { cwd: appRoot });
  const executablePath = path.join(configuredOutput, 'TRECS-Portable.exe');
  const packageJson = JSON.parse(fs.readFileSync(path.join(appRoot, 'package.json'), 'utf8'));
  const manifest = createReleaseManifest(executablePath, packageJson.version);
  const manifestPath = path.join(configuredOutput, UPDATE_MANIFEST_NAME);
  await atomicJson(manifestPath, manifest);
  console.log(`Single EXE created at ${executablePath}`);
  console.log(`Verified update manifest created at ${manifestPath} (${manifest.buildId})`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
