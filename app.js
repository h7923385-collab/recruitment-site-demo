const STORAGE_KEYS = {
  jobs: 'recruitment.jobs',
  candidates: 'recruitment.candidates',
  interviews: 'recruitment.interviews',
  notifications: 'recruitment.notifications',
  activePersona: 'recruitment.activePersona',
  savedJobs: 'recruitment.savedJobs',
  activeView: 'recruitment.activeView'
};

const STATUS_FLOW = ['待筛选', '已约面试', '已发录用'];

const defaultJobs = [
  {
    id: crypto.randomUUID(),
    title: '高级招聘运营专员',
    department: '人才发展中心',
    description: '负责招聘项目推进、渠道协同、流程数据分析与招聘体验优化。',
    requirements: '具备招聘运营或项目协同经验，擅长沟通与数据整理。',
    customFields: ['行业经验', '可到岗时间']
  },
  {
    id: crypto.randomUUID(),
    title: '前端开发工程师',
    department: '数字化产品部',
    description: '负责招聘系统前端体验迭代、可视化模块开发与业务联动优化。',
    requirements: '熟悉 HTML/CSS/JavaScript，有业务系统或中后台经验优先。',
    customFields: ['GitHub链接', '作品集链接']
  },
  {
    id: crypto.randomUUID(),
    title: '校园招聘项目专员',
    department: '雇主品牌中心',
    description: '负责校园招聘项目策划、宣讲执行与院校合作运营。',
    requirements: '具备活动统筹能力，沟通表达清晰，能够处理多任务。',
    customFields: ['目标院校', '可出差城市']
  }
];

const defaultCandidates = [
  {
    id: crypto.randomUUID(),
    name: '李佳宁',
    contact: '13800001111 / jianing@example.com',
    jobTitle: '高级招聘运营专员',
    resume: 'lijianing_resume.pdf',
    status: '待筛选',
    submittedAt: '2026-04-17 20:30',
    customAnswers: { '行业经验': '互联网招聘 2 年', '可到岗时间': '两周内' },
    lastAction: '已完成首轮资料提交，等待 HR 初筛',
    interviewConfirmed: false
  },
  {
    id: crypto.randomUUID(),
    name: '周一凡',
    contact: '13900002222 / yifan@example.com',
    jobTitle: '前端开发工程师',
    resume: 'https://portfolio.example.com',
    status: '已约面试',
    submittedAt: '2026-04-17 21:00',
    customAnswers: { 'GitHub链接': 'github.com/yifan', '作品集链接': 'portfolio.yifan.dev' },
    lastAction: '已收到面试邀请，等待候选人确认',
    interviewConfirmed: false
  },
  {
    id: crypto.randomUUID(),
    name: '陈思睿',
    contact: '13600003333 / sirui@example.com',
    jobTitle: '校园招聘项目专员',
    resume: 'chen_sirui_resume.pdf',
    status: '已发录用',
    submittedAt: '2026-04-16 18:20',
    customAnswers: { '目标院校': '华东师范大学', '可出差城市': '上海、杭州' },
    lastAction: '已进入 offer 沟通阶段',
    interviewConfirmed: true
  }
];

const defaultInterviews = [
  {
    id: crypto.randomUUID(),
    candidateName: '周一凡',
    jobTitle: '前端开发工程师',
    time: '2026-04-19T15:00',
    interviewer: '王经理',
    mode: '线上',
    attendanceStatus: '待确认',
    feedback: '待面试'
  },
  {
    id: crypto.randomUUID(),
    candidateName: '陈思睿',
    jobTitle: '校园招聘项目专员',
    time: '2026-04-18T10:00',
    interviewer: '刘总监',
    mode: '现场',
    attendanceStatus: '已确认',
    feedback: '综合表现优秀，建议发放 offer'
  }
];

const defaultNotifications = [
  {
    id: crypto.randomUUID(),
    time: '2026-04-17 20:10',
    title: '系统初始化',
    body: '已载入默认岗位、候选人与面试流程数据。',
    audience: ['hr', 'applicant'],
    persona: 'system'
  },
  {
    id: crypto.randomUUID(),
    time: '2026-04-17 21:05',
    title: '候选人推进',
    body: '周一凡已进入面试阶段，等待候选人确认面试。',
    audience: ['hr'],
    persona: 'hr',
    candidateName: '周一凡'
  },
  {
    id: crypto.randomUUID(),
    time: '2026-04-17 21:06',
    title: '收到面试邀请',
    body: '周一凡已收到前端开发工程师面试邀请，请尽快确认参会。',
    audience: ['applicant'],
    persona: 'applicant',
    candidateName: '周一凡'
  }
];

function load(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return structuredClone(fallback);
  }
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(key, JSON.stringify(fallback));
    return structuredClone(fallback);
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

let jobs = load(STORAGE_KEYS.jobs, defaultJobs);
let candidates = load(STORAGE_KEYS.candidates, defaultCandidates);
let interviews = load(STORAGE_KEYS.interviews, defaultInterviews);
let notifications = load(STORAGE_KEYS.notifications, defaultNotifications);
let savedJobs = load(STORAGE_KEYS.savedJobs, []);
let activePersona = localStorage.getItem(STORAGE_KEYS.activePersona) || 'hr';
let activeView = localStorage.getItem(STORAGE_KEYS.activeView) || 'overview';

const els = {
  statsGrid: document.getElementById('stats-grid'),
  jobForm: document.getElementById('job-form'),
  jobList: document.getElementById('job-list'),
  candidateForm: document.getElementById('candidate-form'),
  candidateJobSelect: document.getElementById('candidate-job-select'),
  dynamicFields: document.getElementById('dynamic-fields'),
  candidateTableBody: document.getElementById('candidate-table-body'),
  candidateSearch: document.getElementById('candidate-search'),
  candidateStatusFilter: document.getElementById('candidate-status-filter'),
  candidateJobFilter: document.getElementById('candidate-job-filter'),
  candidateSort: document.getElementById('candidate-sort'),
  resetFiltersBtn: document.getElementById('reset-filters-btn'),
  opsHealth: document.getElementById('ops-health'),
  opsAlerts: document.getElementById('ops-alerts'),
  quickActions: document.getElementById('quick-actions'),
  journeyMap: document.getElementById('journey-map'),
  toastStack: document.getElementById('toast-stack'),
  interviewForm: document.getElementById('interview-form'),
  interviewCandidateSelect: document.getElementById('interview-candidate-select'),
  feedbackForm: document.getElementById('feedback-form'),
  feedbackCandidateSelect: document.getElementById('feedback-candidate-select'),
  interviewList: document.getElementById('interview-list'),
  offerChecklist: document.getElementById('offer-checklist'),
  taskList: document.getElementById('task-list'),
  funnelGrid: document.getElementById('funnel-grid'),
  recommendedCandidates: document.getElementById('recommended-candidates'),
  personaSwitch: document.getElementById('persona-switch'),
  profileCandidateSelect: document.getElementById('profile-candidate-select'),
  timelineList: document.getElementById('timeline-list'),
  messageList: document.getElementById('message-list'),
  applicantPortal: document.getElementById('applicant-portal'),
  applicantSummary: document.getElementById('applicant-summary'),
  workspaceView: document.getElementById('workspace-view'),
  pipelineBoard: document.getElementById('pipeline-board'),
  activityFeed: document.getElementById('activity-feed'),
  jobGallery: document.getElementById('job-gallery'),
  applicationList: document.getElementById('application-list'),
  messageContextTag: document.getElementById('message-context-tag'),
  confirmInterviewBtn: document.getElementById('confirm-interview-btn'),
  candidateDetailDrawer: document.getElementById('candidate-detail-drawer'),
  candidateDetailContent: document.getElementById('candidate-detail-content'),
  closeDrawerBtn: document.getElementById('close-drawer-btn'),
  refreshProfileBtn: document.getElementById('refresh-profile-btn'),
  requestReviewBtn: document.getElementById('request-review-btn'),
  topbarNav: document.getElementById('topbar-nav'),
  container: document.querySelector('.container'),
  viewPanels: document.querySelectorAll('[data-view-panel]'),
  viewButtons: document.querySelectorAll('[data-view-target]')
};

