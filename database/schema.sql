PRAGMA foreign_keys = ON;

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

CREATE TABLE IF NOT EXISTS client_contacts (
  id INTEGER PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT,
  position TEXT,
  email TEXT,
  phone TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
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

CREATE TABLE IF NOT EXISTS capture_sessions (
  id INTEGER PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL CHECK (session_type IN ('onsite_laptop', 'server_envelope_scan', 'manual_import')),
  shoot_stage TEXT NOT NULL DEFAULT 'main' CHECK (shoot_stage IN ('main', 'makeup', 'retake', 'other')),
  file_mode TEXT NOT NULL DEFAULT 'jpg_raw' CHECK (file_mode IN ('jpg_raw', 'jpg_only')),
  workstation_name TEXT NOT NULL,
  user_name TEXT,
  hot_folder_path TEXT,
  local_database_path TEXT,
  storage_root_path TEXT,
  active_subject_id INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
  latest_image_asset_id INTEGER REFERENCES image_assets(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'paused', 'closed', 'abandoned')),
  sync_status TEXT NOT NULL DEFAULT 'local_only' CHECK (sync_status IN ('local_only', 'pending_sync', 'syncing', 'synced', 'conflict', 'not_needed')),
  started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS job_field_definitions (
  id INTEGER PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  field_key TEXT NOT NULL,
  label TEXT NOT NULL,
  field_type TEXT NOT NULL DEFAULT 'text',
  sort_order INTEGER NOT NULL DEFAULT 0,
  required INTEGER NOT NULL DEFAULT 0,
  UNIQUE(job_id, entity_type, field_key)
);

CREATE TABLE IF NOT EXISTS subjects (
  id INTEGER PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
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
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(job_id, legacy_ref_num)
);

CREATE TABLE IF NOT EXISTS subject_field_values (
  id INTEGER PRIMARY KEY,
  subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  field_definition_id INTEGER NOT NULL REFERENCES job_field_definitions(id) ON DELETE CASCADE,
  value TEXT,
  UNIQUE(subject_id, field_definition_id)
);

CREATE TABLE IF NOT EXISTS subject_groups (
  id INTEGER PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  group_type TEXT NOT NULL DEFAULT 'list',
  UNIQUE(job_id, name, group_type)
);

CREATE TABLE IF NOT EXISTS subject_group_members (
  id INTEGER PRIMARY KEY,
  group_id INTEGER NOT NULL REFERENCES subject_groups(id) ON DELETE CASCADE,
  subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE(group_id, subject_id)
);

CREATE TABLE IF NOT EXISTS subject_codes (
  id INTEGER PRIMARY KEY,
  subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  code_type TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(subject_id, code_type, code)
);

CREATE TABLE IF NOT EXISTS image_assets (
  id INTEGER PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  capture_session_id INTEGER REFERENCES capture_sessions(id) ON DELETE SET NULL,
  shoot_stage TEXT NOT NULL DEFAULT 'main' CHECK (shoot_stage IN ('main', 'makeup', 'retake', 'other')),
  original_path TEXT,
  current_path TEXT NOT NULL,
  filename TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'import',
  status TEXT NOT NULL DEFAULT 'imported',
  rejected_at TEXT,
  rejected_reason TEXT,
  captured_at TEXT,
  imported_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  metadata_json TEXT,
  UNIQUE(job_id, current_path)
);

CREATE TABLE IF NOT EXISTS subject_images (
  id INTEGER PRIMARY KEY,
  subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  image_asset_id INTEGER NOT NULL REFERENCES image_assets(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'capture',
  selected INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE(subject_id, image_asset_id, role)
);

CREATE TABLE IF NOT EXISTS image_versions (
  id INTEGER PRIMARY KEY,
  image_asset_id INTEGER NOT NULL REFERENCES image_assets(id) ON DELETE CASCADE,
  version_type TEXT NOT NULL,
  path TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  crop_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(image_asset_id, version_type, path)
);

CREATE TABLE IF NOT EXISTS image_import_events (
  id INTEGER PRIMARY KEY,
  capture_session_id INTEGER REFERENCES capture_sessions(id) ON DELETE SET NULL,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  subject_id INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
  image_asset_id INTEGER REFERENCES image_assets(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('camera_hot_folder', 'envelope_scan', 'manual_import')),
  source_path TEXT NOT NULL,
  destination_path TEXT,
  filename TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'importing', 'matched', 'needs_review', 'ignored', 'failed')),
  detected_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  processed_at TEXT,
  error_message TEXT,
  metadata_json TEXT
);

