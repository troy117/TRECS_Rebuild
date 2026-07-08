# New Data Model Draft

This is the first draft of the normalized data model for the JavaScript rebuild. It is written in product/database terms first, not final SQL. The goal is to make sure the new app can represent the old workflows while fixing the pain points around multiple orders, multiple shoot types, and production state.

## Design Principles

- One shared core model for all shoot types.
- Job types customize fields and screens, but should not require totally separate databases.
- Orders are independent records, not fixed fields on a student.
- Images are assets with status, metadata, and links to subjects.
- Rendering is a queue with history, not a one-time side effect.
- Old Access values should be preserved as migration metadata where useful.
- Preserve the existing `JOBS/<SCHOOL>/<JOB>` folder structure during transition.
- Design for multiple Windows workstations using the app from a shared network drive.
- Online orders must be first-class because they can arrive before photography, after photography, or after batch print.
- Treat on-site photography laptops as standalone capture stations with local hot folders.
- Treat the shared/server hot folder as envelope-scan-only and single-workstation.

## Core Tables

### `clients`

Represents schools, leagues, event organizations, or other photography customers.

Fields:

- `id`
- `reference_number`
- `display_name`
- `trecs_name`
- `phone`
- `address`
- `city`
- `state`
- `zip`
- `notes`
- `created_at`
- `updated_at`

Migrates from:

- `ProgramData.accdb` -> `Schools`

### `client_contacts`

Fields:

- `id`
- `client_id`
- `name`
- `position`
- `email`
- `phone`
- `sort_order`

Migrates from:

- `Contact1*`, `Contact2*`, `Contact3*` columns in `Schools`

### `jobs`

Represents a shoot or production job.

Fields:

- `id`
- `client_id`
- `legacy_id`
- `reference_number`
- `name`
- `type`
- `status`
- `package_plan_id`
- `student_id_template_id`
- `faculty_id_template_id`
- `root_path`
- `legacy_folder_layout`
- `shoot_date`
- `due_date`
- `notes`
- `created_at`
- `updated_at`

Migrates from:

- `ProgramData.accdb` -> `Jobs`

Job types:

- `fall`
- `sports`
- `spring`
- `seniors`
- `event`
- `qr_event`
- `league`

### `job_links`

Represents relationships between jobs, such as spring/senior/event jobs linked to a fall job.

Fields:

- `id`
- `source_job_id`
- `target_job_id`
- `relationship_type`
- `legacy_target_path`

Migrates from:

- `FallJob` tables in senior/spring/event databases.

### `job_field_definitions`

Configurable fields for each job type.

Fields:

- `id`
- `job_id`
- `entity_type`
- `field_key`
- `label`
- `field_type`
- `sort_order`
- `required`

Examples:

- `grade`
- `homeroom`
- `track`
- `team`
- `text1`
- `text2`
- `text3`

### `subjects`

Unified model for students, seniors, players, staff, event subjects, and test cards.

Fields:

- `id`
- `job_id`
- `legacy_ref_num`
- `subject_type`
- `first_name`
- `last_name`
- `display_name`
- `external_id`
- `grade`
- `homeroom`
- `track`
- `team`
- `photographed_status`
- `primary_image_asset_id`
- `notes`
- `created_at`
- `updated_at`

Migrates from:

- Fall/sports `Students`
- Spring `Students`
- Senior `Students`
- Event `Students`
- QR event `Students`
- League `Players`

### `subject_field_values`

Stores custom or job-specific subject fields.

Fields:

- `id`
- `subject_id`
- `field_definition_id`
- `value`

Migrates from:

- `Field1`, `Field2`
- Spring `Text1`, `Text2`, `Text3`
- Other job-type-specific fields that do not belong in the core subject table.

### `subject_groups`

Named lists, teams, classes, or temporary production groups.

Fields:

- `id`
- `job_id`
- `name`
- `group_type`

Migrates from:

