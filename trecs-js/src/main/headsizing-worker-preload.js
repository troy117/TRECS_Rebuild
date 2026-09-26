const { contextBridge, ipcRenderer } = require('electron');
const channel = process.argv.find(arg => arg.startsWith('--headsizing-channel='))?.slice('--headsizing-channel='.length);
contextBridge.exposeInMainWorld('headsizingWorker', {
  listen: callback => ipcRenderer.on('headsizing:request', (_event, payload) => callback(payload)),
  reply: payload => ipcRenderer.send(channel, payload)
});
