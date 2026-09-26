const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const test = require('node:test');
const { skipCapture, readSkippedCaptures, collectLateRaw, shouldWarnMissingRaw, captureFileIdentity,
  readCaptureQueue, saveCaptureQueue } = require('../src/main/capture-recovery');
const { derivativeIsFresh, sourceSignature, writeDerivativeSignature } = require('../src/main/image-derivatives');
const mainSource = fs.readFileSync(path.join(__dirname, '../src/main/main.js'), 'utf8');
const rendererSource = fs.readFileSync(path.join(__dirname, '../src/renderer/renderer.js'), 'utf8');
function code(source, name) {
  const match = new RegExp(`^(?:async )?function ${name}\\(`, 'm').exec(source);
  assert.ok(match, `Missing ${name}`);
  const rest = source.slice(match.index);
  const next = rest.slice(1).search(/\n(?:async )?function \w+\(/);
  return next < 0 ? rest : rest.slice(0, next + 1);
}
function context(functions, values, source = rendererSource) {
  const target = vm.createContext({ console, ...values });
  vm.runInContext(functions.map((name) => code(source, name)).join('\n'), target);
  return target;
}
function deferred() { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; }
function element() { return { isConnected: true, hidden: false, innerHTML: '', textContent: '', disabled: false, querySelector: () => ({}) }; }

test('50-photo capture roster transfers exactly previous best and latest previews', async () => {
  const requested = [];
  const target = context(['getCaptureSubjectImages'], {
    numericId: Number, logStartup: () => {},
    queryJobSql: async () => Array.from({ length: 50 }, (_, i) => ({ id: 50 - i, selected: 50 - i === 7, metadataJson: '{}' })),
    getImagePreview: async (_event, _jobId, id) => { requested.push(id); return { dataUrl: `preview-${id}`, path: `${id}.jpg` }; }
  }, mainSource);
  const photos = await target.getCaptureSubjectImages(null, 1, 3);
  assert.deepEqual(requested.sort((a, b) => a - b), [7, 50]);
  assert.equal(photos.filter((photo) => photo.dataUrl).length, 2);
  requested.length = 0;
  await target.getCaptureSubjectImages(null, 1, 3, { metadataOnly: true });
  assert.equal(requested.length, 0);
});

test('new capture appends without rereading earlier images and keeps only two encodings', async () => {
  let reads = 0;
  const jobsState = { selectedJobId: 1, captureSubject: { id: 3 }, captureImages: [
    { id: 5, selected: false, dataUrl: 'old-latest' }, { id: 2, selected: true, dataUrl: 'best' }
  ], detail: { subjects: [{ id: 3 }] } };
  const target = context(['handleCaptureImageImported', 'retainCaptureSlotPreviews'], {
    jobsState, captureEntryStatus: element(), findById: (rows, id) => rows.find((row) => row.id === id),
    imagePreviewForId: () => { reads += 1; throw new Error('Unexpected read'); },
    renderCaptureCompare: () => {}, renderCaptureSubject: () => {}, renderCapturePhotoCount: () => {}, renderCaptureRoster: () => {}, setCapturePairStatus: () => {}
  });
  for (let id = 6; id <= 20; id += 1) {
    await target.handleCaptureImageImported({ image: { jobId: 1, subjectId: 3, id, selected: false, dataUrl: `new-${id}` } });
    assert.equal(jobsState.captureImages.filter((image) => image.dataUrl).length, 2);
  }
  assert.equal(reads, 0);
  assert.equal(jobsState.captureCompareSlotIds.previousId, 2);
  assert.equal(jobsState.captureCompareSlotIds.recentId, 20);
});

test('late student response cannot replace current capture selection', async () => {
  const first = deferred(); const second = deferred();
  const jobsState = { selectedJobId: 1, captureSubject: { id: 1 }, captureImages: [] };
  const target = context(['loadCaptureImages'], { jobsState,
    trecsApi: () => ({ getCaptureSubjectImages: (_job, subject) => subject === 1 ? first.promise : second.promise }),
    renderCaptureCompare: () => {}, retainCaptureSlotPreviews: () => {}, captureCompareGrid: element()
  });
  const oldLoad = target.loadCaptureImages();
  jobsState.captureSubject = { id: 2 };
  const newLoad = target.loadCaptureImages();
  second.resolve([{ id: 22 }]); await newLoad;
  first.resolve([{ id: 11 }]); await oldLoad;
  assert.equal(jobsState.captureImages[0].id, 22);
});

test('lightbox never shows A while the selected action targets B', async () => {
  const first = deferred(); const second = deferred();
  let lightboxFitOptions = null;
  const jobsState = { selectedJobId: 1, selectedSubjectId: 10 };
  const imageLightboxContent = element(); const selectButton = element();
  const target = context(['imagePanelRequest', 'openImageLightbox', 'renderImageLightboxActions'], {
    jobsState, imageLightboxContent, imageLightboxModal: element(), imageLightboxTitle: element(),
    closeImageLightboxButton: element(), previousLightboxImageButton: element(), nextLightboxImageButton: element(), selectLightboxImageButton: selectButton,
    restoreElectronFocus: async () => {}, lightboxImagesForSubject: () => [1, 2], linkedImagesForSubject: () => [],
    imagePreviewForId: (id) => id === 1 ? first.promise : second.promise, escapeHtml: String,
    setLandscapeRotation: (_image, options) => { lightboxFitOptions = options; }
  });
  const loadA = target.openImageLightbox(1);
  const loadB = target.openImageLightbox(2);
  assert.equal(selectButton.disabled, true);
  second.resolve({ filename: 'B', dataUrl: 'B-data' }); await loadB;
  first.resolve({ filename: 'A', dataUrl: 'A-data' }); await loadA;
  assert.match(imageLightboxContent.innerHTML, /B-data/);
  assert.doesNotMatch(imageLightboxContent.innerHTML, /A-data/);
  assert.equal(jobsState.lightboxLoadedImageId, 2);
  assert.equal(selectButton.disabled, false);
  assert.equal(lightboxFitOptions.fitRotatedToFrame, true, 'Rotated camera originals must fit completely inside the lightbox');
});

test('rotated camera original is fitted by its post-rotation dimensions', () => {
  const image = {
    naturalWidth: 6000,
    naturalHeight: 4000,
    parentElement: { clientWidth: 946, clientHeight: 528 },
    style: {}
  };
  const target = context(['fitRotatedImageToFrame'], {});
  target.fitRotatedImageToFrame(image);
  assert.equal(image.style.width, '508px');
  // After a 90-degree rotation, the visual box is 339 x 508, so neither
  // dimension exceeds the available 926 x 508 lightbox area.
  assert.ok(508 / (image.naturalWidth / image.naturalHeight) <= 926);
});

test('failed image requests are evicted and retried successfully', async () => {
  let requests = 0;
  const jobsState = { selectedJobId: 1, imagePreviewCache: new Map() };
  const target = context(['imagePreviewForId'], { jobsState, trecsApi: () => ({ getImagePreview: async () => {
    requests += 1; if (requests === 1) throw new Error('temporary share outage'); return { dataUrl: 'good' };
  } }) });
  await assert.rejects(target.imagePreviewForId(1));
  assert.equal(jobsState.imagePreviewCache.size, 0);
  assert.equal((await target.imagePreviewForId(1)).dataUrl, 'good');
  assert.equal(requests, 2);
});

test('RAW warning respects stabilization, retry cooldown, and JPG-only mode', () => {
  const pending = { sourcePath: 'a.jpg', fileMode: 'jpg_raw', queuedAt: 1000 };
  assert.equal(shouldWarnMissingRaw(pending, {}, 5000, () => true), false);
  assert.equal(shouldWarnMissingRaw(pending, {}, 12000, () => false), false);
  assert.equal(shouldWarnMissingRaw(pending, {}, 12000, () => true), true);
  assert.equal(shouldWarnMissingRaw({ ...pending, nextRawWarningAt: 30000 }, {}, 12000, () => true), false);
  assert.equal(shouldWarnMissingRaw({ ...pending, fileMode: 'jpg_only' }, {}, 12000, () => true), false);
  assert.equal(shouldWarnMissingRaw(pending, { rawPath: 'a.cr3' }, 12000, () => true), false);
});

test('skip preserves JPG + ownership across restart and associates late RAW', () => {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'trecs-skip-test-'));
  try {
    const sourcePath = path.join(folder, 'IMG0001.JPG');
    fs.writeFileSync(sourcePath, 'original jpg');
    skipCapture({ sourcePath, subjectId: 13, jobId: 7, photographerName: 'Photographer A' }, folder);
    const records = readSkippedCaptures(folder);
    assert.equal(records.length, 1);
    assert.equal(records[0].subjectId, 13);
    assert.equal(fs.readFileSync(records[0].jpgPath, 'utf8'), 'original jpg');
    assert.equal(fs.existsSync(sourcePath), false);
    const rawPath = path.join(folder, 'IMG0001.CR3'); fs.writeFileSync(rawPath, 'original raw');
    assert.equal(collectLateRaw(records[0], () => rawPath, () => true), true);
    assert.equal(fs.readFileSync(records[0].rawPath, 'utf8'), 'original raw');
    assert.equal(readSkippedCaptures(folder)[0].subjectId, 13);
  } finally { fs.rmSync(folder, { recursive: true, force: true }); }
});

