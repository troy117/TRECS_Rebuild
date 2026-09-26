PRAGMA foreign_keys = ON;

-- ProgramData.db contains only global configuration and the school/job index.
-- Operational job records live in each job folder's Database/job.db.

CREATE TABLE IF NOT EXISTS schema_migrations (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS templates (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  template_type TEXT NOT NULL,
  source_path TEXT,
  metadata_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(name, template_type)
);

CREATE TABLE IF NOT EXISTS template_elements (
  id INTEGER PRIMARY KEY,
  template_id INTEGER NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
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

CREATE TABLE IF NOT EXISTS id_card_templates (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('student', 'staff')),
  template_json TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(name, template_type)
);

CREATE TABLE IF NOT EXISTS package_plans (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  active INTEGER NOT NULL DEFAULT 1,
  legacy_name TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(name, version)
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  size TEXT,
  requires_image INTEGER NOT NULL DEFAULT 1,
  template_id INTEGER REFERENCES templates(id) ON DELETE SET NULL,
  metadata_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_aliases (
  id INTEGER PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  alias TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL DEFAULT 'legacy_package_item',
  notes TEXT
);

CREATE TABLE IF NOT EXISTS package_codes (
  id INTEGER PRIMARY KEY,
  package_plan_id INTEGER NOT NULL REFERENCES package_plans(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  legacy_code_name TEXT,
  metadata_json TEXT,
  UNIQUE(package_plan_id, code)
);

CREATE TABLE IF NOT EXISTS package_code_items (
  id INTEGER PRIMARY KEY,
  package_code_id INTEGER NOT NULL REFERENCES package_codes(id) ON DELETE CASCADE,
  legacy_field TEXT,
  raw_value TEXT NOT NULL,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  legacy_id TEXT,
  reference_number TEXT,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('fall', 'sports', 'spring', 'seniors', 'event', 'qr_event', 'league')),
  status TEXT NOT NULL DEFAULT 'active',
  package_plan_id INTEGER REFERENCES package_plans(id) ON DELETE SET NULL,
  student_id_template_id INTEGER REFERENCES templates(id) ON DELETE SET NULL,
  faculty_id_template_id INTEGER REFERENCES templates(id) ON DELETE SET NULL,
  root_path TEXT NOT NULL,
  legacy_folder_layout TEXT NOT NULL DEFAULT 'trecs_v7',
  shoot_date TEXT,
  retake_date TEXT,
  due_date TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(client_id, name)
);

CREATE TABLE IF NOT EXISTS job_links (
  id INTEGER PRIMARY KEY,
  source_job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  target_job_id INTEGER REFERENCES jobs(id) ON DELETE SET NULL,
  relationship_type TEXT NOT NULL,
  legacy_target_path TEXT,
  UNIQUE(source_job_id, target_job_id, relationship_type)
);

CREATE TABLE IF NOT EXISTS job_sessions (
  id INTEGER PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  session_uuid TEXT NOT NULL,
  workstation_name TEXT NOT NULL,
  user_name TEXT,
  lock_scope TEXT NOT NULL DEFAULT 'job_write',
  lock_mode TEXT NOT NULL DEFAULT 'exclusive',
  session_status TEXT NOT NULL DEFAULT 'open',
  opened_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT,
  closed_at TEXT,
  metadata_json TEXT
);

CREATE TABLE IF NOT EXISTS render_batches (
  id INTEGER PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  output_path TEXT,
  options_json TEXT,
  result_json TEXT,
  started_at TEXT,
  finished_at TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS render_batch_jobs (
  id INTEGER PRIMARY KEY,
  render_batch_id INTEGER NOT NULL REFERENCES render_batches(id) ON DELETE CASCADE,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'queued',
  output_path TEXT,
  result_json TEXT,
  error_message TEXT,
  started_at TEXT,
  finished_at TEXT,
  UNIQUE(render_batch_id, job_id)
);

CREATE TABLE IF NOT EXISTS migration_sources (
  id INTEGER PRIMARY KEY,
  source_type TEXT NOT NULL,
  source_path TEXT NOT NULL,
  imported_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  metadata_json TEXT,
  UNIQUE(source_type, source_path)
);

CREATE TABLE IF NOT EXISTS legacy_mappings (
  id INTEGER PRIMARY KEY,
  migration_source_id INTEGER REFERENCES migration_sources(id) ON DELETE CASCADE,
  legacy_table TEXT,
  legacy_key TEXT,
  new_table TEXT NOT NULL,
  new_id INTEGER NOT NULL,
  raw_json TEXT,
  UNIQUE(migration_source_id, legacy_table, legacy_key, new_table)
);

CREATE INDEX IF NOT EXISTS idx_jobs_client_id ON jobs(client_id);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(type);
CREATE INDEX IF NOT EXISTS idx_product_aliases_alias ON product_aliases(alias);
