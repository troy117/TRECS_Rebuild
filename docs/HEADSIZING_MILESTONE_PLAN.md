# Capture headsizing to Lightroom Classic: milestone plan

Updated: 2026-09-25. This is the next major TRECS initiative requested by Troy. The lab uses **Lightroom Classic**. The M1-M9 numbers below belong to this initiative, not the historical rebuild milestones.

Status: **M1.1–M1.4 software implemented; real capture-laptop acceptance pending.** Local JPG headsizing/testing is available. Automatic live capture, production XMP, Lightroom integration and server deployment are not enabled. See [HANDOFF.md](HANDOFF.md) for resuming from another workstation.

Clarification approved after M1.1: the JPG testing tool will be a **Crop Calibration** left-menu screen inside TRECS, not a separate app. It will accept a calibration file and JPG folder and include laptop benchmarking/performance exports. See [the screen and benchmark specification](CROP_CALIBRATION_BENCHMARK.md). The screen, offline model worker, previews and telemetry are now implemented. A local-only launch switch uses the same TRECS code without database/server startup; it is not a separate app.

## Intended workflow

1. The camera supplies JPG + RAW to the existing local capture workflow. TRECS verifies and saves both originals and binds them to a stable capture/student identity.
2. The original preview appears immediately. A separate local MediaPipe worker detects facial landmarks, calculates the calibrated crop and straightening, and creates a clean preview JPG plus a switchable face-guide overlay. No cloud upload is required.
3. The photographer reviews the crop, compares shots, and selects the best image. Failed/ambiguous detections retain the original and enter review. Capture continues while processing catches up.
4. End of Day carries verified originals, crop recipes, review/selection states and preview derivatives to the lab. Every image travels, including alternates; rejection is not deletion.
5. The lab merges into permanent server job storage, resolves identity/selection conflicts, and prepares validated RAW-sidecar pairs. Lightroom Classic uses a local catalog referencing those photos.
6. The lab verifies camera profile, lighting/white balance and output color settings, checks individual crops, and renders full-resolution images from RAW.
7. TRECS validates the exported files and promotes only approved lab renders to production. Provisional camera-JPG crops never masquerade as final high-quality images.

The reusable source of truth is a **versioned crop recipe**, not the pixels of a marked-up JPG. A face mesh is a visual guide, not a person/background segmentation mask or face-recognition identity. Keep clean previews and overlays separate so guides never appear in printed products.

## Findings from the supplied Headsizer 2.0

Reviewed source: the user-supplied v0.4 application originally at `C:\Users\Render Machine\Desktop\Code\Headsizer 2.0`. Its sibling folder is not required for the checked-in foundation.

| Finding | Integration decision |
| --- | --- |
| MediaPipe FaceLandmarker provides eye/mouth landmarks and roll; existing calibrated crop math produces 4:5 portraits. | Reuse the math/calibration, isolate the inference worker, retain a manual review path. This is calibrated facial spacing, not a guaranteed measurement of the entire head. |
| Face-only work is much lighter than optional BiRefNet silhouette/background processing. A local sample measured about 0.6-0.7 s face-only versus 5.7-9.0 s with segmentation. | Start face-only; these single-workstation samples are not a laptop throughput promise. Benchmark the actual capture hardware. |
| Its batch workflow does not provide TRECS's durable capture queue or restart recovery. | Build a persisted TRECS queue; never let ML failure compromise original image ingestion. |
| Extra quarter-turn orientation was missing from the old XMP; its pick flag distinguished only selected/rejected. | Foundation composes orientation and represents selected/alternate/rejected separately. Actual Adobe RAW interpretation still needs M2 validation. |
| Existing checks include numerical fixtures and Camera Raw/Photoshop JPG-copy checks, not proven Lightroom Classic RAW parity. | Synthetic tests are necessary but cannot pass the real-RAW acceptance gate. |
| RAW orientation probing is limited; JPG and RAW can have different dimensions, active areas and lens processing. | Require known metadata and an explicit frame mapping; do not guess from the JPG or assume equal filenames imply equal coordinates. |
| Its background reference is RGB statistics/gains; its XMP masks approximate segmentation with brush data. | Do not call that a camera profile or ICC profile; defer background corrections and Adobe mask conversion. Whole-image gains may change skin color. |
| Headsizer uses Electron 42 and `node:sqlite`; TRECS currently uses Electron 31 and `sql.js`. | Port small tested modules, not the entire app/package reader. Confirm runtime compatibility before packaging ML assets. |

