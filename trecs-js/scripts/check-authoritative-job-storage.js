const fs = require('fs');
const path = require('path');

const workspaceRoot = path.resolve(__dirname, '../..');
const temporaryRoot = path.join(workspaceRoot, 'exports', '_database-authority-smoke');
const allowedParent = path.join(workspaceRoot, 'exports');
const resultPath = path.join(workspaceRoot, 'exports', '_database-authority-smoke-result.json');
let diagnostics = {};

function writeFailure(error) {
  fs.mkdirSync(path.dirname(resultPath), { recursive: true });
  fs.writeFileSync(resultPath, JSON.stringify({ ok: false, error: error?.stack || error?.message || String(error), diagnostics }, null, 2));
}

process.on('uncaughtException', writeFailure);
process.on('unhandledRejection', writeFailure);

function removeTemporaryRoot() {
  if (path.dirname(temporaryRoot) !== allowedParent || path.basename(temporaryRoot) !== '_database-authority-smoke') {
    throw new Error(`Refusing to remove unexpected test path: ${temporaryRoot}`);
  }
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}

removeTemporaryRoot();
fs.mkdirSync(temporaryRoot, { recursive: true });
process.env.TRECS_DATA_ROOT = temporaryRoot;
process.env.TRECS_UI_TEST = '1';
fs.writeFileSync(resultPath, JSON.stringify({ ok: false, stage: 'starting' }, null, 2));

const { app, BrowserWindow, nativeImage } = require('electron');
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

function rows(database, sql) {
  const result = database.exec(sql);
  return result[0]?.values || [];
}

