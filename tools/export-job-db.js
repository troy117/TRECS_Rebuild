const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const initSqlJs = require(path.join(projectRoot, 'trecs-js', 'node_modules', 'sql.js'));
const sourceDbPath = path.join(projectRoot, 'database', 'migration_prototype.db');
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

function selectAll(database, tableName, whereClause = '') {
  return rowsFromDatabase(database, `SELECT * FROM ${tableName} ${whereClause};`);
}

function idList(rows) {
  return rows.length ? rows.map((row) => row.id).join(', ') : '0';
}

function resolveProjectPath(inputPath) {
  return path.isAbsolute(inputPath) ? inputPath : path.join(projectRoot, inputPath);
}

function createJobDatabaseSchema(database) {
  database.run(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY,
      client_id INTEGER,
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

    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY,
      job_id INTEGER NOT NULL,
      legacy_ref_num TEXT,
      subject_type TEXT NOT NULL DEFAULT 'student',
      first_name TEXT,
      last_name TEXT,
      display_name TEXT,
      external_id TEXT,
      grade TEXT,
      homeroom TEXT,
      track TEXT,
      team TEXT,
      photographed_status TEXT NOT NULL DEFAULT 'unknown',
      primary_image_asset_id INTEGER,
      notes TEXT,
      created_at TEXT,
      updated_at TEXT,
      UNIQUE(job_id, legacy_ref_num)
    );

    CREATE TABLE IF NOT EXISTS subject_codes (
      id INTEGER PRIMARY KEY,
      subject_id INTEGER NOT NULL,
      code_type TEXT NOT NULL,
      code TEXT NOT NULL,
      created_at TEXT,
      UNIQUE(subject_id, code_type, code)
    );

    CREATE TABLE IF NOT EXISTS subject_groups (
      id INTEGER PRIMARY KEY,
      job_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      group_type TEXT NOT NULL DEFAULT 'list',
      UNIQUE(job_id, name, group_type)
    );

    CREATE TABLE IF NOT EXISTS subject_group_members (
      id INTEGER PRIMARY KEY,
      group_id INTEGER NOT NULL,
      subject_id INTEGER NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      UNIQUE(group_id, subject_id)
    );

    CREATE TABLE IF NOT EXISTS image_assets (
      id INTEGER PRIMARY KEY,
      job_id INTEGER NOT NULL,
      original_path TEXT,
      current_path TEXT NOT NULL,
      filename TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'import',
      status TEXT NOT NULL DEFAULT 'imported',
      captured_at TEXT,
      imported_at TEXT,
      metadata_json TEXT,
      UNIQUE(job_id, current_path)
    );

    CREATE TABLE IF NOT EXISTS image_versions (
      id INTEGER PRIMARY KEY,
      image_asset_id INTEGER NOT NULL,
      version_type TEXT NOT NULL,
      path TEXT NOT NULL,
      width INTEGER,
      height INTEGER,
      crop_json TEXT,
      created_at TEXT,
      UNIQUE(image_asset_id, version_type, path)
    );

    CREATE TABLE IF NOT EXISTS subject_images (
      id INTEGER PRIMARY KEY,
      subject_id INTEGER NOT NULL,
      image_asset_id INTEGER NOT NULL,
      role TEXT NOT NULL DEFAULT 'capture',
      selected INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      UNIQUE(subject_id, image_asset_id, role)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY,
      job_id INTEGER NOT NULL,
      subject_id INTEGER,
      source TEXT NOT NULL,
      source_reference TEXT,
      entry_timing TEXT NOT NULL DEFAULT 'unknown',
      status TEXT NOT NULL DEFAULT 'open',
      paid_status TEXT NOT NULL DEFAULT 'unknown',
      render_status TEXT NOT NULL DEFAULT 'not_ready',
      family_key TEXT,
      notes TEXT,
      created_at TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY,
      order_id INTEGER NOT NULL,
      subject_id INTEGER,
      product_id INTEGER,
      image_asset_id INTEGER,
      package_code TEXT,
      raw_code TEXT,
      quantity INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'open',
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY,
      order_id INTEGER NOT NULL,
      method TEXT,
      amount REAL,
      status TEXT NOT NULL DEFAULT 'unknown',
      reference TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS envelope_scans (
      id INTEGER PRIMARY KEY,
      job_id INTEGER NOT NULL,
      subject_id INTEGER,
      capture_session_id INTEGER,
      image_import_event_id INTEGER,
      order_id INTEGER,
      scan_path TEXT,
      envelope_identifier TEXT,
      keyed_order_code TEXT,
      keyed_by TEXT,
      status TEXT NOT NULL DEFAULT 'scanned',
      scanned_at TEXT,
      keyed_at TEXT,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS capture_events (
      id INTEGER PRIMARY KEY,
      job_id INTEGER NOT NULL,
      subject_id INTEGER NOT NULL,
      image_asset_id INTEGER,
      ref TEXT,
      jpg_path TEXT,
      cr3_path TEXT,
      filename TEXT,
      selected INTEGER NOT NULL DEFAULT 1,
      captured_at TEXT,
      sync_status TEXT NOT NULL DEFAULT 'pending_sync',
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS admin_item_batches (
      id INTEGER PRIMARY KEY,
      job_id INTEGER NOT NULL,
      shoot_stage TEXT NOT NULL,
      admin_item_type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'created',
      options_json TEXT,
      output_path TEXT,
      created_by TEXT,
      created_at TEXT,
      completed_at TEXT,
      error_message TEXT
    );
  `);
}

async function main() {
  const jobId = Number(process.argv[2] || 1);
  if (!Number.isInteger(jobId) || jobId < 1) {
    throw new Error('Usage: node tools/export-job-db.js <jobId>');
  }

  const SQL = await initSqlJs({
    locateFile: (file) => path.join(sqlWasmPath, file)
  });
  const source = new SQL.Database(fs.readFileSync(sourceDbPath));
  const target = new SQL.Database();

  try {
    const jobs = selectAll(source, 'jobs', `WHERE id = ${jobId}`);
    if (!jobs.length) {
      throw new Error(`Job ${jobId} not found`);
    }

    const outputFolder = path.join(resolveProjectPath(jobs[0].root_path), 'Database');
    fs.mkdirSync(outputFolder, { recursive: true });
    const outputPath = path.join(outputFolder, 'job.db');

    createJobDatabaseSchema(target);
    target.run('PRAGMA foreign_keys = OFF;');
    target.run('BEGIN TRANSACTION;');

    const subjects = selectAll(source, 'subjects', `WHERE job_id = ${jobId}`);
    const subjectGroups = selectAll(source, 'subject_groups', `WHERE job_id = ${jobId}`);
    const images = selectAll(source, 'image_assets', `WHERE job_id = ${jobId}`);
    const orders = selectAll(source, 'orders', `WHERE job_id = ${jobId}`);

    insertRows(target, 'jobs', jobs);
    insertRows(target, 'subjects', subjects);
    insertRows(target, 'subject_codes', selectAll(source, 'subject_codes', `WHERE subject_id IN (${idList(subjects)})`));
    insertRows(target, 'subject_groups', subjectGroups);
    insertRows(target, 'subject_group_members', selectAll(source, 'subject_group_members', `WHERE group_id IN (${idList(subjectGroups)})`));
    insertRows(target, 'image_assets', images);
    insertRows(target, 'image_versions', selectAll(source, 'image_versions', `WHERE image_asset_id IN (${idList(images)})`));
    insertRows(target, 'subject_images', selectAll(source, 'subject_images', `WHERE subject_id IN (${idList(subjects)})`));
    insertRows(target, 'orders', orders);
    insertRows(target, 'order_items', selectAll(source, 'order_items', `WHERE order_id IN (${idList(orders)})`));
    insertRows(target, 'payments', selectAll(source, 'payments', `WHERE order_id IN (${idList(orders)})`));
    insertRows(target, 'envelope_scans', selectAll(source, 'envelope_scans', `WHERE job_id = ${jobId}`));
    insertRows(target, 'admin_item_batches', selectAll(source, 'admin_item_batches', `WHERE job_id = ${jobId}`));

    target.run('COMMIT;');
    fs.writeFileSync(outputPath, Buffer.from(target.export()));
    console.log(`Exported job ${jobId} to ${outputPath}`);
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
