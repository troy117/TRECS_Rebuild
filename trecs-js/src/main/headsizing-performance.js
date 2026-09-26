// Standalone telemetry foundation. Nothing starts sampling on import.
// The calibration runner/worker supplies timings; this module does no ML.
const os = require('node:os');
const fs = require('node:fs/promises');
const path = require('node:path');
const { performance } = require('node:perf_hooks');

const STAGES = Object.freeze(['read', 'decode', 'orient', 'detect', 'crop', 'encode', 'write']);
const OUTCOMES = ['ok', 'review', 'failed', 'cancelled'];
const REASONS = ['none', 'no-face', 'multiple-faces', 'tilt', 'frame', 'margin', 'decode', 'model', 'timeout', 'cancelled', 'other'];
const RESOURCE_FIELDS = ['systemCpuPercent', 'collectorCpuPercentOneCore', 'collectorRssBytes', 'systemFreeMemoryBytes', 'queueDepth',
  'workerCpuPercentOneCore', 'workerWorkingSetBytes', 'trecsWorkingSetSumBytes', 'mainLoopLagMs', 'uiLoopLagMs'];

function nonnegative(value, name) {
  if (!Number.isFinite(value) || value < 0) throw new Error(`${name} must be finite and nonnegative`);
  return value;
}
function integer(value, name, minimum = 0) {
  if (!Number.isSafeInteger(value) || value < minimum) throw new Error(`Invalid ${name}`);
  return value;
}
function choice(value, options, name) {
  if (!options.includes(value)) throw new Error(`Invalid ${name}`);
  return value;
}
function token(value, name) {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9._-]{1,128}$/.test(value)) throw new Error(`Invalid ${name}`);
  return value;
}
function optionalHash(value) {
  if (value == null) return null;
  if (typeof value !== 'string' || !/^[a-f0-9]{64}$/i.test(value)) throw new Error('Invalid configuration hash');
  return value.toLowerCase();
}
function text(value) { return value == null ? null : String(value).replace(/[\r\n\x00-\x1f]/g, ' ').slice(0, 160); }

function hardwareSnapshot() {
  const cpus = os.cpus();
  return { platform: os.platform(), release: os.release(), arch: os.arch(),
    cpuModels: [...new Set(cpus.map(cpu => cpu.model))], logicalCpus: cpus.length,
    availableParallelism: os.availableParallelism(), totalMemoryBytes: os.totalmem(),
    node: process.versions.node, electron: process.versions.electron ?? null, chrome: process.versions.chrome ?? null };
}

function counters() {
  const cpus = os.cpus(), usage = process.cpuUsage();
  return { atMs: performance.now(), logicalCpus: cpus.length,
    totalMs: cpus.reduce((n, cpu) => n + Object.values(cpu.times).reduce((a, b) => a + b, 0), 0),
    idleMs: cpus.reduce((n, cpu) => n + cpu.times.idle, 0),
    processCpuUs: usage.user + usage.system, rssBytes: process.memoryUsage.rss(), freeBytes: os.freemem() };
}

// CPU deltas are interval averages. The collector's process is NOT automatically
// the Electron ML renderer. Report that scope explicitly until the worker adapter exists.
function createResourceSampler(readCounters = counters) {
  let previous = null, origin = null;
  return function sample(queueDepth = null) {
    if (queueDepth != null) integer(queueDepth, 'queue depth');
    const current = readCounters();
    if (origin === null) origin = current.atMs;
    const intervalMs = previous ? current.atMs - previous.atMs : 0;
    const total = previous ? current.totalMs - previous.totalMs : 0;
    const idle = previous ? current.idleMs - previous.idleMs : 0;
    const cpuUs = previous ? current.processCpuUs - previous.processCpuUs : 0;
    const validSystem = intervalMs > 0 && total > 0 && idle >= 0 && idle <= total
      && current.logicalCpus > 0 && current.logicalCpus === previous.logicalCpus;
    const result = { atMs: current.atMs - origin, intervalMs: Math.max(0, intervalMs),
      systemCpuPercent: validSystem ? 100 * (1 - idle / total) : null,
      collectorCpuPercentOneCore: intervalMs > 0 && cpuUs >= 0 ? cpuUs / (intervalMs * 10) : null,
      collectorRssBytes: current.rssBytes, systemFreeMemoryBytes: current.freeBytes, queueDepth };
    previous = current;
    return result;
  };
}

