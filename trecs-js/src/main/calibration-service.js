const path = require('node:path');
const { CalibrationRunner } = require('./calibration-runner');
const { createHeadsizingWorker } = require('./headsizing-worker');
const { verifyAssets, defaultAssetRoot } = require('./headsizing-assets');

function createCalibrationService(electron, { root, assetRoot } = {}) {
  const { app, BrowserWindow, ipcMain, session, dialog, powerMonitor, shell } = electron;
  const owners = new Set();
  assetRoot ??= app.isPackaged ? path.join(process.resourcesPath, 'headsizing') : defaultAssetRoot;
  root ??= path.join(app.getPath('userData'), 'CropCalibration', 'runs');
  const runner = new CalibrationRunner({ root, appVersion: app.getVersion(), verifyAssets: () => verifyAssets(assetRoot),
    workerFactory: () => createHeadsizingWorker({ BrowserWindow, ipcMain, session, assetRoot }),
    metrics: () => app.getAppMetrics(), power: () => { try { return powerMonitor.isOnBatteryPower() ? 'battery' : 'ac'; } catch { return 'unknown'; } } });
  runner.on('progress', payload => { for (const owner of owners) if (!owner.isDestroyed()) owner.send('calibration:progress', payload); });
  function handle(name, action) {
    ipcMain.handle(`calibration:${name}`, async (event, ...args) => {
      if (!owners.has(event.sender) || event.senderFrame !== event.sender.mainFrame) throw new Error('Untrusted calibration request');
      return action(BrowserWindow.fromWebContents(event.sender), ...args);
    });
  }
  handle('status', async () => {
    let assets; try { assets = { ready: true, ...await verifyAssets(assetRoot) }; } catch (error) { assets = { ready: false, message: error.message }; }
    return { assets, cacheRoot: root, calibration: runner.calibration, input: runner.input ? { folder: runner.input.root, count: runner.input.files.length, recursive: runner.input.recursive } : null,
      active: runner.active ? { id: runner.active.id, state: runner.active.state } : null, runs: await runner.listRuns() };
  });
  handle('choose-calibration', async window => {
    const choice = await dialog.showOpenDialog(window, { title: 'Load Headsizer calibration', properties: ['openFile'], filters: [{ name: 'Calibration text', extensions: ['txt'] }] });
    return choice.canceled ? null : runner.loadCalibration(choice.filePaths[0]);
  });
  handle('default-calibration', () => runner.loadCalibration(path.join(__dirname, '../shared/headsizing/calibrations/fall-2026.txt')));
  handle('choose-folder', async (window, recursive) => {
    const choice = await dialog.showOpenDialog(window, { title: 'Choose test JPG folder', properties: ['openDirectory'] });
    return choice.canceled ? null : runner.chooseInput(choice.filePaths[0], recursive);
  });
  handle('start', (_window, options) => runner.start(options));
  handle('cancel', () => runner.cancel());
  handle('runs', () => runner.listRuns());
  handle('items', (_window, id, offset) => runner.items(id, offset));
  handle('preview', (_window, id, sequence, role) => runner.preview(id, sequence, role));
  handle('review', (_window, id, sequence, value) => runner.review(id, sequence, value));
  handle('recover', (_window, id) => runner.recover(id));
  handle('export', async (window, id, previews) => {
    const choice = await dialog.showOpenDialog(window, { title: previews ? 'Export report AND PRIVATE photo previews' : 'Export performance report (no photos)', properties: ['openDirectory', 'createDirectory'] });
    return choice.canceled ? null : runner.exportReport(id, choice.filePaths[0], previews === true);
  });
  handle('open-cache', async () => { await require('node:fs/promises').mkdir(root, { recursive: true }); return shell.openPath(root); });
  handle('heartbeat', (_window, lag) => {
    if (runner.active && Number.isFinite(lag) && lag >= 0 && lag <= 60000) runner.uiLag = { value: lag, at: performance.now() };
  });
  app.on('before-quit', () => runner.cancel());
  return { runner, attach: window => {
    const owner = window.webContents;
    owners.add(owner);
    window.once('closed', () => { owners.delete(owner); if (!owners.size) runner.cancel(); });
  } };
}
module.exports = { createCalibrationService };
