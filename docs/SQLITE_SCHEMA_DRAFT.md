# SQLite Schema Draft

The first concrete SQLite schema lives at:

- `database/schema.sql`

This schema is the implementation draft of `docs/NEW_DATA_MODEL.md`. It is intentionally broad enough to support migration from the old Access databases while still leaving room for better order management, capture/image matching, and rendering.

## Major Schema Areas

- `clients` and `client_contacts`: schools, locations, organizations, and contacts.
- `jobs`, `job_links`, `job_sessions`, and `job_field_definitions`: shoot jobs, linked jobs, network-drive sessions, and configurable fields.
- `subjects`, `subject_field_values`, `subject_groups`, `subject_group_members`, and `subject_codes`: students, seniors, players, event subjects, lists, teams, and gallery/access codes.
- `image_assets`, `subject_images`, and `image_versions`: original images, matched subject images, selected images, and cropped/rendered versions.
- `orders`, `order_items`, and `payments`: paper orders, online orders, comp/admin orders, multi-item orders, and paid status.
- `package_plans`, `package_codes`, `package_code_items`, `products`, `templates`, and `template_elements`: imported package plans and the future normalized product/render model.
- `product_aliases`: mapping from legacy package item text to normalized products.
- `render_batches`, `render_tasks`, and `exports`: queued rendering, render output, retry/error tracking, and exports.
- `migration_sources` and `legacy_mappings`: bridge tables to preserve old Access/folder identities during migration.

## Design Choices Captured

- The schema supports the existing `JOBS/<SCHOOL>/<JOB>` layout through `jobs.root_path` and `jobs.legacy_folder_layout`.
- `job_sessions` is the first replacement for the old `CurrentlyOpen.txt` lock behavior.
- Online orders are first-class records through `orders.source = 'online'`.
- `orders.entry_timing` distinguishes orders entered before photography, after photography, and after batch print.
- `orders.render_status` and `render_tasks` support late online orders that need rendering after a batch has already printed.
- Package plans can be imported as-is into `package_plans`, `package_codes`, and `package_code_items`, preserving `f1` through `f15` in `legacy_field` and `raw_value`.
- `legacy_mappings` keeps old table/key references available for debugging, re-imports, and confidence during transition.

## Early Review Notes

Things to validate before building too much app code:

- Whether one SQLite database on the shared network drive is acceptable for concurrent workstation use, or whether the app should use a central service later.
- Whether `job_sessions` should lock the entire job or allow screen/workflow-level locks.
- How dot-separated legacy order codes should split into `order_items`.
- How package plan raw values map to products and quantities.
- Whether family orders need a stronger first-class `families` table or whether `orders.family_key` is enough for MVP.
- Whether online order import files include enough information to match before-photo orders to students reliably.

## Suggested Next Step

Create a small migration prototype that:

1. Creates an empty SQLite database from `database/schema.sql`.
2. Imports `ProgramData.accdb` schools, jobs, and package plans.
3. Imports one fall job's students and lists.
4. Converts `Order1` and `Order2` into normalized `orders` and `order_items`.

## Prototype Migration Result

Prototype files:

- `tools/TrecsMigrationPrototype.java`
- `database/migration_prototype_import.sql`
- `database/migration_prototype.db`

Imported source data:

- `ProgramData.accdb`
- `JOBS/UHS/FALL_2024/Database/Students.accdb`

Row counts after import:

- `clients`: 67
- `jobs`: 7
- `package_plans`: 14
- `package_codes`: 440
- `package_code_items`: 727
- `subjects`: 769
- `subject_groups`: 3
- `subject_group_members`: 30
- `subject_codes`: 122
- `orders`: 231
- `online_orders`: 191
- `order_items`: 837
- `products`: 67
- `product_aliases`: 154
- `mapped_package_code_items`: 727
- `unmapped_package_code_items`: 0
- `image_assets`: 1,944
- `image_versions`: 3,482
- image versions with dimensions: 3,482
- `subject_images`: 1,932
- senior order items linked to image assets: 589 of 589

Validation notes:

- The first import exposed that `Schools.ReferenceNumber` is not safe as a unique value, so `clients.reference_number` is no longer unique in `database/schema.sql`.
- Fall `Order1` values successfully became paper orders.
- Fall `Order2` values successfully became online orders.
- Online order numbers were extracted from notes like `ONLINE ORDER 31697`.
- Dot-separated package/order codes now split into multiple `order_items`, while preserving the original raw code.
- Code `90` appears in UHS fall orders but does not match any imported package plan code.
- UHS senior students and senior JSON-style image order maps now import into the same `subjects`, `orders`, and `order_items` tables.
- Senior gallery/access codes import into `subject_codes`.
- Fall and senior image folders now import into `image_assets`, `image_versions`, and `subject_images`.
- Senior order items now link to `image_assets` by filename.
