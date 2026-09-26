const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function atomicJson(filename, value) {
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  const temporary = `${filename}.${crypto.randomUUID()}.tmp`;
  const descriptor = fs.openSync(temporary, 'wx');
  try {
    fs.writeFileSync(descriptor, JSON.stringify(value, null, 2));
    fs.fsyncSync(descriptor);
  } finally {
    fs.closeSync(descriptor);
  }
  fs.renameSync(temporary, filename);
}

async function fileDigest(filename) {
  const hash = crypto.createHash('sha256');
  let size = 0;
  for await (const chunk of fs.createReadStream(filename)) {
    hash.update(chunk);
    size += chunk.length;
  }
  if (!size) throw new Error(`The image or database is empty: ${filename}`);
  return { size, sha256: hash.digest('hex') };
}

async function verifyFile(filename, expected) {
  const actual = await fileDigest(filename);
  if (expected && (Number(expected.size) !== actual.size || expected.sha256 !== actual.sha256)) {
    throw new Error(`File verification failed: ${filename}. Keep the source files and retry the transfer.`);
  }
  return actual;
}

async function copyVerified(source, destination, expected = null) {
  const sourceDigest = await verifyFile(source, expected);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  if (fs.existsSync(destination)) {
    await verifyFile(destination, sourceDigest);
    return sourceDigest;
  }
  const temporary = `${destination}.${crypto.randomUUID()}.partial`;
  await fs.promises.copyFile(source, temporary, fs.constants.COPYFILE_EXCL);
  const descriptor = await fs.promises.open(temporary, 'r+');
  try { await descriptor.sync(); } finally { await descriptor.close(); }
  await verifyFile(temporary, sourceDigest);
  await fs.promises.rename(temporary, destination);
  return sourceDigest;
}

function insidePackage(folder, relativePath) {
  const resolved = path.resolve(folder, relativePath);
  const relative = path.relative(path.resolve(folder), resolved);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error('An End of Day package path points outside its folder.');
  }
  return resolved;
}

function packageImageSource(info, image, kind) {
  const value = image[`${kind}Path`];
  if (!value) return null;
  // Older packages stored paths relative to their originating TRECS folder.
  const folder = kind === 'jpg' ? info.imagesFolder : info.rawImagesFolder;
  return insidePackage(folder, path.basename(String(value).replace(/\\/g, '/')));
}

function manifestIdentity(manifest) {
  if (!manifest || !manifest.createdAt || !manifest.job) return null;
  return crypto.createHash('sha256').update(JSON.stringify({
    jobId: manifest.job.id, createdAt: manifest.createdAt, workstation: manifest.workstation,
    subjectChanges: manifest.subjectChanges,
    images: (manifest.copiedImages || []).map((image) => ({ id: image.imageAssetId, filename: image.filename, jpg: image.jpgPath && path.basename(String(image.jpgPath).replace(/\\/g, '/')), raw: image.rawPath && path.basename(String(image.rawPath).replace(/\\/g, '/')) }))
  })).digest('hex');
}

async function validatePackage(info) {
  if (info.manifest.state && info.manifest.state !== 'complete') {
    throw new Error('This End of Day package is incomplete. Finish creating it on the capture laptop first.');
  }
  await verifyFile(info.databasePath, info.manifest.databaseIntegrity);
  const seen = new Set();
  for (const image of info.manifest.copiedImages || []) {
    const imageId = Number(image.imageAssetId);
    if (!imageId || seen.has(imageId)) throw new Error('The package contains a missing or duplicate image identifier.');
    seen.add(imageId);
    const jpg = packageImageSource(info, image, 'jpg');
    if (!jpg) throw new Error(`Missing JPG for ${image.filename || imageId}. The package was not imported.`);
    await verifyFile(jpg, image.jpgIntegrity);
    const raw = packageImageSource(info, image, 'raw');
    if (!raw && /raw|cr[23]/i.test(image.captureFileMode || '')) {
      throw new Error(`Missing RAW for ${image.filename || imageId}. The package was not imported.`);
    }
    if (raw) await verifyFile(raw, image.rawIntegrity);
  }
  const databaseDigest = await fileDigest(info.databasePath);
  // Unchanged for a moved/renamed package, including packages predating UUIDs.
  const identity = crypto.createHash('sha256').update(JSON.stringify({
    database: databaseDigest.sha256,
    jobId: info.manifest.job && info.manifest.job.id,
    createdAt: info.manifest.createdAt,
    subjectChanges: info.manifest.subjectChanges,
    images: (info.manifest.copiedImages || []).map((image) => ({
      id: image.imageAssetId,
      jpg: image.jpgIntegrity && image.jpgIntegrity.sha256,
      raw: image.rawIntegrity && image.rawIntegrity.sha256
    }))
  })).digest('hex');
  return { packageId: info.manifest.packageId || `legacy-${identity}`, contentId: identity, manifestId: manifestIdentity(info.manifest) };
}

function sameValue(a, b) { return String(a == null ? '' : a) === String(b == null ? '' : b); }