- `Lists.List`
- League teams can also be represented here.

### `subject_group_members`

Fields:

- `id`
- `group_id`
- `subject_id`
- `sort_order`

Migrates from:

- `Lists.ReferenceNumber`

### `subject_codes`

Access codes, gallery codes, QR codes, or other per-subject codes.

Fields:

- `id`
- `subject_id`
- `code_type`
- `code`
- `created_at`

Migrates from:

- Senior `Code`
- QR event random/download values

## Image Tables

### `capture_sessions`

Represents a picture-day capture session or an envelope scanning session.

Fields:

- `id`
- `job_id`
- `session_type`
- `workstation_name`
- `user_name`
- `hot_folder_path`
- `local_database_path`
- `storage_root_path`
- `active_subject_id`
- `latest_image_asset_id`
- `status`
- `sync_status`
- `started_at`
- `last_seen_at`
- `ended_at`
- `notes`

Session types:

- `onsite_laptop`
- `server_envelope_scan`
- `manual_import`

Notes:

- On-site photography sessions run on standalone laptops at the shoot location.
- Each laptop watches its own local Canon EOS hot folder.
- Server envelope scanning uses a shared/server hot folder, but only from one computer.
- Laptop sessions need a later sync/import workflow back into the shared production database.

### `image_import_events`

Tracks files discovered by a hot folder watcher or manual import.

Fields:

- `id`
- `capture_session_id`
- `job_id`
- `subject_id`
- `image_asset_id`
- `event_type`
- `source_path`
- `destination_path`
- `filename`
- `status`
- `detected_at`
- `processed_at`
- `error_message`
- `metadata_json`

Event types:

- `camera_hot_folder`
- `envelope_scan`
- `manual_import`

Statuses:

- `new`
- `importing`
- `matched`
- `needs_review`
- `ignored`
- `failed`

### `envelope_scans`

Tracks scanned paper envelopes and the order codes keyed from them.

Fields:

- `id`
- `job_id`
- `subject_id`
- `capture_session_id`
- `image_import_event_id`
- `order_id`
- `scan_path`
- `envelope_identifier`
- `keyed_order_code`
- `keyed_by`
- `status`
- `scanned_at`
- `keyed_at`
- `notes`

Statuses:

- `scanned`
- `keyed`
- `order_created`
- `needs_review`
- `void`

Notes:

- Envelope scanning creates a real `orders` row with source `paper`.
- The keyed order code is parsed into one or more `order_items`.
- `order_id` links the scan record to the created paper order.
- If the subject cannot be matched or the order code cannot be parsed, keep the envelope scan as `needs_review`.

### `sync_packages`

Tracks laptop capture packages and import/export batches.

Fields:

- `id`
- `job_id`
- `session_uuid`
- `package_type`
- `direction`
- `source_path`
- `status`
- `workstation_name`
- `created_at`
- `imported_at`
- `metadata_json`

Package types:

- `laptop_capture`
- `server_envelope_scan`
- `manual_import`

Directions:

- `export`
- `import`

Statuses:

- `created`
- `validated`
- `importing`
- `imported`
- `needs_review`
- `failed`

### `sync_record_mappings`

Maps laptop-local records to central production records.

Fields:

- `id`
- `sync_package_id`
- `local_table`
- `local_uuid`
- `local_id`
- `central_table`
- `central_id`
- `source_hash`
- `created_at`
- `metadata_json`

### `sync_conflicts`

Stores import conflicts that need operator review.

Fields:

- `id`
- `sync_package_id`
- `conflict_type`
- `local_table`
- `local_id`
- `central_table`
- `central_id`
- `status`
- `local_value_json`
- `central_value_json`
- `resolution_json`
- `created_at`
- `resolved_at`

Conflict types:

- `missing_subject`
- `primary_image_conflict`
- `note_conflict`
- `duplicate_filename`
- `duplicate_file_hash`
- `subject_image_mismatch`

