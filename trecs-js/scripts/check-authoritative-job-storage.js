const fs = require('fs');
const path = require('path');

const workspaceRoot = path.resolve(__dirname, '../..');
const temporaryRoot = path.join(workspaceRoot, 'exports', '_database-authority-smoke');
const allowedParent = path.join(workspaceRoot, 'exports');
const resultPath = path.join(workspaceRoot, 'exports', '_database-authority-smoke-result.json');

function writeFailure(error) {
  fs.mkdirSync(path.dirname(resultPath), { recursive: true });
  fs.writeFileSync(resultPath, JSON.stringify({ ok: false, error: error?.stack || error?.message || String(error) }, null, 2));
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

const { app, BrowserWindow } = require('electron');
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

    const captureStressImages = 60;
    const captureHotFolder = path.join(temporaryRoot, 'CaptureHotFolder');
    fs.mkdirSync(captureHotFolder, { recursive: true });
    await window.webContents.executeJavaScript(
      `window.trecs.startCaptureWatcher(${Number(job.id)}, ${Number(subject.id)}, ${JSON.stringify({ fileMode: 'jpg_raw', shootStage: 'main' })})`
    );
    for (let index = 1; index <= captureStressImages; index += 1) {
      const baseName = `stress-${String(index).padStart(3, '0')}`;
      const imagePath = path.join(captureHotFolder, `${baseName}.jpg`);
      const rawPath = path.join(captureHotFolder, `${baseName}.cr3`);
      fs.writeFileSync(imagePath, Buffer.from([0xff, 0xd8, 0xff, 0xd9]));
      fs.writeFileSync(rawPath, Buffer.from([0x49, 0x49, 0x2a, 0x00]));
      const stableTime = new Date(Date.now() - 2000);
      fs.utimesSync(imagePath, stableTime, stableTime);
      fs.utimesSync(rawPath, stableTime, stableTime);
    }

    let capturedImages = [];
    const captureDeadline = Date.now() + 90000;
    while (Date.now() < captureDeadline) {
      capturedImages = await window.webContents.executeJavaScript(
        `window.trecs.getCaptureSubjectImages(${Number(job.id)}, ${Number(subject.id)})`
      );
      if (capturedImages.length === captureStressImages) break;
      await wait(250);
    }
    await window.webContents.executeJavaScript('window.trecs.stopCaptureWatcher()');
    if (capturedImages.length !== captureStressImages) {
      throw new Error(JSON.stringify({ expectedCaptureImages: captureStressImages, captureImageCount: capturedImages.length }));
    }

    const captureReadIterations = 150;
    for (let iteration = 0; iteration < captureReadIterations; iteration += 1) {
      const captureImages = await window.webContents.executeJavaScript(
        `window.trecs.getCaptureSubjectImages(${Number(job.id)}, ${Number(subject.id)})`
      );
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
    fs.writeFileSync(path.join(collisionPackageImagesFolder, collisionImageName), Buffer.from([0xff, 0xd8, 0xff, 0xd9]));
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
    firstJobAfterCollision.close();
    secondJobAfterCollision.close();
    if (firstJobImageCountAfterCollision !== captureStressImages
      || !importedCollisionImage
      || Number(importedCollisionImage[0]) === 1
      || Number(importedCollisionImage[1]) !== Number(secondJob.id)
      || Number(importedCollisionImage[0]) !== Number(importedCollisionImage[3])) {
      throw new Error(JSON.stringify({ firstJobImageCountAfterCollision, importedCollisionImage, collisionImport }));
    }

    const firstJobBytesBeforeDetail = fs.readFileSync(jobPath);
    const secondJobBytesBeforeDetail = fs.readFileSync(secondJobPath);
    const jobDetailReadStartedAt = Date.now();
    const readOnlyJobDetail = await window.webContents.executeJavaScript(`window.trecs.getJobDetail(${Number(job.id)})`);
    const jobDetailReadMs = Date.now() - jobDetailReadStartedAt;
    const detailChangedFirstJob = !firstJobBytesBeforeDetail.equals(fs.readFileSync(jobPath));
    const detailChangedSecondJob = !secondJobBytesBeforeDetail.equals(fs.readFileSync(secondJobPath));
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

    fs.rmSync(jobPath, { force: true });
    const wipedJobDetail = await window.webContents.executeJavaScript(`window.trecs.getJobDetail(${Number(job.id)})`);
    const untouchedJobDetail = await window.webContents.executeJavaScript(`window.trecs.getJobDetail(${Number(secondJob.id)})`);
    if (wipedJobDetail.subjects.length !== 0 || untouchedJobDetail.subjects.length !== 1 || !fs.existsSync(jobPath)) {
      throw new Error(JSON.stringify({
        wipedSubjects: wipedJobDetail.subjects.length,
        untouchedSubjects: untouchedJobDetail.subjects.length,
        recreatedDatabase: fs.existsSync(jobPath)
      }));
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
      collisionImageRemappedTo: Number(importedCollisionImage[0]),
      jobDetailReadMs,
      jobDetailDatabaseWrites: 0,
      wipedJobSubjects: wipedJobDetail.subjects.length,
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
