const fs = require('fs');
const path = require('path');

async function inspectPhotoIntegrity({ subjects, images, versions, links, resolvePath, databaseFolder }) {
  const started = Date.now();
  const issues = [];
  const totals = {};
  const add = (type, data) => {
    totals[type] = (totals[type] || 0) + 1;
    if (issues.length < 1000) issues.push({ type, ...data });
  };
  if (databaseFolder) {
    const pendingFolder = path.join(databaseFolder, 'pending-image-imports');
    const pendingNames = await fs.promises.readdir(pendingFolder).catch(() => []);
    for (const name of pendingNames.filter((entry) => entry.endsWith('.json'))) {
      const filename = path.join(pendingFolder, name);
      try {
        const journal = JSON.parse(await fs.promises.readFile(filename, 'utf8'));
        add('Pending image transfer recovery', { path: filename, detail: `${journal.phase || 'unfinished'}: ${(journal.files || []).map((file) => file.destinationPath || file.sourcePath).join(', ')}` });
      } catch { add('Unreadable recovery journal', { path: filename }); }
    }
    const eodPath = path.join(databaseFolder, 'end-of-day-pending.json');
    if (fs.existsSync(eodPath)) {
      try {
        const pending = JSON.parse(await fs.promises.readFile(eodPath, 'utf8'));
        add('Pending End of Day recovery', { path: eodPath, detail: `${pending.phase}: ${pending.packagePath}. Run End of Day to retry.` });
      } catch { add('Unreadable recovery journal', { path: eodPath }); }
    }
  }
  const imagesById = new Map(images.map((row) => [Number(row.id), row]));
  const subjectsById = new Map(subjects.map((row) => [Number(row.id), row]));
  const linksByImage = new Map();
  const linkPairs = new Set(links.map((link) => `${Number(link.subject_id)}:${Number(link.image_asset_id)}`));
  const refs = new Map();
  for (const subject of subjects) {
    const ref = String(subject.legacy_ref_num || '').trim();
    if (ref) refs.set(ref, [...(refs.get(ref) || []), subject]);
    if (subject.primary_image_asset_id) {
      const primary = imagesById.get(Number(subject.primary_image_asset_id));
      if (!primary) add('Broken selected photo', { subjectId: subject.id, ref, detail: `Image ${subject.primary_image_asset_id} has no image record.` });
      else if (primary.status === 'rejected') add('Rejected selected photo', { subjectId: subject.id, ref, imageId: primary.id, detail: primary.filename });
      if (!linkPairs.has(`${Number(subject.id)}:${Number(subject.primary_image_asset_id)}`)) add('Selected photo not linked', { subjectId: subject.id, ref, imageId: subject.primary_image_asset_id });
    }
  }
  refs.forEach((rows, ref) => { if (rows.length > 1) add('Duplicate reference', { ref, detail: rows.map((row) => row.display_name || row.id).join(', ') }); });
  for (const link of links) {
    linksByImage.set(Number(link.image_asset_id), [...(linksByImage.get(Number(link.image_asset_id)) || []), link]);
    if (!subjectsById.has(Number(link.subject_id)) || !imagesById.has(Number(link.image_asset_id))) add('Broken image link', { subjectId: link.subject_id, imageId: link.image_asset_id });
  }
  const versionsByImage = new Map();
  const registeredPaths = new Map();
  for (const image of images) {
    const filename = String(image.current_path || '').replace(/\\/g, '/').toLowerCase();
    if (filename && registeredPaths.has(filename)) add('Duplicate file registration', { imageId: image.id, detail: `Also registered as image ${registeredPaths.get(filename)}`, path: image.current_path });
    else if (filename) registeredPaths.set(filename, image.id);
  }
  for (const version of versions) versionsByImage.set(Number(version.image_asset_id), [...(versionsByImage.get(Number(version.image_asset_id)) || []), version]);
  const fileStats = new Map();
  const stat = (value) => {
    const filename = value && resolvePath(value);
    if (!filename) return Promise.resolve(null);
    if (!fileStats.has(filename)) fileStats.set(filename, fs.promises.stat(filename).then((result) => result.isFile() && result.size ? result : null).catch(() => null));
    return fileStats.get(filename);
  };
  let cursor = 0;
  const workers = Array.from({ length: Math.min(6, images.length) }, async () => {
    while (cursor < images.length) {
      const image = images[cursor++];
      const imageLinks = linksByImage.get(Number(image.id)) || [];
      const ref = imageLinks.map((link) => subjectsById.get(Number(link.subject_id))?.legacy_ref_num).filter(Boolean).join(', ');
      const base = { imageId: image.id, ref, detail: image.filename };
      const original = image.original_path || image.current_path;
      if (!await stat(original)) add('Missing original JPG', { ...base, path: original });
      const metadata = (() => { try { return JSON.parse(image.metadata_json || '{}'); } catch { return {}; } })();
      if (metadata.rawPath) {
        if (!await stat(metadata.rawPath)) add('Missing RAW', { ...base, path: metadata.rawPath });
      } else if (/raw|cr[23]/i.test(metadata.fileMode || image.captureFileMode || '')) add('Missing RAW', base);
      if (!imageLinks.length && image.status !== 'packaged' && image.status !== 'rejected') add('Unassigned image', base);
      const derivatives = versionsByImage.get(Number(image.id)) || [];
      for (const version of derivatives.filter((row) => row.version_type !== 'original')) {
        if (!await stat(version.path)) add('Missing crop/derivative', { ...base, path: version.path, detail: version.version_type });
      }
      const large = derivatives.find((row) => row.version_type === 'cropped_large');
      const medium = derivatives.find((row) => row.version_type === 'cropped_med');
      if (large && medium) {
        const [largeStat, mediumStat] = await Promise.all([stat(large.path), stat(medium.path)]);
        if (largeStat && mediumStat && largeStat.mtimeMs > mediumStat.mtimeMs + 1000) add('Stale medium crop', { ...base, path: medium.path });
      }
    }
  });
  await Promise.all(workers);
  return { checkedAt: new Date().toISOString(), elapsedMs: Date.now() - started, subjects: subjects.length, images: images.length, issues, totals, totalIssues: Object.values(totals).reduce((sum, count) => sum + count, 0), truncated: Object.values(totals).reduce((sum, count) => sum + count, 0) > issues.length };
}

module.exports = { inspectPhotoIntegrity };
