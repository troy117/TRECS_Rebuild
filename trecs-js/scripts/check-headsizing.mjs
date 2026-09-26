import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { calibrationFromText, calculateCrop, rawCrop, safeTiltCrop } from '../src/shared/headsizing/geometry.mjs';
import { createCropRecipe, createRecipeFromLandmarks, validateRecipe, uprightSize } from '../src/shared/headsizing/recipe.mjs';
import { composeOrientation, createValidationXmp } from '../src/shared/headsizing/validation-xmp.mjs';

const calibration = { id: 'fall-2026', revision: 1, values: calibrationFromText(fs.readFileSync(
  new URL('../src/shared/headsizing/calibrations/fall-2026.txt', import.meta.url), 'utf8')) };
const source = { width: 6000, height: 4000, exifOrientation: 1, sha256: 'a'.repeat(64) };
function input(overrides = {}) {
  return { captureId: 'fixture-capture-001', source, quarterTurn: 270, detectedTiltDeg: 5,
    faceCount: 1, selection: 'alternate', calibration,
    measurements: { eyes: { centerX: 2000, centerY: 1800 }, mouth: { centerX: 2000, centerY: 2230 } }, ...overrides };
}
const raw = { fileName: 'fixture.CR3', width: 6000, height: 4000, exifOrientation: 1, framing: 'assumed-same-upright-frame' };
const approx = (a, b, epsilon = 1e-7) => assert.ok(Math.abs(a - b) < epsilon, `${a} != ${b}`);
const read = (xml, name) => Number(xml.match(new RegExp(`${name}="([^"]+)"`))?.[1]);

test('preserves the two recorded Headsizer/Photoshop geometry fixtures', () => {
  const fixtures = [
    { eye: [2158, 1898.5], mouth: [2136.5, 2403.5], top: 1090, sliver: 2111,
      nose: [100, 106], leftEye: [100, 110], rightEye: [200, 210],
      expected: [620.107, 583.894, 3469.988, 4146.245], xmp: [.308959, .155027, .902684, .867497] },
    { eye: [2108.5, 1931.5], mouth: [2101, 2325], top: 1202, sliver: 2060.5,
      nose: [150, 160], leftEye: [100, 110], rightEye: [200, 210],
      expected: [909.714, 895.757, 3134.920, 3677.265], xmp: [.387123, .227429, .850707, .78373] }
  ];
  for (const f of fixtures) {
    const m = { eyes: { centerX: f.eye[0], centerY: f.eye[1] }, mouth: { centerX: f.mouth[0], centerY: f.mouth[1] },
      eyeMouthGap: f.mouth[1] - f.eye[1], ...Object.fromEntries(['nose', 'leftEye', 'rightEye'].map(key =>
        [key, { left: f[key][0], right: f[key][1] }])) };
    const { crop } = calculateCrop(m, { bounds: { top: f.top }, sliverCenterX: f.sliver }, 4000, 6000, calibration.values);
    ['left', 'top', 'right', 'bottom'].forEach((key, i) => approx(crop[key], f.expected[i], .001));
    const mapped = rawCrop(crop, 4000, 6000, 270, 1);
    ['left', 'top', 'right', 'bottom'].forEach((key, i) => approx(mapped[key], f.xmp[i], .000001));
  }
});

test('recipe roundtrips as JSON, preserves source identity and calibration snapshot', () => {
  const parameters = structuredClone(input());
  const recipe = createCropRecipe(parameters);
  assert.equal(recipe.captureId, parameters.captureId);
  assert.equal(recipe.source.sha256, source.sha256);
  assert.equal(recipe.productionReady, false);
  assert.equal(recipe.labValidation, 'pending');
  approx(recipe.crop.width / recipe.crop.height, .8);
  assert.deepEqual(validateRecipe(JSON.parse(JSON.stringify(recipe))), recipe);
  parameters.calibration.values.topGapPx = 1;
  parameters.measurements.eyes.centerY = 1;
  assert.equal(recipe.calibration.values.topGapPx, 1107.083);
  assert.equal(recipe.measurements.eyes.centerY, 1800);
});

