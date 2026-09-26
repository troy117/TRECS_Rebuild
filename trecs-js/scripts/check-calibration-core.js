const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const { scanFolder, validateOptions, within, CalibrationRunner, workerCpuPercent } = require('../src/main/calibration-runner');
const { verifyAssets } = require('../src/main/headsizing-assets');
const { extractPinnedFiles } = require('./prepare-headsizing-assets');
async function temporary(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'trecs-calibration-core-'));
  t.after(async () => {
    const resolved = path.resolve(root);
    if (path.dirname(resolved) !== path.resolve(os.tmpdir()) || !path.basename(resolved).startsWith('trecs-calibration-core-')) throw new Error('Unsafe cleanup');
    await fs.rm(resolved, { recursive: true, force: true });
  });
  return root;
}
test('folder scan has deterministic order, explicit recursion, and cache exclusion', async t => {
  const root = await temporary(t), input = path.join(root, 'input'), cache = path.join(root, 'cache');
  await fs.mkdir(path.join(input, 'child'), { recursive: true });
  for (const name of ['B.JPG','A.jpeg','not.png','child/C.jpg']) await fs.writeFile(path.join(input, name), 'fixture');
  assert.deepEqual((await scanFolder(input, false, cache)).files.map(file => file.name), ['A.jpeg','B.JPG']);
  assert.equal((await scanFolder(input, true, cache)).files.length, 3);
  await assert.rejects(() => scanFolder(root, true, cache), /separate/);
  assert.equal(within(input, path.join(root, 'input-other', 'test.jpg')), false);
  assert.equal(within(input, path.join(input, 'child', 'test.jpg')), true);
});
test('bad assets and archive cannot load or extract, without changing an existing cache', async t => {
  const root = await temporary(t);
  await assert.rejects(() => verifyAssets(root), /missing/);
  await fs.writeFile(path.join(root, 'vision_bundle.mjs'), 'corrupt');
  await assert.rejects(() => verifyAssets(root), /checksum/);
  assert.throws(() => extractPinnedFiles(Buffer.from('untrusted archive')), /integrity/);
  assert.equal(await fs.readFile(path.join(root, 'vision_bundle.mjs'), 'utf8'), 'corrupt');
});
test('only supported inference sizes and bounded paced settings are allowed', () => {
  assert.equal(validateOptions({}).inferenceMaxDimension, 1920);
  for (const value of [{ inferenceMaxDimension: 5000 }, { previewMaxDimension: 0 }, { mode: 'cloud' }, { burstSize: 100 },
    { targetPhotosPerMinute: NaN }, { targetPhotosPerMinute: 0 }, { storageClass: 'arbitrary' }]) assert.throws(() => validateOptions(value));
});
test('burst scheduling does not confuse wall time with sum of per-image service time', () => {
  const runner = new CalibrationRunner({ root: os.tmpdir() });
  const run = { readyAt: 1000, options: { mode: 'capture-rate', burstSize: 3, targetPhotosPerMinute: 30 } };
  assert.equal(runner.queueDepth({ ...run, readyAt:null, files:Array(20) }),0,'Future paced images are not yet queued');
  assert.equal(runner.releaseTime(run, 0), 1000); assert.equal(runner.releaseTime(run, 2), 1000);
  assert.equal(runner.releaseTime(run, 3), 7000); assert.equal(runner.releaseTime(run, 6), 13000);
  run.options.mode = 'folder'; assert.equal(runner.releaseTime(run, 6), 1000);
});
test('worker CPU handles Electron 31 normalization, first samples, restart and cumulative counter reset', () => {
  const worker = { pid: 1, creationTime: 10, cpu: { percentCPUUsage: 12.5 } };
  const previous = { pid: 1, creationTime: 10, at: 1000, cpu: 2 };
  assert.equal(workerCpuPercent(worker, null, 2000, 8), null);
  assert.equal(workerCpuPercent(worker, previous, 2000, 8), 100);
  assert.equal(workerCpuPercent({ ...worker, creationTime: 20 }, previous, 2000, 8), null);
  worker.cpu.cumulativeCPUUsage = 4;
  assert.equal(workerCpuPercent(worker, previous, 2000, 8), 200);
  worker.cpu.cumulativeCPUUsage = 1;
  assert.equal(workerCpuPercent(worker, previous, 2000, 8), null);
  assert.equal(workerCpuPercent({ ...worker, cpu: {} }, previous, 2000, 8), null);
});
test('calibration validation rejects bad input and result APIs reject path traversal', async t => {
  const root = await temporary(t), runner = new CalibrationRunner({ root });
  const file = path.join(root, 'bad.txt'); await fs.writeFile(file, 'aspectWidth=0');
  await assert.rejects(() => runner.loadCalibration(file));
  assert.throws(() => runner.runFolder('../private'), /Invalid/);
  await assert.rejects(() => runner.preview('x', 1, '../private'), /Invalid/);
  await assert.rejects(() => runner.start({}), /Load a calibration/);
});
test('JPEG parser reads stored dimensions, all orientation tags, and rejects truncated metadata', async () => {
  const { readJpegMetadata } = await import('../src/shared/headsizing/jpeg-metadata.mjs');
  function jpeg(orientation) {
    const exif = Buffer.alloc(36); exif.writeUInt16BE(0xffe1); exif.writeUInt16BE(34,2); exif.write('Exif\0\0',4,'binary');
    exif.write('II',10); exif.writeUInt16LE(42,12); exif.writeUInt32LE(8,14); exif.writeUInt16LE(1,18);
    exif.writeUInt16LE(0x112,20); exif.writeUInt16LE(3,22); exif.writeUInt32LE(1,24); exif.writeUInt16LE(orientation,28);
    const sof = Buffer.from([255,192,0,8,8,3,232,3,32,0]); // 800 x 1000
    return Buffer.concat([Buffer.from([255,216]),exif,sof,Buffer.from([255,217])]);
  }
  for(let orientation=1;orientation<=8;orientation++) assert.deepEqual(readJpegMetadata(jpeg(orientation)), { width:800,height:1000,exifOrientation:orientation,hasOrientation:true });
  assert.throws(()=>readJpegMetadata(jpeg(9)), /orientation/);
  assert.throws(()=>readJpegMetadata(jpeg(1).subarray(0,20)), /Truncated/);
  assert.throws(()=>readJpegMetadata(Buffer.from('no image')), /JPEG/);
});
