const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const {
  UPDATE_MANIFEST_NAME,
  atomicJson,
  isUncPath,
  readManifest,
  verifiedFile
} = require('../src/main/portable-updater');

const appRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(appRoot, '..');
const buildRoot = path.join(repoRoot, 'build', 'single');

function configuredServerRoot() {
  const explicit = process.argv[2] || process.env.TRECS_UPDATE_SERVER_ROOT;
  if (explicit) return path.resolve(explicit);
  const configPath = path.join(repoRoot, 'path-server.txt');
  if (!fs.existsSync(configPath)) {
    throw new Error(`No server path was supplied and ${configPath} does not exist.`);
  }
  const value = fs.readFileSync(configPath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/^["']|["']$/g, ''))
    .find((line) => line && !line.startsWith('#'));
  if (!value) throw new Error(`${configPath} does not contain a server path.`);
  return path.resolve(value);
}

async function syncFile(filePath) {
  const handle = await fs.promises.open(filePath, 'r+');
  try { await handle.sync(); } finally { await handle.close(); }
}

async function publish() {
  const serverRoot = configuredServerRoot();
  if (!isUncPath(serverRoot)) {
    throw new Error(`Lab updates must be published to a UNC server path, not ${serverRoot}.`);
  }

  const sourceManifestPath = path.join(buildRoot, UPDATE_MANIFEST_NAME);
  const sourceExecutablePath = path.join(buildRoot, 'TRECS-Portable.exe');
  const buildManifest = await readManifest(sourceManifestPath);
  if (!buildManifest) throw new Error(`Build the portable application first; ${sourceManifestPath} is missing.`);
  if (!(await verifiedFile(sourceExecutablePath, buildManifest))) {
    throw new Error('The local TRECS executable does not match its build manifest. Run npm run build:portable again.');
  }

  await fs.promises.mkdir(serverRoot, { recursive: true });
  const publishedFileName = `TRECS-Portable-${buildManifest.buildId}.exe`;
  const destinationExecutablePath = path.join(serverRoot, publishedFileName);
  const publishedManifest = {
    ...buildManifest,
    fileName: publishedFileName,
    publishedAt: new Date().toISOString()
  };

  if (fs.existsSync(destinationExecutablePath)) {
    if (!(await verifiedFile(destinationExecutablePath, publishedManifest))) {
      throw new Error(`A different or incomplete file already uses this build identifier: ${destinationExecutablePath}`);
    }
  } else {
    const temporaryPath = path.join(serverRoot, `.${publishedFileName}.${crypto.randomUUID()}.part`);
    try {
      await fs.promises.copyFile(sourceExecutablePath, temporaryPath, fs.constants.COPYFILE_EXCL);
      await syncFile(temporaryPath);
      if (!(await verifiedFile(temporaryPath, publishedManifest))) {
        throw new Error('The server copy failed verification. The active update manifest was not changed.');
      }
      await fs.promises.rename(temporaryPath, destinationExecutablePath);
    } finally {
      await fs.promises.unlink(temporaryPath).catch((error) => {
        if (error.code !== 'ENOENT') throw error;
      });
    }
  }

  // Publishing the small manifest last makes the immutable executable visible
  // to lab workstations only after its server copy has been verified.
  const destinationManifestPath = path.join(serverRoot, UPDATE_MANIFEST_NAME);
  await atomicJson(destinationManifestPath, publishedManifest);
  console.log(`Published TRECS ${publishedManifest.version} (${publishedManifest.buildId})`);
  console.log(`Executable: ${destinationExecutablePath}`);
  console.log(`Manifest:   ${destinationManifestPath}`);
}

publish().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
