# TRECS active handoff

Updated: 2026-09-25. Start here when continuing at home.

## Current priority and status

Build the capture-headsizing-to-Lightroom-Classic workflow in [HEADSIZING_MILESTONE_PLAN.md](HEADSIZING_MILESTONE_PLAN.md). Troy authorized implementation through **M1.4**.

**M1.1–M1.4 software is implemented.** Crop Calibration is inside TRECS's left sidebar, including capture-station navigation. It loads a Headsizer calibration and JPG folder, runs offline face-only MediaPipe inference, shows original/clean/guide previews and records laptop benchmarks. Actual capture-laptop quality/performance acceptance remains pending. This is not approval to enable automatic live capture.

Lab: **Lightroom Classic**. Camera models/RAW formats, installed Lightroom version, camera profiles and print ICC requirements remain unconfirmed. Do not infer them from synthetic CR3 examples.

Repository: https://github.com/troy117/TRECS_Rebuild.git

Branch: `agent/capture-station-focus`, not `main`. M1.1 baseline: `07c39e7fae853da0903331cf2e0539a631e4de0a`. The M1.2–M1.4 implementation is identified by commit subject **Build offline crop calibration and laptop benchmarks through M1.4**; use `git log -5 --oneline` for its hash. Git push is not lab deployment.

## Implemented

- **M1.1:** unchanged reusable crop geometry, Fall 2026 calibration, versioned non-production recipe and validation-only XMP serializer.
- **M1.2:** pinned library/WASM/model SHA checks, archive integrity verification, reproducible preparation, full license notices, offline resource paths and portable-build inclusion. Uses existing Electron 31.7.7; no runtime upgrade or CDN access.
- **M1.3:** dedicated sandboxed hidden renderer, CPU IMAGE inference, maximum two faces, EXIF orientation plus deliberate orientation attempts, bounded single-image dispatch, initialization/image deadlines, cancellation and crash/restart isolation. No shared capture-preview queue.
- **M1.4:** integrated Crop Calibration view; calibration/file validation; deterministic optional-recursive folder scan; side-by-side previews/guides; paging and page filters; manual review marks; separate runs/settings comparison; folder throughput and paced/burst simulation; private persisted previews/recipes; sanitized journals and interrupted-report recovery; privacy-safe JSON/CSV/text exports with explicit optional private images/recipes.
- Actual read/decode/orient/detect/crop/encode/write timings, cold/warm summaries, queue waits, system and worker CPU, worker/TRECS working sets, free RAM, main/UI timer delays, AC/battery sampling and operator-entered power/storage settings. Missing readings stay unavailable.
- Local-only launch mode in the **same app**: `--crop-calibration`. It loads the same service/screen without loading the school database, capture watchers, server settings or updater.

**Not implemented/enabled:** live-camera ML hooks, production durable capture queue, production XMP merging, RAW/Lightroom matching, lab color approval, EOD derivative merging or server promotion. These are later milestones. There is no background/hair segmentation, face recognition, automatic calibration activation or automatic photo deletion.

## Run on a capture laptop / continue from home

To retrieve this implementation at home, fetch the working branch without discarding local changes:

```powershell
git status
git fetch origin
git switch agent/capture-station-focus
git pull --ff-only origin agent/capture-station-focus
cd trecs-js
npm.cmd ci
npm.cmd run prepare:headsizing
npm.cmd run check:headsizing-assets
npm.cmd run start:calibration
```

Use Node 20+ (checks here used Node 24.16.0). For a new checkout, clone that branch first. Preparation downloads only pinned upstream assets at development/build time, verifies integrity and retains notices. It does not need the donor folder. On this workstation preparation was tested using the pinned donor archive/model:

```powershell
npm.cmd run prepare:headsizing -- --archive "C:/Users/Render Machine/Desktop/Code/Headsizer 2.0/vendor/tasks-vision.tgz" --model "C:/Users/Render Machine/Desktop/Code/Headsizer 2.0/models/face_landmarker.task"
```

The offline-archive path is tested; the script's direct online download path still needs a clean-machine check. No runtime network requests are allowed by the inference worker.

Local portable test build: `build/headsizing-m1/TRECS-Portable.exe`. Copy the executable to a laptop and start with:

```powershell
.\TRECS-Portable.exe --crop-calibration
```

Alternatively open **Crop Calibration** from normal TRECS. The dedicated switch is safest for no-job testing: normal TRECS still performs its existing database startup. These are the same executable/feature, not separate products. The build was not published to the lab share.

1. Load an approved calibration or click **Use Fall 2026**; select an authorized private JPG folder.
2. Start with 1920 inference / 1000 preview, one CPU worker. Run a folder test, then a simulated shooting rate/burst matching actual use.
3. Review clean and guide crops. Mark good/needs adjustment independently of automatic outcomes.
4. Rerun identical inputs with another calibration or supported size; inspect recorded hardware/settings.
5. Export reports without photos for routine comparison. The **PRIVATE** checkbox adds actual crop/guide JPGs and coordinate-bearing recipes; handle those as private photography data.

