# Crop Calibration: JPG review and laptop benchmark

Updated 2026-09-25. **M1.2–M1.4 software is implemented.** This is a left-side screen inside TRECS, not a separate Electron app. Real capture-laptop acceptance is still pending. The future live capture hook will reuse this engine; it is not enabled now.

## Operator workflow

1. Open **Crop Calibration** from TRECS. For a laptop test without database/server startup, use the same executable with `--crop-calibration`, or `npm.cmd run start:calibration` from the source checkout.
2. Load a Headsizer calibration `.txt` (4:5, validated), or choose Fall 2026. Inspect parsed values and its SHA identity. Testing never changes capture settings or overwrites the calibration.
3. Choose a private JPG folder. Subfolders are opt-in; changing that checkbox requires choosing the folder again. The scan is deterministically ordered by relative filename. It does not follow symlinks/junctions, and rejects overlap with the output cache.
4. Choose a mode:
   - **Folder throughput:** every image is eligible after initialization; processes one at a time.
   - **Simulated shooting rate:** releases a chosen burst immediately, then another burst every `burstSize * 60 / photosPerMinute` seconds. There is no camera watcher; it uses the selected static folder.
5. Set inference longest side (960/1280/1920), preview longest side (600/1000/1500), and optional storage/Windows power-mode labels. These labels are operator observations, not automatic detection or changes to Windows.
6. Run, cancel if needed, and inspect original/clean/guide comparisons. The original view is downscaled and oriented for viewing, not a modified source file. Filmstrip pages contain 24 items; filters apply to the current page. Arrow keys navigate when not typing in a control.
7. Mark **Crop looks good** / **Needs adjustment** separately from automatic outcomes. These are calibration evaluation marks, never production approval.
8. Repeat with another calibration/size. Select a comparison run and inspect its frozen hardware/settings; a different or incomplete content fingerprint is explicitly flagged. History shows the latest 100 runs, sorted by start time; older folders remain on disk.
9. Export a local report folder. Photo/recipe export requires the separate **PRIVATE** checkbox.

CPU-only, one isolated worker. Hair/headwear expansion, background segmentation, automatic setting recommendations/activation and production XMP remain outside this slice.

## Assets and runtime

`prepare:headsizing` prepares the pinned face library/WASM/model with archive integrity and per-file SHA-256 checks. Licenses are bundled. Generated assets stay out of Git and are included in portable builds. The local archive/model preparation path and Electron 31.7.7 compatibility were tested; clean-machine direct download still needs checking.

The worker is a sandboxed hidden renderer, separate from both the UI and ordinary TRECS previews, with no Node API, denied permissions and a local-file resource allowlist that rejects network requests. It uses IMAGE mode, up to two faces and fixed confidence 0.5. It tries 0/270/90/180 degrees when needed; multiple faces produce no chosen crop. Each test starts a fresh worker. Startup and image requests have bounded deadlines; cancellation/crash destroys that worker and preserves completed results.

JPEG metadata is checked before decode; EXIF orientation is applied by browser decode once. Eight orientation/mirror cases are tested independently using corner colors. Recipes include calibration/source/model identity, inference settings and unverified RAW/production states.

Preview canvases request sRGB and browser color conversion. Generated JPGs do not preserve source ICC/EXIF metadata. They are **provisional previews, not lab color verification**, and clean/guide images are distinct files. Do not use them as final production renders.

## Measurements and their meaning

