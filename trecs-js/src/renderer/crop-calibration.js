(() => {
  const root = document.getElementById('cropCalibrationView'); if (!root) return;
  const api = window.cropCalibration;
  root.innerHTML = `
    <div class="cc-intro"><div><h2>Test your crop. Measure your laptop.</h2><p>Same headsizing engine as the planned capture workflow. CPU-only, fully local.</p></div><button id="ccCache">Open local results</button></div>
    <div class="cc-setup">
      <div class="cc-panel"><h3>1 · Calibration and JPG folder</h3><div class="cc-row"><button id="ccCalibration">Load calibration…</button><button id="ccDefault">Use Fall 2026</button></div>
        <div id="ccCalibrationName" class="cc-path">No calibration loaded</div><details><summary>Calibration values</summary><pre id="ccCalibrationValues" class="cc-settings"></pre></details>
        <div class="cc-row"><button id="ccFolder">Choose JPG folder…</button><label><input type="checkbox" id="ccRecursive"> Include subfolders</label></div>
        <div id="ccFolderName" class="cc-path">No folder selected</div><p class="cc-muted">Changing calibration creates a new test. It never changes capture settings.</p>
      </div>
      <div class="cc-panel"><h3>2 · Benchmark settings</h3><div class="cc-fields">
        <label>Test mode<select id="ccMode"><option value="folder">Folder throughput</option><option value="capture-rate">Simulated shooting rate</option></select></label>
        <label>Inference longest side<select id="ccInference"><option>960</option><option>1280</option><option selected>1920</option></select></label>
        <label>Preview longest side<select id="ccPreview"><option>600</option><option selected>1000</option><option>1500</option></select></label>
        <label>Photos / minute<input id="ccRate" type="number" min="1" max="600" value="30"></label>
        <label>Photos per burst<input id="ccBurst" type="number" min="1" max="20" value="1"></label>
        <label>Storage (operator setting)<select id="ccStorage"><option value="unknown">Unknown</option><option value="ssd">SSD</option><option value="hdd">Hard disk</option><option value="removable">Removable</option><option value="network">Network</option></select></label>
        <label>Windows power mode<select id="ccPower"><option value="unknown">Unknown</option><option value="balanced">Balanced</option><option value="efficiency">Efficiency</option><option value="performance">Performance</option></select></label>
      </div><div class="cc-actions"><button class="primary" id="ccStart" disabled>Run folder test</button><button id="ccCancel" disabled>Cancel</button><span class="cc-muted">1 worker · face-only · up to 10,000 JPGs</span></div></div>
    </div>
    <div id="ccStatus" class="cc-banner" role="status">Checking offline assets…</div>
    <div class="cc-stats">${[['count','Completed'],['rate','Successful / minute'],['latency','Warm p95 · ms'],['cpu','Worker CPU · % per core'],['memory','Worker RAM · MB'],['queue','Queue depth']].map(([id,label]) => `<div class="cc-stat"><small>${label}</small><strong id="ccStat-${id}">—</strong></div>`).join('')}</div>
    <div class="cc-review"><div class="cc-panel"><h3>3 · Review images</h3><div class="cc-row"><button id="ccPageBack" title="Previous page">‹</button><span id="ccPage">0 / 0</span><button id="ccPageNext" title="Next page">›</button></div>
      <select id="ccFilter" aria-label="Filter current page"><option value="all">All on this page</option><option value="review">Needs review</option><option value="failed">Failed</option><option value="ok">Automatic crop OK</option></select>
      <div id="ccImages" class="cc-filmstrip"></div></div>
      <div class="cc-panel"><div class="cc-row"><strong id="ccImageName">Select a result to inspect</strong></div>
        <div class="cc-comparison"><figure><figcaption>Original · oriented for viewing</figcaption><div class="cc-photo"><img id="ccOriginal" alt="Original JPG preview"></div></figure>
        <figure><figcaption><label><input id="ccGuides" type="checkbox"> Show face and calibration guides</label></figcaption><div class="cc-photo"><img id="ccCrop" alt="Proposed crop preview"></div></figure></div>
        <p id="ccWarnings" class="cc-warning"></p><div class="cc-actions"><button id="ccPrevious">← Previous</button><button id="ccNext">Next →</button><button id="ccApprove">Crop looks good</button><button id="ccAdjust">Needs adjustment</button><button id="ccResetReview">Clear review</button></div>
        <p class="cc-muted">Review marks are for calibration testing only. RAW/Lightroom crop parity and lab color approval are separate.</p></div></div>
    <div class="cc-panel cc-history"><h3>Run history and comparison</h3><div class="cc-row"><select id="ccRuns" aria-label="Review run"></select><button id="ccRefresh">Refresh runs</button><button id="ccRecover">Recover partial report</button></div>
      <div class="cc-row"><label>Compare with <select id="ccCompare" aria-label="Compare run"></select></label></div><div id="ccComparison" class="cc-compare-text">Completed runs appear here. Compare the same JPG set and record changed settings.</div>
      <details><summary>Recorded hardware and settings</summary><pre id="ccRecordedSettings" class="cc-settings"></pre></details>
      <div class="cc-actions"><button id="ccExport">Export report…</button><label><input type="checkbox" id="ccExportPreviews"> Also export PRIVATE crop JPGs, guides and recipes</label></div>
      <p class="cc-muted">Reports omit filenames, paths and face landmarks. Optional photo/recipe exports contain private image data. Local cached previews remain on this laptop; Open local results shows their location.</p>
    </div>`;
  const $ = id => root.querySelector('#cc' + id);
  let state = { active: false, assets: false, calibration: null, input: null, runId: null, sequence: 1, offset: 0, total: 0, rows: [], runs: [] };
  let pageToken = 0, previewToken = 0, heartbeat = null, refreshTimer = null;
  const display = (value, digits = 1) => Number.isFinite(value) ? value.toFixed(digits) : '—';
  function status(message, error = false) { $('Status').textContent = message; $('Status').classList.toggle('error', error); }
  function controls() {
    for (const id of ['Calibration','Default','Folder','Recursive','Mode','Inference','Preview','Rate','Burst','Storage','Power']) $(id).disabled = state.active;
    $('Start').disabled = state.active || !state.assets || !state.calibration || !state.input;
    $('Cancel').disabled = !state.active; $('Export').disabled = state.active || !state.runId;
    $('Recover').disabled = state.active || !state.runId;
    $('Runs').disabled = state.active;
    $('Start').textContent = $('Mode').value === 'folder' ? 'Run folder test' : 'Run shooting simulation';
    $('Rate').disabled = state.active || $('Mode').value !== 'capture-rate'; $('Burst').disabled = $('Rate').disabled;
  }
  async function act(action) { try { await action(); } catch (error) { status(error.message, true); } finally { controls(); } }
  function setCalibration(value) { if (!value) return; state.calibration = value; $('CalibrationName').textContent = `${value.name} · ${value.hash.slice(0,12)}`; $('CalibrationValues').textContent = JSON.stringify(value.calibration.values, null, 2); }
  async function refresh() {
    const data = await api.status(); state.assets = data.assets.ready; state.active = Boolean(data.active);
    setCalibration(data.calibration); state.input = data.input;
    if (data.input) $('FolderName').textContent = `${data.input.count} JPGs · ${data.input.folder}`;
    if (data.active) state.runId = data.active.id;
    status(data.assets.ready ? 'Offline model verified. Choose a calibration and JPG folder, then run a test.' : data.assets.message, !data.assets.ready);
    await loadRuns(); controls(); setHeartbeat();
  }
  function setHeartbeat() {
    clearInterval(heartbeat); heartbeat = null;
    if (!state.active) return;
    let previous = performance.now();
    heartbeat = setInterval(() => { const current = performance.now(); api.heartbeat(Math.max(0, current - previous - 1000)).catch(() => {}); previous = current; }, 1000);
  }
  async function loadRuns() {
    state.runs = await api.runs();
    const compared = $('Compare').value;
    $('Runs').replaceChildren(); $('Compare').replaceChildren(new Option('No comparison', ''));
    for (const run of state.runs) {
      const label = `${new Date(run.startedAt).toLocaleString()} · ${run.calibration} · ${run.status}`;
      $('Runs').add(new Option(label, run.id)); $('Compare').add(new Option(label, run.id));
    }
    state.runId ??= state.runs[0]?.id;
    $('Runs').value = state.runId ?? ''; $('Compare').value = compared;
    renderSummary(); await page();
  }
  function renderSummary() {
    const run = state.runs.find(run => run.id === state.runId), other = state.runs.find(run => run.id === $('Compare').value);
    const summary = run?.summary;
    if (summary && !state.active) {
      $('Stat-count').textContent = `${run.total - summary.counts.pending}/${run.total}`;
      $('Stat-rate').textContent = display(summary.successfulImagesPerMinute);
      $('Stat-latency').textContent = display(summary.timings.warmSuccessful.processingMs.p95, 0);
      $('Stat-cpu').textContent = display(summary.resources.workerCpuPercentOneCore?.intervalWeightedMean);
      $('Stat-memory').textContent = display(summary.resources.workerWorkingSetBytes?.max / 1048576, 0);
      $('Stat-queue').textContent = `${summary.resources.queueDepth.max ?? '—'} peak`;
    }
    const describe = run => !run?.summary ? 'Run has no completed report yet.' : [
      `${run.calibration} · ${run.configuration.inferenceMaxDimension}px inference · ${run.configuration.previewMaxDimension}px previews · ${run.configuration.mode}`,
      `OK ${run.summary.counts.ok}, review ${run.summary.counts.review}, failed ${run.summary.counts.failed}, pending ${run.summary.counts.pending}`,
      `Human review: ${run.reviewCounts.approved} good, ${run.reviewCounts.adjust} need adjustment, ${run.reviewCounts.unreviewed} unreviewed`,
      `${display(run.summary.successfulImagesPerMinute)} successful/min · warm median ${display(run.summary.timings.warmSuccessful.processingMs.p50,0)} ms · p95 ${display(run.summary.timings.warmSuccessful.processingMs.p95,0)} ms`
    ].join('\n');
    let comparison = describe(run);
    if (other) {
      const same = run?.configuration.datasetSha256 && run.configuration.datasetSha256 === other.configuration.datasetSha256;
      comparison += `\n\nComparison: ${same ? 'Same JPG content set; check the settings and quality differences.' : 'Different or incomplete JPG fingerprint: not a like-for-like speed comparison.'}\n${describe(other)}`;
    }
    $('Comparison').textContent = comparison;
    $('RecordedSettings').textContent = JSON.stringify({ selected:run ? {configuration:run.configuration,hardware:run.hardware} : null,
      comparison:other ? {configuration:other.configuration,hardware:other.hardware} : null },null,2);
  }
  async function page() {
    const token = ++pageToken; if (!state.runId) return;
    const data = await api.items(state.runId, state.offset); if (token !== pageToken) return;
    state.total = data.total; state.rows = data.rows; $('Images').replaceChildren();
    $('Page').textContent = `${state.offset + 1}–${Math.min(state.offset + 24,state.total)} / ${state.total}`;
    $('PageBack').disabled = state.offset === 0; $('PageNext').disabled = state.offset + 24 >= state.total;
    for (const row of data.rows.filter(row => $('Filter').value === 'all' || row.outcome === $('Filter').value)) {
      const button = document.createElement('button'); button.className = 'cc-image-row'; button.classList.toggle('selected', row.sequence === state.sequence);
      const image = document.createElement('img'); image.alt = ''; const text = document.createElement('span'); text.textContent = `${row.sequence}. ${row.name}`;
      const small = document.createElement('small'); small.textContent = `${row.outcome} · ${row.humanReview}`; text.append(small); button.append(image,text);
      button.onclick = () => act(async () => { state.sequence = row.sequence; await select(); await page(); }); $('Images').append(button);
      api.preview(state.runId,row.sequence,'thumbnail').then(url => { if (token === pageToken && url) image.src = url; }).catch(() => {});
    }
    await select();
  }
  async function select() {
    const token = ++previewToken, id = state.runId, sequence = state.sequence;
    if (!id) return;
    const row = state.rows.find(row => row.sequence === sequence);
    $('ImageName').textContent = row ? `${row.sequence}. ${row.name}${row.width ? ` · ${row.width} × ${row.height}` : ''}` : `Image ${sequence}`;
    $('Warnings').textContent = row?.warnings.join(' ') ?? '';
    const [original,crop] = await Promise.all([api.preview(id,sequence,'original'),api.preview(id,sequence,$('Guides').checked ? 'guide' : 'clean')]);
    if (token !== previewToken) return;
    for (const [element,url] of [[$('Original'),original],[$('Crop'),crop]]) { if (url) element.src = url; else element.removeAttribute('src'); }
    $('Approve').disabled = !crop; $('Adjust').disabled = !original; $('ResetReview').disabled = !row || row.outcome === 'pending';
  }
  async function move(delta) { state.sequence = Math.max(1,Math.min(state.total,state.sequence+delta)); state.offset = Math.floor((state.sequence-1)/24)*24; await page(); }
  $('Calibration').onclick = () => act(async () => setCalibration(await api.chooseCalibration()));
  $('Default').onclick = () => act(async () => setCalibration(await api.defaultCalibration()));
  $('Folder').onclick = () => act(async () => { const input = await api.chooseFolder($('Recursive').checked); if (input) { state.input = input; $('FolderName').textContent = `${input.count} JPGs · ${input.folder}`; } });
  $('Recursive').onchange = () => { state.input = null; $('FolderName').textContent = 'Choose the folder again to apply this scan setting.'; controls(); };
  $('Mode').onchange = controls;
  $('Start').onclick = () => act(async () => {
    state.active = true; controls(); status('Verifying assets and initializing the offline worker…');
    try {
      const run = await api.start({ inferenceMaxDimension:Number($('Inference').value),previewMaxDimension:Number($('Preview').value),mode:$('Mode').value,
        targetPhotosPerMinute:Number($('Rate').value),burstSize:Number($('Burst').value),storageClass:$('Storage').value,powerMode:$('Power').value });
      state.runId = run.id; state.sequence = 1; state.offset = 0; setHeartbeat(); await loadRuns();
    } catch(error) { state.active = false; throw error; }
  });
  $('Cancel').onclick = () => act(async () => { await api.cancel(); status('Cancelling; completed previews and partial performance logs are retained.'); });
  $('PageBack').onclick = () => act(async () => { state.offset = Math.max(0,state.offset-24); state.sequence=state.offset+1; await page(); });
  $('PageNext').onclick = () => act(async () => { state.offset += 24; state.sequence=state.offset+1; await page(); });
  $('Previous').onclick = () => act(() => move(-1)); $('Next').onclick = () => act(() => move(1));
  $('Guides').onchange = () => act(select); $('Filter').onchange = () => act(page);
  for (const [id,value] of [['Approve','approved'],['Adjust','adjust'],['ResetReview','unreviewed']]) $(id).onclick = () => act(async () => { await api.review(state.runId,state.sequence,value); await loadRuns(); });
  $('Runs').onchange = () => act(async () => { state.runId=$('Runs').value; state.sequence=1; state.offset=0; renderSummary(); await page(); });
  $('Compare').onchange = renderSummary; $('Refresh').onclick = () => act(loadRuns);
  $('Recover').onclick = () => act(async () => { await api.recover(state.runId); status('Recovered a partial report from the local journal.'); await loadRuns(); });
  $('Export').onclick = () => act(async () => { const folder=await api.export(state.runId,$('ExportPreviews').checked); if(folder)status(`Export saved: ${folder}`); });
  $('Cache').onclick = () => act(() => api.openCache());
  const unsubscribe = api?.onProgress(progress => {
    state.active = ['initializing','running'].includes(progress.state); controls();
    if (state.runId && progress.id !== state.runId && state.active) return;
    status(`${progress.state} · ${progress.completed}/${progress.total} · ${(progress.elapsedMs/1000).toFixed(1)} s · ${progress.counts.ok} OK, ${progress.counts.review} review, ${progress.counts.failed} failed. ${progress.message}`,
      progress.state === 'interrupted');
    $('Stat-count').textContent=`${progress.completed}/${progress.total}`;
    $('Stat-rate').textContent=display(progress.counts.ok*60000/progress.elapsedMs);
    $('Stat-cpu').textContent=display(progress.resource?.workerCpuPercentOneCore);
    $('Stat-memory').textContent=display(progress.resource?.workerWorkingSetBytes/1048576,0);
    $('Stat-queue').textContent=progress.resource?.queueDepth ?? '—';
    if (!refreshTimer) refreshTimer=setTimeout(() => { refreshTimer=null; act(page); },500);
    if(!state.active) { setHeartbeat(); act(loadRuns); }
  });
  document.addEventListener('keydown',event => { if (!root.classList.contains('active-view') || /INPUT|SELECT|TEXTAREA/.test(event.target.tagName)) return;
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();act(()=>move(event.key==='ArrowLeft'?-1:1));} });
  root.addEventListener('calibration:show', () => act(refresh));
  window.addEventListener('beforeunload', () => { clearInterval(heartbeat); clearTimeout(refreshTimer); unsubscribe?.(); });
  if(!api)status('Calibration bridge is unavailable. Restart this TRECS build.',true);
  else if(root.classList.contains('active-view'))act(refresh);
  controls();
})();
