const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('trecs', {
  prototypeDatabasePath: '',
  getDashboardData: () => ipcRenderer.invoke('dashboard:get'),
  getJobsData: () => ipcRenderer.invoke('jobs:list'),
  getJobDetail: (jobId) => ipcRenderer.invoke('job:detail', jobId),
  createClient: (input) => ipcRenderer.invoke('client:create', input),
  createJob: (input) => ipcRenderer.invoke('job:create', input),
  getAdminItems: (jobId, stage) => ipcRenderer.invoke('admin-items:get', jobId, stage),
  renderAdminItem: (jobId, input) => ipcRenderer.invoke('admin-items:render', jobId, input),
  renderSubjectIdCard: (jobId, subjectId, input) => ipcRenderer.invoke('id-card:render-subject', jobId, subjectId, input),
  getCapturePlan: async (jobId) => {
    const detail = await ipcRenderer.invoke('job:detail', jobId);
    return detail.capture;
  },
  createSubject: (jobId, input) => ipcRenderer.invoke('subject:create', jobId, input),
  createBlankSubjects: (jobId, count) => ipcRenderer.invoke('subject:create-blank-batch', jobId, count),
  updateSubject: (subjectId, input) => ipcRenderer.invoke('subject:update', subjectId, input),
  updateSubjectNotes: (subjectId, notes) => ipcRenderer.invoke('subject:update-notes', subjectId, notes),
  updateOrderNotes: (orderId, notes) => ipcRenderer.invoke('order:update-notes', orderId, notes),
  updateOrderRenderStatus: (orderId, status) => ipcRenderer.invoke('order:update-render-status', orderId, status),
  linkSubjectImage: (subjectId, imageId) => ipcRenderer.invoke('image:link-subject', subjectId, imageId),
  getImagePreview: (imageId) => ipcRenderer.invoke('image:preview', imageId),
  prepareLaptopPackage: (jobId) => ipcRenderer.invoke('laptop-package:prepare', jobId)
});
