(() => {
  const api = window.trecs;
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Photo Integrity & Recovery';
  document.querySelector('.sidebar nav').append(button);
  const modal = document.createElement('dialog');
  modal.className = 'recovery-dialog';
  modal.innerHTML = `<form method="dialog" class="recovery-heading"><h2>Photo Integrity & Recovery</h2><button aria-label="Close recovery">Close</button></form><label>Job <select data-recovery-job></select></label><div class="recovery-actions"><button type="button" data-recovery-scan>Scan Photos</button><button type="button" data-recovery-backups>Database Backups</button><button type="button" data-recovery-history hidden>Photo Assignment History</button></div><p data-recovery-status role="status"></p><div data-recovery-body></div>`;
  document.body.append(modal);
  const select = modal.querySelector('[data-recovery-job]');
  const status = modal.querySelector('[data-recovery-status]');
  const body = modal.querySelector('[data-recovery-body]');
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const jobId = () => select.value ? Number(select.value) : null;
  let generation = 0;
  async function run(message, task) {
    const request = ++generation;
    status.textContent = message;
    body.innerHTML = '';
    try {
      const html = await task();
      if (request !== generation) return false;
      body.innerHTML = html || '';
      status.textContent = '';
      return true;
    } catch (error) { if (request === generation) status.textContent = error.message; return false; }
  }
  async function backups() {
    const selectedJobId = jobId();
    const displayed = await run('Loading database backups…', async () => {
      const result = await api.listStorageBackups(selectedJobId);
      return `<p>${esc(result.databasePath)}</p><p>Restoring a backup restores all records in this database to that time. Image files remain in place. The current database is backed up before restoration.</p>${result.backups.length ? `<table><thead><tr><th>Saved</th><th>Size</th><th></th></tr></thead><tbody>${result.backups.map((backup) => `<tr><td>${esc(new Date(backup.createdAt).toLocaleString())}</td><td>${(backup.size / 1024 / 1024).toFixed(1)} MB</td><td><button data-recovery-restore="${esc(backup.path)}">Restore This Backup</button></td></tr>`).join('')}</tbody></table>` : '<p>No earlier backup is available yet. Backups are created as this database changes.</p>'}`;
    });
    if (!displayed) return;
    body.querySelectorAll('[data-recovery-restore]').forEach((restore) => restore.addEventListener('click', async () => {
      if (!await confirmAction({ title: 'Restore database backup', message: 'Restore this database backup?', detail: 'All records in this database will return to the backup time. A backup of the current state will be kept.' })) return;
      restore.disabled = true;
      status.textContent = 'Restoring database…';
      try {
        await api.restoreStorageBackup({ jobId: selectedJobId, backupPath: restore.dataset.recoveryRestore });
        status.textContent = 'Database restored. Reloading TRECS…';
        window.location.reload();
      } catch (error) { status.textContent = error.message; restore.disabled = false; }
    }));
  }
  button.addEventListener('click', async () => {
    modal.showModal();
    await run('Loading jobs…', async () => {
      const result = await api.listRecoveryJobs();
      const jobs = Array.isArray(result) ? result : result.jobs || [];
      select.innerHTML = `<option value="">Program settings database</option>${jobs.map((job) => `<option value="${Number(job.id)}">${esc(`${job.clientName || job.schoolName || ''} / ${job.name || job.jobName || ''}`)}</option>`).join('')}`;
      if (typeof jobsState !== 'undefined' && jobsState.selectedJobId) select.value = String(jobsState.selectedJobId);
      return '<p>Choose a job to check missing originals, RAW partners, crops, photo links and duplicate references. Choose Database Backups to restore saved records.</p>';
    });
  });
  modal.querySelector('[data-recovery-scan]').addEventListener('click', async () => {
    const selectedJobId = jobId();
    if (!selectedJobId) { status.textContent = 'Choose a job to scan its photos.'; return; }
    await run('Checking image files and student links…', async () => {
      const result = await api.inspectPhotoIntegrity(selectedJobId);
      return `<p>Checked ${result.subjects.toLocaleString()} students and ${result.images.toLocaleString()} images in ${(result.elapsedMs / 1000).toFixed(1)} seconds. ${result.totalIssues.toLocaleString()} issues found.</p>${result.totalIssues ? `<p>${Object.entries(result.totals).map(([label, count]) => `${esc(label)}: ${count}`).join(' · ')}</p><table><thead><tr><th>Issue</th><th>Reference</th><th>Image / details</th></tr></thead><tbody>${result.issues.map((issue) => `<tr><td>${esc(issue.type)}</td><td>${esc(issue.ref)}</td><td>${esc(issue.detail || '')}${issue.imageId ? ` (image ${issue.imageId})` : ''}${issue.path ? `<br><small>${esc(issue.path)}</small>` : ''}</td></tr>`).join('')}</tbody></table>${result.truncated ? '<p>Showing the first 1,000 issues. Resolve these and scan again.</p>' : ''}` : '<p>No missing files or broken photo associations were detected.</p>'}`;
    });
  });
  modal.querySelector('[data-recovery-backups]').addEventListener('click', backups);
  const historyButton = modal.querySelector('[data-recovery-history]');
  historyButton.hidden = false;
  async function history() {
    const selectedJobId = jobId();
    if (!selectedJobId) { status.textContent = 'Choose a job to review its photo assignments.'; return; }
    const displayed = await run('Loading photo assignment history…', async () => {
      const actions = await api.listPhotoAssignmentActions(selectedJobId);
      return `<p>Undo restores student links, selected photos and rejected status. Image files and filenames stay in their current location. If newer photo changes affect the same students, undo those first. The latest 100 actions are shown; up to 500 undo snapshots are retained.</p>${actions.length ? `<table><thead><tr><th>When</th><th>Action</th><th>Image</th><th></th></tr></thead><tbody>${actions.map((action) => `<tr><td>${esc(action.createdAt)}</td><td>${esc(action.action)}</td><td>${esc(action.filename || action.imageId)}</td><td>${action.status === 'assignment_undone' ? 'Undone' : `<button data-recovery-undo="${action.id}">Undo</button>`}</td></tr>`).join('')}</tbody></table>` : '<p>No recorded photo assignment changes yet.</p>'}`;
    });
    if (!displayed) return;
    body.querySelectorAll('[data-recovery-undo]').forEach((undo) => undo.addEventListener('click', async () => {
      if (!await confirmAction({ title: 'Undo photo assignment', message: 'Undo this photo action?', detail: 'Student links, selected photos and rejection status will be restored. Image files will stay in their current location.' })) return;
      undo.disabled = true;
      try {
        await api.undoPhotoAssignmentAction({ jobId: selectedJobId, actionId: Number(undo.dataset.recoveryUndo) });
        if (typeof jobsState !== 'undefined' && Number(jobsState.selectedJobId) === selectedJobId) await reloadCurrentJobDetail();
        await history();
      } catch (error) { status.textContent = error.message; undo.disabled = false; }
    }));
  }
  historyButton.addEventListener('click', history);
  select.addEventListener('change', () => { generation += 1; body.innerHTML = ''; status.textContent = ''; });
  modal.addEventListener('close', () => { generation += 1; });
})();
