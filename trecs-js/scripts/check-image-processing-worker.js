const { app, BrowserWindow, ipcMain, nativeImage } = require('electron');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { createImageProcessor } = require('../src/main/image-processing');
const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'trecs-image-worker-test-'));
app.setPath('userData', path.join(folder, 'user-data'));
app.disableHardwareAcceleration();
app.whenReady().then(async () => {
  const processor = createImageProcessor({ BrowserWindow, ipcMain, maxCacheBytes: 1024 * 1024 });
  try {
    const source = path.join(folder, 'camera.jpg');
    // Camera-sized noisy input exercises actual decoding, not tiny placeholders.
    const pixels = crypto.randomBytes(6000 * 4000 * 4);
    const image = nativeImage.createFromBitmap(pixels, { width: 6000, height: 4000 });
    fs.writeFileSync(source, image.toJPEG(94));
    let ticks = 0; const interval = setInterval(() => { ticks += 1; }, 5);
    const first = await processor.preview(source);
    clearInterval(interval);
    assert.equal(first.width, 1440); assert.equal(first.height, 960);
    assert.ok(ticks > 0, 'Main event loop must remain responsive while decoding');
    const thumbnail = await processor.preview(source, 'thumbnail');
    assert.equal(thumbnail.width, 320); assert.ok(thumbnail.dataUrl.length < first.dataUrl.length);
    const resized = await processor.resize(source, 140, 175, { fit: 'contain' });
    const schoolImage = nativeImage.createFromBuffer(Buffer.from(resized.bytes));
    assert.deepEqual(schoolImage.getSize(), { width: 140, height: 175 });
    const bitmap = schoolImage.toBitmap();
    assert.ok(bitmap[0] > 245 && bitmap[1] > 245 && bitmap[2] > 245, 'Contain preserves geometry and pads with white');
    fs.writeFileSync(source, nativeImage.createFromBitmap(Buffer.alloc(800 * 1200 * 4, 255), { width: 800, height: 1200 }).toJPEG(94));
    const changed = await processor.preview(source);
    assert.equal(changed.width, 800); assert.equal(changed.height, 1200);
    assert.notEqual(changed.version, first.version);
    console.log(JSON.stringify({ passed: true, sourceDimensions: '6000x4000', sourceBytes: image.toJPEG(94).length, display: '1440x960', thumbnail: thumbnail.width, contain: schoolImage.getSize(), mainLoopTicks: ticks }));
  } finally {
    processor.close();
  }
}).then(() => app.exit(0)).catch((error) => { console.error(error); app.exit(1); });
// Chromium still owns its temporary profile while quitting on Windows. Leave
// this isolated OS-temp profile for normal cleanup after the process exits.