test('face-only calibration aligns eye and mouth targets without outline shifts', () => {
  const recipe = createCropRecipe(input({ source: { ...source, width: 1000, height: 1200 }, quarterTurn: 0,
    detectedTiltDeg: 0, calibration: { id: 'synthetic', revision: 1,
      values: { aspectWidth: 800, aspectHeight: 1000, topGapPx: 300, bottomGapPx: 500, eyeCenterOffsetXPx: 0 } },
    measurements: { eyes: { centerX: 500, centerY: 400 }, mouth: { centerX: 500, centerY: 500 } } }));
  assert.deepEqual(recipe.crop, { left: 300, top: 250, right: 700, bottom: 750, width: 400, height: 500 });
  assert.deepEqual(recipe.warnings, []);
});

test('invalid or ambiguous detections fail for review without a fabricated recipe', () => {
  for (const faceCount of [0, 2, undefined]) assert.throws(() => createCropRecipe(input({ faceCount })), /one detected face/);
  for (const detectedTiltDeg of [NaN, Infinity, 46, -46]) assert.throws(() => createCropRecipe(input({ detectedTiltDeg })));
  assert.throws(() => createCropRecipe(input({ captureId: '' })), /capture ID/);
  assert.throws(() => createCropRecipe(input({ source: { ...source, sha256: '' } })), /SHA-256/);
  assert.throws(() => createCropRecipe(input({ source: { ...source, exifOrientation: null } })), /orientation/);
  assert.throws(() => createCropRecipe(input({ source: { ...source, width: 0 } })), /dimensions/);
  assert.throws(() => createCropRecipe(input({ quarterTurn: 45 })), /Quarter turn/);
  assert.throws(() => createCropRecipe(input({ selection: 'chosen' })), /Selection/);
  const bad = structuredClone(calibration);
  bad.values.aspectWidth = 3000;
  assert.throws(() => createCropRecipe(input({ calibration: bad })), /4:5/);
  bad.values.aspectWidth = 2400; bad.values.eyeCenterOffsetXPx = NaN;
  assert.throws(() => createCropRecipe(input({ calibration: bad })), /finite/);
  assert.throws(() => createCropRecipe(input({ measurements: { eyes: { centerX: NaN, centerY: 1 }, mouth: { centerX: 1, centerY: 4 } } })), /finite/);
});

test('landmark adapter straightens independent synthetic eye landmarks', () => {
  const points = Array.from({ length: 478 }, () => ({ x: .5, y: .4, z: 0 }));
  points[33] = { x: .39, y: .30 }; points[133] = { x: .41, y: .30 };
  points[362] = { x: .59, y: .32 }; points[263] = { x: .61, y: .32 };
  points[13] = { x: .48, y: .39 }; points[14] = { x: .52, y: .41 };
  const connections = { left: [{ start: 33, end: 133 }], right: [{ start: 362, end: 263 }], lips: [{ start: 13, end: 14 }] };
  const parameters = { ...input(), faces: [points], connections };
  const { recipe, overlayLandmarks } = createRecipeFromLandmarks(parameters);
  assert.ok(recipe.tilt.detectedDeg > 0);
  const lx = (overlayLandmarks[33].x + overlayLandmarks[133].x) / 2;
  const ly = (overlayLandmarks[33].y + overlayLandmarks[133].y) / 2;
  const rx = (overlayLandmarks[362].x + overlayLandmarks[263].x) / 2;
  const ry = (overlayLandmarks[362].y + overlayLandmarks[263].y) / 2;
  const residual = Math.atan2((ry-ly)*6000, (rx-lx)*4000)*180/Math.PI;
  // Headsizer intentionally corrects only part of tilts above five degrees.
  approx(residual, recipe.tilt.residualDeg);
  assert.ok(Math.abs(residual) < Math.abs(recipe.tilt.detectedDeg));
  assert.throws(() => createRecipeFromLandmarks({ ...parameters, faces: [] }), /one detected face/);
  assert.throws(() => createRecipeFromLandmarks({ ...parameters, faces: [points, points] }), /one detected face/);
  assert.throws(() => createRecipeFromLandmarks({ ...parameters, connections: {} }), /connections/);
});