### `image_assets`

Represents every imported image file.

Fields:

- `id`
- `job_id`
- `original_path`
- `current_path`
- `filename`
- `source`
- `status`
- `captured_at`
- `imported_at`
- `metadata_json`

Statuses:

- `imported`
- `matched`
- `needs_review`
- `cropped`
- `render_ready`
- `archived`

### `subject_images`

Links images to subjects.

Fields:

- `id`
- `subject_id`
- `image_asset_id`
- `role`
- `selected`
- `sort_order`

Roles:

- `capture`
- `proof`
- `chosen`
- `primary`
- `group`

### `image_versions`

Represents cropped or generated versions.

Fields:

- `id`
- `image_asset_id`
- `version_type`
- `path`
- `width`
- `height`
- `crop_json`
- `created_at`

Version examples:

- `cropped_large`
- `cropped_med`
- `cropped_small`
- `proof`
- `rendered`

## Order Tables

### `orders`

Order header.

Fields:

- `id`
- `job_id`
- `subject_id`
- `family_key`
- `source`
- `source_reference`
- `entry_timing`
- `status`
- `paid_status`
- `render_status`
- `notes`
- `created_at`
- `updated_at`

Sources:

- `paper`
- `online`
- `admin`
- `comp`
- `import`

Entry timing:

- `before_photo`
- `after_photo`
- `after_batch_print`
- `unknown`

Render statuses:

- `not_ready`
- `ready`
- `queued`
- `rendered`
- `held`
- `failed`

Migrates from:

- Fall `Order1`
- Fall `Order2`
- Senior `Orders`
- Event `Order`
- League `Order`

Envelope scan rule:

- A keyed envelope scan creates a source `paper` order.
- Store the scan/envelope id in `orders.source_reference`.
- Store the exact keyed code in `order_items.raw_code`.
- Parse package codes into normalized `order_items.package_code` rows.

### `order_items`

Line items inside an order.

Fields:

- `id`
- `order_id`
- `subject_id`
- `image_asset_id`
- `package_plan_id`
- `package_code`
- `product_id`
- `quantity`
- `raw_code`
- `status`
- `notes`

Notes:

- Dot-separated legacy codes such as `3.75.45` should create multiple line items or one grouped imported line with parsed child items.
- Senior image-specific order maps should create line items tied to specific image assets.

### `payments`

Fields:

- `id`
- `order_id`
- `method`
- `amount`
- `status`
- `reference`
- `created_at`

Migration notes:

- Existing boolean payment values become a coarse paid/unpaid status.
- Online order numbers should be stored as payment/order source references when available.

## Product And Template Tables

### `package_plans`

Fields:

- `id`
- `name`
- `version`
- `active`
- `created_at`

Migrates from:

- `PackagePlans.PackagePlan`

### `package_codes`

Fields:

- `id`
- `package_plan_id`
- `code`
- `name`
- `active`

Migrates from:

- `PackagePlans.Code`
- `PackagePlans.CodeName`

### `package_code_items`

Fields:

- `id`
- `package_code_id`
- `legacy_field`
- `raw_value`
- `product_id`
- `quantity`
- `sort_order`

Migrates from:

- `f1` through `f15`

Notes:

- Existing package plans should be imported as-is first.
- The normalized product/package model can then store each package field as a structured item while preserving the original raw field value.
- Rendering should read from the structured items, but keep the old raw values available during transition and debugging.

### `products`

Fields:

- `id`
- `name`
- `category`
- `size`
- `requires_image`
- `template_id`
- `metadata_json`

Examples:

- Prints
- Portrait envelopes
- CDs
- QR codes
- Magnets
- Keychains
- Mugs
- Notecards
- Memory mates

### `templates`

Fields:

- `id`
- `name`
- `template_type`
- `source_path`
- `metadata_json`

### `template_elements`

Fields:

