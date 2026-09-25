const assert = require('assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const safety = require('../src/main/end-of-day-safety');

async function run() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'trecs-eod-safety-'));
  try {
    const folder = path.join(root, 'package');
    fs.mkdirSync(path.join(folder, 'Database'), { recursive: true });
    fs.mkdirSync(path.join(folder, 'JPG'));
    fs.mkdirSync(path.join(folder, 'RAW'));
    fs.writeFileSync(path.join(folder, 'Database', 'job.db'), 'isolated database bytes');
    fs.writeFileSync(path.join(folder, 'JPG', 'photo.jpg'), 'isolated jpg bytes');
    fs.writeFileSync(path.join(folder, 'RAW', 'photo.cr3'), 'isolated raw bytes');
    const manifest = { packageType: 'end_of_day', state: 'complete', job: { id: 7 }, createdAt: '2026-09-11', copiedImages: [{ imageAssetId: 12, filename: 'photo.jpg', captureFileMode: 'jpg_raw', jpgPath: 'JPG/photo.jpg', rawPath: 'RAW/photo.cr3' }] };
    const info = { packageFolder: folder, manifest, databasePath: path.join(folder, 'Database', 'job.db'), imagesFolder: path.join(folder, 'JPG'), rawImagesFolder: path.join(folder, 'RAW') };
    const identity = await safety.validatePackage(info);
    const renamed = path.join(root, 'renamed');
    fs.renameSync(folder, renamed);
    const movedInfo = { ...info, packageFolder: renamed, databasePath: path.join(renamed, 'Database', 'job.db'), imagesFolder: path.join(renamed, 'JPG'), rawImagesFolder: path.join(renamed, 'RAW') };
    assert.deepEqual(await safety.validatePackage(movedInfo), identity, 'renaming does not change legacy identity');
    const source = path.join(renamed, 'JPG', 'photo.jpg');
    const dest = path.join(root, 'permanent', 'photo.jpg');
    const digest = await safety.copyVerified(source, dest);
    assert.ok(fs.existsSync(source), 'copy must retain source before commit');
    await safety.copyVerified(source, dest, digest);
    fs.writeFileSync(dest, 'changed after interrupted transfer');
    await assert.rejects(safety.copyVerified(source, dest, digest), /verification failed/);
    manifest.copiedImages[0].rawPath = null;
    await assert.rejects(safety.validatePackage(movedInfo), /Missing RAW/);
    manifest.copiedImages[0].rawPath = 'RAW/photo.cr3';
    fs.unlinkSync(source);
    await assert.rejects(safety.validatePackage(movedInfo), /ENOENT/);
    assert.throws(() => safety.insidePackage(root, '../outside.db'), /outside/);

    const current = { id: 100, legacy_ref_num: '0012', first_name: 'Office', grade: '3', primary_image_asset_id: 55 };
    const sourceSubject = { id: 10, legacy_ref_num: '0012', first_name: 'Onsite', grade: '4', primary_image_asset_id: 12 };
    const baseline = { ...sourceSubject, first_name: 'Original', grade: '3', primary_image_asset_id: 44 };
    const mergeManifest = { copiedImages: [{ imageAssetId: 12 }], subjectChanges: { editedSubjects: [{ id: 10, ref: '0012', changes: [{ field: 'firstName', before: 'Original', after: 'Onsite' }, { field: 'grade', before: '3', after: '4' }] }] } };
    const input = { currentSubjects: [current], packageSubjects: [sourceSubject], baselineSubjects: [baseline], manifest: mergeManifest, fieldColumns: { firstName: 'first_name', grade: 'grade' } };
    const pending = safety.planSubjectMerge(input);
    assert.equal(pending.subjectIdMap.get(10), 100, 'stable reference remaps changed internal IDs');
    assert.equal(pending.conflicts.length, 2, 'office name and photo selection require review');
    assert.deepEqual(pending.fieldUpdates, [{ subjectId: 100, column: 'grade', value: '4' }]);
    const resolved = safety.planSubjectMerge({ ...input, resolutions: [{ key: '10:firstName', choice: 'keep', expectedCurrent: 'Office' }, { key: '10:primary', choice: 'keep', expectedCurrent: 55 }] });
    assert.equal(resolved.conflicts.length, 0);
    assert.ok(resolved.keepPrimary.has(10));
    assert.equal(resolved.fieldUpdates.length, 1);
    const raced = safety.planSubjectMerge({ ...input, currentSubjects: [{ ...current, first_name: 'Later office change' }], resolutions: [{ key: '10:firstName', choice: 'import', expectedCurrent: 'Office' }] });
    assert.ok(raced.conflicts.some((row) => row.key === '10:firstName'), 'stale approval cannot overwrite a later edit');
    const collision = safety.planSubjectMerge({ ...input, manifest: { copiedImages: [], subjectChanges: { newSubjects: [{ id: 10, ref: '0012' }] } } });
    assert.equal(collision.conflicts[0].kind, 'new');
    const editOnly = safety.planSubjectMerge({ ...input, manifest: { ...mergeManifest, copiedImages: [] } });
    assert.ok(!editOnly.conflicts.some((row) => row.kind === 'primary'), 'record-only edit never replaces primary');
    console.log('PASS: verified/retryable copies, missing RAW/JPG, portable deduplication, reference remapping, conflict choices and stale approvals.');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}
run().catch((error) => { console.error(error); process.exitCode = 1; });
