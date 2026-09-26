const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const requiredTables = [
  'app_settings', 'clients', 'jobs', 'id_card_templates', 'package_plans',
  'products', 'package_codes', 'render_batches', 'render_batch_jobs'
];
const removedTables = [
  'client_contacts', 'job_field_definitions', 'subject_field_values',
  'sync_packages', 'sync_record_mappings', 'sync_conflicts', 'render_tasks', 'exports'
];
const jobOwnedTables = [
  'composite_grade_titles', 'duplicate_record_reviews', 'capture_sessions', 'subjects',
  'staff_assignments', 'subject_groups', 'subject_group_members', 'subject_codes',
  'image_assets', 'subject_images', 'image_versions', 'image_import_events',
  'envelope_scans', 'capture_image_actions', 'orders', 'order_items', 'payments',
  'event_entries', 'event_subject_links', 'admin_item_batches', 'end_of_day_imports',
  'job_milestones'
];

(async () => {
  const SQL = await initSqlJs({ locateFile: (file) => path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', file) });
  const database = new SQL.Database();
  database.run(fs.readFileSync(path.join(__dirname, '..', '..', 'database', 'schema.sql'), 'utf8'));
  const names = new Set((database.exec("SELECT name FROM sqlite_master WHERE type = 'table';")[0]?.values || []).map(([name]) => name));
  const missing = requiredTables.filter((name) => !names.has(name));
  const unexpected = [...removedTables, ...jobOwnedTables].filter((name) => names.has(name));
  const foreignKeyProblems = database.exec('PRAGMA foreign_key_check;')[0]?.values || [];
  database.close();
  if (missing.length || unexpected.length || foreignKeyProblems.length) {
    throw new Error(JSON.stringify({ missing, unexpected, foreignKeyProblems }));
  }
  console.log(`ProgramData schema OK (${names.size} global tables; job-owned tables are excluded)`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
