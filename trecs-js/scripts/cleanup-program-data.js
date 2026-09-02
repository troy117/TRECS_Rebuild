const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const UNUSED_TABLES = [
  'subject_field_values',
  'job_field_definitions',
  'sync_record_mappings',
  'sync_conflicts',
  'sync_packages',
  'render_tasks',
  'exports',
  'client_contacts'
];

function rows(database, sql) {
  const result = database.exec(sql);
  if (!result.length) return [];
  return result[0].values.map((values) => Object.fromEntries(result[0].columns.map((column, index) => [column, values[index]])));
}

function backupName(databasePath) {
  const stamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  return path.join(path.dirname(databasePath), `ProgramData.before-table-cleanup-${stamp}.db`);
}

async function main() {
  const databasePath = path.resolve(process.argv[2] || '');
  if (path.basename(databasePath).toLowerCase() !== 'programdata.db' || !fs.existsSync(databasePath)) {
    throw new Error('Pass the full path to an existing ProgramData.db');
  }
  const SQL = await initSqlJs({ locateFile: (file) => path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', file) });
  const database = new SQL.Database(fs.readFileSync(databasePath));
  const removed = [];
  const retained = [];
  try {
    database.run('PRAGMA foreign_keys = OFF;');
    UNUSED_TABLES.forEach((tableName) => {
      const exists = rows(database, `SELECT name FROM sqlite_master WHERE type = 'table' AND name = '${tableName}';`).length > 0;
      if (!exists) return;
      const count = Number(rows(database, `SELECT COUNT(*) AS count FROM ${tableName};`)[0]?.count || 0);
      if (count > 0) {
        retained.push({ table: tableName, rows: count });
        return;
      }
      database.run(`DROP TABLE ${tableName};`);
      removed.push(tableName);
    });
    database.run('PRAGMA foreign_keys = ON;');
    let backupPath = null;
    if (removed.length) {
      backupPath = backupName(databasePath);
      fs.copyFileSync(databasePath, backupPath);
      fs.writeFileSync(databasePath, Buffer.from(database.export()));
    }
    console.log(JSON.stringify({ databasePath, backupPath, removed, retained }, null, 2));
  } finally {
    database.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