function planSubjectMerge({ currentSubjects, packageSubjects, baselineSubjects = [], manifest, fieldColumns, resolutions = [] }) {
  const currentById = new Map(currentSubjects.map((row) => [Number(row.id), row]));
  const baselineById = new Map(baselineSubjects.map((row) => [Number(row.id), row]));
  const edits = manifest.subjectChanges && manifest.subjectChanges.editedSubjects || [];
  const editsById = new Map(edits.map((row) => [Number(row.id), row]));
  const newIds = new Set((manifest.subjectChanges && manifest.subjectChanges.newSubjects || []).map((row) => Number(row.id)));
  const imageIds = new Set((manifest.copiedImages || []).map((image) => Number(image.imageAssetId)));
  const decisions = new Map(resolutions.map((row) => [row.key, row]));
  const subjectIdMap = new Map();
  const conflicts = [];
  const fieldUpdates = [];
  const keepPrimary = new Set();
  const linkedNewIds = new Set();
  const conflict = (entry, accepted) => {
    const resolution = decisions.get(entry.key);
    if (resolution && sameValue(resolution.expectedCurrent, entry.current) && accepted.includes(resolution.choice)) return resolution.choice;
    conflicts.push(entry);
    return null;
  };
  for (const source of packageSubjects) {
    const sourceId = Number(source.id);
    const edit = editsById.get(sourceId);
    const baseline = baselineById.get(sourceId);
    const refChange = edit && (edit.changes || []).find((change) => change.field === 'ref');
    const reference = baseline ? baseline.legacy_ref_num : refChange ? refChange.before : source.legacy_ref_num;
    const byReference = currentSubjects.filter((row) => sameValue(row.legacy_ref_num, reference) && String(reference || '').trim());
    let current = currentById.get(sourceId);
    if (newIds.has(sourceId)) {
      if (packageSubjects.some((other) => Number(other.id) !== sourceId && newIds.has(Number(other.id)) && sameValue(other.legacy_ref_num, source.legacy_ref_num))) {
        conflicts.push({ key: `${sourceId}:identity`, kind: 'blocked', subjectId: sourceId, ref: source.legacy_ref_num, field: 'Multiple new records in this package have the same reference. Correct the source records before importing.' });
        continue;
      }
      const collisions = currentSubjects.filter((row) => sameValue(row.legacy_ref_num, source.legacy_ref_num) && String(source.legacy_ref_num || '').trim());
      if (collisions.length === 1) {
        const choice = conflict({ key: `${sourceId}:new`, kind: 'new', subjectId: sourceId, ref: source.legacy_ref_num, name: source.display_name, field: 'New record reference already exists', before: '', current: collisions[0].id, currentLabel: collisions[0].display_name || `Subject ${collisions[0].id}`, after: source.display_name }, ['link']);
        if (choice === 'link') { subjectIdMap.set(sourceId, Number(collisions[0].id)); linkedNewIds.add(sourceId); keepPrimary.add(sourceId); }
      } else if (collisions.length > 1) {
        conflicts.push({ key: `${sourceId}:identity`, kind: 'blocked', subjectId: sourceId, ref: source.legacy_ref_num, field: 'Duplicate reference in current job; resolve the duplicate before importing.' });
      }
      continue;
    }
    if (!current || !sameValue(current.legacy_ref_num, reference)) current = byReference.length === 1 ? byReference[0] : null;
    if (!current) {
      conflicts.push({ key: `${sourceId}:identity`, kind: 'blocked', subjectId: sourceId, ref: reference, name: source.display_name, field: 'No unique matching student in the current job. Correct the reference before importing.' });
      continue;
    }
    subjectIdMap.set(sourceId, Number(current.id));
    for (const change of edit && edit.changes || []) {
      const column = fieldColumns[change.field];
      if (!column || sameValue(current[column], change.after)) continue;
      if (change.field === 'ref' && currentSubjects.some((row) => Number(row.id) !== Number(current.id) && sameValue(row.legacy_ref_num, change.after))) {
        conflicts.push({ key: `${sourceId}:reference`, kind: 'blocked', subjectId: sourceId, ref: reference, name: source.display_name, field: 'The new reference already belongs to another office student. Correct the reference before importing.' });
        continue;
      }
      let choice = 'import';
      if (!sameValue(current[column], change.before)) {
        choice = conflict({ key: `${sourceId}:${change.field}`, kind: 'field', subjectId: sourceId, ref: reference, name: source.display_name, field: change.label || change.field, before: change.before, current: current[column], after: change.after }, ['keep', 'import']);
      }
      if (choice === 'import') fieldUpdates.push({ subjectId: Number(current.id), column, value: change.after == null ? null : change.after });
    }
    if (imageIds.has(Number(source.primary_image_asset_id)) && current.primary_image_asset_id && (!baseline || !sameValue(current.primary_image_asset_id, baseline.primary_image_asset_id))) {
      const choice = conflict({ key: `${sourceId}:primary`, kind: 'primary', subjectId: sourceId, ref: reference, name: source.display_name, field: 'Selected photo', before: baseline && baseline.primary_image_asset_id, current: current.primary_image_asset_id, after: source.primary_image_asset_id }, ['keep', 'import']);
      if (choice !== 'import') keepPrimary.add(sourceId);
    }
  }
  return { subjectIdMap, conflicts, fieldUpdates, keepPrimary, linkedNewIds };
}

module.exports = { atomicJson, fileDigest, verifyFile, copyVerified, insidePackage, packageImageSource, validatePackage, manifestIdentity, planSubjectMerge };
