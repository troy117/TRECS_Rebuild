import { createRecipeFromLandmarks, uprightSize } from '../shared/headsizing/recipe.mjs';
import { readJpegMetadata } from '../shared/headsizing/jpeg-metadata.mjs';
let face, connections, edges, modelIdentity;
const now = () => performance.now();
function oriented(bitmap, rotation, maxSide) {
  const swap = rotation % 180 !== 0, w = swap ? bitmap.height : bitmap.width, h = swap ? bitmap.width : bitmap.height;
  const scale = Math.min(1, maxSide / Math.max(w, h));
  const canvas = new OffscreenCanvas(Math.max(1, Math.round(w * scale)), Math.max(1, Math.round(h * scale)));
  const ctx = canvas.getContext('2d', { colorSpace: 'srgb' });
  ctx.translate(canvas.width / 2, canvas.height / 2); ctx.rotate(rotation * Math.PI / 180);
  ctx.scale(scale, scale); ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2); ctx.resetTransform();
  return canvas;
}
const jpeg = async canvas => new Uint8Array(await (await canvas.convertToBlob({ type: 'image/jpeg', quality: .9 })).arrayBuffer());
function cropped(bitmap, recipe, maxSide) {
  const height = Math.max(5, Math.floor(Math.min(maxSide, recipe.crop.height) / 5) * 5);
  const canvas = new OffscreenCanvas(height * .8, height), ctx = canvas.getContext('2d', { colorSpace: 'srgb' });
  const c = recipe.crop, scale = height / c.height;
  ctx.scale(scale, scale); ctx.translate(-c.left, -c.top);
  ctx.translate(recipe.upright.width / 2, recipe.upright.height / 2);
  ctx.rotate((recipe.tilt.appliedDeg + recipe.quarterTurn) * Math.PI / 180);
  ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2); ctx.resetTransform();
  return canvas;
}
function guides(canvas, recipe, points) {
  const ctx = canvas.getContext('2d'), c = recipe.crop;
  const p = points.map(point => ({ x: (point.x * recipe.upright.width - c.left) * canvas.width / c.width,
    y: (point.y * recipe.upright.height - c.top) * canvas.height / c.height }));
  ctx.strokeStyle = '#41e6d3'; ctx.lineWidth = Math.max(1, canvas.width / 600); ctx.beginPath();
  for (const edge of edges) { ctx.moveTo(p[edge.start].x, p[edge.start].y); ctx.lineTo(p[edge.end].x, p[edge.end].y); }
  ctx.stroke(); ctx.setLineDash([8, 6]); ctx.strokeStyle = '#ffe082';
  const cal = recipe.calibration.values;
  for (const y of [cal.topGapPx / cal.aspectHeight, 1 - cal.bottomGapPx / cal.aspectHeight]) {
    ctx.beginPath(); ctx.moveTo(0, y * canvas.height); ctx.lineTo(canvas.width, y * canvas.height); ctx.stroke();
  }
}
async function processPhoto(request) {
  const stageMs = {}; let bitmap, orientationAttempts = 0, failureReason = 'decode';
  try {
    let started = now();
    const metadata = readJpegMetadata(request.bytes);
    bitmap = await createImageBitmap(new Blob([request.bytes], { type: 'image/jpeg' }), { imageOrientation: 'from-image', colorSpaceConversion: 'default' });
    const expected = uprightSize(metadata);
    failureReason = 'frame';
    if (bitmap.width !== expected.width || bitmap.height !== expected.height) throw new Error('Decoded JPEG orientation/dimensions do not match its metadata');
    stageMs.decode = now() - started;
    let selected, reason = 'no-face'; stageMs.orient = 0; stageMs.detect = 0; stageMs.crop = 0;
    for (const quarterTurn of [0, 270, 90, 180]) {
      started = now(); const input = oriented(bitmap, quarterTurn, request.inferenceMaxDimension);
      stageMs.orient += now() - started;
      started = now(); failureReason = 'model'; const found = face.detect(input).faceLandmarks;
      stageMs.detect += now() - started; orientationAttempts++;
      input.width = 1; input.height = 1;
      if (found.length > 1) { reason = 'multiple-faces'; break; }
      if (!found.length) continue;
      started = now();
      try {
        selected = createRecipeFromLandmarks({ faces: found, connections, captureId: request.captureId,
          source: { ...metadata, sha256: request.sha256 }, quarterTurn, calibration: request.calibration, selection: 'alternate' });
      } catch { reason = 'tilt'; }
      stageMs.crop += now() - started;
      if (selected) break;
    }
    started = now(); failureReason = 'other';
    const original = oriented(bitmap, selected?.recipe.quarterTurn ?? 0, request.previewMaxDimension);
    const buffers = { original: await jpeg(original) }; original.width = 1; original.height = 1;
    let thumbnail;
    if (selected) {
      selected.recipe.inference = { ...modelIdentity, delegate:'cpu', inferenceMaxDimension:request.inferenceMaxDimension,
        numFaces:2, minFaceDetectionConfidence:.5, minFacePresenceConfidence:.5 };
      const clean = cropped(bitmap, selected.recipe, request.previewMaxDimension);
      buffers.clean = await jpeg(clean);
      thumbnail = oriented(clean, 0, 180); buffers.thumbnail = await jpeg(thumbnail);
      guides(clean, selected.recipe, selected.overlayLandmarks); buffers.guide = await jpeg(clean);
      clean.width = 1; clean.height = 1;
    } else {
      thumbnail = oriented(bitmap, 0, 180); buffers.thumbnail = await jpeg(thumbnail);
    }
    thumbnail.width = 1; thumbnail.height = 1; stageMs.encode = now() - started;
    return { outcome: selected ? (selected.recipe.warnings.length ? 'review' : 'ok') : 'review',
      reason: selected ? (selected.recipe.warnings.length ? 'margin' : 'none') : reason,
      recipe: selected?.recipe ?? null, warnings: selected?.recipe.warnings ?? [reason === 'multiple-faces' ? 'Multiple faces: no crop selected.' : 'No usable upright single-face crop.'],
      width: metadata.width, height: metadata.height, orientationAttempts, stageMs, buffers,
      previewColor: 'Browser-converted sRGB canvas; source ICC is not preserved; provisional, not lab color approval.' };
  } catch (error) { return { outcome: 'failed', reason: failureReason, stageMs, orientationAttempts, warnings: [error.message], buffers: {} }; }
  finally { bitmap?.close(); }
}
window.headsizingWorker.listen(async request => {
  try {
    if (request.type === 'init') {
      modelIdentity = { libraryVersion:request.libraryVersion, modelSha256:request.modelSha256 };
      const { FaceLandmarker, FilesetResolver } = await import(request.moduleUrl);
      connections = { left: FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, right: FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, lips: FaceLandmarker.FACE_LANDMARKS_LIPS };
      edges = [...connections.left, ...connections.right, ...connections.lips, ...FaceLandmarker.FACE_LANDMARKS_FACE_OVAL];
      face = await FaceLandmarker.createFromOptions(await FilesetResolver.forVisionTasks(request.wasmUrl), {
        baseOptions: { modelAssetPath: request.modelUrl, delegate: 'CPU' }, runningMode: 'IMAGE', numFaces: 2,
        minFaceDetectionConfidence: .5, minFacePresenceConfidence: .5, outputFaceBlendshapes: false, outputFacialTransformationMatrixes: false
      });
      window.headsizingWorker.reply({ id: request.id, result: { delegate: 'cpu' } });
    } else if (request.type === 'process') {
      window.headsizingWorker.reply({ id: request.id, result: await processPhoto(request) });
    }
  } catch (error) { window.headsizingWorker.reply({ id: request.id, error: error.message }); }
});
window.headsizingWorker.reply({ ready: true });
