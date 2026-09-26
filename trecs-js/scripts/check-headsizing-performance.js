const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { hardwareSnapshot, createResourceSampler, statistics, buildPerformanceReport, writePerformanceReport } = require('../src/main/headsizing-performance');

function fixture() {
  return { runId: 'synthetic-test', startedAt: '2026-09-25T12:00:00.000Z', workload: 'synthetic-example', status: 'complete', plannedImages: 4, elapsedMs: 4000, modelInitMs: 500,
    hardware: { platform: 'test', release: 'test', arch: 'test', cpuModels: ['Synthetic CPU'], logicalCpus: 4,
      availableParallelism: 4, totalMemoryBytes: 8 * 1024 ** 3, node: '20', electron: null, chrome: null },
    configuration: { appVersion: '0.1.0', engineVersion: 'foundation-1', inferenceMaxDimension: 1920, concurrency: 1,
      requestedDelegate: 'cpu', actualDelegate: 'unknown', mode: 'folder', targetPhotosPerMinute: 30 },
    items: [
      { sequence: 1, phase: 'cold', outcome: 'ok', queueMs: 0, processingMs: 1200, stageMs: { detect: 900 } },
      { sequence: 2, phase: 'warm', outcome: 'ok', queueMs: 1200, processingMs: 600, stageMs: { detect: 400 } },
      { sequence: 3, phase: 'warm', outcome: 'review', reason: 'no-face', queueMs: 1800, processingMs: 200 },
      { sequence: 4, phase: 'warm', outcome: 'failed', reason: 'decode', queueMs: 2000, processingMs: 10 }
    ],
    samples: [
      { atMs: 0, intervalMs: 0, systemCpuPercent: null, collectorRssBytes: 100 },
      { atMs: 1000, intervalMs: 1000, systemCpuPercent: 20, collectorCpuPercentOneCore: 120, collectorRssBytes: 200, queueDepth: 3 },
      { atMs: 4000, intervalMs: 3000, systemCpuPercent: 80, collectorCpuPercentOneCore: 200, collectorRssBytes: 300, queueDepth: 0 }
    ] };
}

test('nearest-rank statistics handle empty, single and tail values', () => {
  assert.deepEqual(statistics([]), { count: 0, min: null, mean: null, p50: null, p95: null, max: null });
  assert.equal(statistics([25]).p95, 25);
  const values = Array.from({ length: 100 }, (_, i) => i + 1).reverse();
  assert.deepEqual(statistics(values), { count: 100, min: 1, mean: 50.5, p50: 50, p95: 95, max: 100 });
  assert.equal(values[0], 100, 'do not sort caller data');
  assert.throws(() => statistics([NaN]), /finite/);
});

test('reports cold/warm timings, failures and wall-clock throughput separately', () => {
  const report = buildPerformanceReport(fixture());
  assert.deepEqual(report.summary.counts, { ok: 2, review: 1, failed: 1, cancelled: 0, pending: 0 });
  assert.equal(report.summary.successfulImagesPerMinute, 30);
  assert.equal(report.summary.attemptsPerMinute, 60);
  assert.equal(report.summary.timings.cold.processingMs.p50, 1200);
  assert.equal(report.summary.timings.warmSuccessful.processingMs.p95, 600);
  assert.equal(report.summary.timings.warm.totalMs.max, 2010);
  assert.equal(report.summary.timings.all.stageMs.write.mean, null);
  assert.equal(report.summary.reasons['no-face'], 1);
  assert.equal(report.summary.reasons.decode, 1);
  assert.equal(report.summary.resources.systemCpuPercent.intervalWeightedMean, 65);
  assert.equal(report.summary.resources.collectorRssBytes.max, 300);
});

test('CPU sampler uses counter deltas, handles unknown readings and permits multicore CPU above 100%', () => {
  const frames = [
    { atMs: 100, logicalCpus: 4, totalMs: 10000, idleMs: 8000, processCpuUs: 1000, rssBytes: 10, freeBytes: 90 },
    { atMs: 1100, logicalCpus: 4, totalMs: 14000, idleMs: 11000, processCpuUs: 1501000, rssBytes: 20, freeBytes: 80 },
    { atMs: 2100, logicalCpus: 2, totalMs: 100, idleMs: 50, processCpuUs: 0, rssBytes: 30, freeBytes: 70 }
  ];
  const sample = createResourceSampler(() => frames.shift());
  assert.equal(sample().systemCpuPercent, null);
  const second = sample(4);
  assert.equal(second.intervalMs, 1000);
  assert.equal(second.systemCpuPercent, 25);
  assert.equal(second.collectorCpuPercentOneCore, 150);
  assert.equal(second.queueDepth, 4);
  const reset = sample();
  assert.equal(reset.systemCpuPercent, null);
  assert.equal(reset.collectorCpuPercentOneCore, null);
});

