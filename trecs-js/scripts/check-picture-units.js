const { app, BrowserWindow } = require('electron');

require('../src/main/main.js');

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitForWindow() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const window = BrowserWindow.getAllWindows()[0];
    if (window && !window.webContents.isLoading()) return window;
    await wait(100);
  }
  throw new Error('TRECS window did not finish loading.');
}

async function run() {
  const window = await waitForWindow();
  const report = await window.webContents.executeJavaScript('window.trecs.testPictureUnitRenders()');
  console.log(JSON.stringify(report, null, 2));
  app.exit(report && report.passed ? 0 : 1);
}

app.whenReady().then(run).catch((error) => {
  console.error(error);
  app.exit(1);
});
