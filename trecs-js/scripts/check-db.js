const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const projectRoot = path.resolve(__dirname, '../..');
const databasePath = path.join(projectRoot, 'database', 'migration_prototype.db');
const sqlWasmPath = path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist');

async function main() {
  const SQL = await initSqlJs({
    locateFile: (file) => path.join(sqlWasmPath, file)
  });
  const database = new SQL.Database(fs.readFileSync(databasePath));
  const result = database.exec(`
    SELECT 'clients' AS label, COUNT(*) AS value FROM clients
    UNION ALL SELECT 'jobs', COUNT(*) FROM jobs
    UNION ALL SELECT 'subjects', COUNT(*) FROM subjects
    UNION ALL SELECT 'orders', COUNT(*) FROM orders
    UNION ALL SELECT 'images', COUNT(*) FROM image_assets;
  `);

  database.close();

  const rows = result[0].values.map(([label, value]) => `${label}: ${value}`);
  console.log(rows.join('\n'));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
