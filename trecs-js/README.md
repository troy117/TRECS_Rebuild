# TRECS JS Prototype

Electron prototype for the TRECS rebuild.

Continuing on another workstation? Start with [the active handoff](../docs/HANDOFF.md). The next major initiative is [capture headsizing through Lightroom Classic and server merge](../docs/HEADSIZING_MILESTONE_PLAN.md). Its first crop/recipe foundation is implemented; live automatic headsizing and production XMP are not enabled.

Image performance, missing-RAW recovery, backups, and local-laptop/shared-lab configuration are documented in [Image storage and deployment](../docs/IMAGE_STORAGE_AND_DEPLOYMENT.md). Production queue and school delivery changes are in [Production recovery and deliveries](../docs/PRODUCTION_RECOVERY_AND_DELIVERABLES.md).

## Current Scope

- Native desktop shell.
- First dashboard view.
- Preload bridge placeholder for future database and filesystem APIs.
- Uses the existing migration prototype database as a reference point.

## Start

Dependencies are installed locally.

```powershell
npm install
npm start
```

The start script clears `ELECTRON_RUN_AS_NODE` before launching Electron. This matters in the current Codex shell because that environment variable is set globally.

## Current Implementation

- Electron shell launches.
- Dashboard reads counts and job rows from `../database/ProgramData.db`.
- Jobs screen reads job metrics from `../database/ProgramData.db`.
- Job detail workflow tabs read subjects, orders, images, and package/product data.
- Image previews are loaded through the preload bridge.
- Database access currently uses `sql.js` through Electron's main process.

## Checks

```powershell
npm run check
npm run check:db
npm run check:legacy-eod
npm run check:portable-updater
npm run check:headsizing
```

The headsizing foundation check is dependency-free (Node 20+); it needs no photographs, models, server or donor-app folder. `npm run headsizing:fixture` creates synthetic JSON and validation-only XMP under ignored `exports/`. Never put those drafts beside production RAWs. See the [module contract](src/shared/headsizing/SOURCE.md).

## Lab Release

Build and then publish a verified automatic update to the UNC folder configured by `../path-server.txt`:

```powershell
npm run build:portable
npm run publish:lab-update
```

The publishing command writes the executable first and the small update manifest last. See [Image storage and deployment](../docs/IMAGE_STORAGE_AND_DEPLOYMENT.md#automatic-lab-updates) for initial rollout, rollback, and server-permission details.

## Legacy End of Day Export

New End of Day packages automatically include `Legacy TRECS Import.xlsx`. The workbook contains an eight-column `New Records` sheet for the old Add Students screen, exact-reference rows for the legacy End of Day importer, complete changed-subject rows, and before/after change details.

To add the workbook to an End of Day package that was created earlier, pass either its folder or its `end-of-day-manifest.json` file:

```powershell
npm run export:legacy-eod -- "C:\path\to\EOD-package"
```

## Planned Next Implementation

- Headsizing M1.2: pinned offline MediaPipe face assets, licensing/checksum verification and TRECS Electron runtime compatibility.
- Then a dedicated bounded inference worker and isolated preview harness, followed by real RAW/Lightroom crop validation before production integration. Follow the active milestone plan rather than the historical prototype scope above.
