# Program database table audit

Audit date: 2026-08-14

## Storage rule

`database/ProgramData.db` is the global directory and configuration database. Each job's `Database/job.db` is the authoritative live store for that job's operational records.

The intended boundary is:

- Program database: application settings, schools, job index/relationships, shared templates, products, and package plans.
- Job database: subjects, lists, images, capture history, orders, envelopes, job verification, and job output history.

For screens that combine global configuration with job records, TRECS builds a temporary in-memory working database. Job rows are loaded from each `job.db` and written back only to those job databases; the temporary job tables are never saved in `ProgramData.db`.

## Global/program tables

| Table | Current use | Decision |
| --- | --- | --- |
| `schema_migrations` | Records future schema migrations. | Keep in ProgramData. |
| `app_settings` | Stores Student Field Setup and Production Sync settings. | Keep in ProgramData. |
| `clients` | School/location records used to create and display jobs. | Keep in ProgramData. |
| `templates` | Legacy generic render-template catalog; no current runtime queries. | Retain temporarily for legacy foreign-key/import compatibility, then retire. |
| `template_elements` | Legacy child records for `templates`; no current runtime queries. | Retain temporarily with `templates`, then retire. |
| `id_card_templates` | Active ID card designer templates and job assignments. | Keep in ProgramData. |
| `package_plans` | Shared package-plan definitions assigned to jobs. | Keep in ProgramData. |
| `products` | Shared render product definitions. | Keep in ProgramData. |
| `product_aliases` | Maps legacy item names to products. | Keep in ProgramData. |
| `package_codes` | Package/order codes within package plans. | Keep in ProgramData. |
| `package_code_items` | Products and quantities belonging to package codes. | Keep in ProgramData. |
| `jobs` | Lightweight job index, root folder, dates, and shared-plan/template assignments. | Keep the job index in ProgramData. |
| `job_links` | Cross-job relationships, currently Event-to-Fall links. | Keep in ProgramData. |
| `job_sessions` | Cross-workstation job write locks. | Keep in ProgramData so computers coordinate centrally. |
| `render_batches` | Multi-job render batch header/history. | Keep in ProgramData because one batch can span jobs. |
| `render_batch_jobs` | Jobs and results belonging to a multi-job batch. | Keep in ProgramData. |

## Active job-owned tables

These tables are actively used and are stored only in the applicable job's `Database/job.db`.

| Table | What it does | Target |
| --- | --- | --- |
| `subjects` | Student/staff identity, grade, homeroom, status, notes, and primary-photo pointer. | Job database. |
| `subject_codes` | Alternate identifiers such as legacy reference and student ID; used by imports and matching. | Job database. |
| `subject_groups` | Saved student lists used by camera cards, ID cards, directories, and filters. | Job database. |
| `subject_group_members` | Ordered membership joining saved lists to subjects. | Job database. |
| `staff_assignments` | Principal, VP, teacher, and composite-role assignments. | Job database. |
| `composite_grade_titles` | Reviewed class/composite grade headings. | Job database. |
| `duplicate_record_reviews` | Stores duplicate-student groups already reviewed. | Job database. |
| `image_assets` | One record per imported/captured image file, including paths, status, stage, and rejection state. | Job database. |
| `subject_images` | Links one image to one or more subjects and marks the selected/comparison order. | Job database. |
| `image_versions` | Tracks derived files such as cropped-medium and cropped-large versions. | Job database. |
| `capture_sessions` | Photographer/workstation capture session, stage, file mode, and hot-folder state. | Job database. |
| `capture_image_actions` | Audit trail for move, unlink, and review actions; drives End of Day wrong-reference confirmation. | Job database. |
| `envelope_scans` | Envelope image, keyed order code, linked subject/order, and review status. | Job database. |
| `orders` | Paper, online, admin, comp, or imported student orders. | Job database. |
| `order_items` | Package codes/products and image selections within an order. | Job database. |
| `payments` | Payment amount/method/reference records used by online-order import and order display. | Job database. |
| `event_entries` | Event image queue and match status. | Event job database. |
| `event_subject_links` | Links event images to Fall-job subjects and orders. | Event job database; TRECS resolves the Fall subject while composing its temporary multi-job working view. |
| `admin_item_batches` | History and options for generated admin items and ID cards. | Job database. |
| `end_of_day_imports` | End of Day package import history and counts. | Job database. |
| `job_milestones` | Manual Production Sync milestones for one job. | Job database. |

## Retained compatibility tables

| Table | Current status | Reason retained |
| --- | --- | --- |
| `image_import_events` | Retained job-level import event history and envelope compatibility references. | Job database; remove later if the compatibility relationship is retired. |
| `migration_sources` | Written only by legacy Access migration tools. | Retain until all legacy databases have been imported. |
| `legacy_mappings` | Legacy source-key-to-new-ID audit records. | Retain with migration tooling until legacy imports are retired. |

## Removed tables

These tables had no runtime readers or writers. Startup removes them only when empty, so an older database with unexpected data is preserved for manual review.

| Table | Why removed |
| --- | --- |
| `client_contacts` | No contact UI or runtime query uses it. School phone/address remain in `clients`. |
| `job_field_definitions` | Planned custom-field system was never implemented. |
| `subject_field_values` | Unused child table of the unimplemented custom-field system. |
| `sync_packages` | Planned sync engine was replaced by onsite setup and End of Day manifests. |
| `sync_record_mappings` | Unused child table of the abandoned sync engine. |
| `sync_conflicts` | Unused child table of the abandoned sync engine. |
| `render_tasks` | Rendering runs directly; no task rows are created or read. |
| `exports` | Output files/manifests are written directly; no export rows are created or read. |

## Redundant database export removed

TRECS previously regenerated `database/program.db` after several operations. Nothing read that file. Automatic generation and its manual export helper have been removed; `ProgramData.db` is the only program-level database.

## Authority and recovery behavior

- Deleting or replacing one job folder removes or replaces that job's operational data without touching another job.
- `ProgramData.db` retains the school and job index needed to locate each job folder.
- A missing `job.db` is recreated as an empty job database from the ProgramData job record. Restoring a damaged job therefore means restoring that job's `Database/job.db` and related image folders.
- Older central databases are converted on startup: populated job-owned tables are exported to their job folders before those tables are removed from ProgramData.
