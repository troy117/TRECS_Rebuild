# TRECS Rebuild Conversation Notes

These notes summarize working decisions made while building the JavaScript/Electron prototype so the project can be resumed on another workstation.

## Product Direction

- Rebuild TRECS as an Electron desktop app using JavaScript and SQLite.
- Preserve the current `JOBS/<SCHOOL>/<JOB>` folder structure during the transition.
- Design from the beginning for a shared Windows network drive accessed by multiple workstations.
- Onsite photographers will use standalone laptop packages. Canon EOS software drops images into a local laptop hot folder.
- The shared/server hot folder is only needed for envelope scanning from one computer.
- Envelope scanning is also order entry: the employee scans the envelope and ten-keys the order codes, which should create the paper order and order items.
- Better order management and a more efficient capture/matching workflow are both core goals.
- Online orders can arrive before photography, after photography, or after a batch print; late online orders should enter a render queue.
- Existing package plans can be imported as-is first, then represented with a better product/package/render model.
- Fall order code `90` is deferred for later review.

## Prototype App Decisions

- App shell: Electron.
- Current prototype path: `trecs-js`.
- Prototype database path during development: `database/migration_prototype.db` when present locally.
- Git backup should avoid committing production student photos, Access databases, generated DB files, and `node_modules`.

## Implemented Prototype Features

- Dashboard and Jobs navigation backed by the prototype SQLite database.
- School/client creation from the Jobs screen.
- Job creation with shoot date and retake date.
- Jobs table sorting by location, job, and type.
- Double-clicking a job opens full workspace mode and hides the Jobs menu.
- Student workspace similar in spirit to the old Java `StudentGUI`:
  - Search students by ref/name/ID/grade/homeroom.
  - Navigate previous/next with wraparound.
  - View selected student image, fields, orders, linked images, and notes.
  - Edit student info while keeping reference number read-only.
  - Add multiple blank records with incrementing reference numbers.
  - Render an individual ID-card work list for the current student.
- Admin Items workspace:
  - Output history panel.
  - Output folders grouped by admin item name rather than date folders.
  - Original picture day and makeup day stages.
  - Delivery envelope cover prototype.
  - School directory options inside its admin-item card.
  - Sticker print options inside its admin-item card.
  - SIS Export options for Student CD, Destiny, PowerSchool, and SASI.
  - ID Card options for all students or saved lists, layout, reason, and photographed-only filtering.

## Current Admin Item Behavior

Admin output path convention:

`JOBS/<SCHOOL>/<JOB>/AdminItems/<stage>/<Admin Item Name>/<type>-<timestamp>.<ext>`

Ad hoc/on-demand ID-card output uses:

`JOBS/<SCHOOL>/<JOB>/AdminItems/adhoc/ID Cards/`

Implemented admin item outputs are currently prototype CSV/TXT/manifest files, not final print-ready rendered layouts.

## Fall Admin Item Requirements

After original picture day, once pictures are in the system:

- Render delivery envelope cover page.
- Render school directory with sort/group options such as grade or homeroom.
- Render list of students not photographed.
- Export images/data in school SIS formats.
- Render ID cards.

After makeup day:

- Render updated delivery envelope.
- Render updated school directory.
- Render updated missing report.
- Render IDs for makeup pictures taken.
- Render sticker prints.
- Render staff picture packages.
- Render updated SIS export.

## Next Good Steps

1. Build the actual print-ready ID card renderer from the current ID-card work list and manifest.
2. Decide ID card templates, dimensions, text fields, barcode needs, and output format.
3. Add envelope scan order entry.
4. Add render batch creation from queued orders.
5. Add image/link review queue for conflicts and unlinked images.
6. Add laptop package import validation and merge workflow.
