const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');
const { writeLegacyTrecsImportWorkbook } = require('../src/main/legacy-end-of-day-export');

function packageFile(packageFolder, relativePath, fallback) {
  const packageRoot = path.resolve(packageFolder);
  const resolved = path.resolve(packageRoot, relativePath || fallback);
  const relative = path.relative(packageRoot, resolved);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`End of Day package path is outside the package folder: ${relativePath}`);
  }
  return resolved;
}

function databaseRows(database, sql) {
  const result = database.exec(sql);
  if (!result.length) return [];
  return result[0].values.map((values) => Object.fromEntries(
    result[0].columns.map((column, index) => [column, values[index]])
  ));
}

async function exportLegacyEndOfDay(packageFolderValue, outputPathValue) {
  const inputPath = path.resolve(packageFolderValue);
  const packageFolder = fs.existsSync(inputPath) && fs.statSync(inputPath).isFile()
    ? path.dirname(inputPath)
    : inputPath;
  const manifestPath = path.join(packageFolder, 'end-of-day-manifest.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`end-of-day-manifest.json was not found in ${packageFolder}`);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (manifest.packageType !== 'end_of_day') {
    throw new Error('The selected folder is not a TRECS End of Day package');
  }

  const databasePath = packageFile(
    packageFolder,
    manifest.paths && manifest.paths.database,
    path.join('Database', 'job.db')
  );
  if (!fs.existsSync(databasePath)) {
    throw new Error(`End of Day job database was not found: ${databasePath}`);
  }

  const SQL = await initSqlJs({
    locateFile: (file) => path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', file)
  });
  const database = new SQL.Database(fs.readFileSync(databasePath));
  let subjectRows;
  try {
    subjectRows = databaseRows(database, 'SELECT * FROM subjects ORDER BY legacy_ref_num, id;');
  } finally {
    database.close();
  }

  const outputPath = outputPathValue
    ? path.resolve(outputPathValue)
    : path.join(packageFolder, 'Legacy TRECS Import.xlsx');
  const result = writeLegacyTrecsImportWorkbook(outputPath, manifest, subjectRows);
  return { packageFolder, databasePath, ...result };
}

if (require.main === module) {
  const packageFolder = process.argv[2];
  if (!packageFolder) {
    console.error('Usage: node scripts/export-legacy-end-of-day.js <end-of-day-folder> [output.xlsx]');
    process.exit(1);
  }
  exportLegacyEndOfDay(packageFolder, process.argv[3])
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => {
      console.error(error.message || error);
      process.exit(1);
    });
}

module.exports = { exportLegacyEndOfDay };
