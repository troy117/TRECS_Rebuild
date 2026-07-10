const databasePath = document.getElementById('databasePath');
const metricGrid = document.getElementById('metricGrid');
const jobsTableBody = document.getElementById('jobsTableBody');
const migrationList = document.getElementById('migrationList');
const title = document.querySelector('.topbar h1');
const viewButtons = document.querySelectorAll('[data-view-button]');
const viewTargets = document.querySelectorAll('[data-view-target]');
const dashboardView = document.getElementById('dashboardView');
const jobsView = document.getElementById('jobsView');
const jobActionsMenu = document.getElementById('jobActionsMenu');
const jobTypeFilters = document.getElementById('jobTypeFilters');
const jobSearchInput = document.getElementById('jobSearchInput');
const jobsScreenTableBody = document.getElementById('jobsScreenTableBody');
const jobsCountLabel = document.getElementById('jobsCountLabel');
const jobDetailPanel = document.getElementById('jobDetailPanel');
const jobWorkflowTabs = document.getElementById('jobWorkflowTabs');
const jobWorkflowContent = document.getElementById('jobWorkflowContent');
const jobStudentWorkspace = document.getElementById('jobStudentWorkspace');
const backToJobsButton = document.getElementById('backToJobsButton');
const workspaceJobTitle = document.getElementById('workspaceJobTitle');
const workspaceJobMeta = document.getElementById('workspaceJobMeta');
const workspaceStudentsButton = document.getElementById('workspaceStudentsButton');
const workspaceCaptureButton = document.getElementById('workspaceCaptureButton');
const workspaceEnvelopeButton = document.getElementById('workspaceEnvelopeButton');
const workspaceAdminItemsButton = document.getElementById('workspaceAdminItemsButton');
const workspaceAddBlankButton = document.getElementById('workspaceAddBlankButton');
const workspaceEditStudentButton = document.getElementById('workspaceEditStudentButton');
const workspacePreviousButton = document.getElementById('workspacePreviousButton');
const workspaceNextButton = document.getElementById('workspaceNextButton');
const workspaceStudentCount = document.getElementById('workspaceStudentCount');
const workspaceStudentSearch = document.getElementById('workspaceStudentSearch');
const workspaceStudentList = document.getElementById('workspaceStudentList');
const workspaceStudentDetail = document.getElementById('workspaceStudentDetail');
const workspaceOrderDetail = document.getElementById('workspaceOrderDetail');
const addRecordsModal = document.getElementById('addRecordsModal');
const addRecordsForm = document.getElementById('addRecordsForm');
const cancelAddRecordsButton = document.getElementById('cancelAddRecordsButton');
const addRecordsStatus = document.getElementById('addRecordsStatus');
const captureWorkspace = document.getElementById('captureWorkspace');
const captureEntryForm = document.getElementById('captureEntryForm');
const captureEntryStatus = document.getElementById('captureEntryStatus');
const captureStudentSearchResults = document.getElementById('captureStudentSearchResults');
const captureSubjectDetail = document.getElementById('captureSubjectDetail');
const captureCompareGrid = document.getElementById('captureCompareGrid');
const capturePreviewMeta = document.getElementById('capturePreviewMeta');
const capturePairStatus = document.getElementById('capturePairStatus');
const captureFileModeToggle = document.getElementById('captureFileModeToggle');
const envelopeWorkspace = document.getElementById('envelopeWorkspace');
const envelopeEntryForm = document.getElementById('envelopeEntryForm');
const envelopeEntryStatus = document.getElementById('envelopeEntryStatus');
const envelopeSubjectDetail = document.getElementById('envelopeSubjectDetail');
const envelopePreview = document.getElementById('envelopePreview');
const envelopePreviewMeta = document.getElementById('envelopePreviewMeta');
const envelopeStudentSearchResults = document.getElementById('envelopeStudentSearchResults');
const envelopeConfirmModal = document.getElementById('envelopeConfirmModal');
const envelopeConfirmMessage = document.getElementById('envelopeConfirmMessage');
const confirmEnvelopeButton = document.getElementById('confirmEnvelopeButton');
const cancelEnvelopeConfirmButton = document.getElementById('cancelEnvelopeConfirmButton');
const orderEnvelopeModal = document.getElementById('orderEnvelopeModal');
const orderEnvelopeTitle = document.getElementById('orderEnvelopeTitle');
const orderEnvelopePreview = document.getElementById('orderEnvelopePreview');
const closeOrderEnvelopeButton = document.getElementById('closeOrderEnvelopeButton');
const orderEnvelopeActions = document.getElementById('orderEnvelopeActions');
const assignEnvelopeScanButton = document.getElementById('assignEnvelopeScanButton');
const deleteEnvelopeScanButton = document.getElementById('deleteEnvelopeScanButton');
const editOrderModal = document.getElementById('editOrderModal');
const editOrderForm = document.getElementById('editOrderForm');
const editOrderTitle = document.getElementById('editOrderTitle');
const editOrderStatus = document.getElementById('editOrderStatus');
const editOrderEnvelopePreview = document.getElementById('editOrderEnvelopePreview');
const cancelEditOrderButton = document.getElementById('cancelEditOrderButton');
const deleteOrderButton = document.getElementById('deleteOrderButton');
const endOfDayModal = document.getElementById('endOfDayModal');
const endOfDayModalTitle = document.getElementById('endOfDayModalTitle');
const endOfDayReview = document.getElementById('endOfDayReview');
const endOfDayStatus = document.getElementById('endOfDayStatus');
const endOfDayActionNote = document.getElementById('endOfDayActionNote');
const cancelEndOfDayButton = document.getElementById('cancelEndOfDayButton');
const confirmEndOfDayButton = document.getElementById('confirmEndOfDayButton');
const schoolDataModal = document.getElementById('schoolDataModal');
const schoolDataFilePath = document.getElementById('schoolDataFilePath');
const schoolDataMapping = document.getElementById('schoolDataMapping');
const schoolDataPreview = document.getElementById('schoolDataPreview');
const schoolDataStatus = document.getElementById('schoolDataStatus');
const cancelSchoolDataButton = document.getElementById('cancelSchoolDataButton');
const browseSchoolDataButton = document.getElementById('browseSchoolDataButton');
const confirmSchoolDataButton = document.getElementById('confirmSchoolDataButton');
const refreshUnlinkedEnvelopesButton = document.getElementById('refreshUnlinkedEnvelopesButton');
const unlinkedEnvelopeList = document.getElementById('unlinkedEnvelopeList');
const adminItemsWorkspace = document.getElementById('adminItemsWorkspace');
const adminOptionsForm = document.getElementById('adminOptionsForm');
const adminItemsStatus = document.getElementById('adminItemsStatus');
const adminItemsList = document.getElementById('adminItemsList');
const adminItemsHistoryCount = document.getElementById('adminItemsHistoryCount');
const adminItemsHistory = document.getElementById('adminItemsHistory');
const newSchoolButton = document.getElementById('newSchoolButton');
const newSchoolPanel = document.getElementById('newSchoolPanel');
const newSchoolForm = document.getElementById('newSchoolForm');
const cancelNewSchoolButton = document.getElementById('cancelNewSchoolButton');
const newSchoolStatus = document.getElementById('newSchoolStatus');
const newJobButton = document.getElementById('newJobButton');
const newJobPanel = document.getElementById('newJobPanel');
const newJobForm = document.getElementById('newJobForm');
const cancelNewJobButton = document.getElementById('cancelNewJobButton');
const newJobStatus = document.getElementById('newJobStatus');
const importPreviousJobButton = document.getElementById('importPreviousJobButton');
const loadOnsiteSetupButton = document.getElementById('loadOnsiteSetupButton');
const loadEndOfDayButton = document.getElementById('loadEndOfDayButton');
const importPreviousJobPanel = document.getElementById('importPreviousJobPanel');
const importPreviousJobForm = document.getElementById('importPreviousJobForm');
const cancelImportPreviousJobButton = document.getElementById('cancelImportPreviousJobButton');
const browsePreviousJobFolderButton = document.getElementById('browsePreviousJobFolderButton');
const importPreviousJobStatus = document.getElementById('importPreviousJobStatus');

let jobsState = {
  jobs: [],
  types: [],
  clients: [],
  packagePlans: [],
  selectedType: 'all',
  sortKey: 'location',
  sortDirection: 'asc',
  selectedJobId: null,
  search: '',
  selectedTab: 'subjects',
  detail: null,
  selectedImageId: null,
  selectedImageSubjectId: null,
  selectedSubjectId: null,
  selectedOrderId: null,
  jobWorkspaceOpen: false,
  workspaceMode: 'students',
  workspaceStudentSearch: '',
  captureSubject: null,
  captureImages: [],
  captureSearchResults: [],
  captureSearchActiveIndex: -1,
  captureSearchTimer: null,
  captureFileMode: 'jpg_raw',
  envelopeSubject: null,
  envelopeScan: null,
  envelopePending: null,
  envelopeWatcherSubjectId: null,
  envelopeSearchResults: [],
  envelopeSearchActiveIndex: -1,
  envelopeSearchTimer: null,
  unlinkedEnvelopeScans: [],
  viewingEnvelopeScanId: null,
  editingOrderId: null,
  showStudentEditForm: false,
  showAddRecordsModal: false,
  adminItems: null,
  adminStage: 'original_picture_day',
  adminSortBy: 'grade',
  expandedAdminItem: null,
  sisStudentCd: true,
  sisDestiny: false,
  sisPowerSchool: false,
  sisSasi: false,
  idCardSource: 'all',
  idCardListName: '',
  idCardLayout: 'standard',
  idCardReason: 'admin_batch',
  idCardPhotographedOnly: true,
  directoryType: 'mugbook',
  directorySource: 'all',
  directoryListName: '',
  directorySortMethod: 'alpha_grade',
  directorySchoolYear: 'School Year: 2025 - 2026',
  directoryContactLine: 'Island Photography: 559-456-1400',
  directoryPhotographedOnly: false,
  stickerSource: 'all',
  stickerListName: '',
  stickerCopies: 3,
  stickerSortMethod: 'alpha',
  stickerPhotographedOnly: false,
  orderRenderFilter: 'all',
  subjectSearch: '',
  imageSearch: '',
  imageLinkSubjectSearch: '',
  lastLaptopPackage: null,
  lastEndOfDayPackage: null,
  endOfDayReview: null,
  endOfDayCollapsed: {
    capturedImages: true,
    newSubjects: false,
    editedSubjects: false
  },
  schoolDataImport: null,
  showNewSchoolForm: false,
  selectedNewClientId: null,
  showNewJobForm: false,
  showImportPreviousJobForm: false
};

if (window.trecs && databasePath) {
  databasePath.textContent = window.trecs.prototypeDatabasePath;
}

function trecsApi(methodName) {
  if (!window.trecs) {
    throw new Error('TRECS app bridge is not loaded. Close all TRECS windows and start the app with npm start.');
  }
  if (methodName && typeof window.trecs[methodName] !== 'function') {
    throw new Error('TRECS app bridge is out of date. Close all TRECS windows and restart the app.');
  }
  return window.trecs;
}

function formatNumber(value) {
  return Number(value).toLocaleString();
}

function formatType(type) {
  return String(type || '')
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function renderMetrics(counts) {
  metricGrid.innerHTML = counts
    .map((count) => `
      <article>
        <span>${count.label}</span>
        <strong>${formatNumber(count.value)}</strong>
      </article>
    `)
    .join('');
}

function renderJobs(jobs) {
  jobsTableBody.innerHTML = jobs
    .map((job) => `
      <tr>
        <td>${job.location}</td>
        <td>${job.job}</td>
        <td>${formatType(job.type)}</td>
        <td>${job.packagePlan}</td>
        <td><span class="status ready">${job.status}</span></td>
      </tr>
    `)
    .join('');
}

function renderMigration(items) {
  migrationList.innerHTML = items
    .map((item) => `
      <div>
        <dt>${item.label}</dt>
        <dd>${item.value || 'None'}</dd>
      </div>
    `)
    .join('');
}

function setView(view) {
  dashboardView.classList.toggle('active-view', view === 'dashboard');
  jobsView.classList.toggle('active-view', view === 'jobs');
  title.textContent = view === 'jobs' ? 'Jobs' : 'Dashboard';

  viewButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.viewButton === view);
  });

  if (view === 'jobs' && jobsState.jobs.length === 0) {
    loadJobs().catch(showJobsLoadError);
  }
}

function setJobsWorkspaceMode(open) {
  jobsState.jobWorkspaceOpen = open;
  document.querySelector('.app-shell').classList.toggle('workspace-mode', open);
  document.querySelector('.jobs-toolbar').hidden = open;
  newSchoolPanel.hidden = open || !jobsState.showNewSchoolForm;
  newJobPanel.hidden = open || !jobsState.showNewJobForm;
  document.querySelector('.jobs-layout').hidden = open;
  document.getElementById('jobWorkflowPanel').hidden = true;
  jobStudentWorkspace.hidden = !open;
}

function showJobsLoadError(error) {
  jobsScreenTableBody.innerHTML = '';
  jobsCountLabel.textContent = 'Load failed';
  jobDetailPanel.innerHTML = `
    <div class="panel-heading">
      <h2>Job Detail</h2>
    </div>
    <div class="empty-state">${escapeHtml(error.message || 'Could not load jobs.')}</div>
  `;
  jobWorkflowContent.innerHTML = '<div class="empty-state">Jobs could not be loaded.</div>';
  console.error(error);
}

function filteredJobs() {
  const search = jobsState.search.toLowerCase();
  const rows = jobsState.jobs.filter((job) => {
    const matchesType = jobsState.selectedType === 'all' || job.type === jobsState.selectedType;
    const matchesSearch = !search ||
      String(job.location || '').toLowerCase().includes(search) ||
      String(job.job || '').toLowerCase().includes(search) ||
      String(job.packagePlan || '').toLowerCase().includes(search);
    return matchesType && matchesSearch;
  });

  return rows.sort((first, second) => compareJobs(first, second));
}

function compareJobs(first, second) {
  const direction = jobsState.sortDirection === 'desc' ? -1 : 1;
  const firstValue = String(first[jobsState.sortKey] || '').toLowerCase();
  const secondValue = String(second[jobsState.sortKey] || '').toLowerCase();
  const valueCompare = firstValue.localeCompare(secondValue, undefined, {
    numeric: true,
    sensitivity: 'base'
  });

  if (valueCompare !== 0) {
    return valueCompare * direction;
  }

  return String(first.job || '').localeCompare(String(second.job || ''), undefined, {
    numeric: true,
    sensitivity: 'base'
  });
}

function sortIndicator(key) {
  if (jobsState.sortKey !== key) {
    return '';
  }

  return jobsState.sortDirection === 'asc' ? ' (A-Z)' : ' (Z-A)';
}

function sortLabel(key) {
  const labels = {
    location: 'Location',
    job: 'Job',
    type: 'Type'
  };
  return labels[key] || key;
}

function renderJobTypeFilters() {
  const filters = [
    { type: 'all', label: 'All', count: jobsState.jobs.length },
    ...jobsState.types.map((type) => ({
      type: type.type,
      label: formatType(type.type),
      count: type.count
    }))
  ];

  jobTypeFilters.innerHTML = filters
    .map((filter) => `
      <button class="${jobsState.selectedType === filter.type ? 'active' : ''}" data-job-type="${filter.type}">
        ${filter.label} <span>${filter.count}</span>
      </button>
    `)
    .join('');

  jobTypeFilters.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
      jobsState.selectedType = button.dataset.jobType;
      jobsState.selectedJobId = null;
      renderJobsScreen();
    });
  });
}

function renderJobsScreen() {
  const rows = filteredJobs();
  jobsCountLabel.textContent = `${rows.length} shown`;

  jobsScreenTableBody.innerHTML = rows
    .map((job) => `
      <tr class="${job.id === jobsState.selectedJobId ? 'selected-row' : ''}" data-job-id="${job.id}">
        <td>${job.location}</td>
        <td>${job.job}</td>
        <td>${formatType(job.type)}</td>
        <td>${formatNumber(job.subjects)}</td>
        <td>${formatNumber(job.orders)}</td>
        <td>${formatNumber(job.images)}</td>
      </tr>
    `)
    .join('');

  jobsScreenTableBody.querySelectorAll('tr').forEach((row) => {
    row.addEventListener('click', () => {
      selectJobSummary(Number(row.dataset.jobId));
    });

    row.addEventListener('dblclick', () => {
      openJob(Number(row.dataset.jobId));
    });
  });

  const selected = jobsState.jobs.find((job) => job.id === jobsState.selectedJobId) || null;
  renderJobDetail(selected || null);
  renderJobTypeFilters();
  bindJobSortHeaders();
}

function selectJobSummary(jobId) {
  jobsState.selectedJobId = jobId;
  jobsState.detail = null;
  jobsState.lastLaptopPackage = null;

  jobsScreenTableBody.querySelectorAll('[data-job-id]').forEach((row) => {
    row.classList.toggle('selected-row', Number(row.dataset.jobId) === jobId);
  });

  const selected = jobsState.jobs.find((job) => job.id === jobId) || null;
  renderJobDetail(selected);
  jobWorkflowContent.innerHTML = '<div class="empty-state">Double-click a job to open workflow data.</div>';
}

async function openJob(jobId) {
  selectJobSummary(jobId);
  await loadJobDetail(jobId);
  setJobsWorkspaceMode(true);
  setWorkspaceMode('students');
}

function closeJobWorkspace() {
  stopCaptureWatcher().catch((error) => console.error(error));
  stopEnvelopeWatcher().catch((error) => console.error(error));
  setJobsWorkspaceMode(false);
  title.textContent = 'Jobs';
}

function setWorkspaceMode(mode) {
  jobsState.workspaceMode = mode;
  const studentsOpen = mode === 'students';
  const captureOpen = mode === 'capture';
  const envelopeOpen = mode === 'envelope';
  const adminOpen = mode === 'admin';
  document.querySelector('.student-workspace-grid').hidden = !studentsOpen;
  captureWorkspace.hidden = !captureOpen;
  envelopeWorkspace.hidden = !envelopeOpen;
  adminItemsWorkspace.hidden = !adminOpen;
  workspaceStudentsButton.classList.toggle('active', studentsOpen);
  workspaceCaptureButton.classList.toggle('active', captureOpen);
  workspaceEnvelopeButton.classList.toggle('active', envelopeOpen);
  workspaceAdminItemsButton.classList.toggle('active', adminOpen);
  workspaceAddBlankButton.hidden = !studentsOpen;
  workspaceEditStudentButton.hidden = !studentsOpen;
  workspacePreviousButton.hidden = !studentsOpen;
  workspaceNextButton.hidden = !studentsOpen;

  if (!envelopeOpen) {
    stopEnvelopeWatcher().catch((error) => console.error(error));
  }
  if (!captureOpen) {
    stopCaptureWatcher().catch((error) => console.error(error));
  }

  if (studentsOpen) {
    renderStudentWorkspace();
  } else if (captureOpen) {
    renderCaptureWorkspace();
  } else if (envelopeOpen) {
    renderEnvelopeWorkspace();
  } else {
    renderAdminItemsWorkspace();
  }
}

function setAddRecordsModalVisible(visible) {
  jobsState.showAddRecordsModal = visible;
  addRecordsModal.hidden = !visible;
  addRecordsStatus.textContent = '';
  if (visible) {
    addRecordsForm.reset();
    addRecordsForm.elements.recordCount.focus();
    addRecordsForm.elements.recordCount.select();
  }
}

function setEndOfDayModalVisible(visible) {
  endOfDayModal.hidden = !visible;
  if (!visible) {
    jobsState.endOfDayReview = null;
    endOfDayStatus.textContent = '';
    endOfDayReview.innerHTML = '<div class="empty-state">Loading changes...</div>';
    confirmEndOfDayButton.disabled = false;
    endOfDayModalTitle.textContent = 'End of Day Review';
    endOfDayActionNote.textContent = 'Confirm these changes before creating the package.';
    confirmEndOfDayButton.textContent = 'Create End of Day';
  }
}

function shortChangeValue(value) {
  const text = String(value || '').trim();
  if (!text) {
    return '(blank)';
  }
  return text.length > 80 ? `${text.slice(0, 77)}...` : text;
}

function createEndOfDayAdjustments(review) {
  const changes = review.subjectChanges || {};
  return {
    newSubjects: (changes.newSubjects || []).map((subject) => ({
      id: subject.id,
      include: true,
      name: subject.name || '',
      grade: subject.grade || '',
      homeroom: subject.homeroom || ''
    })),
    editedSubjects: (changes.editedSubjects || []).map((subject) => ({
      id: subject.id,
      include: true,
      changes: (subject.changes || []).map((change) => ({
        field: change.field,
        include: true,
        after: change.after || ''
      }))
    }))
  };
}

function currentEndOfDayAdjustments() {
  const state = jobsState.endOfDayReview || {};
  if (!state.adjustments && state.review) {
    state.adjustments = createEndOfDayAdjustments(state.review);
  }
  return state.adjustments || { newSubjects: [], editedSubjects: [] };
}

