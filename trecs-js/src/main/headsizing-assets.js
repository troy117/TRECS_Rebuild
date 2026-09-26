const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const lock = require('../shared/headsizing/asset-lock.json');
const defaultAssetRoot = path.resolve(__dirname, '../../assets/headsizing');
const noticeRoot = path.resolve(__dirname, '../../licenses/headsizing');
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

async function verifyAssets(root = defaultAssetRoot) {
  for (const [name, expected] of Object.entries(lock.files)) {
    let bytes;
    try { bytes = await fs.readFile(path.join(root, name)); }
    catch { throw new Error(`Headsizing asset missing: ${name}. Run npm run prepare:headsizing on a development machine and rebuild/copy the verified assets.`); }
    if (sha256(bytes) !== expected) throw new Error(`Headsizing asset checksum failed: ${name}. Restore the pinned assets; automatic processing is disabled.`);
  }
  for (const name of ['Apache-2.0.txt', 'THIRD_PARTY_NOTICES.md']) {
    const expected = await fs.readFile(path.join(noticeRoot, name));
    const actual = await fs.readFile(path.join(root, name));
    if (sha256(actual) !== sha256(expected)) throw new Error(`Headsizing notice missing or changed: ${name}`);
  }
  return { libraryVersion: lock.libraryVersion, modelSha256: lock.files['face_landmarker.task'], files: Object.keys(lock.files).length };
}
module.exports = { verifyAssets, defaultAssetRoot, noticeRoot, sha256, lock };