## Design rules and ownership

- Originals are immutable. Create derivatives with new paths/revisions; verify source hashes before processing and before publishing results.
- Persist job/student/capture identity at ingest. Worker completion must never consult whichever student happens to be selected on screen later.
- Separate capture selection, crop review, lab approval and production readiness. A picked shot can still need crop/color review.
- Recipes record source identity, coordinate space, calibration/model/engine versions and corrections. Never silently reinterpret an old recipe after an update.
- Once the lab takes ownership of develop settings, capture processing cannot overwrite them. Later crop suggestions become explicit revisions/conflicts.
- Use TRECS's existing verified-copy, journal, locking and recovery infrastructure. Do not hold database locks while decoding or running inference.
- Keep ML local. Real school photos, actual face landmarks, student data, live databases and runtime exports do not belong in Git. Use synthetic fixtures in CI and an access-controlled private validation set.
- Automatic photo deletion/cleanup stays gated by verified handoff, server acceptance and backup policy. This initiative does not weaken existing original-retention protections.

## M1 - Portable engine and isolated prototype

Goal: make the useful Headsizer components reproducible inside TRECS before touching live capture.

- [x] **M1.1 Foundation:** port crop/rotation geometry and Fall 2026 calibration with source provenance; add a dependency-free, versioned JSON recipe API; add a validation-only XMP serializer and synthetic tests/fixture command. Every recipe remains unreviewed and non-production. No models or image data are committed.
- [x] **M1.2 Offline worker setup (software implemented):** verify the pinned face-library/model references, vendor license notices and checksums; add a reproducible asset preparation command and offline packaging/cache strategy. Validate on TRECS's Electron runtime before deciding whether an Electron upgrade needs its own change. Missing/corrupt models must disable headsizing cleanly without affecting capture.
- [x] **M1.3 Isolated inference (implemented):** create a dedicated worker/hidden processing surface separate from the normal image-preview worker. Use IMAGE mode, detect up to two faces to catch ambiguity, cap inference dimensions, and try orientation candidates deliberately. Add bounded concurrency, deadlines, cancellation/restart and structured results. Avoid an unbounded queue of full-resolution image buffers.
- [x] **M1.4 Crop Calibration screen and laptop benchmark (software implemented; hardware acceptance below remains open):** add a left-menu screen inside TRECS, usable without an open job/server, to load a calibration `.txt` and a JPG folder. Decode EXIF once, map landmarks to the original frame, create clean/guide previews and matching recipes, and support side-by-side review and calibration reruns. Preserve input files and never auto-activate a tested calibration. Add folder throughput and paced/burst capture simulation, cold/warm and stage timings, actual worker/system resources, queue/responsiveness measurements, privacy-safe reports and configuration comparisons per [CROP_CALIBRATION_BENCHMARK.md](CROP_CALIBRATION_BENCHMARK.md). Actual worker CPU/RAM and stage timing are wired in. Preview decode uses browser color conversion into an sRGB canvas; source ICC metadata is not preserved. Preview color remains provisional.

Acceptance: clean checkout can prepare assets and use the offline Crop Calibration screen on a JPG folder; missing assets, no face, two faces and worker crash are safe; source hashes remain unchanged; crop math is deterministic. Compare identical inputs/settings on capture laptops using cold/warm timings, measured resource use and backlog behavior. Pass the benchmark specification's M1.4 acceptance checklist. Automated software tests pass, including real model loading, EXIF mirrors, two-face rejection, worker crash/restart and folder UI safety. A portable build has been produced. Clean-machine online asset retrieval, sustained long-folder stability, independent resource comparison, and identical-set checks/human review on at least two actual capture laptops remain open. Do not mark overall M1 accepted until those results are recorded.

