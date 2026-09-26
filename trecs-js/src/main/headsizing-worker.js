const path = require('node:path');
const { pathToFileURL, fileURLToPath } = require('node:url');
const crypto = require('node:crypto');
const { verifyAssets } = require('./headsizing-assets');

function createHeadsizingWorker({ BrowserWindow, ipcMain, session, assetRoot }) {
  const channel = `headsizing:reply:${crypto.randomUUID()}`;
  const partition = session.fromPartition(`headsizing-${crypto.randomUUID()}`);
  const roots = [path.resolve(__dirname), path.resolve(__dirname, '../shared/headsizing'), path.resolve(assetRoot)];
  const permitted = url => {
    try { const file = fileURLToPath(url); return roots.some(root => file === root || file.startsWith(root + path.sep)); } catch { return false; }
  };
  partition.webRequest.onBeforeRequest((details, callback) => callback({ cancel: !permitted(details.url) }));
  partition.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
  let window, pending, readyResolve, readyReject, closed = false;
  function fail(message) {
    if (pending) { clearTimeout(pending.timer); pending.reject(new Error(message)); pending = null; }
    readyReject?.(new Error(message)); readyReject = null; readyResolve = null;
  }
  const receive = (event, reply) => {
    if (!window || event.sender !== window.webContents) return;
    if (reply.ready) { readyResolve?.(); readyResolve = null; readyReject = null; return; }
    if (pending?.id !== reply.id) return;
    const request = pending; pending = null; clearTimeout(request.timer);
    reply.error ? request.reject(new Error(reply.error)) : request.resolve(reply.result);
  };
  ipcMain.on(channel, receive);
  function close() {
    closed = true; fail('Headsizing worker stopped');
    ipcMain.removeListener(channel, receive);
    if (window && !window.isDestroyed()) window.destroy(); window = null;
    partition.webRequest.onBeforeRequest(null);
  }
  function request(payload, timeoutMs = 60000) {
    if (!window || window.isDestroyed() || closed) return Promise.reject(new Error('Headsizing worker is unavailable'));
    if (pending) return Promise.reject(new Error('Headsizing worker is busy'));
    return new Promise((resolve, reject) => {
      const id = crypto.randomUUID();
      const timer = setTimeout(() => { fail('Headsizing worker timed out'); close(); }, timeoutMs);
      pending = { id, timer, resolve, reject }; window.webContents.send('headsizing:request', { ...payload, id });
    });
  }
  async function start() {
    const assets = await verifyAssets(assetRoot);
    if (closed) throw new Error('Headsizing initialization cancelled');
    window = new BrowserWindow({ show: false, webPreferences: { session: partition,
      preload: path.join(__dirname, 'headsizing-worker-preload.js'), contextIsolation: true, nodeIntegration: false,
      sandbox: true, backgroundThrottling: false, additionalArguments: [`--headsizing-channel=${channel}`] } });
    window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
    window.webContents.on('will-navigate', event => event.preventDefault());
    window.webContents.on('render-process-gone', () => { fail('Headsizing worker crashed'); close(); });
    window.on('closed', () => fail('Headsizing worker closed'));
    const ready = new Promise((resolve, reject) => { readyResolve = resolve; readyReject = reject; });
    const timer = setTimeout(() => fail('Headsizing worker startup timed out'), 30000);
    try {
      await Promise.all([ready, window.loadFile(path.join(__dirname, 'headsizing-worker.html'))]);
      return await request({ type: 'init', libraryVersion: assets.libraryVersion, modelSha256: assets.modelSha256, moduleUrl: pathToFileURL(path.join(assetRoot, 'vision_bundle.mjs')).href,
        wasmUrl: pathToFileURL(path.join(assetRoot, 'wasm')).href, modelUrl: pathToFileURL(path.join(assetRoot, 'face_landmarker.task')).href }, 120000);
    } catch (error) { close(); throw error; }
    finally { clearTimeout(timer); }
  }
  return { start, process: input => request({ ...input, type: 'process' }), close,
    getPid: () => window && !window.isDestroyed() ? window.webContents.getOSProcessId() : null };
}
module.exports = { createHeadsizingWorker };
