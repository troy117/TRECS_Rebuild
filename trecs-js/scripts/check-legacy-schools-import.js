const fs = require('fs');
const path = require('path');

const workspaceRoot = path.resolve(__dirname, '../..');
const temporaryRoot = path.join(workspaceRoot, 'exports', '_legacy-schools-import-smoke');
const allowedParent = path.join(workspaceRoot, 'exports');
const resultPath = path.join(workspaceRoot, 'exports', '_legacy-schools-import-smoke-result.json');
const sourcePath = process.env.TRECS_LEGACY_PROGRAMDATA_TEST || 'T:\\2026_2027 TRECS_new\\ProgramData.accdb';

function removeTemporaryRoot() {
  if (path.dirname(temporaryRoot) !== allowedParent || path.basename(temporaryRoot) !== '_legacy-schools-import-smoke') {
    throw new Error(`Refusing to remove unexpected test path: ${temporaryRoot}`);
  }
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}

function writeFailure(error) {
  fs.mkdirSync(path.dirname(resultPath), { recursive: true });
  fs.writeFileSync(resultPath, JSON.stringify({ ok: false, error: error?.stack || error?.message || String(error) }, null, 2));
}

process.on('uncaughtException', writeFailure);
process.on('unhandledRejection', writeFailure);
removeTemporaryRoot();
fs.mkdirSync(temporaryRoot, { recursive: true });
process.env.TRECS_DATA_ROOT = temporaryRoot;
process.env.TRECS_UI_TEST = '1';

const { app, BrowserWindow, Menu } = require('electron');
const initSqlJs = require('sql.js');
require('../src/main/main.js');

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitForWindow() {
  for (let attempt = 0; attempt < 160; attempt += 1) {
    const window = BrowserWindow.getAllWindows()[0];
    if (window && !window.webContents.isLoading()) return window;
    await wait(100);
  }
  throw new Error('TRECS window did not finish loading.');
}

function resultRows(database, sql) {
  return database.exec(sql)[0]?.values || [];
}

async function run() {
  try {
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Legacy ProgramData test file was not found: ${sourcePath}`);
    }
    const window = await waitForWindow();
    const jobMenu = Menu.getApplicationMenu().items.find((item) => item.label === 'Job');
    const hasMenuItem = Boolean(jobMenu?.submenu?.items.find((item) => item.label === 'Import Schools from Previous TRECS'));
    const input = { sourcePath, skipConfirmation: true };
    const first = await window.webContents.executeJavaScript(`window.trecs.importLegacySchools(${JSON.stringify(input)})`);
    const second = await window.webContents.executeJavaScript(`window.trecs.importLegacySchools(${JSON.stringify(input)})`);

    const SQL = await initSqlJs({ locateFile: (file) => path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', file) });
    const programPath = path.join(temporaryRoot, 'database', 'ProgramData.db');
    const database = new SQL.Database(fs.readFileSync(programPath));
    const tables = new Set(resultRows(database, "SELECT name FROM sqlite_master WHERE type = 'table';").map(([name]) => name));
    const clientCount = Number(resultRows(database, 'SELECT COUNT(*) FROM clients;')[0]?.[0] || 0);
    const baird = resultRows(database, "SELECT reference_number, display_name, trecs_name, city, state FROM clients WHERE trecs_name = 'BAIRD';")[0];
    database.close();

    const pass = hasMenuItem
      && first.added === first.total
      && first.total > 0
      && second.added === 0
      && second.updated === first.total
      && clientCount === first.total
      && !tables.has('subjects')
      && Boolean(baird);
    const report = {
      pass,
      hasMenuItem,
      sourcePath,
      firstImport: first,
      secondImport: second,
      clientCount,
      baird
    };
    fs.writeFileSync(resultPath, JSON.stringify({ ok: pass, report }, null, 2));
    console.log(JSON.stringify(report, null, 2));
    app.exit(pass ? 0 : 1);
  } catch (error) {
    writeFailure(error);
    console.error(error);
    app.exit(1);
  }
}

app.whenReady().then(run).catch((error) => {
  writeFailure(error);
  console.error(error);
  app.exit(1);
});
