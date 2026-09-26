const electron = require('electron');
const { app, BrowserWindow, nativeImage } = electron;
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const { createCalibrationService } = require('../src/main/calibration-service');
const { sha256, defaultAssetRoot } = require('../src/main/headsizing-assets');
const root = require('node:fs').mkdtempSync(path.join(os.tmpdir(), 'trecs-calibration-ui-'));
app.setPath('userData', path.join(root, 'user-data'));
const watchdog = setTimeout(() => { console.error('Calibration UI check timed out'); app.exit(1); }, 180000);
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function waitFor(predicate, label, timeout = 30000) {
  const until = Date.now() + timeout;
  while (!(await predicate())) { if (Date.now() > until) throw new Error(`Timed out: ${label}`); await delay(50); }
}
app.whenReady().then(async () => {
  const input = path.join(root, 'input'), output = path.join(root, 'exports');
  await fs.mkdir(input); await fs.mkdir(output);
  const blank = nativeImage.createFromBitmap(Buffer.alloc(800 * 1000 * 4, 255), { width: 800, height: 1000 }).toJPEG(90);
  await fs.writeFile(path.join(input, '01-private-name.jpg'), blank);
  await fs.writeFile(path.join(input, '03-private-broken.jpg'), 'broken JPG');
  if (process.argv[2]) await fs.copyFile(process.argv[2], path.join(input, '02-private-portrait.jpg'));
  const originalHashes = await Promise.all((await fs.readdir(input)).map(async name => [name, sha256(await fs.readFile(path.join(input, name)))]));
  const calibrationPath = path.join(__dirname, '../src/shared/headsizing/calibrations/fall-2026.txt');
  const fakeDialog = { showOpenDialog: async (_window, options) => ({ canceled: false, filePaths: [options.title.startsWith('Export') ? output : options.properties.includes('openDirectory') ? input : calibrationPath] }) };
  const service = createCalibrationService({ ...electron, dialog: fakeDialog }, { root: path.join(root, 'runs'), assetRoot: defaultAssetRoot });
  const window = new BrowserWindow({ show: false, width: 1280, height: 1050, webPreferences: {
    preload: path.join(__dirname, '../src/preload/calibration-bridge.js'), contextIsolation: true, nodeIntegration: false, backgroundThrottling: false, offscreen: true
  } });
  service.attach(window);
  const errors = [];
  window.webContents.on('console-message', (_event, level, message) => { if (level >= 3) errors.push(message); });
  await window.loadFile(path.join(__dirname, '../src/renderer/calibration-only.html'));
  const js = script => window.webContents.executeJavaScript(script);
  await waitFor(() => js(`document.getElementById('ccStatus').textContent.includes('Offline model verified')`), 'offline assets');
  await js(`document.getElementById('ccCalibration').click()`);
  await waitFor(() => js(`document.getElementById('ccCalibrationValues').textContent.includes('Fall 2026')`), 'calibration loaded');
  await js(`document.getElementById('ccFolder').click()`);
  await waitFor(() => js(`!document.getElementById('ccStart').disabled`), 'input ready');
  await js(`document.getElementById('ccStart').click()`);
  await waitFor(() => service.runner.active, 'run started');
  await service.runner.active.done;
  await waitFor(() => js(`document.getElementById('ccStatus').textContent.startsWith('complete')`), 'run completed');
  const runs = await service.runner.listRuns(), first = runs[0];
  assert.equal(first.status, 'complete', JSON.stringify(first));
  assert.equal(first.summary.counts.review, 1); assert.equal(first.summary.counts.failed, 1);
  if (process.argv[2]) assert.equal(first.summary.counts.ok, 1);
  const stored = JSON.parse(await fs.readFile(path.join(root, 'runs', first.id, 'report.json'), 'utf8'));
  assert.equal(stored.configuration.actualDelegate, 'cpu'); assert.ok(stored.configuration.datasetSha256);
  assert.ok(stored.summary.resources.workerWorkingSetBytes.max > 0);
  assert.ok(stored.summary.resources.workerCpuPercentOneCore.max > 0, 'Worker CPU is measured on the pinned Electron runtime');
  assert.doesNotMatch(JSON.stringify(stored), /private-name|private-portrait|private-broken|inputRoot|faceLandmarks/);
  if (process.argv[2]) {
    await js(`document.getElementById('ccNext').click()`);
    await waitFor(() => js(`document.getElementById('ccCrop').naturalWidth > 0`), 'portrait crop preview');
    await js(`document.getElementById('ccGuides').click()`);
    await js(`document.getElementById('ccApprove').click()`);
    await waitFor(async () => (await service.runner.items(first.id)).rows[1].humanReview === 'approved', 'manual review');
  }
  await js(`document.getElementById('ccExport').click()`);
  await waitFor(() => js(`document.getElementById('ccStatus').textContent.startsWith('Export saved:')`), 'report exported');
  const exported = path.join(output, (await fs.readdir(output))[0]);
  assert.ok((await fs.readdir(exported)).includes('resources.csv'));
  assert.ok((await fs.readdir(exported)).includes('export-complete.json'));
  assert.ok(!(await fs.readdir(exported)).includes('private-previews'));
  await assert.rejects(() => service.runner.exportReport(first.id, input), /outside/);
  await assert.rejects(() => service.runner.preview(first.id, 1, '../run.json'), /Invalid/);
  const screenDir = path.resolve(__dirname, '../../exports/calibration-ui-check');
  await fs.mkdir(screenDir, { recursive: true });
  await delay(300);
  // Test-only screenshot stays in ignored exports; may include the explicitly supplied private fixture.
  await fs.writeFile(path.join(screenDir, 'calibration-screen.png'), (await window.webContents.capturePage()).toPNG());
  const restarted = await service.runner.start({ mode: 'capture-rate', targetPhotosPerMinute: 1, burstSize: 1 });
  await waitFor(() => service.runner.active?.completed >= 1, 'paced first photo');
  const done = service.runner.active.done; service.runner.cancel(); await done;
  const cancelled = (await service.runner.listRuns()).find(run => run.id === restarted.id);
  assert.equal(cancelled.status, 'cancelled'); assert.ok(cancelled.summary.counts.pending > 0);
  const reportPath = path.join(root, 'runs', restarted.id, 'report.json');
  await fs.rename(reportPath, reportPath + '.held-for-recovery-test');
  assert.ok((await service.runner.recover(restarted.id)).counts.pending > 0);
  for (const [name, hash] of originalHashes) assert.equal(sha256(await fs.readFile(path.join(input, name))), hash, 'Original unchanged');
  // Use the regular TRECS shell/preload too, with only unrelated job APIs stubbed.
  for (const [channel, value] of Object.entries({
    'dashboard:get': { counts: [], jobs: [], migration: [], databasePath: 'isolated-test' },
    'app:system-info': { captureStationMode: true, captureHotFolder: '' },
    'jobs:list': { jobs: [], types: [], clients: [], packagePlans: [], idCardTemplates: [] },
    'settings:student-fields:get': { global: { visibleFields: {} }, jobTypes: {} },
    'menu:set-context': {}, 'app:focus-window': true
  })) electron.ipcMain.handle(channel, () => value);
  const shellWindow = new BrowserWindow({ show:false, webPreferences:{
    preload:path.join(__dirname,'../src/preload/preload.js'),contextIsolation:true,nodeIntegration:false
  } });
  service.attach(shellWindow);
  shellWindow.webContents.on('console-message',(_event,level,message)=>{if(level>=3)errors.push(message);});
  await shellWindow.loadFile(path.join(__dirname,'../src/renderer/index.html'));
  const shellJs = source=>shellWindow.webContents.executeJavaScript(source);
  await waitFor(()=>shellJs(`captureStationMode === true`),'capture station navigation');
  assert.equal(await shellJs(`document.querySelector('[data-view-button="cropCalibration"]').hidden`),false);
  await shellJs(`document.querySelector('[data-view-button="cropCalibration"]').click()`);
  await waitFor(()=>shellJs(`document.getElementById('ccStatus').textContent.includes('Offline model verified')`),'regular TRECS calibration');
  assert.equal(await shellJs(`document.getElementById('cropCalibrationView').classList.contains('active-view')`),true);
  assert.equal(await shellJs(`typeof window.cropCalibration.start`),'function');
  shellWindow.destroy();
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ passed: true, electron: process.versions.electron, folderImages: first.total,
    counts: first.summary.counts, workerPeakMB: first.summary.resources.workerWorkingSetBytes.max / 1048576,
    cancelAndRecovery: true, originalsUnchanged: true, regularTrecsSidebar:true, screenshot: path.join(screenDir, 'calibration-screen.png') }));
  window.destroy();
}).then(() => { clearTimeout(watchdog); app.exit(0); }).catch(error => { console.error(error); app.exit(1); });