## M2 - Prove RAW crop and sidecar fidelity in Lightroom Classic

Depends on M1.1 for math; real comparisons use M1.4. This is a hard gate before production RAW-sidecar generation.

- [ ] **M2.1 Validation inventory:** record actual camera models, RAW formats, camera JPEG settings, orientation cases, lenses, installed Lightroom Classic version, camera profiles and lens-correction defaults. Obtain authorized private JPG/RAW pairs with a trusted manually cropped reference. Add mirrored/quarter-turn synthetic cases; prioritize real camera cases actually used at schools.
- [ ] **M2.2 Metadata/frame mapping:** use a validated metadata reader for each supported format, including non-TIFF formats where needed. Record stored dimensions, EXIF orientation and RAW active/crop areas. Determine the effect of camera JPEG lens correction/aspect choices versus Adobe rendering. Unknown or mismatched frames require review, not a guessed crop.
- [ ] **M2.3 Adobe comparison harness:** import isolated RAW copies and draft XMP into a separate test catalog. Compare independent landmark/crop-edge positions in Lightroom exports against the intended preview for straight, positive/negative roll, portrait/landscape and rotated captures. Verify aspect, top/headroom, selected state, orientation and absence of empty corners. Establish an agreed measurable tolerance and visual approval criteria before scoring the set. Save results and metadata, not private images, in Git.
- [ ] **M2.4 Production XMP adapter:** implement namespace-aware read/merge, preserving unrelated metadata and lab settings. Treat orientation/rotation/crop as one transform contract. Use baseline hashes, explicit field ownership, atomic replace, backups and conflict detection; never reuse the fresh validation-only serializer to overwrite an existing sidecar. Resolve RAW filename/stem after final ingest renaming. Define supported DNG/embedded-metadata handling separately.
- [ ] **M2.5 Selection and sidecar compatibility:** test selected (+1), alternate (0), rejected (-1) on the installed Lightroom version. Check older-version behavior rather than assuming flag portability. Preserve accompanying `.acr` files when the deployed Adobe version uses them; keep XMP/ACR pairs together through backup and handoff.

Acceptance: each declared supported camera/format/settings combination passes independent Lightroom render comparison and metadata-preservation tests. Document unsupported combinations and route them to manual cropping. Do not equate mathematically invertible coordinates with Adobe compatibility.

## M3 - Durable automatic capture processing

Build after M1; prototype integration can precede M2, but keep RAW export disabled until M2 passes.

- [ ] **M3.1 Schema:** add persistent processing tasks, stable portable capture IDs, source hash references, calibration/model snapshots, recipe revisions, derivative roles and separate review/lab states. Use migrations compatible with existing jobs and portable packages.
- [ ] **M3.2 Enqueue after save:** hook verified JPG/RAW ingestion after original files and database records are durable. Handle delayed RAW delivery without losing the JPEG preview or creating duplicate tasks. Freeze the matched subject/session identity.
- [ ] **M3.3 Queue lifecycle:** implement queued/running/complete/review/error states, bounded worker scheduling, attempts/timeouts, restart recovery, idempotent reprocessing and explicit cancel/supersede rules. Persist descriptors, not huge images, in the queue.
- [ ] **M3.4 Safe result publication:** atomically write derivatives, verify hashes/dimensions, and attach only if source/task/revision still matches. Late results cannot overwrite a manual crop, a new selection or a lab-approved render.
- [ ] **M3.5 Operations:** expose pending/failed counts, pause/resume and retry; capture original previews remain usable during model failure, processing lag, disk pressure or restart.

Acceptance: burst capture plus forced worker/app restarts loses no originals or associations, resumes pending work once, and never changes another student's image. Test delayed RAWs, corrupt JPGs, low disk, and source/revision changes.

