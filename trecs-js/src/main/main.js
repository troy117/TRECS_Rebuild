const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { spawn } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const initSqlJs = require('sql.js');
const XLSX = require('xlsx');

const appFolderCandidate = path.resolve(__dirname, '../..');
const runningFromPortableFolder = path.basename(appFolderCandidate).toLowerCase() === 'app'
  && path.basename(path.dirname(appFolderCandidate)).toLowerCase() === 'resources';
const portableMode = app.isPackaged || runningFromPortableFolder;
const appSourceRoot = portableMode ? appFolderCandidate : path.resolve(__dirname, '../..');
const portableExecutableDir = process.env.PORTABLE_EXECUTABLE_DIR || (app.isPackaged ? path.dirname(process.execPath) : '');
const projectRoot = portableMode ? (portableExecutableDir || path.resolve(appSourceRoot, '..', '..')) : path.resolve(__dirname, '../../..');
const bundledResourceRoot = portableMode ? path.resolve(appSourceRoot, '..') : projectRoot;
const prototypeDatabasePath = path.join(projectRoot, 'database', 'migration_prototype.db');
const sqlWasmPath = path.join(appSourceRoot, 'node_modules', 'sql.js', 'dist');
const startupLogPath = path.join(projectRoot, 'portable-startup.log');

let sqlModulePromise;

function logStartup(message, error = null) {
  if (!portableMode) {
    return;
  }

  const detail = error ? ` ${error.stack || error.message || error}` : '';
  fs.appendFileSync(startupLogPath, `[${new Date().toISOString()}] ${message}${detail}\n`);
}

process.on('uncaughtException', (error) => {
  logStartup('uncaughtException', error);
  throw error;
});

process.on('unhandledRejection', (error) => {
  logStartup('unhandledRejection', error);
});

function getSqlModule() {
  if (!sqlModulePromise) {
    sqlModulePromise = initSqlJs({
      locateFile: (file) => path.join(sqlWasmPath, file)
    });
  }

  return sqlModulePromise;
}

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

function insertRows(database, tableName, columns, rows) {
  if (!rows.length) {
    return;
  }

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

function captureSessionRoot() {
  return path.join(app.getPath('userData'), 'CaptureSessions');
}

function localCaptureDatabasePath(jobId) {
  return path.join(captureSessionRoot(), `job-${jobId}`, 'capture.db');
}

function createLocalCaptureSchema(database) {
  database.run(`
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
      captured_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      sync_status TEXT NOT NULL DEFAULT 'pending_sync',
      notes TEXT
    );
  `);
}

async function appendLocalCaptureEvent(input) {
  const SQL = await getSqlModule();
  const dbPath = localCaptureDatabasePath(input.jobId);
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const database = fs.existsSync(dbPath)
    ? new SQL.Database(fs.readFileSync(dbPath))
    : new SQL.Database();

  try {
    createLocalCaptureSchema(database);
    const statement = database.prepare(`
      INSERT INTO capture_events (
        job_id,
        subject_id,
        image_asset_id,
        ref,
        jpg_path,
        cr3_path,
        filename,
        selected,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?);
    `);

    try {
      statement.run([
        input.jobId,
        input.subjectId,
        input.imageAssetId,
        input.ref || null,
        input.jpgPath || null,
        input.cr3Path || null,
        input.filename || null,
        input.notes || null
      ]);
    } finally {
      statement.free();
    }

    fs.writeFileSync(dbPath, Buffer.from(database.export()));
    return dbPath;
  } finally {
    database.close();
  }
}

async function updateLocalCaptureSelection(jobId, subjectId, imageAssetId) {
  const SQL = await getSqlModule();
  const dbPath = localCaptureDatabasePath(jobId);
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const database = fs.existsSync(dbPath)
    ? new SQL.Database(fs.readFileSync(dbPath))
    : new SQL.Database();

  try {
    createLocalCaptureSchema(database);
    database.run(`
      UPDATE capture_events
      SET selected = CASE WHEN image_asset_id = ? THEN 1 ELSE 0 END,
          sync_status = 'pending_sync'
      WHERE job_id = ?
        AND subject_id = ?;
    `, [imageAssetId, jobId, subjectId]);
    fs.writeFileSync(dbPath, Buffer.from(database.export()));
    return dbPath;
  } finally {
    database.close();
  }
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
      image_asset_id INTEGER,
      package_plan_id INTEGER,
      package_code TEXT,
      product_id INTEGER,
      quantity INTEGER NOT NULL DEFAULT 1,
      raw_code TEXT,
      status TEXT NOT NULL DEFAULT 'open',
      notes TEXT,
      created_at TEXT,
      updated_at TEXT
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

async function writeJobDatabaseSnapshot(jobId) {
  const SQL = await getSqlModule();
  const databaseBytes = fs.readFileSync(prototypeDatabasePath);
  const sourceDatabase = new SQL.Database(databaseBytes);
  const jobDatabase = new SQL.Database();

  try {
    const jobRows = rowsFromDatabase(sourceDatabase, `
      SELECT *
      FROM jobs
      WHERE id = ${jobId};
    `);
    if (!jobRows.length) {
      return null;
    }

    const rootPath = resolveProjectPath(jobRows[0].root_path);
    const databaseFolder = path.join(rootPath, 'Database');
    fs.mkdirSync(databaseFolder, { recursive: true });
    const jobDatabasePath = path.join(databaseFolder, 'job.db');

    createJobDatabaseSchema(jobDatabase);
    jobDatabase.run('PRAGMA foreign_keys = OFF;');
    jobDatabase.run('BEGIN TRANSACTION;');

    const subjectRows = rowsFromDatabase(sourceDatabase, `SELECT * FROM subjects WHERE job_id = ${jobId};`);
    const subjectIds = subjectRows.map((row) => row.id);
    const subjectIdList = subjectIds.length ? subjectIds.join(', ') : '0';
    const imageRows = rowsFromDatabase(sourceDatabase, `SELECT * FROM image_assets WHERE job_id = ${jobId};`);
    const imageIds = imageRows.map((row) => row.id);
    const imageIdList = imageIds.length ? imageIds.join(', ') : '0';
    const orderRows = rowsFromDatabase(sourceDatabase, `SELECT * FROM orders WHERE job_id = ${jobId};`);
    const orderIds = orderRows.map((row) => row.id);
    const orderIdList = orderIds.length ? orderIds.join(', ') : '0';

    insertRows(jobDatabase, 'jobs', Object.keys(jobRows[0]), jobRows);
    insertRows(jobDatabase, 'subjects', Object.keys(subjectRows[0] || {}), subjectRows);
    const subjectCodeRows = rowsFromDatabase(sourceDatabase, `SELECT * FROM subject_codes WHERE subject_id IN (${subjectIdList});`);
    insertRows(jobDatabase, 'subject_codes', Object.keys(subjectCodeRows[0] || {}), subjectCodeRows);
    const subjectGroupRows = rowsFromDatabase(sourceDatabase, `SELECT * FROM subject_groups WHERE job_id = ${jobId};`);
    const subjectGroupIds = subjectGroupRows.map((row) => row.id);
    const subjectGroupIdList = subjectGroupIds.length ? subjectGroupIds.join(', ') : '0';
    insertRows(jobDatabase, 'subject_groups', Object.keys(subjectGroupRows[0] || {}), subjectGroupRows);
    const subjectGroupMemberRows = rowsFromDatabase(sourceDatabase, `SELECT * FROM subject_group_members WHERE group_id IN (${subjectGroupIdList});`);
    insertRows(jobDatabase, 'subject_group_members', Object.keys(subjectGroupMemberRows[0] || {}), subjectGroupMemberRows);
    insertRows(jobDatabase, 'image_assets', Object.keys(imageRows[0] || {}), imageRows);
    const imageVersionRows = rowsFromDatabase(sourceDatabase, `SELECT * FROM image_versions WHERE image_asset_id IN (${imageIdList});`);
    insertRows(jobDatabase, 'image_versions', Object.keys(imageVersionRows[0] || {}), imageVersionRows);
    const subjectImageRows = rowsFromDatabase(sourceDatabase, `SELECT * FROM subject_images WHERE subject_id IN (${subjectIdList});`);
    insertRows(jobDatabase, 'subject_images', Object.keys(subjectImageRows[0] || {}), subjectImageRows);
    insertRows(jobDatabase, 'orders', Object.keys(orderRows[0] || {}), orderRows);
    const orderItemRows = rowsFromDatabase(sourceDatabase, `SELECT * FROM order_items WHERE order_id IN (${orderIdList});`);
    insertRows(jobDatabase, 'order_items', Object.keys(orderItemRows[0] || {}), orderItemRows);
    const paymentRows = rowsFromDatabase(sourceDatabase, `SELECT * FROM payments WHERE order_id IN (${orderIdList});`);
    insertRows(jobDatabase, 'payments', Object.keys(paymentRows[0] || {}), paymentRows);
    const envelopeRows = rowsFromDatabase(sourceDatabase, `SELECT * FROM envelope_scans WHERE job_id = ${jobId};`);
    insertRows(jobDatabase, 'envelope_scans', Object.keys(envelopeRows[0] || {}), envelopeRows);
    const adminRows = rowsFromDatabase(sourceDatabase, `SELECT * FROM admin_item_batches WHERE job_id = ${jobId};`);
    insertRows(jobDatabase, 'admin_item_batches', Object.keys(adminRows[0] || {}), adminRows);

    jobDatabase.run('COMMIT;');
    fs.writeFileSync(jobDatabasePath, Buffer.from(jobDatabase.export()));
    return jobDatabasePath;
  } catch (error) {
    try {
      jobDatabase.run('ROLLBACK;');
    } catch (_rollbackError) {
      // Keep the original snapshot error.
    }
    throw error;
  } finally {
    jobDatabase.close();
    sourceDatabase.close();
  }
}

async function writeProgramDatabaseSnapshot() {
  const SQL = await getSqlModule();
  const sourceDatabase = new SQL.Database(fs.readFileSync(prototypeDatabasePath));
  const programDatabase = new SQL.Database();
  const programDatabasePath = path.join(projectRoot, 'database', 'program.db');

  try {
    createProgramDatabaseSchema(programDatabase);
    programDatabase.run('BEGIN TRANSACTION;');

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
      const rows = rowsFromDatabase(sourceDatabase, `SELECT * FROM ${tableName};`);
      insertRows(programDatabase, tableName, Object.keys(rows[0] || {}), rows);
    });

    programDatabase.run('COMMIT;');
    fs.writeFileSync(programDatabasePath, Buffer.from(programDatabase.export()));
    return programDatabasePath;
  } catch (error) {
    try {
      programDatabase.run('ROLLBACK;');
    } catch (_rollbackError) {
      // Keep the original snapshot error.
    }
    throw error;
  } finally {
    programDatabase.close();
    sourceDatabase.close();
  }
}

async function ensurePrototypeDatabaseShape() {
  const SQL = await getSqlModule();
  fs.mkdirSync(path.join(projectRoot, 'database'), { recursive: true });
  fs.mkdirSync(path.join(projectRoot, 'JOBS'), { recursive: true });
  fs.mkdirSync(path.join(projectRoot, 'CaptureHotFolder'), { recursive: true });
  fs.mkdirSync(path.join(projectRoot, 'EnvelopeHotFolder'), { recursive: true });
  fs.mkdirSync(path.join(projectRoot, 'exports'), { recursive: true });

  const database = fs.existsSync(prototypeDatabasePath)
    ? new SQL.Database(fs.readFileSync(prototypeDatabasePath))
    : new SQL.Database();

  try {
    let changed = false;
    if (!fs.existsSync(prototypeDatabasePath)) {
      const schemaPath = path.join(bundledResourceRoot, 'database', 'schema.sql');
      if (!fs.existsSync(schemaPath)) {
        throw new Error(`Bundled schema was not found at ${schemaPath}`);
      }
      database.run(fs.readFileSync(schemaPath, 'utf8'));
      changed = true;
    }

    const jobColumns = rowsFromDatabase(database, 'PRAGMA table_info(jobs);')
      .map((column) => column.name);

    if (!jobColumns.includes('retake_date')) {
      database.run('ALTER TABLE jobs ADD COLUMN retake_date TEXT;');
      changed = true;
    }

    database.run(`
      CREATE TABLE IF NOT EXISTS admin_item_batches (
        id INTEGER PRIMARY KEY,
        job_id INTEGER NOT NULL,
        shoot_stage TEXT NOT NULL,
        admin_item_type TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'created',
        options_json TEXT,
        output_path TEXT,
        created_by TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        completed_at TEXT,
        error_message TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_admin_item_batches_job_id
      ON admin_item_batches(job_id, shoot_stage, admin_item_type);

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
        scanned_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        keyed_at TEXT,
        notes TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_envelope_scans_job_id
      ON envelope_scans(job_id, subject_id, status);
    `);
    changed = true;

    if (changed) {
      fs.writeFileSync(prototypeDatabasePath, Buffer.from(database.export()));
    }
  } finally {
    database.close();
  }
}

async function querySql(sql) {
  const SQL = await getSqlModule();
  const databaseBytes = fs.readFileSync(prototypeDatabasePath);
  const database = new SQL.Database(databaseBytes);

  try {
    return rowsFromResult(database.exec(sql));
  } finally {
    database.close();
  }
}

function safeFolderName(value) {
  const name = String(value || 'job')
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();

  return name.slice(0, 80) || 'job';
}

function timestampForFolder(date = new Date()) {
  return date.toISOString().replace(/[:.]/g, '-');
}

function normalizeText(value, label, maxLength = 255) {
  const text = String(value || '').trim();
  if (!text) {
    throw new Error(`${label} is required`);
  }
  if (text.length > maxLength) {
    throw new Error(`${label} is too long`);
  }
  return text;
}

function optionalText(value, maxLength = 255) {
  const text = String(value || '').trim();
  if (!text) {
    return null;
  }
  if (text.length > maxLength) {
    throw new Error('Text value is too long');
  }
  return text;
}

function normalizeSubjectType(value) {
  const type = String(value || 'student').trim();
  const allowed = new Set(['student', 'faculty', 'staff', 'athlete', 'senior', 'group', 'other']);
  if (!allowed.has(type)) {
    throw new Error('Invalid subject type');
  }
  return type;
}

function normalizePhotographedStatus(value) {
  const status = String(value || 'unknown').trim();
  const allowed = new Set(['unknown', 'not_photographed', 'photographed', 'absent', 'retake_needed']);
  if (!allowed.has(status)) {
    throw new Error('Invalid photographed status');
  }
  return status;
}

function displayNameForSubject(firstName, lastName, displayName) {
  const explicitName = optionalText(displayName, 255);
  if (explicitName) {
    return explicitName;
  }

  return [firstName, lastName].filter(Boolean).join(' ') || null;
}

function insertRows(database, table, columns, rows) {
  if (!rows.length) {
    return;
  }

  const placeholders = columns.map(() => '?').join(', ');
  const statement = database.prepare(`
    INSERT INTO ${table} (${columns.join(', ')})
    VALUES (${placeholders});
  `);

  try {
    rows.forEach((row) => {
      statement.run(columns.map((column) => {
        const camelColumn = column.replace(/_([a-z])/g, (_match, letter) => letter.toUpperCase());
        return row[column] ?? row[camelColumn] ?? null;
      }));
    });
  } finally {
    statement.free();
  }
}

