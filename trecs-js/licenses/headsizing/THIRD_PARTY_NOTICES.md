# Headsizing third-party notices

TRECS uses unmodified Google MediaPipe Tasks Vision 1.0.1 and the Face Landmarker float16/v1 task locally. Copyright Google LLC and MediaPipe contributors. Licensed under Apache License 2.0; see Apache-2.0.txt in this directory. TRECS is not an official Google or Adobe product.

- Source project: https://github.com/google-ai-edge/mediapipe
- Library: https://www.npmjs.com/package/@mediapipe/tasks-vision/v/1.0.1
- Face landmark model and model card: https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker#models
- Face mesh model card: https://storage.googleapis.com/mediapipe-assets/MediaPipe%20Face%20Mesh%20V2%20Model%20Card.pdf
- Face detector model card: https://storage.googleapis.com/mediapipe-assets/MediaPipe%20BlazeFace%20Model%20Card%20(Short%20Range).pdf
- Blendshape model card: https://storage.googleapis.com/mediapipe-assets/Model%20Card%20Blendshape%20V2.pdf

Source URLs, archive integrity and per-file SHA-256 pins are in src/shared/headsizing/upstream-models.json and asset-lock.json. Library JS/WASM files are extracted without modification from the pinned archive; only the face model is packaged. No BiRefNet or person-segmentation model is included. Preserve this notice and the license with redistributed assets. Electron/Chromium retain their own distribution notices.