## M4 - Photographer review and crop controls

Depends on M3's identity/revision contract.

- [ ] **M4.1 Capture display:** show the original immediately, then switch to the provisional head-sized preview for that same image. Label processing/review states and provide clean/guide/original toggles. Preserve chosen-versus-latest comparison behavior.
- [ ] **M4.2 Exceptions:** make no-face, multiple-face, excessive tilt, clipped head, insufficient source margin and unsupported frame warnings visible. Do not silently choose one face in a group photograph.
- [ ] **M4.3 Manual adjustments:** add crop/rotation adjustment, acceptance, undo/reset and reprocess with immutable recipe history. Reprocessing offers a proposal without discarding a reviewed crop.
- [ ] **M4.4 Shoot settings:** select and freeze a calibration per setup/session; track photographer/station/camera/lighting setup and reference-frame associations. Require an explicit choice for applying changed calibration to existing images.
- [ ] **M4.5 Selection:** keep selected/alternate/rejected distinct; synchronize picks with TRECS records, not worker recipe snapshots. Preserve retake and previous-shoot comparison/conflict review.

Acceptance: photographer can complete a simulated class without waiting for ML, resolve exceptions with the keyboard/mouse workflow, and never print a face overlay or mistake a preview for a final lab render.

## M5 - Complete End of Day transfer and server merge

Depends on M3's schema; validated sidecars depend on M2. Extend existing packaging/approval, do not invent a second unconnected import system.

- [ ] **M5.1 Manifest version:** include JPG/RAW originals, recipes, preview/overlay roles, selection/review state, checksums, model/calibration identity and any approved sidecars. Define relative paths, schema negotiation and package/capture identifiers.
- [ ] **M5.2 Consistent snapshot:** drain processing or explicitly package deferred tasks with enough information for safe lab resumption. Never serialize a half-written recipe/derivative or pretend missing RAWs are complete.
- [ ] **M5.3 Validation/staging:** check counts, hashes, decoding, relationships and safe paths before approval. Support interrupted copy/resume and detect a different file under an existing name.
- [ ] **M5.4 Identity-preserving merge:** remap source IDs to server IDs; rename RAW, XMP and derivative references together; preserve immutable capture IDs and source hashes. The current EOD suffix renaming must be reflected in sidecars and recipes, not only image rows.
- [ ] **M5.5 Conflict/idempotency:** repeated import produces no duplicate assets; same filename on two stations does not collide; student edits, existing picks, retakes and lab ownership get explicit conflict rules. Import all new shots while preserving previous production versions.
- [ ] **M5.6 Receipt/recovery:** record accepted package, verified server files, unresolved items and backup/retention state. Test SMB disconnects, failed DB commit, two capture stations and interrupted retry. No automatic source cleanup on a partial handoff.

Acceptance: a full capture package roundtrips into a test server job with every original and recipe linked correctly, including renamed files; reimport is idempotent; old packages remain supported or receive a clear migration path.

## M6 - Lab intake, color verification and Lightroom handoff

Depends on M2 and M5. Start with a documented operator workflow; a Lightroom plug-in is a later option, not an assumed headless API.