function formatDateTime(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatInterviewTime(value) {
  return String(value || '').replace('T', ' ');
}

function persistAll() {
  save(STORAGE_KEYS.jobs, jobs);
  save(STORAGE_KEYS.candidates, candidates);
  save(STORAGE_KEYS.interviews, interviews);
  save(STORAGE_KEYS.notifications, notifications);
  save(STORAGE_KEYS.savedJobs, savedJobs);
}

function badgeClass(status) {
  if (status === '已约面试') return 'badge badge--interview';
  if (status === '已发录用') return 'badge badge--offer';
  return 'badge badge--pending';
}

function normalizeData() {
  jobs = jobs.map((job) => ({
    ...job,
    id: job.id || crypto.randomUUID(),
    customFields: Array.isArray(job.customFields) ? job.customFields : []
  }));

  candidates = candidates.map((candidate) => {
    const matchedJob = jobs.find((job) => job.id === candidate.jobId) || jobs.find((job) => job.title === candidate.jobTitle) || jobs[0];
    return {
      ...candidate,
      id: candidate.id || crypto.randomUUID(),
      jobId: matchedJob?.id || '',
      jobTitle: candidate.jobTitle || matchedJob?.title || '待匹配岗位',
      customAnswers: candidate.customAnswers || {},
      lastAction: candidate.lastAction || '等待新的流程动作',
      interviewConfirmed: Boolean(candidate.interviewConfirmed),
      priorityFlag: Boolean(candidate.priorityFlag),
      profileBoost: Number(candidate.profileBoost || 0)
    };
  });

  interviews = interviews.map((interview) => {
    const matchedCandidate = candidates.find((candidate) => candidate.id === interview.candidateId) || candidates.find((candidate) => candidate.name === interview.candidateName);
    return {
      ...interview,
      id: interview.id || crypto.randomUUID(),
      candidateId: matchedCandidate?.id || '',
      candidateName: interview.candidateName || matchedCandidate?.name || '待定',
      jobTitle: interview.jobTitle || matchedCandidate?.jobTitle || '待定岗位',
      attendanceStatus: interview.attendanceStatus || '待确认',
      feedback: interview.feedback || '待面试'
    };
  });

  notifications = notifications.map((item) => ({
    id: item.id || crypto.randomUUID(),
    time: item.time || formatDateTime(),
    title: item.title || '系统消息',
    body: item.body || '',
    audience: Array.isArray(item.audience) && item.audience.length ? item.audience : ['hr', 'applicant'],
    persona: item.persona || 'system',
    candidateId: item.candidateId || candidates.find((candidate) => candidate.name === item.candidateName)?.id || '',
    candidateName: item.candidateName || candidates.find((candidate) => candidate.id === item.candidateId)?.name || ''
  }));
}

function inferResumeAssessment(candidate) {
  const filledAnswers = Object.values(candidate.customAnswers || {}).filter(Boolean).length;
  if (candidate.status === '已发录用') return '综合评估优秀，建议进入入职流程';
  if (candidate.status === '已约面试') return candidate.interviewConfirmed
    ? '已确认参加面试，建议输出深度提问提纲'
    : '核心能力匹配度较高，等待候选人确认面试';
  if (filledAnswers >= 2) return '信息完整度高，建议优先安排初筛';
  return '基础信息已收集，建议补充岗位相关材料';
}

function currentProfileCandidate() {
  if (!candidates.length) return null;
  const selectedId = els.profileCandidateSelect?.value;
  return candidates.find((candidate) => candidate.id === selectedId) || candidates[0];
}

function createNotification({ title, body, audience = ['hr', 'applicant'], persona = 'system', candidateId = '', candidateName = '' }) {
  notifications.unshift({
    id: crypto.randomUUID(),
    time: formatDateTime(),
    title,
    body,
    audience,
    persona,
    candidateId,
    candidateName
  });
  notifications = notifications.slice(0, 24);
}

function showToast(title, body) {
  if (!els.toastStack) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<strong>${title}</strong><span>${body}</span>`;
  els.toastStack.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('is-visible'));
  setTimeout(() => {
    toast.classList.remove('is-visible');
    setTimeout(() => toast.remove(), 220);
  }, 2400);
}

function pushNotification(title, body, persona = 'system', options = {}) {
  createNotification({ title, body, persona, ...options });
  save(STORAGE_KEYS.notifications, notifications);
  renderMessages();
  renderActivityFeed();
  renderOpsAlerts();
  showToast(title, body);
}

function getVisibleNotifications() {
  const selectedCandidate = currentProfileCandidate();
  return notifications.filter((item) => {
    const visibleByAudience = item.audience.includes(activePersona) || item.audience.includes('all');
    if (!visibleByAudience) return false;
    if (activePersona === 'hr') return true;
    if (!selectedCandidate) return item.persona === 'system';
    return !item.candidateId || item.candidateId === selectedCandidate.id;
  });
}

function renderDashboard() {
  const stats = [
    { label: '岗位数量', value: jobs.length },
    { label: '候选人总数', value: candidates.length },
    { label: '待筛选', value: candidates.filter((c) => c.status === '待筛选').length },
    { label: '已约面试', value: candidates.filter((c) => c.status === '已约面试').length },
    { label: '已发录用', value: candidates.filter((c) => c.status === '已发录用').length },
    { label: '面试安排数', value: interviews.length }
  ];

  els.statsGrid.innerHTML = stats.map((item) => `
    <article class="stat-card">
      <div class="label">${item.label}</div>
      <div class="value">${item.value}</div>
    </article>
  `).join('');
}

function renderJobs() {
  if (!jobs.length) {
    els.jobList.innerHTML = '<div class="empty">暂无岗位，请先发布岗位。</div>';
    return;
  }

  els.jobList.innerHTML = jobs.map((job) => `
    <article class="job-item">
      <div class="job-item__head">
        <h4>${job.title}</h4>
        <span class="tag-chip">${job.department}</span>
      </div>
      <p><strong>职责描述：</strong>${job.description}</p>
      <p><strong>任职要求：</strong>${job.requirements}</p>
      <p class="muted">专属字段：${job.customFields?.length ? job.customFields.join('、') : '无'}</p>
    </article>
  `).join('');
}

function renderJobOptions() {
  const options = jobs.map((job) => `<option value="${job.id}">${job.title}｜${job.department}</option>`).join('');
  els.candidateJobSelect.innerHTML = options || '<option value="">请先发布岗位</option>';
}

function renderCandidateFilterOptions() {
  if (!els.candidateJobFilter) return;
  const currentValue = els.candidateJobFilter.value || 'all';
  const options = ['<option value="all">全部岗位</option>', ...jobs.map((job) => `<option value="${job.id}">${job.title}</option>`)].join('');
  els.candidateJobFilter.innerHTML = options;
  els.candidateJobFilter.value = jobs.some((job) => job.id === currentValue) ? currentValue : 'all';
}

function renderFeedbackCandidateOptions() {
  if (!els.feedbackCandidateSelect) return;
  const options = candidates.map((candidate) => `<option value="${candidate.id}">${candidate.name}｜${candidate.jobTitle}</option>`).join('');
  els.feedbackCandidateSelect.innerHTML = options || '<option value="">暂无候选人</option>';
}

function renderProfileOptions() {
  const selectedId = currentProfileCandidate()?.id;
  const options = candidates.map((candidate) => `<option value="${candidate.id}">${candidate.name}｜${candidate.jobTitle}</option>`).join('');
  els.profileCandidateSelect.innerHTML = options || '<option value="">暂无候选人</option>';
  if (selectedId && candidates.some((candidate) => candidate.id === selectedId)) {
    els.profileCandidateSelect.value = selectedId;
  }
}

function renderDynamicFields() {
  const selectedJob = jobs.find((job) => job.id === els.candidateJobSelect.value) || jobs[0];
  if (!selectedJob || !selectedJob.customFields?.length) {
    els.dynamicFields.innerHTML = '<div class="muted">该岗位暂无额外收集字段。</div>';
    return;
  }

  els.dynamicFields.innerHTML = selectedJob.customFields.map((field, index) => `
    <label>${field}
      <input type="text" name="custom_${index}" data-custom-label="${field}" placeholder="请输入${field}" />
    </label>
  `).join('');
}

function getCandidateScore(candidate) {
  const answerCount = Object.values(candidate.customAnswers || {}).filter(Boolean).length;
  const statusScore = candidate.status === '已发录用' ? 35 : candidate.status === '已约面试' ? 24 : 12;
  const confirmScore = candidate.interviewConfirmed ? 12 : 0;
  const profileScore = candidate.resume ? 16 : 0;
  const priorityScore = candidate.priorityFlag ? 8 : 0;
  const boostScore = Math.min(14, Number(candidate.profileBoost || 0));
  return Math.min(100, 30 + answerCount * 12 + statusScore + confirmScore + profileScore + priorityScore + boostScore);
}

function getCandidatePriority(candidate) {
  if (candidate.status === '待筛选') return '待尽快初筛';
  if (candidate.status === '已约面试' && !candidate.interviewConfirmed) return '待候选人确认';
  if (candidate.status === '已约面试' && candidate.interviewConfirmed) return '待面试反馈';
  return '待推进 offer';
}

function getStatusOrder(status) {
  return STATUS_FLOW.indexOf(status);
}

function applyCandidateFilters(list = candidates) {
  const query = els.candidateSearch?.value.trim().toLowerCase() || '';
  const status = els.candidateStatusFilter?.value || 'all';
  const jobId = els.candidateJobFilter?.value || 'all';
  const sort = els.candidateSort?.value || 'latest';

  const filtered = list.filter((candidate) => {
    const haystack = [candidate.name, candidate.contact, candidate.jobTitle, candidate.resume].join(' ').toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesStatus = status === 'all' || candidate.status === status;
    const matchesJob = jobId === 'all' || candidate.jobId === jobId;
    return matchesQuery && matchesStatus && matchesJob;
  });

  return filtered.sort((a, b) => {
    if (sort === 'score') return getCandidateScore(b) - getCandidateScore(a);
    if (sort === 'status') {
      const byStatus = getStatusOrder(b.status) - getStatusOrder(a.status);
      if (byStatus !== 0) return byStatus;
    }
    return String(b.submittedAt).localeCompare(String(a.submittedAt));
  });
}

function renderCandidates() {
  const list = applyCandidateFilters(candidates);

  if (!list.length) {
    els.candidateTableBody.innerHTML = '<tr><td colspan="8" class="empty">暂无匹配的候选人信息。</td></tr>';
    return;
  }

  els.candidateTableBody.innerHTML = list.map((candidate) => {
    const customInfo = Object.entries(candidate.customAnswers || {}).map(([k, v]) => `${k}: ${v || '-'}`).join('<br/>');
    const feedback = interviews.find((item) => item.candidateId === candidate.id)?.feedback || '待补充反馈';
    return `
      <tr>
        <td>${candidate.name}</td>
        <td>${candidate.contact}</td>
        <td>${candidate.jobTitle}<div class="muted">${customInfo || ''}</div></td>
        <td>${candidate.resume}<div class="muted">匹配度 ${getCandidateScore(candidate)}</div></td>
        <td>${inferResumeAssessment(candidate)}<div class="muted">${feedback}</div><div class="muted">优先动作：${getCandidatePriority(candidate)}</div></td>
        <td><span class="${badgeClass(candidate.status)}">${candidate.status}</span></td>
        <td>${candidate.submittedAt}</td>
        <td>
          <div class="row-actions">
            <button class="action-btn" data-action="screen" data-id="${candidate.id}">设为待筛选</button>
            <button class="action-btn" data-action="interview" data-id="${candidate.id}">设为已约面试</button>
            <button class="action-btn" data-action="offer" data-id="${candidate.id}">设为已发录用</button>
            <button class="action-btn" data-action="focus" data-id="${candidate.id}">查看档案</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderCandidateDetail(candidate) {
  if (!els.candidateDetailContent) return;
  if (!candidate) {
    els.candidateDetailContent.innerHTML = '<div class="empty">请选择候选人查看详情。</div>';
    return;
  }

  const interview = interviews.find((item) => item.candidateId === candidate.id);
  const answers = Object.entries(candidate.customAnswers || {}).map(([label, value]) => `
    <div class="kv-item"><span>${label}</span><strong>${value || '-'}</strong></div>
  `).join('');
  els.candidateDetailContent.innerHTML = `
    <article class="detail-profile">
      <div class="section-head-inline">
        <h4>${candidate.name}</h4>
        <span class="${badgeClass(candidate.status)}">${candidate.status}</span>
      </div>
      <p>${candidate.jobTitle} · ${candidate.contact}</p>
      <div class="kv-grid">
        <div class="kv-item"><span>提交时间</span><strong>${candidate.submittedAt}</strong></div>
        <div class="kv-item"><span>简历</span><strong>${candidate.resume}</strong></div>
        <div class="kv-item"><span>最近动作</span><strong>${candidate.lastAction}</strong></div>
        <div class="kv-item"><span>简历评估</span><strong>${inferResumeAssessment(candidate)}</strong></div>
        <div class="kv-item"><span>面试状态</span><strong>${interview ? interview.attendanceStatus : '暂无安排'}</strong></div>
        <div class="kv-item"><span>面试反馈</span><strong>${interview ? interview.feedback : '待补充'}</strong></div>
        <div class="kv-item"><span>优先级标签</span><strong>${candidate.priorityFlag ? '优先跟进' : '常规跟进'}</strong></div>
        <div class="kv-item"><span>资料活跃度</span><strong>${Math.min(100, 72 + Number(candidate.profileBoost || 0))}</strong></div>
        ${answers}
      </div>
      <div class="candidate-action-center">
        <button class="action-btn" type="button" data-drawer-action="priority" data-id="${candidate.id}">${candidate.priorityFlag ? '取消优先' : '设为优先'}</button>
        <button class="action-btn" type="button" data-drawer-action="request-update" data-id="${candidate.id}">催补资料</button>
        <button class="action-btn" type="button" data-drawer-action="remind-interview" data-id="${candidate.id}">面试提醒</button>
        <button class="action-btn" type="button" data-drawer-action="schedule" data-id="${candidate.id}">安排面试</button>
      </div>
    </article>
  `;
}

function openCandidateDrawer(candidateId) {
  const candidate = candidates.find((item) => item.id === candidateId);
  if (!candidate || !els.candidateDetailDrawer) return;
  renderCandidateDetail(candidate);
  els.candidateDetailDrawer.classList.add('is-open');
  els.candidateDetailDrawer.setAttribute('aria-hidden', 'false');
}

function closeCandidateDrawer() {
  if (!els.candidateDetailDrawer) return;
  els.candidateDetailDrawer.classList.remove('is-open');
  els.candidateDetailDrawer.setAttribute('aria-hidden', 'true');
}

function renderInterviewCandidateOptions() {
  const options = candidates.map((candidate) => `<option value="${candidate.id}">${candidate.name}｜${candidate.jobTitle}</option>`).join('');
  els.interviewCandidateSelect.innerHTML = options || '<option value="">暂无候选人</option>';
}

function renderInterviews() {
  if (!interviews.length) {
    els.interviewList.innerHTML = '<div class="empty">暂无面试安排。</div>';
    return;
  }

  els.interviewList.innerHTML = interviews.map((item) => `
    <article class="interview-item">
      <div class="section-head-inline">
        <h4>${item.candidateName} · ${item.jobTitle}</h4>
        <span class="tag-chip">${item.attendanceStatus}</span>
      </div>
      <div class="meta">面试时间：${formatInterviewTime(item.time)}</div>
      <div class="meta">面试官：${item.interviewer}</div>
      <div class="meta">面试方式：${item.mode}</div>
      <div class="meta">面试反馈：${item.feedback}</div>
      <div class="row-actions row-actions--full">
        <button class="action-btn" type="button" data-interview-action="remind" data-id="${item.candidateId}">发送提醒</button>
        <button class="action-btn" type="button" data-interview-action="feedback" data-id="${item.candidateId}">录入反馈</button>
        <button class="action-btn" type="button" data-interview-action="focus" data-id="${item.candidateId}">查看候选人</button>
      </div>
    </article>
  `).join('');
}

function renderOfferChecklist() {
  if (!els.offerChecklist) return;
  const offerCandidates = candidates.filter((candidate) => candidate.status === '已发录用');
  if (!offerCandidates.length) {
    els.offerChecklist.innerHTML = '<div class="empty">当前暂无进入 offer 阶段的候选人。</div>';
    return;
  }

  els.offerChecklist.innerHTML = offerCandidates.map((candidate) => {
    const interview = interviews.find((item) => item.candidateId === candidate.id);
    const checklist = [
      ['Offer审批', '已完成'],
      ['薪酬沟通', candidate.lastAction.includes('offer') ? '进行中' : '待确认'],
      ['入职材料', candidate.interviewConfirmed ? '待收集' : '待确认'],
      ['入职日期', interview ? '待同步' : '待确认']
    ];
    return `
      <article class="offer-card">
        <div class="section-head-inline">
          <h4>${candidate.name}</h4>
          <span class="tag-chip">${candidate.jobTitle}</span>
        </div>
        <div class="offer-card__items">
          ${checklist.map(([label, status]) => `<div class="kv-item"><span>${label}</span><strong>${status}</strong></div>`).join('')}
        </div>
      </article>
    `;
  }).join('');
}

function renderTaskList() {
  if (!els.taskList) return;
  const pendingCandidates = candidates.filter((candidate) => candidate.status === '待筛选').length;
  const waitingConfirm = interviews.filter((item) => item.attendanceStatus !== '已确认').length;
  const needFeedback = interviews.filter((item) => !item.feedback || item.feedback === '待面试' || item.feedback === '待补充反馈').length;
  const tasks = [
    { label: '待筛选候选人', value: pendingCandidates, hint: '优先完成简历初筛与沟通' },
    { label: '待确认面试', value: waitingConfirm, hint: '提醒候选人确认参会时间' },
    { label: '待补反馈', value: needFeedback, hint: '录入面试结论，推进流程' }
  ];
  els.taskList.innerHTML = tasks.map((task) => `
    <article class="task-card">
      <strong>${task.value}</strong>
      <span>${task.label}</span>
      <small>${task.hint}</small>
    </article>
  `).join('');
}

function renderFunnelGrid() {
  if (!els.funnelGrid) return;
  const total = candidates.length || 1;
  const stages = STATUS_FLOW.map((status) => {
    const count = candidates.filter((candidate) => candidate.status === status).length;
    return { status, count, rate: Math.round((count / total) * 100) };
  });
  els.funnelGrid.innerHTML = stages.map((stage) => `
    <article class="funnel-card">
      <strong>${stage.count}</strong>
      <span>${stage.status}</span>
      <small>转化占比 ${stage.rate}%</small>
    </article>
  `).join('');
}

function renderRecommendedCandidates() {
  if (!els.recommendedCandidates) return;
  const recommended = [...candidates]
    .sort((a, b) => {
      const score = (candidate) => Object.values(candidate.customAnswers || {}).filter(Boolean).length + (candidate.status === '已约面试' ? 2 : 0) + (candidate.status === '已发录用' ? 3 : 0);
      return score(b) - score(a);
    })
    .slice(0, 3);
  if (!recommended.length) {
    els.recommendedCandidates.innerHTML = '<div class="empty">暂无推荐候选人。</div>';
    return;
  }
  els.recommendedCandidates.innerHTML = recommended.map((candidate, index) => `
    <article class="recommend-card recommendation-card">
      <div class="section-head-inline">
        <h4>TOP ${index + 1} · ${candidate.name}</h4>
        <span class="${badgeClass(candidate.status)}">${candidate.status}</span>
      </div>
      <p>${candidate.jobTitle}</p>
      <small>${inferResumeAssessment(candidate)}</small>
    </article>
  `).join('');
}

function renderRecruitmentTasks() {
  renderTaskList();
}

function renderFunnelInsights() {
  renderFunnelGrid();
}

function submitInterviewFeedback(event) {
  submitFeedback(event);
}

function renderPipelineBoard() {
  const stages = STATUS_FLOW.map((status) => ({
    status,
    list: candidates.filter((candidate) => candidate.status === status)
  }));

  els.pipelineBoard.innerHTML = stages.map((stage) => `
    <article class="pipeline-column">
      <div class="pipeline-column__head">
        <h4>${stage.status}</h4>
        <span>${stage.list.length}</span>
      </div>
      <div class="pipeline-column__body">
        ${stage.list.length ? stage.list.map((candidate) => `
          <button type="button" class="pipeline-card" data-pipeline-candidate="${candidate.id}">
            <strong>${candidate.name}</strong>
            <span>${candidate.jobTitle}</span>
            <small>${candidate.lastAction}</small>
            <em>${inferResumeAssessment(candidate)}</em>
          </button>
        `).join('') : '<div class="empty">当前阶段暂无候选人</div>'}
      </div>
    </article>
  `).join('');
}

function renderActivityFeed() {
  const hrFeed = notifications.filter((item) => item.audience.includes('hr') || item.audience.includes('all')).slice(0, 8);
  if (!hrFeed.length) {
    els.activityFeed.innerHTML = '<div class="empty">暂无沟通记录。</div>';
    return;
  }

  els.activityFeed.innerHTML = hrFeed.map((item) => `
    <article class="message-item compact-message">
      <h4>${item.title}</h4>
      <p>${item.body}</p>
      <small>${item.time}${item.candidateName ? ` · ${item.candidateName}` : ''}</small>
    </article>
  `).join('');
}

function renderJobGallery() {
  if (!jobs.length) {
    els.jobGallery.innerHTML = '<div class="empty">暂无可投递岗位。</div>';
    return;
  }

  els.jobGallery.innerHTML = jobs.map((job) => {
    const applicantCount = candidates.filter((candidate) => candidate.jobId === job.id).length;
    const saved = savedJobs.includes(job.id);
    return `
      <article class="job-gallery-card">
        <div class="section-head-inline">
          <h4>${job.title}</h4>
          <span class="tag-chip">${job.department}</span>
        </div>
        <p>${job.description}</p>
        <div class="info-grid-mini">
          <span>已投递：${applicantCount}</span>
          <span>字段：${job.customFields.length || 0}</span>
        </div>
        <small>${job.requirements}</small>
        <div class="row-actions row-actions--full">
          <button class="action-btn" data-job-action="apply" data-job-id="${job.id}">立即申请</button>
          <button class="action-btn" data-job-action="save" data-job-id="${job.id}">${saved ? '取消收藏' : '收藏岗位'}</button>
        </div>
      </article>
    `;
  }).join('');
}

function renderMyApplications() {
  const list = [...candidates].sort((a, b) => String(b.submittedAt).localeCompare(String(a.submittedAt)));
  if (!list.length) {
    els.applicationList.innerHTML = '<div class="empty">你还没有提交任何申请。</div>';
    return;
  }

  els.applicationList.innerHTML = list.map((candidate) => {
    const interview = interviews.find((item) => item.candidateId === candidate.id);
    return `
      <article class="application-card ${candidate.id === currentProfileCandidate()?.id ? 'is-active' : ''}">
        <div class="section-head-inline">
          <h4>${candidate.jobTitle}</h4>
          <span class="${badgeClass(candidate.status)}">${candidate.status}</span>
        </div>
        <p><strong>${candidate.name}</strong> · ${candidate.contact}</p>
        <p>最近进度：${candidate.lastAction}</p>
        <small>${interview ? `面试反馈：${interview.feedback}` : '当前暂无面试反馈'}</small>
        <div class="row-actions row-actions--full">
          <button class="action-btn" data-application-action="view" data-id="${candidate.id}">查看详情</button>
        </div>
      </article>
    `;
  }).join('');
}

function renderTimeline() {
  const candidate = currentProfileCandidate();
  if (!candidate) {
    els.applicantSummary.innerHTML = '<strong>暂无候选人档案</strong><span>请先提交候选人信息。</span>';
    els.timelineList.innerHTML = '<div class="empty">暂无投递进度。</div>';
    return;
  }

  const interview = interviews.find((item) => item.candidateId === candidate.id);
  const stages = [
    {
      title: '已投递',
      body: `${candidate.name} 已完成 ${candidate.jobTitle} 的在线投递，系统已接收简历与补充资料。`,
      meta: `提交时间：${candidate.submittedAt}`
    },
    {
      title: '筛选中',
      body: `HR 正在查看简历，当前评估：${inferResumeAssessment(candidate)}。`,
      meta: `当前动作：${candidate.lastAction}`
    }
  ];

  if (candidate.status === '已约面试' || interview) {
    stages.push({
      title: '面试安排',
      body: interview
        ? `已安排 ${formatInterviewTime(interview.time)} ${interview.mode} 面试，面试官：${interview.interviewer}。`
        : '候选人已进入面试阶段，等待具体面试日程确认。',
      meta: interview ? `候选人确认状态：${interview.attendanceStatus}` : '等待 HR 确认'
    });
  }

  if (candidate.status === '已发录用') {
    stages.push({
      title: '录用沟通',
      body: '候选人已通过评估，系统进入 offer 沟通与入职准备阶段。',
      meta: '下一步：确认入职时间与资料收集'
    });
  }

  els.applicantSummary.innerHTML = `
    <strong>${candidate.name} · ${candidate.jobTitle}</strong>
    <span>${candidate.contact}</span>
    <span>当前状态：${candidate.status}</span>
    <span>当前动作：${candidate.lastAction}</span>
  `;

  els.timelineList.innerHTML = stages.map((stage) => `
    <article class="timeline-item">
      <h4>${stage.title}</h4>
      <p>${stage.body}</p>
      <small>${stage.meta}</small>
    </article>
  `).join('');
}

function renderMessages() {
  const visibleNotifications = getVisibleNotifications();
  const current = currentProfileCandidate();
  els.messageContextTag.textContent = activePersona === 'hr'
    ? '当前视角：HR工作台'
    : `当前视角：求职者中心${current ? ` · ${current.name}` : ''}`;

  if (!visibleNotifications.length) {
    els.messageList.innerHTML = '<div class="empty">暂无消息。</div>';
    return;
  }

  els.messageList.innerHTML = visibleNotifications.map((item) => `
    <article class="message-item">
      <h4>${item.title}</h4>
      <p>${item.body}</p>
      <small>${item.time} · ${item.persona}${item.candidateName ? ` · ${item.candidateName}` : ''}</small>
    </article>
  `).join('');
}

function renderApplicantPortal() {
  const candidate = currentProfileCandidate();
  if (!candidate) {
    els.applicantPortal.innerHTML = '<div class="empty">暂无候选人档案。</div>';
    els.confirmInterviewBtn.disabled = true;
    return;
  }

  const interview = interviews.find((item) => item.candidateId === candidate.id);
  const answerHtml = Object.entries(candidate.customAnswers || {}).map(([label, value]) => `
    <div class="kv-item"><span>${label}</span><strong>${value || '-'}</strong></div>
  `).join('');

  els.applicantPortal.innerHTML = `
    <article class="applicant-portal-card">
      <h4>${candidate.name} 的候选人档案</h4>
      <p>系统正在跟踪该候选人在 ${candidate.jobTitle} 上的投递进度，并同步给 HR 与候选人双方。</p>
      <div class="kv-grid">
        <div class="kv-item"><span>当前状态</span><strong>${candidate.status}</strong></div>
        <div class="kv-item"><span>简历评估</span><strong>${inferResumeAssessment(candidate)}</strong></div>
        <div class="kv-item"><span>联系方式</span><strong>${candidate.contact}</strong></div>
        <div class="kv-item"><span>最近动作</span><strong>${candidate.lastAction}</strong></div>
        <div class="kv-item"><span>面试安排</span><strong>${interview ? `${formatInterviewTime(interview.time)} · ${interview.mode}` : '暂无安排'}</strong></div>
        <div class="kv-item"><span>面试反馈</span><strong>${interview ? interview.feedback : '待更新'}</strong></div>
        ${answerHtml}
      </div>
    </article>
  `;

  els.confirmInterviewBtn.disabled = !(interview && interview.attendanceStatus !== '已确认');
}

function renderWorkspaceView() {
  if (activePersona === 'hr') {
    els.workspaceView.innerHTML = `
      <strong>当前视角：HR工作台</strong>
      <span>正在查看工作台总览、人才流程看板、候选人列表、面试安排与候选人沟通记录。</span>
    `;
    return;
  }

  const candidate = currentProfileCandidate();
  els.workspaceView.innerHTML = `
    <strong>当前视角：求职者中心</strong>
    <span>正在查看岗位大厅、我的申请、投递进度与仅属于${candidate ? candidate.name : '当前候选人'}的消息流。</span>
  `;
}

function renderOpsHealth() {
  if (!els.opsHealth) return;
  const total = candidates.length || 1;
  const interviewRate = Math.round((candidates.filter((item) => item.status === '已约面试').length / total) * 100);
  const offerRate = Math.round((candidates.filter((item) => item.status === '已发录用').length / total) * 100);
  const confirmedRate = interviews.length
    ? Math.round((interviews.filter((item) => item.attendanceStatus === '已确认').length / interviews.length) * 100)
    : 0;
  const avgScore = Math.round(candidates.reduce((sum, item) => sum + getCandidateScore(item), 0) / total);

  const cards = [
    ['面试转化率', `${interviewRate}%`, '观察筛选进入面试的效率'],
    ['Offer达成率', `${offerRate}%`, '衡量高质量候选人推进结果'],
    ['面试确认率', `${confirmedRate}%`, '确认候选人是否响应面试安排'],
    ['候选人均分', `${avgScore}`, '综合资料完整度与流程状态生成']
  ];

  els.opsHealth.innerHTML = cards.map(([title, value, hint]) => `
    <article class="health-card">
      <strong>${value}</strong>
      <span>${title}</span>
      <small>${hint}</small>
    </article>
  `).join('');
}

function renderOpsAlerts() {
  if (!els.opsAlerts) return;
  const pending = candidates.filter((item) => item.status === '待筛选');
  const waitingConfirm = interviews.filter((item) => item.attendanceStatus !== '已确认');
  const offerList = candidates.filter((item) => item.status === '已发录用');
  const latestMessage = notifications[0];

  const alerts = [
    pending[0]
      ? ['优先初筛', `${pending[0].name} 仍在待筛选阶段，建议先处理简历并更新状态。`, `${pending.length} 位候选人待筛选`]
      : ['初筛队列健康', '当前没有待筛选积压，可继续跟进面试和 offer。', '初筛队列清空'],
    waitingConfirm[0]
      ? ['待确认面试', `${waitingConfirm[0].candidateName} 的面试还未确认，建议提醒候选人。`, `${waitingConfirm.length} 场面试待确认`]
      : ['面试确认正常', '当前面试安排都已确认，流程推进顺畅。', '面试确认率良好'],
    offerList[0]
      ? ['Offer推进', `${offerList[0].name} 已进入 offer 阶段，可继续跟进入职材料与时间。`, `${offerList.length} 位候选人处于 offer 阶段`]
      : ['Offer池为空', '当前暂无 offer 阶段候选人，可加快面试反馈录入。', '建议推进高分候选人'],
    latestMessage
      ? ['最新动态', latestMessage.body, latestMessage.time]
      : ['消息中心', '暂无最新动态。', '等待业务动作触发']
  ];

  els.opsAlerts.innerHTML = alerts.map(([title, body, meta]) => `
    <article class="alert-card">
      <strong>${title}</strong>
      <span>${body}</span>
      <small>${meta}</small>
    </article>
  `).join('');
}

function renderJourneyMap() {
  if (!els.journeyMap) return;
  const current = currentProfileCandidate();
  const currentStatus = current?.status || '待筛选';
  const stageMeta = [
    ['待筛选', '候选人已投递，HR 正在查看简历'],
    ['已约面试', '双方开始面试协同与确认'],
    ['已发录用', '进入 offer 沟通与入职准备']
  ];

  els.journeyMap.innerHTML = stageMeta.map(([status, hint]) => `
    <article class="journey-stage ${currentStatus === status ? 'is-active' : ''}">
      <strong>${status}</strong>
      <span>${hint}</span>
      <small>${candidates.filter((item) => item.status === status).length} 人处于该阶段</small>
    </article>
  `).join('');
}

function handleQuickAction(action) {
  if (action === 'switch-hr') {
    activateWorkspaceView('hr', 'hr');
    return;
  }
  if (action === 'switch-applicant') {
    activateWorkspaceView('applicant', 'applicant');
    return;
  }
  if (action === 'new-apply') {
    activateWorkspaceView('applicant', 'applicant');
    focusField('#candidate-form input[name="name"]');
    return;
  }
  if (action === 'schedule-interview') {
    const target = candidates.find((item) => item.status === '待筛选') || candidates[0];
    if (!target) return;
    scheduleInterviewFromPipeline(target.id);
    return;
  }
  if (action === 'focus-offer') {
    const offerCandidate = candidates.find((item) => item.status === '已发录用') || candidates[0];
    if (!offerCandidate) return;
    activateWorkspaceView('hr', 'hr');
    setProfileCandidate(offerCandidate.id);
    openCandidateDrawer(offerCandidate.id);
  }
}

function syncViews() {
  renderDashboard();
  renderJobs();
  renderJobOptions();
  renderCandidateFilterOptions();
  renderDynamicFields();
  renderCandidates();
  renderInterviewCandidateOptions();
  renderFeedbackCandidateOptions();
  renderInterviews();
  renderOfferChecklist();
  renderTaskList();
  renderFunnelGrid();
  renderRecommendedCandidates();
  renderProfileOptions();
  const current = currentProfileCandidate();
  if (current) els.profileCandidateSelect.value = current.id;
  renderPipelineBoard();
  renderJobGallery();
  renderMyApplications();
  renderTimeline();
  renderMessages();
  renderApplicantPortal();
  renderWorkspaceView();
  renderActivityFeed();
  renderOpsHealth();
  renderOpsAlerts();
  renderJourneyMap();
}

function submitJob(event) {
  event.preventDefault();
  const formData = new FormData(els.jobForm);
  const customFields = String(formData.get('customFields') || '')
    .split(/[，,、]/)
    .map((item) => item.trim())
    .filter(Boolean);

  const job = {
    id: crypto.randomUUID(),
    title: String(formData.get('title')).trim(),
    department: String(formData.get('department')).trim(),
    description: String(formData.get('description')).trim(),
    requirements: String(formData.get('requirements')).trim(),
    customFields
  };

  jobs.unshift(job);
  persistAll();
  els.jobForm.reset();
  syncViews();
  pushNotification('岗位已发布', `${job.title} 已创建，可立即对外开放投递。`, 'hr', {
    audience: ['hr', 'applicant']
  });
}

function submitCandidate(event) {
  event.preventDefault();
  const formData = new FormData(els.candidateForm);
  const selectedJob = jobs.find((job) => job.id === formData.get('jobId'));
  if (!selectedJob) {
    pushNotification('投递失败', '请先发布岗位，再提交候选人信息。', 'applicant', { audience: ['applicant'] });
    return;
  }

  const customAnswers = {};
  els.dynamicFields.querySelectorAll('input[data-custom-label]').forEach((input) => {
    customAnswers[input.dataset.customLabel] = input.value.trim();
  });

  const candidate = {
    id: crypto.randomUUID(),
    name: String(formData.get('name')).trim(),
    contact: String(formData.get('contact')).trim(),
    jobId: selectedJob.id,
    jobTitle: selectedJob.title,
    resume: String(formData.get('resume')).trim(),
    status: '待筛选',
    submittedAt: formatDateTime(),
    customAnswers,
    lastAction: '已提交申请，等待 HR 初筛',
    interviewConfirmed: false
  };

  candidates.unshift(candidate);
  persistAll();
  els.candidateForm.reset();
  renderJobOptions();
  els.candidateJobSelect.value = selectedJob.id;
  renderDynamicFields();
  renderProfileOptions();
  els.profileCandidateSelect.value = candidate.id;
  syncViews();
  pushNotification('已收到新投递', `${candidate.name} 已申请 ${selectedJob.title}，系统已进入筛选队列。`, 'hr', {
    audience: ['hr'],
    candidateId: candidate.id,
    candidateName: candidate.name
  });
  pushNotification('投递成功', `你已成功投递 ${selectedJob.title}，可在“我的申请”中持续查看进度。`, 'applicant', {
    audience: ['applicant'],
    candidateId: candidate.id,
    candidateName: candidate.name
  });
}

function submitInterview(event) {
  event.preventDefault();
  const formData = new FormData(els.interviewForm);
  const candidate = candidates.find((item) => item.id === formData.get('candidateId'));
  if (!candidate) {
    pushNotification('面试创建失败', '请先录入候选人，再安排面试。', 'hr', { audience: ['hr'] });
    return;
  }

  const exists = interviews.find((item) => item.candidateId === candidate.id);
  const interview = {
    id: exists?.id || crypto.randomUUID(),
    candidateId: candidate.id,
    candidateName: candidate.name,
    jobTitle: candidate.jobTitle,
    time: String(formData.get('time')),
    interviewer: String(formData.get('interviewer')).trim(),
    mode: String(formData.get('mode')).trim(),
    attendanceStatus: '待确认',
    feedback: exists?.feedback || '待面试'
  };

  interviews = exists
    ? interviews.map((item) => item.id === exists.id ? interview : item)
    : [interview, ...interviews];

  candidate.status = '已约面试';
  candidate.lastAction = `已安排${formatInterviewTime(interview.time)} ${interview.mode}面试，等待候选人确认`;
  candidate.interviewConfirmed = false;
  persistAll();
  els.interviewForm.reset();
  syncViews();
  pushNotification('面试已安排', `已为 ${candidate.name} 安排面试，候选人进度已更新为“已约面试”。`, 'hr', {
    audience: ['hr'],
    candidateId: candidate.id,
    candidateName: candidate.name
  });
  pushNotification('收到面试邀请', `${candidate.jobTitle} 已安排 ${formatInterviewTime(interview.time)} ${interview.mode} 面试，请确认是否参加。`, 'applicant', {
    audience: ['applicant'],
    candidateId: candidate.id,
    candidateName: candidate.name
  });
}

function submitFeedback(event) {
  event.preventDefault();
  const formData = new FormData(els.feedbackForm);
  const candidate = candidates.find((item) => item.id === formData.get('candidateId'));
  const interview = interviews.find((item) => item.candidateId === formData.get('candidateId'));
  if (!candidate || !interview) {
    pushNotification('反馈提交失败', '请先创建面试安排，再录入反馈。', 'hr', { audience: ['hr'] });
    return;
  }

  const verdict = String(formData.get('verdict')).trim();
  const feedback = String(formData.get('feedback')).trim();
  interview.feedback = `${verdict}：${feedback}`;
  if (verdict === '继续推进') {
    candidate.status = '已发录用';
    candidate.lastAction = '面试通过，进入 offer 沟通与入职准备';
  } else if (verdict === '补充沟通') {
    candidate.status = '已约面试';
    candidate.lastAction = '已完成面试，等待补充沟通与复核';
  } else {
    candidate.status = '待筛选';
    candidate.lastAction = '面试后暂缓推进，保留人才池观察';
  }
  persistAll();
  els.feedbackForm.reset();
  syncViews();
  pushNotification('面试反馈已录入', `${candidate.name} 的面试反馈已提交：${interview.feedback}。`, 'hr', {
    audience: ['hr'],
    candidateId: candidate.id,
    candidateName: candidate.name
  });
  pushNotification('流程进展通知', `你的 ${candidate.jobTitle} 面试已完成更新：${verdict}。`, 'applicant', {
    audience: ['applicant'],
    candidateId: candidate.id,
    candidateName: candidate.name
  });
}

function updateCandidateStatus(id, status, source = 'hr') {
  const candidate = candidates.find((item) => item.id === id);
  if (!candidate) return;
  candidate.status = status;
  if (status === '待筛选') candidate.lastAction = '已回到筛选阶段，等待 HR 继续处理';
  if (status === '已约面试') candidate.lastAction = '已推进到面试阶段，等待确认面试安排';
  if (status === '已发录用') candidate.lastAction = '已通过最终评估，进入 offer 沟通';
  persistAll();
  syncViews();
  pushNotification('状态已更新', `${candidate.name} 的流程状态已更新为“${status}”。`, source, {
    audience: ['hr'],
    candidateId: candidate.id,
    candidateName: candidate.name
  });
  pushNotification('申请状态更新', `你的 ${candidate.jobTitle} 申请状态已更新为“${status}”。`, 'applicant', {
    audience: ['applicant'],
    candidateId: candidate.id,
    candidateName: candidate.name
  });
}

function setProfileCandidate(candidateId) {
  if (!candidateId || !candidates.some((candidate) => candidate.id === candidateId)) return;
  els.profileCandidateSelect.value = candidateId;
  renderTimeline();
  renderApplicantPortal();
  renderMessages();
  renderMyApplications();
  renderWorkspaceView();
}

function setPersona(persona) {
  activePersona = persona;
  document.body.dataset.persona = activePersona;
  save(STORAGE_KEYS.activePersona, activePersona);
  document.querySelectorAll('.persona-chip').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.persona === activePersona);
  });
  document.querySelectorAll('.persona-panel').forEach((panel) => {
    panel.classList.toggle('is-active', panel.dataset.panel === activePersona);
  });
  renderMessages();
  renderWorkspaceView();
}

