const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Decode/resize in a dedicated Electron renderer, never the UI or main process.
// Requests are serialized to bound the number of full camera images in memory.
function createImageProcessor({ BrowserWindow, ipcMain, maxCacheBytes = 48 * 1024 * 1024 }) {
  let worker = null;
  let ready = null;
  let tail = Promise.resolve();
  let queued = 0;
  let cacheBytes = 0;
  const cache = new Map();
  const pending = new Map();
  const channel = `trecs:image-worker:${crypto.randomUUID()}`;
  ipcMain.on(channel, (event, reply) => {
    if (!worker || event.sender !== worker.webContents) return;
    const request = pending.get(reply.id);
    if (!request) return;
    pending.delete(reply.id);
    clearTimeout(request.timeout);
    if (reply.error) request.reject(new Error(reply.error));
    else request.resolve(reply.result);
  });

  function rejectPending(message) {
    for (const request of pending.values()) {
      clearTimeout(request.timeout);
      request.reject(new Error(message));
    }
    pending.clear();
    ready = null;
    worker = null;
  }

  async function getWorker() {
    if (!ready) {
      worker = new BrowserWindow({ show: false, webPreferences: {
        preload: path.join(__dirname, 'image-processing-preload.js'),
        contextIsolation: true, nodeIntegration: false, sandbox: false,
        backgroundThrottling: false, additionalArguments: [`--trecs-image-channel=${channel}`]
      } });
      worker.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
      worker.webContents.on('will-navigate', (event) => event.preventDefault());
      worker.webContents.on('render-process-gone', () => rejectPending('Image worker stopped; retry the image.'));
      worker.on('closed', () => rejectPending('Image worker closed; retry the image.'));
      ready = worker.loadFile(path.join(__dirname, 'image-processing.html'));
    }
    await ready;
    return worker;
  }

  function execute(input) {
    if (queued >= 64) return Promise.reject(new Error('Image preview queue is full; retry shortly.'));
    queued += 1;
    const result = tail.catch(() => {}).then(async () => {
      const active = await getWorker();
      const bytes = await fs.promises.readFile(input.filePath);
      return new Promise((resolve, reject) => {
        const id = crypto.randomUUID();
        const timeout = setTimeout(() => {
          pending.delete(id);
          reject(new Error('Image processing timed out.'));
          if (!active.isDestroyed()) active.destroy();
        }, 60000);
        pending.set(id, { resolve, reject, timeout });
        active.webContents.send('trecs:image-worker:run', { ...input, bytes, id });
      });
    }).finally(() => { queued -= 1; });
    tail = result;
    return result;
  }

  async function preview(filePath, size = 'display') {
    const stats = await fs.promises.stat(filePath);
    if (!stats.isFile() || !stats.size) throw new Error('Image is empty or unavailable.');
    const version = `${stats.size}:${stats.mtimeMs}:${stats.ctimeMs}`;
    const key = `${path.resolve(filePath).toLowerCase()}:${size}:${version}`;
    if (cache.has(key)) {
      const entry = cache.get(key);
      cache.delete(key);
      cache.set(key, entry);
      return entry.result;
    }
    const result = await execute({ filePath, size });
    result.version = version;
    // Originals are an explicit zoom request; do not retain full-size encodings.
    if (size !== 'original') {
      const bytes = (result.dataUrl || '').length * 2;
      while (cache.size && cacheBytes + bytes > maxCacheBytes) {
        const oldestKey = cache.keys().next().value;
        cacheBytes -= cache.get(oldestKey).bytes;
        cache.delete(oldestKey);
      }
      if (bytes <= maxCacheBytes) { cache.set(key, { result, bytes }); cacheBytes += bytes; }
    }
    return result;
  }

  return { preview, resize: (filePath, width, height, options = {}) => execute({ filePath, width, height, fit: options.fit, output: 'jpeg' }),
    close: () => { if (worker && !worker.isDestroyed()) worker.destroy(); cache.clear(); cacheBytes = 0; } };
}

module.exports = { createImageProcessor };