// Independent forward/inverse EXIF and rotation transforms for reconstruction.
const forward = ([x, y], e) => [null, [x, y], [1-x, y], [1-x, 1-y], [x, 1-y], [y, x], [1-y, x], [1-y, 1-x], [y, 1-x]][e];
const inverse = (p, e) => forward(p, e === 6 ? 8 : e === 8 ? 6 : e);
const turnPoint = ([x, y], t) => t === 90 ? [1-y, x] : t === 180 ? [1-x, 1-y] : t === 270 ? [y, 1-x] : [x, y];
function rotateAround([x, y], [cx, cy], degrees) {
  const r = degrees * Math.PI / 180;
  return [cx + (x-cx)*Math.cos(r) - (y-cy)*Math.sin(r), cy + (x-cx)*Math.sin(r) + (y-cy)*Math.cos(r)];
}

test('all 32 EXIF/quarter-turn compositions preserve ordered orientation markers', () => {
  for (let exif = 1; exif <= 8; exif++) for (const turn of [0, 90, 180, 270]) {
    const orientation = composeOrientation(exif, turn);
    for (const point of [[.1, .2], [.8, .15], [.6, .9]]) {
      const actual = forward(point, orientation), expected = turnPoint(forward(point, exif), turn);
      actual.forEach((value, axis) => approx(value, expected[axis]));
    }
  }
  assert.equal(composeOrientation(1, 270), 8, 'the 270-degree sample must carry an orientation override');
});

test('160 XMP crop quadrilaterals match independent inverse preview transforms', () => {
  for (let exif = 1; exif <= 8; exif++) for (const quarterTurn of [0, 90, 180, 270]) for (const tilt of [-45, -5, 0, 5, 45]) {
    const s = { ...source, exifOrientation: exif };
    const size = uprightSize(s, quarterTurn), w = size.width, h = size.height;
    const recipe = createCropRecipe(input({ source: s, quarterTurn, detectedTiltDeg: tilt,
      measurements: { eyes: { centerX: w*.5, centerY: h*.4 }, mouth: { centerX: w*.5, centerY: h*.46 } } }));
    const xmp = createValidationXmp(recipe, { ...raw, exifOrientation: exif });
    const left = read(xmp, 'crs:CropLeft') * source.width, right = read(xmp, 'crs:CropRight') * source.width;
    const top = read(xmp, 'crs:CropTop') * source.height, bottom = read(xmp, 'crs:CropBottom') * source.height;
    const actual = [[left,top],[right,top],[right,bottom],[left,bottom]].map(p =>
      rotateAround(p, [(left+right)/2, (top+bottom)/2], read(xmp, 'crs:CropAngle')));
    const c = recipe.crop;
    const expected = [[c.left,c.top],[c.right,c.top],[c.right,c.bottom],[c.left,c.bottom]].map(p => {
      const [x,y] = rotateAround(p, [w/2,h/2], -recipe.tilt.appliedDeg);
      const q = inverse(turnPoint([x/w,y/h], (360-quarterTurn)%360), exif);
      return [q[0]*source.width,q[1]*source.height];
    });
    for (const p of expected) assert.ok(actual.some(q => Math.hypot(p[0]-q[0],p[1]-q[1]) < .001), `EXIF ${exif}, turn ${quarterTurn}, tilt ${tilt}`);
    assert.equal(read(xmp, 'tiff:Orientation'), composeOrientation(exif, quarterTurn));
  }
});

test('safe rotation fits source corners even at photo edges', () => {
  for (const angle of [-25, -5, 0, 5, 25]) {
    const c = safeTiltCrop({ left: 0, top: 0, right: 4000, bottom: 5000, width: 4000, height: 5000 }, 4000, 6000, angle);
    for (const p of [[c.left,c.top],[c.right,c.top],[c.right,c.bottom],[c.left,c.bottom]]) {
      const [x,y] = rotateAround(p, [2000,3000], -angle);
      assert.ok(x >= -1e-7 && x <= 4000+1e-7 && y >= -1e-7 && y <= 6000+1e-7);
    }
  }
});

