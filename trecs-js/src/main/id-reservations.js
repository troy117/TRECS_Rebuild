// A tiny shared allocator replaces scanning every job on each capture. All
// writers hold the same filesystem lock while reserving and committing IDs.
const fs = require('fs');
const { atomicWriteFile } = require('./storage-safety');
const query = (db, sql) => {
  const result = db.exec(sql)[0];
  return result ? result.values.map((values) => Object.fromEntries(result.columns.map((key, i) => [key, values[i]]))) : [];
};
const quote = (value) => `"${String(value).replace(/"/g, '""')}"`;

function ensureAutoincrement(database, tables) {
  const definitions = query(database, "SELECT name, sql FROM sqlite_master WHERE type = 'table'");
  database.run('PRAGMA foreign_keys = OFF;');
  try {
    for (const definition of definitions) {
      if (!tables.includes(definition.name) || !/\bid\s+INTEGER\s+PRIMARY\s+KEY\b/i.test(definition.sql) || /AUTOINCREMENT/i.test(definition.sql)) continue;
      const name = definition.name;
      const indexes = query(database, `SELECT sql FROM sqlite_master WHERE tbl_name = '${name}' AND type IN ('index','trigger') AND sql IS NOT NULL`);
      const temp = `_trecs_ai_${name}`;
      const sql = definition.sql.replace(/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?(?:"[^"]+"|\[[^\]]+\]|`[^`]+`|\w+)/i, `CREATE TABLE ${quote(temp)}`)
        .replace(/\bid\s+INTEGER\s+PRIMARY\s+KEY\b/i, 'id INTEGER PRIMARY KEY AUTOINCREMENT');
      database.run('BEGIN;');
      try {
        database.run(sql);
        database.run(`INSERT INTO ${quote(temp)} SELECT * FROM ${quote(name)}; DROP TABLE ${quote(name)}; ALTER TABLE ${quote(temp)} RENAME TO ${quote(name)};`);
        for (const index of indexes) database.run(index.sql);
        database.run('COMMIT;');
      } catch (error) { database.run('ROLLBACK;'); throw error; }
    }
  } finally { database.run('PRAGMA foreign_keys = ON;'); }
}

function maxima(database, tables, values = {}) {
  const names = new Set(query(database, "SELECT name FROM sqlite_master WHERE type = 'table'").map((row) => row.name));
  for (const table of tables) {
    if (!names.has(table) || !query(database, `PRAGMA table_info(${quote(table)})`).some((row) => row.name === 'id')) continue;
    values[table] = Math.max(values[table] || 0, Number(query(database, `SELECT COALESCE(MAX(id),0) AS value FROM ${quote(table)}`)[0].value));
  }
  return values;
}

async function reserveIds(database, tables, allocatorPath, bootstrap, blockSize = 1000000) {
  let state;
  try { state = JSON.parse(await fs.promises.readFile(allocatorPath, 'utf8')); }
  catch (error) {
    if (error.code !== 'ENOENT') throw new Error(`ID allocator could not be read; save stopped safely: ${error.message}`);
    state = { version: 1, highWater: await bootstrap() };
  }
  if (state.version !== 1 || !state.highWater || typeof state.highWater !== 'object') throw new Error('Invalid shared ID allocator. Restore it before saving.');
  const current = maxima(database, tables);
  const reservations = {};
  const autoTables = new Set(query(database, "SELECT name FROM sqlite_master WHERE type = 'table' AND sql LIKE '%AUTOINCREMENT%'").map((row) => row.name));
  for (const [table, maximum] of Object.entries(current)) {
    if (!autoTables.has(table)) continue;
    const previous = state.highWater[table] || 0;
    if (!Number.isSafeInteger(previous) || previous < 0) throw new Error(`Invalid ID reservation for ${table}`);
    const start = Math.max(previous, maximum);
    const end = start + blockSize;
    if (!Number.isSafeInteger(end)) throw new Error('Database ID capacity reached. Contact support.');
    state.highWater[table] = end;
    reservations[table] = { start, end };
  }
  await atomicWriteFile(allocatorPath, Buffer.from(JSON.stringify(state)));
  for (const [table, range] of Object.entries(reservations)) {
    database.run('DELETE FROM sqlite_sequence WHERE name = ?;', [table]);
    database.run('INSERT INTO sqlite_sequence(name,seq) VALUES (?,?);', [table, range.start]);
  }
  return () => {
    for (const row of query(database, 'SELECT name,seq FROM sqlite_sequence')) {
      if (reservations[row.name] && Number(row.seq) > reservations[row.name].end) throw new Error('Operation exceeded its safe ID reservation; retry in smaller batches.');
    }
  };
}

module.exports = { ensureAutoincrement, maxima, reserveIds };