| Area | Implemented readings / limits |
| --- | --- |
| Hardware/runtime | CPU model, logical CPUs, available parallelism, total RAM, OS/architecture, TRECS/Node/Electron/Chrome versions. No hostname, serial or account name in reports. |
| Frozen configuration | Calibration, model and source-code build hashes; library/engine versions; sorted content-set fingerprint when every source was read; inference/preview sizes; CPU delegate; concurrency; mode/rate/burst; power/storage labels. |
| Startup | Worker/model initialization, including worker asset verification and setup, separate from first-image processing. Each run restarts the model; OS disk caches may remain warm. |
| Per-image timing | Read/hash, decode, orientation, detection, geometry/crop calculation, preview rendering/JPEG encoding, and cache-write durations. Canvas crop rendering is included in encode, while the crop stage measures geometry. |
| Latency | Processing spans source read through persisted result. Queue wait starts when the image is released (not before its scheduled arrival). Their sum ends at persisted result, **not UI paint or live-camera preview readiness**. |
| Cold/warm | First image after initialization is cold, all later images warm. Warm-successful statistics include only automatic `ok` outcomes; no-face/review/error images cannot inflate successful throughput. Human approval remains separate. |
| Run summary | Total wall time, successful and attempted images/minute, counts and median/p95/max stage/processing/queue/result durations. Total time includes setup and paced idle waits, not later report export or human review. |
| CPU | System utilization includes other apps (0–100%). Collector CPU covers the main process. Worker CPU is measured from its PID/creation identity; shown as 100% per logical core and can exceed 100%. |
| Memory | Main-process RSS, worker working set, free system RAM, sum of TRECS process working sets. The sum may double-count shared memory: it is **not exact unique application RAM**. |
| Queue | Released, unsettled images, including an in-flight image. Future paced arrivals are not queued. Initialization in paced mode has zero released images. |
| Responsiveness | Main timer drift and UI heartbeat drift, not an actual capture-click/paint latency guarantee. |
| Power | AC/battery observation at start and resource samples; Windows power mode/storage type are operator-entered. |
| Quality | Automatic reason/outcome counts, warnings, review marks and human review totals. A face detected successfully does not prove a good crop. |

Resource sampling is approximately once/second, plus initialization/final boundaries; short spikes may be missed. First CPU intervals, crashed/disappeared workers and unsupported readings are `null`, never fabricated zeroes. CPU means are interval-weighted; maxima are sampled peaks. Do not infer temperatures, GPU utilization, electrical watts, thermal throttling or battery life: these are not measured.