function setActiveView(view) {
  activeView = view || 'overview';
  document.body.dataset.activeView = activeView;
  if (els.container) els.container.dataset.activeView = activeView;
  save(STORAGE_KEYS.activeView, activeView);
  els.viewPanels.forEach((panel) => {
    panel.classList.toggle('is-active', panel.dataset.viewPanel === activeView);
  });
  els.viewButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.viewTarget === activeView);
  });
}

function activateWorkspaceView(view, persona) {
  if (persona) setPersona(persona);
  setActiveView(view);
}

function focusField(selector) {
  const target = document.querySelector(selector);
  if (target && typeof target.focus === 'function') {
    target.focus();
  }
}

function scheduleInterviewFromPipeline(candidateId) {
  const candidate = candidates.find((item) => item.id === candidateId);
  if (!candidate) return;
  activateWorkspaceView('hr', 'hr');
  els.interviewCandidateSelect.value = candidate.id;
  focusField('#interview-form input[name="time"]');
  pushNotification('待安排面试', `已为 ${candidate.name} 打开面试安排表单，可继续填写时间与面试官。`, 'hr', {
    audience: ['hr'],
    candidateId: candidate.id,
    candidateName: candidate.name
  });
}

function focusJobFromGallery(jobId) {
  const job = jobs.find((item) => item.id === jobId);
  if (!job) return;
  activateWorkspaceView('applicant', 'applicant');
  els.candidateJobSelect.value = job.id;
  renderDynamicFields();
  pushNotification('岗位已带入投递表单', `${job.title} 已填入投递表单，可继续补充资料。`, 'applicant', {
    audience: ['applicant']
  });
  focusField('#candidate-form input[name="name"]');
}