CREATE TABLE IF NOT EXISTS envelope_scans (
  id INTEGER PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  subject_id INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
  capture_session_id INTEGER REFERENCES capture_sessions(id) ON DELETE SET NULL,
  image_import_event_id INTEGER REFERENCES image_import_events(id) ON DELETE SET NULL,
  order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
  scan_path TEXT,
  envelope_identifier TEXT,
  keyed_order_code TEXT,
  keyed_by TEXT,
  status TEXT NOT NULL DEFAULT 'scanned' CHECK (status IN ('scanned', 'keyed', 'order_created', 'needs_review', 'void')),
  scanned_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  keyed_at TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS sync_packages (
  id INTEGER PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  session_uuid TEXT NOT NULL,
  package_type TEXT NOT NULL CHECK (package_type IN ('laptop_capture', 'server_envelope_scan', 'manual_import')),
  direction TEXT NOT NULL CHECK (direction IN ('export', 'import')),
  source_path TEXT,
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'validated', 'importing', 'imported', 'needs_review', 'failed')),
  workstation_name TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  imported_at TEXT,
  metadata_json TEXT,
  UNIQUE(session_uuid, direction)
);

CREATE TABLE IF NOT EXISTS sync_record_mappings (
  id INTEGER PRIMARY KEY,
  sync_package_id INTEGER NOT NULL REFERENCES sync_packages(id) ON DELETE CASCADE,
  local_table TEXT NOT NULL,
  local_uuid TEXT,
  local_id TEXT,
  central_table TEXT NOT NULL,
  central_id INTEGER NOT NULL,
  source_hash TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  metadata_json TEXT,
  UNIQUE(sync_package_id, local_table, local_uuid, central_table),
  UNIQUE(sync_package_id, local_table, local_id, central_table)
);

CREATE TABLE IF NOT EXISTS sync_conflicts (
  id INTEGER PRIMARY KEY,
  sync_package_id INTEGER NOT NULL REFERENCES sync_packages(id) ON DELETE CASCADE,
  conflict_type TEXT NOT NULL CHECK (conflict_type IN ('missing_subject', 'primary_image_conflict', 'note_conflict', 'duplicate_filename', 'duplicate_file_hash', 'subject_image_mismatch')),
  local_table TEXT,
  local_id TEXT,
  central_table TEXT,
  central_id INTEGER,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'ignored')),
  local_value_json TEXT,
  central_value_json TEXT,
  resolution_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at TEXT
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  subject_id INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
  family_key TEXT,
  source TEXT NOT NULL CHECK (source IN ('paper', 'online', 'admin', 'comp', 'import')),
  source_reference TEXT,
  entry_timing TEXT NOT NULL DEFAULT 'unknown' CHECK (entry_timing IN ('before_photo', 'after_photo', 'after_batch_print', 'unknown')),
  status TEXT NOT NULL DEFAULT 'open',
  paid_status TEXT NOT NULL DEFAULT 'unknown',
  render_status TEXT NOT NULL DEFAULT 'not_ready',
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  subject_id INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
  image_asset_id INTEGER REFERENCES image_assets(id) ON DELETE SET NULL,
  package_plan_id INTEGER REFERENCES package_plans(id) ON DELETE SET NULL,
  package_code TEXT,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  raw_code TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  method TEXT,
  amount REAL,
  status TEXT NOT NULL DEFAULT 'unknown',
  reference TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
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

CREATE TABLE IF NOT EXISTS event_entries (
  id INTEGER PRIMARY KEY,
  event_job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  fall_job_id INTEGER REFERENCES jobs(id) ON DELETE SET NULL,
  event_image_asset_id INTEGER NOT NULL REFERENCES image_assets(id) ON DELETE CASCADE,
  image_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unlinked',
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_job_id, event_image_asset_id)
);

