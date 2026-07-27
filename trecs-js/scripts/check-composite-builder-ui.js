const { app, BrowserWindow, Menu, nativeImage } = require('electron');
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

async function waitForPreview(window) {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    const ready = await window.webContents.executeJavaScript(`Boolean(document.querySelector('#compositePreviewStage img')) && !document.getElementById('compositePreviewStage').textContent.includes('Building preview')`);
    if (ready) return;
    await wait(100);
  }
  throw new Error('Composite preview did not finish loading.');
}

async function inspect(window) {
  return window.webContents.executeJavaScript(`(() => {
    const view = document.getElementById('compositesView');
    const image = view?.querySelector('#compositePreviewStage img');
    return {
      title: document.querySelector('.topbar h1')?.textContent,
      active: view?.classList.contains('active-view'),
      jobCount: view?.querySelectorAll('#compositeJobSelect option').length || 0,
      classCount: view?.querySelectorAll('.composite-class-item').length || 0,
      selectedClass: view?.querySelector('.composite-class-item.selected strong')?.textContent,
      previewVisible: Boolean(image),
      previewNaturalWidth: image?.naturalWidth || 0,
      previewNaturalHeight: image?.naturalHeight || 0,
      activeType: view?.querySelector('#compositePreviewType button.active')?.dataset.compositeType,
      hasTraditionalControl: Boolean(view?.querySelector('[data-composite-type="traditional"]')),
      hasStarControl: Boolean(view?.querySelector('[data-composite-type="star"]')),
      hasOutputControls: Boolean(view?.querySelector('#compositeRenderForm')),
      legacyBadge: view?.textContent.includes('Legacy layout geometry') || false
    };
  })()`);
}

