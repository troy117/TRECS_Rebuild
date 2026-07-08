# Electron App Architecture

This document describes the current TRECS JavaScript prototype architecture.

## Current Stack

- Electron desktop app.
- Plain HTML/CSS/JavaScript renderer for the first prototype.
- Electron main process for database access.
- Secure preload bridge with `contextIsolation`.
- `sql.js` for prototype SQLite reads.
- Prototype database: `database/migration_prototype.db`.

## Process Boundaries

### Main Process

File:

- `trecs-js/src/main/main.js`

Responsibilities:

- Create the application window.
- Own database reads.
- Expose IPC handlers:
  - `dashboard:get`
  - `jobs:list`
  - `job:detail`

The main process currently opens the SQLite file read-only in practice by loading database bytes into `sql.js`.

### Preload

File:

- `trecs-js/src/preload/preload.js`

Responsibilities:

- Expose a small `window.trecs` API to the renderer.
- Keep full Node access out of the renderer.

Exposed API:

- `projectRoot`
- `prototypeDatabasePath`
- `getDashboardData()`
- `getJobsData()`
- `getJobDetail(jobId)`
- `getImagePreview(imageId)`

### Renderer

Files:

- `trecs-js/src/renderer/index.html`
- `trecs-js/src/renderer/renderer.js`
- `trecs-js/src/renderer/styles.css`

Responsibilities:

- Dashboard view.
- Jobs view.
- Job detail summary.
- Job workflow tabs:
  - Subjects
  - Orders
  - Images
  - Products

## Current Screens

### Dashboard

Shows:

- client count
- job count
- subject count
- order count
- image count
- active jobs
- migration status

### Jobs

Shows:

- job list from SQLite
- job type filters
- search
- selected job summary
- job folder path
- subject/order/image counts

### Job Workflow Tabs

Subjects:

- reference
- name
- student ID
- grade
- homeroom
- photographed status
- image link state

Orders:

- order ID
- source
- online/reference number
- subject
- paid status
- render status
- item count
- package codes

Images:

- filename
- source
- version count
- width/height
- version types
- linked subject count
- thumbnail/preview support through main-process file access

Products:

- package code
- package name
- item count
- mapped item count
- raw package item values

## Network Drive Notes

The final app should support multiple Windows workstations accessing shared job folders. The current prototype reads a local SQLite copy. Before write workflows are added, we need a concurrency decision:

- continue using SQLite directly from the shared drive with careful locking and limited writes,
- or add a small local/network service to coordinate writes.

For now, prototype screens are read-only.

## Next Architecture Improvements

- Add a small data-access module instead of keeping SQL in `main.js`.
- Add typed query result shapes when TypeScript is introduced.
- Add write-safe database update patterns.
- Add image thumbnail loading through the main/preload bridge.
- Add renderer routing or migrate to React when the UI becomes too large for plain JS.
