# TRECS JS Prototype

Electron prototype for the TRECS rebuild.

Continuing on another workstation? Start with [the active handoff](../docs/HANDOFF.md). The next major initiative is [capture headsizing through Lightroom Classic and server merge](../docs/HEADSIZING_MILESTONE_PLAN.md). M1.1–M1.4 software is implemented, including offline JPG Crop Calibration and laptop benchmark reports; live automatic headsizing and production XMP are not enabled.

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
npm run check:headsizing-performance
```

The headsizing foundation check is dependency-free (Node 20+); it needs no photographs, models, server or donor-app folder. `npm run headsizing:fixture` creates synthetic JSON and validation-only XMP under ignored `exports/`. Never put those drafts beside production RAWs. See the [module contract](src/shared/headsizing/SOURCE.md).

**Crop Calibration** is now in TRECS's sidebar. It tests calibration files against JPG folders, displays clean/guide previews, and exports performance comparisons. See the [workflow and metric definitions](../docs/CROP_CALIBRATION_BENCHMARK.md).

For offline, no-job testing using the same app:

```powershell
npm.cmd ci
npm.cmd run prepare:headsizing
npm.cmd run check:headsizing-assets
npm.cmd run start:calibration
```

Preparation requires internet once, or explicit `--archive` and `--model` paths to the pinned offline files. Assets are ignored in Git and bundled into portable builds; the runtime worker denies network access. Existing invalid assets cause an error, not silent replacement. Full licensing is in `licenses/headsizing`.

`npm.cmd run check:calibration-core`, `check:headsizing-worker` and `check:calibration-ui` cover new paths. The two Electron checks accept an optional private portrait path after `--`; no photograph is required by the unit tests. Actual laptop crop quality and sustained performance still require operator testing.

`npm.cmd run build:portable` verifies prepared assets first. Launch the result with `TRECS-Portable.exe --crop-calibration` to avoid database/server/updater startup. This is a mode of the same TRECS executable, not a separate app. Do not publish a test build as a lab rollout.

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

- Headsizing: finish M1.4 real-laptop crop/performance acceptance, then M2.1 actual camera/JPG/RAW/Lightroom inventory. M1.2–M1.4 software is implemented.
- Then a dedicated bounded inference worker and isolated preview harness, followed by real RAW/Lightroom crop validation before production integration. Follow the active milestone plan rather than the historical prototype scope above.
