function rows(database, sql) {
  const result = database.exec(sql)[0];
  return result ? result.values.map((values) => Object.fromEntries(result.columns.map((column, index) => [column, values[index]]))) : [];
}
function ids(values) { return [...new Set(values.map(Number).filter((id) => Number.isSafeInteger(id) && id > 0))].sort((a, b) => a - b); }

function snapshot(database, scope) {
  const subjectList = scope.subjectIds.join(',') || '0';
  const imageList = scope.imageIds.join(',') || '0';
  return {
    subjects: rows(database, `SELECT id, primary_image_asset_id, photographed_status FROM subjects WHERE id IN (${subjectList}) ORDER BY id;`),
    links: rows(database, `SELECT * FROM subject_images WHERE subject_id IN (${subjectList}) ORDER BY id;`),
    images: rows(database, `SELECT id, status, rejected_at, rejected_reason FROM image_assets WHERE id IN (${imageList}) ORDER BY id;`)
  };
}

function begin(database, input) {
  const explicitImageIds = ids(input.imageIds || []);
  const linkedSubjects = explicitImageIds.length ? rows(database, `SELECT DISTINCT subject_id AS id FROM subject_images WHERE image_asset_id IN (${explicitImageIds.join(',')});`).map((row) => row.id) : [];
  const subjectIds = ids([...(input.subjectIds || []), ...linkedSubjects]);
  const linkedImages = subjectIds.length ? rows(database, `SELECT DISTINCT image_asset_id AS id FROM subject_images WHERE subject_id IN (${subjectIds.join(',')});`).map((row) => row.id) : [];
  const scope = { subjectIds, imageIds: ids([...explicitImageIds, ...linkedImages]) };
  return { scope, before: snapshot(database, scope), previousActionId: Number(rows(database, 'SELECT COALESCE(MAX(id), 0) AS id FROM capture_image_actions;')[0].id) };
}

function record(database, input, state) {
  const after = snapshot(database, state.scope);
  if (JSON.stringify(after) === JSON.stringify(state.before)) return null;
  const relatedActionIds = rows(database, `SELECT id FROM capture_image_actions WHERE id > ${state.previousActionId};`).map((row) => row.id);
  database.run(`INSERT INTO capture_image_actions (job_id, image_asset_id, source_subject_id, target_subject_id, action_type, reason, notes, photographer_name, workstation_name) VALUES (?, ?, ?, ?, 'assignment_audit', ?, ?, ?, ?);`, [
    input.jobId, input.imageIds[0], state.scope.subjectIds[0] || null, state.scope.subjectIds[1] || null,
    input.type, JSON.stringify({ version: 1, scope: state.scope, before: state.before, after, relatedActionIds }), input.photographerName || null, input.workstationName || null
  ]);
  const actionId = Number(rows(database, 'SELECT last_insert_rowid() AS id;')[0].id);
  // Keep the most recent 500 undo snapshots; ordinary action history remains.
  database.run("DELETE FROM capture_image_actions WHERE action_type IN ('assignment_audit', 'assignment_undone') AND id NOT IN (SELECT id FROM capture_image_actions WHERE action_type IN ('assignment_audit', 'assignment_undone') ORDER BY id DESC LIMIT 500);");
  return actionId;
}

function undo(database, jobId, actionId) {
  const action = rows(database, `SELECT * FROM capture_image_actions WHERE id = ${Number(actionId)} AND job_id = ${Number(jobId)} AND action_type = 'assignment_audit';`)[0];
  if (!action) throw new Error('This photo action is unavailable or has already been undone.');
  const state = JSON.parse(action.notes);
  if (state.version !== 1 || JSON.stringify(snapshot(database, state.scope)) !== JSON.stringify(state.after)) {
    throw new Error('These photo assignments changed after that action. Undo the newer action first, or correct the image in its student record.');
  }
  database.run(`DELETE FROM subject_images WHERE subject_id IN (${state.scope.subjectIds.join(',') || '0'});`);
  for (const link of state.before.links) {
    const columns = Object.keys(link);
    database.run(`INSERT INTO subject_images (${columns.join(',')}) VALUES (${columns.map(() => '?').join(',')});`, columns.map((column) => link[column]));
  }
  for (const subject of state.before.subjects) database.run('UPDATE subjects SET primary_image_asset_id = ?, photographed_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;', [subject.primary_image_asset_id, subject.photographed_status, subject.id]);
  for (const image of state.before.images) database.run('UPDATE image_assets SET status = ?, rejected_at = ?, rejected_reason = ? WHERE id = ?;', [image.status, image.rejected_at, image.rejected_reason, image.id]);
  for (const relatedId of state.relatedActionIds) database.run("UPDATE capture_image_actions SET action_type = action_type || '_undone' WHERE id = ?;", [relatedId]);
  database.run("UPDATE capture_image_actions SET action_type = 'assignment_undone' WHERE id = ?;", [actionId]);
  return { actionId, jobId, subjectIds: state.scope.subjectIds, imageIds: state.scope.imageIds, undone: true };
}

module.exports = { begin, record, undo, snapshot };
