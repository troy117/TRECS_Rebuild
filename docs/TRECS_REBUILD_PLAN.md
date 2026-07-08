# TRECS JavaScript Rebuild Plan

This document is a first working map of the existing TRECS V7 software and a proposed path for rebuilding it as a cleaner JavaScript application. It is meant to be revised as we talk through the real production workflow.

## Current Software Summary

TRECS is a desktop production system for school photography jobs. It manages schools, shoot jobs, student/player/senior/event records, image capture, image matching, order entry, package plans, specialty products, rendering, exports, and admin reports.

The existing app is a Java Swing application using Microsoft Access databases and a folder-based job structure.

Core storage:

- `ProgramData.accdb`: master registry for schools, jobs, package plans, and ID templates.
- Per-job databases under `JOBS/<SCHOOL>/<JOB>/Database`.
- Per-job image and output folders such as `CroppedLarge`, `CroppedMed`, `Processed`, `Templates`, `Exports`, `Notes`, and job-type-specific folders.

Supported job types:

- `FALL`: main school picture day workflow.
- `SPORTS`: similar to fall, with sports-specific group and memory mate output folders.
- `SPRING`: follow-up job linked to a fall job.
- `SENIORS`: senior portraits linked to grade 12 students from a fall job.
- `EVENT`: event photography linked to a fall job.
- `QREVENT`: event photography with QR/download support.
- `LEAGUE`: player/team workflow.

## Existing Feature Inventory

### Job And School Management

Recommendation: keep and redesign.

Current behavior:

- Maintain school/location records.
- Create jobs by type.
- Assign package plans and student/faculty ID templates.
- Store job notes.
- Filter jobs by school and type.
- Prevent simultaneous job editing with a `CurrentlyOpen.txt` lock file.
- Support local mode and remote/network mode.

Rebuild direction:

- Use a proper database-backed lock/session model instead of text files.
- Add job status, due dates, shoot dates, lab/production status, and delivery status.
- Treat each school as a client/location with contact records.
- Let one school have many shoots and many production batches.

### Subject Records

Recommendation: merge into a unified subject model.

Current behavior:

- Fall/sports students have reference number, name, ID, grade, homeroom, track, photo flag, custom fields, notes, and two order fields.
- Spring students have image, name, homeroom, grade, orders, notes, and text fields.
- Seniors have name, student ID, homeroom, notes, JSON-like order data, and unique codes.
- Events have image, name, homeroom, order, and notes.
- Leagues have player names, team, image, and order.

Rebuild direction:

- Create one flexible `Subject` model that supports students, staff, seniors, players, teams, guests, siblings, and generic event subjects.
- Use configurable fields per job type rather than separate hard-coded database schemas.
- Keep stable reference numbers, but allow aliases, external IDs, barcodes, QR codes, and imported IDs.

### Capture And Image Matching

Recommendation: keep as a major workflow, rebuild deeply.

Current behavior:

- Watches `TrecsHotFolder`.
- Reads log/chosen files.
- Links new camera images to student references.
- Shows current student image and latest captured image.
- Tracks photographed status.
- Supports search and manual linking.
- Creates medium/large/small crop workflows in different modules.

Rebuild direction:

- Make image ingestion a first-class queue with statuses: imported, matched, needs review, cropped, exported, archived.
- Support manual drag/drop matching and barcode/QR-driven matching.
- Add duplicate detection, missing-photo dashboards, and bulk relink tools.
- Store image metadata and sidecar crop/render instructions rather than relying only on renamed files.

### Order Entry

Recommendation: replace the current two-order structure.

Current behavior:

- Student records contain `Order1`, `Order1Pay`, `Order2`, and `Order2Pay`.
- Data entry screens scan/reference a student, show photo and envelope scans, and save order codes.
- Scanner hot folders are watched for envelope images.
- Batch order rendering exists across jobs.
- Spring/senior/event orders have separate formats.

Rebuild direction:

- Create a normalized order model:
  - Customer/order header.
  - One or many subjects.
  - One or many line items.
  - Payments, discounts, notes, source, and fulfillment status.
- Support multiple orders per student/family without limits.
- Support multiple children in one order.
- Track paper orders, online orders, late orders, retakes, add-ons, comp/free orders, and staff/admin orders consistently.
- Preserve fast keyboard-driven data entry.

### Package Plans And Products

Recommendation: keep, but move into configurable product/catalog tools.

Current behavior:

- Package plans are stored in `ProgramData.accdb`.
- Package plan rows contain package code, name, and up to 15 fields.
- Template files in `Templates` define package output assets such as portrait envelopes, CD covers, QR code layouts, and prep items.
- Render add-ons include buttons, calendars, CD envelopes, CDs, fun packs, keychains, magnets, mousepads, mugs, notecards, and QR codes.