function endOfDayNewSubjectAdjustment(subjectId) {
  const adjustments = currentEndOfDayAdjustments();
  return adjustments.newSubjects.find((subject) => Number(subject.id) === Number(subjectId)) || null;
}

function endOfDayEditedSubjectAdjustment(subjectId) {
  const adjustments = currentEndOfDayAdjustments();
  return adjustments.editedSubjects.find((subject) => Number(subject.id) === Number(subjectId)) || null;
}

function renderEndOfDaySection(sectionId, title, count, contentHtml) {
  const collapsed = jobsState.endOfDayCollapsed[sectionId] === true;
  return `
    <section class="end-of-day-section ${collapsed ? 'collapsed' : ''}" data-end-of-day-section="${sectionId}">
      <button class="end-of-day-section-heading" type="button" data-end-of-day-toggle="${sectionId}">
        <span>${escapeHtml(title)}</span>
        <strong>${formatNumber(count || 0)}</strong>
      </button>
      <div class="end-of-day-section-body" ${collapsed ? 'hidden' : ''}>
        ${contentHtml}
      </div>
    </section>
  `;
}

function includedEndOfDayNewSubjectCount(newSubjects) {
  return newSubjects.filter((subject) => {
    const adjustment = endOfDayNewSubjectAdjustment(subject.id);
    return !adjustment || adjustment.include !== false;
  }).length;
}

function includedEndOfDayEditedSubjectCount(editedSubjects) {
  return editedSubjects.filter((subject) => {
    const adjustment = endOfDayEditedSubjectAdjustment(subject.id);
    if (adjustment && adjustment.include === false) {
      return false;
    }
    const includedChanges = (subject.changes || []).filter((change) => {
      const changeAdjustment = adjustment
        ? adjustment.changes.find((item) => item.field === change.field)
        : null;
      return !changeAdjustment || changeAdjustment.include !== false;
    });
    return includedChanges.length > 0;
  }).length;
}

function renderEndOfDayCapturedImages(capturedImages) {
  if (!capturedImages.length) {
    return '<div class="empty-state">No captured images found.</div>';
  }
  return `
    <ul class="end-of-day-list">
      ${capturedImages.map((image) => `
        <li>
          <strong>${escapeHtml(image.ref || '')}</strong>
          <span>${escapeHtml(image.studentName || image.filename || '')}</span>
          <em>${escapeHtml(image.filename || '')}${image.rawPath ? ' / CR3' : ''}</em>
        </li>
      `).join('')}
    </ul>
  `;
}

function renderEndOfDayNewSubjects(newSubjects) {
  if (!newSubjects.length) {
    return '<div class="empty-state">No new camera cards found.</div>';
  }
  return `
    <ul class="end-of-day-list editable">
      ${newSubjects.map((subject) => {
        const adjustment = endOfDayNewSubjectAdjustment(subject.id) || {};
        return `
          <li>
            <label class="end-of-day-include">
              <input type="checkbox" data-eod-new-include="${subject.id}" ${adjustment.include === false ? '' : 'checked'}>
              <strong>${escapeHtml(subject.ref || '')}</strong>
            </label>
            <div class="end-of-day-edit-grid">
              <label>
                <span>Name</span>
                <input data-eod-new-field="${subject.id}" data-field="name" value="${escapeHtml(adjustment.name ?? subject.name ?? '')}">
              </label>
              <label>
                <span>Grade</span>
                <input data-eod-new-field="${subject.id}" data-field="grade" value="${escapeHtml(adjustment.grade ?? subject.grade ?? '')}">
              </label>
              <label>
                <span>Homeroom</span>
                <input data-eod-new-field="${subject.id}" data-field="homeroom" value="${escapeHtml(adjustment.homeroom ?? subject.homeroom ?? '')}">
              </label>
            </div>
          </li>
        `;
      }).join('')}
    </ul>
  `;
}

function renderEndOfDayEditedSubjects(editedSubjects) {
  if (!editedSubjects.length) {
    return '<div class="empty-state">No student edits found.</div>';
  }
  return `
    <ul class="end-of-day-change-list">
      ${editedSubjects.map((subject) => {
        const adjustment = endOfDayEditedSubjectAdjustment(subject.id) || {};
        return `
          <li>
            <label class="end-of-day-include">
              <input type="checkbox" data-eod-edit-subject-include="${subject.id}" ${adjustment.include === false ? '' : 'checked'}>
              <strong>${escapeHtml(subject.ref || '')} ${escapeHtml(subject.name || '')}</strong>
            </label>
            ${(subject.changes || []).map((change) => {
              const changeAdjustment = adjustment.changes
                ? adjustment.changes.find((item) => item.field === change.field)
                : null;
              return `
                <div class="end-of-day-change-row">
                  <label>
                    <input type="checkbox" data-eod-edit-change-include="${subject.id}" data-field="${escapeHtml(change.field)}" ${changeAdjustment && changeAdjustment.include === false ? '' : 'checked'}>
                    <span>${escapeHtml(change.label)}</span>
                  </label>
                  <em>${escapeHtml(shortChangeValue(change.before))}</em>
                  <input data-eod-edit-change-after="${subject.id}" data-field="${escapeHtml(change.field)}" value="${escapeHtml(changeAdjustment ? changeAdjustment.after : change.after || '')}">
                </div>
              `;
            }).join('')}
          </li>
        `;
      }).join('')}
    </ul>
  `;
}

function renderEndOfDayReview(review) {
  const counts = review.counts || {};
  const changes = review.subjectChanges || {};
  const capturedImages = review.capturedImages || [];
  const newSubjects = changes.newSubjects || [];
  const editedSubjects = changes.editedSubjects || [];
  const deletedSubjects = changes.deletedSubjects || [];
  const includedNewSubjectCount = includedEndOfDayNewSubjectCount(newSubjects);
  const includedEditedSubjectCount = includedEndOfDayEditedSubjectCount(editedSubjects);

  endOfDayReview.innerHTML = `
    <div class="end-of-day-summary">
      <article><span>Captured Images</span><strong>${formatNumber(counts.capturedImages || 0)}</strong></article>
      <article><span>CR3 Files</span><strong>${formatNumber(counts.capturedRawFiles || 0)}</strong></article>
      <article><span>New Cards Exported</span><strong>${formatNumber(includedNewSubjectCount)}</strong></article>
      <article><span>Student Edits Exported</span><strong>${formatNumber(includedEditedSubjectCount)}</strong></article>
    </div>
    ${review.hasBaseline ? '' : '<div class="end-of-day-warning">No onsite-start baseline was found, so student edit comparisons are not available for this job.</div>'}
    ${renderEndOfDaySection('capturedImages', 'Captured Images', capturedImages.length, renderEndOfDayCapturedImages(capturedImages))}
    ${renderEndOfDaySection('newSubjects', 'New Camera Cards', newSubjects.length, renderEndOfDayNewSubjects(newSubjects))}
    ${renderEndOfDaySection('editedSubjects', 'Student Database Edits', editedSubjects.length, renderEndOfDayEditedSubjects(editedSubjects))}
    ${deletedSubjects.length ? `
      <section>
        <h3>Deleted Records</h3>
        <ul class="end-of-day-list">
          ${deletedSubjects.map((subject) => `
            <li>
              <strong>${escapeHtml(subject.ref || '')}</strong>
              <span>${escapeHtml(subject.name || '')}</span>
            </li>
          `).join('')}
        </ul>
      </section>
    ` : ''}
  `;
  bindEndOfDayReviewControls(review);
}

function updateEndOfDaySummaryOnly(review) {
  renderEndOfDayReview(review);
}

function bindEndOfDayReviewControls(review) {
  endOfDayReview.querySelectorAll('[data-end-of-day-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const sectionId = button.dataset.endOfDayToggle;
      jobsState.endOfDayCollapsed[sectionId] = !jobsState.endOfDayCollapsed[sectionId];
      renderEndOfDayReview(review);
    });
  });

  endOfDayReview.querySelectorAll('[data-eod-new-include]').forEach((input) => {
    input.addEventListener('change', () => {
      const adjustment = endOfDayNewSubjectAdjustment(input.dataset.eodNewInclude);
      if (adjustment) {
        adjustment.include = input.checked;
        updateEndOfDaySummaryOnly(review);
      }
    });
  });

  endOfDayReview.querySelectorAll('[data-eod-new-field]').forEach((input) => {
    input.addEventListener('input', () => {
      const adjustment = endOfDayNewSubjectAdjustment(input.dataset.eodNewField);
      if (adjustment) {
        adjustment[input.dataset.field] = input.value;
      }
    });
  });

  endOfDayReview.querySelectorAll('[data-eod-edit-subject-include]').forEach((input) => {
    input.addEventListener('change', () => {
      const adjustment = endOfDayEditedSubjectAdjustment(input.dataset.eodEditSubjectInclude);
      if (adjustment) {
        adjustment.include = input.checked;
        updateEndOfDaySummaryOnly(review);
      }
    });
  });

  endOfDayReview.querySelectorAll('[data-eod-edit-change-include]').forEach((input) => {
    input.addEventListener('change', () => {
      const adjustment = endOfDayEditedSubjectAdjustment(input.dataset.eodEditChangeInclude);
      const change = adjustment
        ? adjustment.changes.find((item) => item.field === input.dataset.field)
        : null;
      if (change) {
        change.include = input.checked;
        updateEndOfDaySummaryOnly(review);
      }
    });
  });

  endOfDayReview.querySelectorAll('[data-eod-edit-change-after]').forEach((input) => {
    input.addEventListener('input', () => {
      const adjustment = endOfDayEditedSubjectAdjustment(input.dataset.eodEditChangeAfter);
      const change = adjustment
        ? adjustment.changes.find((item) => item.field === input.dataset.field)
        : null;
      if (change) {
        change.after = input.value;
      }
    });
  });
}

function closeJobActionsMenu() {
  if (jobActionsMenu) {
    jobActionsMenu.open = false;
  }
}

function showJobsForAction() {
  closeJobActionsMenu();
  setView('jobs');
}

async function openEndOfDayReview(jobId) {
  jobsState.endOfDayReview = { mode: 'create', jobId, loading: true };
  jobsState.endOfDayCollapsed = {
    capturedImages: true,
    newSubjects: false,
    editedSubjects: false
  };
  endOfDayModalTitle.textContent = 'End of Day Review';
  endOfDayActionNote.textContent = 'Confirm these changes before creating the package.';
  confirmEndOfDayButton.textContent = 'Create End of Day';
  endOfDayStatus.textContent = '';
  endOfDayReview.innerHTML = '<div class="empty-state">Loading changes...</div>';
  setEndOfDayModalVisible(true);
  try {
    const review = await trecsApi('getEndOfDayPreview').getEndOfDayPreview(jobId);
    jobsState.endOfDayReview = {
      mode: 'create',
      jobId,
      review,
      adjustments: createEndOfDayAdjustments(review)
    };
    renderEndOfDayReview(review);
  } catch (error) {
    jobsState.endOfDayReview = { jobId, error };
    endOfDayReview.innerHTML = '<div class="empty-state">Could not load end of day changes.</div>';
    endOfDayStatus.textContent = error.message || 'End of day review failed';
    confirmEndOfDayButton.disabled = true;
    throw error;
  }
}

function reviewFromEndOfDayManifest(manifest) {
  return {
    job: manifest.job || {},
    hasBaseline: true,
    counts: manifest.counts || {},
    capturedImages: (manifest.copiedImages || []).map((image) => ({
      ...image,
      id: image.imageAssetId,
      currentPath: image.jpgPath,
      rawPath: image.rawPath || null
    })),
    subjectChanges: manifest.subjectChanges || {
      newSubjects: [],
      editedSubjects: [],
      deletedSubjects: []
    }
  };
}

function openEndOfDayPackageReview(choice) {
  const review = reviewFromEndOfDayManifest(choice.manifest || {});
  jobsState.endOfDayReview = {
    mode: 'approve',
    packageFolder: choice.folderPath,
    review,
    adjustments: createEndOfDayAdjustments(review)
  };
  jobsState.endOfDayCollapsed = {
    capturedImages: true,
    newSubjects: false,
    editedSubjects: false
  };
  endOfDayModalTitle.textContent = 'Approve End of Day';
  endOfDayActionNote.textContent = 'Review these changes before updating the main database.';
  confirmEndOfDayButton.textContent = 'Approve End of Day';
  endOfDayStatus.textContent = '';
  setEndOfDayModalVisible(true);
  renderEndOfDayReview(review);
}

async function confirmEndOfDayPackage() {
  const reviewState = jobsState.endOfDayReview;
  if (!reviewState) {
    return;
  }

  confirmEndOfDayButton.disabled = true;
  confirmEndOfDayButton.textContent = reviewState.mode === 'approve' ? 'Approving...' : 'Creating...';
  endOfDayStatus.textContent = '';
  jobsState.lastEndOfDayPackage = { jobId: reviewState.jobId || null, status: 'working' };

  try {
    let result;
    if (reviewState.mode === 'approve') {
      result = await trecsApi('approveEndOfDayPackage').approveEndOfDayPackage({
        packageFolder: reviewState.packageFolder,
        adjustments: reviewState.adjustments || currentEndOfDayAdjustments()
      });
    } else {
      result = await trecsApi('createEndOfDayPackage').createEndOfDayPackage(
        reviewState.jobId,
        reviewState.adjustments || currentEndOfDayAdjustments()
      );
    }
    jobsState.lastEndOfDayPackage = {
      jobId: result.id || reviewState.jobId,
      status: 'done',
      packagePath: result.packagePath,
      capturedImages: result.counts.capturedImages || result.counts.images || 0
    };
    setEndOfDayModalVisible(false);
    if (reviewState.mode === 'approve') {
      jobsState.selectedJobId = result.id;
      jobsState.selectedType = 'all';
      jobsState.search = '';
      jobsState.detail = null;
      jobSearchInput.value = '';
      await loadDashboard();
      await loadJobs();
      await loadJobDetail(result.id);
      window.alert([
        'End of Day package approved.',
        '',
        `Files copied: ${formatNumber((result.counts && result.counts.copiedFiles) || 0)}`,
        `Images imported: ${formatNumber((result.counts && result.counts.images) || 0)}`,
        `New camera cards: ${formatNumber((result.counts && result.counts.newSubjects) || 0)}`,
        `Student edits: ${formatNumber((result.counts && result.counts.editedSubjects) || 0)}`
      ].join('\n'));
    } else {
      await reloadCurrentJobDetail();
    }
  } catch (error) {
    jobsState.lastEndOfDayPackage = {
      jobId: reviewState.jobId,
      status: 'error',
      message: error.message || 'End of day failed'
    };
    endOfDayStatus.textContent = error.message || 'End of day failed';
    confirmEndOfDayButton.disabled = false;
    confirmEndOfDayButton.textContent = reviewState.mode === 'approve' ? 'Approve End of Day' : 'Create End of Day';
    if (reviewState.mode !== 'approve') {
      await reloadCurrentJobDetail();
    }
    console.error(error);
  }
}

function setSchoolDataModalVisible(visible) {
  schoolDataModal.hidden = !visible;
  if (!visible) {
    jobsState.schoolDataImport = null;
    schoolDataFilePath.value = '';
    schoolDataStatus.textContent = '';
    schoolDataMapping.innerHTML = '<div class="empty-state">Choose a file to preview and map columns.</div>';
    schoolDataPreview.innerHTML = '';
    confirmSchoolDataButton.disabled = true;
    confirmSchoolDataButton.textContent = 'Import School Data';
  }
}

function openSchoolDataImport(jobId) {
  jobsState.schoolDataImport = {
    jobId,
    preview: null,
    mapping: {}
  };
  schoolDataFilePath.value = '';
  schoolDataStatus.textContent = '';
  schoolDataMapping.innerHTML = '<div class="empty-state">Choose a file to preview and map columns.</div>';
  schoolDataPreview.innerHTML = '';
  confirmSchoolDataButton.disabled = true;
  setSchoolDataModalVisible(true);
}

function schoolDataColumnOptions(preview, selectedIndex) {
  const options = ['<option value="">Do not import</option>'];
  (preview.columns || []).forEach((column) => {
    options.push(`
      <option value="${column.index}" ${Number(selectedIndex) === column.index ? 'selected' : ''}>
        ${escapeHtml(column.name)}
      </option>
    `);
  });
  return options.join('');
}

function renderSchoolDataMapping() {
  const state = jobsState.schoolDataImport;
  const preview = state && state.preview;
  if (!preview) {
    return;
  }

  const mapping = state.mapping || {};
  schoolDataFilePath.value = preview.filePath;
  schoolDataMapping.innerHTML = `
    <div class="school-data-fields">
      ${(preview.fields || []).map((field) => `
        <label>
          <span>${escapeHtml(field.label)}${field.required ? ' *' : ''}</span>
          <select data-school-field="${escapeHtml(field.key)}">
            ${schoolDataColumnOptions(preview, mapping[field.key])}
          </select>
        </label>
      `).join('')}
    </div>
  `;

  schoolDataMapping.querySelectorAll('[data-school-field]').forEach((select) => {
    select.addEventListener('change', () => {
      const key = select.dataset.schoolField;
      if (select.value === '') {
        delete jobsState.schoolDataImport.mapping[key];
      } else {
        jobsState.schoolDataImport.mapping[key] = Number(select.value);
      }
      confirmSchoolDataButton.disabled = false;
      renderSchoolDataPreview();
    });
  });

  confirmSchoolDataButton.disabled = false;
  renderSchoolDataPreview();
}

