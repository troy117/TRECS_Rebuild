const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const projectRoot = path.resolve(__dirname, '../..');
function dataRootFromPathFile() {
  const pathFile = path.join(projectRoot, 'path.txt');
  if (!fs.existsSync(pathFile)) return projectRoot;
  const configured = fs.readFileSync(pathFile, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/^["']|["']$/g, ''))
    .find((line) => line && !line.startsWith('#'));
  if (!configured) return projectRoot;
  return path.isAbsolute(configured) ? configured : path.resolve(projectRoot, configured);
}
const dataRoot = dataRootFromPathFile();
const databasePath = path.join(dataRoot, 'database', 'ProgramData.db');
const sqlWasmPath = path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist');

async function main() {
  const SQL = await initSqlJs({
    locateFile: (file) => path.join(sqlWasmPath, file)
  });
  const database = new SQL.Database(fs.readFileSync(databasePath));
  const scalar = (db, sql) => Number(db.exec(sql)[0]?.values?.[0]?.[0] || 0);
  const jobRows = database.exec('SELECT id, root_path FROM jobs ORDER BY id;')[0]?.values || [];
  const totals = {
    clients: scalar(database, 'SELECT COUNT(*) FROM clients;'),
    jobs: jobRows.length,
    subjects: 0,
    orders: 0,
    images: 0
  };
  const programTables = new Set((database.exec("SELECT name FROM sqlite_master WHERE type = 'table';")[0]?.values || []).map(([name]) => name));
  const misplaced = ['subjects', 'orders', 'image_assets'].filter((name) => programTables.has(name));
  database.close();

  if (misplaced.length) {
    throw new Error(`ProgramData contains job-owned tables: ${misplaced.join(', ')}`);
  }

  for (const [, rootPath] of jobRows) {
    const resolvedRoot = path.isAbsolute(rootPath) ? rootPath : path.resolve(dataRoot, rootPath);
    const jobDatabasePath = path.join(resolvedRoot, 'Database', 'job.db');
    if (!fs.existsSync(jobDatabasePath)) {
      throw new Error(`Missing authoritative job database: ${jobDatabasePath}`);
    }
    const jobDatabase = new SQL.Database(fs.readFileSync(jobDatabasePath));
    totals.subjects += scalar(jobDatabase, 'SELECT COUNT(*) FROM subjects;');
    totals.orders += scalar(jobDatabase, 'SELECT COUNT(*) FROM orders;');
    totals.images += scalar(jobDatabase, 'SELECT COUNT(*) FROM image_assets;');
    jobDatabase.close();
  }

  console.log(Object.entries(totals).map(([label, value]) => `${label}: ${value}`).join('\n'));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