function toggleSavedJob(jobId) {
  savedJobs = savedJobs.includes(jobId)
    ? savedJobs.filter((id) => id !== jobId)
    : [...savedJobs, jobId];
  persistAll();
  renderJobGallery();
}

function toggleCandidatePriority(candidateId) {
  const candidate = candidates.find((item) => item.id === candidateId);
  if (!candidate) return;
  candidate.priorityFlag = !candidate.priorityFlag;
  candidate.lastAction = candidate.priorityFlag ? '已标记为优先跟进，建议快速推进' : '已恢复常规跟进节奏';
  persistAll();
  syncViews();
  if (activePersona === 'hr') openCandidateDrawer(candidateId);
  pushNotification(
    candidate.priorityFlag ? '候选人已标记优先' : '候选人已取消优先',
    `${candidate.name} 当前为${candidate.priorityFlag ? '优先跟进' : '常规跟进'}状态。`,
    'hr',
    { audience: ['hr'], candidateId: candidate.id, candidateName: candidate.name }
  );
}

function requestCandidateUpdate(candidateId) {
  const candidate = candidates.find((item) => item.id === candidateId);
  if (!candidate) return;
  candidate.lastAction = 'HR 已发起补充资料请求，等待候选人更新材料';
  candidate.profileBoost = Math.min(14, Number(candidate.profileBoost || 0) + 2);
  persistAll();
  syncViews();
  if (activePersona === 'hr') openCandidateDrawer(candidateId);
  pushNotification('已请求补充资料', `已通知 ${candidate.name} 补充 ${candidate.jobTitle} 相关材料。`, 'hr', {
    audience: ['hr'], candidateId: candidate.id, candidateName: candidate.name
  });
  pushNotification('请补充候选人资料', `HR 希望你补充 ${candidate.jobTitle} 的最新材料或说明。`, 'applicant', {
    audience: ['applicant'], candidateId: candidate.id, candidateName: candidate.name
  });
}

