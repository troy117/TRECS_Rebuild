// Generate portable, non-photographic examples for inspecting the M1 contract.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { calibrationFromText } from '../src/shared/headsizing/geometry.mjs';
import { createCropRecipe } from '../src/shared/headsizing/recipe.mjs';
import { createValidationXmp } from '../src/shared/headsizing/validation-xmp.mjs';

const moduleRoot = new URL('../src/shared/headsizing/', import.meta.url);
const calibration = { id: 'fall-2026', revision: 1, values: calibrationFromText(
  await fs.readFile(new URL('calibrations/fall-2026.txt', moduleRoot), 'utf8')) };
const input = { captureId: 'synthetic-capture-001', faceCount: 1,
  source: { width: 6000, height: 4000, exifOrientation: 1, sha256: '0'.repeat(64) },
  quarterTurn: 270, detectedTiltDeg: 5, selection: 'alternate', calibration,
  measurements: { eyes: { centerX: 2000, centerY: 1800 }, mouth: { centerX: 2000, centerY: 2230 } } };
const recipe = createCropRecipe(input);
const xmp = createValidationXmp(recipe, { fileName: 'synthetic.CR3', width: 6000, height: 4000,
  exifOrientation: 1, framing: 'assumed-same-upright-frame' });
const exportRoot = fileURLToPath(new URL('../../exports/', import.meta.url));
await fs.mkdir(exportRoot, { recursive: true });
const folder = await fs.mkdtemp(path.join(exportRoot, 'headsizing-foundation-'));
await fs.writeFile(path.join(folder, 'synthetic-input.json'), JSON.stringify(input, null, 2) + '\n', { flag: 'wx' });
await fs.writeFile(path.join(folder, 'synthetic-recipe.json'), JSON.stringify(recipe, null, 2) + '\n', { flag: 'wx' });
await fs.writeFile(path.join(folder, 'synthetic.validation.xmp'), xmp, { flag: 'wx' });
await fs.writeFile(path.join(folder, 'README.txt'), 'Synthetic geometry example only. There is no matching photograph or RAW.\n'
  + 'The zero SHA-256 is a placeholder. Do not place this XMP beside a production RAW.\n'
  + 'Real Lightroom Classic crop/orientation parity has not been validated.\n', { flag: 'wx' });
console.log(`Headsizing foundation examples: ${folder}`);
