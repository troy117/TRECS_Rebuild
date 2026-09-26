import { calculateCrop, headTilt, measureMesh, rotateLandmarks, safeTiltCrop, tiltCorrection } from './geometry.mjs';

export const RECIPE_VERSION = 1;
export const ENGINE_VERSION = 'headsizer-0.4-trecs-foundation-1';
export const SELECTION_STATES = Object.freeze(['selected', 'alternate', 'rejected']);
const EPSILON = 1e-7;

function finite(value, label) {
  if (!Number.isFinite(value)) throw new Error(`${label} must be finite`);
  return value;
}

export function validateOrientation(value) {
  if (!Number.isInteger(value) || value < 1 || value > 8) throw new Error('EXIF orientation must be known (1 through 8)');
  return value;
}

export function uprightSize(source, quarterTurn = 0) {
  if (!source || !Number.isSafeInteger(source.width) || !Number.isSafeInteger(source.height)
    || source.width < 1 || source.height < 1) throw new Error('Source pixel dimensions must be positive integers');
  validateOrientation(source.exifOrientation);
  if (![0, 90, 180, 270].includes(quarterTurn)) throw new Error('Quarter turn must be 0, 90, 180 or 270');
  const swap = (source.exifOrientation >= 5) !== (quarterTurn % 180 !== 0);
  return { width: swap ? source.height : source.width, height: swap ? source.width : source.height };
}

export function validateCalibration(calibration) {
  if (!calibration || typeof calibration.id !== 'string' || !calibration.id.trim()
    || !Number.isSafeInteger(calibration.revision) || calibration.revision < 1) throw new Error('Calibration requires an ID and revision');
  const values = calibration.values;
  if (!values || typeof values !== 'object') throw new Error('Calibration values are missing');
  for (const [key, value] of Object.entries(values)) {
    if (key !== 'name') finite(value, `Calibration ${key}`);
  }
  for (const key of ['aspectWidth', 'aspectHeight', 'topGapPx', 'bottomGapPx']) finite(values[key], key);
  if (!(values.aspectWidth > 0 && values.aspectHeight > 0)
    || Math.abs(values.aspectWidth / values.aspectHeight - 0.8) > EPSILON) throw new Error('This calibration must use a 4:5 aspect ratio');
  if (values.topGapPx < 0 || values.bottomGapPx < 0
    || 1 - values.bottomGapPx / values.aspectHeight - values.topGapPx / values.aspectHeight <= 0.01) throw new Error('Invalid calibrated eye/mouth targets');
}

function validateMeasurements(measurements, width, height) {
  for (const name of ['eyes', 'mouth']) {
    const point = measurements?.[name];
    for (const key of ['centerX', 'centerY']) finite(point?.[key], `${name}.${key}`);
    if (point.centerX < 0 || point.centerX > width || point.centerY < 0 || point.centerY > height) throw new Error(`${name} lies outside the upright image`);
  }
  if (measurements.mouth.centerY - measurements.eyes.centerY < 2) throw new Error('Face landmarks do not form an upright face');
  for (const name of ['nose', 'leftEye', 'rightEye']) {
    if (measurements[name]) {
      finite(measurements[name].left, `${name}.left`);
      finite(measurements[name].right, `${name}.right`);
      if (measurements[name].right < measurements[name].left) throw new Error(`Invalid ${name} bounds`);
    }
  }
}

function validateCrop(crop, width, height) {
  for (const key of ['left', 'top', 'right', 'bottom', 'width', 'height']) finite(crop?.[key], `Crop ${key}`);
  if (crop.width <= 0 || crop.height <= 0 || Math.abs(crop.width / crop.height - 0.8) > EPSILON
    || Math.abs(crop.right - crop.left - crop.width) > EPSILON
    || Math.abs(crop.bottom - crop.top - crop.height) > EPSILON
    || crop.left < -EPSILON || crop.top < -EPSILON || crop.right > width + EPSILON || crop.bottom > height + EPSILON) throw new Error('Invalid 4:5 crop bounds');
}