test('RAW mapping allows proportional resolution and a different stored orientation', () => {
  const recipe = createCropRecipe(input());
  const original = createValidationXmp(recipe, raw);
  const larger = createValidationXmp(recipe, { ...raw, width: 9000, height: 6000 });
  for (const attribute of ['crs:CropLeft', 'crs:CropTop', 'crs:CropRight', 'crs:CropBottom', 'crs:CropAngle']) {
    approx(read(original, attribute), read(larger, attribute));
  }
  // This RAW is stored portrait with EXIF 6; its upright scene matches the
  // landscape JPEG with EXIF 1. Do not copy the JPEG's orientation onto it.
  const rotatedRaw = { ...raw, width: 4000, height: 6000, exifOrientation: 6 };
  const xmp = createValidationXmp(recipe, rotatedRaw);
  assert.equal(read(xmp, 'tiff:Orientation'), 1);
  const l = read(xmp, 'crs:CropLeft') * rotatedRaw.width, r = read(xmp, 'crs:CropRight') * rotatedRaw.width;
  const t = read(xmp, 'crs:CropTop') * rotatedRaw.height, b = read(xmp, 'crs:CropBottom') * rotatedRaw.height;
  const actual = [[l,t],[r,t],[r,b],[l,b]].map(p => rotateAround(p, [(l+r)/2,(t+b)/2], read(xmp, 'crs:CropAngle')));
  const c = recipe.crop, { width: w, height: h } = recipe.upright;
  for (const p of [[c.left,c.top],[c.right,c.top],[c.right,c.bottom],[c.left,c.bottom]]) {
    const [x,y] = rotateAround(p, [w/2,h/2], -recipe.tilt.appliedDeg);
    const normalized = inverse(turnPoint([x/w,y/h], 90), rotatedRaw.exifOrientation);
    const expected = [normalized[0]*rotatedRaw.width,normalized[1]*rotatedRaw.height];
    assert.ok(actual.some(q => Math.hypot(expected[0]-q[0],expected[1]-q[1]) < .001));
  }
});

test('validation XMP separates selected/alternate/rejected and contains no color/masks', () => {
  const recipe = createCropRecipe(input());
  for (const [selection, pick] of Object.entries({ selected: 1, alternate: 0, rejected: -1 })) {
    const xmp = createValidationXmp(recipe, { ...raw, fileName: 'A&B.CR3' }, selection);
    assert.equal(read(xmp, 'xmpDM:pick'), pick);
    assert.equal(read(xmp, 'tiff:Orientation'), 8);
    assert.ok(xmp.includes('A&amp;B.CR3'));
    assert.ok(xmp.includes('trecs:ValidationOnly="True"'));
    assert.doesNotMatch(xmp, /ToneCurve|CameraProfile|MaskGroup|ProcessVersion|Exposure|WhiteBalance/);
  }
});

test('unknown RAW orientation, framing mismatches and modified recipes block XMP', () => {
  const recipe = createCropRecipe(input());
  assert.throws(() => createValidationXmp(recipe, { ...raw, exifOrientation: null }), /orientation/);
  assert.throws(() => createValidationXmp(recipe, { ...raw, framing: undefined }), /framing/);
  assert.throws(() => createValidationXmp(recipe, { ...raw, width: 4000 }), /aspect ratios/);
  assert.throws(() => createValidationXmp(recipe, { ...raw, fileName: '../file.CR3' }), /basename/);
  assert.throws(() => createValidationXmp(recipe, { ...raw, fileName: 'file.DNG' }), /DNG/);
  assert.throws(() => createValidationXmp({ ...recipe, productionReady: true }, raw), /Unsupported/);
  assert.throws(() => createValidationXmp({ ...recipe, tilt: { ...recipe.tilt, appliedDeg: NaN } }, raw), /tilt/);
  assert.throws(() => createValidationXmp({ ...recipe, crop: { ...recipe.crop, left: recipe.crop.left + 10 } }, raw), /bounds/);
});