function sendInterviewReminder(candidateId) {
  const candidate = candidates.find((item) => item.id === candidateId);
  const interview = interviews.find((item) => item.candidateId === candidateId);
  if (!candidate || !interview) return;
  candidate.lastAction = `HR 已发送面试提醒，请留意 ${formatInterviewTime(interview.time)} 的安排`;
  persistAll();
  syncViews();
  if (activePersona === 'hr' && els.candidateDetailDrawer?.classList.contains('is-open')) openCandidateDrawer(candidateId);
  pushNotification('已发送面试提醒', `已提醒 ${candidate.name} 关注 ${formatInterviewTime(interview.time)} 的${interview.mode}面试。`, 'hr', {
    audience: ['hr'], candidateId: candidate.id, candidateName: candidate.name
  });
  pushNotification('面试提醒', `请留意 ${formatInterviewTime(interview.time)} 的${candidate.jobTitle}${interview.mode}面试安排。`, 'applicant', {
    audience: ['applicant'], candidateId: candidate.id, candidateName: candidate.name
  });
}

function openFeedbackForCandidate(candidateId) {
  const candidate = candidates.find((item) => item.id === candidateId);
  if (!candidate) return;
  activateWorkspaceView('hr', 'hr');
  els.feedbackCandidateSelect.value = candidateId;
  focusField('#feedback-form textarea[name="feedback"]');
  pushNotification('已定位反馈表单', `可继续录入 ${candidate.name} 的面试反馈。`, 'hr', {
    audience: ['hr'], candidateId: candidate.id, candidateName: candidate.name
  });
}