async function run() {
  const window = await waitForWindow();
  window.setSize(1600, 960);
  await window.webContents.executeJavaScript(`document.querySelector('[data-view-button="composites"]').click()`);
  await waitForPreview(window);
  const sidebar = await inspect(window);

  await window.webContents.executeJavaScript(`document.querySelector('[data-view-button="dashboard"]').click()`);
  await wait(100);
  const trecsMenu = Menu.getApplicationMenu().items.find((item) => item.label === 'TRECS');
  const menuItem = trecsMenu?.submenu.items.find((item) => item.label === 'Class Composite Builder');
  if (!menuItem) throw new Error('TRECS > Class Composite Builder was not found.');
  menuItem.click();
  await wait(500);
  await waitForPreview(window);
  const menu = await inspect(window);

  await window.webContents.executeJavaScript(`document.querySelector('[data-composite-type="star"]').click()`);
  await wait(500);
  await waitForPreview(window);
  const star = await inspect(window);
  const selected = await window.webContents.executeJavaScript(`(() => ({
    jobId: Number(document.getElementById('compositeJobSelect').value),
    homeroom: document.querySelector('.composite-class-item.selected strong')?.textContent || ''
  }))()`);

  const actualFeature = await window.webContents.executeJavaScript(`(async () => {
    const setup = await window.trecs.getCompositeSetup(${Number(selected.jobId)});
    const group = setup.classes.find((item) => item.homeroom === ${JSON.stringify(selected.homeroom)}) || setup.classes[0];
    const featured = group?.featuredStudents.find((student) => student.hasPhoto) || group?.featuredStudents[0];
    const preview = await window.trecs.previewComposite({ jobId: ${Number(selected.jobId)}, homeroom: group.homeroom, type: 'star', featuredSubjectId: featured.id, schoolName: setup.job.clientName, schoolYear: setup.job.schoolYear, includeNames: true, includeStaff: true });
    return { dataUrl: preview.dataUrl, homeroom: group.homeroom, featuredName: featured.name, hasPhoto: featured.hasPhoto, width: preview.width, height: preview.height };
  })()`);
  const layoutTests = await window.webContents.executeJavaScript(`window.trecs.testCompositeLayouts()`);
  const outputFolder = path.resolve(__dirname, '../../exports/composite-builder-smoke');
  fs.rmSync(outputFolder, { recursive: true, force: true });
  fs.mkdirSync(outputFolder, { recursive: true });
  const actualFeaturePath = path.join(outputFolder, 'actual-photo-star-feature-preview.jpg');
  fs.writeFileSync(actualFeaturePath, Buffer.from(actualFeature.dataUrl.split(',')[1], 'base64'));
  const actualFeatureSize = nativeImage.createFromPath(actualFeaturePath).getSize();
  delete actualFeature.dataUrl;
  const renderTarget = await window.webContents.executeJavaScript(`(async () => {
    const setup = await window.trecs.getCompositeSetup(${Number(selected.jobId)});
    const group = setup.classes.find((item) => Number(item.traditionalOrders || 0) + Number(item.starOrders || 0) > 0) || setup.classes.find((item) => item.homeroom === ${JSON.stringify(selected.homeroom)}) || setup.classes[0];
    return { homeroom: group.homeroom, traditionalOrders: group.traditionalOrders, starOrders: group.starOrders };
  })()`);
  const render = await window.webContents.executeJavaScript(`window.trecs.renderComposites(${JSON.stringify({
    jobId: selected.jobId,
    homeroom: renderTarget.homeroom,
    scope: 'selected',
    schoolName: 'ISLAND',
    principal: 'Composite Builder Smoke Test',
    schoolYear: '2024-2025',
    classHeading: '',
    photographedOnly: false,
    includeStaff: true,
    includeNames: true,
    includeTraditional: true,
    includeStar: true,
    includePurchaserCopies: true,
    includePackagingLabels: true,
    outputFolder
  })})`);

  const backgrounds = fs.readdirSync(path.join(outputFolder, 'Composite Backgrounds')).filter((name) => name.toLowerCase().endsWith('.jpg'));
  const sizes = backgrounds.map((name) => ({ name, ...nativeImage.createFromPath(path.join(outputFolder, 'Composite Backgrounds', name)).getSize() }));
  const labelFolder = path.join(outputFolder, 'Composite Packaging Labels');
  const labels = fs.existsSync(labelFolder) ? fs.readdirSync(labelFolder).filter((name) => name.toLowerCase().endsWith('.jpg')) : [];
  const labelSizes = labels.map((name) => ({ name, ...nativeImage.createFromPath(path.join(labelFolder, name)).getSize() }));
  const screenshotFolder = path.resolve(__dirname, '../../exports/ui-tests');
  fs.mkdirSync(screenshotFolder, { recursive: true });
  const screenshotPath = path.join(screenshotFolder, 'class-composite-builder.png');
  fs.writeFileSync(screenshotPath, (await window.webContents.capturePage()).toPNG());

  const pass = sidebar.active && sidebar.title === 'Class Composites' && sidebar.jobCount > 0 && sidebar.classCount > 0
    && sidebar.previewVisible && sidebar.previewNaturalWidth === 1500 && sidebar.previewNaturalHeight === 1200
    && sidebar.hasTraditionalControl && sidebar.hasStarControl && sidebar.hasOutputControls && sidebar.legacyBadge
    && menu.active && menu.previewVisible && star.previewVisible && star.activeType === 'star' && layoutTests.passed
    && actualFeature.hasPhoto && actualFeatureSize.width === 1500 && actualFeatureSize.height === 1200
    && render.traditionalBackgrounds === 1 && render.starBackgrounds === 1 && render.packagingLabelSheets > 0
    && sizes.length === 2 && sizes.every((size) => size.width === 3000 && size.height === 2400);
  const labelsPass = labelSizes.length > 0 && labelSizes.every((size) => size.width === 2550 && size.height === 3300);
  const report = { pass: pass && labelsPass, screenshotPath, outputFolder, sidebar, menu, star, actualFeature: { ...actualFeature, outputPath: actualFeaturePath, ...actualFeatureSize }, layoutTests, renderTarget, render, backgrounds, sizes, labels, labelSizes };
  fs.writeFileSync(path.join(outputFolder, 'smoke-test-report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  app.exit(pass ? 0 : 1);
}

app.whenReady().then(run).catch((error) => { console.error(error); app.exit(1); });