function statistics(values) {
  const sorted = values.filter(value => value != null).sort((a, b) => a - b);
  sorted.forEach(value => nonnegative(value, 'statistic'));
  const count = sorted.length;
  return { count, min: count ? sorted[0] : null, mean: count ? sorted.reduce((a, b) => a + b, 0) / count : null,
    p50: count ? sorted[Math.ceil(count * .5) - 1] : null,
    p95: count ? sorted[Math.ceil(count * .95) - 1] : null, max: count ? sorted[count - 1] : null };
}

function normalizeItem(item) {
  const queueMs = nonnegative(item.queueMs, 'queue time'), processingMs = nonnegative(item.processingMs, 'processing time');
  const stages = Object.fromEntries(STAGES.map(name => [name,
    item.stageMs?.[name] == null ? null : nonnegative(item.stageMs[name], `${name} time`)]));
  return { sequence: integer(item.sequence, 'sequence', 1),
    phase: choice(item.phase, ['cold', 'warm'], 'phase'), outcome: choice(item.outcome, OUTCOMES, 'outcome'),
    reason: choice(item.reason ?? 'none', REASONS, 'reason'),
    width: item.width == null ? null : integer(item.width, 'width', 1),
    height: item.height == null ? null : integer(item.height, 'height', 1),
    inputBytes: item.inputBytes == null ? null : integer(item.inputBytes, 'input bytes'),
    orientationAttempts: item.orientationAttempts == null ? null : integer(item.orientationAttempts, 'orientation attempts'),
    queueMs, processingMs, totalMs: queueMs + processingMs, stageMs: stages };
}

function timingSummary(items) {
  return { queueMs: statistics(items.map(item => item.queueMs)),
    processingMs: statistics(items.map(item => item.processingMs)), totalMs: statistics(items.map(item => item.totalMs)),
    stageMs: Object.fromEntries(STAGES.map(name => [name, statistics(items.map(item => item.stageMs[name]))])) };
}