function refreshCandidateProfile() {
  const candidate = currentProfileCandidate();
  if (!candidate) return;
  candidate.profileBoost = Math.min(14, Number(candidate.profileBoost || 0) + 6);
  candidate.lastAction = '候选人已补充最新资料，等待 HR 查看更新';
  persistAll();
  syncViews();
  pushNotification('候选人已更新资料', `${candidate.name} 已补充 ${candidate.jobTitle} 的最新资料与说明。`, 'hr', {
    audience: ['hr'], candidateId: candidate.id, candidateName: candidate.name
  });
  pushNotification('资料更新成功', '你补充的最新资料已同步给 HR，可继续关注流程进度。', 'applicant', {
    audience: ['applicant'], candidateId: candidate.id, candidateName: candidate.name
  });
}

function requestPriorityReview() {
  const candidate = currentProfileCandidate();
  if (!candidate) return;
  candidate.lastAction = '候选人主动请求优先查看，等待 HR 处理';
  persistAll();
  syncViews();
  pushNotification('收到优先查看请求', `${candidate.name} 请求优先查看 ${candidate.jobTitle} 的申请进度。`, 'applicant', {
    audience: ['hr'], candidateId: candidate.id, candidateName: candidate.name
  });
  pushNotification('已向 HR 发送提醒', '你的优先查看请求已发送，可在消息中心查看后续反馈。', 'applicant', {
    audience: ['applicant'], candidateId: candidate.id, candidateName: candidate.name
  });
}

