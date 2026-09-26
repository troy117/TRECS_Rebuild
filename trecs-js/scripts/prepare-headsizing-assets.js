// Build-time only. No download code is used by the running calibration tool.
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const zlib = require('node:zlib');
const { verifyAssets, defaultAssetRoot, noticeRoot, sha256, lock } = require('../src/main/headsizing-assets');
const upstream = require('../src/shared/headsizing/upstream-models.json').face;

function extractPinnedFiles(archive) {
  const integrity = 'sha512-' + crypto.createHash('sha512').update(archive).digest('base64');
  if (integrity !== upstream.library.integrity) throw new Error('MediaPipe archive integrity mismatch');
  const tar = zlib.gunzipSync(archive, { maxOutputLength: 128 * 1024 * 1024 });
  const result = new Map();
  for (let offset = 0; offset + 512 <= tar.length;) {
    const header = tar.subarray(offset, offset + 512);
    if (header.every(byte => byte === 0)) break;
    const name = header.subarray(0, 100).toString().split('\0')[0];
    const size = parseInt(header.subarray(124, 136).toString().replace(/\0/g, '').trim(), 8);
    if (!Number.isSafeInteger(size) || size < 0 || offset + 512 + size > tar.length) throw new Error('Malformed pinned archive');
    const relative = name.startsWith('package/') ? name.slice(8) : '';
    if (Object.hasOwn(lock.files, relative) && relative !== 'face_landmarker.task') {
      if (![0, 48].includes(header[156]) || result.has(relative)) throw new Error('Unexpected pinned archive entry');
      const bytes = tar.subarray(offset + 512, offset + 512 + size);
      if (sha256(bytes) !== lock.files[relative]) throw new Error(`Pinned file mismatch: ${relative}`);
      result.set(relative, bytes);
    }
    offset += 512 + Math.ceil(size / 512) * 512;
  }
  if (result.size !== Object.keys(lock.files).length - 1) throw new Error('Pinned archive is incomplete');
  return result;
}
async function fetchBytes(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(120000) });
  if (!response.ok) throw new Error(`Asset download failed: HTTP ${response.status}`);
  const reader = response.body.getReader(), chunks = []; let total = 0;
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    total += value.length;
    if (total > 64 * 1024 * 1024) { await reader.cancel(); throw new Error('Asset download exceeds size limit'); }
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks);
}
async function main(args = process.argv.slice(2)) {
  if (args.length && !(args.length === 4 && args[0] === '--archive' && args[2] === '--model')) throw new Error('Usage: prepare-headsizing-assets.js [--archive pinned.tgz --model face_landmarker.task]');
  try { await fs.access(defaultAssetRoot); console.log('Existing assets verified:', await verifyAssets()); return; }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const archive = args.length ? await fs.readFile(args[1]) : await fetchBytes(upstream.library.tarball);
  const files = extractPinnedFiles(archive);
  const model = args.length ? await fs.readFile(args[3]) : await fetchBytes(upstream.models[0].url);
  if (sha256(model) !== lock.files['face_landmarker.task']) throw new Error('Face model checksum mismatch');
  files.set('face_landmarker.task', model);
  await fs.mkdir(path.dirname(defaultAssetRoot), { recursive: true });
  const stage = await fs.mkdtemp(path.join(path.dirname(defaultAssetRoot), '.headsizing-stage-'));
  for (const [name, bytes] of files) {
    const destination = path.join(stage, name);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.writeFile(destination, bytes, { flag: 'wx' });
  }
  for (const name of ['Apache-2.0.txt', 'THIRD_PARTY_NOTICES.md']) await fs.copyFile(path.join(noticeRoot, name), path.join(stage, name));
  await verifyAssets(stage);
  await fs.rename(stage, defaultAssetRoot);
  console.log(`Verified offline MediaPipe ${lock.libraryVersion} assets: ${defaultAssetRoot}`);
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { extractPinnedFiles, main };