test('derivative signature detects content changes even with preserved source mtime', async () => {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'trecs-derivative-test-'));
  try {
    const source = path.join(folder, 'large.jpg'); const destination = path.join(folder, 'med.jpg');
    fs.writeFileSync(source, 'source'); fs.writeFileSync(destination, 'preview');
    await writeDerivativeSignature(destination, await sourceSignature(source));
    assert.equal(await derivativeIsFresh(source, destination), true);
    const modified = fs.statSync(source).mtime;
    fs.writeFileSync(source, 'changed source with same mtime'); fs.utimesSync(source, modified, modified);
    assert.equal(await derivativeIsFresh(source, destination), false);
  } finally { fs.rmSync(folder, { recursive: true, force: true }); }
});

test('queue restart preserves original job and student; reused camera filename is not reclaimed', () => {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'trecs-queue-test-'));
  try {
    const sourcePath = path.join(folder, 'IMG0001.JPG');
    fs.writeFileSync(sourcePath, 'camera upload');
    saveCaptureQueue(folder, [{ sourcePath, sourceIdentity: captureFileIdentity(sourcePath), jobId: 7, subjectId: 13 }]);
    const restarted = readCaptureQueue(folder);
    assert.equal(restarted[0].jobId, 7); assert.equal(restarted[0].subjectId, 13);
    // A later session may display job8/student14. Disk ownership still records
    // the exact original association until this image is handled.
    assert.notEqual(restarted[0].jobId, 8); assert.notEqual(restarted[0].subjectId, 14);
    fs.renameSync(sourcePath, path.join(folder, 'old-image.jpg'));
    fs.writeFileSync(sourcePath, 'new shot');
    assert.equal(readCaptureQueue(folder).length, 0);
  } finally { fs.rmSync(folder, { recursive: true, force: true }); }
});

