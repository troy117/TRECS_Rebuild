const electron = require('electron');
const path = require('node:path');
const { app, BrowserWindow, Menu } = electron;
const { createCalibrationService } = require('./calibration-service');
app.setPath('userData', path.join(process.env.LOCALAPPDATA || app.getPath('appData'), 'TRECS', 'Calibration'));
app.whenReady().then(() => {
  const service = createCalibrationService(electron);
  const window = new BrowserWindow({ width: 1280, height: 900, minWidth: 1000, minHeight: 700,
    title: 'TRECS — Crop Calibration (local only)', webPreferences: { preload: path.join(__dirname, '../preload/calibration-bridge.js'), contextIsolation: true, nodeIntegration: false } });
  Menu.setApplicationMenu(Menu.buildFromTemplate([{ label: 'File', submenu: [{ role: 'quit' }] }, { label: 'View', submenu: [{ role: 'reload' }, { role: 'toggleDevTools' }, { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' }] }]));
  service.attach(window);
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', event => event.preventDefault());
  window.loadFile(path.join(__dirname, '../renderer/calibration-only.html'));
}).catch(error => { console.error(error); app.quit(); });
app.on('window-all-closed', () => app.quit());
