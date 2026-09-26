const { app, BrowserWindow, ipcMain, session, nativeImage } = require('electron');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const { pathToFileURL } = require('node:url');
const appRoot = process.env.TRECS_CHECK_RESOURCES ? path.join(process.env.TRECS_CHECK_RESOURCES,'app') : path.resolve(__dirname,'..');
const { createHeadsizingWorker } = require(path.join(appRoot,'src/main/headsizing-worker'));
const { defaultAssetRoot, sha256 } = require(path.join(appRoot,'src/main/headsizing-assets'));
const assetRoot = process.env.TRECS_CHECK_RESOURCES ? path.join(process.env.TRECS_CHECK_RESOURCES,'headsizing') : defaultAssetRoot;
app.setPath('userData', require('node:fs').mkdtempSync(path.join(os.tmpdir(), 'trecs-headsizing-worker-')));
app.on('window-all-closed', () => {}); // Crash/restart must not end the harness early.
const watchdog = setTimeout(() => { console.error('Worker test exceeded 150 seconds'); app.exit(1); }, 150000);
app.whenReady().then(async () => {
  const { calibrationFromText } = await import(pathToFileURL(path.join(appRoot,'src/shared/headsizing/geometry.mjs')).href);
  const calibration = { id: 'fall-2026', revision: 1, values: calibrationFromText(await fs.readFile(path.join(appRoot, 'src/shared/headsizing/calibrations/fall-2026.txt'), 'utf8')) };
  const worker = createHeadsizingWorker({ BrowserWindow, ipcMain, session, assetRoot });
  try {
    let ticks = 0; const timer = setInterval(() => ticks++, 10);
    const start = performance.now();
    assert.deepEqual(await worker.start(), { delegate: 'cpu' });
    const initMs = performance.now() - start;
    const bytes = nativeImage.createFromBitmap(Buffer.alloc(800 * 1000 * 4, 255), { width: 800, height: 1000 }).toJPEG(90);
    const input = { bytes, sha256: sha256(bytes), calibration, captureId: 'blank-test', inferenceMaxDimension: 960, previewMaxDimension: 600 };
    const blank = await worker.process(input);
    assert.equal(blank.outcome, 'review'); assert.equal(blank.reason, 'no-face');
    assert.equal(blank.orientationAttempts, 4); assert.ok(blank.buffers.original.length > 0);
    const broken = await worker.process({ ...input, bytes: Buffer.from('not a JPEG') });
    assert.equal(broken.outcome, 'failed');
    // Independent corner-color oracle verifies browser EXIF decoding, including mirrors.
    const colors = [[0,0,255,255],[0,255,0,255],[255,0,0,255],[0,255,255,255]];
    const pixels = Buffer.alloc(64 * 96 * 4);
    for (let y=0;y<96;y++) for (let x=0;x<64;x++) pixels.set(colors[y<48 ? (x<32 ? 0 : 1) : (x<32 ? 3 : 2)],(y*64+x)*4);
    const colorJpg = nativeImage.createFromBitmap(pixels,{width:64,height:96}).toJPEG(100);
    const maps = [[0,1,2,3],[1,0,3,2],[2,3,0,1],[3,2,1,0],[0,3,2,1],[3,0,1,2],[2,1,0,3],[1,2,3,0]];
    for (let orientation=1;orientation<=8;orientation++) {
      const exif = Buffer.alloc(36); exif.writeUInt16BE(0xffe1);exif.writeUInt16BE(34,2);exif.write('Exif\0\0',4,'binary');
      exif.write('II',10);exif.writeUInt16LE(42,12);exif.writeUInt32LE(8,14);exif.writeUInt16LE(1,18);
      exif.writeUInt16LE(0x112,20);exif.writeUInt16LE(3,22);exif.writeUInt32LE(1,24);exif.writeUInt16LE(orientation,28);
      const photo = Buffer.concat([colorJpg.subarray(0,2),exif,colorJpg.subarray(2)]);
      const result = await worker.process({...input,bytes:photo,sha256:sha256(photo)});
      assert.equal(result.reason,'no-face');
      const preview = nativeImage.createFromBuffer(Buffer.from(result.buffers.original)), size = preview.getSize(), data = preview.toBitmap();
      assert.deepEqual(size,orientation>=5 ? {width:96,height:64} : {width:64,height:96});
      const corners = [[8,8],[size.width-9,8],[size.width-9,size.height-9],[8,size.height-9]];
      const actual = corners.map(([x,y]) => {
        const sample = data.subarray((y*size.width+x)*4,(y*size.width+x)*4+3);
        const distances = colors.map(color => color.slice(0,3).reduce((sum,c,i)=>sum+(c-sample[i])**2,0));
        return distances.indexOf(Math.min(...distances));
      });
      assert.deepEqual(actual,maps[orientation-1],`EXIF ${orientation} corner placement`);
    }
    let portrait = null;
    if (process.argv[2]) {
      const photo = await fs.readFile(process.argv[2]);
      const result = await worker.process({ ...input, bytes: photo, sha256: sha256(photo), captureId: 'private-fixture' });
      assert.ok(result.recipe, result.warnings.join('; '));
      assert.ok(result.buffers.clean.length > 0); assert.ok(result.buffers.guide.length > 0);
      assert.equal(result.recipe.productionReady, false);
      const single = nativeImage.createFromBuffer(Buffer.from(result.buffers.clean)), size = single.getSize(), one = single.toBitmap();
      const pair = Buffer.alloc(one.length * 2);
      for (let y=0;y<size.height;y++) for(let copy=0;copy<2;copy++) one.copy(pair,(y*size.width*2+copy*size.width)*4,y*size.width*4,(y+1)*size.width*4);
      const two = nativeImage.createFromBitmap(pair,{width:size.width*2,height:size.height}).toJPEG(90);
      const ambiguous = await worker.process({...input,bytes:two,sha256:sha256(two)});
      assert.equal(ambiguous.reason,'multiple-faces');assert.equal(ambiguous.recipe,null);
      portrait = { outcome: result.outcome, orientationAttempts: result.orientationAttempts, stageMs: result.stageMs };
    }
    const busy = worker.process(input);
    await assert.rejects(()=>worker.process(input),/busy/); await busy;
    const crashing = worker.process(input);
    const rejected = assert.rejects(crashing,/crashed|stopped/);
    BrowserWindow.getAllWindows().find(window=>window.webContents.getOSProcessId()===worker.getPid()).webContents.forcefullyCrashRenderer();
    await rejected; assert.equal(worker.getPid(),null);
    const restarted = createHeadsizingWorker({ BrowserWindow, ipcMain, session, assetRoot });
    await restarted.start();
    const cancelled = restarted.process(input), cancelledAssertion = assert.rejects(cancelled,/stopped/);
    restarted.close(); await cancelledAssertion;
    clearInterval(timer); assert.ok(ticks > 5, 'Main process remained responsive');
    console.log(JSON.stringify({ passed: true, electron: process.versions.electron, initMs, mainTicks: ticks, blank: blank.reason, exifCases:8, crashRestartAndCancel:true, portrait }));
  } finally { worker.close(); }
}).then(() => { clearTimeout(watchdog); app.exit(0); }).catch(error => { console.error(error); app.exit(1); });
