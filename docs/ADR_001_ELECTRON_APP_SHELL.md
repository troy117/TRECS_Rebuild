# ADR 001: Electron App Shell

## Status

Accepted.

## Decision

The TRECS rebuild will start as an Electron desktop application.

## Context

The final application needs to run on multiple Windows computers and use a shared network-drive workflow. It also needs direct access to local/network folders for:

- `JOBS/<SCHOOL>/<JOB>` compatibility during transition
- hot-folder/capture workflows
- image import and file watching
- render/export output
- SQLite database access
- future printing/export helper workflows

The project also benefits from a JavaScript/TypeScript frontend for faster UI iteration and a Node-side backend layer for filesystem, image, database, and rendering work.

## Why Electron

- Mature Windows desktop packaging.
- Strong Node filesystem access.
- Straightforward SQLite, file watching, and image-processing integration.
- Easier migration path from local folder-based workflows than a browser-only app.
- Good fit for a React/TypeScript operational UI.

## Alternatives Considered

### Tauri

Tauri is lighter and attractive, but introduces Rust-side integration work. Electron is a better first choice for quickly proving the data migration, capture, order, and render workflows in JavaScript.

### Browser-Only Web App

A browser-only app would make local/network file watching, direct image folder access, rendering, and shared-drive production workflows harder.

## Consequences

- The initial prototype will be larger than a Tauri app, but easier to build quickly.
- Main-process code must be designed carefully so database and filesystem work does not block the UI.
- The app should use a secure preload bridge instead of exposing full Node access to the renderer.
- Packaging and update strategy can be decided later.

## Initial Stack

- Electron
- TypeScript
- React
- SQLite
- Node workers for image processing/rendering
- Shared `JOBS/<SCHOOL>/<JOB>` folder compatibility during transition

## Deferred

- Final packaging approach.
- Auto-update approach.
- Whether a future central service is needed for stronger multi-workstation coordination.
- Exact SQLite concurrency strategy on the shared network drive.
