const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

function rows(database, sql) {
  const result = database.exec(sql);
  if (!result.length) return [];
  return result[0].values.map((values) => Object.fromEntries(
    result[0].columns.map((column, index) => [column, values[index]])
  ));
}

function resolveStoredPath(dataRoot, value) {
  return path.isAbsolute(value) ? path.resolve(value) : path.resolve(dataRoot, value);
}

function pathBelongsToRoot(dataRoot, filePath, rootPath) {
  if (!filePath || !rootPath) return false;
  const resolvedRoot = resolveStoredPath(dataRoot, rootPath);
  const resolvedFile = resolveStoredPath(dataRoot, filePath);
  const relative = path.relative(resolvedRoot, resolvedFile);
  return relative === ''
    || (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
}

function timestamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

async function main() {
  const databasePath = process.argv[2] ? path.resolve(process.argv[2]) : '';
  const apply = process.argv.includes('--apply');
  if (!databasePath || path.basename(databasePath).toLowerCase() !== 'job.db') {
    throw new Error('Pass the exact path to a job.db file.');
  }
  if (!fs.existsSync(databasePath) || !fs.statSync(databasePath).isFile()) {
    throw new Error(`Job database was not found: ${databasePath}`);
  }

  const dataRoot = path.resolve(databasePath, '..', '..', '..', '..', '..');
  const SQL = await initSqlJs({
    locateFile: (file) => path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', file)
  });
  const database = new SQL.Database(fs.readFileSync(databasePath));
  try {
    const jobs = rows(database, 'SELECT id, name, root_path AS rootPath FROM jobs;');
    if (jobs.length !== 1) {
      throw new Error(`Expected exactly one job record; found ${jobs.length}.`);
    }

    const job = jobs[0];
    const before = rows(database, `
      SELECT
        (SELECT COUNT(*) FROM image_assets WHERE job_id = ${Number(job.id)}) AS images,
        (SELECT COUNT(*) FROM image_versions WHERE version_type = 'original') AS originals,
        (SELECT COUNT(*) FROM image_versions) AS versions;
    `)[0];
    const versionRows = rows(database, 'SELECT id, image_asset_id AS imageAssetId, version_type AS versionType, path FROM image_versions ORDER BY id;');
    const foreignRows = versionRows.filter((row) => !pathBelongsToRoot(dataRoot, row.path, job.rootPath));
    const report = {
      apply,
      databasePath,
      job,
      before,
      foreignVersions: foreignRows.length,
      foreignVersionTypes: foreignRows.reduce((counts, row) => {
        counts[row.versionType] = Number(counts[row.versionType] || 0) + 1;
        return counts;
      }, {}),
      foreignPathSamples: Array.from(new Set(foreignRows.map((row) => row.path))).slice(0, 10)
    };

    if (!apply || !foreignRows.length) {
      console.log(JSON.stringify(report, null, 2));
      return;
    }

    const backupPath = path.join(path.dirname(databasePath), `job.before-foreign-image-version-repair-${timestamp()}.db`);
    fs.copyFileSync(databasePath, backupPath, fs.constants.COPYFILE_EXCL);
    database.run('BEGIN TRANSACTION;');
    try {
      const statement = database.prepare('DELETE FROM image_versions WHERE id = ?;');
      try {
        foreignRows.forEach((row) => statement.run([Number(row.id)]));
      } finally {
        statement.free();
      }
      database.run('COMMIT;');
    } catch (error) {
      database.run('ROLLBACK;');
      throw error;
    }

    const after = rows(database, `
      SELECT
        (SELECT COUNT(*) FROM image_assets WHERE job_id = ${Number(job.id)}) AS images,
        (SELECT COUNT(*) FROM image_versions WHERE version_type = 'original') AS originals,
        (SELECT COUNT(*) FROM image_versions) AS versions;
    `)[0];
    if (Number(after.images) !== Number(before.images)
      || Number(after.originals) !== Number(before.originals)
      || Number(after.versions) !== Number(before.versions) - foreignRows.length) {
      throw new Error(`Repair validation failed: ${JSON.stringify({ before, after })}`);
    }

    fs.writeFileSync(databasePath, Buffer.from(database.export()));
    console.log(JSON.stringify({ ...report, backupPath, after, removed: foreignRows.length }, null, 2));
  } finally {
    database.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
