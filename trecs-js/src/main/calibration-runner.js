const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const { EventEmitter } = require('node:events');
const { performance } = require('node:perf_hooks');
const { sha256 } = require('./headsizing-assets');
const { hardwareSnapshot, createResourceSampler, buildPerformanceReport, writePerformanceReport } = require('./headsizing-performance');
const MAX_IMAGES = 10000, MAX_RUN_MS = 4 * 60 * 60 * 1000;
const within = (root, file) => { const relative = path.relative(root, file); return !relative || (!relative.startsWith('..' + path.sep) && relative !== '..' && !path.isAbsolute(relative)); };
const validId = id => /^[a-f0-9-]{36}$/.test(id || '');
async function canonicalPath(file) {
  const resolved = path.resolve(file);
  try { return await fs.realpath(resolved); }
  catch (error) {
    if (error.code !== 'ENOENT' || path.dirname(resolved) === resolved) throw error;
    return path.join(await canonicalPath(path.dirname(resolved)), path.basename(resolved));
  }
}
async function atomicJson(file, value) {
  const temporary = file + '.tmp-' + crypto.randomUUID();
  await fs.writeFile(temporary, JSON.stringify(value, null, 2), { flag: 'wx' });
  await fs.rename(temporary, file);
}
async function scanFolder(folder, recursive, excludedRoot) {
  const root = await fs.realpath(folder);
  excludedRoot = await canonicalPath(excludedRoot);
  if (within(root, excludedRoot) || within(excludedRoot, root)) throw new Error('Choose a photo folder separate from the calibration cache.');
  const files = []; let visited = 0;
  async function scan(directory) {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      if (++visited > 50000) throw new Error('Folder has too many entries; select a smaller test folder.');
      if (entry.isSymbolicLink()) continue;
      const file = path.join(directory, entry.name);
      if (entry.isDirectory() && recursive) await scan(file);
      else if (entry.isFile() && /\.jpe?g$/i.test(entry.name)) {
        if (files.length >= MAX_IMAGES) throw new Error(`Limit is ${MAX_IMAGES} JPGs per test.`);
        files.push({ path: file, name: path.relative(root, file) });
      }
    }
  }
  await scan(root);
  files.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
  return { root, recursive, files };
}
function validateOptions(input) {
  const options = { inferenceMaxDimension: Number(input.inferenceMaxDimension ?? 1920), previewMaxDimension: Number(input.previewMaxDimension ?? 1000),
    mode: input.mode ?? 'folder', targetPhotosPerMinute: Number(input.targetPhotosPerMinute ?? 30), burstSize: Number(input.burstSize ?? 1),
    storageClass: input.storageClass ?? 'unknown', powerMode: input.powerMode ?? 'unknown' };
  if (![960, 1280, 1920].includes(options.inferenceMaxDimension) || ![600, 1000, 1500].includes(options.previewMaxDimension)
    || !['folder', 'capture-rate'].includes(options.mode) || !Number.isFinite(options.targetPhotosPerMinute)
    || options.targetPhotosPerMinute < 1 || options.targetPhotosPerMinute > 600
    || !Number.isInteger(options.burstSize) || options.burstSize < 1 || options.burstSize > 20
    || !['ssd', 'hdd', 'removable', 'network', 'unknown'].includes(options.storageClass)
    || !['balanced', 'efficiency', 'performance', 'unknown'].includes(options.powerMode)) throw new Error('Invalid benchmark settings');
  return options;
}
function workerCpuPercent(worker, previous, at, logicalCpus) {
  if (!worker || !previous || previous.pid !== worker.pid || previous.creationTime !== worker.creationTime || at <= previous.at) return null;
  if (Number.isFinite(worker.cpu?.cumulativeCPUUsage) && Number.isFinite(previous.cpu)) {
    const delta = worker.cpu.cumulativeCPUUsage - previous.cpu;
    return delta >= 0 ? delta * 100000 / (at - previous.at) : null;
  }
  // Electron 31 divides platform CPU usage by NumberOfProcessors in GetAppMetrics.
  // This service is its only sampling owner; undo normalization for 100% per core.
  const percent = worker.cpu?.percentCPUUsage;
  return Number.isFinite(percent) && percent >= 0 ? percent * logicalCpus : null;
}

