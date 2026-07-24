const { app, BrowserWindow, Menu, nativeImage } = require('electron');
const fs = require('fs');
const path = require('path');

require('../src/main/main.js');

function wait(milliseconds) { return new Promise((resolve) => setTimeout(resolve, milliseconds)); }
async function waitForWindow() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const window = BrowserWindow.getAllWindows()[0];
    if (window && !window.webContents.isLoading()) return window;
    await wait(100);
  }
  throw new Error('TRECS window did not finish loading.');
}
async function inspect(window) {
  return window.webContents.executeJavaScript(`(() => {
    const view = document.getElementById('unitRenderView');
    return {
      title: document.querySelector('.topbar h1')?.textContent,
      active: view?.classList.contains('active-view'),
      formVisible: Boolean(view?.querySelector('#unitRenderForm')),
      jobCount: view?.querySelectorAll('[name="jobId"] option').length || 0,
      selectedJob: view?.querySelector('[name="jobId"] option:checked')?.textContent,
      packagePlan: view?.querySelector('[name="packagePlan"]')?.value,
      metricCount: view?.querySelectorAll('.unit-render-metrics article').length || 0,
      proofModeVisible: view?.textContent.includes('Blank-envelope proof mode') || false
    };
  })()`);
}

async function findRenderableOrder(window) {
  const setup = await window.webContents.executeJavaScript('window.trecs.getUnitRenderSetup(null)');
  const order = (setup.filters.orders || []).find((row) => row.hasPhoto);
  if (order && setup.selectedJobId) return { jobId: Number(setup.selectedJobId), orderId: Number(order.id) };
  const jobsData = await window.webContents.executeJavaScript('window.trecs.getJobsData()');
  for (const job of jobsData.jobs || []) {
    const detail = await window.webContents.executeJavaScript(`window.trecs.getJobDetail(${Number(job.id)})`);
    const subject = (detail.subjects || []).find((row) => row.imageAssetId);
    const order = (detail.orders || []).find((row) => Number(row.subjectId) === Number(subject?.id) && row.paidStatus === 'paid');
    if (subject && order) return { jobId: Number(job.id), orderId: Number(order.id) };
  }
  throw new Error('No paid order with a photo was found for the unit render smoke test.');
}

async function findImagePrepOrder(window, fallbackJobId) {
  const setup = await window.webContents.executeJavaScript(`window.trecs.getUnitRenderSetup(${Number(fallbackJobId)})`);
  const imagePrepCodes = new Set(['45', '49', '51', '52', '53']);
  const order = (setup.filters.orders || []).find((row) => row.hasPhoto && String(row.packageCodes || '').split('.').some((code) => imagePrepCodes.has(code)));
  return order ? { jobId: Number(setup.selectedJobId || fallbackJobId), orderId: Number(order.id), packageCodes: order.packageCodes } : null;
}

async function run() {
  const window = await waitForWindow(); window.setSize(1440, 900);
  await window.webContents.executeJavaScript(`document.querySelector('[data-view-button="unitRender"]').click()`); await wait(800);
  const sidebar = await inspect(window);
  await window.webContents.executeJavaScript(`document.querySelector('[data-view-button="dashboard"]').click()`); await wait(100);
  const trecsMenu = Menu.getApplicationMenu().items.find((item) => item.label === 'TRECS');
  const menuItem = trecsMenu?.submenu.items.find((item) => item.label === 'Unit Render'); if (!menuItem) throw new Error('TRECS > Unit Render was not found.');
  menuItem.click(); await wait(800); const menu = await inspect(window);
  const fixture = await findRenderableOrder(window);
  const outputFolder = path.resolve(__dirname, '../../exports/unit-render-smoke'); fs.mkdirSync(outputFolder, { recursive: true });
  const render = await window.webContents.executeJavaScript(`window.trecs.runUnitRender(${JSON.stringify({ jobId: fixture.jobId, source: 'individual', sourceValue: fixture.orderId, sortBy: 'homeroom', includeUnits: true, includeEnvelopes: true, includeLabels: true, outputFolder })})`);
  const imagePrepFixture = await findImagePrepOrder(window, fixture.jobId);
  const imagePrepExport = imagePrepFixture
    ? await window.webContents.executeJavaScript(`window.trecs.exportImagePrep(${JSON.stringify({ jobId: imagePrepFixture.jobId, source: 'individual', sourceValue: imagePrepFixture.orderId, outputFolder })})`)
    : null;
  const envelopeProofs = await window.webContents.executeJavaScript(`window.trecs.testBlankEnvelopeRenders(${JSON.stringify(outputFolder)})`);
  const renderedFiles = fs.readdirSync(path.join(outputFolder, 'Units')).filter((name) => name.toLowerCase().endsWith('.jpg'));
  const envelopeFiles = fs.readdirSync(path.join(outputFolder, 'Envelopes')).filter((name) => name.toLowerCase().endsWith('.jpg'));
  const labelFiles = fs.readdirSync(path.join(outputFolder, 'Labels')).filter((name) => name.toLowerCase().endsWith('.jpg'));
  const unitImage = renderedFiles.length ? nativeImage.createFromPath(path.join(outputFolder, 'Units', renderedFiles[0])) : null;
  const envelopeImage = envelopeFiles.length ? nativeImage.createFromPath(path.join(outputFolder, 'Envelopes', envelopeFiles[0])) : null;
  const screenshotFolder = path.resolve(__dirname, '../../exports/ui-tests'); fs.mkdirSync(screenshotFolder, { recursive: true });
  const screenshotPath = path.join(screenshotFolder, 'unit-render-interface.png'); fs.writeFileSync(screenshotPath, (await window.webContents.capturePage()).toPNG());
  const largeProof = nativeImage.createFromPath(envelopeProofs.outputs.find((item) => item.width === 3450).outputPath);
  const imagePrepFolderValid = !imagePrepExport || (imagePrepExport.outputFolder === path.join(outputFolder, 'ImagePrep') && imagePrepExport.exported > 0);
  const pass = sidebar.active && sidebar.formVisible && sidebar.jobCount > 0 && sidebar.metricCount === 4 && sidebar.proofModeVisible && menu.active && menu.title === 'Unit Render' && render.units > 0 && render.envelopes > 0 && render.labels > 0 && imagePrepFolderValid && unitImage?.getSize().width === 2400 && unitImage?.getSize().height === 3150 && envelopeImage?.getSize().width === 2625 && envelopeImage?.getSize().height === 3975 && largeProof.getSize().width === 3450 && largeProof.getSize().height === 4950;
  const report = { pass, screenshotPath, outputFolder, fixture, imagePrepFixture, imagePrepExport, sidebar, menu, render, envelopeProofs, renderedFiles, envelopeFiles, labelFiles };
  fs.writeFileSync(path.join(outputFolder, 'smoke-test-report.json'), JSON.stringify(report, null, 2)); console.log(JSON.stringify(report, null, 2)); app.exit(pass ? 0 : 1);
}
app.whenReady().then(run).catch((error) => { console.error(error); app.exit(1); });
