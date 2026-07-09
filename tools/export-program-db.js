const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const initSqlJs = require(path.join(projectRoot, 'trecs-js', 'node_modules', 'sql.js'));
const sourceDbPath = path.join(projectRoot, 'database', 'migration_prototype.db');
const outputDbPath = path.join(projectRoot, 'database', 'program.db');
const sqlWasmPath = path.join(projectRoot, 'trecs-js', 'node_modules', 'sql.js', 'dist');

function rowsFromResult(result) {
  if (!result || result.length === 0) {
    return [];
  }

  const table = result[0];
  return table.values.map((values) => {
    const row = {};
    table.columns.forEach((column, index) => {
      row[column] = values[index];
    });
    return row;
  });
}

function rowsFromDatabase(database, sql) {
  return rowsFromResult(database.exec(sql));
}

function insertRows(database, tableName, rows) {
  if (!rows.length) {
    return;
  }

  const columns = Object.keys(rows[0]);
  const placeholders = columns.map(() => '?').join(', ');
  const statement = database.prepare(`
    INSERT OR REPLACE INTO ${tableName} (${columns.join(', ')})
    VALUES (${placeholders});
  `);

  try {
    rows.forEach((row) => {
      statement.run(columns.map((column) => row[column]));
    });
  } finally {
    statement.free();
  }
}

function createProgramDatabaseSchema(database) {
  database.run(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY,
      reference_number TEXT,
      display_name TEXT NOT NULL,
      trecs_name TEXT UNIQUE,
      phone TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      zip TEXT,
      notes TEXT,
      created_at TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY,
      client_id INTEGER NOT NULL,
      legacy_id TEXT,
      reference_number TEXT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      package_plan_id INTEGER,
      student_id_template_id INTEGER,
      faculty_id_template_id INTEGER,
      root_path TEXT NOT NULL,
      legacy_folder_layout TEXT NOT NULL DEFAULT 'trecs_v7',
      shoot_date TEXT,
      retake_date TEXT,
      due_date TEXT,
      notes TEXT,
      created_at TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS templates (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      template_type TEXT NOT NULL,
      source_path TEXT,
      metadata_json TEXT,
      created_at TEXT,
      updated_at TEXT,
      UNIQUE(name, template_type)
    );

    CREATE TABLE IF NOT EXISTS template_elements (
      id INTEGER PRIMARY KEY,
      template_id INTEGER NOT NULL,
      element_type TEXT NOT NULL,
      x REAL,
      y REAL,
      width REAL,
      height REAL,
      font TEXT,
      font_size REAL,
      color TEXT,
      metadata_json TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS package_plans (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      version INTEGER NOT NULL DEFAULT 1,
      active INTEGER NOT NULL DEFAULT 1,
      legacy_name TEXT,
      created_at TEXT,
      updated_at TEXT,
      UNIQUE(name, version)
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      category TEXT,
      size TEXT,
      requires_image INTEGER NOT NULL DEFAULT 1,
      template_id INTEGER,
      metadata_json TEXT,
      created_at TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS product_aliases (
      id INTEGER PRIMARY KEY,
      product_id INTEGER NOT NULL,
      alias TEXT NOT NULL UNIQUE,
      source TEXT NOT NULL DEFAULT 'legacy_package_item',
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS package_codes (
      id INTEGER PRIMARY KEY,
      package_plan_id INTEGER NOT NULL,
      code TEXT NOT NULL,
      name TEXT,
      active INTEGER NOT NULL DEFAULT 1,
      legacy_code_name TEXT,
      UNIQUE(package_plan_id, code)
    );

    CREATE TABLE IF NOT EXISTS package_code_items (
      id INTEGER PRIMARY KEY,
      package_code_id INTEGER NOT NULL,
      legacy_field TEXT,
      raw_value TEXT NOT NULL,
      product_id INTEGER,
      quantity INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0
    );
  `);
}

async function main() {
  const SQL = await initSqlJs({
    locateFile: (file) => path.join(sqlWasmPath, file)
  });
  const source = new SQL.Database(fs.readFileSync(sourceDbPath));
  const target = new SQL.Database();

  try {
    createProgramDatabaseSchema(target);
    target.run('BEGIN TRANSACTION;');
    [
      'clients',
      'jobs',
      'templates',
      'template_elements',
      'package_plans',
      'products',
      'product_aliases',
      'package_codes',
      'package_code_items'
    ].forEach((tableName) => {
      insertRows(target, tableName, rowsFromDatabase(source, `SELECT * FROM ${tableName};`));
    });
    target.run('COMMIT;');
    fs.writeFileSync(outputDbPath, Buffer.from(target.export()));
    console.log(`Exported program database to ${outputDbPath}`);
  } catch (error) {
    try {
      target.run('ROLLBACK;');
    } catch (_rollbackError) {
      // Keep the original export error.
    }
    throw error;
  } finally {
    source.close();
    target.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
