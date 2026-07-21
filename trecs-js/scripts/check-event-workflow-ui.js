const { app, BrowserWindow, Menu } = require('electron');
const fs = require('fs');
const path = require('path');

require('../src/main/main.js');

const workspaceRoot = path.resolve(__dirname, '../..');
const databasePath = path.join(workspaceRoot, 'database', 'migration_prototype.db');
const programDatabasePath = path.join(workspaceRoot, 'database', 'program.db');
const outputFolder = path.join(workspaceRoot, 'exports', 'ui-tests');
const temporaryRoot = path.join(workspaceRoot, 'exports', '_event-workflow-smoke-temp');

function wait(milliseconds) { return new Promise((resolve) => setTimeout(resolve, milliseconds)); }

async function waitForWindow() {
  for (let attempt = 0; attempt < 160; attempt += 1) {
    const window = BrowserWindow.getAllWindows()[0];
    if (window && !window.webContents.isLoading()) return window;
    await wait(100);
  }
  throw new Error('TRECS window did not finish loading.');
}

async function waitFor(condition, message) {
  for (let attempt = 0; attempt < 160; attempt += 1) {
    if (await condition()) return;
    await wait(100);
  }
  throw new Error(message);
}

function restoreFile(filePath, backup) {
  if (backup === null) fs.rmSync(filePath, { force: true });
  else fs.writeFileSync(filePath, backup);
}

function removeTemporaryRoot() {
  const resolved = path.resolve(temporaryRoot);
  const allowedParent = path.resolve(workspaceRoot, 'exports');
  if (path.dirname(resolved) !== allowedParent || path.basename(resolved) !== '_event-workflow-smoke-temp') {
    throw new Error(`Refusing to remove unexpected test path: ${resolved}`);
  }
  fs.rmSync(resolved, { recursive: true, force: true });
}

async function findPhotographedFallStudent(window) {
  const jobsData = await window.webContents.executeJavaScript('window.trecs.getJobsData()');
  const fallJobs = jobsData.jobs.filter((job) => ['fall', 'spring'].includes(job.type) && Number(job.subjectsWithPrimaryImage) > 0);
  for (const job of fallJobs) {
    const detail = await window.webContents.executeJavaScript(`window.trecs.getJobDetail(${Number(job.id)})`);
    for (const subject of detail.subjects.filter((row) => row.imageAssetId)) {
      const preview = await window.webContents.executeJavaScript(`window.trecs.getImagePreview(${Number(subject.imageAssetId)})`);
      if (preview?.dataUrl && !preview.missing) {
        const client = jobsData.clients.find((row) => row.displayName === detail.summary.clientName || row.trecsName === detail.summary.location);
        const packagePlan = jobsData.packagePlans.find((row) => row.name === detail.summary.packagePlan);
        if (client) return { job, detail, subject, preview, client, packagePlan };
      }
    }
  }
  throw new Error('No photographed fall or spring student was available for the event workflow test.');
}

async function inspectEventView(window) {
  return window.webContents.executeJavaScript(`(() => {
    const view = document.getElementById('eventsView');
    const selected = document.querySelector('.event-student-result.active');
    return {
      active: view?.classList.contains('active-view') || false,
      title: document.querySelector('.topbar h1')?.textContent || '',
      eventJobId: Number(document.getElementById('eventJobSelect')?.value || 0),
      fallJobId: Number(document.getElementById('eventFallJobSelect')?.value || 0),
      queueCards: view?.querySelectorAll('.event-image-card').length || 0,
      activeQueueCards: view?.querySelectorAll('.event-image-card.active').length || 0,
      eventPreview: Boolean(document.querySelector('#eventPhotoPreview img')),
      fallPreview: Boolean(document.querySelector('#eventFallPreview img')),
      candidateCount: view?.querySelectorAll('.event-student-result').length || 0,
      selectedCandidate: selected?.querySelector('strong')?.textContent || '',
      existingLinks: view?.querySelectorAll('.event-link-chip').length || 0,
      currentStatus: document.getElementById('eventCurrentStatus')?.textContent || '',
      orderCodes: document.querySelector('#eventOrderForm input[name="orderCodes"]')?.value || '',
      hasIdentityConfirmation: Boolean(document.querySelector('#eventOrderForm input[name="confirmed"]')),
      hasOrderEntry: Boolean(document.querySelector('#eventOrderForm input[name="orderCodes"]')),
      hasFastImageJump: Boolean(document.getElementById('eventImageNumberSearch')),
      hasFilters: Boolean(document.getElementById('eventGradeFilter') && document.getElementById('eventHomeroomFilter')),
      hasAddPerson: Boolean(document.getElementById('eventAddAnotherButton')),
      setupStatus: document.getElementById('eventSetupStatus')?.textContent || ''
    };
  })()`);
}

