import { tiltedRawCrop } from './geometry.mjs';
import { uprightSize, validateOrientation, validateRecipe, SELECTION_STATES } from './recipe.mjs';

const forwardExif = [null,
  ([x, y]) => [x, y], ([x, y]) => [1 - x, y], ([x, y]) => [1 - x, 1 - y],
  ([x, y]) => [x, 1 - y], ([x, y]) => [y, x], ([x, y]) => [1 - y, x],
  ([x, y]) => [1 - y, 1 - x], ([x, y]) => [y, 1 - x]
];

// Compose orientation instead of losing a 90/180/270-degree correction in XMP.
export function composeOrientation(exifOrientation, quarterTurn) {
  validateOrientation(exifOrientation);
  if (![0, 90, 180, 270].includes(quarterTurn)) throw new Error('Invalid quarter turn');
  const rotate = ([x, y]) => quarterTurn === 90 ? [1 - y, x] : quarterTurn === 180 ? [1 - x, 1 - y]
    : quarterTurn === 270 ? [y, 1 - x] : [x, y];
  const basis = [[0, 0], [1, 0], [0, 1]];
  return forwardExif.findIndex((transform, index) => index > 0 && basis.every(point => {
    const actual = rotate(forwardExif[exifOrientation](point));
    return transform(point).every((v, axis) => v === actual[axis]);
  }));
}

function escapeXml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

// Validation ONLY: return text for an isolated copy of a RAW. No file IO, XMP
// merge or production authorization. Real Lightroom parity is an M2 gate.
export function createValidationXmp(recipe, raw, selection = recipe.selection) {
  validateRecipe(recipe);
  if (!SELECTION_STATES.includes(selection)) throw new Error('Invalid selection');
  if (typeof raw?.fileName !== 'string' || /[\x00-\x1f<>:"/\\|?*]/.test(raw.fileName)
    || !/\.(cr2|cr3|nef|nrw|arw|orf|rw2|raf|pef|srw)$/i.test(raw.fileName)) throw new Error('Provide a proprietary RAW basename; DNG/embedded metadata requires separate validation');
  if (raw.framing !== 'assumed-same-upright-frame') throw new Error('Declare the JPEG/RAW framing assumption for this validation export');
  const rawSize = uprightSize(raw, recipe.quarterTurn);
  if (Math.abs(rawSize.width / rawSize.height - recipe.upright.width / recipe.upright.height) > 1e-6) throw new Error('JPEG and RAW upright aspect ratios differ; explicit frame mapping is required');
  const mapped = tiltedRawCrop(recipe.crop, recipe.upright.width, recipe.upright.height,
    recipe.quarterTurn, raw.exifOrientation, recipe.tilt.appliedDeg);
  for (const value of Object.values(mapped.crop)) {
    if (!Number.isFinite(value) || value < 0 || value > 1) throw new Error('Mapped crop is outside the RAW; review orientation and framing');
  }
  const pick = { selected: 1, alternate: 0, rejected: -1 }[selection];
  const orientation = composeOrientation(raw.exifOrientation, recipe.quarterTurn);
  const attributes = {
    'tiff:Orientation': orientation,
    'xmpDM:pick': pick,
    'crs:RawFileName': raw.fileName,
    'crs:CropLeft': mapped.crop.left.toFixed(8), 'crs:CropTop': mapped.crop.top.toFixed(8),
    'crs:CropRight': mapped.crop.right.toFixed(8), 'crs:CropBottom': mapped.crop.bottom.toFixed(8),
    'crs:CropAngle': mapped.angle.toFixed(8), 'crs:CropUnits': 0,
    'crs:HasCrop': 'True', 'crs:AlreadyApplied': 'False', 'crs:CropConstrainToUnitSquare': 1,
    'trecs:ValidationOnly': 'True', 'trecs:CaptureId': recipe.captureId,
    'trecs:RecipeVersion': recipe.schemaVersion, 'trecs:SourceSha256': recipe.source.sha256
  };
  return '<?xpacket begin="\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?>\n'
    + '<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">\n'
    + '<rdf:Description rdf:about="" xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/" '
    + 'xmlns:tiff="http://ns.adobe.com/tiff/1.0/" xmlns:xmpDM="http://ns.adobe.com/xmp/1.0/DynamicMedia/" '
    + 'xmlns:trecs="urn:trecs:headsizing:1"\n'
    + Object.entries(attributes).map(([name, value]) => `  ${name}="${escapeXml(value)}"`).join('\n')
    + '/></rdf:RDF></x:xmpmeta>\n<?xpacket end="w"?>\n';
}
