const databasePath = document.getElementById('databasePath');
const metricGrid = document.getElementById('metricGrid');
const jobsTableBody = document.getElementById('jobsTableBody');
const migrationList = document.getElementById('migrationList');
const title = document.querySelector('.topbar h1');
const viewButtons = document.querySelectorAll('[data-view-button]');
const viewTargets = document.querySelectorAll('[data-view-target]');
const dashboardView = document.getElementById('dashboardView');
const jobsView = document.getElementById('jobsView');
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
  showNewSchoolForm: false,
  selectedNewClientId: null,
  showNewJobForm: false
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
  setJobsWorkspaceMode(false);
  title.textContent = 'Jobs';
}

function setWorkspaceMode(mode) {
  jobsState.workspaceMode = mode;
  const studentsOpen = mode === 'students';
  document.querySelector('.student-workspace-grid').hidden = !studentsOpen;
  adminItemsWorkspace.hidden = studentsOpen;
  workspaceStudentsButton.classList.toggle('active', studentsOpen);
  workspaceAdminItemsButton.classList.toggle('active', !studentsOpen);
  workspaceAddBlankButton.hidden = !studentsOpen;
  workspaceEditStudentButton.hidden = !studentsOpen;
  workspacePreviousButton.hidden = !studentsOpen;
  workspaceNextButton.hidden = !studentsOpen;

  if (studentsOpen) {
    renderStudentWorkspace();
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
        <div>
          <span>#${order.id} ${order.source} / ${order.paidStatus}</span>
          <strong>${order.packageCodes || 'No codes'} (${order.itemCount} items)</strong>
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
  if (newSchoolStatus) {
    newSchoolStatus.textContent = '';
  }
  renderNewSchoolForm();
}

function renderNewJobForm() {
  if (!newJobPanel || !newJobForm) {
    return;
  }

  newJobPanel.hidden = jobsState.jobWorkspaceOpen || !jobsState.showNewJobForm;
  if (!jobsState.showNewJobForm) {
    return;
  }

  const clientSelect = newJobForm.elements.clientId;
  const packageSelect = newJobForm.elements.packagePlanId;
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

function setNewJobFormVisible(visible) {
  jobsState.showNewJobForm = visible;
  if (newJobStatus) {
    newJobStatus.textContent = '';
  }
  renderNewJobForm();
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
        <button class="primary" data-prepare-laptop-package="${job.id}">Prepare Laptop Package</button>
        <span data-laptop-package-status>
          ${renderLaptopPackageStatus(job.id)}
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
    return 'Creating package...';
  }

  if (laptopPackage.status === 'error') {
    return laptopPackage.message || 'Package failed';
  }

  return `Created ${laptopPackage.subjects} subjects at ${laptopPackage.packagePath}`;
}

function bindJobDetailActions() {
  const button = jobDetailPanel.querySelector('[data-prepare-laptop-package]');
  if (!button) {
    return;
  }

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

newSchoolButton.addEventListener('click', () => {
  setNewSchoolFormVisible(!jobsState.showNewSchoolForm);
});

cancelNewSchoolButton.addEventListener('click', () => {
  setNewSchoolFormVisible(false);
});

newSchoolForm.addEventListener('submit', submitNewSchool);

newJobButton.addEventListener('click', () => {
  setNewJobFormVisible(!jobsState.showNewJobForm);
});

cancelNewJobButton.addEventListener('click', () => {
  setNewJobFormVisible(false);
});

newJobForm.addEventListener('submit', submitNewJob);
