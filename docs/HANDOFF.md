# TRECS active handoff

Updated: 2026-09-25. Start here when continuing at home.

## Current priority

Implement the capture-headsizing-to-Lightroom-Classic workflow in [HEADSIZING_MILESTONE_PLAN.md](HEADSIZING_MILESTONE_PLAN.md). Troy explicitly made this the next major initiative and requested the plan, a portable handoff, the first implementation step and a GitHub push.

Confirmed: lab uses **Adobe Lightroom Classic**. Camera models/RAW formats, installed Adobe version and required print ICC profile are not yet confirmed. Do not infer those from the synthetic CR3 example.

Repository: `https://github.com/troy117/TRECS_Rebuild.git`

Working branch: `agent/capture-station-focus` (not `main`). The previous storage/recovery baseline is `8474aab32cc854013964f315c5a1f59e5a3b2f37`. The new change is identified by commit subject **Plan capture headsizing milestones and add crop recipe foundation**; use `git log -5 --oneline` for its actual hash. Git push does not publish a lab executable.

## Implemented in this slice: M1.1

- Detailed M1-M9 plan with task IDs, dependencies, acceptance gates, code integration points and outstanding decisions.
- Reusable geometry and Fall 2026 calibration ported from supplied Headsizer 2.0 v0.4; provenance/checksums checked in.
- Dependency-free recipe API in `trecs-js/src/shared/headsizing/recipe.mjs`, including a MediaPipe-landmark adapter that does not itself load MediaPipe.
- Validation-only XMP serializer with composed EXIF/quarter-turn orientation and selected/alternate/rejected metadata. It writes no files and does not merge existing sidecars.
- Synthetic test suite and example generator. All recipe outputs are explicitly unreviewed, RAW-unverified and non-production.

**Not implemented:** live inference, camera hooks, durable ML queue, preview JPG writing, review UI, production-sidecar merging, real Lightroom RAW validation, package extensions or server promotion. M1 as a whole is not complete. Existing capture and server behavior are unchanged.

Read the [module contract and caveats](../trecs-js/src/shared/headsizing/SOURCE.md) before using its API. Numeric measurements must already be in the post-EXIF/post-quarter-turn/post-fine-straightening frame. The landmark adapter performs fine straightening for you.

## Continue from home

For a new checkout, use an empty development location:

```powershell
git clone --branch agent/capture-station-focus https://github.com/troy117/TRECS_Rebuild.git
cd TRECS_Rebuild
git log -5 --oneline
cd trecs-js
npm.cmd run check:headsizing
npm.cmd run headsizing:fixture
```

For an existing checkout, first inspect `git status`. Preserve any local work; do not force/reset it. If clean, fetch, switch to the working branch and pull with fast-forward only:

```powershell
git fetch origin
git switch agent/capture-station-focus
git pull --ff-only origin agent/capture-station-focus
```

Use Node 20+ for the foundation; implementation checks ran with Node 24.16.0. On non-Windows systems use `npm` instead of `npm.cmd`. These two new commands require no `npm install`, real photos, MediaPipe assets, local databases, UNC connection or sibling Headsizer folder. The fixture generator creates a unique ignored `exports/headsizing-foundation-*` folder, never a production RAW/sidecar pair.

To work on the full Windows Electron app, install locked dependencies with `npm.cmd ci` from `trecs-js`, then use its documented start/check commands. Do not copy this workstation's `path.txt`, `path-server.txt`, local databases or student photo folders into Git. Do not run `publish:lab-update` as part of ordinary home development.

## Exact next task: M1.2

1. Read the plan, module `SOURCE.md`, `upstream-models.json` and TRECS's image worker/build scripts.
2. Implement reproducible retrieval/preparation of the pinned MediaPipe face library/WASM and `face_landmarker.task`, verifying integrity/checksums and retaining license notices. Do not bundle the older selfie model or BiRefNet in the first face-only slice.
3. Define local runtime paths and portable-build inclusion; runtime must work without CDN/network requests. Fail safely when an asset is missing/corrupt. Keep large downloaded/runtime assets out of Git unless a deliberate distribution decision is documented.
4. Validate initialization and shutdown in TRECS's current Electron runtime, independently of capture and the normal preview queue. The donor app's newer Electron version is not proof of compatibility. Treat an Electron upgrade, if needed, as a separately reviewed change.
5. Add asset-verification/offline/initialization tests and update this handoff with results. Then continue M1.3's bounded worker and M1.4's isolated JPG harness. Do not jump directly to live capture or production XMP.

Suggested continuation prompt:

> Read docs/HANDOFF.md and docs/HEADSIZING_MILESTONE_PLAN.md. Continue M1.2 of the capture headsizing initiative on agent/capture-station-focus. Preserve existing capture behavior, keep processing offline, validate assets and Electron compatibility, run relevant checks, and update the handoff. Do not enable production XMP or deploy to the lab server.

## Important review findings to retain

- Reuse face landmark/crop math, not the entire donor app. Headsizer uses Electron 42/`node:sqlite`; TRECS uses Electron 31/`sql.js`.
- Face landmarks are not hair/background segmentation. First version is fast, face-only, with a clean preview and optional guide overlay. Outline/background processing is optional M8 work.
- Old Headsizer XMP lost an extra quarter turn and treated all alternates as rejected. New draft serializer addresses the math/three-state representation, but actual Adobe RAW fidelity remains **unverified**.
- JPEG and RAW frame mapping must account for orientation, active area, aspect and lens processing. The draft API's same-frame declaration is an explicit assumption, not validation. Do not use its synthetic output beside production RAWs.
- The backdrop reference is not a RAW camera/Adobe profile or an output ICC profile. Automatic backdrop gains/masks must not be assumed to reproduce color correctly in Lightroom.
- Lab settings need ownership and conflict protection. External XMP cannot blindly overwrite catalog edits; preserve `.acr` sidecars when used by the installed Adobe version.
- EOD currently copies/renames originals and remaps database IDs. Future recipes/derivatives/sidecars must travel with those mappings. Import must be idempotent across multiple capture stations.
- Original camera files remain immutable; provisional previews cannot become production images. Reject/alternate states never imply file deletion.

## Verification and limits

M1.1: `check:headsizing` passes all 11 synthetic geometry/recipe/XMP tests; `headsizing:fixture` generates isolated examples successfully and its output parses as XML. Additional regression checks pass: `check`, `check:image-pipeline` (12 tests), and `check:eod-safety`. The fixture XMP is validation-only. No actual RAW was opened in Lightroom for this change, and no inference performance claim is established by these unit tests.

Prior review of the separate Headsizer app passed its own numeric suite and real-model segmentation-gating harness on an isolated sample. Those checks do not prove TRECS Electron compatibility or Adobe RAW matching. Real test photographs/results stay outside Git.

Known earlier repository checks to distinguish from this slice: `check:capture-compare` has unresolved preview-order/thumbnail expectations; earlier production/events UI smoke tests needed unavailable local fixtures. Do not report those as passing or dismiss the capture-comparison failure as merely missing fixture data. No full live-camera, Lightroom or server-deployment test is claimed here.

## Other references

- [Image storage, recovery and deployment](IMAGE_STORAGE_AND_DEPLOYMENT.md): preserve current durability and server configuration rules.
- [Production recovery and deliveries](PRODUCTION_RECOVERY_AND_DELIVERABLES.md): existing production protections.
- [Conversation notes](CONVERSATION_NOTES.md) and [rebuild plan](TRECS_REBUILD_PLAN.md): historical requirements; their older prototype feature lists are not a complete current inventory. This handoff and the headsizing plan define the next work.