test('stop waits for the capture journal before exposing a completed shoot to EOD', async () => {
  const processing = deferred();
  const captureWatchers = new Map([[1, { timer: null, watcher: { close() {} }, importing: true, processingPromise: processing.promise }]]);
  const target = context(['closeCaptureWatcher', 'stopCaptureWatcher'], { captureWatchers, clearTimeout() {} }, mainSource);
  let stopped = false;
  const stopping = target.stopCaptureWatcher({ sender: { id: 1 } }).then(() => { stopped = true; });
  await Promise.resolve();
  assert.equal(stopped, false);
  assert.equal(captureWatchers.get(1).closed, true);
  processing.resolve(); await stopping;
  assert.equal(stopped, true);
  assert.equal(captureWatchers.size, 0);
});

test('photographer can skip missing RAW once and next pair keeps the new student assignment', async () => {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'trecs-raw-queue-test-'));
  const recovery = require('../src/main/capture-recovery');
  const timers = []; const captureWatchers = new Map(); const imported = []; let warnings = 0; let watchListener;
  const makeStable = (name) => { const file = path.join(folder, name); fs.writeFileSync(file, name); const time = new Date(Date.now() - 20000); fs.utimesSync(file, time, time); return file; };
  try {
    const missing = makeStable('first.jpg');
    const target = context(['rawPairPathForImage', 'fileIsStable', 'capturePairForImage', 'captureImagesInFolder', 'closeCaptureWatcher', 'startCaptureWatcher', 'stopCaptureWatcher'], {
      ...recovery, captureWatchers, captureHotFolder: folder, projectRoot: folder, path,
      fs: { ...fs, watch: (_folder, listener) => { watchListener = listener; return { close() {} }; } },
      numericId: Number, normalizeCaptureFileMode: (value) => value || 'jpg_raw', normalizeShootStage: (value) => value || 'main', shootStageLabel: String, optionalText: (value) => value || '',
      writeImageJobSql: async (_job, callback) => callback({}), getOrCreateCaptureSession: () => 1, pendingCommittedCaptureSources: async () => [],
      BrowserWindow: { fromWebContents: () => null }, dialog: { showMessageBox: async () => { warnings += 1; return { response: 1 }; } },
      setTimeout: (callback) => { const timer = { callback }; timers.push(timer); return timer; }, clearTimeout: (timer) => { if (timer) timer.canceled = true; },
      logStartup() {},
      importCaptureImageCore: async (jobId, subjectId, _hot, jpg, raw) => {
        imported.push({ jobId, subjectId }); fs.unlinkSync(jpg); fs.unlinkSync(raw);
        return { image: { jobId, subjectId, filename: 'second.jpg' } };
      }
    }, mainSource);
    const event = { sender: { id: 1, send() {}, once() {}, isDestroyed: () => false } };
    await target.startCaptureWatcher(event, 7, 100, { fileMode: 'jpg_raw' });
    const timerCount = timers.length;
    watchListener('rename', '.capture-queue.json');
    watchListener('change', '.capture-queue.json.new.tmp');
    assert.equal(timers.length, timerCount, 'Queue journal events must not delay pending camera imports');
    const state = captureWatchers.get(1);
    state.pendingCaptures[0].queuedAt = Date.now() - 11000;
    await target.startCaptureWatcher(event, 7, 200, { fileMode: 'jpg_raw' });
    makeStable('second.jpg'); makeStable('second.cr3'); state.queueAvailableFiles();
    const step = async () => {
      let timer; do { timer = timers.shift(); } while (timer?.canceled);
      assert.ok(timer, 'A queue processing turn is scheduled'); timer.callback(); await state.processingPromise;
    };
    await step(); await step();
    assert.equal(warnings, 1);
    assert.deepEqual(imported, [{ jobId: 7, subjectId: 200 }]);
    assert.equal(readSkippedCaptures(folder)[0].subjectId, 100);
    assert.equal(fs.existsSync(missing), false);
    makeStable('first.cr3'); state.queueAvailableFiles();
    assert.equal(readSkippedCaptures(folder)[0].state, 'paired');
    assert.equal(readSkippedCaptures(folder)[0].subjectId, 100);
    await target.stopCaptureWatcher(event);
  } finally { fs.rmSync(folder, { recursive: true, force: true }); }
});
