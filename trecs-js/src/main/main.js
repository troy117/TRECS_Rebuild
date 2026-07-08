const { app, BrowserWindow, ipcMain } = require('electron');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const initSqlJs = require('sql.js');

const projectRoot = path.resolve(__dirname, '../../..');
const prototypeDatabasePath = path.join(projectRoot, 'database', 'migration_prototype.db');
const sqlWasmPath = path.join(projectRoot, 'trecs-js', 'node_modules', 'sql.js', 'dist');

let sqlModulePromise;

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

async function ensurePrototypeDatabaseShape() {
  const SQL = await getSqlModule();
  const databaseBytes = fs.readFileSync(prototypeDatabasePath);
  const database = new SQL.Database(databaseBytes);

  try {
    const jobColumns = rowsFromDatabase(database, 'PRAGMA table_info(jobs);')
      .map((column) => column.name);

    let changed = false;
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
  const SQL = await getSqlModule();
  const databaseBytes = fs.readFileSync(prototypeDatabasePath);
  const sourceDatabase = new SQL.Database(databaseBytes);

  try {
    const jobs = rowsFromDatabase(sourceDatabase, `
      SELECT
        j.id,
        j.legacy_id AS legacyId,
        j.reference_number AS referenceNumber,
        j.name,
        j.type,
        j.status,
        j.package_plan_id AS packagePlanId,
        p.name AS packagePlanName,
        c.display_name AS clientName,
        c.trecs_name AS trecsName,
        j.root_path AS rootPath,
        j.shoot_date AS shootDate,
        j.retake_date AS retakeDate,
        j.notes
      FROM jobs j
      JOIN clients c ON c.id = j.client_id
      LEFT JOIN package_plans p ON p.id = j.package_plan_id
      WHERE j.id = ${jobId};
    `);

    if (!jobs.length) {
      throw new Error('Job not found');
    }

    const job = jobs[0];
    const subjects = rowsFromDatabase(sourceDatabase, `
      SELECT
        id,
        job_id AS jobId,
        legacy_ref_num AS legacyRefNum,
        subject_type AS subjectType,
        first_name AS firstName,
        last_name AS lastName,
        display_name AS displayName,
        external_id AS externalId,
        grade,
        homeroom,
        track,
        team,
        photographed_status AS photographedStatus,
        notes
      FROM subjects
      WHERE job_id = ${jobId}
      ORDER BY legacy_ref_num;
    `);
    const subjectCodes = rowsFromDatabase(sourceDatabase, `
      SELECT
        sc.id,
        sc.subject_id AS subjectId,
        sc.code_type AS codeType,
        sc.code
      FROM subject_codes sc
      JOIN subjects s ON s.id = sc.subject_id
      WHERE s.job_id = ${jobId}
      ORDER BY sc.code_type, sc.code;
    `);
    const subjectGroups = rowsFromDatabase(sourceDatabase, `
      SELECT
        id,
        job_id AS jobId,
        name,
        group_type AS groupType
      FROM subject_groups
      WHERE job_id = ${jobId}
      ORDER BY group_type, name;
    `);
    const subjectGroupMembers = rowsFromDatabase(sourceDatabase, `
      SELECT
        sgm.id,
        sgm.group_id AS groupId,
        sgm.subject_id AS subjectId,
        sgm.sort_order AS sortOrder
      FROM subject_group_members sgm
      JOIN subject_groups sg ON sg.id = sgm.group_id
      WHERE sg.job_id = ${jobId}
      ORDER BY sgm.group_id, sgm.sort_order;
    `);
    const orders = rowsFromDatabase(sourceDatabase, `
      SELECT
        id,
        job_id AS jobId,
        subject_id AS subjectId,
        family_key AS familyKey,
        source,
        source_reference AS sourceReference,
        entry_timing AS entryTiming,
        status,
        paid_status AS paidStatus,
        render_status AS renderStatus,
        notes
      FROM orders
      WHERE job_id = ${jobId}
      ORDER BY id;
    `);
    const orderItems = rowsFromDatabase(sourceDatabase, `
      SELECT
        oi.id,
        oi.order_id AS orderId,
        oi.subject_id AS subjectId,
        oi.package_plan_id AS packagePlanId,
        oi.package_code AS packageCode,
        oi.product_id AS productId,
        oi.quantity,
        oi.raw_code AS rawCode,
        oi.status,
        oi.notes
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE o.job_id = ${jobId}
      ORDER BY oi.order_id, oi.id;
    `);

    const createdAt = new Date();
    const sessionUuid = crypto.randomUUID();
    const workstation = process.env.COMPUTERNAME || os.hostname();
    const packageName = `${safeFolderName(`${job.trecsName}-${job.name}`)}-${timestampForFolder(createdAt)}`;
    const packagePath = path.join(projectRoot, 'exports', 'laptop-packages', packageName);
    const hotFolderPath = path.join(packagePath, 'HotFolder');
    const imagesPath = path.join(packagePath, 'Images');
    const exportsPath = path.join(packagePath, 'Exports');
    const databasePath = path.join(packagePath, 'capture.db');
    const manifestPath = path.join(packagePath, 'session-manifest.json');

    fs.mkdirSync(hotFolderPath, { recursive: true });
    fs.mkdirSync(imagesPath, { recursive: true });
    fs.mkdirSync(exportsPath, { recursive: true });

    const captureDatabase = new SQL.Database();
    try {
      createCapturePackageSchema(captureDatabase);
      captureDatabase.run('BEGIN TRANSACTION');
      insertRows(captureDatabase, 'package_manifest', ['key', 'value'], [
        { key: 'session_uuid', value: sessionUuid },
        { key: 'source_job_id', value: String(job.id) },
        { key: 'created_at', value: createdAt.toISOString() },
        { key: 'workstation', value: workstation },
        { key: 'package_type', value: 'capture_laptop' }
      ]);
      insertRows(captureDatabase, 'jobs', [
        'id',
        'legacy_id',
        'reference_number',
        'name',
        'type',
        'status',
        'package_plan_id',
        'package_plan_name',
        'client_name',
        'trecs_name',
        'root_path',
        'shoot_date',
        'retake_date',
        'notes'
      ], jobs);
      insertRows(captureDatabase, 'subjects', [
        'id',
        'job_id',
        'legacy_ref_num',
        'subject_type',
        'first_name',
        'last_name',
        'display_name',
        'external_id',
        'grade',
        'homeroom',
        'track',
        'team',
        'photographed_status',
        'notes'
      ], subjects);
      insertRows(captureDatabase, 'subject_codes', ['id', 'subject_id', 'code_type', 'code'], subjectCodes);
      insertRows(captureDatabase, 'subject_groups', ['id', 'job_id', 'name', 'group_type'], subjectGroups);
      insertRows(captureDatabase, 'subject_group_members', ['id', 'group_id', 'subject_id', 'sort_order'], subjectGroupMembers);
      insertRows(captureDatabase, 'orders', [
        'id',
        'job_id',
        'subject_id',
        'family_key',
        'source',
        'source_reference',
        'entry_timing',
        'status',
        'paid_status',
        'render_status',
        'notes'
      ], orders);
      insertRows(captureDatabase, 'order_items', [
        'id',
        'order_id',
        'subject_id',
        'package_plan_id',
        'package_code',
        'product_id',
        'quantity',
        'raw_code',
        'status',
        'notes'
      ], orderItems);
      captureDatabase.run('COMMIT');
      fs.writeFileSync(databasePath, Buffer.from(captureDatabase.export()));
    } catch (error) {
      try {
        captureDatabase.run('ROLLBACK');
      } catch (_rollbackError) {
        // Keep the original export error.
      }
      throw error;
    } finally {
      captureDatabase.close();
    }

    const manifest = {
      packageType: 'capture_laptop',
      app: 'TRECS JS prototype',
      sessionUuid,
      createdAt: createdAt.toISOString(),
      workstation,
      sourceDatabasePath: prototypeDatabasePath,
      job: {
        id: job.id,
        name: job.name,
        type: job.type,
        status: job.status,
        location: job.trecsName,
        clientName: job.clientName,
        rootPath: job.rootPath,
        shootDate: job.shootDate,
        retakeDate: job.retakeDate,
        packagePlanId: job.packagePlanId,
        packagePlanName: job.packagePlanName
      },
      counts: {
        subjects: subjects.length,
        subjectCodes: subjectCodes.length,
        subjectGroups: subjectGroups.length,
        subjectGroupMembers: subjectGroupMembers.length,
        orders: orders.length,
        orderItems: orderItems.length
      },
      paths: {
        database: 'capture.db',
        hotFolder: 'HotFolder',
        images: 'Images',
        exports: 'Exports'
      }
    };

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    return {
      packagePath,
      manifestPath,
      databasePath,
      sessionUuid,
      counts: manifest.counts
    };
  } finally {
    sourceDatabase.close();
  }
}

ipcMain.handle('laptop-package:prepare', prepareLaptopPackage);

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

  return writeSql((database) => {
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

  return writeSql((database) => {
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
  ['Images', 'CroppedLarge', 'CroppedMed', 'Chosen', 'Exports'].forEach((folder) => {
    fs.mkdirSync(path.join(rootPath, folder), { recursive: true });
  });
}

async function createJob(_event, input = {}) {
  const clientId = numericId(input.clientId);
  const name = normalizeText(input.name, 'Job name');
  const type = normalizeJobType(input.type || 'fall');
  const packagePlanId = normalizeNullableId(input.packagePlanId, 'package plan');
  const shootDate = optionalText(input.shootDate, 30);
  const retakeDate = optionalText(input.retakeDate, 30);
  const notes = optionalText(input.notes, 5000);

  return writeSql((database) => {
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
}

ipcMain.handle('job:create', createJob);

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

  return writeSql((database) => {
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

async function createBlankSubjects(_event, jobIdValue, countValue) {
  const jobId = numericId(jobIdValue);
  const count = normalizeRecordCount(countValue);

  return writeSql((database) => {
    const jobRows = rowsFromDatabase(database, `SELECT id FROM jobs WHERE id = ${jobId};`);
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
    const startRef = Number(maxRows[0].maxRef || 0) + 1;
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

  return writeSql((database) => {
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
}

async function updateSubjectNotes(_event, subjectIdValue, notesValue) {
  const subjectId = numericId(subjectIdValue);
  const notes = normalizeNotes(notesValue);

  return writeSql((database) => {
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

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
}

app.whenReady().then(async () => {
  await ensurePrototypeDatabaseShape();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