test('cancelled/interrupted runs preserve partial work and cannot claim completion', () => {
  const input = fixture();
  input.items.pop();
  assert.throws(() => buildPerformanceReport(input), /missing images/);
  input.status = 'cancelled';
  input.items[2].outcome = 'cancelled'; input.items[2].reason = 'cancelled';
  const report = buildPerformanceReport(input);
  assert.equal(report.summary.counts.pending, 1);
  assert.equal(report.summary.counts.cancelled, 1);
  assert.equal(report.summary.attemptsPerMinute, 30);
  input.status = 'interrupted';
  assert.equal(buildPerformanceReport(input).status, 'interrupted');
});

test('privacy allowlist drops filenames, paths, names, raw errors and landmark data', () => {
  const input = fixture();
  input.folderPath = 'PRIVATE_FOLDER'; input.studentName = 'PRIVATE_STUDENT';
  input.hardware.hostname = 'PRIVATE_HOST'; input.configuration.calibrationPath = 'PRIVATE_PATH';
  input.items[0].fileName = 'PRIVATE_PHOTO.jpg'; input.items[0].error = 'PRIVATE_ERROR';
  input.items[0].landmarks = ['PRIVATE_LANDMARK']; input.samples[0].processList = ['PRIVATE_PROCESS'];
  const serialized = JSON.stringify(buildPerformanceReport(input));
  assert.doesNotMatch(serialized, /PRIVATE/);
  assert.match(serialized, /calling process/);
});

test('invalid timing, duplicate images, options and sample intervals fail validation', () => {
  for (const mutate of [
    input => { input.items[0].processingMs = -1; },
    input => { input.items[0].processingMs = Infinity; },
    input => { input.items[1].sequence = 1; },
    input => { input.items[0].processingMs = 5000; },
    input => { input.samples[2].intervalMs = 4000; },
    input => { input.samples[1].systemCpuPercent = 101; },
    input => { input.modelInitMs = 5000; },
    input => { input.configuration.actualDelegate = 'maybe'; },
    input => { input.configuration.calibrationSha256 = 'bad'; },
    input => { input.configuration.concurrency = 0; },
    input => { input.items[0].reason = 'C:/student.jpg'; },
    input => { input.startedAt = '2026-02-30T12:00:00.000Z'; }
  ]) {
    const input = fixture(); mutate(input);
    assert.throws(() => buildPerformanceReport(input));
  }
});

test('zero-duration empty run does not invent rates or resource values', () => {
  const input = { ...fixture(), items: [], samples: [], plannedImages: 0, elapsedMs: 0, modelInitMs: null };
  const report = buildPerformanceReport(input);
  assert.equal(report.summary.successfulImagesPerMinute, null);
  assert.equal(report.summary.timings.warm.processingMs.mean, null);
  assert.equal(report.summary.resources.systemCpuPercent.max, null);
});

test('report export creates separate run folders with JSON, text and timing/resource CSV', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'trecs-performance-test-'));
  t.after(async () => {
    const resolved = path.resolve(root);
    if (path.dirname(resolved) !== path.resolve(os.tmpdir()) || !path.basename(resolved).startsWith('trecs-performance-test-')) throw new Error('Unsafe test cleanup');
    await fs.rm(resolved, { recursive: true, force: true });
  });
  const first = await writePerformanceReport(fixture(), root);
  const second = await writePerformanceReport(fixture(), root);
  assert.notEqual(first, second);
  assert.deepEqual((await fs.readdir(first)).sort(), ['images.csv', 'report.json', 'resources.csv', 'summary.txt']);
  assert.equal(JSON.parse(await fs.readFile(path.join(first, 'report.json'), 'utf8')).summary.counts.ok, 2);
  assert.match(await fs.readFile(path.join(first, 'summary.txt'), 'utf8'), /synthetic-example/);
  const csv = await fs.readFile(path.join(first, 'images.csv'), 'utf8');
  assert.equal(csv.trim().split('\r\n').length, 5);
  assert.match(csv, /"detectMs"/);
  assert.match(await fs.readFile(path.join(first, 'resources.csv'), 'utf8'), /"collectorCpuPercentOneCore"/);
});

test('live host snapshot/sampler need no Electron or model and expose no machine identity', () => {
  const h = hardwareSnapshot();
  assert.ok(h.totalMemoryBytes > 0);
  assert.ok(h.availableParallelism >= 1);
  assert.equal(h.hostname, undefined);
  const sample = createResourceSampler()();
  assert.ok(sample.collectorRssBytes > 0);
  assert.equal(sample.systemCpuPercent, null);
  assert.equal(sample.collectorCpuPercentOneCore, null);
});