async function run() {
  const window = await waitForWindow();
  window.setSize(1680, 1020);
  const fixture = await findPhotographedFallStudent(window);
  const databaseBackup = fs.readFileSync(databasePath);
  const programDatabaseBackup = fs.existsSync(programDatabasePath) ? fs.readFileSync(programDatabasePath) : null;
  let eventJobId = null;
  let report;

  try {
    removeTemporaryRoot();
    fs.mkdirSync(path.join(temporaryRoot, 'source'), { recursive: true });
    const extension = fixture.preview.dataUrl.startsWith('data:image/png') ? '.png' : '.jpg';
    const sourceImagePath = path.join(temporaryRoot, 'source', `EVT-1001${extension}`);
    fs.writeFileSync(sourceImagePath, Buffer.from(fixture.preview.dataUrl.split(',')[1], 'base64'));

    const created = await window.webContents.executeJavaScript(`window.trecs.createJob(${JSON.stringify({
      clientId: fixture.client.id,
      name: '_EVENT_WORKFLOW_SMOKE_',
      type: 'event',
      packagePlanId: fixture.packagePlan?.id || null,
      rootPath: path.join(temporaryRoot, 'job'),
      notes: 'Temporary automated event workflow verification'
    })})`);
    eventJobId = Number(created.id);
    await window.webContents.executeJavaScript(`window.trecs.configureEventFallJob(${JSON.stringify({ eventJobId, fallJobId: fixture.job.id })})`);
    const imported = await window.webContents.executeJavaScript(`window.trecs.importEventImageFolder(${eventJobId}, ${JSON.stringify(path.join(temporaryRoot, 'source'))})`);
    let setup = await window.webContents.executeJavaScript(`window.trecs.getEventWorkflowSetup(${eventJobId})`);
    const entry = setup.queue[0];
    if (!entry) throw new Error('The temporary event image was not added to the queue.');

    const candidates = await window.webContents.executeJavaScript(`window.trecs.searchEventFallStudents(${JSON.stringify({ eventJobId, search: fixture.subject.ref || fixture.subject.name })})`);
    const candidate = candidates.find((row) => Number(row.id) === Number(fixture.subject.id));
    if (!candidate) throw new Error('The photographed fall student was not returned by event search.');

    let confirmationRequired = false;
    try {
      await window.webContents.executeJavaScript(`window.trecs.saveEventMatch(${JSON.stringify({ eventJobId, entryId: entry.id, fallSubjectId: candidate.id, confirmed: false, orderCodes: '1', paidStatus: 'paid' })})`);
    } catch (error) {
      confirmationRequired = /confirm/i.test(String(error.message || error));
    }
    const saved = await window.webContents.executeJavaScript(`window.trecs.saveEventMatch(${JSON.stringify({
      eventJobId,
      entryId: entry.id,
      fallSubjectId: candidate.id,
      confirmed: true,
      orderCodes: '1',
      paidStatus: 'paid',
      notes: 'Verified against fall thumbnail'
    })})`);
    setup = await window.webContents.executeJavaScript(`window.trecs.getEventWorkflowSetup(${eventJobId}, ${entry.id})`);
    const storedLink = setup.selectedEntry.links.find((link) => Number(link.subjectId) === Number(candidate.id));

    await window.webContents.executeJavaScript(`document.querySelector('[data-view-button="events"]').click(); loadEventWorkflow(${eventJobId}, ${entry.id})`);
    await waitFor(async () => window.webContents.executeJavaScript(`Number(document.getElementById('eventJobSelect').value) === ${eventJobId} && Boolean(document.querySelector('#eventPhotoPreview img')) && Boolean(document.querySelector('#eventFallPreview img'))`), 'The event comparison photos did not finish loading.');
    await window.webContents.executeJavaScript(`(() => { const input = document.getElementById('eventStudentSearch'); input.value = ${JSON.stringify(fixture.subject.ref || fixture.subject.name)}; input.dispatchEvent(new Event('input', { bubbles: true })); })()`);
    await waitFor(async () => window.webContents.executeJavaScript(`document.querySelectorAll('.event-student-result').length === 1`), 'The fast student search did not narrow to the expected fall record.');
    await window.webContents.executeJavaScript(`document.querySelector('.event-student-result')?.click()`);
    await waitFor(async () => window.webContents.executeJavaScript(`Boolean(document.querySelector('.event-student-result.active')) && Boolean(document.querySelector('#eventFallPreview img'))`), 'Selecting a search result did not refresh the fall thumbnail.');
    const sidebar = await inspectEventView(window);

    await window.webContents.executeJavaScript(`document.querySelector('[data-view-button="dashboard"]').click()`);
    const trecsMenu = Menu.getApplicationMenu().items.find((item) => item.label === 'TRECS');
    const menuItem = trecsMenu?.submenu.items.find((item) => item.label === 'Event Workflow');
    if (!menuItem) throw new Error('TRECS > Event Workflow was not found.');
    menuItem.click();
    await waitFor(async () => window.webContents.executeJavaScript(`document.getElementById('eventsView').classList.contains('active-view')`), 'The TRECS menu did not open Event Workflow.');
    await window.webContents.executeJavaScript(`loadEventWorkflow(${eventJobId}, ${entry.id})`);
    await waitFor(async () => window.webContents.executeJavaScript(`Boolean(document.querySelector('#eventPhotoPreview img')) && Boolean(document.querySelector('#eventFallPreview img'))`), 'The menu-opened event workflow did not restore both previews.');
    const menu = await inspectEventView(window);

    await window.webContents.executeJavaScript(`document.getElementById('linkEventFallJobButton').click()`);
    await waitFor(async () => window.webContents.executeJavaScript(`document.getElementById('eventSetupStatus').textContent.includes('linked')`), 'The lock-protected fall-job link action did not complete.');
    const sessions = await window.webContents.executeJavaScript('window.trecs.getJobSessions()');
    const lockIntegrated = sessions.some((session) => Number(session.jobId) === eventJobId);

    window.show();
    window.focus();
    await window.webContents.executeJavaScript(`setView('events'); loadEventWorkflow(${eventJobId}, ${entry.id})`);
    await waitFor(async () => window.webContents.executeJavaScript(`document.getElementById('eventsView').classList.contains('active-view') && Boolean(document.querySelector('#eventPhotoPreview img')) && Boolean(document.querySelector('#eventFallPreview img'))`), 'The final event workflow layout did not finish rendering.');
    await wait(600);
    fs.mkdirSync(outputFolder, { recursive: true });
    const screenshotPath = path.join(outputFolder, 'event-workflow.png');
    fs.writeFileSync(screenshotPath, (await window.webContents.capturePage()).toPNG());

    const backend = {
      imported: imported.imported === 1 && imported.total === 1,
      queueCount: setup.queue.length,
      confirmationRequired,
      savedStatus: saved.status,
      storedSubjectId: storedLink?.subjectId || null,
      storedOrderId: storedLink?.orderId || null,
      storedPackageCodes: storedLink?.packageCodes || '',
      paidStatus: storedLink?.paidStatus || ''
    };
    const pass = backend.imported && backend.queueCount === 1 && backend.confirmationRequired
      && backend.savedStatus === 'coded' && Number(backend.storedSubjectId) === Number(fixture.subject.id)
      && Number(backend.storedOrderId) > 0 && backend.storedPackageCodes === '1' && backend.paidStatus === 'paid'
      && sidebar.active && sidebar.title === 'Events' && sidebar.eventJobId === eventJobId
      && sidebar.fallJobId === Number(fixture.job.id) && sidebar.queueCards === 1 && sidebar.activeQueueCards === 1
      && sidebar.eventPreview && sidebar.fallPreview && sidebar.candidateCount === 1 && sidebar.existingLinks === 1
      && sidebar.currentStatus.toLowerCase() === 'order coded' && sidebar.hasIdentityConfirmation && sidebar.hasOrderEntry
      && sidebar.orderCodes === '1' && sidebar.hasFastImageJump && sidebar.hasFilters && sidebar.hasAddPerson
      && menu.active && menu.eventJobId === eventJobId && menu.eventPreview && menu.fallPreview && lockIntegrated;
    report = {
      pass,
      screenshotPath,
      fallFixture: { jobId: fixture.job.id, job: fixture.job.job, subjectId: fixture.subject.id, ref: fixture.subject.ref, name: fixture.subject.name },
      backend,
      sidebar,
      menu,
      menuItemFound: true,
      lockIntegrated
    };
    fs.writeFileSync(path.join(outputFolder, 'event-workflow-report.json'), JSON.stringify(report, null, 2));
  } finally {
    if (eventJobId) {
      try { await window.webContents.executeJavaScript(`window.trecs.releaseJobSession([${eventJobId}])`); } catch (_error) { /* Cleanup continues. */ }
    }
    restoreFile(databasePath, databaseBackup);
    restoreFile(programDatabasePath, programDatabaseBackup);
    removeTemporaryRoot();
  }

  console.log(JSON.stringify(report, null, 2));
  app.exit(report?.pass ? 0 : 1);
}

app.whenReady().then(run).catch((error) => {
  console.error(error);
  try { removeTemporaryRoot(); } catch (cleanupError) { console.error(cleanupError); }
  app.exit(1);
});