CREATE TABLE IF NOT EXISTS event_subject_links (
  id INTEGER PRIMARY KEY,
  event_entry_id INTEGER NOT NULL REFERENCES event_entries(id) ON DELETE CASCADE,
  fall_subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  confirmed_by TEXT,
  confirmed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  UNIQUE(event_entry_id, fall_subject_id)
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

CREATE TABLE IF NOT EXISTS render_tasks (
  id INTEGER PRIMARY KEY,
  render_batch_id INTEGER NOT NULL REFERENCES render_batches(id) ON DELETE CASCADE,
  order_item_id INTEGER REFERENCES order_items(id) ON DELETE SET NULL,
  job_id INTEGER REFERENCES jobs(id) ON DELETE SET NULL,
  order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
  task_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  output_path TEXT,
  details_json TEXT,
  error_message TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exports (
  id INTEGER PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  export_type TEXT NOT NULL,
  path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'created',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_item_batches (
  id INTEGER PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
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

CREATE TABLE IF NOT EXISTS end_of_day_imports (
  id INTEGER PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  package_name TEXT,
  package_folder TEXT NOT NULL,
  photographer_name TEXT,
  workstation_name TEXT,
  shoot_stage TEXT,
  captured_images INTEGER NOT NULL DEFAULT 0,
  raw_files INTEGER NOT NULL DEFAULT 0,
  new_subjects INTEGER NOT NULL DEFAULT 0,
  edited_subjects INTEGER NOT NULL DEFAULT 0,
  copied_files INTEGER NOT NULL DEFAULT 0,
  imported_by TEXT,
  imported_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  manifest_json TEXT,
  UNIQUE(job_id, package_folder)
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
CREATE INDEX IF NOT EXISTS idx_subjects_job_id ON subjects(job_id);
CREATE INDEX IF NOT EXISTS idx_subjects_name ON subjects(last_name, first_name);
CREATE INDEX IF NOT EXISTS idx_subjects_external_id ON subjects(external_id);
CREATE INDEX IF NOT EXISTS idx_capture_sessions_job_id ON capture_sessions(job_id);
CREATE INDEX IF NOT EXISTS idx_capture_sessions_status ON capture_sessions(status, sync_status);
CREATE INDEX IF NOT EXISTS idx_image_assets_job_id ON image_assets(job_id);
CREATE INDEX IF NOT EXISTS idx_image_assets_capture_session_id ON image_assets(capture_session_id);
CREATE INDEX IF NOT EXISTS idx_image_assets_shoot_stage ON image_assets(job_id, shoot_stage);
CREATE INDEX IF NOT EXISTS idx_image_import_events_job_id ON image_import_events(job_id);
CREATE INDEX IF NOT EXISTS idx_image_import_events_status ON image_import_events(status);
CREATE INDEX IF NOT EXISTS idx_envelope_scans_job_id ON envelope_scans(job_id);
CREATE INDEX IF NOT EXISTS idx_envelope_scans_order_id ON envelope_scans(order_id);
CREATE INDEX IF NOT EXISTS idx_envelope_scans_status ON envelope_scans(status);
CREATE INDEX IF NOT EXISTS idx_sync_packages_job_id ON sync_packages(job_id);
CREATE INDEX IF NOT EXISTS idx_sync_packages_session_uuid ON sync_packages(session_uuid);
CREATE INDEX IF NOT EXISTS idx_sync_record_mappings_source_hash ON sync_record_mappings(source_hash);
CREATE INDEX IF NOT EXISTS idx_sync_conflicts_status ON sync_conflicts(status);
CREATE INDEX IF NOT EXISTS idx_orders_job_id ON orders(job_id);
CREATE INDEX IF NOT EXISTS idx_orders_subject_id ON orders(subject_id);
CREATE INDEX IF NOT EXISTS idx_orders_source_reference ON orders(source_reference);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_event_entries_job_status ON event_entries(event_job_id, status, image_number);
CREATE INDEX IF NOT EXISTS idx_event_subject_links_entry ON event_subject_links(event_entry_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_event_subject_links_fall_subject ON event_subject_links(fall_subject_id);
CREATE INDEX IF NOT EXISTS idx_render_tasks_status ON render_tasks(status);
CREATE INDEX IF NOT EXISTS idx_admin_item_batches_job_id ON admin_item_batches(job_id, shoot_stage, admin_item_type);
CREATE INDEX IF NOT EXISTS idx_end_of_day_imports_job_id ON end_of_day_imports(job_id, imported_at);