Electron 31 exposes normalized interval CPU, not the newer cumulative counter. The adapter multiplies its normalized value by logical processors, with one central `app.getAppMetrics()` sampling owner; it uses cumulative deltas when available and resets on process identity changes. See the pinned [Electron 31 source](https://github.com/electron/electron/blob/v31.7.7/shell/browser/api/electron_api_app.cc#L1196). Memory units are converted from KB to bytes. The pure Node collector's [CPU](https://nodejs.org/api/process.html#processcpuusagepreviousvalue) counters still cover only the process invoking it.

## Stored data, exports and recovery

Local cache contains `run.json` (including private filename/source-folder mapping), per-image JSON/recipes, separate preview JPGs, `reviews.json`, sanitized `events.jsonl` and a final `report.json`. Use **Open local results** to locate it. The no-job mode uses `%LOCALAPPDATA%/TRECS/Calibration/CropCalibration/runs`; normal mode uses its workstation-local userData directory.

No data is uploaded. Collectors/timers run only during a test. Inputs, RAWs, sidecars and calibration files are never written. Each source is reread and hashed per run; unstable/locked/corrupt/oversized files fail individually. A read source must resolve within the selected folder. Only one full image is dispatched at once; scan limit is 10,000 JPGs/50,000 entries, 100 MB/64 megapixels per JPG, and a run is capped at four hours. The UI fetches previews by page/selection. Bounded per-run arrays accompany the append-only journal; this is not an indefinite camera queue.

Cancel preserves completed results, records cancelled/pending counts and destroys the worker. Following application interruption, **Recover partial report** reconstructs a report from complete journal events and retains remaining items as pending. It does not resume processing or claim exact unrecorded elapsed time. Recovering an already completed report does not overwrite it. Restart the folder as a new run to retry. Disk failure may leave an incomplete cache; originals remain unaffected.

There is no automatic cache retention/cleanup. Long tests consume local disk space; use the visible cache path to manage completed test runs under your photography-data retention policy. A long-folder disk/memory stability evaluation is still an acceptance task.

Default export creates a unique `headsizing-benchmark-*` directory:

- `summary.txt`, `report.json`, `images.csv`, `resources.csv`: allowlisted timing/hardware/settings data, sequence numbers only.
- `human-review.json`: evaluation marks by sequence, not production approval.
- `export-complete.json`: written last, confirming the requested export finished.
- Optional `private-previews/`: actual clean/guide JPGs and coordinate-bearing recipes. **This option contains private image/face data.**

Default reports omit JPG names, paths, student names, hostnames, raw errors and face landmarks. Hardware model/version information and content/configuration hashes are intentional. Keep raw cache files private; they do not have the export privacy guarantees. Export destinations cannot be inside the input folder or cache. No output is overwritten. A failed export can leave an incomplete new folder; the completion marker is absent. Export work is not part of inference timing.

## Comparing capture laptops

Use the same representative authorized JPG set, calibration, pinned model and TRECS code revision. Start on AC with normal camera/EOS software running. Record storage and power conditions, repeat runs, and test battery only if that reflects actual shooting. Compare cold startup separately from warm timings.

Test realistic photos/minute and bursts, then check whether the queue grows or clears. Look at p95 and failures/review quality, not only average speed. Reducing inference size may improve speed but requires renewed crop review; reducing preview size may help encode/write overhead. No automatic changes are made.

Keep private benchmark imagery out of Git. Export no-photo reports for configuration discussions. JPEG crop success does not prove RAW frame matching, Lightroom crop interpretation or color fidelity.

## Developer checks / architecture

- `headsizing-assets.js` and `prepare-headsizing-assets.js`: pinned verification/preparation.
- `headsizing-worker.js/.mjs`: hidden renderer lifecycle and inference/preview rendering.
- `calibration-runner.js`: immutable run snapshot, bounded scan/dispatch, sampling, journals, review and exports.
- `calibration-service.js` and preload bridges: trusted-window IPC and native file/folder dialogs.
- `crop-calibration.js/.css`: reusable screen in normal TRECS and its local-only launch mode.
- `headsizing-performance.js`: pure report/sampler/export functions. Schema v2 includes actual worker/TRECS resources, heartbeat timing, burst/power configuration and sample power source; unknown fields are dropped.

From `trecs-js`, run `check:headsizing`, `check:headsizing-performance`, `check:calibration-core`, `check:headsizing-worker` and `check:calibration-ui`. The Electron checks accept an optional private portrait after `--`. Automated coverage includes actual model execution, EXIF mirrors, no/two faces, corrupt images, busy/crash/restart/cancel, regular-shell sidebar, review/export/path guards and journal recovery. No-portrait tests exercise synthetic/error paths. The portable build verifies assets before packaging.

## M1.4 acceptance tracking

- [x] Sidebar and same-app local-only mode accept calibration + JPG folder without an open job; originals preserved; no server dependency in local-only mode.
- [x] Real stage timers and worker CPU/RAM wired into reports; frozen hardware/settings and missing readings explicit.
- [x] Clean/guide review, human marks, separate runs, configuration comparison and private opt-in export.
- [x] Folder versus paced/burst scheduling, cancellation and recoverable partial logs covered by functional tests.
- [ ] Validate metric timing against an independent stopwatch/resource inspection on actual capture laptops.
- [ ] At least two capture laptops process the same representative private folder with repeat runs and human crop approval.
- [ ] Sustained large-folder/realistic shooting test confirms acceptable memory/disk growth, queue drain and UI responsiveness.
- [ ] Clean-machine online preparation and copied portable launch validated on a laptop.
- [ ] Owner approves quality/performance thresholds. Do not call overall M1 accepted until these are recorded.