class CalibrationRunner extends EventEmitter {
  constructor({ root, workerFactory, verifyAssets, appVersion, metrics = () => [], power = () => 'unknown' }) {
    super(); Object.assign(this, { root: path.resolve(root), workerFactory, verifyAssets, appVersion, metrics, power });
    this.active = null; this.input = null; this.calibration = null; this.uiLag = null; this.reviewWrites = Promise.resolve();
  }
  async loadCalibration(file) {
    if (this.active) throw new Error('Stop the current test before changing calibration.');
    if ((await fs.stat(file)).size > 65536) throw new Error('Calibration file is too large.');
    const bytes = await fs.readFile(file);
    const { calibrationFromText } = await import('../shared/headsizing/geometry.mjs');
    const { validateCalibration } = await import('../shared/headsizing/recipe.mjs');
    const hash = sha256(bytes), calibration = { id: hash.slice(0, 16), revision: 1, values: calibrationFromText(bytes.toString('utf8')) };
    validateCalibration(calibration);
    this.calibration = { calibration, hash, name: path.basename(file) };
    return this.calibration;
  }
  async chooseInput(folder, recursive = false) {
    if (this.active) throw new Error('Stop the current test before changing its folder.');
    const input = await scanFolder(folder, recursive === true, this.root);
    if (!input.files.length) throw new Error('No JPG images found.');
    this.input = input;
    return { folder: input.root, count: input.files.length, recursive: input.recursive };
  }
  async start(input) {
    if (this.active) throw new Error('A calibration test is already running.');
    if (!this.calibration || !this.input) throw new Error('Load a calibration and select a JPG folder first.');
    const options = validateOptions(input), id = crypto.randomUUID();
    const run = { id, options, files: this.input.files.map(file => ({ ...file })), inputRoot: this.input.root,
      calibration: structuredClone(this.calibration), cancel: false, completed: 0, counts: { ok: 0, review: 0, failed: 0, cancelled: 0 },
      folder: path.join(this.root, id), started: performance.now(), startedAt: new Date().toISOString(), state: 'initializing', itemRows: [], samples: [], hashes: [], reviews: {}, journal: Promise.resolve(), worker: null };
    this.active = run;
    try {
      const assets = await this.verifyAssets();
      await fs.mkdir(path.join(run.folder, 'items'), { recursive: true });
      const { ENGINE_VERSION } = await import('../shared/headsizing/recipe.mjs');
      const buildFiles = ['calibration-runner.js', 'headsizing-worker.js', 'headsizing-worker.mjs', 'headsizing-performance.js', '../shared/headsizing/recipe.mjs', '../shared/headsizing/geometry.mjs'];
      const buildRevision = sha256(Buffer.concat(await Promise.all(buildFiles.map(file => fs.readFile(path.join(__dirname, file))))));
      run.report = { runId: id, startedAt: run.startedAt, workload: 'real-jpgs', plannedImages: run.files.length,
        hardware: hardwareSnapshot(), configuration: { ...options, appVersion: this.appVersion, engineVersion: ENGINE_VERSION,
          buildRevision,
          calibrationSha256: run.calibration.hash, modelSha256: assets.modelSha256, libraryVersion: assets.libraryVersion,
          concurrency: 1, requestedDelegate: 'cpu', actualDelegate: 'unknown', powerSource: this.power() }, modelInitMs: null };
      await atomicJson(path.join(run.folder, 'run.json'), { ...run.report, status: 'running', inputRoot: run.inputRoot,
        calibration: run.calibration, files: run.files.map(({ name }) => name) });
      run.done = this.execute(run);
      return { id };
    } catch (error) { this.active = null; throw error; }
  }
  progress(run) {
    this.emit('progress', { id: run.id, state: run.state, completed: run.completed, total: run.files.length,
      counts: run.counts, elapsedMs: performance.now() - run.started, latest: run.latest ?? null,
      resource: run.samples.at(-1) ?? null, message: run.message ?? '' });
  }
  append(run, event) {
    run.journal = run.journal.then(() => fs.appendFile(path.join(run.folder, 'events.jsonl'), JSON.stringify(event) + '\n'));
    run.journal.catch(() => { run.cancel = true; run.message = 'Could not persist run log; processing stopped.'; run.worker?.close(); });
    return run.journal;
  }
  async execute(run) {
    const sampleResources = createResourceSampler();
    let lastTick = performance.now(), previousMetric = null, timer, sampleOffset = null;
    const sample = () => {
      const current = performance.now(), data = sampleResources(this.queueDepth(run));
      data.powerSource = this.power();
      if (sampleOffset === null) sampleOffset = current - run.started;
      data.atMs += sampleOffset; data.mainLoopLagMs = Math.max(0, current - lastTick - 1000); lastTick = current;
      data.uiLoopLagMs = this.uiLag?.at > current - 3000 ? this.uiLag.value : null;
      let metrics = []; try { metrics = this.metrics(); } catch {}
      const worker = metrics.find(metric => metric.pid === run.worker?.getPid());
      data.workerWorkingSetBytes = Number.isFinite(worker?.memory?.workingSetSize) ? worker.memory.workingSetSize * 1024 : null;
      data.trecsWorkingSetSumBytes = metrics.length ? metrics.reduce((sum, metric) => sum + (metric.memory?.workingSetSize ?? 0) * 1024, 0) : null;
      data.workerCpuPercentOneCore = workerCpuPercent(worker, previousMetric, current, run.report.hardware.logicalCpus);
      previousMetric = worker ? { pid: worker.pid, creationTime: worker.creationTime, cpu: worker.cpu?.cumulativeCPUUsage, at: current } : null;
      run.samples.push(data); this.append(run, { type: 'resource', sample: data }); this.progress(run);
    };
    try {
      sample(); timer = setInterval(sample, 1000);
      if (run.cancel) throw new Error('Initialization cancelled.');
      run.worker = this.workerFactory(); const initStart = performance.now();
      await run.worker.start(); run.report.modelInitMs = performance.now() - initStart;
      run.report.configuration.actualDelegate = 'cpu'; run.readyAt = performance.now(); run.state = 'running';
      sample();
      for (let index = 0; index < run.files.length && !run.cancel; index++) {
        if (performance.now() - run.started > MAX_RUN_MS) { run.message = 'Four-hour run limit reached; remaining images are pending.'; break; }
        const due = this.releaseTime(run, index);
        while (!run.cancel && performance.now() < due && performance.now() - run.started < MAX_RUN_MS) await new Promise(resolve => setTimeout(resolve, Math.min(100, due - performance.now())));
        if (performance.now() - run.started >= MAX_RUN_MS) { run.message = 'Four-hour run limit reached.'; break; }
        if (run.cancel) break;
        const started = performance.now(), sequence = index + 1, file = run.files[index];
        const row = { sequence, phase: index === 0 ? 'cold' : 'warm', queueMs: Math.max(0, started - due), processingMs: 0, stageMs: {} };
        let result;
        try {
          const real = await fs.realpath(file.path), stat = await fs.lstat(file.path);
          if (!within(run.inputRoot, real) || stat.isSymbolicLink() || !stat.isFile() || stat.size > 100 * 1024 * 1024) throw new Error('Image is outside the folder, not regular, or over 100 MB.');
          const bytes = await fs.readFile(real), after = await fs.stat(real);
          if (stat.size !== after.size || stat.mtimeMs !== after.mtimeMs || bytes.length !== stat.size) throw new Error('Image changed during reading.');
          const hash = sha256(bytes); run.hashes.push(hash); row.inputBytes = bytes.length; row.stageMs.read = performance.now() - started;
          result = await run.worker.process({ bytes, sha256: hash, captureId: `${run.id}-${sequence}`, calibration: run.calibration.calibration, ...run.options });
          Object.assign(row, { outcome: result.outcome, reason: result.reason, width: result.width, height: result.height,
            orientationAttempts: result.orientationAttempts, stageMs: { ...row.stageMs, ...result.stageMs } });
          const writeStart = performance.now();
          for (const [role, buffer] of Object.entries(result.buffers)) {
            if (!['original', 'clean', 'guide', 'thumbnail'].includes(role)) throw new Error('Invalid preview role');
            await fs.writeFile(path.join(run.folder, 'items', `${sequence}-${role}.jpg`), buffer, { flag: 'wx' });
          }
          const { buffers, ...details } = result;
          await atomicJson(path.join(run.folder, 'items', `${sequence}.json`), { ...details, name: file.name });
          row.stageMs.write = performance.now() - writeStart;
        } catch (error) {
          row.outcome = run.cancel ? 'cancelled' : 'failed'; row.reason = run.cancel ? 'cancelled' : 'other';
          await atomicJson(path.join(run.folder, 'items', `${sequence}.json`), { outcome: row.outcome, reason: row.reason, name: file.name, warnings: [error.message] });
          if (!run.worker?.getPid()) run.message = 'Worker stopped. Completed results are retained; start a new run to retry.';
        }
        row.processingMs = performance.now() - started;
        run.itemRows.push(row); run.completed++; run.counts[row.outcome]++; run.latest = { sequence, name: file.name, outcome: row.outcome, processingMs: row.processingMs };
        await this.append(run, { type: 'image', atMs: performance.now() - run.started, item: row }); this.progress(run);
        if (!run.worker?.getPid()) break;
      }
    } catch (error) { run.message = error.message; }
    finally {
      clearInterval(timer);
      try {
        sample(); await run.journal;
        const complete = run.completed === run.files.length && !run.cancel;
        const status = run.cancel ? 'cancelled' : complete ? 'complete' : 'interrupted';
        run.report.configuration.datasetSha256 = run.hashes.length === run.files.length ? sha256(Buffer.from(run.hashes.sort().join('\n'))) : null;
        const reportInput = { ...run.report, elapsedMs: performance.now() - run.started, status, items: run.itemRows, samples: run.samples };
        const report = buildPerformanceReport(reportInput);
        await atomicJson(path.join(run.folder, 'report.json'), report);
        run.state = status;
      } catch (error) { run.state = 'interrupted'; run.message = `Report incomplete: ${error.message}. The run journal is retained.`; }
      run.worker?.close(); this.active = null; this.progress(run);
    }
  }
  releaseTime(run, index) {
    return run.readyAt + (run.options.mode === 'folder' ? 0 : Math.floor(index / run.options.burstSize) * run.options.burstSize * 60000 / run.options.targetPhotosPerMinute);
  }
  queueDepth(run) {
    if (!run.readyAt) return run.options.mode === 'folder' ? run.files.length : 0;
    if (run.options.mode === 'folder') return Math.max(0, run.files.length - run.completed);
    const count = (Math.floor((performance.now() - run.readyAt) / (run.options.burstSize * 60000 / run.options.targetPhotosPerMinute)) + 1) * run.options.burstSize;
    return Math.max(0, Math.min(count, run.files.length) - run.completed);
  }
  cancel() { if (this.active) { this.active.cancel = true; this.active.worker?.close(); } }
  runFolder(id) { if (!validId(id)) throw new Error('Invalid run ID'); return path.join(this.root, id); }
  async listRuns() {
    await fs.mkdir(this.root, { recursive: true });
    const results = [];
    for (const entry of (await fs.readdir(this.root, { withFileTypes: true })).filter(entry => entry.isDirectory() && validId(entry.name))) {
      try {
        const meta = JSON.parse(await fs.readFile(path.join(this.root, entry.name, 'run.json'), 'utf8'));
        let report; try { report = JSON.parse(await fs.readFile(path.join(this.root, entry.name, 'report.json'), 'utf8')); } catch {}
        let reviews = {}; try { reviews = JSON.parse(await fs.readFile(path.join(this.root, entry.name, 'reviews.json'), 'utf8')); } catch {}
        const reviewCounts = { approved:0, adjust:0, unreviewed:meta.plannedImages };
        for(const value of Object.values(reviews)) if(value==='approved'||value==='adjust'){reviewCounts[value]++;reviewCounts.unreviewed--;}
        results.push({ id: entry.name, startedAt: meta.startedAt, calibration: meta.calibration.name, total: meta.plannedImages,
          status: this.active?.id === entry.name ? this.active.state : report?.status ?? 'interrupted', summary: report?.summary ?? null,
          configuration: report?.configuration ?? meta.configuration, hardware:meta.hardware, reviewCounts });
      } catch {}
    }
    return results.sort((a, b) => b.startedAt.localeCompare(a.startedAt)).slice(0, 100);
  }
  async items(id, offset = 0) {
    const folder = this.runFolder(id), meta = JSON.parse(await fs.readFile(path.join(folder, 'run.json'), 'utf8'));
    if (!Number.isInteger(offset) || offset < 0 || offset > MAX_IMAGES) throw new Error('Invalid page');
    const rows = [];
    for (let i = offset; i < Math.min(meta.files.length, offset + 24); i++) {
      let details; try { details = JSON.parse(await fs.readFile(path.join(folder, 'items', `${i + 1}.json`), 'utf8')); } catch {}
      rows.push({ sequence: i + 1, name: meta.files[i], outcome: details?.outcome ?? 'pending', reason: details?.reason,
        width:details?.width, height:details?.height, warnings: details?.warnings ?? [] });
    }
    let reviews = {}; try { reviews = JSON.parse(await fs.readFile(path.join(folder, 'reviews.json'), 'utf8')); } catch {}
    return { total: meta.files.length, rows: rows.map(row => ({ ...row, humanReview: reviews[row.sequence] ?? 'unreviewed' })) };
  }
  async preview(id, sequence, role) {
    if (!Number.isInteger(sequence) || sequence < 1 || sequence > MAX_IMAGES || !['original', 'clean', 'guide', 'thumbnail'].includes(role)) throw new Error('Invalid preview request');
    try { return 'data:image/jpeg;base64,' + (await fs.readFile(path.join(this.runFolder(id), 'items', `${sequence}-${role}.jpg`))).toString('base64'); }
    catch (error) { if (error.code === 'ENOENT') return null; throw error; }
  }
  async review(id, sequence, value) {
    const write = this.reviewWrites.then(() => this.writeReview(id, sequence, value));
    this.reviewWrites = write.catch(() => {});
    return write;
  }
  async writeReview(id, sequence, value) {
    if (!Number.isInteger(sequence) || sequence < 1 || !['approved', 'adjust', 'unreviewed'].includes(value)) throw new Error('Invalid review');
    const folder = this.runFolder(id), details = JSON.parse(await fs.readFile(path.join(folder, 'items', `${sequence}.json`), 'utf8'));
    if (!details.recipe && value === 'approved') throw new Error('There is no crop to approve.');
    let reviews = {}; try { reviews = JSON.parse(await fs.readFile(path.join(folder, 'reviews.json'), 'utf8')); } catch {}
    reviews[sequence] = value; await atomicJson(path.join(folder, 'reviews.json'), reviews);
    return value;
  }
  async recover(id) {
    if (this.active) throw new Error('Stop the active run before recovery.');
    const folder = this.runFolder(id), meta = JSON.parse(await fs.readFile(path.join(folder, 'run.json'), 'utf8'));
    try { return JSON.parse(await fs.readFile(path.join(folder, 'report.json'), 'utf8')).summary; }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    const events = (await fs.readFile(path.join(folder, 'events.jsonl'), 'utf8')).split('\n');
    const items = [], samples = []; let lastEventMs = 0;
    for (const line of events) {
      try { const event = JSON.parse(line); if (Number.isFinite(event.atMs)) lastEventMs = Math.max(lastEventMs, event.atMs);
        if (event.type === 'image') items.push(event.item); else if (event.type === 'resource') samples.push(event.sample); } catch {}
    }
    const elapsedMs = Math.max(lastEventMs, ...samples.map(sample => sample.atMs), ...items.map(item => item.queueMs + item.processingMs));
    const report = buildPerformanceReport({ ...meta, status: 'interrupted', elapsedMs, modelInitMs: null, items, samples });
    await atomicJson(path.join(folder, 'report.json'), report); return report.summary;
  }
  async exportReport(id, outputRoot, includePreviews = false) {
    if (this.active) throw new Error('Wait for the current test to finish before exporting.');
    const folder = this.runFolder(id), meta = JSON.parse(await fs.readFile(path.join(folder, 'run.json'), 'utf8'));
    const destination = await fs.realpath(outputRoot);
    if (within(meta.inputRoot, destination) || within(await canonicalPath(this.root), destination)) throw new Error('Choose an export folder outside the input folder and calibration cache.');
    const report = JSON.parse(await fs.readFile(path.join(folder, 'report.json'), 'utf8'));
    const exported = await writePerformanceReport(report, destination);
    let reviews = {}; try { reviews = JSON.parse(await fs.readFile(path.join(folder, 'reviews.json'), 'utf8')); } catch {}
    await fs.writeFile(path.join(exported, 'human-review.json'), JSON.stringify({ purpose: 'Crop evaluation only; not production approval', reviews }), { flag: 'wx' });
    if (includePreviews) {
      const target = path.join(exported, 'private-previews'); await fs.mkdir(target);
      for (let sequence = 1; sequence <= meta.plannedImages; sequence++) {
        for (const role of ['clean', 'guide']) {
          try { await fs.copyFile(path.join(folder, 'items', `${sequence}-${role}.jpg`), path.join(target, `${sequence}-${role}.jpg`)); } catch (error) { if (error.code !== 'ENOENT') throw error; }
        }
        try { const details = JSON.parse(await fs.readFile(path.join(folder, 'items', `${sequence}.json`), 'utf8'));
          if (details.recipe) await fs.writeFile(path.join(target, `${sequence}-recipe.json`), JSON.stringify(details.recipe), { flag: 'wx' });
        } catch (error) { if (error.code !== 'ENOENT') throw error; }
      }
    }
    await fs.writeFile(path.join(exported, 'export-complete.json'), JSON.stringify({ complete: true, privatePreviewsIncluded: includePreviews }), { flag: 'wx' });
    return exported;
  }
}
module.exports = { CalibrationRunner, scanFolder, validateOptions, within, atomicJson, workerCpuPercent };
