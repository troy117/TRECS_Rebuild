const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const dataRoot = process.env.TRECS_DATA_ROOT ? path.resolve(process.env.TRECS_DATA_ROOT) : null;
const dryRun = process.env.TRECS_REPAIR_DRY_RUN === '1';
const verifyOnly = process.env.TRECS_REPAIR_VERIFY_ONLY === '1';
if (!dataRoot) {
  throw new Error('Set TRECS_DATA_ROOT to the TRECS data folder before running this repair.');
}

const databasePaths = {
  program: path.join(dataRoot, 'database', 'ProgramData.db'),
  crossroads: path.join(dataRoot, 'JOBS', 'CROSSROADS', 'FALL_2026', 'Database', 'job.db'),
  kingsburg: path.join(dataRoot, 'JOBS', 'KINGSBURG DO', 'FALL_STAFF', 'Database', 'job.db'),
  pioneer: path.join(dataRoot, 'JOBS', 'PIONEER MS', 'FALL_2026', 'Database', 'job.db')
};
const sqlWasmPath = path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist');
const lockPath = `${databasePaths.program}.write-lock`;
const repairId = crypto.randomUUID();
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupPaths = new Map();

function rows(database, sql) {
  const result = database.exec(sql);
  if (!result.length) return [];
  return result[0].values.map((values) => Object.fromEntries(
    result[0].columns.map((column, index) => [column, values[index]])
  ));
}

