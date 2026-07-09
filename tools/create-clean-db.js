const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const initSqlJs = require(path.join(projectRoot, 'trecs-js', 'node_modules', 'sql.js'));

async function main() {
  const SQL = await initSqlJs({
    locateFile: (file) => path.join(projectRoot, 'trecs-js', 'node_modules', 'sql.js', 'dist', file)
  });
  const database = new SQL.Database();

  database.run(fs.readFileSync(path.join(projectRoot, 'database', 'schema.sql'), 'utf8'));
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

  const outputPath = path.join(projectRoot, 'database', 'migration_prototype.db');
  fs.writeFileSync(outputPath, Buffer.from(database.export()));
  database.close();
  console.log(`Created clean ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
