const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

async function main() {
  const databasePath = process.argv[2] ? path.resolve(process.argv[2]) : '';
  if (!databasePath || !fs.existsSync(databasePath)) {
    throw new Error('Pass the path to an existing SQLite database.');
  }

  const SQL = await initSqlJs({
    locateFile: (file) => path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', file)
  });
  const database = new SQL.Database(fs.readFileSync(databasePath));
  try {
    const tableResult = database.exec(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
        AND name NOT LIKE 'sqlite_%'
      ORDER BY name;
    `);
    const tables = tableResult.length ? tableResult[0].values.flat() : [];
    tables.forEach((tableName) => {
      const quotedName = `"${String(tableName).replace(/"/g, '""')}"`;
      const countResult = database.exec(`SELECT COUNT(*) FROM ${quotedName};`);
      const rowCount = countResult[0].values[0][0];
      console.log(`${tableName}\t${rowCount}`);
    });
  } finally {
    database.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