- [ ] **M6.1 Intake batch:** merge originals into permanent server storage first and mark them awaiting lab review. Generate/merge approved crop XMP only after identity and final filenames are settled. Assign one lab owner per batch.
- [ ] **M6.2 Lightroom setup:** use a local catalog referencing server originals; agree backup ownership and a non-concurrent editing policy. Import into a named batch/collection with settings that do not replace the intended per-image crops. Verify missing-file and sidecar conflicts before proceeding. Adobe documents the catalog/network-photo distinction in its [catalog guidance](https://helpx.adobe.com/lightroom-classic/desktop/manage-catalogs-and-files/lightroom-catalog-basics.html).
- [ ] **M6.3 Color checklist:** verify the actual camera/Adobe profile and its version, white balance/gray-card reference, exposure and lighting batch, lens settings and monitor setup. Record the lab's required export ICC profile separately. The Headsizer backdrop reference is neither the camera profile nor the output ICC profile.
- [ ] **M6.4 Safe synchronization:** apply only approved shared color settings to a camera/lighting group. Explicitly exclude per-image crop, orientation, geometry and masks from bulk synchronization. Changing lens/geometry settings invalidates crop parity and requires recheck.
- [ ] **M6.5 Metadata ownership:** save existing Lightroom metadata before any external merge; detect changes against the saved baseline and back up sidecars. Do not blindly choose Read Metadata from File after lab editing: it can replace catalog settings. Use a conflict workflow per [Adobe's metadata guidance](https://helpx.adobe.com/lightroom-classic/desktop/organize-photos-in-lightroom-classic/advanced-metadata-actions.html).
- [ ] **M6.6 Approval record:** save final XMP and any ACR sidecars, chosen image/crop revision, color preset/profile identifiers and lab reviewer/time. Preserve the catalog backup as well; sidecars do not represent all catalog organization. Adobe describes current external sidecar behavior in [XMP/ACR guidance](https://helpx.adobe.com/lightroom-classic/desktop/organize-photos-in-lightroom-classic/create-xmp-acr-files.html).

Acceptance: operator can ingest a mixed-camera test batch, verify color against approved reference images, preserve all individual crops and continue after an interrupted session without guessing which settings are authoritative.

## M7 - Full-resolution export and production promotion

Depends on M6; never promote capture previews here.

- [ ] **M7.1 Export contract:** define approved resolution/quality, file format, sharpening, expected embedded ICC profile and naming from the lab's print/delivery requirements. Establish an export manifest mapping stable capture ID, source/recipe revision, lab batch and output path. Begin with a controlled Lightroom export preset and manifest reconciliation; evaluate a plug-in only if needed.
- [ ] **M7.2 Staging validator:** confirm expected files/counts, decodability, dimensions/aspect, identity mapping, profile presence/value and current selection/revision. A correct ICC tag alone does not prove correct skin tone or rendering; retain human color/crop approval. Missing/extra/ambiguous/stale outputs remain quarantined.
- [ ] **M7.3 Promote:** verified-copy approved large renders into versioned production storage and register them with existing TRECS image versions. Generate 480x600 medium previews from the approved large render, preserving compatible `CroppedLarge`/`CroppedMed` consumers without confusing provisional versions with final ones.
- [ ] **M7.4 Re-render/rollback:** record source/recipe/sidecar/export hashes and replace the active production pointer only after a complete validated revision. Keep the prior approved version and audit trail; propagate changed picks to downstream readiness safely.
- [ ] **M7.5 Downstream checks:** verify orders, ID cards, school exports and production queues choose approved lab outputs and report pending renders clearly.

Acceptance: end-to-end test produces correctly linked, color-approved final outputs; wrong profile, missing images, stale revisions and failed copy cannot mark a batch production-ready. No filename-only match can silently select the wrong child's image.

## M8 - Optional hair/headwear and background refinement

Do not make these heavier features a prerequisite for the first face-only pilot.

- [ ] **M8.1 Outline evaluation:** test varied hair volume, headwear, glasses, skin tones, backgrounds, poses and ages with authorized samples. Compare face-only crops to reviewed human crops; define when outline expansion helps versus creates an error.
- [ ] **M8.2 Separate processing tier:** benchmark pinned BiRefNet or another approved segmentation model on actual capture laptops; run as a lower-priority optional task with resource limits. Never replace a manually accepted crop automatically.
- [ ] **M8.3 Background diagnostics first:** associate backdrop references with setup/camera/lighting and flag drift. Any automatic pixel adjustment requires independent skin/color validation and a reproducible RAW equivalent; it is off by default.
- [ ] **M8.4 Mask parity:** treat soft PNG masks and Adobe editable masks as different representations. Only enable transferable background edits after proving them in the installed Adobe version and preserving related sidecars.

Acceptance: measurable quality benefit without capture slowdown, crop regressions or skin-color changes; unsupported cases keep the approved face-only/manual result. Ship independently if this work takes longer.

## M9 - Pilot, rollout and operational handoff

Depends on M1-M7; M8 can remain disabled.

- [ ] **M9.1 Performance targets:** agree actual peak photos/minute, burst length, preview latency and acceptable queue drain time. Use M1.4's repeatable laptop benchmark and report format to measure p50/p95, CPU/worker memory, disk growth, responsiveness and failure/review rates across a full simulated school day on the intended hardware. Record AC/battery conditions; do not infer readiness from average folder throughput alone.
- [ ] **M9.2 Failure matrix:** test app/worker crash, power loss simulation, partial JPG/late RAW, model missing/corrupt, queue backlog, disconnected share, duplicate packages, two stations, Lightroom conflict and export retry.
- [ ] **M9.3 Private golden set:** maintain versioned expected outcomes, explicit supported camera/settings combinations, human crop/color approval, and regression reports before any model/calibration/runtime upgrade. Keep photographs and actual landmark data out of the source repository.
- [ ] **M9.4 One-station pilot:** feature flag headsizing, train photographer and lab operator, complete a limited shoot through final rendering, reconcile counts and exceptions, and obtain owner sign-off before broad use.
- [ ] **M9.5 Release:** create a verified offline portable build with license notices, backups, migration/rollback instructions, operator checklist and support logs that avoid student/face data. Publishing the executable to the lab server requires a separate rollout action; a Git push is not deployment.

Acceptance: an agreed pilot reconciles every captured original and final chosen render; restart/handoff/rollback drills pass; performance and operator sign-off are recorded. Only then enable broadly.

## Existing TRECS integration map

Use function names, not frozen line numbers, when returning to the code:

| Existing area | Planned change |
| --- | --- |
| `trecs-js/src/main/main.js`: `importCaptureImageCore` | Enqueue only after verified original save and database commit; release job locks before inference. |
| `trecs-js/src/main/image-processing.js` | Keep ordinary previews responsive; new ML tasks need a separate bounded worker/queue. |
| `createEndOfDayPackage` | Snapshot originals plus recipes/derivatives and explicit deferred processing. |
| `copyEndOfDayImageFiles`, `approveEndOfDayPackage` | Extend current original-only handling with derivative import, stable identity and sidecar/stem remapping. |
| `getImagePreview` | Add provisional preview roles without changing production's approved-image contract. |
| `syncCroppedImages`, `generateCroppedMediumImages` | Reconcile lab exports using manifests/revisions; generate medium only from approved large images. |

MediaPipe's synchronous detection must not run on the interactive UI thread; Google's [web guide](https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker/web_js) documents that behavior. Preserve the current storage rules in [IMAGE_STORAGE_AND_DEPLOYMENT.md](IMAGE_STORAGE_AND_DEPLOYMENT.md).

## Decisions still needed

These did not block M1.2–M1.4 implementation, but must be settled at their gates:

- M2: actual camera models/RAW formats, representative JPG+RAW pairs, lens/camera JPEG settings, installed Lightroom Classic version and quantitative crop tolerance.
- M3/M9: intended laptop specifications, maximum shooting rate and acceptable backlog.
- M4: approved head-size/headroom calibration(s), manual review defaults and who can revise them.
- M5/M6: server intake ownership, lab batch owner, backup/retention policy and current catalog organization.
- M6/M7: approved RAW camera profile(s), color/gray reference procedure and required print/export ICC profile(s). Do not assume sRGB is the production lab requirement.

## First slice verification

From `trecs-js`, `npm run check:headsizing` checks numerical compatibility, recipe validation, landmark transforms, all 32 EXIF/quarter-turn combinations, 160 rotated crop quadrilaterals, safe corners and three-state pick metadata. `npm run headsizing:fixture` creates synthetic JSON/XMP under ignored `exports/`. Neither requires the sibling Headsizer folder, photographs, models, server access or dependency installation. See the [module contract](../trecs-js/src/shared/headsizing/SOURCE.md).