function buildPerformanceReport(input) {
  if (typeof input.startedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(input.startedAt)
    || !Number.isFinite(Date.parse(input.startedAt)) || new Date(input.startedAt).toISOString() !== input.startedAt) throw new Error('Invalid start timestamp');
  const elapsedMs = nonnegative(input.elapsedMs, 'elapsed time');
  const modelInitMs = input.modelInitMs == null ? null : nonnegative(input.modelInitMs, 'model initialization');
  if (modelInitMs > elapsedMs) throw new Error('Model initialization exceeds run time');
  const plannedImages = integer(input.plannedImages, 'planned images');
  const items = input.items.map(normalizeItem).sort((a, b) => a.sequence - b.sequence);
  if (items.length > plannedImages || new Set(items.map(item => item.sequence)).size !== items.length
    || items.some(item => item.sequence > plannedImages || item.totalMs > elapsedMs)) throw new Error('Invalid image count, sequence or duration');
  const status = choice(input.status, ['complete', 'cancelled', 'interrupted'], 'run status');
  if (status === 'complete' && items.length !== plannedImages) throw new Error('Complete run is missing images');
  let previousAt = 0;
  const samples = input.samples.map(sample => {
    const atMs = nonnegative(sample.atMs, 'sample time'), intervalMs = nonnegative(sample.intervalMs, 'sample interval');
    if (atMs < previousAt || atMs > elapsedMs || intervalMs > atMs - previousAt + 1e-6) throw new Error('Invalid resource sample interval');
    previousAt = atMs;
    const result = { atMs, intervalMs };
    result.powerSource = choice(sample.powerSource ?? 'unknown', ['ac', 'battery', 'unknown'], 'sample power source');
    for (const name of RESOURCE_FIELDS) result[name] = sample[name] == null ? null : nonnegative(sample[name], name);
    if (result.systemCpuPercent > 100) throw new Error('System CPU must be at most 100 percent');
    if (result.queueDepth != null) integer(result.queueDepth, 'queue depth');
    return result;
  });
  const config = input.configuration;
  const configuration = {
    appVersion: token(config.appVersion, 'app version'), engineVersion: token(config.engineVersion, 'engine version'),
    buildRevision: config.buildRevision == null ? null : token(config.buildRevision, 'build revision'),
    calibrationSha256: optionalHash(config.calibrationSha256), modelSha256: optionalHash(config.modelSha256),
    datasetSha256: optionalHash(config.datasetSha256), libraryVersion: config.libraryVersion == null ? null : token(config.libraryVersion, 'library version'),
    inferenceMaxDimension: integer(config.inferenceMaxDimension, 'inference size', 1),
    concurrency: integer(config.concurrency, 'concurrency', 1),
    previewMaxDimension: config.previewMaxDimension == null ? null : integer(config.previewMaxDimension, 'preview size', 1),
    requestedDelegate: choice(config.requestedDelegate, ['cpu', 'gpu'], 'requested delegate'),
    actualDelegate: choice(config.actualDelegate, ['cpu', 'gpu', 'unknown'], 'actual delegate'),
    mode: choice(config.mode, ['folder', 'capture-rate'], 'mode'),
    targetPhotosPerMinute: config.targetPhotosPerMinute == null ? null : nonnegative(config.targetPhotosPerMinute, 'target rate'),
    powerSource: choice(config.powerSource ?? 'unknown', ['ac', 'battery', 'unknown'], 'power source'),
    storageClass: choice(config.storageClass ?? 'unknown', ['ssd', 'hdd', 'removable', 'network', 'unknown'], 'storage class')
  };
  configuration.burstSize = integer(config.burstSize ?? 1, 'burst size', 1);
  configuration.powerMode = choice(config.powerMode ?? 'unknown', ['balanced', 'efficiency', 'performance', 'unknown'], 'power mode');
  const h = input.hardware ?? hardwareSnapshot();
  const hardware = { platform: text(h.platform), release: text(h.release), arch: text(h.arch),
    cpuModels: (h.cpuModels ?? []).map(text), logicalCpus: integer(h.logicalCpus, 'logical CPUs'),
    availableParallelism: integer(h.availableParallelism, 'available parallelism', 1),
    totalMemoryBytes: integer(h.totalMemoryBytes, 'total memory'), node: text(h.node), electron: text(h.electron), chrome: text(h.chrome) };
  const counts = Object.fromEntries(OUTCOMES.map(outcome => [outcome, items.filter(item => item.outcome === outcome).length]));
  const resources = Object.fromEntries(RESOURCE_FIELDS.map(name => {
    const valid = samples.filter(sample => sample[name] != null && sample.intervalMs > 0);
    const duration = valid.reduce((n, sample) => n + sample.intervalMs, 0);
    return [name, { ...statistics(samples.map(sample => sample[name])),
      intervalWeightedMean: duration ? valid.reduce((n, sample) => n + sample[name] * sample.intervalMs, 0) / duration : null,
      measuredIntervalMs: duration }];
  }));
  const measured = items.filter(item => item.outcome !== 'cancelled');
  return { schemaVersion: 2, runId: token(input.runId, 'run ID'), startedAt: input.startedAt,
    workload: choice(input.workload, ['real-jpgs', 'synthetic-example'], 'workload'), status,
    plannedImages, elapsedMs, modelInitMs, configuration, hardware,
    measurementNotes: {
      cpuScope: 'System CPU includes other apps. Collector CPU/RSS cover only the calling process, not all TRECS processes or the ML worker.',
      electronScope: 'Worker CPU: cumulative deltas when available, otherwise Electron normalized CPU multiplied by logical CPU count (Electron 31); 100% per core. First sample/process changes are unavailable. One sampling owner required. Working sets: KB converted to bytes. TRECS working-set sum can double-count shared RAM. Missing readings are null.',
      cpuUnits: 'System CPU: 0-100%. Collector CPU: 100% per logical CPU; can exceed 100%. Memory: bytes. Times: milliseconds.',
      sampling: 'Peaks are sampled, not guaranteed absolute peaks. Missing readings are null, not zero. Percentiles use nearest rank.',
      latency: 'Total = queue wait + processing until result is returned; excludes later UI paint. Stage timings may overlap and must not be summed across concurrent images.',
      throughput: 'Rates use total wall time, including setup and queue drain. Successful rate counts only ok; attempts also include review/failed.',
      readiness: 'Timing alone does not establish crop quality or readiness for live capture. No automatic configuration changes.'
    },
    summary: { counts: { ...counts, pending: plannedImages - items.length },
      successfulImagesPerMinute: elapsedMs > 0 ? counts.ok * 60000 / elapsedMs : null,
      attemptsPerMinute: elapsedMs > 0 ? measured.length * 60000 / elapsedMs : null,
      reasons: Object.fromEntries(REASONS.filter(reason => reason !== 'none').map(reason => [reason, items.filter(item => item.reason === reason).length])),
      timings: { all: timingSummary(measured), cold: timingSummary(measured.filter(item => item.phase === 'cold')),
        warm: timingSummary(measured.filter(item => item.phase === 'warm')),
        warmSuccessful: timingSummary(measured.filter(item => item.phase === 'warm' && item.outcome === 'ok')) }, resources },
    items, samples };
}

