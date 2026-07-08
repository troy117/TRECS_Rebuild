const { app, BrowserWindow } = require('electron');
const path = require('path');

async function run() {
  const window = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../src/preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  await window.loadURL('data:text/html,<html><body>bridge check</body></html>');

  const result = await window.webContents.executeJavaScript(`
    ({
      hasTrecs: Boolean(window.trecs),
      hasCreateClient: Boolean(window.trecs && window.trecs.createClient),
      hasCreateJob: Boolean(window.trecs && window.trecs.createJob),
      keys: Object.keys(window.trecs || {})
    })
  `);

  console.log(JSON.stringify(result, null, 2));

  if (!result.hasTrecs || !result.hasCreateClient || !result.hasCreateJob) {
    app.exit(1);
    return;
  }

  app.exit(0);
}

app.whenReady().then(run).catch((error) => {
  console.error(error);
  app.exit(1);
});
