const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const workspaceRoot = path.resolve(__dirname, '../..');
const fixtureRoot = fs.mkdtempSync(path.join(workspaceRoot, 'exports', '_eod-roundtrip-'));
const resultPath = path.join(workspaceRoot, 'exports', '_eod-roundtrip-result.json');
process.env.TRECS_DATA_ROOT = fixtureRoot;
process.env.TRECS_UI_TEST = '1';
const { app, BrowserWindow, nativeImage } = require('electron');
require('../src/main/main.js');
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function run() {
  let window;
  for (let count = 0; count < 200; count += 1) {
    window = BrowserWindow.getAllWindows()[0];
    if (window && !window.webContents.isLoading()) break;
    await wait(100);
  }
  const call = (name, ...args) => window.webContents.executeJavaScript(`window.trecs[${JSON.stringify(name)}](...${JSON.stringify(args)})`);
  const client = await call('createClient', { displayName: 'EOD TEST', trecsName: 'EOD Test' });
  const job = await call('createJob', { clientId: client.id, name: 'Fall 2026', type: 'fall' });
  const student = await call('createSubject', job.id, { ref: '0001', firstName: 'Test', lastName: 'Student', grade: '3' });
  const setup = await call('prepareLaptopPackage', job.id);
  fs.copyFileSync(setup.databasePath, path.join(fixtureRoot, job.rootPath, 'Database', 'onsite-start.db'));
  await call('updateSubjectNotes', student.id, 'Onsite note');
  await call('startCaptureWatcher', job.id, student.id, { fileMode: 'jpg_raw', shootStage: 'main' });
  const captureFolder = path.join(fixtureRoot, 'CaptureHotFolder');
  const jpeg = nativeImage.createFromBitmap(Buffer.alloc(100 * 100 * 4, 180), { width: 100, height: 100 }).toJPEG(80);
  assert.ok(jpeg.length > 0);
  fs.writeFileSync(path.join(captureFolder, 'frame.jpg'), jpeg);
  fs.writeFileSync(path.join(captureFolder, 'frame.cr3'), 'raw fixture bytes');
  let images = [];
  for (let count = 0; count < 120; count += 1) {
    images = await call('getCaptureSubjectImages', job.id, student.id, { metadataOnly: true });
    if (images.length === 1) break;
    await wait(200);
  }
  assert.equal(images.length, 1);
  for (let count = 0; count < 60; count += 1) {
    if ((await call('getEndOfDayPreview', job.id)).counts.capturedImages === 1) break;
    await wait(100);
  }
  await call('stopCaptureWatcher');
  const capturedPath = path.join(fixtureRoot, images[0].currentPath);
  const rawPath = path.join(fixtureRoot, images[0].rawPath);
  const rawBytes = fs.readFileSync(rawPath);
  fs.unlinkSync(rawPath);
  await assert.rejects(call('createEndOfDayPackage', job.id, {}), /Captured file is missing/);
  assert.ok(fs.existsSync(capturedPath), 'failed package must retain original JPG');
  fs.writeFileSync(rawPath, rawBytes);
  const originalUnlink = fs.promises.unlink;
  fs.promises.unlink = async (filename) => {
    if (path.resolve(filename) === path.resolve(capturedPath)) throw new Error('Injected locked source file');
    return originalUnlink.call(fs.promises, filename);
  };
  let eod;
  try { eod = await call('createEndOfDayPackage', job.id, {}); } finally { fs.promises.unlink = originalUnlink; }
  assert.equal(eod.counts.retainedFiles.length, 1);
  assert.ok(fs.existsSync(capturedPath));
  const recovered = await call('createEndOfDayPackage', job.id, {});
  assert.equal(recovered.recovered, true);
  assert.equal(recovered.packagePath, eod.packagePath);
  assert.ok(!fs.existsSync(capturedPath));
  const manifest = JSON.parse(fs.readFileSync(eod.manifestPath, 'utf8'));
  assert.equal(manifest.state, 'complete');
  assert.ok(manifest.packageId && manifest.copiedImages[0].rawIntegrity.sha256);
  await call('loadOnsiteSetup', { setupFolder: setup.packagePath });
  await call('updateSubjectNotes', student.id, 'Office note');
  const review = await call('reviewEndOfDayImport', { packageFolder: eod.packagePath });
  assert.equal(review.conflicts.length, 1);
  const blocked = await call('approveEndOfDayPackage', { packageFolder: eod.packagePath });
  assert.equal(blocked.requiresReview, true);
  const approved = await call('approveEndOfDayPackage', { packageFolder: eod.packagePath, resolutions: [{ key: `${student.id}:notes`, choice: 'keep', expectedCurrent: 'Office note' }] });
  assert.equal(approved.counts.images, 1);
  assert.equal(approved.counts.copiedFiles, 2);
  const imported = (await call('getCaptureSubjectImages', job.id, student.id, { metadataOnly: true }))[0];
  assert.ok(fs.existsSync(path.join(fixtureRoot, imported.currentPath)));
  assert.ok(fs.existsSync(path.join(fixtureRoot, imported.rawPath)));
  assert.ok(!path.resolve(fixtureRoot, imported.rawPath).startsWith(path.resolve(eod.packagePath)));
  const renamed = `${eod.packagePath}-renamed`;
  fs.renameSync(eod.packagePath, renamed);
  await assert.rejects(call('approveEndOfDayPackage', { packageFolder: renamed, resolutions: [{ key: `${student.id}:notes`, choice: 'keep', expectedCurrent: 'Office note' }] }), /already been loaded/);
  const editOnly = await call('createEndOfDayPackage', job.id, {});
  const beforeEdit = await call('getJobDetail', job.id);
  await call('approveEndOfDayPackage', { packageFolder: editOnly.packagePath });
  const afterEdit = await call('getCaptureSubjectImages', job.id, student.id, { metadataOnly: true });
  assert.equal(afterEdit.find((row) => row.selected).id, imported.id);
  await call('setImageRejected', imported.id, true);
  const actions = await call('listPhotoAssignmentActions', job.id);
  assert.equal(actions[0].action, 'reject');
  await call('undoPhotoAssignmentAction', { jobId: job.id, actionId: actions[0].id });
  assert.equal((await call('getCaptureSubjectImages', job.id, student.id, { metadataOnly: true }))[0].selected, 1);
  const integrity = await call('inspectPhotoIntegrity', job.id);
  assert.equal(integrity.totalIssues, 0, JSON.stringify(integrity));
  const backups = await call('listStorageBackups', job.id);
  assert.ok(backups.backups.length);
  const ui = await window.webContents.executeJavaScript(`({ recoveryScript: !!document.querySelector('script[src="./recovery.js"]'), recoveryDialog: !!document.querySelector('.recovery-dialog'), recoveryButton: [...document.querySelectorAll('.sidebar button')].some(b => b.textContent === 'Photo Integrity & Recovery') })`);
  assert.ok(ui.recoveryScript && ui.recoveryDialog && ui.recoveryButton);
  await window.webContents.executeJavaScript(`[...document.querySelectorAll('.sidebar button')].find(b => b.textContent === 'Photo Integrity & Recovery').click()`);
  for (let count = 0; count < 50; count += 1) {
    if (await window.webContents.executeJavaScript(`!!document.querySelector('[data-recovery-job] option[value="${job.id}"]')`)) break;
    await wait(100);
  }
  assert.ok(await window.webContents.executeJavaScript(`!!document.querySelector('[data-recovery-job] option[value="${job.id}"]')`), 'recovery job picker contains the current job');
  await window.webContents.executeJavaScript(`document.querySelector('[data-recovery-job]').value = '${job.id}'; document.querySelector('[data-recovery-scan]').click()`);
  for (let count = 0; count < 50; count += 1) {
    if (await window.webContents.executeJavaScript(`document.querySelector('[data-recovery-body]').textContent.includes('0 issues found')`)) break;
    await wait(100);
  }
  assert.ok(await window.webContents.executeJavaScript(`document.querySelector('[data-recovery-body]').textContent.includes('0 issues found')`), 'recovery scan renders results');
  return { packageRecovery: true, conflictReview: true, permanentJpgAndRaw: true, renamedPackageDedup: true, editOnlyPrimaryPreserved: true, auditedUndo: true, integrityIssues: integrity.totalIssues, backups: backups.backups.length, ui };
}
app.whenReady().then(run).then((report) => {
  fs.writeFileSync(resultPath, JSON.stringify({ ok: true, report, fixtureRoot }, null, 2));
  console.log(JSON.stringify(report, null, 2));
  app.exit(0);
}).catch((error) => {
  fs.writeFileSync(resultPath, JSON.stringify({ ok: false, error: error.stack, fixtureRoot }, null, 2));
  console.error(error);
  app.exit(1);
});
