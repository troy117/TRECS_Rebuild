const { app, BrowserWindow, Menu } = require('electron');
const fs = require('fs');
const path = require('path');

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

async function inspectProducts(window) {
  return window.webContents.executeJavaScript(`(() => {
    const view = document.getElementById('productsView');
    const first = view?.querySelector('.package-code-list button');
    return {
      title: document.querySelector('.topbar h1')?.textContent,
      productsActive: view?.classList.contains('active-view'),
      jobsActive: document.getElementById('jobsView')?.classList.contains('active-view'),
      editorVisible: Boolean(view?.querySelector('.package-editor')),
      jobsTableInsideProducts: Boolean(view?.querySelector('#jobsScreenTableBody')),
      planSelectVisible: Boolean(view?.querySelector('#packageEditorPlan')),
      packageCount: view?.querySelectorAll('.package-code-list button').length || 0,
      firstPackage: first ? {
        name: first.querySelector('strong')?.textContent,
        code: first.querySelector('span')?.textContent,
        items: first.querySelector('small')?.textContent,
        height: Math.round(first.getBoundingClientRect().height)
      } : null
    };
  })()`);
}

async function run() {
  const window = await waitForWindow();
  window.setSize(1440, 900);
  await window.webContents.executeJavaScript(`document.querySelector('[data-view-button="products"]').click()`);
  await wait(700);
  const sidebar = await inspectProducts(window);

  await window.webContents.executeJavaScript(`document.querySelector('[data-view-button="dashboard"]').click()`);
  await wait(100);
  const trecsMenu = Menu.getApplicationMenu().items.find((item) => item.label === 'TRECS');
  const editorItem = trecsMenu && trecsMenu.submenu.items.find((item) => item.label === 'Package Plan Editor');
  if (!editorItem) throw new Error('TRECS > Package Plan Editor menu item was not found.');
  editorItem.click();
  await wait(700);
  const menu = await inspectProducts(window);

  const outputFolder = path.resolve(__dirname, '../../exports/ui-tests');
  fs.mkdirSync(outputFolder, { recursive: true });
  const screenshotPath = path.join(outputFolder, 'package-plan-editor.png');
  const screenshot = await window.webContents.capturePage();
  fs.writeFileSync(screenshotPath, screenshot.toPNG());

  const pass = [
    sidebar.productsActive,
    !sidebar.jobsActive,
    sidebar.editorVisible,
    !sidebar.jobsTableInsideProducts,
    sidebar.planSelectVisible,
    menu.productsActive,
    menu.editorVisible,
    menu.title === 'Products',
    !menu.jobsTableInsideProducts,
    !menu.firstPackage || menu.firstPackage.height <= 58
  ].every(Boolean);
  const report = { pass, screenshotPath, sidebar, menu };
  fs.writeFileSync(path.join(outputFolder, 'package-plan-editor-report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  app.exit(pass ? 0 : 1);
}

app.whenReady().then(run).catch((error) => {
  console.error(error);
  app.exit(1);
});
