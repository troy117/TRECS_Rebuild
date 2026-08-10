const { app, BrowserWindow, Menu } = require('electron');
const fs = require('fs');
const path = require('path');

require('../src/main/main.js');

function wait(milliseconds) { return new Promise((resolve) => setTimeout(resolve, milliseconds)); }

async function waitForWindow() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    const window = BrowserWindow.getAllWindows()[0];
    if (window && !window.webContents.isLoading()) return window;
    await wait(100);
  }
  throw new Error('TRECS window did not finish loading.');
}

async function waitFor(window, expression, label) {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (await window.webContents.executeJavaScript(`Boolean(${expression})`)) return;
    await wait(100);
  }
  throw new Error(`${label} did not finish loading.`);
}

async function inspect(window) {
  return window.webContents.executeJavaScript(`(() => {
    const view = document.getElementById('idCardRenderView');
    const form = document.getElementById('idCardRenderForm');
    return {
      active: view.classList.contains('active-view'),
      title: document.querySelector('.topbar h1').textContent,
      jobCount: form.elements.jobId.options.length,
      templateCount: form.elements.templateOverrideId.options.length,
      backgroundDefault: form.elements.backgroundOverride.value === '',
      hasOutputPicker: Boolean(form.elements.outputFolder),
      hasRenderButton: Boolean(document.getElementById('startIdCardRenderButton')),
      metricCount: document.querySelectorAll('#idCardRenderMetrics article').length
    };
  })()`);
}

async function run() {
  const window = await waitForWindow();
  window.webContents.on('console-message', (_event, _level, message) => console.error(`Renderer: ${message}`));
  window.setSize(1440, 900);
  await window.webContents.executeJavaScript(`document.querySelector('[data-view-button="idCardRender"]').click()`);
  await waitFor(window, `document.getElementById('idCardRenderView').classList.contains('active-view')`, 'ID Card Render view');
  await wait(1000);
  const loadState = await window.webContents.executeJavaScript(`({ jobs: document.querySelectorAll('#idCardRenderForm [name="jobId"] option').length, metrics: document.querySelectorAll('#idCardRenderMetrics article').length, status: document.getElementById('idCardRenderStatus').textContent })`);
  if (loadState.jobs < 1 || ![0, 4].includes(loadState.metrics)) throw new Error(`ID Card Render options did not load: ${JSON.stringify(loadState)}`);
  const sidebar = await inspect(window);
  const selectedJobId = await window.webContents.executeJavaScript(`Number(document.getElementById('idCardRenderForm').elements.jobId.value)`);
  const adminItems = selectedJobId > 0
    ? await window.webContents.executeJavaScript(`window.trecs.getAdminItems(${Number(selectedJobId)}, 'original_picture_day')`)
    : { items: [] };
  const mainSource = fs.readFileSync(path.resolve(__dirname, '../src/main/main.js'), 'utf8');
  const rendererSource = fs.readFileSync(path.resolve(__dirname, '../src/renderer/renderer.js'), 'utf8');
  const javaSource = fs.readFileSync(path.resolve(__dirname, '../../tools/IdCardSheetRenderer.java'), 'utf8');
  const adminItemsSeparated = !(adminItems.items || []).some((item) => item.type === 'id_cards')
    && mainSource.includes("type !== 'id_cards'");
  const templateFieldChecks = {
    field1Label: rendererSource.includes("label: 'Field 1', kind: 'text', field: 'field1'"),
    field2Label: rendererSource.includes("label: 'Field 2', kind: 'text', field: 'field2'"),
    legacyLabelsRemoved: !rendererSource.includes("label: 'Extra 1'") && !rendererSource.includes("label: 'Extra 2'"),
    tsvIncludesFields: mainSource.includes('subject.field1,') && mainSource.includes('subject.field2,'),
    rendererUsesFields: javaSource.includes('return subject.field1;') && javaSource.includes('return subject.field2;'),
    legacyTemplatesSupported: javaSource.includes('"extra1".equals(field)') && javaSource.includes('"extra2".equals(field)')
  };

  const trecsMenu = Menu.getApplicationMenu().items.find((item) => item.label === 'TRECS');
  const menuItem = trecsMenu?.submenu.items.find((item) => item.label === 'ID Card Render');
  if (!menuItem) throw new Error('TRECS > ID Card Render was not found.');
  await window.webContents.executeJavaScript(`document.querySelector('[data-view-button="dashboard"]').click()`);
  menuItem.click();
  await waitFor(window, `document.getElementById('idCardRenderView').classList.contains('active-view')`, 'ID Card Render menu action');
  const menu = await inspect(window);

  const screenshotFolder = path.resolve(__dirname, '../../exports/ui-tests');
  fs.mkdirSync(screenshotFolder, { recursive: true });
  const screenshotPath = path.join(screenshotFolder, 'id-card-render-interface.png');
  fs.writeFileSync(screenshotPath, (await window.webContents.capturePage()).toPNG());

  const pass = sidebar.active && sidebar.title === 'ID Card Render'
    && sidebar.jobCount > 0 && sidebar.templateCount > 0
    && sidebar.backgroundDefault && sidebar.hasOutputPicker && sidebar.hasRenderButton
    && [0, 4].includes(sidebar.metricCount) && menu.active && menu.title === 'ID Card Render'
    && adminItemsSeparated
    && Object.values(templateFieldChecks).every(Boolean);
  const report = { pass, screenshotPath, sidebar, menu, templateFieldChecks, adminItemTypes: (adminItems.items || []).map((item) => item.type) };
  console.log(JSON.stringify(report, null, 2));
  app.exit(pass ? 0 : 1);
}

app.whenReady().then(run).catch((error) => { console.error(error); app.exit(1); });
