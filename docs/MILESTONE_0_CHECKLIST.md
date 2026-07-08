# Milestone 0 Checklist

Goal: understand enough of the current system to design the new JavaScript/SQLite foundation without accidentally losing important production behavior.

## Status

- [x] Summarize current TRECS application responsibilities.
- [x] Create initial rebuild roadmap.
- [x] Add repeatable Access schema inspection helper.
- [x] Extract schema and row counts from `ProgramData.accdb`.
- [x] Extract schema and row counts from available fall student databases.
- [x] Extract schema and row counts from available senior databases.
- [x] Document observed job folder layouts.
- [ ] Inspect package plan rows and decode how `f1` through `f15` map to output products.
- [ ] Inspect sample order values from fall jobs.
- [ ] Inspect sample senior `Orders` memo values.
- [ ] Inspect image naming conventions across `CroppedLarge`, `CroppedMed`, `Images`, and `Chosen`.
- [x] Draft first SQLite schema.
- [x] Validate first SQLite schema against a temporary database.
- [x] Create migration prototype source for Access-to-SQLite import.
- [x] Import master schools, jobs, package plans, and one fall job into prototype SQLite database.
- [x] Convert fall `Order1` and `Order2` into normalized `orders` and `order_items`.
- [x] Split dot-separated order codes into separate order items.
- [x] Document package/order code parsing findings.
- [x] Draft product seed data and product alias mapping.
- [x] Apply product aliases to mapped package item rows in the prototype database.
- [x] Normalize and map performance/group print package item values.
- [x] Import senior JSON-style `Orders` into the prototype.
- [x] Import senior gallery/access codes into `subject_codes`.
- [x] Import fall and senior image assets into the prototype.
- [x] Link senior order items to image assets by filename.
- [x] Defer unmatched fall order code `90` for later review.
- [x] Decide app shell: Electron.
- [x] Create initial `trecs-js` Electron prototype folder.
- [x] Install Electron dependencies.
- [x] Connect Electron dashboard to `database/migration_prototype.db`.
- [x] Add launcher that clears `ELECTRON_RUN_AS_NODE` for app startup.
- [x] Launch-test Electron shell.
- [x] Replace prototype dashboard `sqlite3` CLI calls with `sql.js`.
- [x] Add first Jobs screen backed by the prototype database.
- [x] Add job detail workflow tabs for subjects, orders, images, and products.
- [x] Add image width/height metadata extraction for image versions.
- [x] Document Electron app architecture.
- [x] Add image thumbnail preview support through the preload bridge.
- [x] Draft capture workflow design.
- [x] Add a read-only Capture planning view for selected jobs.
- [x] Add subject detail and order detail panels.
- [x] Decide the first write workflow: notes editing.
- [x] Add subject and order notes editing to the Electron prototype.
- [x] Decide hot-folder strategy for on-site laptops and server envelope scanning.
- [x] Draft capture session and image import queue database tables.
- [x] Add render-ready order queue filtering.
- [x] Add image selection/linking as the next write workflow.
- [x] Design standalone laptop sync/import workflow.
- [x] Draft laptop sync package, record mapping, and conflict tables.
- [x] Decide envelope scan imports create paper orders and order items.
- [x] Draft envelope scan audit table.
- [x] Add order status update actions for queueing, holding, and marking rendered.
- [x] Add subject/image search controls for faster manual matching.
- [x] Add new job creation workflow for testing prototype features.
- [x] Add school/client creation from the Jobs screen.
- [x] Replace new-job due date entry with shoot date and retake date.
- [x] Add full-screen job workspace that hides the Jobs menu when a job is opened.
- [x] Add student workspace navigation, search, edit, notes, and order/image panels.
- [x] Add multi-record blank student creation with incrementing reference numbers.
- [x] Add Admin Items workspace with output history.
- [x] Add School Directory admin item options inside its card.
- [x] Add Sticker Prints admin item options inside its card.
- [x] Add SIS Export options for Student CD, Destiny, PowerSchool, and SASI.
- [x] Add ID Card admin item options and current-student on-demand ID card rendering.
- [x] Document conversation decisions and prototype status for GitHub handoff.

## Milestone 1 Status

- [x] Stabilize app shell.
- [x] Create core app navigation.
- [x] Build job detail screen.
- [x] Add subject browser.
- [x] Add order browser.
- [x] Add image metadata extraction.
- [x] Create first product/package view.
- [x] Replace prototype hard-coding with database-backed views.
- [x] Document app architecture.
- [x] Verify completion criteria with checks and launch test.
- [ ] Draft first JavaScript app architecture decision record.
- [ ] Decide first MVP scope.

## Recommended MVP Scope

Initial recommendation:

- Desktop JavaScript app.
- Fall job management.
- Student import/edit/search.
- Image preview and basic image linking.
- New multi-order model.
- Online order import and render status tracking.
- Package plan import.
- Basic render-ready order queue, even if rendering itself comes later.

Reason:

- Fall jobs are the center of the current system.
- Spring, seniors, events, and leagues all reuse concepts from fall jobs.
- The biggest data-model improvement is replacing `Order1` and `Order2` with real order records.

## Open Questions For Troy

- [x] Should the first version preserve the existing `JOBS/<SCHOOL>/<JOB>` folder structure while we transition?
  - Yes. The rebuild should preserve the existing job folder structure during transition.
- [x] Should the app be local-only first, or should it assume a shared network location from the beginning?
  - The final version will live on a network drive accessed by multiple Windows computers. Design for shared network operation from the beginning.
- [x] Which is more urgent: faster capture/image matching or better order management?
  - There is no rush; both matter. Prioritize better order management and a more efficient capture system as core goals.
- [x] Do online orders need to be in the first MVP or can they follow right after the paper-order workflow?
  - Online orders are part of the real workflow and should be modeled early. Some online orders arrive before photography, some after, and some are rendered after batch print when they come into the system.
- [x] Are package plans stable enough to import as-is, or should we redesign the product catalog before importing them?
  - Package plans can be imported as-is, but the new app should store and render them with a better product/package structure.

## Architecture Decisions From Troy

- Preserve existing `JOBS/<SCHOOL>/<JOB>` layout during the transition.
- Design for multiple Windows computers accessing a shared network drive.
- Treat order management and capture efficiency as the two core rebuild priorities.
- Include online orders in the early data model and MVP planning.
- Import existing package plans, then normalize them into a better package/product/render model.

## Next Technical Tasks

1. [x] Prototype "Prepare Laptop Package" export for one selected job.
2. [x] Add a basic new-job creation workflow for test jobs.
3. [x] Add school/client creation for test jobs.
4. [ ] Prototype envelope scan order entry for one selected job.
5. [ ] Add render batch creation from queued orders.
6. [ ] Add an image/link review queue for conflicts and unlinked images.
7. [ ] Add laptop package import validation for manifest/job matching.
8. [ ] Build print-ready ID card layout renderer from the current ID-card work list.