function csv(rows) {
  return rows.map(row => row.map(value => {
    const raw = value == null ? '' : String(value);
    // Protect text cells if a future field admits spreadsheet formulas.
    const safe = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
    return `"${safe.replaceAll('"', '""')}"`;
  }).join(',')).join('\r\n') + '\r\n';
}

async function writePerformanceReport(input, outputRoot) {
  const report = buildPerformanceReport(input); // Allowlist/recalculate; never export arbitrary input keys.
  await fs.mkdir(outputRoot, { recursive: true });
  const folder = await fs.mkdtemp(path.join(path.resolve(outputRoot), 'headsizing-benchmark-'));
  const summary = report.summary;
  const show = value => value == null ? 'unavailable' : value.toFixed(2);
  const notes = [
    `TRECS headsizing performance - ${report.workload}`, `Run: ${report.runId}; started: ${report.startedAt}; status: ${report.status}`,
    `Images: ${report.plannedImages}; ok: ${summary.counts.ok}; review: ${summary.counts.review}; failed: ${summary.counts.failed}; cancelled: ${summary.counts.cancelled}; pending: ${summary.counts.pending}`,
    `Run wall time: ${show(report.elapsedMs)} ms; model initialization: ${show(report.modelInitMs)} ms`,
    `Successful images/minute (whole run): ${show(summary.successfulImagesPerMinute)}`,
    `Warm successful processing: median ${show(summary.timings.warmSuccessful.processingMs.p50)} ms; p95 ${show(summary.timings.warmSuccessful.processingMs.p95)} ms`,
    `System CPU weighted average: ${show(summary.resources.systemCpuPercent.intervalWeightedMean)}%; sampled peak: ${show(summary.resources.systemCpuPercent.max)}%`,
    ...Object.values(report.measurementNotes)
  ].join('\n') + '\n';
  const rows = report.items.map(item => [item.sequence, item.phase, item.outcome, item.reason, item.width, item.height,
    item.inputBytes, item.orientationAttempts, item.queueMs, item.processingMs, item.totalMs, ...STAGES.map(name => item.stageMs[name])]);
  await fs.writeFile(path.join(folder, 'images.csv'), csv([['sequence', 'phase', 'outcome', 'reason', 'width', 'height',
    'inputBytes', 'orientationAttempts', 'queueMs', 'processingMs', 'totalMs', ...STAGES.map(name => `${name}Ms`)], ...rows]), { flag: 'wx' });
  await fs.writeFile(path.join(folder, 'resources.csv'), csv([['atMs', 'intervalMs', 'powerSource', ...RESOURCE_FIELDS],
    ...report.samples.map(sample => [sample.atMs, sample.intervalMs, sample.powerSource, ...RESOURCE_FIELDS.map(name => sample[name])])]), { flag: 'wx' });
  await fs.writeFile(path.join(folder, 'summary.txt'), notes, { flag: 'wx' });
  // Write the complete report last; a folder without report.json is incomplete.
  await fs.writeFile(path.join(folder, 'report.json'), JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
  return folder;
}

module.exports = { STAGES, hardwareSnapshot, createResourceSampler, statistics, buildPerformanceReport, writePerformanceReport };
