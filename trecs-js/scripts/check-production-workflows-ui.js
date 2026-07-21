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

async function inspectView(window, id) {
  return window.webContents.executeJavaScript(`(() => {
    const view = document.getElementById(${JSON.stringify(id)});
    return { active: view.classList.contains('active-view'), title: document.querySelector('.topbar h1').textContent, text: view.innerText.slice(0, 1400) };
  })()`);
}

async function run() {
  const window = await waitForWindow();
  window.setSize(1600, 960);
  const outputFolder = path.resolve(__dirname, '../../exports/production-workflows-smoke');
  const screenshotFolder = path.resolve(__dirname, '../../exports/ui-tests');
  fs.mkdirSync(outputFolder, { recursive: true });
  fs.mkdirSync(screenshotFolder, { recursive: true });

  await window.webContents.executeJavaScript(`document.querySelector('[data-view-button="studentLists"]').click()`);
  await waitFor(window, `document.querySelectorAll('#studentListJobSelect option').length > 0`, 'Student List Builder');
  const studentLists = await inspectView(window, 'studentListsView');
  const listApi = await window.webContents.executeJavaScript(`(async () => {
    const setup = await window.trecs.getStudentListSetup();
    const subjectIds = setup.subjects.slice(0, 3).map((subject) => subject.id);
    const name = 'TRECS SMOKE LIST ' + Date.now();
    const saved = await window.trecs.saveStudentList({ jobId: setup.selectedJobId, name, memberIds: subjectIds });
    const reloaded = await window.trecs.getStudentListSetup(setup.selectedJobId, saved.id);
    await window.trecs.deleteStudentList(saved.id);
    return { saved, memberIds: reloaded.selectedList.memberIds, jobId: setup.selectedJobId };
  })()`);
  await window.webContents.executeJavaScript(`document.querySelector('[data-view-button="studentLists"]').click()`);
  await waitFor(window, `document.getElementById('studentListsView').classList.contains('active-view')`, 'Student List Builder view');
  const listScreenshot = path.join(screenshotFolder, 'student-list-builder.png');
  fs.writeFileSync(listScreenshot, (await window.webContents.capturePage()).toPNG());

  const menu = Menu.getApplicationMenu().items.find((item) => item.label === 'TRECS');
  const expectedMenuItems = ['Student List Builder', 'Online Order Import', 'Multi-Job Batch Render'];
  const menuItems = Object.fromEntries(expectedMenuItems.map((label) => [label, menu?.submenu.items.find((item) => item.label === label)]));
  if (expectedMenuItems.some((label) => !menuItems[label])) throw new Error('One or more production tools are missing from the TRECS menu.');

  menuItems['Online Order Import'].click();
  await waitFor(window, `document.querySelectorAll('#onlineOrderJobSelect option').length > 0`, 'Online Order Import');
  const onlineOrders = await inspectView(window, 'onlineOrdersView');
  const onlineTarget = await window.webContents.executeJavaScript(`(async () => {
    const batches = await window.trecs.getBatchRenderSetup();
    for (const job of batches.jobs.filter((item) => Number(item.paidOrders) === 0)) {
      const setup = await window.trecs.getStudentListSetup(job.id);
      const subject = setup.subjects[0];
      if (!subject || !job.packagePlanId) continue;
      const plan = await window.trecs.getPackageEditorData(job.packagePlanId);
      const code = plan.codes.find((item) => item.items.length);
      if (code) return { job, subject, packageCode: code.code };
    }
    throw new Error('No zero-order subject with a configured package code was found for the smoke test.');
  })()`);
  await window.webContents.executeJavaScript(`document.getElementById('onlineOrderJobSelect').value = ${JSON.stringify(String(onlineTarget.job.id))}`);
  const subject = onlineTarget.subject;
  const sourceReference = `TRECS-SMOKE-${Date.now()}`;
  const csvPath = path.join(outputFolder, `${sourceReference}.csv`);
  fs.writeFileSync(csvPath, `Order Number,Reference Number,First Name,Last Name,Package Codes,Paid Status,Amount,Payment Method,Notes\n${sourceReference},${subject.ref || ''},${subject.firstName || ''},${subject.lastName || ''},${onlineTarget.packageCode},paid,10.00,test,TRECS smoke test\n`);
  const onlineApi = await window.webContents.executeJavaScript(`(async () => {
    const input = { jobId: ${Number(onlineTarget.job.id)}, filePath: ${JSON.stringify(csvPath)} };
    const preview = await window.trecs.previewOnlineOrders(input);
    const first = await window.trecs.importOnlineOrders(input);
    const second = await window.trecs.importOnlineOrders(input);
    return { preview: preview.totals, first, second };
  })()`);
  [onlineApi.first.copiedSourcePath, onlineApi.second.copiedSourcePath].filter(Boolean).forEach((relativePath) => {
    const copiedPath = path.resolve(__dirname, '../..', relativePath);
    if (fs.existsSync(copiedPath)) fs.rmSync(copiedPath, { force: true });
  });
  const onlineScreenshot = path.join(screenshotFolder, 'online-order-import.png');
  fs.writeFileSync(onlineScreenshot, (await window.webContents.capturePage()).toPNG());

  menuItems['Multi-Job Batch Render'].click();
  await waitFor(window, `document.querySelectorAll('#batchRenderJobs input[name="jobIds"]').length > 1`, 'Batch Render');
  const batchView = await inspectView(window, 'batchRenderView');
  const batchSetup = await window.webContents.executeJavaScript(`window.trecs.getBatchRenderSetup()`);
  const targetBatchJob = batchSetup.jobs.find((job) => Number(job.id) === Number(onlineTarget.job.id));
  const companionBatchJob = batchSetup.jobs.find((job) => Number(job.id) !== Number(onlineTarget.job.id) && Number(job.paidOrders) === 0);
  const batchJobs = [targetBatchJob, companionBatchJob];
  if (batchJobs.some((job) => !job)) throw new Error('Could not select two safe jobs for the batch-render smoke test.');
  const batchOutput = path.join(outputFolder, `batch-${Date.now()}`);
  fs.mkdirSync(batchOutput, { recursive: true });
  const batchApi = await window.webContents.executeJavaScript(`window.trecs.runBatchRender(${JSON.stringify({
    jobIds: batchJobs.map((job) => job.id),
    name: 'TRECS Production Smoke Test',
    outputFolder: batchOutput,
    sortBy: 'homeroom',
    includeUnits: false,
    includeEnvelopes: true,
    includeLabels: true
  })})`);
  await window.webContents.executeJavaScript(`window.trecs.deleteOrder(${Number(onlineApi.first.orderIds[0])})`);
  const batchScreenshot = path.join(screenshotFolder, 'multi-job-batch-render.png');
  fs.writeFileSync(batchScreenshot, (await window.webContents.capturePage()).toPNG());

  const lockApi = await window.webContents.executeJavaScript(`(async () => {
    const jobId = ${Number(batchJobs[0].id)};
    const acquired = await window.trecs.acquireJobSession(jobId, 'job_write');
    const heartbeat = await window.trecs.heartbeatJobSessions([jobId]);
    const active = await window.trecs.getJobSessions();
    const released = await window.trecs.releaseJobSession([jobId]);
    return { acquired, heartbeat, active: active.filter((item) => item.jobId === jobId), released };
  })()`);

  const pass = studentLists.active && studentLists.title === 'Student Lists'
    && listApi.saved.memberCount === listApi.memberIds.length && listApi.saved.memberCount > 0
    && onlineOrders.active && onlineOrders.title === 'Online Orders'
    && onlineApi.preview.ready === 1 && onlineApi.first.inserted === 1 && onlineApi.second.updated === 1
    && batchView.active && batchView.title === 'Batch Render'
    && batchApi.results.length === 2 && batchApi.results.every((item) => item.status === 'completed')
    && batchApi.results.some((item) => item.result.orders === 1 && item.result.labels === 1)
    && lockApi.acquired.acquired && lockApi.heartbeat.refreshed > 0 && lockApi.active.length === 1 && lockApi.released.released > 0;
  const report = { pass, screenshots: { listScreenshot, onlineScreenshot, batchScreenshot }, studentLists, listApi, onlineOrders, onlineApi, batchView, batchApi, lockApi };
  fs.writeFileSync(path.join(outputFolder, 'smoke-test-report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  app.exit(pass ? 0 : 1);
}

app.whenReady().then(run).catch((error) => { console.error(error); app.exit(1); });