function validateIdentity(captureId, source, selection) {
  if (typeof captureId !== 'string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(captureId)) throw new Error('A stable capture ID is required');
  if (!/^[a-f0-9]{64}$/i.test(source?.sha256 || '')) throw new Error('Source SHA-256 is required');
  if (!SELECTION_STATES.includes(selection)) throw new Error('Selection must be selected, alternate or rejected');
}

// Measurements are in pixel coordinates AFTER EXIF, quarter-turn and fine
// straightening. The worker adapter below performs those landmark transforms.
// This pure function never reads images, changes records or writes sidecars.
export function createCropRecipe({ captureId, source, quarterTurn = 0, detectedTiltDeg,
  measurements, faceCount, calibration, selection = 'alternate' }) {
  if (faceCount !== 1) throw new Error('Exactly one detected face is required; send this photo to review');
  validateIdentity(captureId, source, selection);
  validateCalibration(calibration);
  const upright = uprightSize(source, quarterTurn);
  validateMeasurements(measurements, upright.width, upright.height);
  finite(detectedTiltDeg, 'Detected tilt');
  if (Math.abs(detectedTiltDeg) > 45) throw new Error('Head tilt exceeds the foundation review limit of 45 degrees');
  const tilt = tiltCorrection(detectedTiltDeg);
  const measured = { ...measurements, eyeMouthGap: measurements.mouth.centerY - measurements.eyes.centerY };
  const calculated = calculateCrop(measured, null, upright.width, upright.height, calibration.values);
  const crop = safeTiltCrop(calculated.crop, upright.width, upright.height, tilt.appliedDeg);
  validateCrop(crop, upright.width, upright.height);
  const warnings = [...calculated.warnings];
  if (crop.height < calculated.crop.height - EPSILON) warnings.push('Crop reduced to avoid empty corners after straightening');
  return {
    schemaVersion: RECIPE_VERSION,
    engineVersion: ENGINE_VERSION,
    captureId,
    recipeRevision: 1,
    source: { sha256: source.sha256.toLowerCase(), width: source.width, height: source.height, exifOrientation: source.exifOrientation },
    calibration: structuredClone(calibration),
    selection,
    coordinateSpace: 'upright-after-straightening',
    quarterTurn,
    upright,
    tilt,
    crop,
    measurements: structuredClone(measured),
    warnings,
    reviewState: 'unreviewed',
    rawAlignment: 'unverified',
    labValidation: 'pending',
    productionReady: false
  };
}

// faces is MediaPipe's faceLandmarks array; connections comes from its LEFT_EYE,
// RIGHT_EYE and LIPS constants. Importing this module never loads MediaPipe.
export function createRecipeFromLandmarks({ faces, connections, ...input }) {
  if (!Array.isArray(faces) || faces.length !== 1) throw new Error('Exactly one detected face is required; send this photo to review');
  const points = faces[0];
  if (!Array.isArray(points) || points.length < 468 || points.some(p => !p || !Number.isFinite(p.x) || !Number.isFinite(p.y))) throw new Error('Invalid face landmarks');
  for (const name of ['left', 'right', 'lips']) {
    if (!Array.isArray(connections?.[name]) || !connections[name].length
      || connections[name].some(edge => !edge || [edge.start, edge.end].some(i => !Number.isInteger(i) || i < 0 || i >= points.length))) throw new Error('Invalid landmark connections');
  }
  const { width, height } = uprightSize(input.source, input.quarterTurn);
  const detectedTiltDeg = headTilt(points, width, height);
  const overlayLandmarks = rotateLandmarks(points, width, height, tiltCorrection(detectedTiltDeg).appliedDeg);
  const recipe = createCropRecipe({ ...input, faceCount: 1, detectedTiltDeg,
    measurements: measureMesh(overlayLandmarks, connections, width, height) });
  return { recipe, overlayLandmarks };
}

export function validateRecipe(recipe) {
  if (!recipe || recipe.schemaVersion !== RECIPE_VERSION || recipe.engineVersion !== ENGINE_VERSION
    || recipe.coordinateSpace !== 'upright-after-straightening' || recipe.productionReady !== false
    || recipe.labValidation !== 'pending' || recipe.rawAlignment !== 'unverified'
    || recipe.reviewState !== 'unreviewed' || recipe.recipeRevision !== 1) throw new Error('Unsupported foundation recipe');
  validateIdentity(recipe.captureId, recipe.source, recipe.selection);
  validateCalibration(recipe.calibration);
  const size = uprightSize(recipe.source, recipe.quarterTurn);
  if (size.width !== recipe.upright?.width || size.height !== recipe.upright?.height) throw new Error('Recipe dimensions do not match source orientation');
  validateMeasurements(recipe.measurements, size.width, size.height);
  validateCrop(recipe.crop, size.width, size.height);
  const rebuilt = createCropRecipe({ ...recipe, faceCount: 1, detectedTiltDeg: recipe.tilt?.detectedDeg });
  for (const key of ['left', 'top', 'right', 'bottom', 'width', 'height']) {
    if (Math.abs(recipe.crop[key] - rebuilt.crop[key]) > EPSILON) throw new Error('Recipe crop has changed; manual revisions require the future review API');
  }
  for (const key of ['detectedDeg', 'strength', 'appliedDeg', 'residualDeg']) {
    if (!Number.isFinite(recipe.tilt?.[key]) || Math.abs(recipe.tilt[key] - rebuilt.tilt[key]) > EPSILON) throw new Error('Recipe tilt has changed');
  }
  return recipe;
}