Rebuild direction:

- Build a product catalog with package codes, product definitions, quantities, print sizes, crop rules, template rules, and output destinations.
- Separate products from package plans.
- Make package plans versioned so old jobs keep their original definitions.
- Add a visual or structured template editor later, but start with editable JSON/template files.

### Rendering And Production Output

Recommendation: keep, but rebuild as a job queue.

Current behavior:

- Render packages from order codes.
- Render envelopes, labels, large envelopes, Excel reports, prep sheets, add-ons, and specialty products.
- Render fall/sports, spring, senior, event, QR event, and league outputs separately.

Rebuild direction:

- Use a render queue with progress, errors, retry, and output history.
- Support batch rendering across selected jobs.
- Make render outputs reproducible from stored order/product/template/image data.
- Track whether each order is ready, rendered, checked, printed/exported, and delivered.
- Treat admin deliverables as first-class render/export batches, not one-off tools.
- Let fall jobs generate different admin item checklists based on shoot stage: original picture day vs makeup day.
- Store the output type, shoot stage, sort/filter options, generated path, status, and timestamp for every admin item.

Fall original picture day admin items:

- Delivery envelope cover page after all original pictures are imported.
- School directory with selectable sort/group options such as grade, homeroom, track, or name.
- Missing/not-photographed report.
- SIS image/data exports in school-specific formats.
- ID cards for the original picture day students/staff.

Fall makeup day admin items:

- Updated delivery envelope cover page.
- Updated school directory.
- Updated missing/not-photographed report.
- ID cards for makeup-day pictures only.
- Sticker prints.
- Staff picture packages.
- Updated SIS image/data exports.

Readiness rules:

- Original picture day admin items become ready after the first shoot's images are imported and linked.
- Makeup-day admin items become ready after makeup images are imported and linked.
- Makeup-day ID cards and sticker prints should filter to subjects photographed during makeup day, not all subjects.
- Directories, missing reports, and SIS exports should be rerunnable because school data and image links can change.

### Lists, Reports, And Admin Tools

Recommendation: keep the useful ones, merge related tools.

Current behavior:

- Student lists.
- Senior lists.
- Barcode list maker.
- Missing report.
- Homeroom count.
- Data verification.
- Student export.
- Certificate export.
- School directory.
- Order tally.
- Admin items before/after makeup day.

Rebuild direction:

- Create a reporting dashboard with saved filters.
- Keep list-making as a general tagging/grouping feature.
- Merge one-off reports into exportable report templates.
- Add audit history for important data changes.
- Move fall admin items into the render/export queue so they can be generated, regenerated, reviewed, and tracked by shoot stage.

### Onsite Workflow

Recommendation: keep and clarify.

Current behavior:

- Create onsite setup.
- Load onsite setup.
- Merge onsite data.
- Create camera cards.
- Prep/crop/rename images.
- Create end-of-day output.

Rebuild direction:

- Treat onsite capture as a syncable job mode.
- Support local/offline capture stations and a later merge into the master job.
- Replace ad hoc folder transfer with import packages and validation.

### Specialty Job Types

Recommendation: keep the job-type concept, but share more infrastructure.

Current behavior:

- Spring, seniors, events, QR events, leagues, and sports each have custom screens and databases.

Rebuild direction:

- Use a shared core for jobs, subjects, images, orders, products, rendering, and exports.
- Add job-type-specific screens only where the workflow truly differs.
- Make job type configurable enough to add future shoot types without duplicating the whole app.

## Proposed Product Model

Core entities:

- Client/location
- Contact
- Job/shoot
- Capture session
- Subject
- Subject group/list/team/class
- Image asset
- Crop/version
- Order
- Order item
- Product
- Package plan
- Template
- Render batch
- Export/delivery
- Payment
- Note/task
- User/session

## Recommended JavaScript Architecture

Starting direction:

- Desktop app: Electron.
- Frontend: React + TypeScript.
- Local database: SQLite.
- Image processing: Node-side worker using Sharp.
- File watching: Node file system watcher.
- Rendering: worker queue with persisted jobs.
- Import/export: CSV, JSON, current Access migration, and folder import.
- Storage mode: shared Windows network drive with multiple workstations.
- Transition compatibility: preserve the existing `JOBS/<SCHOOL>/<JOB>` folder layout.

Why this direction:

- The app still needs local file access, image folders, hot folders, and production output.
- A browser-only web app would make file watching and local rendering harder.
- SQLite gives a clean upgrade path from scattered Access databases while staying simple and local.
- The shared network drive requirement means the app must handle file locking, job locking, concurrent readers, and cautious write workflows from the beginning.

Workflow decisions added during prototype work:

