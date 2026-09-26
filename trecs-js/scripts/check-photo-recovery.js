const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');
const history = require('../src/main/photo-assignment-history');
const { inspectPhotoIntegrity } = require('../src/main/photo-integrity');

async function run() {
  const SQL = await require('sql.js')({ locateFile: (file) => path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', file) });
  const database = new SQL.Database();
  database.run(`CREATE TABLE subjects (id INTEGER PRIMARY KEY, primary_image_asset_id INTEGER, photographed_status TEXT, updated_at TEXT); CREATE TABLE image_assets (id INTEGER PRIMARY KEY, status TEXT, rejected_at TEXT, rejected_reason TEXT); CREATE TABLE subject_images (id INTEGER PRIMARY KEY, subject_id INTEGER, image_asset_id INTEGER, role TEXT, selected INTEGER, sort_order INTEGER); CREATE TABLE capture_image_actions (id INTEGER PRIMARY KEY, job_id INTEGER, image_asset_id INTEGER, source_subject_id INTEGER, target_subject_id INTEGER, action_type TEXT, reason TEXT, notes TEXT, photographer_name TEXT, workstation_name TEXT); INSERT INTO subjects VALUES (1,10,'photographed',NULL),(2,11,'photographed',NULL); INSERT INTO image_assets VALUES(10,'imported',NULL,NULL),(11,'imported',NULL,NULL); INSERT INTO subject_images VALUES(1,1,10,'capture',1,0),(2,2,11,'capture',1,0);`);
  const action = { jobId: 7, type: 'move', subjectIds: [1, 2], imageIds: [10] };
  const before = history.begin(database, action);
  database.run("DELETE FROM subject_images WHERE id = 1; INSERT INTO subject_images VALUES(3,2,10,'capture',1,0); UPDATE subject_images SET selected = 0 WHERE id = 2; UPDATE subjects SET primary_image_asset_id = NULL WHERE id = 1; UPDATE subjects SET primary_image_asset_id = 10 WHERE id = 2; INSERT INTO capture_image_actions(job_id,image_asset_id,action_type) VALUES(7,10,'move');");
  const actionId = history.record(database, action, before);
  database.run('UPDATE subjects SET primary_image_asset_id = 11 WHERE id = 2;');
  assert.throws(() => history.undo(database, 7, actionId), /changed after/);
  database.run('UPDATE subjects SET primary_image_asset_id = 10 WHERE id = 2;');
  const undone = history.undo(database, 7, actionId);
  assert.ok(undone.undone);
  assert.deepEqual(history.snapshot(database, before.scope), before.before);
  assert.equal(database.exec("SELECT action_type FROM capture_image_actions WHERE id=1")[0].values[0][0], 'move_undone');
  assert.throws(() => history.undo(database, 7, actionId), /already been undone/);
  database.close();
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'trecs-integrity-'));
  try {
    fs.writeFileSync(path.join(folder, 'ok.jpg'), 'image');
    const result = await inspectPhotoIntegrity({
      subjects: [{ id: 1, legacy_ref_num: '001', primary_image_asset_id: 10 }, { id: 2, legacy_ref_num: '001', primary_image_asset_id: 99 }],
      images: [{ id: 10, current_path: 'ok.jpg', status: 'rejected', metadata_json: '{"rawPath":"missing.cr3"}' }, { id: 11, current_path: 'missing.jpg', status: 'imported' }],
      links: [{ subject_id: 1, image_asset_id: 10 }], versions: [{ image_asset_id: 10, version_type: 'cropped_med', path: 'missing-med.jpg' }], resolvePath: (value) => path.join(folder, value)
    });
    for (const type of ['Duplicate reference', 'Rejected selected photo', 'Broken selected photo', 'Missing RAW', 'Missing original JPG', 'Missing crop/derivative', 'Unassigned image']) assert.equal(result.totals[type], 1, type);
  } finally { fs.rmSync(folder, { recursive: true, force: true }); }
  console.log('PASS: conditional photo undo, move-repair suppression, missing files/RAW/crops, duplicate references and broken selections.');
}
run().catch((error) => { console.error(error); process.exitCode = 1; });
