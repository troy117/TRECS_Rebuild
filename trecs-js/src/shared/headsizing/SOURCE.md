# Headsizing foundation (M1.1)

This is the dependency-free first slice of the [headsizing milestone plan](../../../../docs/HEADSIZING_MILESTONE_PLAN.md). It is not connected to capture or production. No models, RAW decoder, image writer, database writer or Lightroom automation load here.

## Provenance

The user supplied Headsizer 2.0 v0.4 for reuse in TRECS. `legacy-crop.mjs`, `geometry.mjs` and `calibrations/fall-2026.txt` come from that reviewed application. The legacy crop math is unchanged. `geometry.mjs` omits the old XMP generator, which only distinguished pick/reject and did not serialize an additional quarter turn. Original source SHA-256 values are in `source-provenance.json`. The calibration records 66 accepted reference crops; its head sizing uses eye/mouth anchors rather than a universal anatomical head-height estimate.

These project-specific modules are not Google's MediaPipe library. `upstream-models.json` records the reviewed model/library versions, checksums, URLs and stated licenses for the future worker. M1.1 does not bundle or download those distributions. Add the actual vendor/model license notices when bundling them in M1.2. The retained upstream manifest mentions an older selfie model; the reviewed prototype actually uses BiRefNet lite for segmentation. M1.2 needs only the face model.

## Contract

- `createRecipeFromLandmarks({ faces, connections, captureId, source, quarterTurn, calibration, selection })` accepts MediaPipe's `faceLandmarks` result and its left-eye/right-eye/lip connections. Landmarks must refer to the image after EXIF orientation and the additional quarter turn. It applies fine straightening before measuring the crop, returning `{ recipe, overlayLandmarks }`.
- `createCropRecipe(...)` is the lower-level numeric interface. Its `measurements` are pixel coordinates **after** EXIF, quarter turn and fine straightening. Do not pass unrotated measurements with a nonzero `detectedTiltDeg`. Callers must supply the actual detection count.
- `source.width/height` describe the stored, unrotated JPEG raster. `source.exifOrientation` is required, not guessed. `source.sha256` identifies the original JPEG content; `captureId` is a stable portable capture identity, not a filename or the selected student's current screen position. Database allocation/persistence comes in M3.
- `quarterTurn` is clockwise degrees after EXIF, one of 0/90/180/270. Fine rotation keeps the canvas dimensions. `crop` is an axis-aligned pixel rectangle on this final canvas. `upright` gives those dimensions. The normalized RAW mapping is generated separately, never confused with this coordinate space.
- `calibration` contains `{ id, revision, values }`; values are snapshotted into the recipe. The first implementation supports only 4:5, face-only crops. Hair expansion and manual revisions come later.
- `selection` is `selected`, `alternate` or `rejected`; the default is alternate. A selection snapshot is not authority to change a student's primary image. Later export must use the current DB selection.
- Every foundation recipe is unreviewed, RAW alignment unverified, lab validation pending and `productionReady: false`. Finite dimensions/measurements, supported aspect, a single face and a maximum 45-degree head roll are enforced. This limit is a proposed review threshold, not a model accuracy claim.
- `validateRecipe` roundtrips JSON and rejects inconsistent dimensions/tilt/crop. It is structural validation, not a cryptographic signature or a substitute for file-hash verification.

## Validation-only XMP

`createValidationXmp(recipe, raw, selection?)` returns text. `raw` needs a proprietary RAW basename, stored pixel dimensions, known EXIF orientation, and `framing: 'assumed-same-upright-frame'`. The EXIF-oriented RAW and JPEG frames must have the same aspect. This declaration makes the assumption explicit; it does not prove matching active areas or lens corrections. RAW and JPEG resolution can differ proportionally. DNG/embedded metadata is intentionally deferred.

The mapping reverses fine rotation about the image center, maps the crop center/sides back through EXIF/quarter turns and writes the crop angle. The composed `tiff:Orientation` retains the additional quarter turn. Tests reconstruct corner positions mathematically; only real Lightroom renders can establish Adobe's interpretation. M2 must confirm or correct that interpretation before production.

The generated draft contains crop/orientation and three-state pick metadata only. It does not add white balance, color curves, camera profiles, masks, or a guessed Adobe ProcessVersion. It does not read/merge/overwrite existing XMP. `trecs:ValidationOnly` is an advisory label, not an Adobe enforcement mechanism: never copy drafts beside production RAWs. All file handling, existing-sidecar merge, revision ownership and final-render approval remain future work.

## Run from a clean checkout

Use Node 20+ (Node 24 was used during implementation). From `trecs-js`:

```powershell
npm run check:headsizing
npm run headsizing:fixture
```

Neither command requires `npm install`, the original Headsizer folder, MediaPipe models, real photographs or the server. The fixture command creates a unique ignored `exports/headsizing-foundation-*` folder with synthetic input/recipe JSON and `synthetic.validation.xmp`. No real RAW is generated. These commands also work outside Windows. The full TRECS Electron app continues to use its existing dependencies and Windows launch scripts.