function scalar(database, sql) {
  return Number(database.exec(sql)[0]?.values?.[0]?.[0] || 0);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function acquireRepairLock() {
  if (fs.existsSync(lockPath)) {
    throw new Error(`Database write lock already exists: ${lockPath}`);
  }
  fs.mkdirSync(lockPath);
  fs.writeFileSync(path.join(lockPath, 'owner.json'), JSON.stringify({
    repairId,
    purpose: 'Crossroads image ID collision repair',
    startedAt: new Date().toISOString()
  }, null, 2));
}

function releaseRepairLock() {
  if (!fs.existsSync(lockPath)) return;
  const ownerPath = path.join(lockPath, 'owner.json');
  const owner = fs.existsSync(ownerPath) ? JSON.parse(fs.readFileSync(ownerPath, 'utf8')) : null;
  if (owner?.repairId === repairId) {
    fs.rmSync(lockPath, { recursive: true, force: true });
  }
}

function backupDatabase(name, databasePath) {
  const backupPath = path.join(
    path.dirname(databasePath),
    `${path.basename(databasePath, '.db')}.before-crossroads-image-repair-${timestamp}.db`
  );
  fs.copyFileSync(databasePath, backupPath, fs.constants.COPYFILE_EXCL);
  backupPaths.set(name, backupPath);
  return backupPath;
}

function restoreBackups() {
  for (const [name, backupPath] of backupPaths.entries()) {
    fs.copyFileSync(backupPath, databasePaths[name]);
  }
}

function remapCrossroadsImages(database, foreignVersions, firstNewImageId) {
  database.run('BEGIN TRANSACTION;');
  try {
    foreignVersions.forEach((version) => {
      database.run('DELETE FROM image_versions WHERE id = ?;', [version.id]);
    });

    const sourceImageIds = rows(database, 'SELECT id FROM image_assets ORDER BY id;').map((row) => Number(row.id));
    sourceImageIds.forEach((sourceImageId, index) => {
      const targetImageId = firstNewImageId + index;
      [
        ['subjects', 'primary_image_asset_id'],
        ['subject_images', 'image_asset_id'],
        ['image_versions', 'image_asset_id'],
        ['capture_sessions', 'latest_image_asset_id'],
        ['capture_image_actions', 'image_asset_id'],
        ['image_import_events', 'image_asset_id'],
        ['order_items', 'image_asset_id'],
        ['event_entries', 'event_image_asset_id']
      ].forEach(([tableName, columnName]) => {
        database.run(`UPDATE ${tableName} SET ${columnName} = ? WHERE ${columnName} = ?;`, [targetImageId, sourceImageId]);
      });
      database.run('UPDATE image_assets SET id = ? WHERE id = ?;', [targetImageId, sourceImageId]);
    });
    database.run('COMMIT;');
  } catch (error) {
    database.run('ROLLBACK;');
    throw error;
  }
}

function restoreDisplacedImages(database, jobId, versions) {
  const versionsByImageId = new Map();
  versions.forEach((version) => {
    const imageId = Number(version.image_asset_id);
    if (!versionsByImageId.has(imageId)) versionsByImageId.set(imageId, []);
    versionsByImageId.get(imageId).push(version);
  });

  database.run('BEGIN TRANSACTION;');
  try {
    for (const [imageId, imageVersions] of versionsByImageId.entries()) {
      const subjectRows = rows(database, `
        SELECT id, legacy_ref_num AS ref
        FROM subjects
        WHERE job_id = ${Number(jobId)}
          AND primary_image_asset_id = ${imageId};
      `);
      assert(subjectRows.length === 1, `Expected one subject for restored image ${imageId} in job ${jobId}`);
      const largeVersion = imageVersions.find((version) => version.version_type === 'cropped_large');
      const mediumVersion = imageVersions.find((version) => version.version_type === 'cropped_med');
      const displayVersion = largeVersion || mediumVersion;
      assert(displayVersion, `No display version found for restored image ${imageId}`);
      assert(fs.existsSync(path.join(dataRoot, displayVersion.path)), `Missing restored image file: ${displayVersion.path}`);

      database.run(`
        INSERT INTO image_assets (
          id, job_id, original_path, current_path, filename,
          source, status, imported_at, metadata_json
        ) VALUES (?, ?, ?, ?, ?, 'legacy_import', 'imported', CURRENT_TIMESTAMP, ?);
      `, [
        imageId,
        jobId,
        displayVersion.path,
        displayVersion.path,
        path.basename(displayVersion.path),
        JSON.stringify({ repairedFromCrossroadsCollision: true })
      ]);

      imageVersions.forEach((version) => {
        database.run(`
          INSERT INTO image_versions (
            id, image_asset_id, version_type, path,
            width, height, crop_json, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `, [
          version.id,
          imageId,
          version.version_type,
          version.path,
          version.width ?? null,
          version.height ?? null,
          version.crop_json ?? null,
          version.created_at ?? null
        ]);
      });

      database.run(`
        INSERT INTO subject_images (
          id, subject_id, image_asset_id, role, selected, sort_order
        ) VALUES (?, ?, ?, 'primary', 1, 0);
      `, [imageId, subjectRows[0].id, imageId]);
    }
    database.run('COMMIT;');
  } catch (error) {
    database.run('ROLLBACK;');
    throw error;
  }
}

function validateRepairedDatabases(crossroads, kingsburg, pioneer) {
  assert(scalar(crossroads, 'SELECT COUNT(*) FROM image_assets;') === 56, 'Crossroads image count is not 56 after repair');
  assert(scalar(crossroads, "SELECT COUNT(*) FROM image_versions WHERE path NOT LIKE 'JOBS\\CROSSROADS\\FALL_2026\\%';") === 0, 'Crossroads still has foreign image versions');
  assert(scalar(crossroads, 'SELECT COUNT(*) FROM subjects s LEFT JOIN image_assets ia ON ia.id = s.primary_image_asset_id WHERE s.primary_image_asset_id IS NOT NULL AND ia.id IS NULL;') === 0, 'Crossroads has dangling primary images');

  assert(scalar(kingsburg, 'SELECT COUNT(*) FROM image_assets;') === 36, 'KINGSBURG image count is not 36 after repair');
  assert(scalar(kingsburg, 'SELECT COUNT(*) FROM image_versions;') === 72, 'KINGSBURG image version count is not 72 after repair');
  assert(scalar(kingsburg, 'SELECT COUNT(*) FROM subject_images;') === 36, 'KINGSBURG subject-image count is not 36 after repair');
  assert(scalar(kingsburg, 'SELECT COUNT(*) FROM subjects s LEFT JOIN image_assets ia ON ia.id = s.primary_image_asset_id WHERE s.primary_image_asset_id IS NOT NULL AND ia.id IS NULL;') === 0, 'KINGSBURG has dangling primary images');

  assert(scalar(pioneer, 'SELECT COUNT(*) FROM image_assets;') === 541, 'Pioneer image count is not 541 after repair');
  assert(scalar(pioneer, 'SELECT COUNT(*) FROM image_versions;') === 1082, 'Pioneer image version count is not 1082 after repair');
  assert(scalar(pioneer, 'SELECT COUNT(*) FROM subject_images;') === 541, 'Pioneer subject-image count is not 541 after repair');
  assert(scalar(pioneer, 'SELECT COUNT(*) FROM subjects s LEFT JOIN image_assets ia ON ia.id = s.primary_image_asset_id WHERE s.primary_image_asset_id IS NOT NULL AND ia.id IS NULL;') === 0, 'Pioneer has dangling primary images');

  const imageIds = new Map();
  [['Crossroads', crossroads], ['KINGSBURG', kingsburg], ['Pioneer', pioneer]].forEach(([name, database]) => {
    rows(database, 'SELECT id FROM image_assets;').forEach((row) => {
      const id = Number(row.id);
      assert(!imageIds.has(id), `Image ID ${id} is shared by ${imageIds.get(id)} and ${name}`);
      imageIds.set(id, name);
    });
  });
}

async function main() {
  Object.values(databasePaths).forEach((databasePath) => {
    assert(fs.existsSync(databasePath), `Database not found: ${databasePath}`);
  });

  const SQL = await initSqlJs({ locateFile: (file) => path.join(sqlWasmPath, file) });
  const crossroads = new SQL.Database(fs.readFileSync(databasePaths.crossroads));
  const kingsburg = new SQL.Database(fs.readFileSync(databasePaths.kingsburg));
  const pioneer = new SQL.Database(fs.readFileSync(databasePaths.pioneer));

  try {
    if (verifyOnly) {
      validateRepairedDatabases(crossroads, kingsburg, pioneer);
      console.log(JSON.stringify({
        verifyOnly: true,
        validated: true,
        crossroadsImages: scalar(crossroads, 'SELECT COUNT(*) FROM image_assets;'),
        kingsburgImages: scalar(kingsburg, 'SELECT COUNT(*) FROM image_assets;'),
        pioneerImages: scalar(pioneer, 'SELECT COUNT(*) FROM image_assets;'),
        databaseWrites: 0
      }, null, 2));
      return;
    }

    const foreignVersions = rows(crossroads, `
      SELECT *
      FROM image_versions
      WHERE path NOT LIKE 'JOBS\\CROSSROADS\\FALL_2026\\%'
      ORDER BY id;
    `);
    const kingsburgVersions = foreignVersions.filter((version) => String(version.path).startsWith('JOBS\\KINGSBURG DO\\FALL_STAFF\\'));
    const pioneerVersions = foreignVersions.filter((version) => String(version.path).startsWith('JOBS\\PIONEER MS\\FALL_2026\\'));

    assert(scalar(crossroads, 'SELECT COUNT(*) FROM image_assets;') === 56, 'Expected 56 Crossroads images before repair');
    assert(foreignVersions.length === 112, `Expected 112 foreign Crossroads versions, found ${foreignVersions.length}`);
    assert(kingsburgVersions.length === 72, `Expected 72 displaced KINGSBURG versions, found ${kingsburgVersions.length}`);
    assert(pioneerVersions.length === 40, `Expected 40 displaced Pioneer versions, found ${pioneerVersions.length}`);
    assert(scalar(kingsburg, 'SELECT COUNT(*) FROM image_assets;') === 0, 'KINGSBURG images no longer match the expected damaged state');
    assert(scalar(pioneer, 'SELECT COUNT(*) FROM image_assets;') === 521, 'Pioneer images no longer match the expected damaged state');

    const maxExistingImageId = Math.max(
      scalar(crossroads, 'SELECT COALESCE(MAX(id), 0) FROM image_assets;'),
      scalar(kingsburg, 'SELECT COALESCE(MAX(id), 0) FROM image_assets;'),
      scalar(pioneer, 'SELECT COALESCE(MAX(id), 0) FROM image_assets;')
    );
    remapCrossroadsImages(crossroads, foreignVersions, maxExistingImageId + 1);
    restoreDisplacedImages(kingsburg, 1, kingsburgVersions);
    restoreDisplacedImages(pioneer, 2, pioneerVersions);
    validateRepairedDatabases(crossroads, kingsburg, pioneer);

    const outputBuffers = {
      crossroads: Buffer.from(crossroads.export()),
      kingsburg: Buffer.from(kingsburg.export()),
      pioneer: Buffer.from(pioneer.export())
    };

    if (dryRun) {
      console.log(JSON.stringify({
        dryRun: true,
        validated: true,
        crossroadsImages: 56,
        crossroadsImageIdRange: [maxExistingImageId + 1, maxExistingImageId + 56],
        restoredKingsburgImages: 36,
        restoredPioneerImages: 20,
        databaseWrites: 0
      }, null, 2));
      return;
    }

    acquireRepairLock();
    try {
      Object.entries(databasePaths).forEach(([name, databasePath]) => backupDatabase(name, databasePath));
      fs.writeFileSync(databasePaths.crossroads, outputBuffers.crossroads);
      fs.writeFileSync(databasePaths.kingsburg, outputBuffers.kingsburg);
      fs.writeFileSync(databasePaths.pioneer, outputBuffers.pioneer);
    } catch (error) {
      restoreBackups();
      throw error;
    } finally {
      releaseRepairLock();
    }

    console.log(JSON.stringify({
      repaired: true,
      crossroadsImages: 56,
      crossroadsImageIdRange: [maxExistingImageId + 1, maxExistingImageId + 56],
      restoredKingsburgImages: 36,
      restoredPioneerImages: 20,
      backups: Object.fromEntries(backupPaths)
    }, null, 2));
  } finally {
    crossroads.close();
    kingsburg.close();
    pioneer.close();
    releaseRepairLock();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