- `id`
- `template_id`
- `element_type`
- `x`
- `y`
- `width`
- `height`
- `font`
- `font_size`
- `color`
- `metadata_json`

Migrates from:

- `IDtemplate`
- package plan template text files

## Production Tables

### `render_batches`

Fields:

- `id`
- `job_id`
- `name`
- `status`
- `started_at`
- `finished_at`
- `created_by`

### `render_tasks`

Fields:

- `id`
- `render_batch_id`
- `order_item_id`
- `task_type`
- `status`
- `output_path`
- `error_message`
- `created_at`
- `updated_at`

Statuses:

- `queued`
- `running`
- `complete`
- `failed`
- `skipped`

### `exports`

Fields:

- `id`
- `job_id`
- `export_type`
- `path`
- `status`
- `created_at`

### `admin_item_batches`

Represents admin deliverables generated for a job at a specific shoot stage.

Fields:

- `id`
- `job_id`
- `shoot_stage`
- `admin_item_type`
- `status`
- `options_json`
- `output_path`
- `created_by`
- `created_at`
- `completed_at`
- `error_message`

Shoot stages:

- `original_picture_day`
- `makeup_day`
- `retake_day`
- `manual`

Admin item types:

- `delivery_envelope_cover`
- `school_directory`
- `missing_photo_report`
- `sis_export`
- `id_cards`
- `sticker_prints`
- `staff_picture_packages`

Notes:

- School directories need saved sort/group options such as grade, homeroom, track, name, or custom fields.
- SIS exports need saved format options because different schools may require different image names, data columns, folder layouts, or CSV formats.
- Makeup-day ID cards and sticker prints should filter to subjects photographed during the makeup-day capture session.
- Missing reports should be based on subjects whose photographed status or image links still indicate no usable photo.
- Admin item batches should be rerunnable and should keep output history rather than replacing old output silently.

## Migration Rules Draft

### Fall `Order1` / `Order2`

- If `Order1` is non-empty, create an `orders` row with source `paper`.
- If `Order1Pay` is true, mark the order paid.
- Parse the `Order1` code into one or more `order_items`.
- If `Order2` is non-empty and `Notes` contains an online order reference, create a separate `orders` row with source `online`.
- If `Order2Pay` is true, mark the online order paid.
- Preserve the original raw code in `order_items.raw_code`.

### Senior `Orders`

- Parse the memo value as a JSON-style map of image filename to package/order code.
- Create one order for the senior if the memo is non-empty.
- Create one `order_item` per image/code pair.
- Link each item to the matching `image_asset` when imported.
- Preserve unparsed order memo in migration metadata if parsing fails.

### Lists

- Each unique list name becomes a `subject_group`.
- Each reference number becomes a `subject_group_member`.

### Job Paths

- Preserve original root paths during migration.
- Current decision: preserve and write into the existing `JOBS/<SCHOOL>/<JOB>` structure during the transition.

### Network Drive Operation

- Store enough locking/session data to prevent two workstations from making conflicting edits to the same job.
- Avoid relying only on text files such as `CurrentlyOpen.txt`.
- Use cautious writes for shared data files: write temporary files, validate, then replace.
- Assume image folders and render outputs may be read by one workstation while another workstation is still producing files.
- On-site capture laptops should not depend on live network access while photographers are at the shoot.
- Syncing laptop capture sessions back to the shared drive should be an explicit import/reconcile step.
- Server hot-folder scanning is limited to envelope scans from one computer, which keeps that workflow simpler than multi-laptop camera capture.
- Track laptop sync imports with `sync_packages`, `sync_record_mappings`, and `sync_conflicts`.
- Use file hashes plus laptop-local record UUIDs to prevent duplicate imports.

## Still To Inspect

- More package plan rows across different plan names.
- Event and QR event sample databases when available.
- Spring sample databases when available.
- League sample databases when available.
- Exact render output file naming conventions.
- Online order import files and formats.