function createCapturePackageSchema(database) {
  database.run(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE package_manifest (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE jobs (
      id INTEGER PRIMARY KEY,
      legacy_id TEXT,
      reference_number TEXT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      package_plan_id INTEGER,
      package_plan_name TEXT,
      client_name TEXT,
      trecs_name TEXT,
      root_path TEXT,
      shoot_date TEXT,
      retake_date TEXT,
      notes TEXT
    );

    CREATE TABLE subjects (
      id INTEGER PRIMARY KEY,
      job_id INTEGER NOT NULL,
      legacy_ref_num TEXT,
      subject_type TEXT,
      first_name TEXT,
      last_name TEXT,
      display_name TEXT,
      external_id TEXT,
      grade TEXT,
      homeroom TEXT,
      track TEXT,
      team TEXT,
      photographed_status TEXT,
      notes TEXT
    );

    CREATE TABLE subject_codes (
      id INTEGER PRIMARY KEY,
      subject_id INTEGER NOT NULL,
      code_type TEXT NOT NULL,
      code TEXT NOT NULL
    );

    CREATE TABLE subject_groups (
      id INTEGER PRIMARY KEY,
      job_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      group_type TEXT NOT NULL
    );

    CREATE TABLE subject_group_members (
      id INTEGER PRIMARY KEY,
      group_id INTEGER NOT NULL,
      subject_id INTEGER NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE orders (
      id INTEGER PRIMARY KEY,
      job_id INTEGER NOT NULL,
      subject_id INTEGER,
      family_key TEXT,
      source TEXT NOT NULL,
      source_reference TEXT,
      entry_timing TEXT NOT NULL,
      status TEXT NOT NULL,
      paid_status TEXT NOT NULL,
      render_status TEXT NOT NULL,
      notes TEXT
    );

    CREATE TABLE order_items (
      id INTEGER PRIMARY KEY,
      order_id INTEGER NOT NULL,
      subject_id INTEGER,
      package_plan_id INTEGER,
      package_code TEXT,
      product_id INTEGER,
      quantity INTEGER NOT NULL DEFAULT 1,
      raw_code TEXT,
      status TEXT NOT NULL,
      notes TEXT
    );

    CREATE INDEX idx_subjects_ref ON subjects(job_id, legacy_ref_num);
    CREATE INDEX idx_subject_codes_code ON subject_codes(code);
    CREATE INDEX idx_orders_subject ON orders(subject_id);
  `);
}

async function prepareLaptopPackage(_event, jobIdValue) {
  const jobId = numericId(jobIdValue);
  const jobRows = await querySql(`
    WITH
      subject_counts AS (
        SELECT job_id, COUNT(*) AS subjects
        FROM subjects
        WHERE job_id = ${jobId}
        GROUP BY job_id
      ),
      order_counts AS (
        SELECT job_id, COUNT(*) AS orders
        FROM orders
        WHERE job_id = ${jobId}
        GROUP BY job_id
      ),
      image_counts AS (
        SELECT job_id, COUNT(*) AS images
        FROM image_assets
        WHERE job_id = ${jobId}
        GROUP BY job_id
      )
    SELECT
      j.id,
      j.reference_number AS referenceNumber,
      j.name,
      j.type,
      j.status,
      j.root_path AS rootPath,
      j.shoot_date AS shootDate,
      j.retake_date AS retakeDate,
      j.package_plan_id AS packagePlanId,
      p.name AS packagePlanName,
      c.display_name AS clientName,
      c.trecs_name AS trecsName,
      c.reference_number AS clientReferenceNumber,
      COALESCE(sc.subjects, 0) AS subjects,
      COALESCE(oc.orders, 0) AS orders,
      COALESCE(ic.images, 0) AS images
    FROM jobs j
    JOIN clients c ON c.id = j.client_id
    LEFT JOIN package_plans p ON p.id = j.package_plan_id
    LEFT JOIN subject_counts sc ON sc.job_id = j.id
    LEFT JOIN order_counts oc ON oc.job_id = j.id
    LEFT JOIN image_counts ic ON ic.job_id = j.id
    WHERE j.id = ${jobId}
    LIMIT 1;
  `);

  if (!jobRows.length) {
    throw new Error('Job not found');
  }

  const job = jobRows[0];
  const createdAt = new Date();
  const setupName = `${safeFolderName(`${job.trecsName || job.clientName}-${job.name}`)}-onsite-${timestampForFolder(createdAt)}`;
  const setupPath = path.join(projectRoot, 'exports', 'onsite-setups', setupName);
  const setupDatabaseFolder = path.join(setupPath, 'Database');
  const setupCroppedMedFolder = path.join(setupPath, 'CroppedMed');
  const setupExportsFolder = path.join(setupPath, 'Exports');
  fs.mkdirSync(setupDatabaseFolder, { recursive: true });
  fs.mkdirSync(setupCroppedMedFolder, { recursive: true });
  fs.mkdirSync(setupExportsFolder, { recursive: true });

  const jobDatabasePath = await writeJobDatabaseSnapshot(jobId);
  const setupDatabasePath = path.join(setupDatabaseFolder, 'job.db');
  if (jobDatabasePath && fs.existsSync(jobDatabasePath)) {
    fs.copyFileSync(jobDatabasePath, setupDatabasePath);
  }

  const jobRoot = resolveProjectPath(job.rootPath);
  const croppedMedSource = path.join(jobRoot, 'CroppedMed');
  let copiedCroppedMed = 0;
  if (fs.existsSync(croppedMedSource)) {
    fs.readdirSync(croppedMedSource).forEach((name) => {
      const sourcePath = path.join(croppedMedSource, name);
      if (!fs.statSync(sourcePath).isFile() || !isImportableImage(sourcePath)) {
        return;
      }
      fs.copyFileSync(sourcePath, path.join(setupCroppedMedFolder, name));
      copiedCroppedMed += 1;
    });
  }

  const manifest = {
    packageType: 'onsite_setup',
    app: 'TRECS',
    createdAt: createdAt.toISOString(),
    workstation: process.env.COMPUTERNAME || os.hostname(),
    sourceDatabasePath: prototypeDatabasePath,
    school: {
      name: job.clientName,
      folderName: job.trecsName,
      referenceNumber: job.clientReferenceNumber
    },
    job: {
      id: job.id,
      name: job.name,
      type: job.type,
      status: job.status,
      rootPath: job.rootPath,
      shootDate: job.shootDate,
      retakeDate: job.retakeDate,
      packagePlanId: job.packagePlanId,
      packagePlanName: job.packagePlanName
    },
    counts: {
      subjects: job.subjects,
      orders: job.orders,
      images: job.images,
      croppedMediumImages: copiedCroppedMed
    },
    paths: {
      database: 'Database/job.db',
      croppedMedium: 'CroppedMed',
      exports: 'Exports'
    }
  };
  const manifestPath = path.join(setupPath, 'onsite-setup.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  return {
    packagePath: setupPath,
    manifestPath,
    databasePath: setupDatabasePath,
    counts: manifest.counts
  };
}

ipcMain.handle('laptop-package:prepare', prepareLaptopPackage);

function localCaptureRowsFromDatabase(database, jobId) {
  createLocalCaptureSchema(database);
  return rowsFromDatabase(database, `
    SELECT *
    FROM capture_events
    WHERE job_id = ${jobId}
    ORDER BY captured_at, id;
  `);
}

async function readLocalCaptureRows(jobId) {
  const dbPath = localCaptureDatabasePath(jobId);
  if (!fs.existsSync(dbPath)) {
    return { dbPath, rows: [] };
  }

  const SQL = await getSqlModule();
  const database = new SQL.Database(fs.readFileSync(dbPath));
  try {
    return {
      dbPath,
      rows: localCaptureRowsFromDatabase(database, jobId)
    };
  } finally {
    database.close();
  }
}

function endOfDayBaselinePath(rootPathValue) {
  return path.join(resolveProjectPath(rootPathValue), 'Database', 'onsite-start.db');
}

function normalizeSubjectForCompare(row) {
  return {
    id: row.id,
    ref: row.legacy_ref_num || '',
    type: row.subject_type || '',
    firstName: row.first_name || '',
    lastName: row.last_name || '',
    displayName: row.display_name || '',
    externalId: row.external_id || '',
    grade: row.grade || '',
    homeroom: row.homeroom || '',
    track: row.track || '',
    team: row.team || '',
    notes: row.notes || ''
  };
}

function subjectLabel(row) {
  return [
    row.legacy_ref_num || row.ref || '',
    row.display_name || row.displayName || [row.first_name || row.firstName, row.last_name || row.lastName].filter(Boolean).join(' ')
  ].filter(Boolean).join(' - ') || `Subject ${row.id}`;
}

function compareSubjectRows(currentRows, baselineRows) {
  const baselineById = new Map(baselineRows.map((row) => [Number(row.id), row]));
  const currentById = new Map(currentRows.map((row) => [Number(row.id), row]));
  const fields = [
    ['ref', 'Reference'],
    ['type', 'Type'],
    ['firstName', 'First'],
    ['lastName', 'Last'],
    ['displayName', 'Display'],
    ['externalId', 'Student ID'],
    ['grade', 'Grade'],
    ['homeroom', 'Homeroom'],
    ['track', 'Track'],
    ['team', 'Team'],
    ['notes', 'Notes']
  ];

  const newSubjects = currentRows
    .filter((row) => !baselineById.has(Number(row.id)))
    .map((row) => ({
      id: row.id,
      ref: row.legacy_ref_num,
      name: row.display_name || [row.first_name, row.last_name].filter(Boolean).join(' '),
      grade: row.grade,
      homeroom: row.homeroom
    }));

  const editedSubjects = [];
  currentRows.forEach((row) => {
    const baseline = baselineById.get(Number(row.id));
    if (!baseline) {
      return;
    }

    const currentValue = normalizeSubjectForCompare(row);
    const baselineValue = normalizeSubjectForCompare(baseline);
    const changes = fields
      .filter(([field]) => currentValue[field] !== baselineValue[field])
      .map(([field, label]) => ({
        field,
        label,
        before: baselineValue[field],
        after: currentValue[field]
      }));

    if (changes.length) {
      editedSubjects.push({
        id: row.id,
        ref: row.legacy_ref_num,
        name: row.display_name || [row.first_name, row.last_name].filter(Boolean).join(' '),
        changes
      });
    }
  });

  const deletedSubjects = baselineRows
    .filter((row) => !currentById.has(Number(row.id)))
    .map((row) => ({
      id: row.id,
      ref: row.legacy_ref_num,
      name: row.display_name || [row.first_name, row.last_name].filter(Boolean).join(' ')
    }));

  return { newSubjects, editedSubjects, deletedSubjects };
}

function parseImageMetadata(metadataJson) {
  if (!metadataJson) {
    return {};
  }
  try {
    return JSON.parse(metadataJson);
  } catch (_error) {
    return {};
  }
}

async function buildEndOfDayPreview(jobId) {
  const SQL = await getSqlModule();
  const sourceDatabase = new SQL.Database(fs.readFileSync(prototypeDatabasePath));

  try {
    const jobRows = rowsFromDatabase(sourceDatabase, `
      SELECT
        j.id,
        j.name,
        j.type,
        j.root_path AS rootPath,
        c.display_name AS clientName,
        c.trecs_name AS trecsName
      FROM jobs j
      JOIN clients c ON c.id = j.client_id
      WHERE j.id = ${jobId}
      LIMIT 1;
    `);
    if (!jobRows.length) {
      throw new Error('Job not found');
    }

    const job = jobRows[0];
    const subjectRows = rowsFromDatabase(sourceDatabase, `
      SELECT *
      FROM subjects
      WHERE job_id = ${jobId}
      ORDER BY legacy_ref_num, last_name, first_name, id;
    `);
    const capturedImages = rowsFromDatabase(sourceDatabase, `
      SELECT
        ia.id,
        ia.filename,
        ia.current_path AS currentPath,
        ia.metadata_json AS metadataJson,
        ia.captured_at AS capturedAt,
        s.id AS subjectId,
        s.legacy_ref_num AS ref,
        s.display_name AS studentName,
        si.selected
      FROM image_assets ia
      LEFT JOIN subject_images si ON si.image_asset_id = ia.id
      LEFT JOIN subjects s ON s.id = si.subject_id
      WHERE ia.job_id = ${jobId}
        AND ia.source = 'capture_hot_folder'
      ORDER BY ia.captured_at, ia.id;
    `).map((row) => {
      const metadata = parseImageMetadata(row.metadataJson);
      return {
        ...row,
        rawPath: metadata.rawPath || null
      };
    });

    const baselinePath = endOfDayBaselinePath(job.rootPath);
    let baselineRows = [];
    let hasBaseline = false;
    if (fs.existsSync(baselinePath)) {
      const baselineDatabase = new SQL.Database(fs.readFileSync(baselinePath));
      try {
        baselineRows = rowsFromOptionalTable(baselineDatabase, 'subjects');
        hasBaseline = true;
      } finally {
        baselineDatabase.close();
      }
    }

    const subjectChanges = hasBaseline
      ? compareSubjectRows(subjectRows, baselineRows)
      : {
          newSubjects: [],
          editedSubjects: [],
          deletedSubjects: []
        };
    const localCapture = await readLocalCaptureRows(jobId);

    return {
      job,
      baselinePath,
      hasBaseline,
      localCaptureDatabasePath: localCapture.dbPath,
      counts: {
        capturedImages: capturedImages.length,
        capturedRawFiles: capturedImages.filter((image) => image.rawPath).length,
        localCaptureEvents: localCapture.rows.length,
        newSubjects: subjectChanges.newSubjects.length,
        editedSubjects: subjectChanges.editedSubjects.length,
        deletedSubjects: subjectChanges.deletedSubjects.length
      },
      capturedImages,
      localCaptureEvents: localCapture.rows,
      subjectChanges
    };
  } finally {
    sourceDatabase.close();
  }
}

async function getEndOfDayPreview(_event, jobIdValue) {
  return buildEndOfDayPreview(numericId(jobIdValue));
}

function copyPackageFile(sourcePathValue, destinationFolder, fallbackName = null) {
  if (!sourcePathValue) {
    return null;
  }

  const sourcePath = resolveProjectPath(sourcePathValue);
  if (!sourcePath || !fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isFile()) {
    return null;
  }

  fs.mkdirSync(destinationFolder, { recursive: true });
  const destinationPath = uniquePath(destinationFolder, fallbackName || path.basename(sourcePath));
  fs.copyFileSync(sourcePath, destinationPath);
  return path.relative(projectRoot, destinationPath);
}

function adjustedEndOfDaySubjectChanges(preview, adjustments = {}) {
  const subjectChanges = preview.subjectChanges || {};
  const newSubjectAdjustments = new Map((adjustments.newSubjects || []).map((subject) => [Number(subject.id), subject]));
  const editedSubjectAdjustments = new Map((adjustments.editedSubjects || []).map((subject) => [Number(subject.id), subject]));

  const newSubjects = (subjectChanges.newSubjects || [])
    .map((subject) => {
      const adjustment = newSubjectAdjustments.get(Number(subject.id));
      if (adjustment && adjustment.include === false) {
        return null;
      }
      return {
        ...subject,
        name: adjustment && Object.prototype.hasOwnProperty.call(adjustment, 'name') ? adjustment.name : subject.name,
        grade: adjustment && Object.prototype.hasOwnProperty.call(adjustment, 'grade') ? adjustment.grade : subject.grade,
        homeroom: adjustment && Object.prototype.hasOwnProperty.call(adjustment, 'homeroom') ? adjustment.homeroom : subject.homeroom
      };
    })
    .filter(Boolean);

  const editedSubjects = (subjectChanges.editedSubjects || [])
    .map((subject) => {
      const adjustment = editedSubjectAdjustments.get(Number(subject.id));
      if (adjustment && adjustment.include === false) {
        return null;
      }
      const changeAdjustments = new Map(((adjustment && adjustment.changes) || []).map((change) => [change.field, change]));
      const changes = (subject.changes || [])
        .map((change) => {
          const changeAdjustment = changeAdjustments.get(change.field);
          if (changeAdjustment && changeAdjustment.include === false) {
            return null;
          }
          return {
            ...change,
            after: changeAdjustment && Object.prototype.hasOwnProperty.call(changeAdjustment, 'after')
              ? changeAdjustment.after
              : change.after
          };
        })
        .filter(Boolean);
      return changes.length ? { ...subject, changes } : null;
    })
    .filter(Boolean);

  return {
    ...subjectChanges,
    newSubjects,
    editedSubjects
  };
}

async function createEndOfDayPackage(_event, jobIdValue, adjustments = {}) {
  const jobId = numericId(jobIdValue);
  const preview = await buildEndOfDayPreview(jobId);
  const subjectChanges = adjustedEndOfDaySubjectChanges(preview, adjustments);
  const adjustedCounts = {
    ...preview.counts,
    newSubjects: subjectChanges.newSubjects.length,
    editedSubjects: subjectChanges.editedSubjects.length,
    deletedSubjects: (subjectChanges.deletedSubjects || []).length
  };
  const createdAt = new Date();
  const packageName = `${safeFolderName(`${preview.job.trecsName || preview.job.clientName}-${preview.job.name}`)}-end-of-day-${timestampForFolder(createdAt)}`;
  const packagePath = path.join(projectRoot, 'exports', 'end-of-day', packageName);
  const databaseFolder = path.join(packagePath, 'Database');
  const imagesFolder = path.join(packagePath, 'Images');
  fs.mkdirSync(databaseFolder, { recursive: true });
  fs.mkdirSync(imagesFolder, { recursive: true });

  const jobDatabasePath = await writeJobDatabaseSnapshot(jobId);
  if (jobDatabasePath && fs.existsSync(jobDatabasePath)) {
    fs.copyFileSync(jobDatabasePath, path.join(databaseFolder, 'job.db'));
  }
  if (preview.localCaptureDatabasePath && fs.existsSync(preview.localCaptureDatabasePath)) {
    fs.copyFileSync(preview.localCaptureDatabasePath, path.join(databaseFolder, 'capture.db'));
  }
  if (preview.hasBaseline && fs.existsSync(preview.baselinePath)) {
    fs.copyFileSync(preview.baselinePath, path.join(databaseFolder, 'onsite-start.db'));
  }

  const copiedImages = [];
  preview.capturedImages.forEach((image) => {
    const jpgPath = copyPackageFile(image.currentPath, imagesFolder);
    const rawPath = copyPackageFile(image.rawPath, imagesFolder);
    copiedImages.push({
      imageAssetId: image.id,
      ref: image.ref,
      studentName: image.studentName,
      filename: image.filename,
      jpgPath,
      rawPath,
      selected: image.selected === 1
    });
  });

  const manifest = {
    packageType: 'end_of_day',
    app: 'TRECS',
    createdAt: createdAt.toISOString(),
    workstation: process.env.COMPUTERNAME || os.hostname(),
    sourceDatabasePath: prototypeDatabasePath,
    job: preview.job,
    counts: adjustedCounts,
    copiedImages,
    subjectChanges,
    reviewAdjustments: adjustments || {},
    paths: {
      database: 'Database/job.db',
      localCaptureDatabase: preview.localCaptureEvents.length ? 'Database/capture.db' : null,
      onsiteStartDatabase: preview.hasBaseline ? 'Database/onsite-start.db' : null,
      images: 'Images'
    }
  };

  const manifestPath = path.join(packagePath, 'end-of-day-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  return {
    packagePath,
    manifestPath,
    databasePath: path.join(databaseFolder, 'job.db'),
    counts: adjustedCounts
  };
}

ipcMain.handle('end-of-day:preview', getEndOfDayPreview);
ipcMain.handle('end-of-day:create', createEndOfDayPackage);

async function writeSql(updateDatabase) {
  const SQL = await getSqlModule();
  const databaseBytes = fs.readFileSync(prototypeDatabasePath);
  const database = new SQL.Database(databaseBytes);

  try {
    database.run('BEGIN TRANSACTION');
    const result = updateDatabase(database);
    database.run('COMMIT');
    fs.writeFileSync(prototypeDatabasePath, Buffer.from(database.export()));
    return result;
  } catch (error) {
    try {
      database.run('ROLLBACK');
    } catch (_rollbackError) {
      // The original database error is more useful than a rollback failure.
    }
    throw error;
  } finally {
    database.close();
  }
}

async function getDashboardData() {
  const counts = await querySql(`
    SELECT 'Clients' AS label, COUNT(*) AS value FROM clients
    UNION ALL SELECT 'Jobs', COUNT(*) FROM jobs
    UNION ALL SELECT 'Subjects', COUNT(*) FROM subjects
    UNION ALL SELECT 'Orders', COUNT(*) FROM orders
    UNION ALL SELECT 'Images', COUNT(*) FROM image_assets;
  `);

  const jobs = await querySql(`
    SELECT
      COALESCE(c.trecs_name, c.display_name, '') AS location,
      j.name AS job,
      j.type,
      COALESCE(p.name, '') AS packagePlan,
      j.status
    FROM jobs j
    JOIN clients c ON c.id = j.client_id
    LEFT JOIN package_plans p ON p.id = j.package_plan_id
    ORDER BY c.trecs_name, j.name;
  `);

  const migration = await querySql(`
    SELECT 'Package Items' AS label, COUNT(*) || ' mapped' AS value
    FROM package_code_items
    WHERE product_id IS NOT NULL
    UNION ALL
    SELECT 'Senior Image Orders', COUNT(*) || ' linked'
    FROM order_items oi
    JOIN subjects s ON s.id = oi.subject_id
    WHERE s.subject_type = 'senior' AND oi.image_asset_id IS NOT NULL
    UNION ALL
    SELECT 'Open Code Review', GROUP_CONCAT(package_code, ', ')
    FROM (
      SELECT DISTINCT oi.package_code
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      JOIN jobs j ON j.id = o.job_id
      LEFT JOIN package_codes pc ON pc.code = oi.package_code AND pc.package_plan_id = j.package_plan_id
      WHERE pc.id IS NULL
      ORDER BY oi.package_code
    );
  `);

  return {
    counts,
    jobs,
    migration,
    databasePath: prototypeDatabasePath
  };
}

ipcMain.handle('dashboard:get', getDashboardData);

async function getJobsData() {
  const jobs = await querySql(`
    WITH
      subject_counts AS (
        SELECT
          job_id,
          COUNT(*) AS subjects,
          SUM(CASE WHEN primary_image_asset_id IS NOT NULL THEN 1 ELSE 0 END) AS subjectsWithPrimaryImage
        FROM subjects
        GROUP BY job_id
      ),
      order_counts AS (
        SELECT job_id, COUNT(*) AS orders
        FROM orders
        GROUP BY job_id
      ),
      order_item_counts AS (
        SELECT o.job_id, COUNT(oi.id) AS orderItems
        FROM orders o
        LEFT JOIN order_items oi ON oi.order_id = o.id
        GROUP BY o.job_id
      ),
      image_counts AS (
        SELECT job_id, COUNT(*) AS images
        FROM image_assets
        GROUP BY job_id
      ),
      subject_image_counts AS (
        SELECT s.job_id, COUNT(si.id) AS subjectImages
        FROM subjects s
        LEFT JOIN subject_images si ON si.subject_id = s.id
        GROUP BY s.job_id
      )
    SELECT
      j.id,
      COALESCE(c.trecs_name, c.display_name, '') AS location,
      c.display_name AS clientName,
      j.name AS job,
      j.type,
      j.status,
      j.root_path AS rootPath,
      COALESCE(p.name, '') AS packagePlan,
      COALESCE(sc.subjects, 0) AS subjects,
      COALESCE(sc.subjectsWithPrimaryImage, 0) AS subjectsWithPrimaryImage,
      COALESCE(oc.orders, 0) AS orders,
      COALESCE(oic.orderItems, 0) AS orderItems,
      COALESCE(ic.images, 0) AS images,
      COALESCE(sic.subjectImages, 0) AS subjectImages
    FROM jobs j
    JOIN clients c ON c.id = j.client_id
    LEFT JOIN package_plans p ON p.id = j.package_plan_id
    LEFT JOIN subject_counts sc ON sc.job_id = j.id
    LEFT JOIN order_counts oc ON oc.job_id = j.id
    LEFT JOIN order_item_counts oic ON oic.job_id = j.id
    LEFT JOIN image_counts ic ON ic.job_id = j.id
    LEFT JOIN subject_image_counts sic ON sic.job_id = j.id
    ORDER BY c.trecs_name, j.name;
  `);

  const types = await querySql(`
    SELECT type, COUNT(*) AS count
    FROM jobs
    GROUP BY type
    ORDER BY type;
  `);

  const clients = await querySql(`
    SELECT id, display_name AS displayName, trecs_name AS trecsName
    FROM clients
    ORDER BY trecs_name, display_name;
  `);

  const packagePlans = await querySql(`
    SELECT id, name, version
    FROM package_plans
    WHERE active = 1
    ORDER BY name, version;
  `);

  return {
    jobs,
    types,
    clients,
    packagePlans,
    databasePath: prototypeDatabasePath
  };
}

ipcMain.handle('jobs:list', getJobsData);

function numericId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    throw new Error('Invalid id');
  }
  return id;
}

function normalizeJobType(value) {
  const type = String(value || '').trim();
  const allowed = new Set(['fall', 'sports', 'spring', 'seniors', 'event', 'qr_event', 'league']);
  if (!allowed.has(type)) {
    throw new Error('Invalid job type');
  }
  return type;
}

function normalizeNullableId(value, label) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  try {
    return numericId(value);
  } catch (_error) {
    throw new Error(`Invalid ${label}`);
  }
}

const ADMIN_ITEM_TYPES = new Map([
  ['delivery_envelope_cover', {
    label: 'Delivery Envelope Cover',
    extension: 'txt',
    stages: ['original_picture_day', 'makeup_day']
  }],
  ['school_directory', {
    label: 'School Directory',
    extension: 'csv',
    stages: ['original_picture_day', 'makeup_day']
  }],
  ['missing_photo_report', {
    label: 'Missing Photo Report',
    extension: 'csv',
    stages: ['original_picture_day', 'makeup_day']
  }],
  ['sis_export', {
    label: 'SIS Export',
    extension: 'csv',
    stages: ['original_picture_day', 'makeup_day']
  }],
  ['id_cards', {
    label: 'ID Cards',
    extension: 'csv',
    stages: ['original_picture_day', 'makeup_day']
  }],
  ['sticker_prints', {
    label: 'Sticker Prints',
    extension: 'csv',
    stages: ['makeup_day']
  }],
  ['staff_picture_packages', {
    label: 'Staff Picture Packages',
    extension: 'csv',
    stages: ['makeup_day']
  }]
]);

function normalizeShootStage(value) {
  const stage = String(value || 'original_picture_day').trim();
  const allowed = new Set(['original_picture_day', 'makeup_day']);
  if (!allowed.has(stage)) {
    throw new Error('Invalid shoot stage');
  }
  return stage;
}

function normalizeAdminItemType(value, stage) {
  const type = String(value || '').trim();
  const item = ADMIN_ITEM_TYPES.get(type);
  if (!item || !item.stages.includes(stage)) {
    throw new Error('Invalid admin item type');
  }
  return type;
}

function normalizeDirectorySort(value) {
  const sort = String(value || 'grade').trim();
  const allowed = new Set(['grade', 'homeroom', 'track', 'name', 'ref']);
  if (!allowed.has(sort)) {
    throw new Error('Invalid directory sort');
  }
  return sort;
}

function normalizeDirectoryType(value) {
  const type = String(value || 'mugbook').trim();
  const allowed = new Set(['mugbook', 'library_book']);
  if (!allowed.has(type)) {
    throw new Error('Invalid directory type');
  }
  return type;
}

function normalizeDirectorySource(value) {
  const source = String(value || 'all').trim();
  const allowed = new Set(['all', 'list']);
  if (!allowed.has(source)) {
    throw new Error('Invalid directory source');
  }
  return source;
}

function normalizeDirectorySortMethod(value) {
  const sort = String(value || 'alpha_grade').trim();
  const allowed = new Set(['alpha_grade', 'alpha_homeroom', 'alpha_school']);
  if (!allowed.has(sort)) {
    throw new Error('Invalid directory sort method');
  }
  return sort;
}

function normalizeStickerSource(value) {
  const source = String(value || 'all').trim();
  const allowed = new Set(['all', 'list']);
  if (!allowed.has(source)) {
    throw new Error('Invalid sticker source');
  }
  return source;
}

function normalizeStickerSortMethod(value) {
  const sort = String(value || 'alpha').trim();
  const allowed = new Set(['alpha', 'alpha_grade', 'alpha_teacher']);
  if (!allowed.has(sort)) {
    throw new Error('Invalid sticker sort method');
  }
  return sort;
}

function normalizeStickerCopies(value) {
  const copies = Number(value || 3);
  if (!Number.isInteger(copies) || copies < 1 || copies > 50) {
    throw new Error('Sticker count must be between 1 and 50');
  }
  return copies;
}

const SIS_EXPORT_FORMATS = new Map([
  ['student_cd', {
    label: 'Student CD',
    folder: 'Student CD',
    legacyFolder: 'STUDENT_CD_IMAGES',
    linkFile: 'IDLINK.txt',
    exceptionFile: 'Exceptions.txt'
  }],
  ['destiny', {
    label: 'Destiny',
    folder: 'Destiny',
    legacyFolder: 'DESTINY',
    linkFile: 'IDLINK.txt',
    exceptionFile: 'Exceptions.txt'
  }],
  ['powerschool', {
    label: 'PowerSchool',
    folder: 'PowerSchool',
    legacyFolder: 'POWERSCHOOL_CD_IMAGES',
    linkFile: 'MAP.TXT',
    exceptionFile: 'Exceptions.TXT'
  }],
  ['sasi', {
    label: 'SASI',
    folder: 'SASI',
    legacyFolder: path.join('SASI_CD_IMAGES', 'DATAMAC'),
    linkFile: 'XREFPICT.txt',
    exceptionFile: 'Exceptions.txt'
  }]
]);

function normalizeSisFormats(value) {
  const rawFormats = Array.isArray(value) ? value : [value || 'student_cd'];
  const formats = rawFormats
    .map((format) => String(format || '').trim())
    .filter(Boolean);
  const unique = [];

  formats.forEach((format) => {
    if (!SIS_EXPORT_FORMATS.has(format)) {
      throw new Error('Invalid SIS export format');
    }
    if (!unique.includes(format)) {
      unique.push(format);
    }
  });

  return unique.length ? unique : ['student_cd'];
}

function normalizeIdCardSource(value) {
  const source = String(value || 'all').trim();
  const allowed = new Set(['all', 'list', 'single']);
  if (!allowed.has(source)) {
    throw new Error('Invalid ID card source');
  }
  return source;
}

function normalizeIdCardLayout(value) {
  const layout = String(value || 'standard').trim();
  const allowed = new Set(['standard', 'staff', 'temporary']);
  if (!allowed.has(layout)) {
    throw new Error('Invalid ID card layout');
  }
  return layout;
}

function normalizeIdCardReason(value) {
  const reason = String(value || 'admin_batch').trim();
  const allowed = new Set(['admin_batch', 'makeup_day', 'replacement_request', 'school_request']);
  if (!allowed.has(reason)) {
    throw new Error('Invalid ID card reason');
  }
  return reason;
}

function csvValue(value) {
  const text = String(value ?? '');
  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function csvRows(headers, rows) {
  return [
    headers.map(csvValue).join(','),
    ...rows.map((row) => headers.map((header) => csvValue(row[header])).join(','))
  ].join('\r\n');
}

function subjectDisplayName(subject) {
  return subject.displayName || [subject.firstName, subject.lastName].filter(Boolean).join(' ') || '';
}

function subjectSortValue(subject, key) {
  if (key === 'name') {
    return subjectDisplayName(subject).toLowerCase();
  }
  if (key === 'ref') {
    return String(subject.ref || '').padStart(12, '0');
  }
  return String(subject[key] || '').toLowerCase();
}

function sortDirectorySubjects(subjects, sortMethod) {
  return [...subjects].sort((first, second) => {
    const sortParts = {
      alpha_grade: ['grade', 'lastName', 'firstName', 'ref'],
      alpha_homeroom: ['homeroom', 'lastName', 'firstName', 'ref'],
      alpha_school: ['lastName', 'firstName', 'grade', 'homeroom', 'ref']
    }[sortMethod] || ['grade', 'lastName', 'firstName', 'ref'];

    for (const key of sortParts) {
      const firstValue = key === 'lastName' || key === 'firstName'
        ? String(first[key] || '').toLowerCase()
        : subjectSortValue(first, key);
      const secondValue = key === 'lastName' || key === 'firstName'
        ? String(second[key] || '').toLowerCase()
        : subjectSortValue(second, key);
      const comparison = firstValue.localeCompare(secondValue, undefined, {
        numeric: true,
        sensitivity: 'base'
      });
      if (comparison !== 0) {
        return comparison;
      }
    }

    return 0;
  });
}

function selectedDirectorySubjects(subjects, options, listSubjectIds) {
  return subjects.filter((subject) => {
    const hasName = Boolean(String(subject.firstName || subject.lastName || subject.displayName || '').trim());
    if (!hasName || subject.grade === 'EXMPT') {
      return false;
    }
    if (options.directoryPhotographedOnly && !subject.imageFilename) {
      return false;
    }
    if (options.directorySource === 'list' && !listSubjectIds.has(subject.id)) {
      return false;
    }
    return true;
  });
}

function directorySubjectRow(subject, page, position, groupLabel, directoryType) {
  return {
    Page: page,
    Position: position,
    Group: groupLabel,
    Ref: subject.ref,
    First: subject.firstName,
    Last: subject.lastName,
    Name: subjectDisplayName(subject),
    'Student ID': subject.externalId,
    Grade: subject.grade,
    Homeroom: subject.homeroom,
    Track: subject.track,
    Team: subject.team,
    Image: subject.imageFilename,
    'Image Path': subject.imagePath,
    'Photo Status': subject.imageFilename ? 'photographed' : 'not_photographed',
    'Directory Type': directoryType
  };
}

function buildMugbookDirectoryRows(subjects, options) {
  const sorted = sortDirectorySubjects(subjects, options.directorySortMethod);
  const rows = [];
  let page = 2;
  let position = 0;
  let currentGroup = '';

  sorted.forEach((subject) => {
    const groupValue = options.directorySortMethod === 'alpha_homeroom'
      ? `Homeroom: ${subject.homeroom || ''}`
      : options.directorySortMethod === 'alpha_grade'
        ? `Grade: ${subject.grade || ''}`
        : 'Alpha by School';

    if (position > 0 && currentGroup && groupValue !== currentGroup && options.directorySortMethod !== 'alpha_school') {
      page += 1;
      position = 0;
    } else if (position === 30) {
      page += 1;
      position = 0;
    }

    currentGroup = groupValue;
    rows.push(directorySubjectRow(subject, page, position + 1, currentGroup, 'mugbook'));
    position += 1;
  });

  return rows;
}

function buildLibraryDirectoryRows(subjects) {
  const sorted = sortDirectorySubjects(subjects, 'alpha_homeroom');
  const groups = new Map();
  sorted.forEach((subject) => {
    if (!subject.homeroom) {
      return;
    }
    if (!groups.has(subject.homeroom)) {
      groups.set(subject.homeroom, []);
    }
    groups.get(subject.homeroom).push(subject);
  });

  const rows = [];
  let page = 1;
  groups.forEach((groupSubjects, homeroom) => {
    const cellsPerPage = groupSubjects.length < 37 ? 18 : 21;
    groupSubjects.forEach((subject, index) => {
      if (index > 0 && index % cellsPerPage === 0) {
        page += 1;
      }
      rows.push(directorySubjectRow(subject, page, (index % cellsPerPage) + 1, homeroom, 'library_book'));
    });
    page += 1;
  });

  return rows;
}

function sortStickerSubjects(subjects, sortMethod) {
  const mappedSort = {
    alpha: 'alpha_school',
    alpha_grade: 'alpha_grade',
    alpha_teacher: 'alpha_homeroom'
  }[sortMethod] || 'alpha_school';
  return sortDirectorySubjects(subjects, mappedSort);
}

function selectedStickerSubjects(subjects, options, listSubjectIds) {
  return subjects.filter((subject) => {
    const hasName = Boolean(String(subject.firstName || subject.lastName || subject.displayName || '').trim());
    if (!hasName || subject.grade === 'EXMPT' || subject.grade === 'FAC') {
      return false;
    }
    if (options.stickerPhotographedOnly && !subject.imageFilename) {
      return false;
    }
    if (options.stickerSource === 'list' && !listSubjectIds.has(subject.id)) {
      return false;
    }
    return true;
  });
}

function buildStickerRows(subjects, options) {
  const sorted = sortStickerSubjects(subjects, options.stickerSortMethod);
  const rows = [];
  let page = 1;
  let position = 0;
  let currentGroup = '';

  sorted.forEach((subject) => {
    const groupValue = options.stickerSortMethod === 'alpha_teacher'
      ? subject.homeroom || ''
      : options.stickerSortMethod === 'alpha_grade'
        ? subject.grade || ''
        : '';

    for (let copy = 1; copy <= options.stickerCopies; copy += 1) {
      if (position > 0 && groupValue && currentGroup && groupValue !== currentGroup) {
        page += 1;
        position = 0;
      } else if (position === 36) {
        page += 1;
        position = 0;
      }

      currentGroup = groupValue;
      rows.push({
        Page: page,
        Position: position + 1,
        Copy: copy,
        Group: groupValue,
        Ref: subject.ref,
        First: subject.firstName,
        Last: subject.lastName,
        Name: subjectDisplayName(subject),
        'Student ID': subject.externalId,
        Grade: subject.grade,
        Homeroom: subject.homeroom,
        Image: subject.imageFilename,
        'Image Path': subject.imagePath
      });
      position += 1;
    }
  });

  return rows;
}

function sisSubjectSort(first, second) {
  for (const key of ['lastName', 'firstName', 'ref']) {
    const firstValue = key === 'ref' ? subjectSortValue(first, key) : String(first[key] || '').toLowerCase();
    const secondValue = key === 'ref' ? subjectSortValue(second, key) : String(second[key] || '').toLowerCase();
    const comparison = firstValue.localeCompare(secondValue, undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    if (comparison !== 0) {
      return comparison;
    }
  }
  return 0;
}

function sisExportSubjects(subjects) {
  return subjects
    .filter((subject) => String(subject.firstName || '').trim() && String(subject.lastName || '').trim())
    .sort(sisSubjectSort);
}

function quotedTextFields(values) {
  return values.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',');
}

function tabFields(values) {
  return values.map((value) => String(value ?? '')).join('\t');
}

function sisExceptionLine(subject, reason) {
  const name = `${subject.lastName || ''}, ${subject.firstName || ''}`.trim();
  if (reason === 'missing_id') {
    return `No Student ID 1: ${subject.ref || ''} - ${name}`;
  }
  return `No Image: ${subject.ref || ''} - ${name} - ID: ${subject.externalId || ''}`;
}

function sisImageFileName(subject) {
  return `${String(subject.externalId || '').trim()}.jpg`;
}

function sasiStudentId(subject) {
  const text = String(subject.externalId || '').trim();
  if (/^\d+$/.test(text)) {
    return text.padStart(10, '0');
  }
  return text.padStart(10, '0');
}

function sisTargetImagePath(format, subject) {
  const definition = SIS_EXPORT_FORMATS.get(format);
  if (format === 'sasi') {
    return path.join('SASI_CD_IMAGES', 'PCTFILEC', sisImageFileName(subject));
  }
  return path.join(definition.legacyFolder, sisImageFileName(subject));
}

function sisLinkLine(format, subject) {
  const imageName = sisImageFileName(subject);
  if (format === 'student_cd') {
    return quotedTextFields([
      subject.externalId,
      imageName,
      subject.lastName,
      subject.firstName,
      subject.grade
    ]);
  }
  if (format === 'destiny') {
    return quotedTextFields([subject.externalId, imageName]);
  }
  if (format === 'powerschool') {
    return tabFields([subject.externalId, imageName]);
  }
  if (format === 'sasi') {
    return quotedTextFields([sasiStudentId(subject), imageName]);
  }
  throw new Error('Invalid SIS export format');
}

function buildSisFormatOutput(format, subjects) {
  const definition = SIS_EXPORT_FORMATS.get(format);
  const linkLines = format === 'sasi' ? [quotedTextFields(['', '.JPG'])] : [];
  const exceptionLines = [];
  const summaryRows = [];

  subjects.forEach((subject) => {
    const hasId = Boolean(String(subject.externalId || '').trim());
    const hasImage = Boolean(String(subject.imageFilename || '').trim());
    const targetImage = hasId ? sisTargetImagePath(format, subject) : '';

    if (!hasId) {
      exceptionLines.push(sisExceptionLine(subject, 'missing_id'));
      summaryRows.push({
        Format: definition.label,
        Status: 'Missing Student ID',
        Ref: subject.ref,
        'Student ID': '',
        First: subject.firstName,
        Last: subject.lastName,
        Grade: subject.grade,
        'Image Source': subject.imagePath || subject.imageFilename || '',
        'Image Target': '',
        Message: 'No Student ID'
      });
      return;
    }

    if (!hasImage) {
      exceptionLines.push(sisExceptionLine(subject, 'missing_image'));
      summaryRows.push({
        Format: definition.label,
        Status: 'Missing Image',
        Ref: subject.ref,
        'Student ID': subject.externalId,
        First: subject.firstName,
        Last: subject.lastName,
        Grade: subject.grade,
        'Image Source': '',
        'Image Target': targetImage,
        Message: 'No linked primary image'
      });
      return;
    }

    linkLines.push(sisLinkLine(format, subject));
    summaryRows.push({
      Format: definition.label,
      Status: 'Ready',
      Ref: subject.ref,
      'Student ID': subject.externalId,
      First: subject.firstName,
      Last: subject.lastName,
      Grade: subject.grade,
      'Image Source': subject.imagePath || subject.imageFilename || '',
      'Image Target': targetImage,
      Message: ''
    });
  });

  return {
    definition,
    linkContent: linkLines.join('\r\n'),
    exceptionContent: exceptionLines.join('\r\n'),
    summaryRows,
    ready: summaryRows.filter((row) => row.Status === 'Ready').length,
    exceptions: exceptionLines.length
  };
}

function selectedIdCardSubjects(subjects, options, listSubjectIds) {
  return subjects.filter((subject) => {
    const hasName = Boolean(String(subject.firstName || subject.lastName || subject.displayName || '').trim());
    if (!hasName) {
      return false;
    }
    if (options.idCardPhotographedOnly && !subject.imageFilename) {
      return false;
    }
    if (options.idCardSource === 'list' && !listSubjectIds.has(subject.id)) {
      return false;
    }
    return true;
  });
}

function buildIdCardRows(subjects, options) {
  return sortDirectorySubjects(subjects, 'alpha_school').map((subject, index) => ({
    Card: index + 1,
    Ref: subject.ref,
    Name: subjectDisplayName(subject),
    'Student ID': subject.externalId,
    Grade: subject.grade,
    Homeroom: subject.homeroom,
    Track: subject.track,
    Type: subject.subjectType,
    Layout: options.idCardLayout,
    Reason: options.idCardReason,
    Image: subject.imageFilename,
    'Image Path': subject.imagePath,
    Status: subject.imageFilename ? 'ready' : 'missing_photo'
  }));
}

function buildIdCardOutput(job, subjects, options) {
  const rows = buildIdCardRows(subjects, options);
  const csv = csvRows([
    'Card',
    'Ref',
    'Name',
    'Student ID',
    'Grade',
    'Homeroom',
    'Track',
    'Type',
    'Layout',
    'Reason',
    'Image',
    'Image Path',
    'Status'
  ], rows);
  const manifest = {
    job: {
      id: job.id,
      location: job.location,
      name: job.job
    },
    idCardSource: options.idCardSource,
    idCardListName: options.idCardSource === 'list' ? options.idCardListName : '',
    layout: options.idCardLayout,
    reason: options.idCardReason,
    photographedOnly: options.idCardPhotographedOnly,
    selectedSubjects: subjects.length,
    cards: rows.length,
    legacyBehavior: {
      imageFolder: 'CroppedMed',
      rendering: 'Prototype creates an ID-card work list and manifest; print-ready card layout rendering will replace this CSV output.'
    }
  };

  return {
    csv,
    manifest
  };
}

function adminOutputRelativePath(job, stage, type, extension, date = new Date()) {
  const item = ADMIN_ITEM_TYPES.get(type);
  const itemFolder = safeFolderName(item ? item.label : type);
  const filename = `${safeFolderName(type)}-${timestampForFolder(date)}.${extension}`;

  const folder = path.join(
    job.rootPath,
    'AdminItems',
    safeFolderName(stage),
    itemFolder
  );
  return path.join(folder, filename);
}

function adminOutputAbsolutePath(outputPath) {
  return path.isAbsolute(outputPath) ? outputPath : path.join(projectRoot, outputPath);
}

async function adminJobSummary(jobId) {
  const rows = await querySql(`
    SELECT
      j.id,
      j.name AS job,
      j.type,
      j.root_path AS rootPath,
      j.shoot_date AS shootDate,
      j.retake_date AS retakeDate,
      c.display_name AS clientName,
      COALESCE(c.trecs_name, c.display_name, '') AS location
    FROM jobs j
    JOIN clients c ON c.id = j.client_id
    WHERE j.id = ${jobId};
  `);

  if (!rows.length) {
    throw new Error('Job not found');
  }

  return rows[0];
}

async function adminSubjectRows(jobId) {
  return querySql(`
    SELECT
      s.id,
      s.legacy_ref_num AS ref,
      s.first_name AS firstName,
      s.last_name AS lastName,
      s.display_name AS displayName,
      s.external_id AS externalId,
      s.grade,
      s.homeroom,
      s.track,
      s.team,
      s.subject_type AS subjectType,
      s.photographed_status AS photographedStatus,
      ia.filename AS imageFilename,
      ia.current_path AS imagePath
    FROM subjects s
    LEFT JOIN image_assets ia ON ia.id = s.primary_image_asset_id
    WHERE s.job_id = ${jobId}
    ORDER BY
      CASE
        WHEN s.legacy_ref_num IS NOT NULL
          AND s.legacy_ref_num != ''
          AND s.legacy_ref_num NOT GLOB '*[^0-9]*'
        THEN 0
        ELSE 1
      END,
      CAST(s.legacy_ref_num AS INTEGER),
      s.legacy_ref_num,
      s.id;
  `);
}

async function adminListNames(jobId) {
  const rows = await querySql(`
    SELECT name
    FROM subject_groups
    WHERE job_id = ${jobId}
    ORDER BY name;
  `);
  return rows.map((row) => row.name);
}

async function adminListSubjectIds(jobId, listName) {
  if (!listName) {
    return new Set();
  }

  const rows = await querySql(`
    SELECT sgm.subject_id AS subjectId
    FROM subject_group_members sgm
    JOIN subject_groups sg ON sg.id = sgm.group_id
    WHERE sg.job_id = ${jobId}
      AND sg.name = '${String(listName).replace(/'/g, "''")}';
  `);
  return new Set(rows.map((row) => row.subjectId));
}

function adminItemDefinitionsForStage(stage) {
  return Array.from(ADMIN_ITEM_TYPES.entries())
    .filter(([_type, item]) => item.stages.includes(stage))
    .map(([type, item]) => ({
      type,
      label: item.label,
      extension: item.extension
    }));
}

function buildAdminContent(type, stage, job, subjects, options) {
  const photographed = subjects.filter((subject) => subject.imageFilename);
  const missing = subjects.filter((subject) => !subject.imageFilename || subject.photographedStatus !== 'photographed');
  const sortBy = normalizeDirectorySort(options.sortBy);
  const sortedSubjects = [...subjects].sort((first, second) => {
    const firstValue = subjectSortValue(first, sortBy);
    const secondValue = subjectSortValue(second, sortBy);
    if (firstValue !== secondValue) {
      return firstValue.localeCompare(secondValue, undefined, { numeric: true, sensitivity: 'base' });
    }
    return subjectSortValue(first, 'name').localeCompare(subjectSortValue(second, 'name'), undefined, {
      numeric: true,
      sensitivity: 'base'
    });
  });

  if (type === 'delivery_envelope_cover') {
    return [
      `${job.location} / ${job.job}`,
      `${stage === 'makeup_day' ? 'Makeup Day' : 'Original Picture Day'} Delivery Envelope Cover`,
      '',
      `Subjects: ${subjects.length}`,
      `Photographed: ${photographed.length}`,
      `Missing: ${missing.length}`,
      `Shoot Date: ${job.shootDate || ''}`,
      `Retake Date: ${job.retakeDate || ''}`,
      '',
      'Prototype output. Layout rendering will replace this text file in the next rendering pass.'
    ].join('\r\n');
  }

  if (type === 'missing_photo_report') {
    return csvRows(['Ref', 'Name', 'Student ID', 'Grade', 'Homeroom', 'Track', 'Photo Status'], missing.map((subject) => ({
      Ref: subject.ref,
      Name: subjectDisplayName(subject),
      'Student ID': subject.externalId,
      Grade: subject.grade,
      Homeroom: subject.homeroom,
      Track: subject.track,
      'Photo Status': subject.photographedStatus || 'unknown'
    })));
  }

  if (type === 'id_cards') {
    return buildIdCardOutput(job, photographed, options).csv;
  }

  if (type === 'staff_picture_packages') {
    const staff = photographed.filter((subject) => ['faculty', 'staff'].includes(subject.subjectType));
    return csvRows(['Ref', 'Name', 'Type', 'Image'], staff.map((subject) => ({
      Ref: subject.ref,
      Name: subjectDisplayName(subject),
      Type: subject.subjectType,
      Image: subject.imageFilename
    })));
  }

  throw new Error('Unsupported admin item type');
}

function outputFileName(baseName, outputStem) {
  const extension = path.extname(baseName);
  const name = path.basename(baseName, extension);
  return `${name}-${outputStem}${extension}`;
}

function buildSisExportOutput(job, subjects, options, outputStem) {
  const selectedSubjects = sisExportSubjects(subjects);
  const formats = normalizeSisFormats(options.sisFormats);
  const summaryRows = [];
  const files = [];
  const manifestFormats = [];

  formats.forEach((format) => {
    const output = buildSisFormatOutput(format, selectedSubjects);
    const formatFolder = safeFolderName(output.definition.folder);
    const linkFile = outputFileName(output.definition.linkFile, outputStem);
    const exceptionFile = outputFileName(output.definition.exceptionFile, outputStem);
    files.push({
      relativePath: path.join(formatFolder, linkFile),
      content: output.linkContent
    });
    files.push({
      relativePath: path.join(formatFolder, exceptionFile),
      content: output.exceptionContent
    });
    summaryRows.push(...output.summaryRows);
    manifestFormats.push({
      format,
      label: output.definition.label,
      legacyFolder: output.definition.legacyFolder,
      linkFile: path.join(formatFolder, linkFile),
      exceptionFile: path.join(formatFolder, exceptionFile),
      ready: output.ready,
      exceptions: output.exceptions
    });
  });

  const summaryCsv = csvRows([
    'Format',
    'Status',
    'Ref',
    'Student ID',
    'First',
    'Last',
    'Grade',
    'Image Source',
    'Image Target',
    'Message'
  ], summaryRows);

  const manifest = {
    job: {
      id: job.id,
      location: job.location,
      name: job.job
    },
    selectedFormats: formats,
    selectedSubjects: selectedSubjects.length,
    skippedBlankNameSubjects: subjects.length - selectedSubjects.length,
    formats: manifestFormats,
    legacyBehavior: {
      sort: 'last name, first name',
      excludes: ['blank first or last name'],
      imageFolder: 'CroppedMed',
      imageCopying: 'Prototype creates map and exception files; physical image copy/resize will be added in the render pass.'
    }
  };

  return {
    summaryCsv,
    files,
    manifest
  };
}

function buildSchoolDirectoryOutput(job, subjects, options, listSubjectIds) {
  const directorySubjects = selectedDirectorySubjects(subjects, options, listSubjectIds);
  const planRows = options.directoryType === 'library_book'
    ? buildLibraryDirectoryRows(directorySubjects)
    : buildMugbookDirectoryRows(directorySubjects, options);
  const csv = csvRows([
    'Page',
    'Position',
    'Group',
    'Ref',
    'First',
    'Last',
    'Name',
    'Student ID',
    'Grade',
    'Homeroom',
    'Track',
    'Team',
    'Image',
    'Image Path',
    'Photo Status',
    'Directory Type'
  ], planRows);

  const manifest = {
    job: {
      id: job.id,
      location: job.location,
      name: job.job
    },
    directoryType: options.directoryType,
    directorySource: options.directorySource,
    directoryListName: options.directorySource === 'list' ? options.directoryListName : '',
    directorySortMethod: options.directorySortMethod,
    photographedOnly: options.directoryPhotographedOnly,
    schoolYear: options.directorySchoolYear,
    contactLine: options.directoryContactLine,
    selectedSubjects: directorySubjects.length,
    pages: planRows.length ? Math.max(...planRows.map((row) => row.Page)) : 0,
    legacyBehavior: {
      mugbookCellsPerPage: 30,
      mugbookBreaks: ['grade', 'homeroom'],
      libraryBookGrouping: 'homeroom',
      libraryBookCellsPerPage: '18 for small homerooms, 21 for larger homerooms',
      excludes: ['EXMPT grade', 'blank names'],
      imageFolder: 'CroppedMed'
    }
  };

  return {
    csv,
    manifest
  };
}

function buildStickerPrintOutput(job, subjects, options, listSubjectIds) {
  const stickerSubjects = selectedStickerSubjects(subjects, options, listSubjectIds);
  const planRows = buildStickerRows(stickerSubjects, options);
  const csv = csvRows([
    'Page',
    'Position',
    'Copy',
    'Group',
    'Ref',
    'First',
    'Last',
    'Name',
    'Student ID',
    'Grade',
    'Homeroom',
    'Image',
    'Image Path'
  ], planRows);

  const manifest = {
    job: {
      id: job.id,
      location: job.location,
      name: job.job
    },
    stickerSource: options.stickerSource,
    stickerListName: options.stickerSource === 'list' ? options.stickerListName : '',
    stickerCopies: options.stickerCopies,
    stickerSortMethod: options.stickerSortMethod,
    photographedOnly: options.stickerPhotographedOnly,
    selectedSubjects: stickerSubjects.length,
    totalStickers: planRows.length,
    pages: planRows.length ? Math.max(...planRows.map((row) => row.Page)) : 0,
    legacyBehavior: {
      cellsPerPage: 36,
      sortMethods: ['Alpha', 'Alpha by Grade', 'Alpha by Teacher'],
      pageBreaks: ['grade when Alpha by Grade', 'homeroom when Alpha by Teacher'],
      excludes: ['FAC grade', 'EXMPT grade', 'blank names'],
      imageFolder: 'CroppedMed'
    }
  };

  return {
    csv,
    manifest
  };
}

async function getAdminItems(_event, jobIdValue, stageValue = 'original_picture_day') {
  const jobId = numericId(jobIdValue);
  const stage = normalizeShootStage(stageValue);
  const [job, subjects, listNames, batches] = await Promise.all([
    adminJobSummary(jobId),
    adminSubjectRows(jobId),
    adminListNames(jobId),
    querySql(`
      SELECT
        id,
        shoot_stage AS shootStage,
        admin_item_type AS adminItemType,
        status,
        options_json AS optionsJson,
        output_path AS outputPath,
        created_by AS createdBy,
        created_at AS createdAt,
        completed_at AS completedAt,
        error_message AS errorMessage
      FROM admin_item_batches
      WHERE job_id = ${jobId}
      ORDER BY created_at DESC, id DESC
      LIMIT 50;
    `)
  ]);

  const photographed = subjects.filter((subject) => subject.imageFilename).length;
  const missing = subjects.filter((subject) => !subject.imageFilename || subject.photographedStatus !== 'photographed').length;

  return {
    job,
    stage,
    metrics: {
      subjects: subjects.length,
      photographed,
      missing,
      staff: subjects.filter((subject) => ['faculty', 'staff'].includes(subject.subjectType)).length
    },
    listNames,
    items: adminItemDefinitionsForStage(stage),
    batches
  };
}

async function renderAdminItem(_event, jobIdValue, input = {}) {
  const jobId = numericId(jobIdValue);
  const stage = normalizeShootStage(input.stage);
  const type = normalizeAdminItemType(input.type, stage);
  const item = ADMIN_ITEM_TYPES.get(type);
  const options = {
    sortBy: normalizeDirectorySort(input.sortBy),
    sisFormats: normalizeSisFormats(input.sisFormats || input.sisFormat),
    idCardSource: normalizeIdCardSource(input.idCardSource),
    idCardListName: optionalText(input.idCardListName, 255) || '',
    idCardLayout: normalizeIdCardLayout(input.idCardLayout),
    idCardReason: normalizeIdCardReason(input.idCardReason || (stage === 'makeup_day' ? 'makeup_day' : 'admin_batch')),
    idCardPhotographedOnly: input.idCardPhotographedOnly !== false,
    directoryType: normalizeDirectoryType(input.directoryType),
    directorySource: normalizeDirectorySource(input.directorySource),
    directoryListName: optionalText(input.directoryListName, 255) || '',
    directorySortMethod: normalizeDirectorySortMethod(input.directorySortMethod),
    directorySchoolYear: optionalText(input.directorySchoolYear, 255) || 'School Year: 2025 - 2026',
    directoryContactLine: optionalText(input.directoryContactLine, 255) || 'Island Photography: 559-456-1400',
    directoryPhotographedOnly: Boolean(input.directoryPhotographedOnly),
    stickerSource: normalizeStickerSource(input.stickerSource),
    stickerListName: optionalText(input.stickerListName, 255) || '',
    stickerCopies: normalizeStickerCopies(input.stickerCopies),
    stickerSortMethod: normalizeStickerSortMethod(input.stickerSortMethod),
    stickerPhotographedOnly: Boolean(input.stickerPhotographedOnly)
  };
  const job = await adminJobSummary(jobId);
  const subjects = await adminSubjectRows(jobId);
  const createdAt = new Date();
  const outputPath = adminOutputRelativePath(job, stage, type, item.extension, createdAt);
  const absoluteOutputPath = adminOutputAbsolutePath(outputPath);

  fs.mkdirSync(path.dirname(absoluteOutputPath), { recursive: true });
  if (type === 'school_directory') {
    const listSubjectIds = await adminListSubjectIds(jobId, options.directoryListName);
    const directoryOutput = buildSchoolDirectoryOutput(job, subjects, options, listSubjectIds);
    fs.writeFileSync(absoluteOutputPath, directoryOutput.csv);
    fs.writeFileSync(
      absoluteOutputPath.replace(/\.csv$/i, '.manifest.json'),
      JSON.stringify(directoryOutput.manifest, null, 2)
    );
  } else if (type === 'sticker_prints') {
    const listSubjectIds = await adminListSubjectIds(jobId, options.stickerListName);
    const stickerOutput = buildStickerPrintOutput(job, subjects, options, listSubjectIds);
    fs.writeFileSync(absoluteOutputPath, stickerOutput.csv);
    fs.writeFileSync(
      absoluteOutputPath.replace(/\.csv$/i, '.manifest.json'),
      JSON.stringify(stickerOutput.manifest, null, 2)
    );
  } else if (type === 'sis_export') {
    const outputStem = path.basename(outputPath, path.extname(outputPath));
    const sisOutput = buildSisExportOutput(job, subjects, options, outputStem);
    fs.writeFileSync(absoluteOutputPath, sisOutput.summaryCsv);
    sisOutput.files.forEach((file) => {
      const filePath = path.join(path.dirname(outputPath), file.relativePath);
      const absoluteFilePath = adminOutputAbsolutePath(filePath);
      fs.mkdirSync(path.dirname(absoluteFilePath), { recursive: true });
      fs.writeFileSync(absoluteFilePath, file.content);
    });
    fs.writeFileSync(
      absoluteOutputPath.replace(/\.csv$/i, '.manifest.json'),
      JSON.stringify(sisOutput.manifest, null, 2)
    );
  } else if (type === 'id_cards') {
    const listSubjectIds = await adminListSubjectIds(jobId, options.idCardListName);
    const idCardSubjects = selectedIdCardSubjects(subjects, options, listSubjectIds);
    const idCardOutput = buildIdCardOutput(job, idCardSubjects, options);
    fs.writeFileSync(absoluteOutputPath, idCardOutput.csv);
    fs.writeFileSync(
      absoluteOutputPath.replace(/\.csv$/i, '.manifest.json'),
      JSON.stringify(idCardOutput.manifest, null, 2)
    );
  } else {
    const content = buildAdminContent(type, stage, job, subjects, options);
    fs.writeFileSync(absoluteOutputPath, content);
  }

  const result = await writeSql((database) => {
    const statement = database.prepare(`
      INSERT INTO admin_item_batches (
        job_id,
        shoot_stage,
        admin_item_type,
        status,
        options_json,
        output_path,
        created_by,
        completed_at
      )
      VALUES (?, ?, ?, 'complete', ?, ?, ?, CURRENT_TIMESTAMP);
    `);

    try {
      statement.run([
        jobId,
        stage,
        type,
        JSON.stringify(options),
        outputPath,
        process.env.USERNAME || os.userInfo().username || null
      ]);
    } finally {
      statement.free();
    }

    const idRows = rowsFromDatabase(database, 'SELECT last_insert_rowid() AS id;');
    return {
      id: idRows[0].id,
      outputPath,
      absoluteOutputPath,
      type,
      stage
    };
  });
  result.jobDatabasePath = await writeJobDatabaseSnapshot(jobId);
  return result;
}

ipcMain.handle('admin-items:get', getAdminItems);
ipcMain.handle('admin-items:render', renderAdminItem);

async function renderSubjectIdCard(_event, jobIdValue, subjectIdValue, input = {}) {
  const jobId = numericId(jobIdValue);
  const subjectId = numericId(subjectIdValue);
  const options = {
    idCardSource: 'single',
    idCardListName: '',
    idCardLayout: normalizeIdCardLayout(input.idCardLayout),
    idCardReason: normalizeIdCardReason(input.idCardReason || 'replacement_request'),
    idCardPhotographedOnly: input.idCardPhotographedOnly !== false
  };
  const job = await adminJobSummary(jobId);
  const subjects = await adminSubjectRows(jobId);
  const subject = subjects.find((row) => row.id === subjectId);

  if (!subject) {
    throw new Error('Student not found');
  }
  if (options.idCardPhotographedOnly && !subject.imageFilename) {
    throw new Error('A linked photo is required before rendering an ID card');
  }

  const createdAt = new Date();
  const item = ADMIN_ITEM_TYPES.get('id_cards');
  const outputPath = adminOutputRelativePath(job, 'adhoc', 'id_cards', item.extension, createdAt)
    .replace(/id_cards-/i, `id_card-${safeFolderName(subject.ref || subject.id)}-`);
  const absoluteOutputPath = adminOutputAbsolutePath(outputPath);
  const idCardOutput = buildIdCardOutput(job, [subject], options);

  fs.mkdirSync(path.dirname(absoluteOutputPath), { recursive: true });
  fs.writeFileSync(absoluteOutputPath, idCardOutput.csv);
  fs.writeFileSync(
    absoluteOutputPath.replace(/\.csv$/i, '.manifest.json'),
    JSON.stringify(idCardOutput.manifest, null, 2)
  );

  return {
    outputPath,
    absoluteOutputPath,
    subjectId,
    ref: subject.ref
  };
}

ipcMain.handle('id-card:render-subject', renderSubjectIdCard);

async function createClient(_event, input = {}) {
  const displayName = normalizeText(input.displayName, 'School name');
  const trecsName = optionalText(input.trecsName, 255) || safeFolderName(displayName);
  const referenceNumber = optionalText(input.referenceNumber, 100);
  const phone = optionalText(input.phone, 100);
  const address = optionalText(input.address, 255);
  const city = optionalText(input.city, 100);
  const state = optionalText(input.state, 50);
  const zip = optionalText(input.zip, 30);
  const notes = optionalText(input.notes, 5000);

  const result = await writeSql((database) => {
    const statement = database.prepare(`
      INSERT INTO clients (
        reference_number,
        display_name,
        trecs_name,
        phone,
        address,
        city,
        state,
        zip,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `);

    try {
      statement.run([
        referenceNumber,
        displayName,
        trecsName,
        phone,
        address,
        city,
        state,
        zip,
        notes
      ]);
    } finally {
      statement.free();
    }

    const idRows = rowsFromDatabase(database, 'SELECT last_insert_rowid() AS id;');
    return {
      id: idRows[0].id,
      displayName,
      trecsName
    };
  });
  result.programDatabasePath = await writeProgramDatabaseSnapshot();
  return result;
}

ipcMain.handle('client:create', createClient);

function defaultJobRootPath(client, jobName) {
  return path.join(
    'JOBS',
    safeFolderName(client.trecsName || client.displayName || 'Client'),
    safeFolderName(jobName)
  );
}

function ensureJobFolders(rootPathValue) {
  const rootPath = resolveProjectPath(rootPathValue);
  fs.mkdirSync(rootPath, { recursive: true });
  ['Images', 'CroppedLarge', 'CroppedMed', 'Chosen', 'Exports', 'Database'].forEach((folder) => {
    fs.mkdirSync(path.join(rootPath, folder), { recursive: true });
  });
}

function processOutput(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      windowsHide: true,
      ...options
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(stderr.trim() || `${command} exited with code ${code}`));
      }
    });
  });
}

async function ensureAccessJobImportReader() {
  const sourcePath = path.join(projectRoot, 'tools', 'AccessJobImportJson.java');
  const classPath = path.join(projectRoot, 'tools', 'AccessJobImportJson.class');
  const sourceTime = fs.statSync(sourcePath).mtimeMs;
  const classTime = fs.existsSync(classPath) ? fs.statSync(classPath).mtimeMs : 0;
  if (classTime >= sourceTime) {
    return;
  }

  await processOutput('javac', [
    '-cp',
    [
      path.join('JARS', 'jackcess-4.0.0.jar'),
      path.join('JARS', 'commons-lang3-3.11.jar'),
      path.join('JARS', 'commons-logging-1.2.jar')
    ].join(path.delimiter),
    path.join('tools', 'AccessJobImportJson.java')
  ]);
}

async function readPreviousTrecsAccessData(studentsDatabasePath) {
  await ensureAccessJobImportReader();
  const output = await processOutput('java', [
    '-cp',
    [
      'tools',
      path.join('JARS', 'jackcess-4.0.0.jar'),
      path.join('JARS', 'commons-lang3-3.11.jar'),
      path.join('JARS', 'commons-logging-1.2.jar')
    ].join(path.delimiter),
    'AccessJobImportJson',
    studentsDatabasePath
  ]);
  return JSON.parse(output);
}

function oldTrecsText(row, column) {
  const value = row ? row[column] : null;
  return value === null || value === undefined ? '' : String(value).trim();
}

function oldTrecsBool(row, column) {
  const value = row ? row[column] : null;
  if (typeof value === 'boolean') {
    return value;
  }
  return ['true', 'yes', '1'].includes(String(value || '').trim().toLowerCase());
}

function mergedOldTrecsNotes(row) {
  const notes = [];
  const base = oldTrecsText(row, 'Notes');
  const field1 = oldTrecsText(row, 'Field1');
  const field2 = oldTrecsText(row, 'Field2');
  if (base) {
    notes.push(base);
  }
  if (field1) {
    notes.push(`Field1: ${field1}`);
  }
  if (field2) {
    notes.push(`Field2: ${field2}`);
  }
  return notes.join('\n');
}

function oldTrecsOnlineOrderReference(notes) {
  const match = String(notes || '').match(/ONLINE ORDER\s*:?\s*(\d+)/i);
  return match ? match[1] : '';
}

function isImportableImage(filePath) {
  return ['.jpg', '.jpeg', '.png'].includes(path.extname(filePath).toLowerCase());
}

function copyPreviousTrecsImages(sourceRoot, jobRoot) {
  const copied = [];
  [
    { candidates: ['CroppedLarge'], destination: 'CroppedLarge', versionType: 'cropped_large' },
    { candidates: ['CroppedMedium', 'CroppedMed'], destination: 'CroppedMed', versionType: 'cropped_med' }
  ].forEach((folder) => {
    const sourceFolder = folder.candidates
      .map((candidate) => path.join(sourceRoot, candidate))
      .find((candidatePath) => fs.existsSync(candidatePath) && fs.statSync(candidatePath).isDirectory());
    if (!sourceFolder) {
      return;
    }

    const destinationFolder = path.join(jobRoot, folder.destination);
    fs.mkdirSync(destinationFolder, { recursive: true });
    fs.readdirSync(sourceFolder).forEach((name) => {
      const sourcePath = path.join(sourceFolder, name);
      if (!fs.statSync(sourcePath).isFile() || !isImportableImage(sourcePath)) {
        return;
      }

      const destinationPath = uniquePath(destinationFolder, name);
      fs.copyFileSync(sourcePath, destinationPath);
      copied.push({
        filename: path.basename(destinationPath),
        path: path.relative(projectRoot, destinationPath),
        versionType: folder.versionType
      });
    });
  });
  return copied;
}

function referenceFromPreviousTrecsImage(filename) {
  const base = path.basename(filename, path.extname(filename));
  const match = base.match(/^\d+/);
  return match ? match[0] : base;
}

async function choosePreviousTrecsJobFolder(event) {
  const result = await dialog.showOpenDialog(BrowserWindow.fromWebContents(event.sender), {
    title: 'Choose Previous TRECS Job Folder',
    properties: ['openDirectory']
  });

  if (result.canceled || !result.filePaths.length) {
    return { canceled: true };
  }

  const folderPath = result.filePaths[0];
  const studentsDatabasePath = path.join(folderPath, 'Database', 'Students.accdb');
  return {
    canceled: false,
    folderPath,
    studentsDatabasePath,
    hasStudentsDatabase: fs.existsSync(studentsDatabasePath)
  };
}

async function chooseOnsiteSetupFolder(event) {
  const result = await dialog.showOpenDialog(BrowserWindow.fromWebContents(event.sender), {
    title: 'Choose Onsite Setup Folder',
    properties: ['openDirectory']
  });

  if (result.canceled || !result.filePaths.length) {
    return { canceled: true };
  }

  const folderPath = result.filePaths[0];
  const manifestPath = path.join(folderPath, 'onsite-setup.json');
  const databasePath = path.join(folderPath, 'Database', 'job.db');
  return {
    canceled: false,
    folderPath,
    manifestPath,
    databasePath,
    hasManifest: fs.existsSync(manifestPath),
    hasDatabase: fs.existsSync(databasePath)
  };
}

function rowsFromOptionalTable(database, tableName) {
  const tableRows = rowsFromDatabase(database, `
    SELECT name
    FROM sqlite_master
    WHERE type = 'table'
      AND name = ${sqlLiteral(tableName)}
    LIMIT 1;
  `);
  if (!tableRows.length) {
    return [];
  }
  return rowsFromDatabase(database, `SELECT * FROM ${tableName};`);
}

function tableColumnNames(database, tableName) {
  return rowsFromDatabase(database, `PRAGMA table_info(${tableName});`).map((row) => row.name);
}

function insertImportedRows(database, tableName, rows) {
  if (!rows.length) {
    return;
  }

  const targetColumns = tableColumnNames(database, tableName);
  const rowColumns = Object.keys(rows[0] || {});
  const columns = targetColumns.filter((column) => rowColumns.includes(column));
  if (!columns.length) {
    return;
  }
  insertRows(database, tableName, columns, rows);
}

function upsertImportedRowsById(database, tableName, rows) {
  if (!rows.length) {
    return;
  }

  const targetColumns = tableColumnNames(database, tableName);
  const rowColumns = Object.keys(rows[0] || {});
  const columns = targetColumns.filter((column) => rowColumns.includes(column));
  const updateColumns = columns.filter((column) => column !== 'id');
  if (!columns.includes('id') || !updateColumns.length) {
    insertImportedRows(database, tableName, rows);
    return;
  }

  const insertPlaceholders = columns.map(() => '?').join(', ');
  const updateSql = `
    UPDATE ${tableName}
    SET ${updateColumns.map((column) => `${column} = ?`).join(', ')}
    WHERE id = ?;
  `;
  const insertSql = `
    INSERT OR IGNORE INTO ${tableName} (${columns.join(', ')})
    VALUES (${insertPlaceholders});
  `;
  const updateStatement = database.prepare(updateSql);
  const insertStatement = database.prepare(insertSql);

  try {
    rows.forEach((row) => {
      updateStatement.run([...updateColumns.map((column) => row[column]), row.id]);
      insertStatement.run(columns.map((column) => row[column]));
    });
  } finally {
    updateStatement.free();
    insertStatement.free();
  }
}

function copyOnsiteCroppedMediumImages(setupFolder, rootPathValue) {
  const sourceFolder = path.join(setupFolder, 'CroppedMed');
  const destinationFolder = path.join(resolveProjectPath(rootPathValue), 'CroppedMed');
  let copied = 0;

  if (!fs.existsSync(sourceFolder) || !fs.statSync(sourceFolder).isDirectory()) {
    return copied;
  }

  fs.mkdirSync(destinationFolder, { recursive: true });
  fs.readdirSync(sourceFolder).forEach((name) => {
    const sourcePath = path.join(sourceFolder, name);
    if (!fs.statSync(sourcePath).isFile() || !isImportableImage(sourcePath)) {
      return;
    }
    fs.copyFileSync(sourcePath, path.join(destinationFolder, name));
    copied += 1;
  });

  return copied;
}

function readEndOfDayPackage(packageFolder) {
  const manifestPath = path.join(packageFolder, 'end-of-day-manifest.json');
  if (!fs.existsSync(packageFolder) || !fs.statSync(packageFolder).isDirectory()) {
    throw new Error('End of Day package folder was not found');
  }
  if (!fs.existsSync(manifestPath)) {
    throw new Error('end-of-day-manifest.json was not found in that folder');
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (manifest.packageType !== 'end_of_day') {
    throw new Error('That folder is not a TRECS End of Day package');
  }

  const databasePath = path.join(packageFolder, manifest.paths && manifest.paths.database ? manifest.paths.database : 'Database/job.db');
  if (!fs.existsSync(databasePath)) {
    throw new Error('Database\\job.db was not found in that folder');
  }

  return {
    manifest,
    manifestPath,
    databasePath,
    imagesFolder: path.join(packageFolder, manifest.paths && manifest.paths.images ? manifest.paths.images : 'Images')
  };
}

async function chooseEndOfDayPackageFolder(event) {
  const result = await dialog.showOpenDialog(BrowserWindow.fromWebContents(event.sender), {
    title: 'Choose End of Day Package Folder',
    properties: ['openDirectory']
  });

  if (result.canceled || !result.filePaths.length) {
    return { canceled: true };
  }

  const folderPath = result.filePaths[0];
  const manifestPath = path.join(folderPath, 'end-of-day-manifest.json');
  const databasePath = path.join(folderPath, 'Database', 'job.db');
  let manifest = null;
  if (fs.existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch (_error) {
      manifest = null;
    }
  }

  return {
    canceled: false,
    folderPath,
    manifestPath,
    databasePath,
    hasManifest: fs.existsSync(manifestPath),
    hasDatabase: fs.existsSync(databasePath),
    manifest
  };
}

const END_OF_DAY_SUBJECT_FIELD_COLUMNS = {
  ref: 'legacy_ref_num',
  type: 'subject_type',
  firstName: 'first_name',
  lastName: 'last_name',
  displayName: 'display_name',
  externalId: 'external_id',
  grade: 'grade',
  homeroom: 'homeroom',
  track: 'track',
  team: 'team',
  notes: 'notes'
};

function copyEndOfDayImageFiles(packageInfo, imageRows, rootPathValue) {
  const copiedByImageId = new Map((packageInfo.manifest.copiedImages || []).map((image) => [Number(image.imageAssetId), image]));
  const destinationFolder = path.join(resolveProjectPath(rootPathValue), 'Images');
  let copied = 0;

  fs.mkdirSync(destinationFolder, { recursive: true });

  const rows = imageRows.map((row) => {
    const copiedImage = copiedByImageId.get(Number(row.id));
    if (!copiedImage) {
      return row;
    }

    let currentPath = row.current_path;
    let metadata = parseImageMetadata(row.metadata_json);
    const jpgSource = copiedImage.jpgPath ? path.join(packageInfo.imagesFolder, path.basename(copiedImage.jpgPath)) : null;
    const rawSource = copiedImage.rawPath ? path.join(packageInfo.imagesFolder, path.basename(copiedImage.rawPath)) : null;

    if (jpgSource && fs.existsSync(jpgSource) && fs.statSync(jpgSource).isFile()) {
      const destinationPath = uniquePath(destinationFolder, path.basename(jpgSource));
      fs.copyFileSync(jpgSource, destinationPath);
      currentPath = path.relative(projectRoot, destinationPath);
      copied += 1;
    }

    if (rawSource && fs.existsSync(rawSource) && fs.statSync(rawSource).isFile()) {
      const destinationPath = uniquePath(destinationFolder, path.basename(rawSource));
      fs.copyFileSync(rawSource, destinationPath);
      metadata = {
        ...metadata,
        rawPath: path.relative(projectRoot, destinationPath)
      };
      copied += 1;
    }

    return {
      ...row,
      current_path: currentPath,
      metadata_json: Object.keys(metadata).length ? JSON.stringify(metadata) : row.metadata_json
    };
  });

  return { rows, copied };
}

function endOfDayIncludedNewSubjectIds(manifest) {
  return new Set(((manifest.subjectChanges && manifest.subjectChanges.newSubjects) || []).map((subject) => Number(subject.id)));
}

function endOfDayEditedSubjects(manifest) {
  return (manifest.subjectChanges && manifest.subjectChanges.editedSubjects) || [];
}

async function approveEndOfDayPackage(_event, input = {}) {
  const packageFolder = normalizeText(input.packageFolder, 'End of Day package folder', 1000);
  const packageInfo = {
    packageFolder,
    ...readEndOfDayPackage(packageFolder)
  };
  const approvedSubjectChanges = adjustedEndOfDaySubjectChanges(
    { subjectChanges: packageInfo.manifest.subjectChanges || {} },
    input.adjustments || {}
  );
  const approvedManifest = {
    ...packageInfo.manifest,
    subjectChanges: approvedSubjectChanges
  };
  const jobId = numericId(approvedManifest.job && approvedManifest.job.id);
  const imageIds = new Set((approvedManifest.copiedImages || []).map((image) => Number(image.imageAssetId)).filter(Boolean));
  const newSubjectIds = endOfDayIncludedNewSubjectIds(approvedManifest);
  const editedSubjects = endOfDayEditedSubjects(approvedManifest);

  const SQL = await getSqlModule();
  const packageDatabase = new SQL.Database(fs.readFileSync(packageInfo.databasePath));
  let result;

  try {
    const packageTables = {
      subjects: rowsFromOptionalTable(packageDatabase, 'subjects'),
      subject_codes: rowsFromOptionalTable(packageDatabase, 'subject_codes'),
      image_assets: rowsFromOptionalTable(packageDatabase, 'image_assets').filter((row) => imageIds.has(Number(row.id))),
      image_versions: rowsFromOptionalTable(packageDatabase, 'image_versions').filter((row) => imageIds.has(Number(row.image_asset_id))),
      subject_images: rowsFromOptionalTable(packageDatabase, 'subject_images').filter((row) => imageIds.has(Number(row.image_asset_id)))
    };
    const packageSubjectsById = new Map(packageTables.subjects.map((row) => [Number(row.id), row]));
    const changedSubjectIds = new Set([
      ...newSubjectIds,
      ...editedSubjects.map((subject) => Number(subject.id)),
      ...packageTables.subject_images.map((row) => Number(row.subject_id)).filter(Boolean)
    ]);
    const subjectRowsToImport = Array.from(changedSubjectIds)
      .map((id) => packageSubjectsById.get(Number(id)))
      .filter(Boolean);

    result = await writeSql((database) => {
      const jobRows = rowsFromDatabase(database, `
        SELECT id, root_path AS rootPath
        FROM jobs
        WHERE id = ${jobId}
        LIMIT 1;
      `);
      if (!jobRows.length) {
        throw new Error('The matching job is not loaded on this computer');
      }

      ensureJobFolders(jobRows[0].rootPath);
      const imageCopyResult = copyEndOfDayImageFiles(packageInfo, packageTables.image_assets, jobRows[0].rootPath);
      const imageRows = imageCopyResult.rows;
      const copiedFiles = imageCopyResult.copied;

      const newSubjectRows = subjectRowsToImport
        .filter((row) => newSubjectIds.has(Number(row.id)))
        .map((row) => {
      const manifestSubject = ((approvedManifest.subjectChanges && approvedManifest.subjectChanges.newSubjects) || [])
            .find((subject) => Number(subject.id) === Number(row.id));
          return {
            ...row,
            display_name: manifestSubject && Object.prototype.hasOwnProperty.call(manifestSubject, 'name') ? manifestSubject.name : row.display_name,
            grade: manifestSubject && Object.prototype.hasOwnProperty.call(manifestSubject, 'grade') ? manifestSubject.grade : row.grade,
            homeroom: manifestSubject && Object.prototype.hasOwnProperty.call(manifestSubject, 'homeroom') ? manifestSubject.homeroom : row.homeroom
          };
        });
      insertImportedRows(database, 'subjects', newSubjectRows);
      insertImportedRows(database, 'subject_codes', packageTables.subject_codes.filter((row) => newSubjectIds.has(Number(row.subject_id))));

      editedSubjects.forEach((subject) => {
        const updates = [];
        const values = [];
        (subject.changes || []).forEach((change) => {
          const column = END_OF_DAY_SUBJECT_FIELD_COLUMNS[change.field];
          if (!column) {
            return;
          }
          updates.push(`${column} = ?`);
          values.push(change.after || null);
        });
        if (!updates.length) {
          return;
        }
        values.push(Number(subject.id));
        database.run(`
          UPDATE subjects
          SET ${updates.join(', ')}
          WHERE id = ?;
        `, values);
      });

      upsertImportedRowsById(database, 'image_assets', imageRows);
      insertImportedRows(database, 'image_versions', packageTables.image_versions);
      insertImportedRows(database, 'subject_images', packageTables.subject_images);

      subjectRowsToImport
        .filter((row) => !newSubjectIds.has(Number(row.id)))
        .forEach((row) => {
          database.run(`
            UPDATE subjects
            SET primary_image_asset_id = ?,
                photographed_status = ?
            WHERE id = ?;
          `, [
            row.primary_image_asset_id || null,
            row.photographed_status || null,
            row.id
          ]);
        });

      return {
        id: jobId,
        packageFolder,
        counts: {
          copiedFiles,
          images: imageRows.length,
          newSubjects: newSubjectRows.length,
          editedSubjects: editedSubjects.length,
          subjectImageLinks: packageTables.subject_images.length
        }
      };
    });
  } finally {
    packageDatabase.close();
  }

  result.jobDatabasePath = await writeJobDatabaseSnapshot(jobId);
  result.programDatabasePath = await writeProgramDatabaseSnapshot();
  return result;
}

async function loadOnsiteSetup(_event, input = {}) {
  const setupFolder = normalizeText(input.setupFolder, 'Onsite setup folder', 1000);
  const manifestPath = path.join(setupFolder, 'onsite-setup.json');
  const databasePath = path.join(setupFolder, 'Database', 'job.db');

  if (!fs.existsSync(setupFolder) || !fs.statSync(setupFolder).isDirectory()) {
    throw new Error('Onsite setup folder was not found');
  }
  if (!fs.existsSync(manifestPath)) {
    throw new Error('onsite-setup.json was not found in that folder');
  }
  if (!fs.existsSync(databasePath)) {
    throw new Error('Database\\job.db was not found in that folder');
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (manifest.packageType !== 'onsite_setup') {
    throw new Error('That folder is not a TRECS onsite setup');
  }

  const SQL = await getSqlModule();
  const setupDatabase = new SQL.Database(fs.readFileSync(databasePath));
  let result;

  try {
    const jobRows = rowsFromOptionalTable(setupDatabase, 'jobs');
    if (!jobRows.length) {
      throw new Error('The onsite setup job database does not contain a job record');
    }

    const sourceJob = jobRows[0];
    const schoolName = optionalText(manifest.school && manifest.school.name, 255) || 'Onsite School';
    const schoolFolderName = optionalText(manifest.school && manifest.school.folderName, 255) || safeFolderName(schoolName);
    const schoolReferenceNumber = optionalText(manifest.school && manifest.school.referenceNumber, 100);
    const jobName = optionalText(manifest.job && manifest.job.name, 255) || sourceJob.name || 'Onsite Job';
    const rootPath = optionalText(sourceJob.root_path, 1000)
      || optionalText(manifest.job && manifest.job.rootPath, 1000)
      || path.join('JOBS', safeFolderName(schoolFolderName), safeFolderName(jobName));

    const importedTables = {
      subjects: rowsFromOptionalTable(setupDatabase, 'subjects'),
      subject_codes: rowsFromOptionalTable(setupDatabase, 'subject_codes'),
      subject_groups: rowsFromOptionalTable(setupDatabase, 'subject_groups'),
      subject_group_members: rowsFromOptionalTable(setupDatabase, 'subject_group_members'),
      image_assets: rowsFromOptionalTable(setupDatabase, 'image_assets'),
      image_versions: rowsFromOptionalTable(setupDatabase, 'image_versions'),
      subject_images: rowsFromOptionalTable(setupDatabase, 'subject_images'),
      orders: rowsFromOptionalTable(setupDatabase, 'orders'),
      order_items: rowsFromOptionalTable(setupDatabase, 'order_items').map((row) => ({
        ...row,
        package_plan_id: null,
        product_id: null
      })),
      payments: rowsFromOptionalTable(setupDatabase, 'payments'),
      envelope_scans: rowsFromOptionalTable(setupDatabase, 'envelope_scans').map((row) => ({
        ...row,
        capture_session_id: null,
        image_import_event_id: null
      })),
      admin_item_batches: rowsFromOptionalTable(setupDatabase, 'admin_item_batches')
    };

    result = await writeSql((database) => {
      const existingJobRows = rowsFromDatabase(database, `
        SELECT id
        FROM jobs
        WHERE id = ${numericId(sourceJob.id)}
        LIMIT 1;
      `);
      if (existingJobRows.length) {
        throw new Error('This onsite setup is already loaded on this computer');
      }

      let clientRows = rowsFromDatabase(database, `
        SELECT id, display_name AS displayName, trecs_name AS trecsName
        FROM clients
        WHERE trecs_name = ${sqlLiteral(schoolFolderName)}
        LIMIT 1;
      `);

      if (!clientRows.length) {
        database.run(`
          INSERT INTO clients (
            reference_number,
            display_name,
            trecs_name,
            notes
          )
          VALUES (?, ?, ?, ?);
        `, [
          schoolReferenceNumber,
          schoolName,
          schoolFolderName,
          `Loaded from onsite setup: ${setupFolder}`
        ]);
        clientRows = rowsFromDatabase(database, 'SELECT last_insert_rowid() AS id;');
      }

      const clientId = clientRows[0].id;
      const packagePlanId = normalizeNullableId(sourceJob.package_plan_id || (manifest.job && manifest.job.packagePlanId), 'package plan');
      if (packagePlanId) {
        database.run(`
          INSERT OR IGNORE INTO package_plans (
            id,
            name,
            version,
            active,
            legacy_name
          )
          VALUES (?, ?, 1, 1, ?);
        `, [
          packagePlanId,
          optionalText(manifest.job && manifest.job.packagePlanName, 255) || `Imported Package Plan ${packagePlanId}`,
          optionalText(manifest.job && manifest.job.packagePlanName, 255)
        ]);
      }

      ensureJobFolders(rootPath);
      const setupCopyPath = path.join(resolveProjectPath(rootPath), 'Database', 'job.db');
      const baselineCopyPath = path.join(resolveProjectPath(rootPath), 'Database', 'onsite-start.db');
      fs.copyFileSync(databasePath, setupCopyPath);
      fs.copyFileSync(databasePath, baselineCopyPath);
      const copiedCroppedMed = copyOnsiteCroppedMediumImages(setupFolder, rootPath);

      const jobRow = {
        ...sourceJob,
        client_id: clientId,
        package_plan_id: packagePlanId || null,
        root_path: rootPath,
        notes: optionalText(sourceJob.notes, 5000) || `Loaded from onsite setup: ${setupFolder}`
      };
      insertImportedRows(database, 'jobs', [jobRow]);

      [
        'subjects',
        'subject_codes',
        'subject_groups',
        'subject_group_members',
        'image_assets',
        'image_versions',
        'subject_images',
        'orders',
        'order_items',
        'payments',
        'envelope_scans',
        'admin_item_batches'
      ].forEach((tableName) => {
        insertImportedRows(database, tableName, importedTables[tableName]);
      });

      return {
        id: sourceJob.id,
        rootPath,
        setupFolder,
        databasePath: setupCopyPath,
        counts: {
          subjects: importedTables.subjects.length,
          orders: importedTables.orders.length,
          images: importedTables.image_assets.length,
          croppedMediumImages: copiedCroppedMed
        }
      };
    });
  } finally {
    setupDatabase.close();
  }

  result.jobDatabasePath = await writeJobDatabaseSnapshot(result.id);
  result.programDatabasePath = await writeProgramDatabaseSnapshot();
  return result;
}

async function createJob(_event, input = {}) {
  const clientId = numericId(input.clientId);
  const name = normalizeText(input.name, 'Job name');
  const type = normalizeJobType(input.type || 'fall');
  const packagePlanId = normalizeNullableId(input.packagePlanId, 'package plan');
  const shootDate = optionalText(input.shootDate, 30);
  const retakeDate = optionalText(input.retakeDate, 30);
  const notes = optionalText(input.notes, 5000);

  const result = await writeSql((database) => {
    const clientRows = rowsFromDatabase(database, `
      SELECT id, display_name AS displayName, trecs_name AS trecsName
      FROM clients
      WHERE id = ${clientId};
    `);

    if (!clientRows.length) {
      throw new Error('Client not found');
    }

    if (packagePlanId) {
      const packageRows = rowsFromDatabase(database, `
        SELECT id
        FROM package_plans
        WHERE id = ${packagePlanId}
          AND active = 1;
      `);
      if (!packageRows.length) {
        throw new Error('Package plan not found');
      }
    }

    const rootPath = optionalText(input.rootPath, 1000) || defaultJobRootPath(clientRows[0], name);
    const statement = database.prepare(`
      INSERT INTO jobs (
        client_id,
        name,
        type,
        status,
        package_plan_id,
        root_path,
        legacy_folder_layout,
        shoot_date,
        retake_date,
        notes
      )
      VALUES (?, ?, ?, 'active', ?, ?, 'trecs_v7', ?, ?, ?);
    `);

    try {
      statement.run([
        clientId,
        name,
        type,
        packagePlanId,
        rootPath,
        shootDate,
        retakeDate,
        notes
      ]);
    } finally {
      statement.free();
    }

    const idRows = rowsFromDatabase(database, 'SELECT last_insert_rowid() AS id;');
    const jobId = idRows[0].id;
    ensureJobFolders(rootPath);
    return { id: jobId, rootPath };
  });

  result.jobDatabasePath = await writeJobDatabaseSnapshot(result.id);
  result.programDatabasePath = await writeProgramDatabaseSnapshot();
  return result;
}

ipcMain.handle('job:create', createJob);

async function importPreviousTrecsJob(_event, input = {}) {
  const clientId = numericId(input.clientId);
  const name = normalizeText(input.name, 'Job name');
  const type = normalizeJobType(input.type || 'fall');
  const packagePlanId = normalizeNullableId(input.packagePlanId, 'package plan');
  const sourceFolder = normalizeText(input.sourceFolder, 'Previous job folder', 1000);
  const notes = optionalText(input.notes, 5000);
  const studentsDatabasePath = path.join(sourceFolder, 'Database', 'Students.accdb');

  if (!fs.existsSync(sourceFolder) || !fs.statSync(sourceFolder).isDirectory()) {
    throw new Error('Previous job folder was not found');
  }
  if (!fs.existsSync(studentsDatabasePath)) {
    throw new Error('Database\\Students.accdb was not found in the previous job folder');
  }

  const accessData = await readPreviousTrecsAccessData(studentsDatabasePath);
  const result = await writeSql((database) => {
    const clientRows = rowsFromDatabase(database, `
      SELECT id, display_name AS displayName, trecs_name AS trecsName
      FROM clients
      WHERE id = ${clientId};
    `);

    if (!clientRows.length) {
      throw new Error('Client not found');
    }

    if (packagePlanId) {
      const packageRows = rowsFromDatabase(database, `
        SELECT id
        FROM package_plans
        WHERE id = ${packagePlanId}
          AND active = 1;
      `);
      if (!packageRows.length) {
        throw new Error('Package plan not found');
      }
    }

    const rootPath = optionalText(input.rootPath, 1000) || defaultJobRootPath(clientRows[0], name);
    const jobRoot = resolveProjectPath(rootPath);
    ensureJobFolders(rootPath);
    const copiedImages = copyPreviousTrecsImages(sourceFolder, jobRoot);
    fs.copyFileSync(studentsDatabasePath, path.join(jobRoot, 'Database', 'LegacyStudents.accdb'));

    database.run(`
      INSERT INTO jobs (
        client_id,
        name,
        type,
        status,
        package_plan_id,
        root_path,
        legacy_folder_layout,
        notes
      )
      VALUES (?, ?, ?, 'active', ?, ?, 'trecs_v7', ?);
    `, [
      clientId,
      name,
      type,
      packagePlanId,
      rootPath,
      notes || `Imported from previous TRECS job: ${sourceFolder}`
    ]);
    const jobId = rowsFromDatabase(database, 'SELECT last_insert_rowid() AS id;')[0].id;

    const subjectIdsByRef = new Map();
    const subjectStatement = database.prepare(`
      INSERT INTO subjects (
        job_id,
        legacy_ref_num,
        subject_type,
        first_name,
        last_name,
        display_name,
        external_id,
        grade,
        homeroom,
        track,
        photographed_status,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `);
    const subjectCodeStatement = database.prepare(`
      INSERT OR IGNORE INTO subject_codes (
        subject_id,
        code_type,
        code
      )
      VALUES (?, 'legacy_ref', ?);
    `);
    const orderStatement = database.prepare(`
      INSERT INTO orders (
        job_id,
        subject_id,
        source,
        source_reference,
        entry_timing,
        status,
        paid_status,
        render_status,
        notes
      )
      VALUES (?, ?, ?, ?, 'unknown', 'open', ?, ?, ?);
    `);
    const orderItemStatement = database.prepare(`
      INSERT INTO order_items (
        order_id,
        subject_id,
        package_code,
        quantity,
        raw_code,
        status,
        notes
      )
      VALUES (?, ?, ?, 1, ?, 'open', ?);
    `);

    const importOrder = (subjectId, row, orderColumn, payColumn, source, photoTaken) => {
      const rawCode = oldTrecsText(row, orderColumn);
      if (!rawCode) {
        return;
      }

      const notesValue = oldTrecsText(row, 'Notes');
      const sourceReference = source === 'online' ? oldTrecsOnlineOrderReference(notesValue) : '';
      orderStatement.run([
        jobId,
        subjectId,
        source,
        sourceReference,
        oldTrecsBool(row, payColumn) ? 'paid' : 'unpaid',
        photoTaken ? 'ready' : 'not_ready',
        notesValue
      ]);
      const orderId = rowsFromDatabase(database, 'SELECT last_insert_rowid() AS id;')[0].id;
      rawCode.split('.').map((code) => code.trim()).filter(Boolean).forEach((code) => {
        orderItemStatement.run([orderId, subjectId, code, rawCode, `Imported from ${orderColumn}`]);
      });
    };

    try {
      (accessData.students || []).forEach((row) => {
        const ref = oldTrecsText(row, 'RefNum');
        if (!ref) {
          return;
        }

        const firstName = oldTrecsText(row, 'First');
        const lastName = oldTrecsText(row, 'Last');
        const displayName = [firstName, lastName].filter(Boolean).join(' ');
        const grade = oldTrecsText(row, 'Grade');
        const photoTaken = oldTrecsBool(row, 'Photo');
        subjectStatement.run([
          jobId,
          ref,
          grade.toLowerCase() === 'fac' ? 'faculty' : 'student',
          firstName,
          lastName,
          displayName,
          oldTrecsText(row, 'StuID'),
          grade,
          oldTrecsText(row, 'Homeroom'),
          oldTrecsText(row, 'Track'),
          photoTaken ? 'photographed' : 'not_photographed',
          mergedOldTrecsNotes(row)
        ]);
        const subjectId = rowsFromDatabase(database, 'SELECT last_insert_rowid() AS id;')[0].id;
        subjectIdsByRef.set(ref, subjectId);
        subjectCodeStatement.run([subjectId, ref]);
        importOrder(subjectId, row, 'Order1', 'Order1Pay', 'paper', photoTaken);
        importOrder(subjectId, row, 'Order2', 'Order2Pay', 'online', photoTaken);
      });
    } finally {
      subjectStatement.free();
      subjectCodeStatement.free();
      orderStatement.free();
      orderItemStatement.free();
    }

    const groupIdsByName = new Map();
    (accessData.lists || []).forEach((row) => {
      const listName = oldTrecsText(row, 'List');
      const ref = oldTrecsText(row, 'ReferenceNumber');
      const subjectId = subjectIdsByRef.get(ref);
      if (!listName || !subjectId) {
        return;
      }

      let groupId = groupIdsByName.get(listName);
      if (!groupId) {
        database.run(`
          INSERT OR IGNORE INTO subject_groups (
            job_id,
            name,
            group_type
          )
          VALUES (?, ?, 'list');
        `, [jobId, listName]);
        groupId = rowsFromDatabase(database, 'SELECT last_insert_rowid() AS id;')[0].id;
        groupIdsByName.set(listName, groupId);
      }

      database.run(`
        INSERT OR IGNORE INTO subject_group_members (
          group_id,
          subject_id,
          sort_order
        )
        VALUES (?, ?, ?);
      `, [groupId, subjectId, subjectId]);
    });

    const imageAssetIdsByFilename = new Map();
    copiedImages.forEach((image) => {
      const key = image.filename.toLowerCase();
      let imageAssetId = imageAssetIdsByFilename.get(key);
      if (!imageAssetId) {
        database.run(`
          INSERT INTO image_assets (
            job_id,
            original_path,
            current_path,
            filename,
            source,
            status,
            metadata_json
          )
          VALUES (?, ?, ?, ?, 'previous_trecs_import', 'imported', ?);
        `, [
          jobId,
          image.path,
          image.path,
          image.filename,
          JSON.stringify({ sourceFolder })
        ]);
        imageAssetId = rowsFromDatabase(database, 'SELECT last_insert_rowid() AS id;')[0].id;
        imageAssetIdsByFilename.set(key, imageAssetId);
      }

      database.run(`
        INSERT OR IGNORE INTO image_versions (
          image_asset_id,
          version_type,
          path
        )
        VALUES (?, ?, ?);
      `, [imageAssetId, image.versionType, image.path]);

      const subjectId = subjectIdsByRef.get(referenceFromPreviousTrecsImage(image.filename));
      if (subjectId) {
        database.run(`
          INSERT OR IGNORE INTO subject_images (
            subject_id,
            image_asset_id,
            role,
            selected,
            sort_order
          )
          VALUES (?, ?, 'primary', 1, 0);
        `, [subjectId, imageAssetId]);
        database.run(`
          UPDATE subjects
          SET primary_image_asset_id = COALESCE(primary_image_asset_id, ?),
              photographed_status = 'photographed',
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?;
        `, [imageAssetId, subjectId]);
      }
    });

    return {
      id: jobId,
      rootPath,
      sourceFolder,
      counts: {
        students: subjectIdsByRef.size,
        lists: groupIdsByName.size,
        images: imageAssetIdsByFilename.size,
        copiedImages: copiedImages.length
      }
    };
  });

  result.jobDatabasePath = await writeJobDatabaseSnapshot(result.id);
  result.programDatabasePath = await writeProgramDatabaseSnapshot();
  return result;
}

ipcMain.handle('job:choose-previous-trecs-folder', choosePreviousTrecsJobFolder);
ipcMain.handle('job:import-previous-trecs', importPreviousTrecsJob);
ipcMain.handle('job:choose-onsite-setup-folder', chooseOnsiteSetupFolder);
ipcMain.handle('job:load-onsite-setup', loadOnsiteSetup);
ipcMain.handle('end-of-day:choose-package-folder', chooseEndOfDayPackageFolder);
ipcMain.handle('end-of-day:approve-package', approveEndOfDayPackage);

function parseCsvRows(text) {
  const rows = [];
  let row = [];
  let value = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (quoted) {
      if (char === '"' && next === '"') {
        value += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        value += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(value);
      value = '';
    } else if (char === '\n') {
      row.push(value);
      rows.push(row);
      row = [];
      value = '';
    } else if (char !== '\r') {
      value += char;
    }
  }

  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }

  return rows;
}

async function readSchoolDataRows(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === '.csv' || extension === '.txt') {
    return parseCsvRows(fs.readFileSync(filePath, 'utf8'));
  }

  if (['.xls', '.xlsx', '.xlsm'].includes(extension)) {
    const workbook = XLSX.readFile(filePath, { cellDates: false });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      throw new Error('The selected Excel file does not contain any worksheets');
    }
    return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      header: 1,
      raw: false,
      defval: ''
    });
  }

  throw new Error('School data file must be CSV, XLS, XLSX, or XLSM');
}

function normalizeImportCell(value) {
  return String(value === null || value === undefined ? '' : value).trim();
}

function nonEmptySchoolDataRows(rows) {
  return rows
    .map((row) => row.map(normalizeImportCell))
    .filter((row) => row.some((value) => value));
}

const SCHOOL_IMPORT_FIELDS = [
  { key: 'ref', label: 'Reference Number', aliases: ['ref', 'refnum', 'reference', 'reference number', 'student number', 'camera card'] },
  { key: 'firstName', label: 'First Name', aliases: ['first', 'firstname', 'first name', 'given name'] },
  { key: 'lastName', label: 'Last Name', aliases: ['last', 'lastname', 'last name', 'surname', 'family name'] },
  { key: 'displayName', label: 'Display Name', aliases: ['name', 'student name', 'display name', 'full name'] },
  { key: 'externalId', label: 'Student ID', aliases: ['id', 'student id', 'studentid', 'stu id', 'stuid', 'sid', 'local id'] },
  { key: 'grade', label: 'Grade', aliases: ['grade', 'gr'] },
  { key: 'homeroom', label: 'Homeroom / Teacher', aliases: ['homeroom', 'home room', 'teacher', 'classroom', 'room'] },
  { key: 'track', label: 'Track', aliases: ['track', 'program'] },
  { key: 'team', label: 'Team', aliases: ['team', 'sport'] },
  { key: 'subjectType', label: 'Subject Type', aliases: ['type', 'subject type', 'student type'] },
  { key: 'notes', label: 'Notes', aliases: ['notes', 'note', 'comments', 'comment'] }
];

function looksLikeHeaderRow(row) {
  const joined = row.map((value) => value.toLowerCase()).join(' ');
  return SCHOOL_IMPORT_FIELDS.some((field) => field.aliases.some((alias) => joined.includes(alias)));
}

function schoolDataColumns(rows) {
  const firstRow = rows[0] || [];
  const hasHeader = looksLikeHeaderRow(firstRow);
  const width = rows.reduce((max, row) => Math.max(max, row.length), 0);
  return Array.from({ length: width }, (_unused, index) => ({
    index,
    name: hasHeader ? (firstRow[index] || `Column ${index + 1}`) : `Column ${index + 1}`,
    sample: (hasHeader ? rows.slice(1) : rows).map((row) => row[index] || '').filter(Boolean).slice(0, 3)
  }));
}

function guessedSchoolDataMapping(columns) {
  const mapping = {};
  columns.forEach((column) => {
    const normalizedName = column.name.toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
    const field = SCHOOL_IMPORT_FIELDS.find((candidate) => candidate.aliases.includes(normalizedName));
    if (field && mapping[field.key] === undefined) {
      mapping[field.key] = column.index;
    }
  });
  return mapping;
}

async function previewSchoolData(filePath) {
  const rows = nonEmptySchoolDataRows(await readSchoolDataRows(filePath));
  if (!rows.length) {
    throw new Error('The selected school data file is empty');
  }

  const hasHeader = looksLikeHeaderRow(rows[0]);
  const columns = schoolDataColumns(rows);
  const dataRows = hasHeader ? rows.slice(1) : rows;
  return {
    filePath,
    fileName: path.basename(filePath),
    hasHeader,
    columns,
    mapping: guessedSchoolDataMapping(columns),
    fields: SCHOOL_IMPORT_FIELDS,
    rows: dataRows.slice(0, 25)
  };
}

async function chooseSchoolDataFile(event, jobIdValue) {
  const jobId = numericId(jobIdValue);
  const jobRows = await querySql(`
    SELECT root_path AS rootPath
    FROM jobs
    WHERE id = ${jobId}
    LIMIT 1;
  `);
  if (!jobRows.length) {
    throw new Error('Job not found');
  }

  const defaultPath = path.join(resolveProjectPath(jobRows[0].rootPath), 'Database');
  fs.mkdirSync(defaultPath, { recursive: true });
  const result = await dialog.showOpenDialog(BrowserWindow.fromWebContents(event.sender), {
    title: 'Choose School Data File',
    defaultPath,
    properties: ['openFile'],
    filters: [
      { name: 'School data', extensions: ['csv', 'txt', 'xls', 'xlsx', 'xlsm'] },
      { name: 'All files', extensions: ['*'] }
    ]
  });

  if (result.canceled || !result.filePaths.length) {
    return { canceled: true };
  }

  return {
    canceled: false,
    ...(await previewSchoolData(result.filePaths[0]))
  };
}

function importRowValue(row, mapping, key) {
  const columnIndex = mapping[key];
  if (columnIndex === null || columnIndex === undefined || columnIndex === '') {
    return '';
  }
  return normalizeImportCell(row[Number(columnIndex)]);
}

function normalizedImportSubjectType(value) {
  const text = String(value || '').trim().toLowerCase();
  if (!text) {
    return 'student';
  }
  if (['faculty', 'staff', 'teacher', 'fac'].includes(text)) {
    return 'faculty';
  }
  return 'student';
}

function displayNameFromImport(firstName, lastName, displayName) {
  return optionalText(displayName, 255) || [firstName, lastName].filter(Boolean).join(' ') || null;
}

function numericReferenceValue(value) {
  const text = String(value || '').trim();
  return /^\d+$/.test(text) ? Number(text) : null;
}

function nextImportReference(usedRefs, state) {
  while (usedRefs.has(String(state.nextRef))) {
    state.nextRef += 1;
  }
  const ref = String(state.nextRef);
  usedRefs.add(ref);
  state.nextRef += 1;
  return ref;
}

function copySchoolDataSourceFile(filePath, jobRoot) {
  const importsFolder = path.join(jobRoot, 'Database', 'Imports');
  fs.mkdirSync(importsFolder, { recursive: true });
  const destinationPath = uniquePath(importsFolder, path.basename(filePath));
  fs.copyFileSync(filePath, destinationPath);
  return path.relative(projectRoot, destinationPath);
}

async function importSchoolData(_event, jobIdValue, input = {}) {
  const jobId = numericId(jobIdValue);
  const filePath = normalizeText(input.filePath, 'School data file', 1000);
  const mapping = input.mapping || {};
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    throw new Error('School data file was not found');
  }

  const allRows = nonEmptySchoolDataRows(await readSchoolDataRows(filePath));
  const hasHeader = Boolean(input.hasHeader);
  const dataRows = hasHeader ? allRows.slice(1) : allRows;
  const importedAt = new Date().toISOString();

  const result = await writeSql((database) => {
    const jobRows = rowsFromDatabase(database, `
      SELECT
        j.id,
        j.root_path AS rootPath,
        c.reference_number AS clientReferenceNumber
      FROM jobs j
      JOIN clients c ON c.id = j.client_id
      WHERE j.id = ${jobId}
      LIMIT 1;
    `);
    if (!jobRows.length) {
      throw new Error('Job not found');
    }

    const jobRoot = resolveProjectPath(jobRows[0].rootPath);
    const existingRefs = rowsFromDatabase(database, `
      SELECT legacy_ref_num AS ref
      FROM subjects
      WHERE job_id = ${jobId}
        AND legacy_ref_num IS NOT NULL
        AND legacy_ref_num != '';
    `).map((row) => String(row.ref));
    const usedRefs = new Set(existingRefs);
    const maxExistingRef = existingRefs
      .map(numericReferenceValue)
      .filter((value) => value !== null)
      .reduce((max, value) => Math.max(max, value), 0);
    const schoolStartRef = numericReferenceValue(jobRows[0].clientReferenceNumber) || 1;
    const referenceState = {
      nextRef: maxExistingRef > 0 ? maxExistingRef + 1 : schoolStartRef
    };
    const copiedSourcePath = copySchoolDataSourceFile(filePath, jobRoot);
    const subjectStatement = database.prepare(`
      INSERT INTO subjects (
        job_id,
        legacy_ref_num,
        subject_type,
        first_name,
        last_name,
        display_name,
        external_id,
        grade,
        homeroom,
        track,
        team,
        photographed_status,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'unknown', ?);
    `);
    const updateStatement = database.prepare(`
      UPDATE subjects
      SET subject_type = ?,
          first_name = ?,
          last_name = ?,
          display_name = ?,
          external_id = ?,
          grade = ?,
          homeroom = ?,
          track = ?,
          team = ?,
          notes = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?;
    `);
    const codeStatement = database.prepare(`
      INSERT OR IGNORE INTO subject_codes (
        subject_id,
        code_type,
        code
      )
      VALUES (?, ?, ?);
    `);

    const skippedRows = [];
    let created = 0;
    let updated = 0;

    try {
      dataRows.forEach((row, index) => {
        const firstName = optionalText(importRowValue(row, mapping, 'firstName'), 255);
        const lastName = optionalText(importRowValue(row, mapping, 'lastName'), 255);
        const displayName = displayNameFromImport(firstName, lastName, importRowValue(row, mapping, 'displayName'));
        const externalId = optionalText(importRowValue(row, mapping, 'externalId'), 255);
        const grade = optionalText(importRowValue(row, mapping, 'grade'), 100);
        const homeroom = optionalText(importRowValue(row, mapping, 'homeroom'), 100);
        const track = optionalText(importRowValue(row, mapping, 'track'), 100);
        const team = optionalText(importRowValue(row, mapping, 'team'), 100);
        const subjectType = normalizedImportSubjectType(importRowValue(row, mapping, 'subjectType'));
        const notes = optionalText(importRowValue(row, mapping, 'notes'), 5000);
        const mappedRef = importRowValue(row, mapping, 'ref');
        const hasImportedData = Boolean(
          mappedRef ||
          firstName ||
          lastName ||
          displayName ||
          externalId ||
          grade ||
          homeroom ||
          track ||
          team ||
          notes
        );
        if (!hasImportedData) {
          skippedRows.push({ rowNumber: index + (hasHeader ? 2 : 1), reason: 'No mapped student data' });
          return;
        }

        const ref = mappedRef || nextImportReference(usedRefs, referenceState);
        if (mappedRef) {
          usedRefs.add(mappedRef);
        }
        const existingRows = rowsFromDatabase(database, `
          SELECT id
          FROM subjects
          WHERE job_id = ${jobId}
            AND legacy_ref_num = ${sqlLiteral(ref)}
          LIMIT 1;
        `);

        let subjectId = null;
        if (existingRows.length) {
          subjectId = existingRows[0].id;
          updateStatement.run([
            subjectType,
            firstName,
            lastName,
            displayName,
            externalId,
            grade,
            homeroom,
            track,
            team,
            notes,
            subjectId
          ]);
          updated += 1;
        } else {
          subjectStatement.run([
            jobId,
            ref,
            subjectType,
            firstName,
            lastName,
            displayName,
            externalId,
            grade,
            homeroom,
            track,
            team,
            notes
          ]);
          subjectId = rowsFromDatabase(database, 'SELECT last_insert_rowid() AS id;')[0].id;
          created += 1;
        }

        codeStatement.run([subjectId, 'legacy_ref', ref]);
        if (externalId) {
          codeStatement.run([subjectId, 'student_id', externalId]);
        }
      });
    } finally {
      subjectStatement.free();
      updateStatement.free();
      codeStatement.free();
    }

    return {
      jobId,
      created,
      updated,
      skipped: skippedRows.length,
      skippedRows: skippedRows.slice(0, 25),
      sourceFilePath: copiedSourcePath,
      importedAt
    };
  });

  result.jobDatabasePath = await writeJobDatabaseSnapshot(jobId);
  result.programDatabasePath = await writeProgramDatabaseSnapshot();
  return result;
}

ipcMain.handle('school-data:choose-file', chooseSchoolDataFile);
ipcMain.handle('school-data:import', importSchoolData);

async function getJobDetail(_event, jobIdValue) {
  const jobId = numericId(jobIdValue);

  const summary = await querySql(`
    WITH
      subject_counts AS (
        SELECT
          job_id,
          COUNT(*) AS subjects,
          SUM(CASE WHEN primary_image_asset_id IS NOT NULL THEN 1 ELSE 0 END) AS subjectsWithPrimaryImage
        FROM subjects
        WHERE job_id = ${jobId}
        GROUP BY job_id
      ),
      order_counts AS (
        SELECT job_id, COUNT(*) AS orders
        FROM orders
        WHERE job_id = ${jobId}
        GROUP BY job_id
      ),
      order_item_counts AS (
        SELECT o.job_id, COUNT(oi.id) AS orderItems
        FROM orders o
        LEFT JOIN order_items oi ON oi.order_id = o.id
        WHERE o.job_id = ${jobId}
        GROUP BY o.job_id
      ),
      image_counts AS (
        SELECT job_id, COUNT(*) AS images
        FROM image_assets
        WHERE job_id = ${jobId}
        GROUP BY job_id
      ),
      subject_image_counts AS (
        SELECT s.job_id, COUNT(si.id) AS subjectImages
        FROM subjects s
        LEFT JOIN subject_images si ON si.subject_id = s.id
        WHERE s.job_id = ${jobId}
        GROUP BY s.job_id
      )
    SELECT
      j.id,
      COALESCE(c.trecs_name, c.display_name, '') AS location,
      c.display_name AS clientName,
      j.name AS job,
      j.type,
      j.status,
      j.root_path AS rootPath,
      COALESCE(p.name, '') AS packagePlan,
      COALESCE(sc.subjects, 0) AS subjects,
      COALESCE(sc.subjectsWithPrimaryImage, 0) AS subjectsWithPrimaryImage,
      COALESCE(oc.orders, 0) AS orders,
      COALESCE(oic.orderItems, 0) AS orderItems,
      COALESCE(ic.images, 0) AS images,
      COALESCE(sic.subjectImages, 0) AS subjectImages
    FROM jobs j
    JOIN clients c ON c.id = j.client_id
    LEFT JOIN package_plans p ON p.id = j.package_plan_id
    LEFT JOIN subject_counts sc ON sc.job_id = j.id
    LEFT JOIN order_counts oc ON oc.job_id = j.id
    LEFT JOIN order_item_counts oic ON oic.job_id = j.id
    LEFT JOIN image_counts ic ON ic.job_id = j.id
    LEFT JOIN subject_image_counts sic ON sic.job_id = j.id
    WHERE j.id = ${jobId}
  `);

  const subjects = await querySql(`
    SELECT
      s.id,
      s.legacy_ref_num AS ref,
      s.first_name AS firstName,
      s.last_name AS lastName,
      COALESCE(s.display_name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS name,
      s.external_id AS externalId,
      s.grade,
      s.homeroom,
      s.track,
      s.team,
      s.subject_type AS subjectType,
      s.photographed_status AS photographedStatus,
      s.notes,
      s.created_at AS createdAt,
      s.updated_at AS updatedAt,
      ia.id AS imageAssetId,
      ia.filename AS imageFilename,
      ia.current_path AS imagePath
    FROM subjects s
    LEFT JOIN image_assets ia ON ia.id = s.primary_image_asset_id
    WHERE s.job_id = ${jobId}
    ORDER BY
      CASE
        WHEN s.legacy_ref_num IS NOT NULL
          AND s.legacy_ref_num != ''
          AND s.legacy_ref_num NOT GLOB '*[^0-9]*'
        THEN 0
        ELSE 1
      END,
      CAST(s.legacy_ref_num AS INTEGER),
      s.legacy_ref_num,
      s.id;
  `);

  const orders = await querySql(`
    SELECT
      o.id,
      o.source,
      o.source_reference AS sourceReference,
      o.family_key AS familyKey,
      o.entry_timing AS entryTiming,
      o.status,
      o.paid_status AS paidStatus,
      o.render_status AS renderStatus,
      o.notes,
      o.created_at AS createdAt,
      s.legacy_ref_num AS ref,
      s.id AS subjectId,
      s.primary_image_asset_id AS primaryImageAssetId,
      COALESCE(s.display_name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS subjectName,
      COUNT(oi.id) AS itemCount,
      GROUP_CONCAT(oi.package_code, '.') AS packageCodes,
      CASE
        WHEN o.render_status IN ('queued', 'rendered', 'held', 'failed') THEN o.render_status
        WHEN s.id IS NULL THEN 'not_ready'
        WHEN s.primary_image_asset_id IS NULL THEN 'not_ready'
        WHEN COUNT(oi.id) = 0 THEN 'not_ready'
        ELSE 'ready'
      END AS productionStatus,
      CASE
        WHEN o.render_status IN ('queued', 'rendered', 'held', 'failed') THEN o.render_status
        WHEN s.id IS NULL THEN 'Missing subject'
        WHEN s.primary_image_asset_id IS NULL THEN 'Needs photo'
        WHEN COUNT(oi.id) = 0 THEN 'No order items'
        ELSE 'Ready to render'
      END AS productionReason
    FROM orders o
    LEFT JOIN subjects s ON s.id = o.subject_id
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE o.job_id = ${jobId}
    GROUP BY o.id
    ORDER BY o.id
    LIMIT 250;
  `);

  const subjectCodes = await querySql(`
    SELECT
      sc.subject_id AS subjectId,
      sc.code_type AS codeType,
      sc.code
    FROM subject_codes sc
    JOIN subjects s ON s.id = sc.subject_id
    WHERE s.job_id = ${jobId}
    ORDER BY sc.code_type, sc.code;
  `);

  const subjectOrders = await querySql(`
    SELECT
      o.id,
      o.subject_id AS subjectId,
      o.source,
      o.source_reference AS sourceReference,
      o.paid_status AS paidStatus,
      o.render_status AS renderStatus,
      o.notes,
      COUNT(oi.id) AS itemCount,
      GROUP_CONCAT(oi.package_code, '.') AS packageCodes
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE o.job_id = ${jobId}
      AND o.subject_id IS NOT NULL
    GROUP BY o.id
    ORDER BY o.id;
  `);

  const subjectImages = await querySql(`
    SELECT
      si.subject_id AS subjectId,
      ia.id AS imageAssetId,
      ia.filename,
      ia.source,
      ia.status,
      si.role,
      si.selected,
      MAX(iv.width) AS width,
      MAX(iv.height) AS height
    FROM subject_images si
    JOIN image_assets ia ON ia.id = si.image_asset_id
    LEFT JOIN image_versions iv ON iv.image_asset_id = ia.id
    JOIN subjects s ON s.id = si.subject_id
    WHERE s.job_id = ${jobId}
    GROUP BY si.id
    ORDER BY si.selected DESC, si.sort_order, ia.filename;
  `);

  const orderItems = await querySql(`
    SELECT
      oi.id,
      oi.order_id AS orderId,
      oi.subject_id AS subjectId,
      s.legacy_ref_num AS ref,
      COALESCE(s.display_name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS subjectName,
      oi.package_code AS packageCode,
      oi.raw_code AS rawCode,
      oi.quantity,
      oi.status,
      oi.notes,
      p.name AS productName,
      p.category AS productCategory,
      ia.id AS imageAssetId,
      ia.filename AS imageFilename
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    LEFT JOIN subjects s ON s.id = oi.subject_id
    LEFT JOIN products p ON p.id = oi.product_id
    LEFT JOIN image_assets ia ON ia.id = oi.image_asset_id
    WHERE o.job_id = ${jobId}
    ORDER BY oi.order_id, oi.id;
  `);

  const payments = await querySql(`
    SELECT
      p.id,
      p.order_id AS orderId,
      p.method,
      p.amount,
      p.status,
      p.reference,
      p.created_at AS createdAt
    FROM payments p
    JOIN orders o ON o.id = p.order_id
    WHERE o.job_id = ${jobId}
    ORDER BY p.created_at, p.id;
  `);

  const images = await querySql(`
    SELECT
      ia.id,
      ia.filename,
      ia.source,
      ia.status,
      COUNT(DISTINCT iv.id) AS versions,
      MAX(iv.width) AS width,
      MAX(iv.height) AS height,
      GROUP_CONCAT(DISTINCT iv.version_type) AS versionTypes,
      COUNT(DISTINCT si.subject_id) AS linkedSubjects
    FROM image_assets ia
    LEFT JOIN image_versions iv ON iv.image_asset_id = ia.id
    LEFT JOIN subject_images si ON si.image_asset_id = ia.id
    WHERE ia.job_id = ${jobId}
    GROUP BY ia.id
    ORDER BY ia.filename
    LIMIT 250;
  `);

  const products = await querySql(`
    SELECT
      pc.code,
      pc.name AS codeName,
      COUNT(pci.id) AS itemCount,
      SUM(CASE WHEN pci.product_id IS NOT NULL THEN 1 ELSE 0 END) AS mappedItems,
      GROUP_CONCAT(pci.raw_value, ' | ') AS rawItems
    FROM jobs j
    JOIN package_codes pc ON pc.package_plan_id = j.package_plan_id
    LEFT JOIN package_code_items pci ON pci.package_code_id = pc.id
    WHERE j.id = ${jobId}
    GROUP BY pc.id
    ORDER BY CAST(pc.code AS REAL), pc.code
    LIMIT 250;
  `);

  const captureSummary = await querySql(`
    SELECT
      (SELECT COUNT(*) FROM subjects WHERE job_id = ${jobId}) AS subjects,
      (
        SELECT COUNT(*)
        FROM subjects
        WHERE job_id = ${jobId}
          AND primary_image_asset_id IS NULL
      ) AS noPhotoSubjects,
      (
        SELECT COUNT(*)
        FROM subjects
        WHERE job_id = ${jobId}
          AND primary_image_asset_id IS NOT NULL
      ) AS linkedSubjects,
      (SELECT COUNT(*) FROM image_assets WHERE job_id = ${jobId}) AS images,
      (
        SELECT COUNT(*)
        FROM image_assets ia
        WHERE ia.job_id = ${jobId}
          AND NOT EXISTS (
            SELECT 1
            FROM subject_images si
            WHERE si.image_asset_id = ia.id
          )
      ) AS unlinkedImages,
      (
        SELECT COUNT(DISTINCT s.id)
        FROM subjects s
        JOIN orders o ON o.subject_id = s.id
        WHERE s.job_id = ${jobId}
          AND s.primary_image_asset_id IS NULL
      ) AS orderedNoPhotoSubjects;
  `);

  const noPhotoSubjects = await querySql(`
    SELECT
      s.id,
      s.legacy_ref_num AS ref,
      COALESCE(s.display_name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS name,
      s.external_id AS externalId,
      s.grade,
      s.homeroom,
      s.track,
      COUNT(o.id) AS orders
    FROM subjects s
    LEFT JOIN orders o ON o.subject_id = s.id
    WHERE s.job_id = ${jobId}
      AND s.primary_image_asset_id IS NULL
    GROUP BY s.id
    ORDER BY
      CASE WHEN COUNT(o.id) > 0 THEN 0 ELSE 1 END,
      s.legacy_ref_num
    LIMIT 150;
  `);

  const recentImages = await querySql(`
    SELECT
      ia.id,
      ia.filename,
      ia.source,
      ia.status,
      MAX(iv.width) AS width,
      MAX(iv.height) AS height,
      COUNT(DISTINCT si.subject_id) AS linkedSubjects,
      GROUP_CONCAT(DISTINCT COALESCE(s.legacy_ref_num, '')) AS refs
    FROM image_assets ia
    LEFT JOIN image_versions iv ON iv.image_asset_id = ia.id
    LEFT JOIN subject_images si ON si.image_asset_id = ia.id
    LEFT JOIN subjects s ON s.id = si.subject_id
    WHERE ia.job_id = ${jobId}
    GROUP BY ia.id
    ORDER BY ia.id DESC
    LIMIT 80;
  `);

  const reviewCandidates = await querySql(`
    SELECT
      ia.id,
      ia.filename,
      ia.source,
      ia.status,
      MAX(iv.width) AS width,
      MAX(iv.height) AS height,
      COUNT(DISTINCT si.subject_id) AS linkedSubjects,
      CASE
        WHEN COUNT(DISTINCT si.subject_id) = 0 THEN 'Unlinked image'
        WHEN COUNT(DISTINCT si.subject_id) > 1 THEN 'Multiple subject links'
        ELSE 'Review'
      END AS reason
    FROM image_assets ia
    LEFT JOIN image_versions iv ON iv.image_asset_id = ia.id
    LEFT JOIN subject_images si ON si.image_asset_id = ia.id
    WHERE ia.job_id = ${jobId}
    GROUP BY ia.id
    HAVING COUNT(DISTINCT si.subject_id) <> 1
    ORDER BY ia.id DESC
    LIMIT 100;
  `);

  const jobDatabasePath = await writeJobDatabaseSnapshot(jobId);

  return {
    summary: summary[0] || null,
    subjects,
    subjectCodes,
    subjectOrders,
    subjectImages,
    orders,
    orderItems,
    payments,
    images,
    products,
    capture: {
      summary: captureSummary[0] || null,
      noPhotoSubjects,
      recentImages,
      reviewCandidates
    },
    storage: {
      jobDatabasePath
    }
  };
}

ipcMain.handle('job:detail', getJobDetail);

function normalizeNotes(value) {
  if (value === null || value === undefined) {
    return '';
  }

  const notes = String(value);
  if (notes.length > 5000) {
    throw new Error('Notes are too long');
  }
  return notes;
}

async function createSubject(_event, jobIdValue, input = {}) {
  const jobId = numericId(jobIdValue);
  const firstName = optionalText(input.firstName, 255);
  const lastName = optionalText(input.lastName, 255);
  const displayName = displayNameForSubject(firstName, lastName, input.displayName);
  const ref = optionalText(input.ref, 100);
  const externalId = optionalText(input.externalId, 255);
  const grade = optionalText(input.grade, 100);
  const homeroom = optionalText(input.homeroom, 100);
  const track = optionalText(input.track, 100);
  const team = optionalText(input.team, 100);
  const subjectType = normalizeSubjectType(input.subjectType);
  const photographedStatus = normalizePhotographedStatus(input.photographedStatus);
  const notes = optionalText(input.notes, 5000);

  const result = await writeSql((database) => {
    const jobRows = rowsFromDatabase(database, `SELECT id FROM jobs WHERE id = ${jobId};`);
    if (!jobRows.length) {
      throw new Error('Job not found');
    }

    const statement = database.prepare(`
      INSERT INTO subjects (
        job_id,
        legacy_ref_num,
        subject_type,
        first_name,
        last_name,
        display_name,
        external_id,
        grade,
        homeroom,
        track,
        team,
        photographed_status,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `);

    try {
      statement.run([
        jobId,
        ref,
        subjectType,
        firstName,
        lastName,
        displayName,
        externalId,
        grade,
        homeroom,
        track,
        team,
        photographedStatus,
        notes
      ]);
    } finally {
      statement.free();
    }

    const idRows = rowsFromDatabase(database, 'SELECT last_insert_rowid() AS id;');
    return { id: idRows[0].id };
  });
}

function normalizeRecordCount(value) {
  const count = Number(value);
  if (!Number.isInteger(count) || count < 1) {
    throw new Error('Record count must be at least 1');
  }
  if (count > 500) {
    throw new Error('Record count cannot be more than 500');
  }
  return count;
}

function numericReferenceStart(value) {
  const text = String(value || '').trim();
  if (!text || /[^0-9]/.test(text)) {
    return 1;
  }

  const ref = Number(text);
  return Number.isSafeInteger(ref) && ref > 0 ? ref : 1;
}

async function createBlankSubjects(_event, jobIdValue, countValue) {
  const jobId = numericId(jobIdValue);
  const count = normalizeRecordCount(countValue);

  const result = await writeSql((database) => {
    const jobRows = rowsFromDatabase(database, `
      SELECT
        j.id,
        c.reference_number AS clientReferenceNumber
      FROM jobs j
      JOIN clients c ON c.id = j.client_id
      WHERE j.id = ${jobId};
    `);
    if (!jobRows.length) {
      throw new Error('Job not found');
    }

    const maxRows = rowsFromDatabase(database, `
      SELECT COALESCE(MAX(CAST(legacy_ref_num AS INTEGER)), 0) AS maxRef
      FROM subjects
      WHERE job_id = ${jobId}
        AND legacy_ref_num IS NOT NULL
        AND legacy_ref_num != ''
        AND legacy_ref_num NOT GLOB '*[^0-9]*'
        AND CAST(legacy_ref_num AS INTEGER) > 0;
    `);
    const nextExistingRef = Number(maxRows[0].maxRef || 0) + 1;
    const schoolStartRef = numericReferenceStart(jobRows[0].clientReferenceNumber);
    const startRef = Math.max(nextExistingRef, schoolStartRef);
    const statement = database.prepare(`
      INSERT INTO subjects (
        job_id,
        legacy_ref_num,
        subject_type,
        photographed_status
      )
      VALUES (?, ?, 'student', 'unknown');
    `);
    const createdIds = [];

    try {
      for (let index = 0; index < count; index += 1) {
        statement.run([jobId, String(startRef + index)]);
        const idRows = rowsFromDatabase(database, 'SELECT last_insert_rowid() AS id;');
        createdIds.push(idRows[0].id);
      }
    } finally {
      statement.free();
    }

    return {
      ids: createdIds,
      firstId: createdIds[0] || null,
      firstRef: String(startRef),
      lastRef: String(startRef + count - 1),
      count
    };
  });

  result.jobDatabasePath = await writeJobDatabaseSnapshot(jobId);
  return result;
}

async function updateSubject(_event, subjectIdValue, input = {}) {
  const subjectId = numericId(subjectIdValue);
  const firstName = optionalText(input.firstName, 255);
  const lastName = optionalText(input.lastName, 255);
  const displayName = displayNameForSubject(firstName, lastName, null);
  const externalId = optionalText(input.externalId, 255);
  const grade = optionalText(input.grade, 100);
  const homeroom = optionalText(input.homeroom, 100);
  const track = optionalText(input.track, 100);
  const team = optionalText(input.team, 100);
  const subjectType = normalizeSubjectType(input.subjectType);
  const photographedStatus = normalizePhotographedStatus(input.photographedStatus);

  const result = await writeSql((database) => {
    const statement = database.prepare(`
      UPDATE subjects
      SET subject_type = ?,
          first_name = ?,
          last_name = ?,
          display_name = ?,
          external_id = ?,
          grade = ?,
          homeroom = ?,
          track = ?,
          team = ?,
          photographed_status = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?;
    `);

    try {
      statement.run([
        subjectType,
        firstName,
        lastName,
        displayName,
        externalId,
        grade,
        homeroom,
        track,
        team,
        photographedStatus,
        subjectId
      ]);
    } finally {
      statement.free();
    }

    if (database.getRowsModified() !== 1) {
      throw new Error('Subject not found');
    }

    return { id: subjectId };
  });

  const rows = await querySql(`SELECT job_id AS jobId FROM subjects WHERE id = ${subjectId};`);
  if (rows.length) {
    result.jobDatabasePath = await writeJobDatabaseSnapshot(rows[0].jobId);
  }
  return result;
}

async function updateSubjectNotes(_event, subjectIdValue, notesValue) {
  const subjectId = numericId(subjectIdValue);
  const notes = normalizeNotes(notesValue);

  const result = await writeSql((database) => {
    const statement = database.prepare(`
      UPDATE subjects
      SET notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?;
    `);

    try {
      statement.run([notes, subjectId]);
    } finally {
      statement.free();
    }

    if (database.getRowsModified() !== 1) {
      throw new Error('Subject not found');
    }

    return { id: subjectId, notes };
  });

  const rows = await querySql(`SELECT job_id AS jobId FROM subjects WHERE id = ${subjectId};`);
  if (rows.length) {
    result.jobDatabasePath = await writeJobDatabaseSnapshot(rows[0].jobId);
  }
  return result;
}

async function updateOrderNotes(_event, orderIdValue, notesValue) {
  const orderId = numericId(orderIdValue);
  const notes = normalizeNotes(notesValue);

  return writeSql((database) => {
    const statement = database.prepare(`
      UPDATE orders
      SET notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?;
    `);

    try {
      statement.run([notes, orderId]);
    } finally {
      statement.free();
    }

    if (database.getRowsModified() !== 1) {
      throw new Error('Order not found');
    }

    return { id: orderId, notes };
  });
}

ipcMain.handle('subject:create', createSubject);
ipcMain.handle('subject:create-blank-batch', createBlankSubjects);
ipcMain.handle('subject:update', updateSubject);
ipcMain.handle('subject:update-notes', updateSubjectNotes);
ipcMain.handle('order:update-notes', updateOrderNotes);

function normalizeRenderStatus(value) {
  const status = String(value || '');
  const allowed = new Set(['not_ready', 'ready', 'queued', 'rendered', 'held', 'failed']);
  if (!allowed.has(status)) {
    throw new Error('Invalid render status');
  }
  return status;
}

async function updateOrderRenderStatus(_event, orderIdValue, statusValue) {
  const orderId = numericId(orderIdValue);
  const renderStatus = normalizeRenderStatus(statusValue);

  return writeSql((database) => {
    if (renderStatus === 'queued') {
      const readiness = database.exec(`
        SELECT
          o.id,
          s.id AS subjectId,
          s.primary_image_asset_id AS primaryImageAssetId,
          COUNT(oi.id) AS itemCount
        FROM orders o
        LEFT JOIN subjects s ON s.id = o.subject_id
        LEFT JOIN order_items oi ON oi.order_id = o.id
        WHERE o.id = ${orderId}
        GROUP BY o.id;
      `);

      if (!readiness.length || !readiness[0].values.length) {
        throw new Error('Order not found');
      }

      const [id, subjectId, primaryImageAssetId, itemCount] = readiness[0].values[0];
      if (!id || !subjectId || !primaryImageAssetId || itemCount < 1) {
        throw new Error('Order is not render-ready');
      }
    }

    const statement = database.prepare(`
      UPDATE orders
      SET render_status = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?;
    `);

    try {
      statement.run([renderStatus, orderId]);
    } finally {
      statement.free();
    }

    if (database.getRowsModified() !== 1) {
      throw new Error('Order not found');
    }

    return { id: orderId, renderStatus };
  });
}

ipcMain.handle('order:update-render-status', updateOrderRenderStatus);

async function updateOrder(_event, orderIdValue, input = {}) {
  const orderId = numericId(orderIdValue);
  const paidStatus = normalizePaidStatus(input.paidStatus);
  const notes = normalizeNotes(input.notes);
  const { raw, codes } = orderCodesFromInput(input.orderCodes);

  return writeSql((database) => {
    const orderRows = rowsFromDatabase(database, `
      SELECT id, subject_id AS subjectId
      FROM orders
      WHERE id = ${orderId};
    `);

    if (!orderRows.length) {
      throw new Error('Order not found');
    }

    database.run(`
      UPDATE orders
      SET paid_status = ?,
          notes = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?;
    `, [paidStatus, notes, orderId]);

    database.run('DELETE FROM order_items WHERE order_id = ?;', [orderId]);

    const itemStatement = database.prepare(`
      INSERT INTO order_items (
        order_id,
        subject_id,
        package_code,
        quantity,
        raw_code,
        status,
        notes
      )
      VALUES (?, ?, ?, 1, ?, 'open', ?);
    `);

    try {
      codes.forEach((code) => {
        itemStatement.run([orderId, orderRows[0].subjectId, code, raw, 'Edited order code']);
      });
    } finally {
      itemStatement.free();
    }

    database.run(`
      UPDATE envelope_scans
      SET keyed_order_code = ?,
          notes = COALESCE(NULLIF(?, ''), notes)
      WHERE order_id = ?;
    `, [raw, notes, orderId]);

    return {
      id: orderId,
      paidStatus,
      notes,
      packageCodes: raw,
      itemCount: codes.length
    };
  });
}

async function deleteOrder(_event, orderIdValue) {
  const orderId = numericId(orderIdValue);

  return writeSql((database) => {
    const orderRows = rowsFromDatabase(database, `
      SELECT id
      FROM orders
      WHERE id = ${orderId};
    `);

    if (!orderRows.length) {
      throw new Error('Order not found');
    }

    database.run(`
      UPDATE envelope_scans
      SET order_id = NULL,
          status = 'scanned',
          keyed_order_code = NULL,
          keyed_at = NULL
      WHERE order_id = ?;
    `, [orderId]);
    database.run('DELETE FROM payments WHERE order_id = ?;', [orderId]);
    database.run('DELETE FROM order_items WHERE order_id = ?;', [orderId]);
    database.run('DELETE FROM orders WHERE id = ?;', [orderId]);

    return { id: orderId, deleted: true };
  });
}

ipcMain.handle('order:update', updateOrder);
ipcMain.handle('order:delete', deleteOrder);

function sqlLiteral(value) {
  if (value === null || value === undefined || value === '') {
    return 'NULL';
  }
  return `'${String(value).replace(/'/g, "''")}'`;
}

function normalizeBarcode(value) {
  const barcode = String(value || '').trim();
  if (!barcode) {
    throw new Error('Barcode/reference is required');
  }
  if (barcode.length > 100) {
    throw new Error('Barcode/reference is too long');
  }
  return barcode;
}

function normalizeEnvelopeSearch(value) {
  const search = String(value || '').trim().replace(/\s+/g, ' ');
  if (search.length > 100) {
    throw new Error('Student search is too long');
  }
  return search;
}

function subjectRowForEnvelope(row) {
  return {
    id: row.id,
    ref: row.ref,
    firstName: row.firstName,
    lastName: row.lastName,
    name: row.name,
    externalId: row.externalId,
    grade: row.grade,
    homeroom: row.homeroom,
    track: row.track,
    team: row.team,
    subjectType: row.subjectType,
    photographedStatus: row.photographedStatus,
    notes: row.notes,
    imageAssetId: row.imageAssetId,
    imageFilename: row.imageFilename,
    imagePath: row.imagePath
  };
}

async function findSubjectByBarcode(_event, jobIdValue, barcodeValue) {
  const jobId = numericId(jobIdValue);
  const barcode = normalizeBarcode(barcodeValue);
  const barcodeSql = sqlLiteral(barcode);
  const rows = await querySql(`
    SELECT
      s.id,
      s.legacy_ref_num AS ref,
      s.first_name AS firstName,
      s.last_name AS lastName,
      COALESCE(s.display_name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS name,
      s.external_id AS externalId,
      s.grade,
      s.homeroom,
      s.track,
      s.team,
      s.subject_type AS subjectType,
      s.photographed_status AS photographedStatus,
      s.notes,
      ia.id AS imageAssetId,
      ia.filename AS imageFilename,
      ia.current_path AS imagePath
    FROM subjects s
    LEFT JOIN image_assets ia ON ia.id = s.primary_image_asset_id
    WHERE s.job_id = ${jobId}
      AND (
        s.legacy_ref_num = ${barcodeSql}
        OR s.external_id = ${barcodeSql}
        OR EXISTS (
          SELECT 1
          FROM subject_codes sc
          WHERE sc.subject_id = s.id
            AND sc.code = ${barcodeSql}
        )
      )
    ORDER BY
      CASE WHEN s.legacy_ref_num = ${barcodeSql} THEN 0 ELSE 1 END,
      s.id
    LIMIT 2;
  `);

  if (!rows.length) {
    throw new Error(`No student found for ${barcode}`);
  }
  if (rows.length > 1) {
    throw new Error(`More than one student matched ${barcode}`);
  }

  return { subject: subjectRowForEnvelope(rows[0]) };
}

async function searchEnvelopeSubjects(_event, jobIdValue, searchValue) {
  const jobId = numericId(jobIdValue);
  const search = normalizeEnvelopeSearch(searchValue);
  if (search.length < 2) {
    return [];
  }

  const likeSql = sqlLiteral(`%${search}%`);
  const exactSql = sqlLiteral(search);
  const rows = await querySql(`
    SELECT
      s.id,
      s.legacy_ref_num AS ref,
      s.first_name AS firstName,
      s.last_name AS lastName,
      COALESCE(s.display_name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS name,
      s.external_id AS externalId,
      s.grade,
      s.homeroom,
      s.track,
      s.team,
      s.subject_type AS subjectType,
      s.photographed_status AS photographedStatus,
      s.notes,
      ia.id AS imageAssetId,
      ia.filename AS imageFilename,
      ia.current_path AS imagePath
    FROM subjects s
    LEFT JOIN image_assets ia ON ia.id = s.primary_image_asset_id
    WHERE s.job_id = ${jobId}
      AND (
        s.legacy_ref_num = ${exactSql}
        OR s.external_id = ${exactSql}
        OR COALESCE(s.display_name, '') LIKE ${likeSql}
        OR COALESCE(s.first_name, '') LIKE ${likeSql}
        OR COALESCE(s.last_name, '') LIKE ${likeSql}
        OR TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, '')) LIKE ${likeSql}
      )
    ORDER BY
      CASE
        WHEN s.legacy_ref_num = ${exactSql} THEN 0
        WHEN s.external_id = ${exactSql} THEN 1
        WHEN COALESCE(s.display_name, '') LIKE ${likeSql} THEN 2
        ELSE 3
      END,
      s.last_name,
      s.first_name,
      s.id
    LIMIT 12;
  `);

  return rows.map(subjectRowForEnvelope);
}

function resolveWorkspacePath(inputPath) {
  const text = String(inputPath || '').trim();
  if (!text) {
    return projectRoot;
  }
  return path.isAbsolute(text) ? text : path.join(projectRoot, text);
}

function latestImageInFolder(folderPath) {
  if (!fs.existsSync(folderPath)) {
    throw new Error(`Hot folder not found: ${folderPath}`);
  }

  const files = fs.readdirSync(folderPath)
    .map((name) => path.join(folderPath, name))
    .filter((filePath) => {
      const extension = path.extname(filePath).toLowerCase();
      return fs.statSync(filePath).isFile() && ['.jpg', '.jpeg', '.png'].includes(extension);
    })
    .map((filePath) => ({
      path: filePath,
      modified: fs.statSync(filePath).mtimeMs
    }))
    .sort((first, second) => second.modified - first.modified);

  if (!files.length) {
    throw new Error('No JPG/PNG envelope scans found in the hot folder');
  }

  return files[0].path;
}

function rawPairPathForImage(imagePath) {
  const folderPath = path.dirname(imagePath);
  const base = path.basename(imagePath, path.extname(imagePath)).toLowerCase();
  const match = fs.readdirSync(folderPath).find((name) => (
    path.basename(name, path.extname(name)).toLowerCase() === base
    && path.extname(name).toLowerCase() === '.cr3'
  ));
  return match ? path.join(folderPath, match) : null;
}

function fileIsStable(filePath, minAgeMs = 900) {
  if (!filePath || !fs.existsSync(filePath)) {
    return false;
  }
  const stats = fs.statSync(filePath);
  return stats.isFile() && stats.size > 0 && Date.now() - stats.mtimeMs >= minAgeMs;
}

function normalizeCaptureFileMode(value) {
  return value === 'jpg_only' ? 'jpg_only' : 'jpg_raw';
}

function latestCapturePairInFolder(folderPath, options = {}) {
  const fileMode = normalizeCaptureFileMode(options.fileMode);
  const imagePath = latestImageInFolder(folderPath);
  const rawPath = fileMode === 'jpg_only' ? null : rawPairPathForImage(imagePath);
  const filename = path.basename(imagePath);

  if (fileMode === 'jpg_only') {
    if (!fileIsStable(imagePath)) {
      return {
        imagePath,
        rawPath: null,
        filename,
        fileMode,
        ready: false,
        reason: `Waiting for ${filename} to finish transferring`
      };
    }

    return {
      imagePath,
      rawPath: null,
      filename,
      fileMode,
      ready: true,
      reason: 'Ready'
    };
  }

  if (!rawPath) {
    return {
      imagePath,
      rawPath: null,
      filename,
      fileMode,
      ready: false,
      reason: `Waiting for CR3 pair for ${filename}`
    };
  }

  if (!fileIsStable(imagePath) || !fileIsStable(rawPath)) {
    return {
      imagePath,
      rawPath,
      filename,
      fileMode,
      ready: false,
      reason: `Waiting for ${filename} and ${path.basename(rawPath)} to finish transferring`
    };
  }

  return {
    imagePath,
    rawPath,
    filename,
    fileMode,
    ready: true,
    reason: 'Ready'
  };
}

function envelopeDestinationName(ref, sourcePath) {
  const extension = path.extname(sourcePath) || '.jpg';
  const base = path.basename(sourcePath, extension)
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '-')
    .replace(/\s+/g, ' ')
    .trim() || 'scan';
  const prefix = String(ref || 'unknown').replace(/[<>:"/\\|?*\x00-\x1F]/g, '-');
  return base.toLowerCase().startsWith(`${prefix.toLowerCase()}-`)
    ? `${base}${extension}`
    : `${prefix}-${base}${extension}`;
}

function uniquePath(folderPath, filename) {
  let candidate = path.join(folderPath, filename);
  if (!fs.existsSync(candidate)) {
    return candidate;
  }

  const extension = path.extname(filename);
  const base = path.basename(filename, extension);
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  candidate = path.join(folderPath, `${base}-${stamp}${extension}`);
  let index = 2;
  while (fs.existsSync(candidate)) {
    candidate = path.join(folderPath, `${base}-${stamp}-${index}${extension}`);
    index += 1;
  }
  return candidate;
}

function moveFile(sourcePath, destinationPath) {
  try {
    fs.renameSync(sourcePath, destinationPath);
  } catch (error) {
    if (error.code !== 'EXDEV') {
      throw error;
    }
    fs.copyFileSync(sourcePath, destinationPath);
    fs.unlinkSync(sourcePath);
  }
}

function imageDataUrl(filePath) {
  const bytes = fs.readFileSync(filePath);
  return `data:${mimeTypeFor(filePath)};base64,${bytes.toString('base64')}`;
}

const envelopeWatchers = new Map();
const captureWatchers = new Map();

async function importEnvelopeScanCore(jobId, subjectId, hotFolder, explicitSourcePath = null) {
  const sourcePath = explicitSourcePath || latestImageInFolder(hotFolder);

  return writeSql((database) => {
    const rows = rowsFromDatabase(database, `
      SELECT
        s.id AS subjectId,
        s.legacy_ref_num AS ref,
        j.id AS jobId,
        j.root_path AS rootPath
      FROM subjects s
      JOIN jobs j ON j.id = s.job_id
      WHERE s.id = ${subjectId}
        AND j.id = ${jobId};
    `);

    if (!rows.length) {
      throw new Error('Student does not belong to this job');
    }

    const row = rows[0];
    const jobRoot = resolveWorkspacePath(row.rootPath);
    const envelopeFolder = path.join(jobRoot, 'Envelopes');
    fs.mkdirSync(envelopeFolder, { recursive: true });
    const filename = envelopeDestinationName(row.ref, sourcePath);
    const destinationPath = uniquePath(envelopeFolder, filename);
    moveFile(sourcePath, destinationPath);
    const relativeDestination = path.relative(projectRoot, destinationPath);

    const statement = database.prepare(`
      INSERT INTO envelope_scans (
        job_id,
        subject_id,
        scan_path,
        envelope_identifier,
        status,
        notes
      )
      VALUES (?, ?, ?, ?, 'scanned', ?);
    `);

    try {
      statement.run([
        jobId,
        subjectId,
        relativeDestination,
        row.ref,
        `Imported from ${hotFolder}`
      ]);
    } finally {
      statement.free();
    }

    const idRows = rowsFromDatabase(database, 'SELECT last_insert_rowid() AS id;');
    return {
      scan: {
        id: idRows[0].id,
        subjectId,
        path: relativeDestination,
        filename: path.basename(destinationPath),
        dataUrl: imageDataUrl(destinationPath)
      }
    };
  });
}

async function envelopeScanCount(jobId, subjectId) {
  const rows = await querySql(`
    SELECT COUNT(*) AS scanCount
    FROM envelope_scans
    WHERE job_id = ${jobId}
      AND subject_id = ${subjectId}
      AND status != 'void';
  `);
  return rows.length ? Number(rows[0].scanCount || 0) : 0;
}

async function importEnvelopeScan(_event, jobIdValue, subjectIdValue, hotFolderValue) {
  const jobId = numericId(jobIdValue);
  const subjectId = numericId(subjectIdValue);
  const hotFolder = resolveWorkspacePath(hotFolderValue || 'EnvelopeHotFolder');
  return importEnvelopeScanCore(jobId, subjectId, hotFolder);
}

function closeEnvelopeWatcher(webContentsId) {
  const watcherState = envelopeWatchers.get(webContentsId);
  if (!watcherState) {
    return;
  }
  clearTimeout(watcherState.timer);
  watcherState.watcher.close();
  envelopeWatchers.delete(webContentsId);
}

async function startEnvelopeWatcher(event, jobIdValue, subjectIdValue, hotFolderValue) {
  const jobId = numericId(jobIdValue);
  const subjectId = numericId(subjectIdValue);
  const hotFolder = resolveWorkspacePath(hotFolderValue || 'EnvelopeHotFolder');
  if (!fs.existsSync(hotFolder)) {
    fs.mkdirSync(hotFolder, { recursive: true });
  }

  const webContentsId = event.sender.id;
  closeEnvelopeWatcher(webContentsId);

  const watcherState = {
    jobId,
    subjectId,
    hotFolder,
    timer: null,
    importing: false,
    lastImportAt: 0,
    pendingSourcePath: null,
    watcher: null
  };

  const importLatest = (quietWhenEmpty = false) => {
    clearTimeout(watcherState.timer);
    watcherState.timer = setTimeout(async () => {
      if (watcherState.importing || !event.sender || event.sender.isDestroyed()) {
        return;
      }
      if (Date.now() - watcherState.lastImportAt < 1800) {
        return;
      }
      watcherState.importing = true;
      try {
        const sourcePath = latestImageInFolder(hotFolder);
        const scanCount = await envelopeScanCount(jobId, subjectId);
        if (scanCount > 0) {
          if (watcherState.pendingSourcePath === sourcePath) {
            return;
          }
          watcherState.pendingSourcePath = sourcePath;
          if (!event.sender.isDestroyed()) {
            event.sender.send('envelope:scan-imported', {
              pending: {
                subjectId,
                filename: path.basename(sourcePath),
                scanCount
              }
            });
          }
          return;
        }

        const result = await importEnvelopeScanCore(jobId, subjectId, hotFolder, sourcePath);
        watcherState.lastImportAt = Date.now();
        if (!event.sender.isDestroyed()) {
          event.sender.send('envelope:scan-imported', result);
        }
      } catch (error) {
        if (quietWhenEmpty && /No JPG\/PNG envelope scans/.test(error.message || '')) {
          return;
        }
        if (!event.sender.isDestroyed()) {
          event.sender.send('envelope:scan-imported', {
            error: error.message || 'Envelope scan import failed'
          });
        }
      } finally {
        watcherState.importing = false;
      }
    }, 900);
  };

  watcherState.watcher = fs.watch(hotFolder, (eventType) => {
    if (eventType === 'rename' || eventType === 'change') {
      importLatest();
    }
  });
  envelopeWatchers.set(webContentsId, watcherState);
  event.sender.once('destroyed', () => closeEnvelopeWatcher(webContentsId));
  if (fs.readdirSync(hotFolder).some((name) => ['.jpg', '.jpeg', '.png'].includes(path.extname(name).toLowerCase()))) {
    importLatest(true);
  }

  return {
    jobId,
    subjectId,
    hotFolder
  };
}

async function confirmEnvelopeScan(event, acceptValue) {
  const webContentsId = event.sender.id;
  const watcherState = envelopeWatchers.get(webContentsId);
  if (!watcherState || !watcherState.pendingSourcePath) {
    return { accepted: false };
  }

  const pendingSourcePath = watcherState.pendingSourcePath;
  watcherState.pendingSourcePath = null;
  if (!acceptValue) {
    return { accepted: false };
  }

  watcherState.importing = true;
  try {
    const result = await importEnvelopeScanCore(
      watcherState.jobId,
      watcherState.subjectId,
      watcherState.hotFolder,
      pendingSourcePath
    );
    watcherState.lastImportAt = Date.now();
    return { accepted: true, ...result };
  } finally {
    watcherState.importing = false;
  }
}

async function stopEnvelopeWatcher(event) {
  closeEnvelopeWatcher(event.sender.id);
  return { stopped: true };
}

function normalizePaidStatus(value) {
  const status = String(value || 'unknown').trim();
  const allowed = new Set(['paid', 'unpaid', 'unknown']);
  if (!allowed.has(status)) {
    throw new Error('Invalid payment status');
  }
  return status;
}

function orderCodesFromInput(value) {
  const raw = String(value || '').trim();
  if (!raw) {
    throw new Error('Order codes are required');
  }
  if (raw.length > 500) {
    throw new Error('Order codes are too long');
  }
  const codes = raw.split('.').map((code) => code.trim()).filter(Boolean);
  if (!codes.length) {
    throw new Error('Order codes are required');
  }
  return { raw, codes };
}

async function createEnvelopeOrder(_event, jobIdValue, subjectIdValue, input = {}) {
  const jobId = numericId(jobIdValue);
  const subjectId = numericId(subjectIdValue);
  const envelopeScanId = input.envelopeScanId ? numericId(input.envelopeScanId) : null;
  const paidStatus = normalizePaidStatus(input.paidStatus);
  const notes = normalizeNotes(input.notes);
  const { raw, codes } = orderCodesFromInput(input.orderCodes);

  return writeSql((database) => {
    const subjectRows = rowsFromDatabase(database, `
      SELECT id, primary_image_asset_id AS primaryImageAssetId
      FROM subjects
      WHERE id = ${subjectId}
        AND job_id = ${jobId};
    `);
    if (!subjectRows.length) {
      throw new Error('Student does not belong to this job');
    }

    if (envelopeScanId) {
      const scanRows = rowsFromDatabase(database, `
        SELECT id
        FROM envelope_scans
        WHERE id = ${envelopeScanId}
          AND job_id = ${jobId}
          AND subject_id = ${subjectId};
      `);
      if (!scanRows.length) {
        throw new Error('Envelope scan does not belong to this student');
      }
    }

    const renderStatus = subjectRows[0].primaryImageAssetId ? 'ready' : 'not_ready';
    const orderStatement = database.prepare(`
      INSERT INTO orders (
        job_id,
        subject_id,
        source,
        entry_timing,
        status,
        paid_status,
        render_status,
        notes
      )
      VALUES (?, ?, 'paper', 'unknown', 'open', ?, ?, ?);
    `);

    try {
      orderStatement.run([jobId, subjectId, paidStatus, renderStatus, notes]);
    } finally {
      orderStatement.free();
    }

    const orderRows = rowsFromDatabase(database, 'SELECT last_insert_rowid() AS id;');
    const orderId = orderRows[0].id;
    const itemStatement = database.prepare(`
      INSERT INTO order_items (
        order_id,
        subject_id,
        package_code,
        quantity,
        raw_code,
        status,
        notes
      )
      VALUES (?, ?, ?, 1, ?, 'open', ?);
    `);

    try {
      codes.forEach((code) => {
        itemStatement.run([orderId, subjectId, code, raw, 'Envelope scan keyed order']);
      });
    } finally {
      itemStatement.free();
    }

    if (envelopeScanId) {
      database.run(`
        UPDATE envelope_scans
        SET order_id = ?,
            keyed_order_code = ?,
            status = 'order_created',
            keyed_at = CURRENT_TIMESTAMP,
            notes = COALESCE(NULLIF(?, ''), notes)
        WHERE id = ?;
      `, [orderId, raw, notes, envelopeScanId]);
    }

    return {
      orderId,
      subjectId,
      itemCount: codes.length
    };
  });
}

async function getOrderEnvelopePreview(_event, orderIdValue) {
  const orderId = numericId(orderIdValue);
  const rows = await querySql(`
    SELECT
      es.id,
      es.scan_path AS scanPath,
      es.envelope_identifier AS envelopeIdentifier,
      es.keyed_order_code AS keyedOrderCode,
      es.scanned_at AS scannedAt,
      o.source,
      s.legacy_ref_num AS ref,
      COALESCE(s.display_name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS subjectName
    FROM orders o
    LEFT JOIN subjects s ON s.id = o.subject_id
    LEFT JOIN envelope_scans es ON es.order_id = o.id
    WHERE o.id = ${orderId}
    ORDER BY es.id DESC
    LIMIT 1;
  `);

  if (!rows.length) {
    throw new Error('Order not found');
  }

  const row = rows[0];
  if (!row.scanPath) {
    return {
      orderId,
      missing: true,
      reason: row.source === 'paper' ? 'No envelope scan is linked to this paper order.' : 'This is not a scanned paper order.',
      ref: row.ref,
      subjectName: row.subjectName
    };
  }

  const fullPath = resolveProjectPath(row.scanPath);
  if (!fullPath || !fs.existsSync(fullPath)) {
    return {
      orderId,
      missing: true,
      reason: 'Envelope image file is missing.',
      path: fullPath,
      filename: path.basename(row.scanPath),
      ref: row.ref,
      subjectName: row.subjectName
    };
  }

  return {
    orderId,
    id: row.id,
    ref: row.ref,
    subjectName: row.subjectName,
    filename: path.basename(fullPath),
    path: fullPath,
    scannedAt: row.scannedAt,
    keyedOrderCode: row.keyedOrderCode,
    dataUrl: imageDataUrl(fullPath),
    missing: false
  };
}

async function getEnvelopeScanPreview(_event, scanIdValue) {
  const scanId = numericId(scanIdValue);
  const rows = await querySql(`
    SELECT
      es.id,
      es.job_id AS jobId,
      es.subject_id AS subjectId,
      es.order_id AS orderId,
      es.scan_path AS scanPath,
      es.envelope_identifier AS envelopeIdentifier,
      es.keyed_order_code AS keyedOrderCode,
      es.status,
      es.scanned_at AS scannedAt,
      s.legacy_ref_num AS ref,
      COALESCE(s.display_name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS subjectName
    FROM envelope_scans es
    LEFT JOIN subjects s ON s.id = es.subject_id
    WHERE es.id = ${scanId}
    LIMIT 1;
  `);

  if (!rows.length) {
    throw new Error('Envelope scan not found');
  }

  const row = rows[0];
  const fullPath = resolveProjectPath(row.scanPath);
  if (!fullPath || !fs.existsSync(fullPath)) {
    return {
      ...row,
      missing: true,
      reason: 'Envelope image file is missing.',
      filename: row.scanPath ? path.basename(row.scanPath) : ''
    };
  }

  return {
    ...row,
    filename: path.basename(fullPath),
    path: fullPath,
    dataUrl: imageDataUrl(fullPath),
    missing: false
  };
}

async function getUnlinkedEnvelopeScans(_event, jobIdValue) {
  const jobId = numericId(jobIdValue);
  return querySql(`
    SELECT
      es.id,
      es.subject_id AS subjectId,
      es.scan_path AS scanPath,
      es.envelope_identifier AS envelopeIdentifier,
      es.keyed_order_code AS keyedOrderCode,
      es.status,
      es.scanned_at AS scannedAt,
      s.legacy_ref_num AS ref,
      COALESCE(s.display_name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS subjectName
    FROM envelope_scans es
    LEFT JOIN subjects s ON s.id = es.subject_id
    WHERE es.job_id = ${jobId}
      AND es.order_id IS NULL
      AND es.status != 'void'
    ORDER BY es.scanned_at DESC, es.id DESC
    LIMIT 100;
  `);
}

async function assignEnvelopeScan(_event, scanIdValue, subjectIdValue) {
  const scanId = numericId(scanIdValue);
  const subjectId = numericId(subjectIdValue);

  return writeSql((database) => {
    const rows = rowsFromDatabase(database, `
      SELECT
        es.id,
        es.job_id AS jobId,
        es.order_id AS orderId,
        es.scan_path AS scanPath,
        es.status,
        s.id AS subjectId,
        s.legacy_ref_num AS ref,
        j.root_path AS rootPath,
        COALESCE(s.display_name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS subjectName
      FROM envelope_scans es
      JOIN subjects s ON s.id = ${subjectId}
      JOIN jobs j ON j.id = s.job_id
      WHERE es.id = ${scanId}
        AND es.job_id = s.job_id
      LIMIT 1;
    `);

    if (!rows.length) {
      throw new Error('Envelope scan and student must belong to the same job');
    }

    const row = rows[0];
    if (row.orderId) {
      throw new Error('This envelope is already linked to an order');
    }
    if (row.status === 'void') {
      throw new Error('This envelope has already been deleted');
    }

    const sourcePath = resolveProjectPath(row.scanPath);
    if (!sourcePath || !fs.existsSync(sourcePath)) {
      throw new Error('Envelope image file is missing');
    }

    const jobRoot = resolveWorkspacePath(row.rootPath);
    const envelopeFolder = path.join(jobRoot, 'Envelopes');
    fs.mkdirSync(envelopeFolder, { recursive: true });

    const prefix = String(row.ref || 'unknown').replace(/[<>:"/\\|?*\x00-\x1F]/g, '-');
    const sourceFolder = path.resolve(path.dirname(sourcePath));
    const destinationFolder = path.resolve(envelopeFolder);
    let destinationPath = sourcePath;
    if (sourceFolder !== destinationFolder || !path.basename(sourcePath).toLowerCase().startsWith(`${prefix.toLowerCase()}-`)) {
      const filename = envelopeDestinationName(row.ref, sourcePath);
      destinationPath = uniquePath(envelopeFolder, filename);
      moveFile(sourcePath, destinationPath);
    }

    const relativeDestination = path.relative(projectRoot, destinationPath);
    const statement = database.prepare(`
      UPDATE envelope_scans
      SET subject_id = ?,
          scan_path = ?,
          envelope_identifier = ?,
          status = 'scanned',
          notes = ?
      WHERE id = ?
        AND order_id IS NULL
        AND status != 'void';
    `);

    try {
      statement.run([
        subjectId,
        relativeDestination,
        row.ref,
        `Assigned to ${row.ref}`,
        scanId
      ]);
    } finally {
      statement.free();
    }

    return {
      scan: {
        id: scanId,
        subjectId,
        path: relativeDestination,
        filename: path.basename(destinationPath),
        dataUrl: imageDataUrl(destinationPath),
        ref: row.ref,
        subjectName: row.subjectName
      }
    };
  });
}

async function deleteEnvelopeScan(_event, scanIdValue) {
  const scanId = numericId(scanIdValue);

  return writeSql((database) => {
    const rows = rowsFromDatabase(database, `
      SELECT id, order_id AS orderId, scan_path AS scanPath, status
      FROM envelope_scans
      WHERE id = ${scanId}
      LIMIT 1;
    `);

    if (!rows.length) {
      throw new Error('Envelope scan not found');
    }

    const row = rows[0];
    if (row.orderId) {
      throw new Error('Cannot delete an envelope that is linked to an order');
    }

    const fullPath = resolveProjectPath(row.scanPath);
    database.run('DELETE FROM envelope_scans WHERE id = ? AND order_id IS NULL;', [scanId]);
    if (fullPath && fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    return { id: scanId, deleted: true };
  });
}

ipcMain.handle('envelope:find-subject', findSubjectByBarcode);
ipcMain.handle('envelope:search-subjects', searchEnvelopeSubjects);
ipcMain.handle('envelope:start-watcher', startEnvelopeWatcher);
ipcMain.handle('envelope:stop-watcher', stopEnvelopeWatcher);
ipcMain.handle('envelope:confirm-scan', confirmEnvelopeScan);
ipcMain.handle('envelope:order-preview', getOrderEnvelopePreview);
ipcMain.handle('envelope:scan-preview', getEnvelopeScanPreview);
ipcMain.handle('envelope:unlinked-list', getUnlinkedEnvelopeScans);
ipcMain.handle('envelope:assign-scan', assignEnvelopeScan);
ipcMain.handle('envelope:delete-scan', deleteEnvelopeScan);
ipcMain.handle('envelope:create-order', createEnvelopeOrder);

function captureDestinationName(ref, sourcePath) {
  return envelopeDestinationName(ref, sourcePath);
}

function closeCaptureWatcher(webContentsId) {
  const watcherState = captureWatchers.get(webContentsId);
  if (!watcherState) {
    return;
  }
  clearTimeout(watcherState.timer);
  watcherState.watcher.close();
  captureWatchers.delete(webContentsId);
}

async function importCaptureImageCore(jobId, subjectId, hotFolder, explicitSourcePath = null, explicitRawPath = null, options = {}) {
  const pair = explicitSourcePath
    ? { imagePath: explicitSourcePath, rawPath: explicitRawPath, ready: true }
    : latestCapturePairInFolder(hotFolder, options);
  if (!pair.ready) {
    throw new Error(pair.reason || 'Waiting for complete capture pair');
  }
  const sourcePath = pair.imagePath;
  const rawSourcePath = pair.rawPath;

  const result = await writeSql((database) => {
    const rows = rowsFromDatabase(database, `
      SELECT
        s.id AS subjectId,
        s.legacy_ref_num AS ref,
        s.primary_image_asset_id AS previousPrimaryImageId,
        j.id AS jobId,
        j.root_path AS rootPath
      FROM subjects s
      JOIN jobs j ON j.id = s.job_id
      WHERE s.id = ${subjectId}
        AND j.id = ${jobId};
    `);

    if (!rows.length) {
      throw new Error('Student does not belong to this job');
    }

    const row = rows[0];
    const jobRoot = resolveWorkspacePath(row.rootPath);
    const imageFolder = path.join(jobRoot, 'Images');
    fs.mkdirSync(imageFolder, { recursive: true });
    const filename = captureDestinationName(row.ref, sourcePath);
    const destinationPath = uniquePath(imageFolder, filename);
    moveFile(sourcePath, destinationPath);
    const relativeDestination = path.relative(projectRoot, destinationPath);
    let relativeRawDestination = null;
    if (rawSourcePath && fs.existsSync(rawSourcePath)) {
      const rawDestinationName = `${path.basename(destinationPath, path.extname(destinationPath))}${path.extname(rawSourcePath) || '.CR3'}`;
      const rawDestinationPath = uniquePath(imageFolder, rawDestinationName);
      moveFile(rawSourcePath, rawDestinationPath);
      relativeRawDestination = path.relative(projectRoot, rawDestinationPath);
    }

    let imageId = null;
    const imageStatement = database.prepare(`
      INSERT INTO image_assets (
        job_id,
        original_path,
        current_path,
        filename,
        source,
        status,
        captured_at,
        metadata_json
      )
      VALUES (?, ?, ?, ?, 'capture_hot_folder', 'imported', CURRENT_TIMESTAMP, ?);
    `);

    try {
      imageStatement.run([
        jobId,
        relativeDestination,
        relativeDestination,
        path.basename(destinationPath),
        JSON.stringify({
          rawPath: relativeRawDestination
        })
      ]);
      imageId = rowsFromDatabase(database, 'SELECT last_insert_rowid() AS id;')[0].id;
    } finally {
      imageStatement.free();
    }

    const versionStatement = database.prepare(`
      INSERT INTO image_versions (
        image_asset_id,
        version_type,
        path
      )
      VALUES (?, 'original', ?);
    `);

    try {
      versionStatement.run([imageId, relativeDestination]);
    } finally {
      versionStatement.free();
    }

    const previousPrimaryImageId = row.previousPrimaryImageId ? Number(row.previousPrimaryImageId) : null;
    database.run(`
      DELETE FROM subject_images
      WHERE subject_id = ?
        AND selected = 0
        AND image_asset_id != ?;
    `, [subjectId, previousPrimaryImageId || -1]);

    database.run(`
      UPDATE subject_images
      SET selected = 0
      WHERE subject_id = ?;
    `, [subjectId]);

    if (previousPrimaryImageId) {
      database.run(`
        INSERT OR IGNORE INTO subject_images (
          subject_id,
          image_asset_id,
          role,
          selected,
          sort_order
        )
        VALUES (?, ?, 'capture', 0, 1);
      `, [subjectId, previousPrimaryImageId]);
      database.run(`
        UPDATE subject_images
        SET selected = 0,
            sort_order = 1
        WHERE subject_id = ?
          AND image_asset_id = ?;
      `, [subjectId, previousPrimaryImageId]);
    }

    database.run(`
      INSERT OR IGNORE INTO subject_images (
        subject_id,
        image_asset_id,
        role,
        selected,
        sort_order
      )
      VALUES (?, ?, 'capture', 1, 0);
    `, [subjectId, imageId]);

    database.run(`
      UPDATE subject_images
      SET selected = 1,
          sort_order = 0
      WHERE subject_id = ?
        AND image_asset_id = ?;
    `, [subjectId, imageId]);

    database.run(`
      UPDATE subjects
      SET primary_image_asset_id = ?,
          photographed_status = 'photographed',
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?;
    `, [imageId, subjectId]);

    return {
      image: {
        id: imageId,
        subjectId,
        ref: row.ref,
        filename: path.basename(destinationPath),
        rawPath: relativeRawDestination,
        path: relativeDestination,
        dataUrl: imageDataUrl(destinationPath),
        rotationDegrees: 0,
        selected: true
      }
    };
  });

  result.localCaptureDatabasePath = await appendLocalCaptureEvent({
    jobId,
    subjectId,
    imageAssetId: result.image.id,
    ref: result.image.ref,
    jpgPath: result.image.path,
    cr3Path: result.image.rawPath,
    filename: result.image.filename
  });
  result.jobDatabasePath = await writeJobDatabaseSnapshot(jobId);
  return result;
}

async function startCaptureWatcher(event, jobIdValue, subjectIdValue, options = {}) {
  const jobId = numericId(jobIdValue);
  const subjectId = numericId(subjectIdValue);
  const fileMode = normalizeCaptureFileMode(options.fileMode);
  const hotFolder = resolveWorkspacePath('CaptureHotFolder');
  if (!fs.existsSync(hotFolder)) {
    fs.mkdirSync(hotFolder, { recursive: true });
  }

  const webContentsId = event.sender.id;
  closeCaptureWatcher(webContentsId);

  const watcherState = {
    jobId,
    subjectId,
    hotFolder,
    timer: null,
    importing: false,
    lastImportAt: 0,
    lastSourcePath: null,
    fileMode,
    watcher: null
  };

  const importLatest = (quietWhenEmpty = false) => {
    clearTimeout(watcherState.timer);
    watcherState.timer = setTimeout(async () => {
      if (watcherState.importing || !event.sender || event.sender.isDestroyed()) {
        return;
      }
      if (Date.now() - watcherState.lastImportAt < 1200) {
        return;
      }
      watcherState.importing = true;
      try {
        const pair = latestCapturePairInFolder(hotFolder, { fileMode: watcherState.fileMode });
        if (!pair.ready) {
          if (!event.sender.isDestroyed()) {
            event.sender.send('capture:image-imported', {
              status: {
                ready: false,
                message: pair.reason || 'Waiting for capture pair',
                filename: pair.filename || '',
                fileMode: watcherState.fileMode
              }
            });
          }
          importLatest();
          return;
        }
        const sourcePath = pair.imagePath;
        if (watcherState.lastSourcePath === sourcePath) {
          return;
        }
        const result = await importCaptureImageCore(jobId, subjectId, hotFolder, sourcePath, pair.rawPath, {
          fileMode: watcherState.fileMode
        });
        watcherState.lastSourcePath = sourcePath;
        watcherState.lastImportAt = Date.now();
        if (!event.sender.isDestroyed()) {
          event.sender.send('capture:image-imported', {
            ...result,
            status: {
              ready: true,
              message: 'Ready',
              filename: result.image.filename,
              fileMode: watcherState.fileMode
            }
          });
        }
      } catch (error) {
        if (quietWhenEmpty && /No JPG\/PNG envelope scans/.test(error.message || '')) {
          if (!event.sender.isDestroyed()) {
            event.sender.send('capture:image-imported', {
              status: {
                ready: true,
                message: 'Ready'
              }
            });
          }
          return;
        }
        if (!event.sender.isDestroyed()) {
          event.sender.send('capture:image-imported', {
            error: error.message || 'Image capture import failed'
          });
        }
      } finally {
        watcherState.importing = false;
      }
    }, 700);
  };

  watcherState.watcher = fs.watch(hotFolder, (eventType) => {
    if (eventType === 'rename' || eventType === 'change') {
      importLatest();
    }
  });
  captureWatchers.set(webContentsId, watcherState);
  event.sender.once('destroyed', () => closeCaptureWatcher(webContentsId));
  if (fs.readdirSync(hotFolder).some((name) => ['.jpg', '.jpeg', '.png'].includes(path.extname(name).toLowerCase()))) {
    importLatest(true);
  }

  return {
    jobId,
    subjectId,
    hotFolder,
    fileMode
  };
}

async function stopCaptureWatcher(event) {
  closeCaptureWatcher(event.sender.id);
  return { stopped: true };
}

async function getCaptureSubjectImages(_event, subjectIdValue) {
  const subjectId = numericId(subjectIdValue);
  const rows = await querySql(`
    SELECT
      ia.id,
      ia.filename,
      ia.current_path AS currentPath,
      ia.source,
      ia.status,
      ia.captured_at AS capturedAt,
      ia.metadata_json AS metadataJson,
      MAX(si.selected) AS selected,
      MIN(si.sort_order) AS sortOrder,
      COALESCE(
        MAX(CASE WHEN iv.version_type = 'chosen' THEN iv.path ELSE NULL END),
        MAX(CASE WHEN iv.version_type = 'cropped_med' THEN iv.path ELSE NULL END),
        MAX(CASE WHEN iv.version_type = 'cropped_large' THEN iv.path ELSE NULL END),
        MAX(CASE WHEN iv.version_type = 'original' THEN iv.path ELSE NULL END),
        ia.current_path
      ) AS versionPath
    FROM subject_images si
    JOIN image_assets ia ON ia.id = si.image_asset_id
    LEFT JOIN image_versions iv ON iv.image_asset_id = ia.id
    WHERE si.subject_id = ${subjectId}
    GROUP BY ia.id
    ORDER BY ia.id DESC
    LIMIT 2;
  `);

  return rows.map((row) => {
    const fullPath = resolveProjectPath(row.versionPath || row.currentPath);
    let metadata = {};
    try {
      metadata = row.metadataJson ? JSON.parse(row.metadataJson) : {};
    } catch (_error) {
      metadata = {};
    }
    return {
      ...row,
      rawPath: metadata.rawPath || null,
      rotationDegrees: Number(metadata.rotationDegrees || 0),
      path: fullPath,
      dataUrl: fullPath && fs.existsSync(fullPath) ? imageDataUrl(fullPath) : null,
      missing: !fullPath || !fs.existsSync(fullPath)
    };
  });
}

async function selectCaptureImage(_event, subjectIdValue, imageIdValue) {
  const subjectId = numericId(subjectIdValue);
  const imageId = numericId(imageIdValue);

  const result = await writeSql((database) => {
    const match = database.exec(`
      SELECT s.id AS subjectId, s.job_id AS subjectJobId, ia.id AS imageId, ia.job_id AS imageJobId
      FROM subjects s
      JOIN image_assets ia ON ia.id = ${imageId}
      WHERE s.id = ${subjectId}
        AND s.job_id = ia.job_id;
    `);

    if (!match.length || !match[0].values.length) {
      throw new Error('Student and image must belong to the same job');
    }

    database.run(`
      INSERT OR IGNORE INTO subject_images (
        subject_id,
        image_asset_id,
        role,
        selected,
        sort_order
      )
      VALUES (?, ?, 'capture', 0, 0);
    `, [subjectId, imageId]);

    database.run(`
      UPDATE subject_images
      SET selected = 0
      WHERE subject_id = ?;
    `, [subjectId]);

    database.run(`
      UPDATE subject_images
      SET selected = 1,
          sort_order = 0
      WHERE subject_id = ?
        AND image_asset_id = ?;
    `, [subjectId, imageId]);

    database.run(`
      UPDATE subjects
      SET primary_image_asset_id = ?,
          photographed_status = 'photographed',
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?;
    `, [imageId, subjectId]);

    const rows = rowsFromDatabase(database, `
      SELECT s.job_id AS jobId
      FROM subjects s
      WHERE s.id = ${subjectId};
    `);

    return { subjectId, imageId, jobId: rows[0].jobId };
  });

  result.localCaptureDatabasePath = await updateLocalCaptureSelection(result.jobId, subjectId, imageId);
  result.jobDatabasePath = await writeJobDatabaseSnapshot(result.jobId);
  return result;
}

ipcMain.handle('capture:start-watcher', startCaptureWatcher);
ipcMain.handle('capture:stop-watcher', stopCaptureWatcher);
ipcMain.handle('capture:subject-images', getCaptureSubjectImages);
ipcMain.handle('capture:select-image', selectCaptureImage);

async function linkSubjectImage(_event, subjectIdValue, imageIdValue) {
  const subjectId = numericId(subjectIdValue);
  const imageId = numericId(imageIdValue);

  return writeSql((database) => {
    const match = database.exec(`
      SELECT s.id AS subjectId, s.job_id AS subjectJobId, ia.id AS imageId, ia.job_id AS imageJobId
      FROM subjects s
      JOIN image_assets ia ON ia.id = ${imageId}
      WHERE s.id = ${subjectId}
        AND s.job_id = ia.job_id;
    `);

    if (!match.length || !match[0].values.length) {
      throw new Error('Subject and image must belong to the same job');
    }

    database.run(`
      UPDATE subject_images
      SET selected = 0
      WHERE subject_id = ?;
    `, [subjectId]);

    database.run(`
      INSERT OR IGNORE INTO subject_images (
        subject_id,
        image_asset_id,
        role,
        selected,
        sort_order
      )
      VALUES (?, ?, 'primary', 1, 0);
    `, [subjectId, imageId]);

    database.run(`
      UPDATE subject_images
      SET selected = 1
      WHERE subject_id = ?
        AND image_asset_id = ?;
    `, [subjectId, imageId]);

    database.run(`
      UPDATE subjects
      SET primary_image_asset_id = ?,
          photographed_status = 'photographed',
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?;
    `, [imageId, subjectId]);

    return { subjectId, imageId };
  });
}

ipcMain.handle('image:link-subject', linkSubjectImage);

function resolveProjectPath(filePath) {
  if (!filePath) {
    return null;
  }

  return path.isAbsolute(filePath) ? filePath : path.join(projectRoot, filePath);
}

function mimeTypeFor(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === '.png') {
    return 'image/png';
  }
  return 'image/jpeg';
}

async function getImagePreview(_event, imageIdValue) {
  const imageId = numericId(imageIdValue);
  const rows = await querySql(`
    SELECT
      ia.filename,
      iv.path,
      iv.width,
      iv.height,
      iv.version_type AS versionType
    FROM image_assets ia
    JOIN image_versions iv ON iv.image_asset_id = ia.id
    WHERE ia.id = ${imageId}
    ORDER BY
      CASE iv.version_type
        WHEN 'chosen' THEN 1
        WHEN 'cropped_med' THEN 2
        WHEN 'cropped_large' THEN 3
        WHEN 'original' THEN 4
        ELSE 5
      END
    LIMIT 1;
  `);

  if (!rows.length) {
    return null;
  }

  const row = rows[0];
  const fullPath = resolveProjectPath(row.path);
  if (!fullPath || !fs.existsSync(fullPath)) {
    return { ...row, dataUrl: null, missing: true };
  }

  const bytes = fs.readFileSync(fullPath);
  return {
    ...row,
    path: fullPath,
    dataUrl: `data:${mimeTypeFor(fullPath)};base64,${bytes.toString('base64')}`,
    missing: false
  };
}

ipcMain.handle('image:preview', getImagePreview);

function createWindow() {
  logStartup('createWindow');
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 1080,
    minHeight: 720,
    backgroundColor: '#f4f6f8',
    title: 'TRECS',
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
    logStartup(`did-fail-load ${errorCode} ${errorDescription}`);
  });
  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
}

app.whenReady().then(async () => {
  logStartup(`whenReady projectRoot=${projectRoot} appSourceRoot=${appSourceRoot}`);
  await ensurePrototypeDatabaseShape();
  logStartup('database ready');
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}).catch((error) => {
  logStartup('whenReady failed', error);
  app.quit();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