- Photographers will use standalone laptop packages onsite.
- Canon EOS software drops images into a local hot folder on each onsite laptop.
- The shared/server hot folder is only for envelope scanning from one computer.
- Envelope scanning should create paper orders because the same employee scans the envelope and ten-keys order codes.
- On-demand ID cards are needed outside admin events for the current student and school replacement/request workflows.
- Git backup should keep code, docs, schema, and tooling, but should not commit live student photos, Access databases, generated SQLite databases, or `node_modules`.

## Rebuild Milestones

### Milestone 0: Discovery And Migration Map

Goal: fully document the current production workflow and database shapes.

Deliverables:

- Current feature inventory reviewed with Troy.
- Access table map for `ProgramData.accdb` and each job database type.
- Folder structure map for each job type.
- Keep/merge/replace/retire decision for each current tool.
- Sample data migration plan.

### Milestone 1: App Shell And Core Database

Goal: create the new JavaScript desktop foundation.

Deliverables:

- New app shell.
- SQLite schema for clients, jobs, subjects, images, orders, products, package plans, and render batches.
- Basic navigation: dashboard, jobs, clients, settings.
- Import of schools and jobs from `ProgramData.accdb` or exported CSV.
- Basic job creation.

### Milestone 2: Fall Job MVP

Goal: rebuild the main school picture day workflow first.

Deliverables:

- Fall job detail screen.
- Student import and editing.
- Fast search by reference, name, ID, grade, homeroom.
- Student photo preview.
- Lists/groups.
- Missing photo and photographed status.
- Basic notes.

### Milestone 3: Capture And Image Matching

Goal: replace the hot-folder capture workflow.

Deliverables:

- Watch folder setup.
- Image import queue.
- Match images to subjects.
- Manual correction/relinking.
- Current subject/latest image capture screen.
- Crop/version records.
- Output to `CroppedLarge` and `CroppedMed` compatibility folders if needed.

### Milestone 4: Order Entry 2.0

Goal: build the improved multiple-order system.

Deliverables:

- Unlimited orders per subject/family.
- Multiple line items per order.
- Payment/status tracking.
- Fast keyboard-first data entry.
- Envelope scan attachment.
- Online order import framework for orders entered before or after photography.
- Online order render queue for orders that arrive after batch print.
- Order review dashboard.

### Milestone 5: Package Plans And Rendering

Goal: produce real production outputs.

Deliverables:

- Product catalog.
- Package plan editor.
- Render queue.
- Basic package rendering.
- Labels/envelopes/prep exports.
- Render history and error handling.

### Milestone 6: Spring, Seniors, Events, Leagues

Goal: expand from fall MVP to other shoot types.

Deliverables:

- Spring jobs linked to fall jobs.
- Senior jobs generated from selected/imported students.
- Event and QR event workflows.
- League/team/player workflow.
- Shared order and render infrastructure reused across all job types.

### Milestone 7: Admin, Reports, And Polish

Goal: replace the long tail of helper tools.

Deliverables:

- Missing reports.
- Homeroom/class counts.
- Barcode/QR lists.
- Data verification.
- Student exports.
- Certificate exports.
- Specialty products.
- Batch cross-job rendering.
- Backup/restore tools.

## Current Prototype Progress Notes

The Electron prototype now includes:

- Jobs dashboard and Jobs screen backed by the prototype SQLite database.
- School/client creation.
- Job creation with shoot date and retake date.
- Sortable Jobs table and double-click-to-open workflow.
- Full-screen job workspace that hides the Jobs menu while a job is open.
- Student workspace with search, image preview, order info, notes, edit student, multiple blank record creation, and wraparound previous/next navigation.
- Admin Items workspace with stage selection, output history, and item-specific option panels.
- Admin output folders grouped by admin item name.
- School Directory options inside the School Directory card.
- Sticker Print options inside the Sticker Prints card.
- SIS Export options for Student CD, Destiny, PowerSchool, and SASI.
- ID Card options for admin batches and an individual current-student ID-card render action.

Prototype admin item outputs currently create CSV/TXT/manifest files. The next rendering pass should turn those work lists into print-ready layouts.

## First Decisions

These choices affect the whole rebuild:

- The app should be a desktop JavaScript app designed for a shared Windows network drive.
- The app should preserve the current `JOBS/<SCHOOL>/<JOB>` folder layout during transition.
- The first MVP should center on fall jobs, better order management, and a more efficient capture/image matching workflow.
- Online orders should be central from the start because they can arrive before photography, after photography, or after batch print.
- Existing package plans can be imported as-is, then represented with a better product/package/render model.

## Suggested Next Step

Build the actual print-ready ID card renderer from the current ID-card work list and manifest, then continue into envelope scan order entry and render batch creation.