Local cache is shown by **Open local results**. Local-only mode uses `%LOCALAPPDATA%/TRECS/Calibration/CropCalibration/runs`; normal mode uses its workstation-local userData cache. It includes source-name mappings, previews and recipes and is not a public diagnostic log. No automatic cleanup is performed.

## Verification

Passed in the installed Electron 31.7.7:

- `check:headsizing`: 11 foundation tests.
- `check:headsizing-performance`: 9 telemetry/export tests.
- `check:calibration-core`: scan/options/path guards, asset rejection, burst scheduling, version-aware CPU units and all EXIF tag parsing.
- `check:headsizing-worker`: real pinned model initialization, no-face/corrupt JPG, eight EXIF/mirror corner-color cases, single-flight rejection, deliberate worker crash/restart and cancellation. With an explicitly supplied private portrait: valid non-production crop and two-face rejection.
- `check:calibration-ui`: real folder processing, crop/guides, review, worker CPU/RAM, sanitized export, forbidden output paths, cancel and partial-journal recovery, byte-for-byte original preservation. Regular TRECS shell/preload/sidebar checked with unrelated job APIs stubbed.
- Regression checks: `check`, `check:image-pipeline` and `check:eod-safety`.
- Portable build completed; asset/licensing verification is a build prerequisite. The real-model worker suite also passed against the packaged source, notices and assets under `win-unpacked/resources` (including orientation, two faces and crash/restart).

Optional private test input (never commit it):

```powershell
npm.cmd run check:headsizing-worker -- "D:/PrivateTests/portrait.jpg"
npm.cmd run check:calibration-ui -- "D:/PrivateTests/portrait.jpg"
```

Without a portrait argument, the checks still run synthetic/no-face/error cases. The UI test screenshot stays under ignored `exports/calibration-ui-check` and may contain the explicitly supplied photo. These checks use their own temporary data; no school catalog/server is modified.

These are workstation functional checks, **not** sustained laptop benchmarks or Lightroom RAW verification. CPU sampling can miss short peaks; Electron 31's normalized CPU is converted to 100% per logical core. The reported TRECS working-set sum may double-count shared memory. No GPU utilization, temperature, watts or battery-life estimate is claimed. Preview canvases use browser-converted sRGB; source ICC metadata is not preserved, and lab color is unapproved.

Known earlier regression limits: `check:capture-compare` has unresolved preview-order/thumbnail expectations; earlier production/events UI checks needed local fixtures. Do not claim these were fixed or that a full live-camera/server test passed.

## Next gate / continuation prompt

The next operator work is M1.4 acceptance on **at least two actual capture laptops**, with the same representative private folder and calibration, normal camera/EOS software running, repeat runs, realistic bursts, and human crop review. A long-folder memory/queue stability check and independent stopwatch/Task Manager comparison remain required. Agree acceptable latency, shooting rate and quality, rather than inventing a readiness score.

Then begin **M2.1** by collecting actual camera/RAW/JPG pairs, Lightroom Classic version and profile defaults. M2 is a hard gate before production sidecars. Do not move straight to live capture or production XMP based on preview success.

> Read docs/HANDOFF.md, docs/HEADSIZING_MILESTONE_PLAN.md and docs/CROP_CALIBRATION_BENCHMARK.md. M1.1–M1.4 software is implemented on agent/capture-station-focus. Review actual laptop benchmark/crop results and remaining acceptance gaps, then start M2.1 with authorized JPG/RAW pairs and the installed Lightroom Classic version. Preserve immutable originals and existing capture/storage behavior. Do not enable production XMP, change lab color settings or deploy to the lab share without the relevant gates and authorization.

## Integration caveats to retain

- Read the [geometry contract](../trecs-js/src/shared/headsizing/SOURCE.md). Landmarks/crops use explicit EXIF, quarter-turn and fine-straightening frames; recipe output stays RAW-unverified and non-production.
- A face guide is not a hair/background mask. The donor's background gains are neither a RAW camera profile nor a print ICC profile.
- JPEG/RAW frames can differ by active area, lens corrections and aspect settings. Mathematically consistent coordinates do not prove Adobe matching.
- Lab-owned XMP/catalog edits require conflict protection and preservation of related sidecars; never overwrite with the validation serializer.
- EOD currently remaps original filenames and database IDs. Future derivatives/recipes must travel with stable identity, revisions and those mappings.
- Keep photos, real landmark data, databases, `path.txt`, downloaded assets and generated builds out of Git. Do not run `publish:lab-update` as part of home development.

Other references: [storage/recovery/deployment](IMAGE_STORAGE_AND_DEPLOYMENT.md), [production protections](PRODUCTION_RECOVERY_AND_DELIVERABLES.md), [conversation notes](CONVERSATION_NOTES.md).