async function run() {
  try {
    const window = await waitForWindow();
    const client = await window.webContents.executeJavaScript(`window.trecs.createClient(${JSON.stringify({
      displayName: 'AUTHORITY TEST SCHOOL',
      trecsName: 'Authority Test School'
    })})`);
    const job = await window.webContents.executeJavaScript(`window.trecs.createJob(${JSON.stringify({
      clientId: client.id,
      name: 'FALL 2026',
      type: 'fall'
    })})`);
    const subject = await window.webContents.executeJavaScript(`window.trecs.createSubject(${Number(job.id)}, ${JSON.stringify({
      ref: '10001',
      firstName: 'TEST',
      lastName: 'STUDENT',
      grade: '3',
      homeroom: 'TEACHER'
    })})`);
    const secondJob = await window.webContents.executeJavaScript(`window.trecs.createJob(${JSON.stringify({
      clientId: client.id,
      name: 'SPRING 2027',
      type: 'spring'
    })})`);
    const secondSubject = await window.webContents.executeJavaScript(`window.trecs.createSubject(${Number(secondJob.id)}, ${JSON.stringify({
      ref: '20001',
      firstName: 'SECOND',
      lastName: 'STUDENT',
      grade: '4',
      homeroom: 'OTHER TEACHER'
    })})`);
    const onsiteSetup = await window.webContents.executeJavaScript(`window.trecs.prepareLaptopPackage(${Number(job.id)})`);
    const baselinePath = path.join(temporaryRoot, job.rootPath, 'Database', 'onsite-start.db');
    fs.copyFileSync(onsiteSetup.databasePath, baselinePath);
    const endOfDayPreview = await window.webContents.executeJavaScript(`window.trecs.getEndOfDayPreview(${Number(job.id)})`);
    if (!endOfDayPreview.hasBaseline || endOfDayPreview.counts.editedSubjects !== 0) {
      throw new Error(JSON.stringify({ endOfDayPreview }));
    }

    const SQL = await initSqlJs({ locateFile: (file) => path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', file) });
    const programPath = path.join(temporaryRoot, 'database', 'ProgramData.db');
    const jobPath = path.join(temporaryRoot, job.rootPath, 'Database', 'job.db');
    const secondJobPath = path.join(temporaryRoot, secondJob.rootPath, 'Database', 'job.db');
    const programDatabase = new SQL.Database(fs.readFileSync(programPath));
    const jobDatabase = new SQL.Database(fs.readFileSync(jobPath));
    const secondJobDatabase = new SQL.Database(fs.readFileSync(secondJobPath));
    const programTables = new Set(rows(programDatabase, "SELECT name FROM sqlite_master WHERE type = 'table';").map(([name]) => name));
    const forbiddenProgramTables = ['subjects', 'image_assets', 'orders', 'capture_sessions', 'envelope_scans'];
    const misplaced = forbiddenProgramTables.filter((name) => programTables.has(name));
    const clientCount = Number(rows(programDatabase, 'SELECT COUNT(*) FROM clients;')[0]?.[0] || 0);
    const jobCount = Number(rows(programDatabase, 'SELECT COUNT(*) FROM jobs;')[0]?.[0] || 0);
    const subjectCount = Number(rows(jobDatabase, 'SELECT COUNT(*) FROM subjects;')[0]?.[0] || 0);
    const secondSubjectCount = Number(rows(secondJobDatabase, 'SELECT COUNT(*) FROM subjects;')[0]?.[0] || 0);
    const storedSubject = rows(jobDatabase, `SELECT legacy_ref_num, first_name, last_name FROM subjects WHERE id = ${Number(subject.id)};`)[0];
    const storedSecondSubject = rows(secondJobDatabase, `SELECT legacy_ref_num, first_name, last_name FROM subjects WHERE id = ${Number(secondSubject.id)};`)[0];
    programDatabase.close();
    jobDatabase.close();
    secondJobDatabase.close();

    if (misplaced.length || clientCount !== 1 || jobCount !== 2 || subjectCount !== 1 || secondSubjectCount !== 1 || !storedSubject || !storedSecondSubject) {
      throw new Error(JSON.stringify({ misplaced, clientCount, jobCount, subjectCount, secondSubjectCount, storedSubject, storedSecondSubject }));
    }

    const realisticStress = process.env.TRECS_CAPTURE_STRESS === '1';
    const captureStressImages = realisticStress ? Math.max(2, Number(process.env.TRECS_CAPTURE_STRESS_IMAGES || 12)) : 60;
    const extraSubjectsPerJob = realisticStress ? 2500 : 0;
    if (realisticStress) {
      for (const [fixturePath, fixtureJobId] of [[jobPath, Number(job.id)], [secondJobPath, Number(secondJob.id)]]) {
        const database = new SQL.Database(fs.readFileSync(fixturePath));
        const firstId = Number(rows(database, 'SELECT COALESCE(MAX(id), 0) + 1 FROM subjects;')[0][0]);
        database.run('BEGIN');
        const insert = database.prepare('INSERT INTO subjects (id, job_id, legacy_ref_num, first_name, last_name, grade, homeroom) VALUES (?, ?, ?, ?, ?, ?, ?)');
        for (let index = 0; index < extraSubjectsPerJob; index += 1) insert.run([firstId + index, fixtureJobId, `STRESS-${index}`, 'Synthetic', `Student ${index}`, String(index % 12), `Room ${index % 80}`]);
        insert.free(); database.run('COMMIT');
        fs.writeFileSync(fixturePath, Buffer.from(database.export())); database.close();
      }
    }
    const fixtureWidth = realisticStress ? 6000 : 480;
    const fixtureHeight = realisticStress ? 4000 : 600;
    const bitmap = Buffer.alloc(fixtureWidth * fixtureHeight * 4, 255);
    for (let index = 0; index < bitmap.length; index += 4) {
      const shade = ((index * 1103515245) >>> 16) & 255;
      bitmap[index] = shade; bitmap[index + 1] = (shade + 60) % 256; bitmap[index + 2] = (shade + 120) % 256;
    }
    const fixtureJpeg = nativeImage.createFromBitmap(bitmap, { width: fixtureWidth, height: fixtureHeight }).toJPEG(realisticStress ? 93 : 75);
    if (nativeImage.createFromBuffer(fixtureJpeg).isEmpty()) throw new Error('Could not create the decodable camera fixture.');
    const fixtureRaw = realisticStress ? Buffer.alloc(25 * 1024 * 1024, 0x5a) : Buffer.from([0x49, 0x49, 0x2a, 0x00]);
    const captureHotFolder = path.join(temporaryRoot, 'CaptureHotFolder');
    fs.mkdirSync(captureHotFolder, { recursive: true });
    await window.webContents.executeJavaScript(
      `window.trecs.startCaptureWatcher(${Number(job.id)}, ${Number(subject.id)}, ${JSON.stringify({ fileMode: 'jpg_raw', shootStage: 'main' })})`
    );
    const programBeforeCapture = fs.readFileSync(programPath);
    const programMtimeBeforeCapture = fs.statSync(programPath).mtimeMs;
    const secondJobBeforeCapture = fs.readFileSync(secondJobPath);
    const secondJobMtimeBeforeCapture = fs.statSync(secondJobPath).mtimeMs;
    for (let index = 1; index <= captureStressImages; index += 1) {
      const baseName = `stress-${String(index).padStart(3, '0')}`;
      const imagePath = path.join(captureHotFolder, `${baseName}.jpg`);
      const rawPath = path.join(captureHotFolder, `${baseName}.cr3`);
      fs.writeFileSync(imagePath, fixtureJpeg);
      fs.writeFileSync(rawPath, fixtureRaw);
      const stableTime = new Date(Date.now() - 2000);
      fs.utimesSync(imagePath, stableTime, stableTime);
      fs.utimesSync(rawPath, stableTime, stableTime);
    }

    let capturedImages = [];
    const captureStartedAt = Date.now();
    const mainThreadDelays = [];
    let previousTick = performance.now();
    const heartbeat = setInterval(() => { const now = performance.now(); mainThreadDelays.push(Math.max(0, now - previousTick - 25)); previousTick = now; }, 25);
    const captureDeadline = Date.now() + (realisticStress ? 240000 : 90000);
    while (Date.now() < captureDeadline) {
      capturedImages = await window.webContents.executeJavaScript(
        `window.trecs.getCaptureSubjectImages(${Number(job.id)}, ${Number(subject.id)}, {metadataOnly: true})`
      );
      if (capturedImages.length === captureStressImages) break;
      await wait(250);
    }
    clearInterval(heartbeat);
    const captureElapsedMs = Date.now() - captureStartedAt;
    await window.webContents.executeJavaScript('window.trecs.stopCaptureWatcher()');
    if (capturedImages.length !== captureStressImages) {
      throw new Error(JSON.stringify({ expectedCaptureImages: captureStressImages, captureImageCount: capturedImages.length }));
    }
    const programChangedByCapture = !programBeforeCapture.equals(fs.readFileSync(programPath)) || programMtimeBeforeCapture !== fs.statSync(programPath).mtimeMs;
    const secondJobChangedByCapture = !secondJobBeforeCapture.equals(fs.readFileSync(secondJobPath)) || secondJobMtimeBeforeCapture !== fs.statSync(secondJobPath).mtimeMs;
    if (programChangedByCapture || secondJobChangedByCapture) throw new Error(JSON.stringify({ programChangedByCapture, secondJobChangedByCapture }));
    diagnostics = { realisticStress, captureStressImages, captureElapsedMs, averageCaptureMs: Math.round(captureElapsedMs / captureStressImages), programChangedByCapture, secondJobChangedByCapture,
      fixture: { width: fixtureWidth, height: fixtureHeight, jpegBytes: fixtureJpeg.length, rawBytes: fixtureRaw.length },
      mainThreadDelayP95Ms: Math.round(mainThreadDelays.sort((a, b) => a - b)[Math.floor(mainThreadDelays.length * 0.95)] || 0), mainThreadDelayMaxMs: Math.round(Math.max(0, ...mainThreadDelays)) };

    const captureReadIterations = realisticStress ? 30 : 150;
    let maximumDecodedCapturePreviews = 0;
    const previewReadTimings = [];
    for (let iteration = 0; iteration < captureReadIterations; iteration += 1) {
      const readStartedAt = performance.now();
      const captureImages = await window.webContents.executeJavaScript(
        `window.trecs.getCaptureSubjectImages(${Number(job.id)}, ${Number(subject.id)})`
      );
      previewReadTimings.push(performance.now() - readStartedAt);
      const decodedPreviews = captureImages.filter((image) => Boolean(image.dataUrl)).length;
      maximumDecodedCapturePreviews = Math.max(maximumDecodedCapturePreviews, decodedPreviews);
      if (decodedPreviews < 1 || decodedPreviews > 2) throw new Error(JSON.stringify({ iteration, decodedPreviews, expected: 'one or two decodable previews' }));
      if (captureImages.length !== captureStressImages) {
        throw new Error(JSON.stringify({ iteration, captureImageCount: captureImages.length }));
      }
    }

    const collisionPackage = path.join(temporaryRoot, 'collision-end-of-day');
    const collisionPackageDatabaseFolder = path.join(collisionPackage, 'Database');
    const collisionPackageImagesFolder = path.join(collisionPackage, 'Images');
    fs.mkdirSync(collisionPackageDatabaseFolder, { recursive: true });
    fs.mkdirSync(collisionPackageImagesFolder, { recursive: true });
    const collisionImageName = '20001-collision.jpg';
    fs.writeFileSync(path.join(collisionPackageImagesFolder, collisionImageName), fixtureJpeg);
    const collisionDatabase = new SQL.Database(fs.readFileSync(secondJobPath));
    collisionDatabase.run(`
      INSERT INTO image_assets (id, job_id, current_path, original_path, filename, source, status, captured_at)
      VALUES (1, ?, ?, ?, ?, 'capture_hot_folder', 'imported', CURRENT_TIMESTAMP);
    `, [Number(secondJob.id), collisionImageName, collisionImageName, collisionImageName]);
    collisionDatabase.run(`
      INSERT INTO image_versions (id, image_asset_id, version_type, path)
      VALUES (1, 1, 'original', ?);
    `, [collisionImageName]);
    collisionDatabase.run(`
      INSERT INTO subject_images (id, subject_id, image_asset_id, role, selected, sort_order)
      VALUES (1, ?, 1, 'capture', 1, 0);
    `, [Number(secondSubject.id)]);
    collisionDatabase.run(`
      UPDATE subjects
      SET primary_image_asset_id = 1,
          photographed_status = 'photographed'
      WHERE id = ?;
    `, [Number(secondSubject.id)]);
    fs.writeFileSync(path.join(collisionPackageDatabaseFolder, 'job.db'), Buffer.from(collisionDatabase.export()));
    collisionDatabase.close();
    fs.writeFileSync(path.join(collisionPackage, 'end-of-day-manifest.json'), JSON.stringify({
      packageType: 'end_of_day',
      createdAt: new Date().toISOString(),
      job: {
        id: Number(secondJob.id),
        name: secondJob.name,
        rootPath: secondJob.rootPath,
        clientName: 'AUTHORITY TEST SCHOOL'
      },
      counts: { capturedImages: 1, rawFiles: 0 },
      copiedImages: [{ imageAssetId: 1, jpgPath: `Images/${collisionImageName}`, rawPath: null, selected: true }],
      subjectChanges: { newSubjects: [], editedSubjects: [], deletedSubjects: [] },
      paths: { database: 'Database/job.db', images: 'Images', rawImages: 'Images' }
    }, null, 2));
    const collisionImport = await window.webContents.executeJavaScript(
      `window.trecs.approveEndOfDayPackage(${JSON.stringify({ packageFolder: collisionPackage, adjustments: {} })})`
    );
    const firstJobAfterCollision = new SQL.Database(fs.readFileSync(jobPath));
    const secondJobAfterCollision = new SQL.Database(fs.readFileSync(secondJobPath));
    const firstJobImageCountAfterCollision = Number(rows(firstJobAfterCollision, 'SELECT COUNT(*) FROM image_assets;')[0]?.[0] || 0);
    const importedCollisionImage = rows(secondJobAfterCollision, `
      SELECT ia.id, ia.job_id, ia.current_path, s.primary_image_asset_id
      FROM image_assets ia
      JOIN subjects s ON s.primary_image_asset_id = ia.id
      WHERE s.id = ${Number(secondSubject.id)};
    `)[0];
    const foreignPreviewPath = rows(firstJobAfterCollision, 'SELECT current_path FROM image_assets ORDER BY id LIMIT 1;')[0]?.[0];
    const importedCollisionImageId = Number(importedCollisionImage?.[0]);
    secondJobAfterCollision.run(`
      INSERT INTO image_versions (image_asset_id, version_type, path, width, height)
      VALUES (?, 'cropped_med', ?, 640, 800);
    `, [importedCollisionImageId, foreignPreviewPath]);
    fs.writeFileSync(secondJobPath, Buffer.from(secondJobAfterCollision.export()));
    firstJobAfterCollision.close();
    secondJobAfterCollision.close();
    if (firstJobImageCountAfterCollision !== captureStressImages
      || !importedCollisionImage
      || Number(importedCollisionImage[0]) === 1
      || Number(importedCollisionImage[1]) !== Number(secondJob.id)
      || Number(importedCollisionImage[0]) !== Number(importedCollisionImage[3])) {
      throw new Error(JSON.stringify({ firstJobImageCountAfterCollision, importedCollisionImage, collisionImport }));
    }

    const isolatedPreview = await window.webContents.executeJavaScript(
      `window.trecs.getImagePreview(${Number(secondJob.id)}, ${importedCollisionImageId})`
    );
    if (!isolatedPreview
      || isolatedPreview.versionType !== 'original'
      || isolatedPreview.path === foreignPreviewPath) {
      throw new Error(JSON.stringify({ isolatedPreview, foreignPreviewPath }));
    }

    await window.webContents.executeJavaScript(`window.trecs.createSubject(${Number(secondJob.id)}, ${JSON.stringify({
      ref: '20002',
      firstName: 'ISOLATION',
      lastName: 'CHECK'
    })})`);
    const secondJobAfterIsolationSave = new SQL.Database(fs.readFileSync(secondJobPath));
    const foreignVersionsAfterSave = Number(rows(secondJobAfterIsolationSave, `
      SELECT COUNT(*)
      FROM image_versions
      WHERE path = ${JSON.stringify(foreignPreviewPath)};
    `)[0]?.[0] || 0);
    secondJobAfterIsolationSave.close();
    if (foreignVersionsAfterSave !== 0) {
      throw new Error(JSON.stringify({ foreignVersionsAfterSave, foreignPreviewPath }));
    }

    const firstJobBytesBeforeDetail = fs.readFileSync(jobPath);
    const secondJobBytesBeforeDetail = fs.readFileSync(secondJobPath);
    const jobDetailReadStartedAt = Date.now();
    const readOnlyJobDetail = await window.webContents.executeJavaScript(`window.trecs.getJobDetail(${Number(job.id)})`);
    const jobDetailReadMs = Date.now() - jobDetailReadStartedAt;
    const detailChangedFirstJob = !firstJobBytesBeforeDetail.equals(fs.readFileSync(jobPath));
    const detailChangedSecondJob = !secondJobBytesBeforeDetail.equals(fs.readFileSync(secondJobPath));
    if (detailChangedFirstJob) {
      const before = new SQL.Database(firstJobBytesBeforeDetail);
      const after = new SQL.Database(fs.readFileSync(jobPath));
      diagnostics.detailTableChanges = rows(after, "SELECT name FROM sqlite_master WHERE type = 'table'").map(([name]) => {
        const query = `SELECT * FROM "${String(name).replace(/"/g, '""')}"`;
        const oldRows = rows(before, query); const newRows = rows(after, query);
        return JSON.stringify(oldRows) === JSON.stringify(newRows) ? null : { table: name, before: oldRows.slice(0, 2), after: newRows.slice(0, 2), beforeCount: oldRows.length, afterCount: newRows.length };
      }).filter(Boolean);
      before.close(); after.close();
    }
    if (!readOnlyJobDetail?.summary
      || Number(readOnlyJobDetail.summary.id) !== Number(job.id)
      || detailChangedFirstJob
      || detailChangedSecondJob) {
      throw new Error(JSON.stringify({
        detailJobId: readOnlyJobDetail?.summary?.id,
        detailChangedFirstJob,
        detailChangedSecondJob
      }));
    }

    const recoveryBytes = fs.readFileSync(jobPath);
    await require('../src/main/storage-safety').atomicWriteFile(jobPath, recoveryBytes, { backup: true, backupIntervalMs: 0 });
    const backupList = await window.webContents.executeJavaScript(`window.trecs.listStorageBackups(${Number(job.id)})`);
    const recoveryBackup = backupList.backups.find((backup) => fs.readFileSync(backup.path).equals(recoveryBytes));
    if (!recoveryBackup) throw new Error('The expected recovery checkpoint was not listed.');
    fs.rmSync(jobPath, { force: true });
    let missingDatabaseBlocked = false;
    try { await window.webContents.executeJavaScript(`window.trecs.getJobDetail(${Number(job.id)})`); }
    catch (error) { missingDatabaseBlocked = /database|backup|restore/i.test(error.message); }
    if (!missingDatabaseBlocked || fs.existsSync(jobPath)) throw new Error('A missing job with recovery backups must not silently become an empty database.');
    const restoreResult = await window.webContents.executeJavaScript(`window.trecs.restoreStorageBackup(${JSON.stringify({ jobId: Number(job.id), backupPath: recoveryBackup.path })})`);
    const restoredJobDetail = await window.webContents.executeJavaScript(`window.trecs.getJobDetail(${Number(job.id)})`);
    const untouchedJobDetail = await window.webContents.executeJavaScript(`window.trecs.getJobDetail(${Number(secondJob.id)})`);
    if (!restoreResult.restored || restoredJobDetail.subjects.length !== 1 + extraSubjectsPerJob || untouchedJobDetail.subjects.length !== 2 + extraSubjectsPerJob || !fs.existsSync(jobPath)) {
      throw new Error(JSON.stringify({
        restoredSubjects: restoredJobDetail.subjects.length,
        untouchedSubjects: untouchedJobDetail.subjects.length,
        restoredDatabase: fs.existsSync(jobPath)
      }));
    }

    await new Promise((resolve) => {
      window.webContents.once('did-finish-load', resolve);
      window.reload();
    });
    const dashboardOpenResult = await window.webContents.executeJavaScript(`new Promise((resolve) => {
      const deadline = Date.now() + 15000;
      let opened = false;
      const inspect = () => {
        const row = document.querySelector('[data-dashboard-job-id="${Number(secondJob.id)}"]');
        if (!opened && row) {
          opened = true;
          row.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
        }
        const workspace = document.getElementById('jobStudentWorkspace');
        const jobsView = document.getElementById('jobsView');
        const workspaceTitle = document.getElementById('workspaceJobTitle')?.textContent || '';
        if (opened && workspace && !workspace.hidden && jobsView?.classList.contains('active-view')) {
          resolve({ ok: true, workspaceTitle });
          return;
        }
        if (Date.now() >= deadline) {
          resolve({
            ok: false,
            rowFound: Boolean(row),
            workspaceHidden: workspace?.hidden,
            jobsViewActive: jobsView?.classList.contains('active-view'),
            workspaceTitle
          });
          return;
        }
        setTimeout(inspect, 50);
      };
      inspect();
    })`);
    if (!dashboardOpenResult.ok || !dashboardOpenResult.workspaceTitle.includes(secondJob.name)) {
      throw new Error(JSON.stringify({ dashboardOpenResult }));
    }

    const report = {
      programTables: programTables.size,
      programClients: clientCount,
      programJobs: jobCount,
      firstJobSubjects: subjectCount,
      secondJobSubjects: secondSubjectCount,
      onsiteSetupDatabase: onsiteSetup.databasePath,
      endOfDayHasBaseline: endOfDayPreview.hasBaseline,
      captureStressImages,
      captureReadIterations,
      maximumDecodedCapturePreviews,
      programDataWritesDuringCapture: 0,
      unrelatedJobWritesDuringCapture: 0,
      realisticStress,
      extraSubjectsPerJob,
      fixture: { width: fixtureWidth, height: fixtureHeight, jpegBytes: fixtureJpeg.length, rawBytes: fixtureRaw.length },
      captureElapsedMs,
      averageCaptureMs: Math.round(captureElapsedMs / captureStressImages),
      previewReadAverageMs: Math.round(previewReadTimings.reduce((sum, value) => sum + value, 0) / previewReadTimings.length),
      mainThreadDelayP95Ms: Math.round(mainThreadDelays.sort((a, b) => a - b)[Math.floor(mainThreadDelays.length * 0.95)] || 0),
      mainThreadDelayMaxMs: Math.round(Math.max(0, ...mainThreadDelays)),
      collisionImageRemappedTo: Number(importedCollisionImage[0]),
      isolatedPreviewVersion: isolatedPreview.versionType,
      foreignVersionsAfterSave,
      jobDetailReadMs,
      jobDetailDatabaseWrites: 0,
      dashboardDoubleClickJob: dashboardOpenResult.workspaceTitle,
      missingDatabaseBlocked,
      restoredJobSubjects: restoredJobDetail.subjects.length,
      untouchedJobSubjects: untouchedJobDetail.subjects.length,
      jobDatabases: [jobPath, secondJobPath]
    };
    fs.writeFileSync(resultPath, JSON.stringify({ ok: true, report }, null, 2));
    console.log(JSON.stringify(report, null, 2));
    app.exit(0);
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