function confirmInterviewAttendance() {
  const candidate = currentProfileCandidate();
  if (!candidate) return;
  const interview = interviews.find((item) => item.candidateId === candidate.id);
  if (!interview || interview.attendanceStatus === '已确认') return;
  interview.attendanceStatus = '已确认';
  candidate.interviewConfirmed = true;
  candidate.lastAction = '候选人已确认参加面试，等待正式面试';
  persistAll();
  syncViews();
  pushNotification('候选人已确认面试', `${candidate.name} 已确认参加 ${formatInterviewTime(interview.time)} 的${interview.mode}面试。`, 'hr', {
    audience: ['hr'],
    candidateId: candidate.id,
    candidateName: candidate.name
  });
  pushNotification('已确认参加面试', `你已确认参加 ${candidate.jobTitle} 的面试，系统已同步给 HR。`, 'applicant', {
    audience: ['applicant'],
    candidateId: candidate.id,
    candidateName: candidate.name
  });
}

function bindEvents() {
  els.jobForm.addEventListener('submit', submitJob);
  els.candidateForm.addEventListener('submit', submitCandidate);
  els.interviewForm.addEventListener('submit', submitInterview);
  els.feedbackForm?.addEventListener('submit', submitFeedback);
  els.candidateJobSelect.addEventListener('change', renderDynamicFields);
  els.candidateSearch.addEventListener('input', renderCandidates);
  els.candidateStatusFilter?.addEventListener('change', renderCandidates);
  els.candidateJobFilter?.addEventListener('change', renderCandidates);
  els.candidateSort?.addEventListener('change', renderCandidates);
  els.resetFiltersBtn?.addEventListener('click', () => {
    if (els.candidateSearch) els.candidateSearch.value = '';
    if (els.candidateStatusFilter) els.candidateStatusFilter.value = 'all';
    if (els.candidateJobFilter) els.candidateJobFilter.value = 'all';
    if (els.candidateSort) els.candidateSort.value = 'latest';
    renderCandidates();
  });
  els.profileCandidateSelect.addEventListener('change', () => setProfileCandidate(els.profileCandidateSelect.value));
  els.confirmInterviewBtn.addEventListener('click', confirmInterviewAttendance);
  els.refreshProfileBtn?.addEventListener('click', refreshCandidateProfile);
  els.requestReviewBtn?.addEventListener('click', requestPriorityReview);
  els.closeDrawerBtn?.addEventListener('click', closeCandidateDrawer);
  els.candidateDetailDrawer?.addEventListener('click', (event) => {
    if (event.target === els.candidateDetailDrawer) closeCandidateDrawer();
    const button = event.target.closest('button[data-drawer-action]');
    if (!button) return;
    const candidateId = button.dataset.id;
    const action = button.dataset.drawerAction;
    if (action === 'priority') toggleCandidatePriority(candidateId);
    if (action === 'request-update') requestCandidateUpdate(candidateId);
    if (action === 'remind-interview') sendInterviewReminder(candidateId);
    if (action === 'schedule') scheduleInterviewFromPipeline(candidateId);
  });

  els.candidateTableBody.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const id = button.dataset.id;
    const action = button.dataset.action;
    if (action === 'screen') updateCandidateStatus(id, '待筛选');
    if (action === 'interview') updateCandidateStatus(id, '已约面试');
    if (action === 'offer') updateCandidateStatus(id, '已发录用');
    if (action === 'focus') {
      activateWorkspaceView('hr', 'hr');
      openCandidateDrawer(id);
    }
  });

  els.personaSwitch.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-persona]');
    if (!button) return;
    setPersona(button.dataset.persona);
  });

  els.topbarNav?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-view-target]');
    if (!button) return;
    const view = button.dataset.viewTarget;
    if (view === 'hr') return activateWorkspaceView('hr', 'hr');
    if (view === 'applicant') return activateWorkspaceView('applicant', 'applicant');
    setActiveView(view);
  });

  els.jobGallery.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-job-action]');
    if (!button) return;
    const jobId = button.dataset.jobId;
    const action = button.dataset.jobAction;
    if (action === 'apply') focusJobFromGallery(jobId);
    if (action === 'save') toggleSavedJob(jobId);
  });

  els.quickActions?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-quick-action]');
    if (!button) return;
    handleQuickAction(button.dataset.quickAction);
  });

  els.applicationList.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-application-action="view"]');
    if (!button) return;
    setProfileCandidate(button.dataset.id);
  });

  els.interviewList.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-interview-action]');
    if (!button) return;
    const candidateId = button.dataset.id;
    const action = button.dataset.interviewAction;
    if (action === 'remind') sendInterviewReminder(candidateId);
    if (action === 'feedback') openFeedbackForCandidate(candidateId);
    if (action === 'focus') {
      activateWorkspaceView('hr', 'hr');
      openCandidateDrawer(candidateId);
    }
  });

  els.pipelineBoard.addEventListener('click', (event) => {
    const card = event.target.closest('[data-pipeline-candidate]');
    if (!card) return;
    setProfileCandidate(card.dataset.pipelineCandidate);
    scheduleInterviewFromPipeline(card.dataset.pipelineCandidate);
  });
}

function init() {
  normalizeData();
  persistAll();
  document.body.dataset.persona = activePersona;
  document.body.dataset.activeView = activeView;
  syncViews();
  bindEvents();
  setPersona(activePersona);
  setActiveView(activeView);
}

init();


document.querySelectorAll('[data-view-target]').forEach((button) => {
  if (button.closest('#topbar-nav')) return;
  button.addEventListener('click', () => {
    const view = button.dataset.viewTarget;
    if (view === 'hr') return activateWorkspaceView('hr', 'hr');
    if (view === 'applicant') return activateWorkspaceView('applicant', 'applicant');
    setActiveView(view);
  });
});