function renderSchoolDataPreview() {
  const state = jobsState.schoolDataImport;
  const preview = state && state.preview;
  if (!preview) {
    schoolDataPreview.innerHTML = '';
    return;
  }

  const columns = preview.columns || [];
  const rows = preview.rows || [];
  schoolDataPreview.innerHTML = `
    <div class="school-data-meta">
      <span>${escapeHtml(preview.fileName || '')}</span>
      <span>${preview.hasHeader ? 'Header row detected' : 'No header row detected'}</span>
    </div>
    <table>
      <thead>
        <tr>
          ${columns.map((column) => `<th>${escapeHtml(column.name)}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${rows.slice(0, 10).map((row) => `
          <tr>
            ${columns.map((column) => `<td>${escapeHtml(row[column.index] || '')}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

async function browseSchoolDataFile() {
  const state = jobsState.schoolDataImport;
  if (!state || !state.jobId) {
    return;
  }

  browseSchoolDataButton.disabled = true;
  browseSchoolDataButton.textContent = 'Browsing...';
  schoolDataStatus.textContent = '';

  try {
    const preview = await trecsApi('chooseSchoolDataFile').chooseSchoolDataFile(state.jobId);
    if (!preview || preview.canceled) {
      return;
    }
    jobsState.schoolDataImport.preview = preview;
    jobsState.schoolDataImport.mapping = { ...(preview.mapping || {}) };
    renderSchoolDataMapping();
  } catch (error) {
    schoolDataStatus.textContent = error.message || 'Could not read school data file';
    console.error(error);
  } finally {
    browseSchoolDataButton.disabled = false;
    browseSchoolDataButton.textContent = 'Browse';
  }
}

async function confirmSchoolDataImport() {
  const state = jobsState.schoolDataImport;
  if (!state || !state.preview || !state.jobId) {
    return;
  }

  confirmSchoolDataButton.disabled = true;
  confirmSchoolDataButton.textContent = 'Importing...';
  schoolDataStatus.textContent = '';

  try {
    const result = await trecsApi('importSchoolData').importSchoolData(state.jobId, {
      filePath: state.preview.filePath,
      hasHeader: state.preview.hasHeader,
      mapping: state.mapping
    });
    schoolDataStatus.textContent = `Imported ${formatNumber(result.created)} new and updated ${formatNumber(result.updated)} records.`;
    await loadDashboard();
    await loadJobs();
    await loadJobDetail(state.jobId);
    setSchoolDataModalVisible(false);
  } catch (error) {
    schoolDataStatus.textContent = error.message || 'School data import failed';
    confirmSchoolDataButton.disabled = false;
    confirmSchoolDataButton.textContent = 'Import School Data';
    console.error(error);
  }
}

function moveWorkspaceSubject(offset) {
  const subjects = workspaceSubjects();
  if (!subjects.length) {
    return;
  }

  const currentIndex = subjects.findIndex((subject) => subject.id === jobsState.selectedSubjectId);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const nextIndex = (safeIndex + offset + subjects.length) % subjects.length;

  jobsState.selectedSubjectId = subjects[nextIndex].id;
  renderStudentWorkspace();
}

function workspaceSubjects() {
  if (!jobsState.detail) {
    return [];
  }

  const search = String(jobsState.workspaceStudentSearch || '').trim().toLowerCase();
  const subjects = jobsState.detail.subjects || [];
  if (!search) {
    return subjects;
  }

  return subjects.filter((subject) => textIncludes(
    subject,
    ['ref', 'name', 'externalId', 'grade', 'homeroom', 'track', 'photographedStatus'],
    search
  ));
}

function currentWorkspaceSubject() {
  const subjects = workspaceSubjects();
  if (!subjects.length) {
    return null;
  }

  if (!jobsState.selectedSubjectId || !subjects.some((subject) => subject.id === jobsState.selectedSubjectId)) {
    jobsState.selectedSubjectId = subjects[0].id;
  }

  return subjects.find((subject) => subject.id === jobsState.selectedSubjectId) || subjects[0];
}

function renderStudentWorkspace() {
  if (!jobsState.detail || !jobsState.detail.summary) {
    return;
  }

  const job = jobsState.detail.summary;
  const subjects = workspaceSubjects();
  const currentSubject = currentWorkspaceSubject();
  title.textContent = job.job;
  workspaceJobTitle.textContent = `${job.location} / ${job.job}`;
  workspaceJobMeta.textContent = `${formatType(job.type)} / ${job.packagePlan || 'No package plan'} / ${formatNumber(job.subjects)} subjects`;
  workspaceStudentCount.textContent = `${formatNumber(subjects.length)} shown`;
  workspaceStudentSearch.value = jobsState.workspaceStudentSearch;
  workspaceEditStudentButton.disabled = !currentSubject;
  workspaceEditStudentButton.textContent = jobsState.showStudentEditForm ? 'Close Edit' : 'Edit Student';

  workspaceStudentList.innerHTML = subjects.length
    ? subjects.map((subject) => `
      <button class="${subject.id === jobsState.selectedSubjectId ? 'active' : ''}" data-workspace-subject-id="${subject.id}" type="button">
        <span>${subject.ref || ''}</span>
        <strong>${subject.name || 'Unnamed student'}</strong>
        <em>${subject.grade || ''}${subject.homeroom ? ` / ${subject.homeroom}` : ''}</em>
      </button>
    `).join('')
    : '<div class="empty-state">No students match this search.</div>';

  workspaceStudentList.querySelectorAll('[data-workspace-subject-id]').forEach((button) => {
    button.onclick = () => {
      jobsState.selectedSubjectId = Number(button.dataset.workspaceSubjectId);
      renderStudentWorkspace();
    };
  });

  renderWorkspaceStudentDetail(currentSubject);
  renderWorkspaceOrderDetail(currentSubject);
  updateWorkspaceNavButtons();
}

function renderWorkspaceStudentDetail(subject) {
  if (!subject) {
    workspaceStudentDetail.innerHTML = '<div class="empty-state">No student selected.</div>';
    return;
  }

  workspaceStudentDetail.innerHTML = `
    <div class="workspace-student-header">
      <div>
        <span>Ref # ${subject.ref || ''}</span>
        <h2>${subject.name || 'Unnamed student'}</h2>
      </div>
      <span class="status ${subject.imageAssetId ? 'ready' : 'review'}">${subject.imageAssetId ? 'Photo linked' : 'No photo'}</span>
    </div>
    <div class="workspace-photo" id="workspacePhotoPanel">
      <div class="empty-state">Loading photo...</div>
    </div>
    <dl class="workspace-fields">
      <div><dt>Student ID</dt><dd>${subject.externalId || ''}</dd></div>
      <div><dt>Grade</dt><dd>${subject.grade || ''}</dd></div>
      <div><dt>Homeroom</dt><dd>${subject.homeroom || ''}</dd></div>
      <div><dt>Track</dt><dd>${subject.track || ''}</dd></div>
      <div><dt>Team</dt><dd>${subject.team || ''}</dd></div>
      <div><dt>Type</dt><dd>${formatType(subject.subjectType || 'student')}</dd></div>
      <div><dt>Photographed</dt><dd>${formatStatusLabel(subject.photographedStatus || '')}</dd></div>
    </dl>
    ${jobsState.showStudentEditForm ? renderStudentEditForm(subject) : ''}
    <div class="student-render-actions">
      <button class="primary" type="button" data-render-current-id-card="${subject.id}" ${subject.imageAssetId ? '' : 'disabled'}>
        Render ID Card
      </button>
      <span data-current-id-card-status>${subject.imageAssetId ? '' : 'Photo required'}</span>
    </div>
    <form class="notes-form" data-note-form="subject" data-note-id="${subject.id}">
      <label>
        <span>Notes</span>
        <textarea name="notes" rows="4">${escapeHtml(subject.notes)}</textarea>
      </label>
      <div class="form-actions">
        <span data-note-status></span>
        <button type="submit">Save Notes</button>
      </div>
    </form>
  `;

  bindStudentEditForm();
  bindCurrentStudentIdCardAction();
  bindNoteForms(workspaceStudentDetail);
  loadWorkspacePhoto(subject.imageAssetId);
}

function bindCurrentStudentIdCardAction() {
  const button = workspaceStudentDetail.querySelector('[data-render-current-id-card]');
  if (!button) {
    return;
  }

  button.addEventListener('click', async () => {
    const status = workspaceStudentDetail.querySelector('[data-current-id-card-status]');
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Rendering...';
    status.textContent = '';

    try {
      const result = await trecsApi('renderSubjectIdCard').renderSubjectIdCard(
        jobsState.selectedJobId,
        Number(button.dataset.renderCurrentIdCard),
        {
          idCardLayout: jobsState.idCardLayout,
          idCardReason: 'replacement_request'
        }
      );
      status.textContent = `Saved ${result.outputPath}`;
    } catch (error) {
      status.textContent = error.message || 'Render failed';
      console.error(error);
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  });
}

function renderStudentEditForm(subject) {
  return `
    <form class="student-edit-form" data-student-edit-form data-subject-id="${subject.id}">
      <div class="subheading">
        <h3>Edit Student Info</h3>
        <span data-student-edit-status></span>
      </div>
      <div class="student-edit-grid">
        <div class="readonly-edit-field">
          <span>Ref</span>
          <strong>${escapeHtml(subject.ref || '')}</strong>
        </div>
        <label>
          <span>Student ID</span>
          <input name="externalId" value="${escapeHtml(subject.externalId || '')}">
        </label>
        <label>
          <span>First Name</span>
          <input name="firstName" value="${escapeHtml(subject.firstName || '')}">
        </label>
        <label>
          <span>Last Name</span>
          <input name="lastName" value="${escapeHtml(subject.lastName || '')}">
        </label>
        <label>
          <span>Grade</span>
          <input name="grade" value="${escapeHtml(subject.grade || '')}">
        </label>
        <label>
          <span>Homeroom</span>
          <input name="homeroom" value="${escapeHtml(subject.homeroom || '')}">
        </label>
        <label>
          <span>Track</span>
          <input name="track" value="${escapeHtml(subject.track || '')}">
        </label>
        <label>
          <span>Team</span>
          <input name="team" value="${escapeHtml(subject.team || '')}">
        </label>
        <label>
          <span>Type</span>
          <select name="subjectType">
            ${studentTypeOptions(subject.subjectType)}
          </select>
        </label>
        <label>
          <span>Photo Status</span>
          <select name="photographedStatus">
            ${photoStatusOptions(subject.photographedStatus)}
          </select>
        </label>
      </div>
      <div class="form-actions">
        <button type="button" data-cancel-student-edit>Cancel</button>
        <button class="primary" type="submit">Save Student</button>
      </div>
    </form>
  `;
}

function studentTypeOptions(selectedType) {
  return [
    ['student', 'Student'],
    ['faculty', 'Faculty'],
    ['staff', 'Staff'],
    ['athlete', 'Athlete'],
    ['senior', 'Senior'],
    ['group', 'Group'],
    ['other', 'Other']
  ].map(([value, label]) => `
    <option value="${value}" ${value === (selectedType || 'student') ? 'selected' : ''}>${label}</option>
  `).join('');
}

function photoStatusOptions(selectedStatus) {
  return [
    ['unknown', 'Unknown'],
    ['not_photographed', 'Not Photographed'],
    ['photographed', 'Photographed'],
    ['absent', 'Absent'],
    ['retake_needed', 'Retake Needed']
  ].map(([value, label]) => `
    <option value="${value}" ${value === (selectedStatus || 'unknown') ? 'selected' : ''}>${label}</option>
  `).join('');
}

function subjectInputFromForm(form) {
  return {
    externalId: form.elements.externalId.value,
    firstName: form.elements.firstName.value,
    lastName: form.elements.lastName.value,
    grade: form.elements.grade.value,
    homeroom: form.elements.homeroom.value,
    track: form.elements.track.value,
    team: form.elements.team.value,
    subjectType: form.elements.subjectType.value,
    photographedStatus: form.elements.photographedStatus.value
  };
}

function bindStudentEditForm() {
  const form = workspaceStudentDetail.querySelector('[data-student-edit-form]');
  if (!form) {
    return;
  }

  const status = form.querySelector('[data-student-edit-status]');
  const submitButton = form.querySelector('button[type="submit"]');
  const cancelButton = form.querySelector('[data-cancel-student-edit]');

  cancelButton.addEventListener('click', () => {
    jobsState.showStudentEditForm = false;
    renderStudentWorkspace();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    status.textContent = 'Saving...';

    try {
      const result = await trecsApi('updateSubject').updateSubject(
        Number(form.dataset.subjectId),
        subjectInputFromForm(form)
      );
      jobsState.selectedSubjectId = result.id;
      jobsState.showStudentEditForm = false;
      await reloadCurrentJobDetail();
    } catch (error) {
      status.textContent = error.message || 'Save failed';
      console.error(error);
    } finally {
      submitButton.disabled = false;
    }
  });
}

async function submitAddRecords(event) {
  event.preventDefault();
  if (!jobsState.selectedJobId) {
    return;
  }

  const button = addRecordsForm.querySelector('button[type="submit"]');
  const count = Number(addRecordsForm.elements.recordCount.value);
  button.disabled = true;
  button.textContent = 'Adding...';
  addRecordsStatus.textContent = '';

  try {
    const result = await trecsApi('createBlankSubjects').createBlankSubjects(jobsState.selectedJobId, count);
    jobsState.selectedSubjectId = result.firstId;
    jobsState.workspaceStudentSearch = '';
    jobsState.showStudentEditForm = true;
    setAddRecordsModalVisible(false);
    await reloadCurrentJobDetail();
  } catch (error) {
    addRecordsStatus.textContent = error.message || 'Add records failed';
    console.error(error);
  } finally {
    button.disabled = false;
    button.textContent = 'Add Records';
  }
}

async function loadWorkspacePhoto(imageId) {
  const panel = document.getElementById('workspacePhotoPanel');
  if (!panel) {
    return;
  }

  if (!imageId) {
    panel.innerHTML = '<div class="empty-state">No photo linked.</div>';
    return;
  }

  try {
    const preview = await trecsApi('getImagePreview').getImagePreview(imageId);
    if (!preview || preview.missing || !preview.dataUrl) {
      panel.innerHTML = '<div class="empty-state">Preview unavailable.</div>';
      return;
    }

    panel.innerHTML = `<img src="${preview.dataUrl}" alt="${escapeHtml(preview.filename)}">`;
  } catch (error) {
    panel.innerHTML = '<div class="empty-state">Preview unavailable.</div>';
    console.error(error);
  }
}

async function loadEnvelopeSubjectPhoto(imageId) {
  const panel = document.getElementById('envelopeSubjectPhoto');
  if (!panel) {
    return;
  }

  if (!imageId) {
    panel.innerHTML = '<div class="empty-state">No photo linked.</div>';
    return;
  }

  try {
    const preview = await trecsApi('getImagePreview').getImagePreview(imageId);
    if (!preview || preview.missing || !preview.dataUrl) {
      panel.innerHTML = '<div class="empty-state">Preview unavailable.</div>';
      return;
    }

    panel.innerHTML = `<img src="${preview.dataUrl}" alt="${escapeHtml(preview.filename)}">`;
  } catch (error) {
    panel.innerHTML = '<div class="empty-state">Preview unavailable.</div>';
    console.error(error);
  }
}

function renderWorkspaceOrderDetail(subject) {
  if (!subject) {
    workspaceOrderDetail.innerHTML = '<div class="empty-state">No student selected.</div>';
    return;
  }

  const orders = rowsFor(jobsState.detail.subjectOrders || [], 'subjectId', subject.id);
  const images = rowsFor(jobsState.detail.subjectImages || [], 'subjectId', subject.id);

  workspaceOrderDetail.innerHTML = `
    <div class="panel-heading">
      <h2>Orders</h2>
      <span>${formatNumber(orders.length)}</span>
    </div>
    ${renderMiniSection(
      'Order Summary',
      orders.map((order) => `
        <div class="mini-order-row">
          <span>#${order.id} ${order.source} / ${order.paidStatus}</span>
          <strong>${order.packageCodes || 'No codes'} (${order.itemCount} items)</strong>
          <div class="mini-row-actions">
            <button data-workspace-order-envelope="${order.id}" type="button">View</button>
            <button data-workspace-order-edit="${order.id}" type="button">Edit</button>
            <button data-workspace-order-delete="${order.id}" type="button">Delete</button>
          </div>
        </div>
      `),
      'No orders for this student.'
    )}
    ${renderMiniSection(
      'Linked Images',
      images.map((image) => `
        <div>
          <span>${image.role}${image.selected ? ' / selected' : ''}</span>
          <strong>${image.filename}</strong>
        </div>
      `),
      'No linked images.'
    )}
  `;

  workspaceOrderDetail.querySelectorAll('[data-workspace-order-envelope]').forEach((row) => {
    row.addEventListener('click', () => {
      showOrderEnvelope(Number(row.dataset.workspaceOrderEnvelope));
    });
  });
  workspaceOrderDetail.querySelectorAll('[data-workspace-order-edit]').forEach((button) => {
    button.addEventListener('click', () => {
      showEditOrder(Number(button.dataset.workspaceOrderEdit));
    });
  });
  workspaceOrderDetail.querySelectorAll('[data-workspace-order-delete]').forEach((button) => {
    button.addEventListener('click', () => {
      deleteWorkspaceOrder(Number(button.dataset.workspaceOrderDelete));
    });
  });
}

async function showOrderEnvelope(orderId) {
  jobsState.viewingEnvelopeScanId = null;
  orderEnvelopeModal.hidden = false;
  orderEnvelopeActions.hidden = true;
  orderEnvelopeTitle.textContent = `Order #${orderId} Envelope`;
  orderEnvelopePreview.innerHTML = '<div class="empty-state">Loading envelope...</div>';

  try {
    const preview = await trecsApi('getOrderEnvelopePreview').getOrderEnvelopePreview(orderId);
    const subjectLine = [preview.ref, preview.subjectName].filter(Boolean).join(' ');
    orderEnvelopeTitle.textContent = `Order #${orderId}${subjectLine ? ` / ${subjectLine}` : ''}`;
    renderOrderEnvelopePreview(orderEnvelopePreview, preview);
  } catch (error) {
    orderEnvelopePreview.innerHTML = `<div class="empty-state">${escapeHtml(error.message || 'Could not load envelope.')}</div>`;
    console.error(error);
  }
}

function renderOrderEnvelopePreview(container, preview) {
  if (preview.missing || !preview.dataUrl) {
    container.innerHTML = `<div class="empty-state">${escapeHtml(preview.reason || 'No envelope scan linked.')}</div>`;
    return;
  }

  container.innerHTML = `
    <img src="${preview.dataUrl}" alt="${escapeHtml(preview.filename || 'Envelope scan')}">
    <div class="order-envelope-meta">
      <span>${escapeHtml(preview.filename || '')}</span>
      <span>${preview.keyedOrderCode ? `Codes: ${escapeHtml(preview.keyedOrderCode)}` : ''}</span>
    </div>
  `;
}

function closeOrderEnvelope() {
  jobsState.viewingEnvelopeScanId = null;
  orderEnvelopeModal.hidden = true;
  orderEnvelopeActions.hidden = true;
  orderEnvelopePreview.innerHTML = '<div class="empty-state">Loading envelope...</div>';
}

function showEditOrder(orderId) {
  const order = findById(jobsState.detail.subjectOrders || [], orderId) || findById(jobsState.detail.orders || [], orderId);
  if (!order) {
    return;
  }

  jobsState.editingOrderId = orderId;
  editOrderTitle.textContent = `Edit Order #${orderId}`;
  editOrderForm.elements.orderCodes.value = order.packageCodes || '';
  editOrderForm.elements.paidStatus.value = order.paidStatus || 'unknown';
  editOrderForm.elements.notes.value = order.notes || '';
  editOrderEnvelopePreview.innerHTML = '<div class="empty-state">Loading envelope...</div>';
  editOrderStatus.textContent = '';
  editOrderModal.hidden = false;
  editOrderForm.elements.orderCodes.focus();
  editOrderForm.elements.orderCodes.select();
  loadEditOrderEnvelope(orderId);
}

async function loadEditOrderEnvelope(orderId) {
  try {
    const preview = await trecsApi('getOrderEnvelopePreview').getOrderEnvelopePreview(orderId);
    renderOrderEnvelopePreview(editOrderEnvelopePreview, preview);
  } catch (error) {
    editOrderEnvelopePreview.innerHTML = `<div class="empty-state">${escapeHtml(error.message || 'Could not load envelope.')}</div>`;
    console.error(error);
  }
}

function closeEditOrder() {
  jobsState.editingOrderId = null;
  editOrderModal.hidden = true;
  editOrderStatus.textContent = '';
}

async function submitEditOrder(event) {
  event.preventDefault();
  if (!jobsState.editingOrderId) {
    return;
  }

  const button = editOrderForm.querySelector('button[type="submit"]');
  button.disabled = true;
  editOrderStatus.textContent = 'Saving...';

  try {
    const result = await trecsApi('updateOrder').updateOrder(jobsState.editingOrderId, {
      orderCodes: editOrderForm.elements.orderCodes.value,
      paidStatus: editOrderForm.elements.paidStatus.value,
      notes: editOrderForm.elements.notes.value
    });
    jobsState.selectedOrderId = result.id;
    closeEditOrder();
    await reloadCurrentJobDetail();
  } catch (error) {
    editOrderStatus.textContent = error.message || 'Save failed';
    console.error(error);
  } finally {
    button.disabled = false;
  }
}

async function deleteWorkspaceOrder(orderId) {
  const order = findById(jobsState.detail.subjectOrders || [], orderId) || findById(jobsState.detail.orders || [], orderId);
  const label = order && order.packageCodes ? `#${orderId} (${order.packageCodes})` : `#${orderId}`;
  if (!confirm(`Delete order ${label}? This will keep the envelope scan but remove the order and its items.`)) {
    return;
  }

  try {
    await trecsApi('deleteOrder').deleteOrder(orderId);
    if (jobsState.selectedOrderId === orderId) {
      jobsState.selectedOrderId = null;
    }
    await reloadCurrentJobDetail();
    if (jobsState.workspaceMode === 'envelope') {
      await loadUnlinkedEnvelopeScans();
    }
  } catch (error) {
    alert(error.message || 'Delete failed');
    console.error(error);
  }
}

function renderCaptureWorkspace() {
  if (!jobsState.detail || !jobsState.detail.summary) {
    return;
  }

  const job = jobsState.detail.summary;
  title.textContent = `${job.job} Image Capture`;
  workspaceJobTitle.textContent = `${job.location} / ${job.job}`;
  workspaceJobMeta.textContent = `${formatType(job.type)} / Image capture`;
  renderCaptureFileModeToggle();
  renderCaptureSubject();
  loadCaptureImages();

  setTimeout(() => {
    captureEntryForm.elements.barcode.focus();
    captureEntryForm.elements.barcode.select();
  }, 0);
}

function captureFileModeLabel(mode = jobsState.captureFileMode) {
  return mode === 'jpg_only' ? 'JPG Only' : 'JPG + CR3';
}

function renderCaptureFileModeToggle() {
  if (!captureFileModeToggle) {
    return;
  }

  captureFileModeToggle.querySelectorAll('[data-capture-file-mode]').forEach((button) => {
    button.classList.toggle('active', button.dataset.captureFileMode === jobsState.captureFileMode);
  });
}

async function setCaptureFileMode(fileMode) {
  const nextMode = fileMode === 'jpg_only' ? 'jpg_only' : 'jpg_raw';
  if (jobsState.captureFileMode === nextMode) {
    return;
  }

  jobsState.captureFileMode = nextMode;
  renderCaptureFileModeToggle();
  setCapturePairStatus({ ready: true, message: `Ready (${captureFileModeLabel()})` });

  if (jobsState.captureSubject) {
    try {
      await startCaptureWatcherForCurrentSubject();
    } catch (error) {
      captureEntryStatus.textContent = error.message || 'Could not restart capture watcher';
      console.error(error);
    }
  }
}

function renderCaptureSubject() {
  const subject = jobsState.captureSubject;
  if (!subject) {
    captureSubjectDetail.innerHTML = '<div class="empty-state">Scan a camera card barcode or search for a student.</div>';
    capturePreviewMeta.textContent = '';
    return;
  }

  const isBlank = !(subject.firstName || subject.lastName || subject.name || subject.externalId || subject.grade || subject.homeroom);
  captureSubjectDetail.innerHTML = `
    <div class="capture-subject-card">
      <span>${escapeHtml(subject.ref || '')}</span>
      <strong>${escapeHtml(subject.name || 'Unnamed student')}</strong>
      <em>${escapeHtml([subject.grade, subject.homeroom].filter(Boolean).join(' / '))}</em>
      <small>${escapeHtml(subject.externalId || '')}</small>
      ${subject.imageAssetId ? '<div class="capture-subject-photo" id="captureSubjectPhoto"><div class="empty-state">Loading photo...</div></div>' : ''}
    </div>
    <form class="capture-subject-form" data-capture-subject-form data-subject-id="${subject.id}">
      <div class="subheading">
        <h3>${isBlank ? 'Student Info' : 'Student Notes'}</h3>
        <span data-capture-subject-status></span>
      </div>
      <div class="capture-subject-fields ${isBlank ? '' : 'compact'}">
        ${isBlank ? `
          <label>
            <span>First Name</span>
            <input name="firstName" value="${escapeHtml(subject.firstName || '')}">
          </label>
          <label>
            <span>Last Name</span>
            <input name="lastName" value="${escapeHtml(subject.lastName || '')}">
          </label>
          <label>
            <span>Student ID</span>
            <input name="externalId" value="${escapeHtml(subject.externalId || '')}">
          </label>
          <label>
            <span>Grade</span>
            <input name="grade" value="${escapeHtml(subject.grade || '')}">
          </label>
          <label>
            <span>Homeroom</span>
            <input name="homeroom" value="${escapeHtml(subject.homeroom || '')}">
          </label>
        ` : ''}
        <label class="wide-field">
          <span>Notes</span>
          <textarea name="notes" rows="${isBlank ? '3' : '5'}">${escapeHtml(subject.notes || '')}</textarea>
        </label>
      </div>
      <div class="form-actions">
        <button class="primary" type="submit">Save</button>
      </div>
    </form>
  `;
  bindCaptureSubjectForm();
  loadCaptureSubjectPhoto(subject.imageAssetId);
}

function renderCaptureCompare() {
  const images = jobsState.captureImages || [];
  capturePreviewMeta.textContent = jobsState.captureSubject
    ? `${formatNumber(images.length)} comparison image${images.length === 1 ? '' : 's'}`
    : '';

  if (!jobsState.captureSubject) {
    captureCompareGrid.innerHTML = '<div class="empty-state">Load a student, then capture images into CaptureHotFolder.</div>';
    return;
  }

  const mostRecent = images[0] || null;
  const previous = images[1] || null;
  const slots = [
    { image: previous, label: 'Previous Image' },
    { image: mostRecent, label: 'Most Recent Image' }
  ];
  captureCompareGrid.innerHTML = slots.map((slot) => {
    const image = slot.image;
    if (!image) {
      return `
        <button class="capture-image-slot empty" type="button" disabled>
          <span>${slot.label}</span>
          <strong>No image yet</strong>
        </button>
      `;
    }
    return `
      <button class="capture-image-slot ${image.selected ? 'selected' : ''}" data-capture-select-image="${image.id}" type="button">
        <span>${slot.label}</span>
        ${image.dataUrl ? `<div class="capture-image-stage"><img data-capture-orient src="${image.dataUrl}" alt="${escapeHtml(image.filename || 'Captured image')}"></div>` : '<strong>Preview unavailable</strong>'}
        <em>${escapeHtml(image.filename || '')}</em>
      </button>
    `;
  }).join('');

  captureCompareGrid.querySelectorAll('[data-capture-orient]').forEach((image) => {
    image.addEventListener('load', () => {
      image.classList.toggle('rotate-ccw', image.naturalWidth > image.naturalHeight);
    }, { once: true });
  });

  captureCompareGrid.querySelectorAll('[data-capture-select-image]').forEach((button) => {
    button.addEventListener('click', () => {
      selectCaptureImage(Number(button.dataset.captureSelectImage), button);
    });
  });
}

function setCapturePairStatus(status) {
  const ready = !status || status.ready !== false;
  const message = status && status.message ? status.message : 'Ready';
  capturePairStatus.classList.toggle('ready', ready);
  capturePairStatus.classList.toggle('waiting', !ready);
  capturePairStatus.innerHTML = `<i></i>${escapeHtml(message)}`;
}

async function loadCaptureSubjectPhoto(imageId) {
  const panel = document.getElementById('captureSubjectPhoto');
  if (!panel || !imageId) {
    return;
  }

  try {
    const preview = await trecsApi('getImagePreview').getImagePreview(imageId);
    if (!preview || preview.missing || !preview.dataUrl) {
      panel.innerHTML = '<div class="empty-state">Preview unavailable.</div>';
      return;
    }

    panel.innerHTML = `<img src="${preview.dataUrl}" alt="${escapeHtml(preview.filename || 'Student photo')}">`;
    const image = panel.querySelector('img');
    image.addEventListener('load', () => {
      image.classList.toggle('rotate-landscape-ccw', image.naturalWidth > image.naturalHeight);
    }, { once: true });
  } catch (error) {
    panel.innerHTML = '<div class="empty-state">Preview unavailable.</div>';
    console.error(error);
  }
}

function bindCaptureSubjectForm() {
  const form = captureSubjectDetail.querySelector('[data-capture-subject-form]');
  if (!form) {
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const subject = jobsState.captureSubject;
    if (!subject) {
      return;
    }

    const status = form.querySelector('[data-capture-subject-status]');
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    status.textContent = 'Saving...';

    try {
      if (form.elements.firstName) {
        const updatedSubjectFields = {
          externalId: form.elements.externalId.value,
          firstName: form.elements.firstName.value,
          lastName: form.elements.lastName.value,
          grade: form.elements.grade.value,
          homeroom: form.elements.homeroom.value,
          track: subject.track || '',
          team: subject.team || '',
          subjectType: subject.subjectType || 'student',
          photographedStatus: subject.photographedStatus || 'unknown'
        };
        await trecsApi('updateSubject').updateSubject(subject.id, updatedSubjectFields);
        jobsState.captureSubject = {
          ...subject,
          ...updatedSubjectFields,
          name: [updatedSubjectFields.firstName, updatedSubjectFields.lastName].filter(Boolean).join(' ') || subject.name
        };
      }

      const notesResult = await trecsApi('updateSubjectNotes').updateSubjectNotes(subject.id, form.elements.notes.value);
      jobsState.captureSubject = {
        ...jobsState.captureSubject,
        notes: notesResult.notes
      };
      const detailSubject = findById(jobsState.detail.subjects || [], subject.id);
      if (detailSubject) {
        Object.assign(detailSubject, jobsState.captureSubject);
      }
      status.textContent = 'Saved';
      renderCaptureSubject();
    } catch (error) {
      status.textContent = error.message || 'Save failed';
      console.error(error);
    } finally {
      button.disabled = false;
    }
  });
}

async function loadCaptureImages() {
  if (!jobsState.captureSubject) {
    jobsState.captureImages = [];
    renderCaptureCompare();
    return;
  }

  try {
    jobsState.captureImages = await trecsApi('getCaptureSubjectImages').getCaptureSubjectImages(jobsState.captureSubject.id);
    renderCaptureCompare();
  } catch (error) {
    captureCompareGrid.innerHTML = `<div class="empty-state">${escapeHtml(error.message || 'Could not load capture images.')}</div>`;
    console.error(error);
  }
}

async function lookupCaptureSubject() {
  const barcode = captureEntryForm.elements.barcode.value.trim();
  if (!barcode || !jobsState.selectedJobId) {
    return;
  }

  captureEntryStatus.textContent = '';
  try {
    const result = await trecsApi('findSubjectByBarcode').findSubjectByBarcode(jobsState.selectedJobId, barcode);
    await setCaptureSubject(result.subject, true);
  } catch (error) {
    jobsState.captureSubject = null;
    await stopCaptureWatcher();
    captureEntryStatus.textContent = error.message || 'Student not found';
    renderCaptureSubject();
    renderCaptureCompare();
    console.error(error);
  }
}

async function setCaptureSubject(subject, focusBarcode = false) {
  if (!subject) {
    return;
  }

  jobsState.captureSubject = subject;
  jobsState.selectedSubjectId = subject.id;
  captureEntryForm.elements.barcode.value = subject.ref || subject.externalId || '';
  captureEntryStatus.textContent = '';
  renderCaptureSubject();
  await loadCaptureImages();
  await startCaptureWatcherForCurrentSubject();
  if (focusBarcode) {
    captureEntryForm.elements.barcode.focus();
    captureEntryForm.elements.barcode.select();
  }
}

function hideCaptureStudentSearch() {
  jobsState.captureSearchResults = [];
  jobsState.captureSearchActiveIndex = -1;
  captureStudentSearchResults.hidden = true;
  captureStudentSearchResults.innerHTML = '';
}

function renderCaptureStudentSearchResults() {
  const results = jobsState.captureSearchResults || [];
  if (!results.length) {
    captureStudentSearchResults.hidden = true;
    captureStudentSearchResults.innerHTML = '';
    return;
  }

  captureStudentSearchResults.innerHTML = results.map((subject, index) => `
    <button class="${index === jobsState.captureSearchActiveIndex ? 'active' : ''}" data-capture-student-index="${index}" type="button">
      <strong>${escapeHtml(subject.name || 'Unnamed student')}</strong>
      <span>${escapeHtml([subject.ref ? `Ref ${subject.ref}` : '', subject.grade ? `Grade ${subject.grade}` : '', subject.homeroom ? `HR ${subject.homeroom}` : ''].filter(Boolean).join(' / '))}</span>
    </button>
  `).join('');
  captureStudentSearchResults.hidden = false;

  captureStudentSearchResults.querySelectorAll('[data-capture-student-index]').forEach((button) => {
    button.addEventListener('mousedown', (event) => {
      event.preventDefault();
    });
    button.addEventListener('click', () => {
      selectCaptureSearchResult(Number(button.dataset.captureStudentIndex));
    });
  });
}

async function searchCaptureStudents() {
  const input = captureEntryForm.elements.studentSearch;
  const search = input.value.trim();
  if (!jobsState.selectedJobId || search.length < 2) {
    hideCaptureStudentSearch();
    return;
  }

  try {
    const results = await trecsApi('searchEnvelopeSubjects').searchEnvelopeSubjects(jobsState.selectedJobId, search);
    if (input.value.trim() !== search) {
      return;
    }
    jobsState.captureSearchResults = results;
    jobsState.captureSearchActiveIndex = results.length ? 0 : -1;
    renderCaptureStudentSearchResults();
  } catch (error) {
    captureStudentSearchResults.hidden = false;
    captureStudentSearchResults.innerHTML = `<div class="empty-state">${escapeHtml(error.message || 'Student search failed')}</div>`;
    console.error(error);
  }
}

async function selectCaptureSearchResult(index) {
  const subject = jobsState.captureSearchResults[index];
  if (!subject) {
    return;
  }

  captureEntryForm.elements.studentSearch.value = '';
  hideCaptureStudentSearch();
  await setCaptureSubject(subject, true);
}

async function startCaptureWatcherForCurrentSubject() {
  if (!jobsState.captureSubject) {
    return;
  }

  setCapturePairStatus({ ready: true, message: `Ready (${captureFileModeLabel()})` });
  return trecsApi('startCaptureWatcher').startCaptureWatcher(
    jobsState.selectedJobId,
    jobsState.captureSubject.id,
    { fileMode: jobsState.captureFileMode }
  );
}

async function stopCaptureWatcher() {
  if (!window.trecs || typeof window.trecs.stopCaptureWatcher !== 'function') {
    return;
  }
  await trecsApi('stopCaptureWatcher').stopCaptureWatcher();
}

async function handleCaptureImageImported(payload) {
  if (!payload) {
    return;
  }
  if (payload.status) {
    setCapturePairStatus(payload.status);
  }
  if (payload.error) {
    captureEntryStatus.textContent = payload.error;
    return;
  }
  if (!payload.image || !jobsState.captureSubject || payload.image.subjectId !== jobsState.captureSubject.id) {
    return;
  }

  captureEntryStatus.textContent = `Captured ${payload.image.filename}`;
  await loadCaptureImages();
  await reloadCurrentJobDetail();
}

async function selectCaptureImage(imageId, control) {
  if (!jobsState.captureSubject || !imageId) {
    return;
  }

  const originalText = control ? control.querySelector('span')?.textContent : '';
  if (control) {
    control.disabled = true;
  }

  try {
    await trecsApi('selectCaptureImage').selectCaptureImage(jobsState.captureSubject.id, imageId);
    await loadCaptureImages();
    await reloadCurrentJobDetail();
  } catch (error) {
    captureEntryStatus.textContent = error.message || 'Could not select image';
    console.error(error);
  } finally {
    if (control) {
      control.disabled = false;
      const label = control.querySelector('span');
      if (label && originalText) {
        label.textContent = originalText;
      }
    }
  }
}

function renderEnvelopeWorkspace() {
  if (!jobsState.detail || !jobsState.detail.summary) {
    return;
  }

  const job = jobsState.detail.summary;
  title.textContent = `${job.job} Envelope Entry`;
  workspaceJobTitle.textContent = `${job.location} / ${job.job}`;
  workspaceJobMeta.textContent = `${formatType(job.type)} / Envelope scan order entry`;
  renderEnvelopeSubject();
  renderEnvelopePreview();
  loadUnlinkedEnvelopeScans();

  setTimeout(() => {
    envelopeEntryForm.elements.barcode.focus();
    envelopeEntryForm.elements.barcode.select();
  }, 0);
}

async function loadUnlinkedEnvelopeScans() {
  if (!jobsState.selectedJobId || jobsState.workspaceMode !== 'envelope') {
    return;
  }

  unlinkedEnvelopeList.innerHTML = '<div class="empty-state">Loading unlinked envelopes...</div>';
  try {
    jobsState.unlinkedEnvelopeScans = await trecsApi('getUnlinkedEnvelopeScans').getUnlinkedEnvelopeScans(jobsState.selectedJobId);
    renderUnlinkedEnvelopeScans();
  } catch (error) {
    unlinkedEnvelopeList.innerHTML = `<div class="empty-state">${escapeHtml(error.message || 'Could not load unlinked envelopes.')}</div>`;
    console.error(error);
  }
}

function renderUnlinkedEnvelopeScans() {
  const scans = jobsState.unlinkedEnvelopeScans || [];
  if (!scans.length) {
    unlinkedEnvelopeList.innerHTML = '<div class="empty-state">No unlinked envelopes.</div>';
    return;
  }

  unlinkedEnvelopeList.innerHTML = scans.map((scan) => `
    <div class="unlinked-envelope-row">
      <div>
        <span>${escapeHtml(scan.ref || scan.envelopeIdentifier || '')}</span>
        <strong>${escapeHtml(scan.subjectName || 'Unassigned envelope')}</strong>
        <em>${escapeHtml(scan.scanPath || '')}</em>
      </div>
      <button data-unlinked-envelope-view="${scan.id}" type="button">View</button>
    </div>
  `).join('');

  unlinkedEnvelopeList.querySelectorAll('[data-unlinked-envelope-view]').forEach((button) => {
    button.addEventListener('click', () => {
      showEnvelopeScan(Number(button.dataset.unlinkedEnvelopeView));
    });
  });
}

async function showEnvelopeScan(scanId) {
  jobsState.viewingEnvelopeScanId = scanId;
  orderEnvelopeModal.hidden = false;
  orderEnvelopeActions.hidden = false;
  orderEnvelopeTitle.textContent = `Envelope Scan #${scanId}`;
  orderEnvelopePreview.innerHTML = '<div class="empty-state">Loading envelope...</div>';

  try {
    const preview = await trecsApi('getEnvelopeScanPreview').getEnvelopeScanPreview(scanId);
    const subjectLine = [preview.ref, preview.subjectName].filter(Boolean).join(' ');
    orderEnvelopeTitle.textContent = `Envelope Scan #${scanId}${subjectLine ? ` / ${subjectLine}` : ''}`;
    renderOrderEnvelopePreview(orderEnvelopePreview, preview);
  } catch (error) {
    orderEnvelopePreview.innerHTML = `<div class="empty-state">${escapeHtml(error.message || 'Could not load envelope.')}</div>`;
    console.error(error);
  }
}

async function assignViewedEnvelopeScan() {
  const scanId = jobsState.viewingEnvelopeScanId;
  const subject = jobsState.envelopeSubject;
  if (!scanId) {
    return;
  }
  if (!subject) {
    alert('Load a student reference before assigning this envelope.');
    envelopeEntryForm.elements.barcode.focus();
    return;
  }

  assignEnvelopeScanButton.disabled = true;
  deleteEnvelopeScanButton.disabled = true;
  orderEnvelopePreview.insertAdjacentHTML('afterbegin', '<div class="empty-state">Assigning envelope...</div>');

  try {
    const result = await trecsApi('assignEnvelopeScan').assignEnvelopeScan(scanId, subject.id);
    jobsState.envelopeScan = result.scan;
    renderEnvelopePreview();
    await loadUnlinkedEnvelopeScans();
    const preview = await trecsApi('getEnvelopeScanPreview').getEnvelopeScanPreview(scanId);
    const subjectLine = [preview.ref, preview.subjectName].filter(Boolean).join(' ');
    orderEnvelopeTitle.textContent = `Envelope Scan #${scanId}${subjectLine ? ` / ${subjectLine}` : ''}`;
    renderOrderEnvelopePreview(orderEnvelopePreview, preview);
    orderEnvelopeActions.hidden = true;
    envelopeEntryForm.elements.orderCodes.focus();
  } catch (error) {
    orderEnvelopePreview.innerHTML = `<div class="empty-state">${escapeHtml(error.message || 'Could not assign envelope.')}</div>`;
    console.error(error);
  } finally {
    assignEnvelopeScanButton.disabled = false;
    deleteEnvelopeScanButton.disabled = false;
  }
}

async function deleteViewedEnvelopeScan() {
  const scanId = jobsState.viewingEnvelopeScanId;
  if (!scanId) {
    return;
  }
  if (!confirm('Delete this unlinked envelope scan and its image file?')) {
    return;
  }

  assignEnvelopeScanButton.disabled = true;
  deleteEnvelopeScanButton.disabled = true;
  try {
    await trecsApi('deleteEnvelopeScan').deleteEnvelopeScan(scanId);
    if (jobsState.envelopeScan && Number(jobsState.envelopeScan.id) === Number(scanId)) {
      jobsState.envelopeScan = null;
      renderEnvelopePreview();
    }
    closeOrderEnvelope();
    await loadUnlinkedEnvelopeScans();
  } catch (error) {
    alert(error.message || 'Could not delete envelope.');
    console.error(error);
  } finally {
    assignEnvelopeScanButton.disabled = false;
    deleteEnvelopeScanButton.disabled = false;
  }
}

function renderEnvelopeSubject() {
  const subject = jobsState.envelopeSubject;
  if (!subject) {
    envelopeSubjectDetail.innerHTML = '<div class="empty-state">Scan a camera card barcode.</div>';
    return;
  }

  const existingOrders = rowsFor(jobsState.detail.subjectOrders || [], 'subjectId', subject.id);
  envelopeSubjectDetail.innerHTML = `
    <div class="workspace-student-header">
      <div>
        <span>Ref # ${subject.ref || ''}</span>
        <h2>${subject.name || 'Unnamed student'}</h2>
      </div>
      <span class="status ${subject.imageAssetId ? 'ready' : 'review'}">${subject.imageAssetId ? 'Photo linked' : 'No photo'}</span>
    </div>
    <div class="envelope-subject-photo" id="envelopeSubjectPhoto">
      <div class="empty-state">Loading photo...</div>
    </div>
    <dl class="workspace-fields envelope-fields">
      <div><dt>Student ID</dt><dd>${subject.externalId || ''}</dd></div>
      <div><dt>Grade</dt><dd>${subject.grade || ''}</dd></div>
      <div><dt>Homeroom</dt><dd>${subject.homeroom || ''}</dd></div>
      <div><dt>Orders</dt><dd>${formatNumber(existingOrders.length)}</dd></div>
    </dl>
    ${renderMiniSection(
      'Existing Orders',
      existingOrders.map((order) => `
        <div>
          <span>#${order.id} ${order.source} / ${order.paidStatus}</span>
          <strong>${order.packageCodes || 'No codes'} (${order.itemCount} items)</strong>
        </div>
      `),
      'No existing orders.'
    )}
  `;
  loadEnvelopeSubjectPhoto(subject.imageAssetId);
}

function renderEnvelopePreview() {
  const scan = jobsState.envelopeScan;
  if (!scan) {
    envelopePreviewMeta.textContent = '';
    envelopePreview.innerHTML = '<div class="empty-state">No envelope scan imported.</div>';
    return;
  }

  envelopePreviewMeta.textContent = scan.filename || '';
  if (!scan.dataUrl) {
    envelopePreview.innerHTML = '<div class="empty-state">Preview unavailable.</div>';
    return;
  }

  envelopePreview.innerHTML = `<img src="${scan.dataUrl}" alt="${escapeHtml(scan.filename || 'Envelope scan')}">`;
}

async function lookupEnvelopeSubject() {
  const barcode = envelopeEntryForm.elements.barcode.value.trim();
  if (!barcode || !jobsState.selectedJobId) {
    return;
  }

  envelopeEntryStatus.textContent = '';
  try {
    const result = await trecsApi('findSubjectByBarcode').findSubjectByBarcode(jobsState.selectedJobId, barcode);
    await setEnvelopeSubject(result.subject, true);
  } catch (error) {
    jobsState.envelopeSubject = null;
    jobsState.envelopeWatcherSubjectId = null;
    await stopEnvelopeWatcher();
    envelopeEntryStatus.textContent = error.message || 'Student not found';
    renderEnvelopeSubject();
    console.error(error);
  }
}

async function setEnvelopeSubject(subject, focusOrderCodes = false) {
  if (!subject) {
    return;
  }

  const previousSubjectId = jobsState.envelopeSubject ? jobsState.envelopeSubject.id : null;
  jobsState.envelopeSubject = subject;
  jobsState.selectedSubjectId = subject.id;
  envelopeEntryForm.elements.barcode.value = subject.ref || subject.externalId || '';
  if (previousSubjectId !== subject.id) {
    jobsState.envelopeScan = null;
    jobsState.envelopePending = null;
    envelopeConfirmModal.hidden = true;
    renderEnvelopePreview();
  }
  envelopeEntryStatus.textContent = '';
  renderEnvelopeSubject();
  await startEnvelopeWatcherForCurrentSubject();
  if (focusOrderCodes) {
    envelopeEntryForm.elements.orderCodes.focus();
  }
}

function hideEnvelopeStudentSearch() {
  jobsState.envelopeSearchResults = [];
  jobsState.envelopeSearchActiveIndex = -1;
  envelopeStudentSearchResults.hidden = true;
  envelopeStudentSearchResults.innerHTML = '';
}

function renderEnvelopeStudentSearchResults() {
  const results = jobsState.envelopeSearchResults || [];
  if (!results.length) {
    envelopeStudentSearchResults.hidden = true;
    envelopeStudentSearchResults.innerHTML = '';
    return;
  }

  envelopeStudentSearchResults.innerHTML = results.map((subject, index) => `
    <button class="${index === jobsState.envelopeSearchActiveIndex ? 'active' : ''}" data-envelope-student-index="${index}" type="button">
      <strong>${escapeHtml(subject.name || 'Unnamed student')}</strong>
      <span>${escapeHtml([subject.ref ? `Ref ${subject.ref}` : '', subject.grade ? `Grade ${subject.grade}` : '', subject.homeroom ? `HR ${subject.homeroom}` : ''].filter(Boolean).join(' / '))}</span>
    </button>
  `).join('');
  envelopeStudentSearchResults.hidden = false;

  envelopeStudentSearchResults.querySelectorAll('[data-envelope-student-index]').forEach((button) => {
    button.addEventListener('mousedown', (event) => {
      event.preventDefault();
    });
    button.addEventListener('click', () => {
      selectEnvelopeSearchResult(Number(button.dataset.envelopeStudentIndex));
    });
  });
}

async function searchEnvelopeStudents() {
  const input = envelopeEntryForm.elements.studentSearch;
  const search = input.value.trim();
  if (!jobsState.selectedJobId || search.length < 2) {
    hideEnvelopeStudentSearch();
    return;
  }

  try {
    const results = await trecsApi('searchEnvelopeSubjects').searchEnvelopeSubjects(jobsState.selectedJobId, search);
    if (input.value.trim() !== search) {
      return;
    }
    jobsState.envelopeSearchResults = results;
    jobsState.envelopeSearchActiveIndex = results.length ? 0 : -1;
    renderEnvelopeStudentSearchResults();
  } catch (error) {
    envelopeStudentSearchResults.hidden = false;
    envelopeStudentSearchResults.innerHTML = `<div class="empty-state">${escapeHtml(error.message || 'Student search failed')}</div>`;
    console.error(error);
  }
}

async function selectEnvelopeSearchResult(index) {
  const subject = jobsState.envelopeSearchResults[index];
  if (!subject) {
    return;
  }

  envelopeEntryForm.elements.studentSearch.value = subject.name || '';
  hideEnvelopeStudentSearch();
  await setEnvelopeSubject(subject, true);
}

async function startEnvelopeWatcherForCurrentSubject() {
  const hotFolder = 'EnvelopeHotFolder';
  if (!jobsState.envelopeSubject) {
    return;
  }

  const result = await trecsApi('startEnvelopeWatcher').startEnvelopeWatcher(
    jobsState.selectedJobId,
    jobsState.envelopeSubject.id,
    hotFolder
  );
  jobsState.envelopeWatcherSubjectId = jobsState.envelopeSubject.id;
  return result;
}

async function stopEnvelopeWatcher() {
  if (!window.trecs || typeof window.trecs.stopEnvelopeWatcher !== 'function') {
    return;
  }
  jobsState.envelopeWatcherSubjectId = null;
  await trecsApi('stopEnvelopeWatcher').stopEnvelopeWatcher();
}

function handleEnvelopeScanImported(payload) {
  if (!payload) {
    return;
  }
  if (payload.pending) {
    showEnvelopeConfirm(payload.pending);
    return;
  }
  if (payload.error) {
    envelopeEntryStatus.textContent = payload.error;
    return;
  }
  if (!payload.scan) {
    return;
  }
  if (!jobsState.envelopeSubject || payload.scan.subjectId !== jobsState.envelopeSubject.id) {
    return;
  }
  jobsState.envelopeScan = payload.scan;
  envelopeEntryStatus.textContent = '';
  renderEnvelopePreview();
  loadUnlinkedEnvelopeScans();
  envelopeEntryForm.elements.orderCodes.focus();
}

function showEnvelopeConfirm(pending) {
  if (!jobsState.envelopeSubject || pending.subjectId !== jobsState.envelopeSubject.id) {
    return;
  }

  jobsState.envelopePending = pending;
  envelopeConfirmMessage.textContent = `Another envelope was scanned. Attach ${pending.filename} to ref ${jobsState.envelopeSubject.ref || ''}?`;
  envelopeConfirmModal.hidden = false;
  confirmEnvelopeButton.focus();
}

async function respondEnvelopeConfirm(accept) {
  if (!jobsState.envelopePending) {
    envelopeConfirmModal.hidden = true;
    return;
  }

  confirmEnvelopeButton.disabled = true;
  cancelEnvelopeConfirmButton.disabled = true;
  try {
    const result = await trecsApi('confirmEnvelopeScan').confirmEnvelopeScan(accept);
    envelopeConfirmModal.hidden = true;
    jobsState.envelopePending = null;
    if (accept && result.scan) {
      handleEnvelopeScanImported({ scan: result.scan });
    } else {
      envelopeEntryForm.elements.barcode.focus();
      envelopeEntryForm.elements.barcode.select();
    }
  } catch (error) {
    envelopeConfirmMessage.textContent = error.message || 'Could not confirm envelope';
    console.error(error);
  } finally {
    confirmEnvelopeButton.disabled = false;
    cancelEnvelopeConfirmButton.disabled = false;
  }
}

async function submitEnvelopeOrder(event) {
  event.preventDefault();
  if (!jobsState.selectedJobId) {
    return;
  }
  if (!jobsState.envelopeSubject) {
    await lookupEnvelopeSubject();
  }
  if (!jobsState.envelopeSubject) {
    return;
  }

  const orderInput = envelopeEntryForm.elements.orderCodes;
  orderInput.disabled = true;
  envelopeEntryStatus.textContent = '';

  try {
    const result = await trecsApi('createEnvelopeOrder').createEnvelopeOrder(
      jobsState.selectedJobId,
      jobsState.envelopeSubject.id,
      {
        envelopeScanId: jobsState.envelopeScan ? jobsState.envelopeScan.id : null,
        orderCodes: envelopeEntryForm.elements.orderCodes.value,
        paidStatus: envelopeEntryForm.elements.paidStatus.value,
        notes: envelopeEntryForm.elements.notes.value
      }
    );
    envelopeEntryStatus.textContent = `Created order #${result.orderId}`;
    jobsState.selectedOrderId = result.orderId;
    envelopeEntryForm.elements.orderCodes.value = '';
    envelopeEntryForm.elements.notes.value = '';
    await reloadCurrentJobDetail();
    jobsState.envelopeSubject = jobsState.detail.subjects.find((subject) => subject.id === result.subjectId) || jobsState.envelopeSubject;
    renderEnvelopeSubject();
    renderEnvelopePreview();
    envelopeEntryForm.elements.barcode.focus();
    envelopeEntryForm.elements.barcode.select();
  } catch (error) {
    envelopeEntryStatus.textContent = error.message || 'Order failed';
    console.error(error);
  } finally {
    orderInput.disabled = false;
  }
}

function adminItemLabel(type) {
  const labels = {
    delivery_envelope_cover: 'Delivery Envelope Cover',
    school_directory: 'School Directory',
    missing_photo_report: 'Missing Photo Report',
    sis_export: 'SIS Export',
    id_cards: 'ID Cards',
    sticker_prints: 'Sticker Prints',
    staff_picture_packages: 'Staff Picture Packages'
  };
  return labels[type] || formatType(type);
}

function shootStageLabel(stage) {
  return stage === 'makeup_day' ? 'Makeup Day' : 'Original Picture Day';
}

function adminItemHelp(type, stage) {
  const helps = {
    delivery_envelope_cover: 'Creates the delivery envelope cover summary for this stage.',
    school_directory: 'Exports a school directory using the selected sort/group option.',
    missing_photo_report: 'Lists students who still have no usable linked photo.',
    sis_export: 'Exports student data and linked image filenames for SIS import.',
    id_cards: stage === 'makeup_day'
      ? 'Creates the makeup-day ID card work list.'
      : 'Creates the original picture-day ID card work list.',
    sticker_prints: 'Creates the makeup-day sticker print work list.',
    staff_picture_packages: 'Creates the staff package work list.'
  };
  return helps[type] || '';
}

function adminOutputOptions() {
  return {
    stage: adminOptionsForm.elements.stage.value,
    sortBy: adminOptionsForm.elements.sortBy.value
  };
}

function applyAdminOptions(options) {
  jobsState.adminStage = options.stage;
  jobsState.adminSortBy = options.sortBy;
}

function renderDirectoryOptions(listNames) {
  const listOptions = listNames.length
    ? listNames.map((name) => `
      <option value="${escapeHtml(name)}" ${name === jobsState.directoryListName ? 'selected' : ''}>
        ${escapeHtml(name)}
      </option>
    `).join('')
    : '<option value="">No saved lists</option>';

  return `
    <section class="directory-options">
      <label>
        <span>Directory Type</span>
        <select data-directory-option="directoryType">
          <option value="mugbook" ${jobsState.directoryType === 'mugbook' ? 'selected' : ''}>Mugbook</option>
          <option value="library_book" ${jobsState.directoryType === 'library_book' ? 'selected' : ''}>Library Book</option>
        </select>
      </label>
      <label>
        <span>Students</span>
        <select data-directory-option="directorySource">
          <option value="all" ${jobsState.directorySource === 'all' ? 'selected' : ''}>All Students</option>
          <option value="list" ${jobsState.directorySource === 'list' ? 'selected' : ''}>Saved List</option>
        </select>
      </label>
      <label>
        <span>Saved List</span>
        <select data-directory-option="directoryListName" ${jobsState.directorySource !== 'list' || !listNames.length ? 'disabled' : ''}>
          ${listOptions}
        </select>
      </label>
      <label>
        <span>Sort Method</span>
        <select data-directory-option="directorySortMethod">
          <option value="alpha_grade" ${jobsState.directorySortMethod === 'alpha_grade' ? 'selected' : ''}>Alpha by Grade</option>
          <option value="alpha_homeroom" ${jobsState.directorySortMethod === 'alpha_homeroom' ? 'selected' : ''}>Alpha by Homeroom</option>
          <option value="alpha_school" ${jobsState.directorySortMethod === 'alpha_school' ? 'selected' : ''}>Alpha by School</option>
        </select>
      </label>
      <label>
        <span>School Year</span>
        <input data-directory-option="directorySchoolYear" value="${escapeHtml(jobsState.directorySchoolYear)}">
      </label>
      <label>
        <span>Contact Line</span>
        <input data-directory-option="directoryContactLine" value="${escapeHtml(jobsState.directoryContactLine)}">
      </label>
      <label class="checkbox-label">
        <input data-directory-option="directoryPhotographedOnly" type="checkbox" ${jobsState.directoryPhotographedOnly ? 'checked' : ''}>
        <span>Photographed Only</span>
      </label>
    </section>
  `;
}

function bindDirectoryOptions() {
  adminItemsList.querySelectorAll('[data-directory-option]').forEach((control) => {
    control.addEventListener('change', () => {
      const key = control.dataset.directoryOption;
      jobsState[key] = control.type === 'checkbox' ? control.checked : control.value;
      if (key === 'directorySource' && jobsState.directorySource !== 'list') {
        jobsState.directoryListName = '';
      }
      renderAdminItemsWorkspace();
    });
  });
}

function renderStickerOptions(listNames) {
  const listOptions = listNames.length
    ? listNames.map((name) => `
      <option value="${escapeHtml(name)}" ${name === jobsState.stickerListName ? 'selected' : ''}>
        ${escapeHtml(name)}
      </option>
    `).join('')
    : '<option value="">No saved lists</option>';

  return `
    <section class="sticker-options">
      <label>
        <span>Students</span>
        <select data-sticker-option="stickerSource">
          <option value="all" ${jobsState.stickerSource === 'all' ? 'selected' : ''}>All Students</option>
          <option value="list" ${jobsState.stickerSource === 'list' ? 'selected' : ''}>Saved List</option>
        </select>
      </label>
      <label>
        <span>Saved List</span>
        <select data-sticker-option="stickerListName" ${jobsState.stickerSource !== 'list' || !listNames.length ? 'disabled' : ''}>
          ${listOptions}
        </select>
      </label>
      <label>
        <span>Stickers Per Student</span>
        <input data-sticker-option="stickerCopies" type="number" min="1" max="50" value="${escapeHtml(jobsState.stickerCopies)}">
      </label>
      <label>
        <span>Sort</span>
        <select data-sticker-option="stickerSortMethod">
          <option value="alpha" ${jobsState.stickerSortMethod === 'alpha' ? 'selected' : ''}>Alpha</option>
          <option value="alpha_grade" ${jobsState.stickerSortMethod === 'alpha_grade' ? 'selected' : ''}>Alpha by Grade</option>
          <option value="alpha_teacher" ${jobsState.stickerSortMethod === 'alpha_teacher' ? 'selected' : ''}>Alpha by Teacher</option>
        </select>
      </label>
      <label class="checkbox-label">
        <input data-sticker-option="stickerPhotographedOnly" type="checkbox" ${jobsState.stickerPhotographedOnly ? 'checked' : ''}>
        <span>Photographed Only</span>
      </label>
    </section>
  `;
}

function bindStickerOptions() {
  adminItemsList.querySelectorAll('[data-sticker-option]').forEach((control) => {
    control.addEventListener('change', () => {
      const key = control.dataset.stickerOption;
      if (control.type === 'checkbox') {
        jobsState[key] = control.checked;
      } else if (control.type === 'number') {
        jobsState[key] = Number(control.value);
      } else {
        jobsState[key] = control.value;
      }
      if (key === 'stickerSource' && jobsState.stickerSource !== 'list') {
        jobsState.stickerListName = '';
      }
      renderAdminItemsWorkspace();
    });
  });
}

function renderSisOptions() {
  return `
    <section class="sis-options">
      <label class="checkbox-label">
        <input data-sis-option="sisStudentCd" type="checkbox" ${jobsState.sisStudentCd ? 'checked' : ''}>
        <span>Student CD</span>
      </label>
      <label class="checkbox-label">
        <input data-sis-option="sisDestiny" type="checkbox" ${jobsState.sisDestiny ? 'checked' : ''}>
        <span>Destiny</span>
      </label>
      <label class="checkbox-label">
        <input data-sis-option="sisPowerSchool" type="checkbox" ${jobsState.sisPowerSchool ? 'checked' : ''}>
        <span>PowerSchool</span>
      </label>
      <label class="checkbox-label">
        <input data-sis-option="sisSasi" type="checkbox" ${jobsState.sisSasi ? 'checked' : ''}>
        <span>SASI</span>
      </label>
    </section>
  `;
}

function bindSisOptions() {
  adminItemsList.querySelectorAll('[data-sis-option]').forEach((control) => {
    control.addEventListener('change', () => {
      jobsState[control.dataset.sisOption] = control.checked;
      if (!selectedSisFormats(false).length) {
        jobsState[control.dataset.sisOption] = true;
      }
      renderAdminItemsWorkspace();
    });
  });
}

function renderIdCardOptions(listNames) {
  const listOptions = listNames.length
    ? listNames.map((name) => `
      <option value="${escapeHtml(name)}" ${name === jobsState.idCardListName ? 'selected' : ''}>
        ${escapeHtml(name)}
      </option>
    `).join('')
    : '<option value="">No saved lists</option>';

  return `
    <section class="id-card-options">
      <label>
        <span>Students</span>
        <select data-id-card-option="idCardSource">
          <option value="all" ${jobsState.idCardSource === 'all' ? 'selected' : ''}>All Students</option>
          <option value="list" ${jobsState.idCardSource === 'list' ? 'selected' : ''}>Saved List</option>
        </select>
      </label>
      <label>
        <span>Saved List</span>
        <select data-id-card-option="idCardListName" ${jobsState.idCardSource !== 'list' || !listNames.length ? 'disabled' : ''}>
          ${listOptions}
        </select>
      </label>
      <label>
        <span>Layout</span>
        <select data-id-card-option="idCardLayout">
          <option value="standard" ${jobsState.idCardLayout === 'standard' ? 'selected' : ''}>Standard Student</option>
          <option value="staff" ${jobsState.idCardLayout === 'staff' ? 'selected' : ''}>Staff</option>
          <option value="temporary" ${jobsState.idCardLayout === 'temporary' ? 'selected' : ''}>Temporary</option>
        </select>
      </label>
      <label>
        <span>Reason</span>
        <select data-id-card-option="idCardReason">
          <option value="admin_batch" ${jobsState.idCardReason === 'admin_batch' ? 'selected' : ''}>Admin Batch</option>
          <option value="makeup_day" ${jobsState.idCardReason === 'makeup_day' ? 'selected' : ''}>Makeup Day</option>
          <option value="replacement_request" ${jobsState.idCardReason === 'replacement_request' ? 'selected' : ''}>Replacement Request</option>
          <option value="school_request" ${jobsState.idCardReason === 'school_request' ? 'selected' : ''}>School Request</option>
        </select>
      </label>
      <label class="checkbox-label">
        <input data-id-card-option="idCardPhotographedOnly" type="checkbox" ${jobsState.idCardPhotographedOnly ? 'checked' : ''}>
        <span>Photographed Only</span>
      </label>
    </section>
  `;
}

function bindIdCardOptions() {
  adminItemsList.querySelectorAll('[data-id-card-option]').forEach((control) => {
    control.addEventListener('change', () => {
      const key = control.dataset.idCardOption;
      jobsState[key] = control.type === 'checkbox' ? control.checked : control.value;
      if (key === 'idCardSource' && jobsState.idCardSource !== 'list') {
        jobsState.idCardListName = '';
      }
      renderAdminItemsWorkspace();
    });
  });
}

function selectedSisFormats(useFallback = true) {
  const formats = [];
  if (jobsState.sisStudentCd) {
    formats.push('student_cd');
  }
  if (jobsState.sisDestiny) {
    formats.push('destiny');
  }
  if (jobsState.sisPowerSchool) {
    formats.push('powerschool');
  }
  if (jobsState.sisSasi) {
    formats.push('sasi');
  }
  return formats.length || !useFallback ? formats : ['student_cd'];
}

async function loadAdminItems() {
  if (!jobsState.selectedJobId) {
    return;
  }

  adminItemsStatus.textContent = 'Loading...';
  const options = adminOutputOptions();
  applyAdminOptions(options);

  try {
    jobsState.adminItems = await trecsApi('getAdminItems').getAdminItems(jobsState.selectedJobId, jobsState.adminStage);
    adminItemsStatus.textContent = shootStageLabel(jobsState.adminStage);
    renderAdminItemsWorkspace();
  } catch (error) {
    adminItemsStatus.textContent = 'Load failed';
    adminItemsList.innerHTML = `<div class="empty-state">${escapeHtml(error.message || 'Could not load admin items.')}</div>`;
    console.error(error);
  }
}

function renderAdminItemsWorkspace() {
  if (jobsState.workspaceMode !== 'admin') {
    return;
  }

  adminOptionsForm.elements.stage.value = jobsState.adminStage;
  adminOptionsForm.elements.sortBy.value = jobsState.adminSortBy;

  if (!jobsState.adminItems || jobsState.adminItems.stage !== jobsState.adminStage) {
    loadAdminItems();
    return;
  }

  const data = jobsState.adminItems;
  const metrics = data.metrics || {};
  const listNames = data.listNames || [];
  if (jobsState.directoryListName && !listNames.includes(jobsState.directoryListName)) {
    jobsState.directoryListName = '';
  }
  adminItemsStatus.textContent = shootStageLabel(data.stage);
  adminItemsList.innerHTML = `
    <section class="admin-metrics">
      <article><span>Subjects</span><strong>${formatNumber(metrics.subjects || 0)}</strong></article>
      <article><span>Photographed</span><strong>${formatNumber(metrics.photographed || 0)}</strong></article>
      <article><span>Missing</span><strong>${formatNumber(metrics.missing || 0)}</strong></article>
      <article><span>Staff</span><strong>${formatNumber(metrics.staff || 0)}</strong></article>
    </section>
    <div class="admin-item-cards">
      ${(data.items || []).map((item) => `
        <article class="admin-item-card ${jobsState.expandedAdminItem === item.type ? 'expanded' : ''}">
          <div>
            <h3>${escapeHtml(item.label)}</h3>
            <p>${escapeHtml(adminItemHelp(item.type, data.stage))}</p>
          </div>
          <div class="admin-item-actions">
            ${item.type === 'school_directory' ? '<button type="button" data-toggle-admin-item="school_directory">Options</button>' : ''}
            ${item.type === 'sis_export' ? '<button type="button" data-toggle-admin-item="sis_export">Options</button>' : ''}
            ${item.type === 'id_cards' ? '<button type="button" data-toggle-admin-item="id_cards">Options</button>' : ''}
            ${item.type === 'sticker_prints' ? '<button type="button" data-toggle-admin-item="sticker_prints">Options</button>' : ''}
            <button class="primary" type="button" data-render-admin-item="${item.type}">Render</button>
          </div>
          ${item.type === 'school_directory' && jobsState.expandedAdminItem === 'school_directory'
            ? renderDirectoryOptions(listNames)
            : ''}
          ${item.type === 'sticker_prints' && jobsState.expandedAdminItem === 'sticker_prints'
            ? renderStickerOptions(listNames)
            : ''}
          ${item.type === 'sis_export' && jobsState.expandedAdminItem === 'sis_export'
            ? renderSisOptions()
            : ''}
          ${item.type === 'id_cards' && jobsState.expandedAdminItem === 'id_cards'
            ? renderIdCardOptions(listNames)
            : ''}
        </article>
      `).join('')}
    </div>
  `;

  const batches = data.batches || [];
  adminItemsHistoryCount.textContent = `${formatNumber(batches.length)} shown`;
  adminItemsHistory.innerHTML = batches.length
    ? batches.map((batch) => `
      <div class="history-row">
        <span>${escapeHtml(shootStageLabel(batch.shootStage))} / ${escapeHtml(adminItemLabel(batch.adminItemType))}</span>
        <strong>${escapeHtml(batch.outputPath || '')}</strong>
        <em>${escapeHtml(batch.status)}${batch.completedAt ? ` / ${escapeHtml(batch.completedAt)}` : ''}</em>
      </div>
    `).join('')
    : '<div class="empty-state">No admin outputs yet.</div>';

  adminItemsList.querySelectorAll('[data-render-admin-item]').forEach((button) => {
    button.addEventListener('click', () => renderAdminItem(button));
  });

  adminItemsList.querySelectorAll('[data-toggle-admin-item]').forEach((button) => {
    button.addEventListener('click', () => {
      jobsState.expandedAdminItem = jobsState.expandedAdminItem === button.dataset.toggleAdminItem
        ? null
        : button.dataset.toggleAdminItem;
      renderAdminItemsWorkspace();
    });
  });

  bindDirectoryOptions();
  bindSisOptions();
  bindIdCardOptions();
  bindStickerOptions();
}

async function renderAdminItem(button) {
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = 'Rendering...';
  adminItemsStatus.textContent = 'Rendering...';

  try {
    await trecsApi('renderAdminItem').renderAdminItem(jobsState.selectedJobId, {
      type: button.dataset.renderAdminItem,
      stage: jobsState.adminStage,
      sortBy: jobsState.adminSortBy,
      sisFormats: selectedSisFormats(),
      idCardSource: jobsState.idCardSource,
      idCardListName: jobsState.idCardListName,
      idCardLayout: jobsState.idCardLayout,
      idCardReason: jobsState.idCardReason,
      idCardPhotographedOnly: jobsState.idCardPhotographedOnly,
      directoryType: jobsState.directoryType,
      directorySource: jobsState.directorySource,
      directoryListName: jobsState.directoryListName,
      directorySortMethod: jobsState.directorySortMethod,
      directorySchoolYear: jobsState.directorySchoolYear,
      directoryContactLine: jobsState.directoryContactLine,
      directoryPhotographedOnly: jobsState.directoryPhotographedOnly,
      stickerSource: jobsState.stickerSource,
      stickerListName: jobsState.stickerListName,
      stickerCopies: jobsState.stickerCopies,
      stickerSortMethod: jobsState.stickerSortMethod,
      stickerPhotographedOnly: jobsState.stickerPhotographedOnly
    });
    jobsState.adminItems = null;
    await loadAdminItems();
  } catch (error) {
    adminItemsStatus.textContent = error.message || 'Render failed';
    console.error(error);
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

function updateWorkspaceNavButtons() {
  const subjects = workspaceSubjects();
  workspacePreviousButton.disabled = subjects.length < 2;
  workspaceNextButton.disabled = subjects.length < 2;
}

function bindJobSortHeaders() {
  document.querySelectorAll('[data-job-sort]').forEach((button) => {
    const key = button.dataset.jobSort;
    button.classList.toggle('active', jobsState.sortKey === key);
    button.classList.toggle('sort-asc', jobsState.sortKey === key && jobsState.sortDirection === 'asc');
    button.classList.toggle('sort-desc', jobsState.sortKey === key && jobsState.sortDirection === 'desc');
    button.setAttribute(
      'aria-sort',
      jobsState.sortKey === key
        ? (jobsState.sortDirection === 'asc' ? 'ascending' : 'descending')
        : 'none'
    );
    button.textContent = `${sortLabel(key)}${sortIndicator(key)}`;

    button.onclick = () => {
      if (jobsState.sortKey === key) {
        jobsState.sortDirection = jobsState.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        jobsState.sortKey = key;
        jobsState.sortDirection = 'asc';
      }
      renderJobsScreen();
    };
  });
}

function renderNewSchoolForm() {
  if (!newSchoolPanel) {
    return;
  }

  newSchoolPanel.hidden = jobsState.jobWorkspaceOpen || !jobsState.showNewSchoolForm;
}

function setNewSchoolFormVisible(visible) {
  jobsState.showNewSchoolForm = visible;
  if (visible) {
    jobsState.showNewJobForm = false;
    jobsState.showImportPreviousJobForm = false;
  }
  if (newSchoolStatus) {
    newSchoolStatus.textContent = '';
  }
  renderNewSchoolForm();
  renderNewJobForm();
  renderImportPreviousJobForm();
}

function populateJobSetupOptions(form) {
  if (!form) {
    return;
  }

  const clientSelect = form.elements.clientId;
  const packageSelect = form.elements.packagePlanId;
  const currentClientId = clientSelect.value;
  const currentPackagePlanId = packageSelect.value;

  clientSelect.innerHTML = jobsState.clients
    .length
    ? jobsState.clients
      .map((client) => `
        <option value="${client.id}">
          ${escapeHtml(client.trecsName || client.displayName)}
        </option>
      `)
      .join('')
    : '<option value="">Add a school first</option>';

  packageSelect.innerHTML = `
    <option value="">No package plan</option>
    ${jobsState.packagePlans
      .map((plan) => `
        <option value="${plan.id}">
          ${escapeHtml(plan.name)}${plan.version > 1 ? ` v${plan.version}` : ''}
        </option>
      `)
      .join('')}
  `;

  if (currentClientId && jobsState.clients.some((client) => String(client.id) === currentClientId)) {
    clientSelect.value = currentClientId;
  } else if (jobsState.selectedNewClientId) {
    clientSelect.value = String(jobsState.selectedNewClientId);
  }
  if (currentPackagePlanId && jobsState.packagePlans.some((plan) => String(plan.id) === currentPackagePlanId)) {
    packageSelect.value = currentPackagePlanId;
  }
}

function renderNewJobForm() {
  if (!newJobPanel || !newJobForm) {
    return;
  }

  newJobPanel.hidden = jobsState.jobWorkspaceOpen || !jobsState.showNewJobForm;
  if (!jobsState.showNewJobForm) {
    return;
  }

  populateJobSetupOptions(newJobForm);
}

function setNewJobFormVisible(visible) {
  jobsState.showNewJobForm = visible;
  if (visible) {
    jobsState.showNewSchoolForm = false;
    jobsState.showImportPreviousJobForm = false;
  }
  if (newJobStatus) {
    newJobStatus.textContent = '';
  }
  renderNewSchoolForm();
  renderNewJobForm();
  renderImportPreviousJobForm();
}

function renderImportPreviousJobForm() {
  if (!importPreviousJobPanel || !importPreviousJobForm) {
    return;
  }

  importPreviousJobPanel.hidden = jobsState.jobWorkspaceOpen || !jobsState.showImportPreviousJobForm;
  if (!jobsState.showImportPreviousJobForm) {
    return;
  }

  populateJobSetupOptions(importPreviousJobForm);
}

function setImportPreviousJobFormVisible(visible) {
  jobsState.showImportPreviousJobForm = visible;
  if (visible) {
    jobsState.showNewSchoolForm = false;
    jobsState.showNewJobForm = false;
  }
  if (importPreviousJobStatus) {
    importPreviousJobStatus.textContent = '';
  }
  renderNewSchoolForm();
  renderNewJobForm();
  renderImportPreviousJobForm();
}

function resetNewJobForm() {
  newJobForm.reset();
  if (jobsState.selectedNewClientId) {
    newJobForm.elements.clientId.value = String(jobsState.selectedNewClientId);
  }
  const fallPlan = jobsState.packagePlans.find((plan) => /fall/i.test(plan.name));
  if (fallPlan) {
    newJobForm.elements.packagePlanId.value = String(fallPlan.id);
  }
}

function resetImportPreviousJobForm() {
  importPreviousJobForm.reset();
  if (jobsState.selectedNewClientId) {
    importPreviousJobForm.elements.clientId.value = String(jobsState.selectedNewClientId);
  }
  const fallPlan = jobsState.packagePlans.find((plan) => /fall/i.test(plan.name));
  if (fallPlan) {
    importPreviousJobForm.elements.packagePlanId.value = String(fallPlan.id);
  }
}

function resetNewSchoolForm() {
  newSchoolForm.reset();
}

function renderJobDetail(job) {
  if (!job) {
    jobDetailPanel.innerHTML = `
      <div class="panel-heading">
        <h2>Job Detail</h2>
      </div>
      <div class="empty-state">Select a job</div>
    `;
    return;
  }

  const photographedPercent = job.subjects > 0
    ? Math.round((job.subjectsWithPrimaryImage / job.subjects) * 100)
    : 0;

  jobDetailPanel.innerHTML = `
    <div class="panel-heading">
      <h2>${job.job}</h2>
      <span class="status ready">${job.status}</span>
    </div>
    <div class="detail-body">
      <div class="detail-title">
        <strong>${job.location}</strong>
        <span>${formatType(job.type)} / ${job.packagePlan || 'No package plan'}</span>
      </div>
      <dl>
        <div>
          <dt>Subjects</dt>
          <dd>${formatNumber(job.subjects)}</dd>
        </div>
        <div>
          <dt>Primary Images</dt>
          <dd>${formatNumber(job.subjectsWithPrimaryImage)} (${photographedPercent}%)</dd>
        </div>
        <div>
          <dt>Orders</dt>
          <dd>${formatNumber(job.orders)}</dd>
        </div>
        <div>
          <dt>Order Items</dt>
          <dd>${formatNumber(job.orderItems)}</dd>
        </div>
        <div>
          <dt>Image Assets</dt>
          <dd>${formatNumber(job.images)}</dd>
        </div>
        <div>
          <dt>Subject Image Links</dt>
          <dd>${formatNumber(job.subjectImages)}</dd>
        </div>
      </dl>
      <div class="path-box">${job.rootPath}</div>
      <div class="package-actions">
        <button data-import-school-data="${job.id}">Import School Data</button>
        <button class="primary" data-prepare-laptop-package="${job.id}">Prepare Onsite Setup</button>
        <button data-end-of-day-package="${job.id}">Make End of Day</button>
        <span data-laptop-package-status>
          ${renderLaptopPackageStatus(job.id)}
        </span>
        <span data-end-of-day-status>
          ${renderEndOfDayStatus(job.id)}
        </span>
      </div>
    </div>
  `;

  bindJobDetailActions();
}

function renderLaptopPackageStatus(jobId) {
  const laptopPackage = jobsState.lastLaptopPackage;
  if (!laptopPackage || laptopPackage.jobId !== jobId) {
    return '';
  }

  if (laptopPackage.status === 'working') {
    return 'Creating onsite setup...';
  }

  if (laptopPackage.status === 'error') {
    return laptopPackage.message || 'Package failed';
  }

  return `Created onsite setup with ${laptopPackage.subjects} subjects at ${laptopPackage.packagePath}`;
}

function renderEndOfDayStatus(jobId) {
  const endOfDay = jobsState.lastEndOfDayPackage;
  if (!endOfDay || endOfDay.jobId !== jobId) {
    return '';
  }

  if (endOfDay.status === 'working') {
    return 'Creating end of day...';
  }

  if (endOfDay.status === 'error') {
    return endOfDay.message || 'End of day failed';
  }

  return `Created end of day with ${endOfDay.capturedImages} captured images at ${endOfDay.packagePath}`;
}

function bindJobDetailActions() {
  const importSchoolDataButton = jobDetailPanel.querySelector('[data-import-school-data]');
  if (importSchoolDataButton) {
    importSchoolDataButton.addEventListener('click', () => {
      openSchoolDataImport(Number(importSchoolDataButton.dataset.importSchoolData));
    });
  }

  const button = jobDetailPanel.querySelector('[data-prepare-laptop-package]');
  if (button) {
    button.addEventListener('click', async () => {
      const jobId = Number(button.dataset.prepareLaptopPackage);
      const status = jobDetailPanel.querySelector('[data-laptop-package-status]');
      const originalText = button.textContent;

      button.disabled = true;
      button.textContent = 'Preparing...';
      jobsState.lastLaptopPackage = { jobId, status: 'working' };
      if (status) {
        status.textContent = renderLaptopPackageStatus(jobId);
      }

      try {
        const result = await trecsApi('prepareLaptopPackage').prepareLaptopPackage(jobId);
        jobsState.lastLaptopPackage = {
          jobId,
          status: 'done',
          packagePath: result.packagePath,
          subjects: result.counts.subjects
        };
        if (status) {
          status.textContent = renderLaptopPackageStatus(jobId);
        }
      } catch (error) {
        jobsState.lastLaptopPackage = {
          jobId,
          status: 'error',
          message: error.message || 'Package failed'
        };
        if (status) {
          status.textContent = renderLaptopPackageStatus(jobId);
        }
        console.error(error);
      } finally {
        button.disabled = false;
        button.textContent = originalText;
      }
    });
  }

  const endOfDayButton = jobDetailPanel.querySelector('[data-end-of-day-package]');
  if (!endOfDayButton) {
    return;
  }

  endOfDayButton.addEventListener('click', async () => {
    const jobId = Number(endOfDayButton.dataset.endOfDayPackage);
    const status = jobDetailPanel.querySelector('[data-end-of-day-status]');
    const originalText = endOfDayButton.textContent;

    try {
      endOfDayButton.disabled = true;
      endOfDayButton.textContent = 'Reviewing...';
      await openEndOfDayReview(jobId);
    } catch (error) {
      jobsState.lastEndOfDayPackage = {
        jobId,
        status: 'error',
        message: error.message || 'End of day review failed'
      };
      if (status) {
        status.textContent = renderEndOfDayStatus(jobId);
      }
      console.error(error);
    } finally {
      endOfDayButton.disabled = false;
      endOfDayButton.textContent = originalText;
    }
  });
}

function renderWorkflowTab() {
  jobWorkflowTabs.querySelectorAll('button').forEach((button) => {
    button.classList.toggle('active', button.dataset.jobTab === jobsState.selectedTab);
  });

  if (!jobsState.detail) {
    jobWorkflowContent.innerHTML = '<div class="empty-state">Loading job workflow data...</div>';
    return;
  }

  if (jobsState.selectedTab === 'subjects') {
    renderSubjectsTab(jobsState.detail.subjects);
  } else if (jobsState.selectedTab === 'orders') {
    renderOrdersTab(jobsState.detail.orders);
  } else if (jobsState.selectedTab === 'capture') {
    renderCaptureTab(jobsState.detail.capture);
  } else if (jobsState.selectedTab === 'images') {
    renderImagesTab(jobsState.detail.images);
  } else {
    renderProductsTab(jobsState.detail.products);
  }
}

function tableHtml(headers, rows, emptyText) {
  if (!rows.length) {
    return `<div class="empty-state">${emptyText}</div>`;
  }

  return `
    <table>
      <thead>
        <tr>${headers.map((header) => `<th>${header}</th>`).join('')}</tr>
      </thead>
      <tbody>${rows.join('')}</tbody>
    </table>
  `;
}

function findById(rows, id) {
  return rows.find((row) => row.id === id) || null;
}

function rowsFor(rows, field, id) {
  return rows.filter((row) => row[field] === id);
}

function textIncludes(row, fields, search) {
  const term = String(search || '').trim().toLowerCase();
  if (!term) {
    return true;
  }

  return fields.some((field) => String(row[field] || '').toLowerCase().includes(term));
}

function formatMoney(value) {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  return `$${Number(value).toFixed(2)}`;
}

function formatStatusLabel(status) {
  return String(status || '')
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderSubjectsTab(subjects) {
  if (!subjects.length) {
    jobWorkflowContent.innerHTML = '<div class="empty-state">No subjects found.</div>';
    return;
  }

  const filteredSubjects = subjects.filter((subject) => textIncludes(
    subject,
    ['ref', 'name', 'externalId', 'grade', 'homeroom', 'track', 'team', 'photographedStatus'],
    jobsState.subjectSearch
  ));

  if (!filteredSubjects.length) {
    jobsState.selectedSubjectId = null;
  } else if (!jobsState.selectedSubjectId || !filteredSubjects.some((subject) => subject.id === jobsState.selectedSubjectId)) {
    jobsState.selectedSubjectId = filteredSubjects[0].id;
  }

  const selectedSubject = findById(subjects, jobsState.selectedSubjectId);
  jobWorkflowContent.innerHTML = `
    <div class="queue-toolbar">
      <label class="inline-search">
        <span>Subject Search</span>
        <input data-subject-search type="search" value="${escapeHtml(jobsState.subjectSearch)}" placeholder="Ref, name, ID, grade, homeroom">
      </label>
      <span>${formatNumber(filteredSubjects.length)} shown</span>
    </div>
    <div class="detail-browser">
      <div class="detail-list">
        ${tableHtml(
          ['Ref', 'Name', 'ID', 'Grade', 'Homeroom', 'Photo', 'Image'],
          filteredSubjects.map((subject) => `
            <tr class="${subject.id === jobsState.selectedSubjectId ? 'selected-row' : ''}" data-subject-id="${subject.id}">
              <td>${subject.ref || ''}</td>
              <td>${subject.name || ''}</td>
              <td>${subject.externalId || ''}</td>
              <td>${subject.grade || ''}</td>
              <td>${subject.homeroom || ''}</td>
              <td>${subject.photographedStatus || ''}</td>
              <td>${subject.imagePath ? 'Linked' : ''}</td>
            </tr>
          `),
          'No subjects found.'
        )}
      </div>
      <aside class="record-detail">
        ${renderSubjectDetail(selectedSubject)}
      </aside>
    </div>
  `;

  const subjectSearch = jobWorkflowContent.querySelector('[data-subject-search]');
  subjectSearch.addEventListener('input', () => {
    jobsState.subjectSearch = subjectSearch.value;
    renderSubjectsTab(subjects);
  });

  jobWorkflowContent.querySelectorAll('[data-subject-id]').forEach((row) => {
    row.addEventListener('click', () => {
      jobsState.selectedSubjectId = Number(row.dataset.subjectId);
      renderSubjectsTab(subjects);
    });
  });

  const imageButton = jobWorkflowContent.querySelector('[data-open-subject-image]');
  if (imageButton) {
    imageButton.addEventListener('click', () => {
      jobsState.selectedTab = 'images';
      jobsState.selectedImageId = Number(imageButton.dataset.openSubjectImage);
      renderWorkflowTab();
    });
  }

  bindNoteForms();
  bindImageLinkActions();
}

function renderOrdersTab(orders) {
  if (!orders.length) {
    jobWorkflowContent.innerHTML = '<div class="empty-state">No orders found.</div>';
    return;
  }

  const filteredOrders = filteredOrdersForQueue(orders);
  if (!filteredOrders.length) {
    jobsState.selectedOrderId = null;
  } else if (!jobsState.selectedOrderId || !filteredOrders.some((order) => order.id === jobsState.selectedOrderId)) {
    jobsState.selectedOrderId = filteredOrders[0].id;
  }

  const selectedOrder = findById(orders, jobsState.selectedOrderId);
  jobWorkflowContent.innerHTML = `
    <div class="queue-toolbar">
      <div class="segmented compact" id="orderRenderFilters">
        ${renderOrderQueueFilters(orders)}
      </div>
      <span>${formatNumber(filteredOrders.length)} shown</span>
    </div>
    <div class="detail-browser">
      <div class="detail-list">
        ${tableHtml(
          ['Order', 'Source', 'Reference', 'Subject', 'Paid', 'Production', 'Items', 'Codes'],
          filteredOrders.map((order) => `
            <tr class="${order.id === jobsState.selectedOrderId ? 'selected-row' : ''}" data-order-id="${order.id}">
              <td>${order.id}</td>
              <td>${order.source}</td>
              <td>${order.sourceReference || ''}</td>
              <td>${order.ref || ''} ${order.subjectName || ''}</td>
              <td>${order.paidStatus}</td>
              <td><span class="status ${statusClass(order.productionStatus)}">${formatStatusLabel(order.productionStatus)}</span></td>
              <td>${formatNumber(order.itemCount)}</td>
              <td>${order.packageCodes || ''}</td>
            </tr>
          `),
          'No orders match this queue filter.'
        )}
      </div>
      <aside class="record-detail wide">
        ${renderOrderDetail(selectedOrder)}
      </aside>
    </div>
  `;

  jobWorkflowContent.querySelectorAll('[data-order-render-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      jobsState.orderRenderFilter = button.dataset.orderRenderFilter;
      jobsState.selectedOrderId = null;
      renderOrdersTab(orders);
    });
  });

  jobWorkflowContent.querySelectorAll('[data-order-id]').forEach((row) => {
    row.addEventListener('click', () => {
      jobsState.selectedOrderId = Number(row.dataset.orderId);
      renderOrdersTab(orders);
    });
  });

  const subjectButton = jobWorkflowContent.querySelector('[data-open-order-subject]');
  if (subjectButton) {
    subjectButton.addEventListener('click', () => {
      jobsState.selectedTab = 'subjects';
      jobsState.selectedSubjectId = Number(subjectButton.dataset.openOrderSubject);
      renderWorkflowTab();
    });
  }

  jobWorkflowContent.querySelectorAll('[data-open-order-image]').forEach((button) => {
    button.addEventListener('click', () => {
      jobsState.selectedTab = 'images';
      jobsState.selectedImageId = Number(button.dataset.openOrderImage);
      renderWorkflowTab();
    });
  });

  bindNoteForms();
  bindOrderStatusActions();
}

function filteredOrdersForQueue(orders) {
  if (jobsState.orderRenderFilter === 'all') {
    return orders;
  }

  return orders.filter((order) => order.productionStatus === jobsState.orderRenderFilter);
}

function renderOrderQueueFilters(orders) {
  const filters = [
    { status: 'all', label: 'All', count: orders.length },
    ...['ready', 'not_ready', 'queued', 'rendered', 'held', 'failed'].map((status) => ({
      status,
      label: formatStatusLabel(status),
      count: orders.filter((order) => order.productionStatus === status).length
    }))
  ];

  return filters
    .map((filter) => `
      <button class="${jobsState.orderRenderFilter === filter.status ? 'active' : ''}" data-order-render-filter="${filter.status}">
        ${filter.label} <span>${filter.count}</span>
      </button>
    `)
    .join('');
}

function statusClass(status) {
  if (status === 'ready' || status === 'rendered') {
    return 'ready';
  }
  if (status === 'failed') {
    return 'error';
  }
  return 'review';
}

function renderSubjectDetail(subject) {
  if (!subject) {
    return '<div class="empty-state">Select a subject.</div>';
  }

  const codes = rowsFor(jobsState.detail.subjectCodes || [], 'subjectId', subject.id);
  const orders = rowsFor(jobsState.detail.subjectOrders || [], 'subjectId', subject.id);
  const images = rowsFor(jobsState.detail.subjectImages || [], 'subjectId', subject.id);

  return `
    <div class="record-heading">
      <div>
        <span>Subject</span>
        <strong>${subject.name || 'Unnamed subject'}</strong>
      </div>
      <span class="status ${subject.imageAssetId ? 'ready' : 'review'}">${subject.imageAssetId ? 'Photo linked' : 'No photo'}</span>
    </div>
    <dl class="compact-dl">
      <div>
        <dt>Reference</dt>
        <dd>${subject.ref || ''}</dd>
      </div>
      <div>
        <dt>Student ID</dt>
        <dd>${subject.externalId || ''}</dd>
      </div>
      <div>
        <dt>Grade / Homeroom</dt>
        <dd>${subject.grade || ''}${subject.homeroom ? ` / ${subject.homeroom}` : ''}</dd>
      </div>
      <div>
        <dt>Track / Team</dt>
        <dd>${subject.track || ''}${subject.team ? ` / ${subject.team}` : ''}</dd>
      </div>
      <div>
        <dt>Photographed</dt>
        <dd>${subject.photographedStatus || ''}</dd>
      </div>
      <div>
        <dt>Primary Image</dt>
        <dd>${subject.imageFilename || ''}</dd>
      </div>
    </dl>
    <form class="notes-form" data-note-form="subject" data-note-id="${subject.id}">
      <label>
        <span>Notes</span>
        <textarea name="notes" rows="5">${escapeHtml(subject.notes)}</textarea>
      </label>
      <div class="form-actions">
        <span data-note-status></span>
        <button type="submit">Save Notes</button>
      </div>
    </form>
    ${subject.imageAssetId ? `<button class="detail-action" data-open-subject-image="${subject.imageAssetId}">Open Image</button>` : ''}
    ${renderMiniSection(
      'Codes',
      codes.map((code) => `<div><span>${code.codeType}</span><strong>${code.code}</strong></div>`),
      'No codes.'
    )}
    ${renderMiniSection(
      'Orders',
      orders.map((order) => `<div><span>#${order.id} ${order.source}</span><strong>${order.packageCodes || ''}</strong></div>`),
      'No orders.'
    )}
    ${renderMiniSection(
      'Linked Images',
      images.map((image) => `
        <div>
          <span>${image.role}${image.selected ? ' / selected' : ''}</span>
          <strong>${image.filename}</strong>
          <button data-link-subject-id="${subject.id}" data-link-image-id="${image.imageAssetId}">Set Primary</button>
        </div>
      `),
      'No linked images.'
    )}
  `;
}

function renderOrderDetail(order) {
  if (!order) {
    return '<div class="empty-state">Select an order.</div>';
  }

  const items = rowsFor(jobsState.detail.orderItems || [], 'orderId', order.id);
  const payments = rowsFor(jobsState.detail.payments || [], 'orderId', order.id);

  return `
    <div class="record-heading">
      <div>
        <span>Order</span>
        <strong>#${order.id} ${order.sourceReference || ''}</strong>
      </div>
      <span class="status ${order.renderStatus === 'rendered' ? 'ready' : 'review'}">${order.renderStatus}</span>
    </div>
    <dl class="compact-dl">
      <div>
        <dt>Subject</dt>
        <dd>${order.ref || ''} ${order.subjectName || ''}</dd>
      </div>
      <div>
        <dt>Source / Timing</dt>
        <dd>${order.source || ''}${order.entryTiming ? ` / ${order.entryTiming}` : ''}</dd>
      </div>
      <div>
        <dt>Status</dt>
        <dd>${order.status || ''} / ${formatStatusLabel(order.productionStatus)}</dd>
      </div>
      <div>
        <dt>Paid</dt>
        <dd>${order.paidStatus || ''}</dd>
      </div>
      <div>
        <dt>Production Reason</dt>
        <dd>${order.productionReason || ''}</dd>
      </div>
      <div>
        <dt>Family Key</dt>
        <dd>${order.familyKey || ''}</dd>
      </div>
    </dl>
    <div class="record-actions" data-order-status-actions="${order.id}">
      <button data-order-status="queued">Queue</button>
      <button data-order-status="held">Hold</button>
      <button data-order-status="rendered">Rendered</button>
      <button data-order-status="not_ready">Reset</button>
      <span data-order-status-message></span>
    </div>
    <form class="notes-form" data-note-form="order" data-note-id="${order.id}">
      <label>
        <span>Notes</span>
        <textarea name="notes" rows="5">${escapeHtml(order.notes)}</textarea>
      </label>
      <div class="form-actions">
        <span data-note-status></span>
        <button type="submit">Save Notes</button>
      </div>
    </form>
    ${order.subjectId ? `<button class="detail-action" data-open-order-subject="${order.subjectId}">Open Subject</button>` : ''}
    <div class="mini-table">
      <div class="subheading">
        <h3>Items</h3>
        <span>${formatNumber(items.length)}</span>
      </div>
      ${tableHtml(
        ['Code', 'Product', 'Qty', 'Image'],
        items.map((item) => `
          <tr>
            <td>${item.packageCode || item.rawCode || ''}</td>
            <td>${item.productName || ''}</td>
            <td>${formatNumber(item.quantity)}</td>
            <td>${item.imageAssetId ? `<button data-open-order-image="${item.imageAssetId}">${item.imageFilename}</button>` : ''}</td>
          </tr>
        `),
        'No order items.'
      )}
    </div>
    ${renderMiniSection(
      'Payments',
      payments.map((payment) => `<div><span>${payment.method || 'Payment'} ${payment.status}</span><strong>${formatMoney(payment.amount)} ${payment.reference || ''}</strong></div>`),
      'No payments.'
    )}
  `;
}

function bindNoteForms(root = jobWorkflowContent) {
  root.querySelectorAll('[data-note-form]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const id = Number(form.dataset.noteId);
      const type = form.dataset.noteForm;
      const textarea = form.querySelector('textarea[name="notes"]');
      const button = form.querySelector('button[type="submit"]');
      const status = form.querySelector('[data-note-status]');
      const notes = textarea.value;

      button.disabled = true;
      status.textContent = 'Saving...';

      try {
        if (type === 'subject') {
          const result = await trecsApi('updateSubjectNotes').updateSubjectNotes(id, notes);
          const subject = findById(jobsState.detail.subjects, result.id);
          if (subject) {
            subject.notes = result.notes;
          }
          status.textContent = 'Saved';
        } else if (type === 'order') {
          const result = await trecsApi('updateOrderNotes').updateOrderNotes(id, notes);
          const order = findById(jobsState.detail.orders, result.id);
          if (order) {
            order.notes = result.notes;
          }
          status.textContent = 'Saved';
        }
      } catch (error) {
        status.textContent = 'Save failed';
        console.error(error);
      } finally {
        button.disabled = false;
      }
    });
  });
}

function bindOrderStatusActions() {
  jobWorkflowContent.querySelectorAll('[data-order-status-actions]').forEach((container) => {
    const orderId = Number(container.dataset.orderStatusActions);
    const message = container.querySelector('[data-order-status-message]');

    container.querySelectorAll('[data-order-status]').forEach((button) => {
      button.addEventListener('click', async () => {
        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = 'Saving...';
        message.textContent = '';

        try {
          const result = await trecsApi('updateOrderRenderStatus').updateOrderRenderStatus(orderId, button.dataset.orderStatus);
          jobsState.selectedOrderId = result.id;
          await reloadCurrentJobDetail();
        } catch (error) {
          message.textContent = error.message || 'Update failed';
          console.error(error);
        } finally {
          button.disabled = false;
          button.textContent = originalText;
        }
      });
    });
  });
}

function bindImageLinkActions() {
  jobWorkflowContent.querySelectorAll('[data-link-subject-id][data-link-image-id]').forEach((button) => {
    button.addEventListener('click', async () => {
      await saveSubjectImageLink(
        Number(button.dataset.linkSubjectId),
        Number(button.dataset.linkImageId),
        button
      );
    });
  });
}

async function saveSubjectImageLink(subjectId, imageId, control) {
  if (!subjectId || !imageId) {
    return;
  }

  const originalText = control ? control.textContent : '';
  if (control) {
    control.disabled = true;
    control.textContent = 'Saving...';
  }

  try {
    const result = await trecsApi('linkSubjectImage').linkSubjectImage(subjectId, imageId);
    jobsState.selectedSubjectId = result.subjectId;
    jobsState.selectedImageId = result.imageId;
    await reloadCurrentJobDetail();
  } catch (error) {
    if (control) {
      control.textContent = 'Failed';
    }
    console.error(error);
  } finally {
    if (control) {
      control.disabled = false;
      if (control.textContent === 'Saving...') {
        control.textContent = originalText;
      }
    }
  }
}

function renderMiniSection(label, rows, emptyText) {
  return `
    <section class="mini-section">
      <div class="subheading">
        <h3>${label}</h3>
        <span>${formatNumber(rows.length)}</span>
      </div>
      <div class="mini-list">
        ${rows.length ? rows.join('') : `<p>${emptyText}</p>`}
      </div>
    </section>
  `;
}

function renderImagesTab(images) {
  if (!images.length) {
    jobWorkflowContent.innerHTML = '<div class="empty-state">No images found.</div>';
    return;
  }

  const filteredImages = images.filter((image) => textIncludes(
    image,
    ['filename', 'source', 'status', 'versionTypes'],
    jobsState.imageSearch
  ));

  if (!filteredImages.length) {
    jobsState.selectedImageId = null;
  } else if (!jobsState.selectedImageId || !filteredImages.some((image) => image.id === jobsState.selectedImageId)) {
    jobsState.selectedImageId = filteredImages[0].id;
  }
  if (!jobsState.selectedImageSubjectId && jobsState.selectedSubjectId) {
    jobsState.selectedImageSubjectId = jobsState.selectedSubjectId;
  }
  if (!jobsState.selectedImageSubjectId && jobsState.detail.subjects.length) {
    jobsState.selectedImageSubjectId = jobsState.detail.subjects[0].id;
  }

  jobWorkflowContent.innerHTML = `
    <div class="queue-toolbar">
      <label class="inline-search">
        <span>Image Search</span>
        <input data-image-search type="search" value="${escapeHtml(jobsState.imageSearch)}" placeholder="Filename, source, status">
      </label>
      <span>${formatNumber(filteredImages.length)} shown</span>
    </div>
    <div class="image-browser">
      <div class="image-table">
        ${tableHtml(
          ['Filename', 'Source', 'Versions', 'Size', 'Types', 'Subjects'],
          filteredImages.map((image) => `
            <tr class="${image.id === jobsState.selectedImageId ? 'selected-row' : ''}" data-image-id="${image.id}">
              <td>${image.filename}</td>
              <td>${image.source}</td>
              <td>${formatNumber(image.versions)}</td>
              <td>${image.width || 0} x ${image.height || 0}</td>
              <td>${image.versionTypes || ''}</td>
              <td>${formatNumber(image.linkedSubjects)}</td>
            </tr>
          `),
          'No images found.'
        )}
      </div>
      <aside class="image-preview" id="imagePreviewPanel">
        <div class="empty-state">Loading preview...</div>
      </aside>
    </div>
  `;

  const imageSearch = jobWorkflowContent.querySelector('[data-image-search]');
  imageSearch.addEventListener('input', () => {
    jobsState.imageSearch = imageSearch.value;
    renderImagesTab(images);
  });

  jobWorkflowContent.querySelectorAll('[data-image-id]').forEach((row) => {
    row.addEventListener('click', () => {
      jobsState.selectedImageId = Number(row.dataset.imageId);
      renderImagesTab(images);
    });
  });

  loadImagePreview(jobsState.selectedImageId);
}

function renderCaptureTab(capture) {
  if (!capture || !capture.summary) {
    jobWorkflowContent.innerHTML = '<div class="empty-state">No capture planning data found.</div>';
    return;
  }

  const recentImages = capture.recentImages || [];
  const reviewCandidates = capture.reviewCandidates || [];
  if (!jobsState.selectedImageId || !recentImages.some((image) => image.id === jobsState.selectedImageId)) {
    jobsState.selectedImageId = recentImages.length ? recentImages[0].id : null;
  }

  const summary = capture.summary;
  const photographedPercent = summary.subjects > 0
    ? Math.round((summary.linkedSubjects / summary.subjects) * 100)
    : 0;

  jobWorkflowContent.innerHTML = `
    <div class="capture-planner">
      <section class="capture-metrics" aria-label="Capture planning metrics">
        <article>
          <span>No Photo</span>
          <strong>${formatNumber(summary.noPhotoSubjects)}</strong>
        </article>
        <article>
          <span>Photographed</span>
          <strong>${photographedPercent}%</strong>
        </article>
        <article>
          <span>Images</span>
          <strong>${formatNumber(summary.images)}</strong>
        </article>
        <article>
          <span>Unlinked</span>
          <strong>${formatNumber(summary.unlinkedImages)}</strong>
        </article>
        <article>
          <span>Ordered / No Photo</span>
          <strong>${formatNumber(summary.orderedNoPhotoSubjects)}</strong>
        </article>
      </section>

      <section class="capture-grid">
        <div class="capture-column">
          <div class="subheading">
            <h3>No-Photo Queue</h3>
            <span>${formatNumber(capture.noPhotoSubjects.length)} shown</span>
          </div>
          ${tableHtml(
            ['Ref', 'Name', 'Grade', 'Homeroom', 'Orders'],
            capture.noPhotoSubjects.map((subject) => `
              <tr>
                <td>${subject.ref || ''}</td>
                <td>${subject.name || ''}</td>
                <td>${subject.grade || ''}</td>
                <td>${subject.homeroom || ''}</td>
                <td>${formatNumber(subject.orders)}</td>
              </tr>
            `),
            'Every subject in this job has a primary image.'
          )}
        </div>

        <div class="capture-column">
          <div class="subheading">
            <h3>Recent Images</h3>
            <span>${formatNumber(recentImages.length)} shown</span>
          </div>
          ${tableHtml(
            ['Filename', 'Size', 'Links', 'Refs'],
            recentImages.map((image) => `
              <tr class="${image.id === jobsState.selectedImageId ? 'selected-row' : ''}" data-capture-image-id="${image.id}">
                <td>${image.filename}</td>
                <td>${image.width || 0} x ${image.height || 0}</td>
                <td>${formatNumber(image.linkedSubjects)}</td>
                <td>${image.refs || ''}</td>
              </tr>
            `),
            'No recent images found.'
          )}
        </div>

        <aside class="capture-preview" id="imagePreviewPanel">
          <div class="subheading">
            <h3>Selected Image</h3>
            <span>Read-only</span>
          </div>
          <div class="empty-state">Loading preview...</div>
        </aside>
      </section>

      <section class="capture-review">
        <div class="subheading">
          <h3>Review Candidates</h3>
          <span>${formatNumber(reviewCandidates.length)} shown</span>
        </div>
        ${tableHtml(
          ['Filename', 'Reason', 'Source', 'Size', 'Links'],
          reviewCandidates.map((image) => `
            <tr data-capture-image-id="${image.id}">
              <td>${image.filename}</td>
              <td>${image.reason}</td>
              <td>${image.source}</td>
              <td>${image.width || 0} x ${image.height || 0}</td>
              <td>${formatNumber(image.linkedSubjects)}</td>
            </tr>
          `),
          'No image review candidates found.'
        )}
      </section>
    </div>
  `;

  jobWorkflowContent.querySelectorAll('[data-capture-image-id]').forEach((row) => {
    row.addEventListener('click', () => {
      jobsState.selectedImageId = Number(row.dataset.captureImageId);
      renderCaptureTab(capture);
    });
  });

  loadImagePreview(jobsState.selectedImageId);
}

function renderProductsTab(products) {
  jobWorkflowContent.innerHTML = tableHtml(
    ['Code', 'Name', 'Items', 'Mapped', 'Raw Items'],
    products.map((product) => `
      <tr>
        <td>${product.code}</td>
        <td>${product.codeName || ''}</td>
        <td>${formatNumber(product.itemCount)}</td>
        <td>${formatNumber(product.mappedItems)}</td>
        <td class="wrap-cell">${product.rawItems || ''}</td>
      </tr>
    `),
    'No package plan found.'
  );
}

async function loadJobDetail(jobId) {
  jobWorkflowContent.innerHTML = '<div class="empty-state">Loading job workflow data...</div>';
  jobsState.detail = await trecsApi('getJobDetail').getJobDetail(jobId);
  jobsState.selectedImageId = null;
  jobsState.selectedImageSubjectId = null;
  jobsState.selectedSubjectId = null;
  jobsState.selectedOrderId = null;
  jobsState.subjectSearch = '';
  jobsState.imageSearch = '';
  jobsState.imageLinkSubjectSearch = '';
  jobsState.workspaceStudentSearch = '';
  jobsState.captureSubject = null;
  jobsState.captureImages = [];
  jobsState.captureSearchResults = [];
  hideCaptureStudentSearch();
  jobsState.envelopeSubject = null;
  jobsState.envelopeScan = null;
  jobsState.envelopePending = null;
  envelopeConfirmModal.hidden = true;
  jobsState.showStudentEditForm = false;
  jobsState.workspaceMode = 'students';
  jobsState.adminItems = null;
  renderWorkflowTab();
}

async function reloadCurrentJobDetail() {
  if (!jobsState.selectedJobId) {
    return;
  }

  jobsState.detail = await trecsApi('getJobDetail').getJobDetail(jobsState.selectedJobId);
  renderJobDetail(jobsState.detail.summary || jobsState.jobs.find((job) => job.id === jobsState.selectedJobId));
  if (jobsState.jobWorkspaceOpen) {
    if (jobsState.workspaceMode === 'admin') {
      renderAdminItemsWorkspace();
    } else if (jobsState.workspaceMode === 'capture') {
      renderCaptureWorkspace();
    } else if (jobsState.workspaceMode === 'envelope') {
      renderEnvelopeWorkspace();
    } else {
      renderStudentWorkspace();
    }
  } else {
    renderWorkflowTab();
  }
}

async function loadImagePreview(imageId) {
  const panel = document.getElementById('imagePreviewPanel');
  if (!panel || !imageId) {
    return;
  }

  const preview = await trecsApi('getImagePreview').getImagePreview(imageId);
  if (!preview || preview.missing || !preview.dataUrl) {
    panel.innerHTML = '<div class="empty-state">Preview unavailable.</div>';
    return;
  }

  panel.innerHTML = `
    <img src="${preview.dataUrl}" alt="${preview.filename}">
    <dl>
      <div>
        <dt>Filename</dt>
        <dd>${preview.filename}</dd>
      </div>
      <div>
        <dt>Version</dt>
        <dd>${preview.versionType}</dd>
      </div>
      <div>
        <dt>Size</dt>
        <dd>${preview.width} x ${preview.height}</dd>
      </div>
    </dl>
    ${renderImageLinkPanel(imageId)}
  `;

  bindImagePreviewLinkForm();
}

function renderImageLinkPanel(imageId) {
  const subjects = jobsState.detail ? jobsState.detail.subjects : [];
  if (!subjects.length) {
    return '';
  }
  const filteredSubjects = subjects.filter((subject) => textIncludes(
    subject,
    ['ref', 'name', 'externalId', 'grade', 'homeroom'],
    jobsState.imageLinkSubjectSearch
  ));
  const selectableSubjects = filteredSubjects.length ? filteredSubjects : subjects;

  if (!selectableSubjects.some((subject) => subject.id === jobsState.selectedImageSubjectId)) {
    jobsState.selectedImageSubjectId = selectableSubjects[0].id;
  }

  return `
    <form class="image-link-form" data-image-link-form>
      <label>
        <span>Find Subject</span>
        <input name="subjectSearch" type="search" value="${escapeHtml(jobsState.imageLinkSubjectSearch)}" placeholder="Ref, name, ID, grade">
      </label>
      <label>
        <span>Link To Subject</span>
        <select name="subjectId">
          ${selectableSubjects.map((subject) => `
            <option value="${subject.id}" ${subject.id === jobsState.selectedImageSubjectId ? 'selected' : ''}>
              ${subject.ref || ''} ${subject.name || ''}
            </option>
          `).join('')}
        </select>
      </label>
      <div class="form-actions">
        <span data-image-link-status></span>
        <button type="submit" data-link-image-id="${imageId}">Make Primary</button>
      </div>
    </form>
  `;
}

function bindImagePreviewLinkForm() {
  const form = document.querySelector('[data-image-link-form]');
  if (!form) {
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const subjectId = Number(form.elements.subjectId.value);
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector('[data-image-link-status]');
    jobsState.selectedImageSubjectId = subjectId;
    status.textContent = '';
    await saveSubjectImageLink(subjectId, Number(button.dataset.linkImageId), button);
  });

  form.elements.subjectId.addEventListener('change', () => {
    jobsState.selectedImageSubjectId = Number(form.elements.subjectId.value);
  });

  form.elements.subjectSearch.addEventListener('input', () => {
    jobsState.imageLinkSubjectSearch = form.elements.subjectSearch.value;
    loadImagePreview(jobsState.selectedImageId);
  });
}

async function loadJobs() {
  const data = await trecsApi('getJobsData').getJobsData();
  jobsState.jobs = data.jobs;
  jobsState.types = data.types;
  jobsState.clients = data.clients || [];
  jobsState.packagePlans = data.packagePlans || [];
  renderNewSchoolForm();
  renderNewJobForm();
  renderImportPreviousJobForm();
  renderJobsScreen();
}

async function submitNewSchool(event) {
  event.preventDefault();
  const button = newSchoolForm.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = 'Adding...';
  newSchoolStatus.textContent = '';

  try {
    const result = await trecsApi('createClient').createClient({
      displayName: newSchoolForm.elements.displayName.value,
      trecsName: newSchoolForm.elements.trecsName.value,
      referenceNumber: newSchoolForm.elements.referenceNumber.value,
      phone: newSchoolForm.elements.phone.value,
      address: newSchoolForm.elements.address.value,
      city: newSchoolForm.elements.city.value,
      state: newSchoolForm.elements.state.value,
      zip: newSchoolForm.elements.zip.value,
      notes: newSchoolForm.elements.notes.value
    });

    resetNewSchoolForm();
    jobsState.selectedNewClientId = result.id;
    setNewSchoolFormVisible(false);
    setNewJobFormVisible(true);
    await loadDashboard();
    await loadJobs();
  } catch (error) {
    newSchoolStatus.textContent = error.message || 'Add school failed';
    console.error(error);
  } finally {
    button.disabled = false;
    button.textContent = 'Add School';
  }
}

async function submitNewJob(event) {
  event.preventDefault();
  const button = newJobForm.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = 'Creating...';
  newJobStatus.textContent = '';

  try {
    const result = await trecsApi('createJob').createJob({
      clientId: newJobForm.elements.clientId.value,
      name: newJobForm.elements.name.value,
      type: newJobForm.elements.type.value,
      packagePlanId: newJobForm.elements.packagePlanId.value,
      shootDate: newJobForm.elements.shootDate.value,
      retakeDate: newJobForm.elements.retakeDate.value,
      rootPath: newJobForm.elements.rootPath.value,
      notes: newJobForm.elements.notes.value
    });

    resetNewJobForm();
    jobsState.selectedJobId = result.id;
    jobsState.selectedType = 'all';
    jobsState.search = '';
    jobsState.detail = null;
    jobsState.lastLaptopPackage = null;
    jobSearchInput.value = '';
    setNewJobFormVisible(false);
    await loadDashboard();
    await loadJobs();
    await loadJobDetail(result.id);
  } catch (error) {
    newJobStatus.textContent = error.message || 'Create failed';
    console.error(error);
  } finally {
    button.disabled = false;
    button.textContent = 'Create Job';
  }
}

async function browsePreviousJobFolder() {
  importPreviousJobStatus.textContent = '';
  try {
    const result = await trecsApi('choosePreviousTrecsJobFolder').choosePreviousTrecsJobFolder();
    if (!result || result.canceled) {
      return;
    }

    importPreviousJobForm.elements.sourceFolder.value = result.folderPath;
    const folderName = result.folderPath.split(/[\\/]/).filter(Boolean).pop();
    if (!importPreviousJobForm.elements.name.value && folderName) {
      importPreviousJobForm.elements.name.value = folderName;
    }
    if (!result.hasStudentsDatabase) {
      importPreviousJobStatus.textContent = 'Database\\Students.accdb was not found in that folder.';
    }
  } catch (error) {
    importPreviousJobStatus.textContent = error.message || 'Folder browse failed';
    console.error(error);
  }
}

async function submitImportPreviousJob(event) {
  event.preventDefault();
  const button = importPreviousJobForm.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = 'Importing...';
  importPreviousJobStatus.textContent = 'Reading old TRECS job...';

  try {
    const result = await trecsApi('importPreviousTrecsJob').importPreviousTrecsJob({
      clientId: importPreviousJobForm.elements.clientId.value,
      name: importPreviousJobForm.elements.name.value,
      type: importPreviousJobForm.elements.type.value,
      packagePlanId: importPreviousJobForm.elements.packagePlanId.value,
      sourceFolder: importPreviousJobForm.elements.sourceFolder.value,
      rootPath: importPreviousJobForm.elements.rootPath.value,
      notes: importPreviousJobForm.elements.notes.value
    });

    resetImportPreviousJobForm();
    jobsState.selectedJobId = result.id;
    jobsState.selectedType = 'all';
    jobsState.search = '';
    jobsState.detail = null;
    jobsState.lastLaptopPackage = null;
    jobSearchInput.value = '';
    setImportPreviousJobFormVisible(false);
    await loadDashboard();
    await loadJobs();
    await loadJobDetail(result.id);
  } catch (error) {
    importPreviousJobStatus.textContent = error.message || 'Import failed';
    console.error(error);
  } finally {
    button.disabled = false;
    button.textContent = 'Import Job';
  }
}

async function loadOnsiteSetup() {
  showJobsForAction();
  loadOnsiteSetupButton.disabled = true;
  loadOnsiteSetupButton.textContent = 'Choosing...';

  try {
    const choice = await trecsApi('chooseOnsiteSetupFolder').chooseOnsiteSetupFolder();
    if (!choice || choice.canceled) {
      return;
    }
    if (!choice.hasManifest) {
      throw new Error('onsite-setup.json was not found in that folder.');
    }
    if (!choice.hasDatabase) {
      throw new Error('Database\\job.db was not found in that folder.');
    }

    loadOnsiteSetupButton.textContent = 'Loading...';
    const result = await trecsApi('loadOnsiteSetup').loadOnsiteSetup({
      setupFolder: choice.folderPath
    });

    jobsState.selectedJobId = result.id;
    jobsState.selectedType = 'all';
    jobsState.search = '';
    jobsState.detail = null;
    jobsState.lastLaptopPackage = null;
    jobSearchInput.value = '';
    setImportPreviousJobFormVisible(false);
    await loadDashboard();
    await loadJobs();
    await loadJobDetail(result.id);
  } catch (error) {
    window.alert(error.message || 'Load onsite setup failed');
    console.error(error);
  } finally {
    loadOnsiteSetupButton.disabled = false;
    loadOnsiteSetupButton.textContent = 'Load Onsite Setup';
  }
}

async function loadEndOfDayPackage() {
  showJobsForAction();
  loadEndOfDayButton.disabled = true;
  loadEndOfDayButton.textContent = 'Choosing...';

  try {
    const choice = await trecsApi('chooseEndOfDayPackageFolder').chooseEndOfDayPackageFolder();
    if (!choice || choice.canceled) {
      return;
    }
    if (!choice.hasManifest) {
      throw new Error('end-of-day-manifest.json was not found in that folder.');
    }
    if (!choice.hasDatabase) {
      throw new Error('Database\\job.db was not found in that folder.');
    }
    if (!choice.manifest || choice.manifest.packageType !== 'end_of_day') {
      throw new Error('That folder is not a TRECS End of Day package.');
    }

    openEndOfDayPackageReview(choice);
  } catch (error) {
    window.alert(error.message || 'Load End of Day failed');
    console.error(error);
  } finally {
    loadEndOfDayButton.disabled = false;
    loadEndOfDayButton.textContent = 'Load End of Day';
  }
}

async function loadDashboard() {
  try {
    const dashboard = await trecsApi('getDashboardData').getDashboardData();
    databasePath.textContent = dashboard.databasePath;
    renderMetrics(dashboard.counts);
    renderJobs(dashboard.jobs);
    renderMigration(dashboard.migration);
  } catch (error) {
    metricGrid.innerHTML = `
      <article class="error">
        <span>Database Error</span>
        <strong>Check console</strong>
      </article>
    `;
    console.error(error);
  }
}

loadDashboard();

viewButtons.forEach((button) => {
  button.addEventListener('click', () => setView(button.dataset.viewButton));
});

viewTargets.forEach((button) => {
  button.addEventListener('click', () => {
    if (button.dataset.jobTabTarget) {
      jobsState.selectedTab = button.dataset.jobTabTarget;
    }
    setView(button.dataset.viewTarget);
  });
});

jobWorkflowTabs.querySelectorAll('button').forEach((button) => {
  button.addEventListener('click', () => {
    jobsState.selectedTab = button.dataset.jobTab;
    renderWorkflowTab();
  });
});

jobSearchInput.addEventListener('input', () => {
  jobsState.search = jobSearchInput.value;
  jobsState.selectedJobId = null;
  renderJobsScreen();
});

backToJobsButton.addEventListener('click', closeJobWorkspace);

workspaceStudentsButton.addEventListener('click', () => {
  setWorkspaceMode('students');
});

workspaceCaptureButton.addEventListener('click', () => {
  setWorkspaceMode('capture');
});

workspaceEnvelopeButton.addEventListener('click', () => {
  setWorkspaceMode('envelope');
});

workspaceAdminItemsButton.addEventListener('click', () => {
  setWorkspaceMode('admin');
});

adminOptionsForm.addEventListener('change', () => {
  const options = adminOutputOptions();
  applyAdminOptions(options);
  jobsState.adminItems = null;
  renderAdminItemsWorkspace();
});

workspaceAddBlankButton.addEventListener('click', () => {
  setAddRecordsModalVisible(true);
});

cancelAddRecordsButton.addEventListener('click', () => {
  setAddRecordsModalVisible(false);
});

addRecordsForm.addEventListener('submit', submitAddRecords);

captureEntryForm.addEventListener('submit', (event) => {
  event.preventDefault();
  lookupCaptureSubject();
});
captureEntryForm.elements.barcode.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    lookupCaptureSubject();
  }
});
captureEntryForm.elements.studentSearch.addEventListener('input', () => {
  clearTimeout(jobsState.captureSearchTimer);
  jobsState.captureSearchTimer = setTimeout(searchCaptureStudents, 180);
});
captureEntryForm.elements.studentSearch.addEventListener('keydown', (event) => {
  const results = jobsState.captureSearchResults || [];
  if (event.key === 'ArrowDown' && results.length) {
    event.preventDefault();
    jobsState.captureSearchActiveIndex = Math.min(results.length - 1, jobsState.captureSearchActiveIndex + 1);
    renderCaptureStudentSearchResults();
  } else if (event.key === 'ArrowUp' && results.length) {
    event.preventDefault();
    jobsState.captureSearchActiveIndex = Math.max(0, jobsState.captureSearchActiveIndex - 1);
    renderCaptureStudentSearchResults();
  } else if (event.key === 'Enter' && results.length) {
    event.preventDefault();
    selectCaptureSearchResult(Math.max(0, jobsState.captureSearchActiveIndex));
  } else if (event.key === 'Escape') {
    hideCaptureStudentSearch();
  }
});
captureEntryForm.elements.studentSearch.addEventListener('blur', () => {
  setTimeout(hideCaptureStudentSearch, 120);
});
if (captureFileModeToggle) {
  captureFileModeToggle.addEventListener('click', (event) => {
    const button = event.target.closest('[data-capture-file-mode]');
    if (!button) {
      return;
    }
    setCaptureFileMode(button.dataset.captureFileMode);
  });
}

workspaceEditStudentButton.addEventListener('click', () => {
  jobsState.showStudentEditForm = !jobsState.showStudentEditForm;
  renderStudentWorkspace();
});

workspacePreviousButton.addEventListener('click', () => {
  moveWorkspaceSubject(-1);
});

workspaceNextButton.addEventListener('click', () => {
  moveWorkspaceSubject(1);
});

workspaceStudentSearch.addEventListener('input', () => {
  jobsState.workspaceStudentSearch = workspaceStudentSearch.value;
  renderStudentWorkspace();
});

envelopeEntryForm.addEventListener('submit', submitEnvelopeOrder);
envelopeEntryForm.elements.barcode.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    lookupEnvelopeSubject();
  }
});
envelopeEntryForm.elements.studentSearch.addEventListener('input', () => {
  clearTimeout(jobsState.envelopeSearchTimer);
  jobsState.envelopeSearchTimer = setTimeout(searchEnvelopeStudents, 180);
});
envelopeEntryForm.elements.studentSearch.addEventListener('keydown', (event) => {
  const results = jobsState.envelopeSearchResults || [];
  if (event.key === 'ArrowDown' && results.length) {
    event.preventDefault();
    jobsState.envelopeSearchActiveIndex = Math.min(results.length - 1, jobsState.envelopeSearchActiveIndex + 1);
    renderEnvelopeStudentSearchResults();
  } else if (event.key === 'ArrowUp' && results.length) {
    event.preventDefault();
    jobsState.envelopeSearchActiveIndex = Math.max(0, jobsState.envelopeSearchActiveIndex - 1);
    renderEnvelopeStudentSearchResults();
  } else if (event.key === 'Enter' && results.length) {
    event.preventDefault();
    selectEnvelopeSearchResult(Math.max(0, jobsState.envelopeSearchActiveIndex));
  } else if (event.key === 'Escape') {
    hideEnvelopeStudentSearch();
  }
});
envelopeEntryForm.elements.studentSearch.addEventListener('blur', () => {
  setTimeout(hideEnvelopeStudentSearch, 120);
});
envelopeEntryForm.elements.orderCodes.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    submitEnvelopeOrder(event);
  }
});
confirmEnvelopeButton.addEventListener('click', () => {
  respondEnvelopeConfirm(true);
});
cancelEnvelopeConfirmButton.addEventListener('click', () => {
  respondEnvelopeConfirm(false);
});
closeOrderEnvelopeButton.addEventListener('click', closeOrderEnvelope);
assignEnvelopeScanButton.addEventListener('click', assignViewedEnvelopeScan);
deleteEnvelopeScanButton.addEventListener('click', deleteViewedEnvelopeScan);
cancelEditOrderButton.addEventListener('click', closeEditOrder);
editOrderForm.addEventListener('submit', submitEditOrder);
deleteOrderButton.addEventListener('click', async () => {
  const orderId = jobsState.editingOrderId;
  closeEditOrder();
  if (orderId) {
    await deleteWorkspaceOrder(orderId);
  }
});
cancelEndOfDayButton.addEventListener('click', () => {
  setEndOfDayModalVisible(false);
});
confirmEndOfDayButton.addEventListener('click', confirmEndOfDayPackage);
endOfDayModal.addEventListener('wheel', (event) => {
  if (endOfDayModal.hidden) {
    return;
  }

  const target = event.target instanceof Element ? event.target : event.target.parentElement;
  const scrollTarget = target ? target.closest('.end-of-day-section-body, .end-of-day-review') : null;
  if (!scrollTarget) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  scrollTarget.scrollTop += event.deltaY;
}, { passive: false });
cancelSchoolDataButton.addEventListener('click', () => {
  setSchoolDataModalVisible(false);
});
browseSchoolDataButton.addEventListener('click', browseSchoolDataFile);
confirmSchoolDataButton.addEventListener('click', confirmSchoolDataImport);
refreshUnlinkedEnvelopesButton.addEventListener('click', loadUnlinkedEnvelopeScans);
if (window.trecs && typeof window.trecs.onEnvelopeScanImported === 'function') {
  window.trecs.onEnvelopeScanImported(handleEnvelopeScanImported);
}
if (window.trecs && typeof window.trecs.onCaptureImageImported === 'function') {
  window.trecs.onCaptureImageImported(handleCaptureImageImported);
}

newSchoolButton.addEventListener('click', () => {
  showJobsForAction();
  setNewSchoolFormVisible(!jobsState.showNewSchoolForm);
});

cancelNewSchoolButton.addEventListener('click', () => {
  setNewSchoolFormVisible(false);
});

newSchoolForm.addEventListener('submit', submitNewSchool);

newJobButton.addEventListener('click', () => {
  showJobsForAction();
  setNewJobFormVisible(!jobsState.showNewJobForm);
});

cancelNewJobButton.addEventListener('click', () => {
  setNewJobFormVisible(false);
});

newJobForm.addEventListener('submit', submitNewJob);

importPreviousJobButton.addEventListener('click', () => {
  showJobsForAction();
  setImportPreviousJobFormVisible(!jobsState.showImportPreviousJobForm);
});

loadOnsiteSetupButton.addEventListener('click', loadOnsiteSetup);
loadEndOfDayButton.addEventListener('click', loadEndOfDayPackage);

cancelImportPreviousJobButton.addEventListener('click', () => {
  setImportPreviousJobFormVisible(false);
});

browsePreviousJobFolderButton.addEventListener('click', browsePreviousJobFolder);
importPreviousJobForm.addEventListener('submit', submitImportPreviousJob);
