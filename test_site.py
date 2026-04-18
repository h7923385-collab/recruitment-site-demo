from pathlib import Path

BASE = Path(__file__).parent
INDEX = BASE / 'index.html'
STYLE = BASE / 'styles.css'
SCRIPT = BASE / 'app.js'


def test_required_files_exist():
    assert INDEX.exists(), 'index.html should exist'
    assert STYLE.exists(), 'styles.css should exist'
    assert SCRIPT.exists(), 'app.js should exist'


def test_required_functional_sections_present():
    html = INDEX.read_text(encoding='utf-8')
    for text in [
        '岗位信息发布',
        '候选人投递表单',
        '候选人列表',
        '面试安排',
        '数据统计看板',
        '岗位名称',
        '职责描述',
        '任职要求',
        '姓名',
        '联系方式',
        '应聘岗位',
        '简历上传',
    ]:
        assert text in html, f'missing required text: {text}'


def test_visual_upgrade_markers_present():
    html = INDEX.read_text(encoding='utf-8')
    css = STYLE.read_text(encoding='utf-8')
    for text in [
        'topbar',
        '流程概览',
        '角色视角切换',
        'HR工作台',
        '求职者中心',
        '消息中心',
        '系统总览',
        '运营驾驶舱',
        'glass-orb',
        'hero-metrics',
    ]:
        assert text in html, f'missing upgraded visual marker: {text}'

    for text in [
        'Source Sans 3',
        '--stripe-purple',
        '.topbar',
        '.feature-card',
        '.hero-metric',
        '.glass-orb',
        '.persona-switch',
        '.timeline-card',
    ]:
        assert text in css, f'missing upgraded style marker: {text}'


def test_professional_positioning_and_role_system_present():
    html = INDEX.read_text(encoding='utf-8')
    js = SCRIPT.read_text(encoding='utf-8')
    css = STYLE.read_text(encoding='utf-8')
    for text in [
        '企业级招聘管理平台',
        'HR工作台',
        '求职者中心',
        '角色视角切换',
        '投递进度',
        '消息中心',
        '简历评估',
        '工作台总览',
        '人才流程看板',
        '岗位大厅',
        '我的申请',
        '候选人沟通记录',
        '关键招聘待办',
        '招聘漏斗分析',
        '智能筛选器',
        '候选人详情',
        '面试反馈录入',
        'Offer入职清单',
        '推荐候选人',
    ]:
        assert text in html, f'missing professional role marker: {text}'

    for text in [
        'activePersona',
        'setPersona',
        'renderTimeline',
        'renderMessages',
        'renderApplicantPortal',
        'renderPipelineBoard',
        'renderJobGallery',
        'getVisibleNotifications',
        'confirmInterviewAttendance',
        'focusJobFromGallery',
        'workspace-view',
        'renderTaskList',
        'renderFunnelGrid',
        'renderCandidateDetail',
        'submitFeedback',
        'submitInterviewFeedback',
        'applyCandidateFilters',
        'openCandidateDrawer',
        'closeCandidateDrawer',
        'renderOfferChecklist',
        'renderRecommendedCandidates',
        'candidateStatusFilter',
        'candidateJobFilter',
        'toggleCandidatePriority',
        'requestCandidateUpdate',
        'sendInterviewReminder',
        'refreshCandidateProfile',
        'requestPriorityReview',
        'openFeedbackForCandidate',
        'activeView',
        'setActiveView',
        'activateWorkspaceView',
    ]:
        assert text in js, f'missing professional interaction marker: {text}'

    for text in [
        '.filters-bar',
        '.recruitment-filters',
        '.task-list',
        '.detail-drawer',
        '.funnel-grid',
        '.recommendation-card',
        '.three-col-layout',
        '.view-panel',
        '.topbar__nav-btn',
    ]:
        assert text in css, f'missing advanced interaction style marker: {text}'


def test_no_teacher_or_assignment_wording_left():
    html = INDEX.read_text(encoding='utf-8')
    for text in ['老师', '作业', '答辩', '展示版']:
        assert text not in html, f'should remove classroom wording: {text}'


def test_required_interactions_implemented():
    js = SCRIPT.read_text(encoding='utf-8')
    for text in [
        'localStorage',
        'renderCandidates',
        'renderJobs',
        'renderInterviews',
        'renderDashboard',
        'submitCandidate',
        'submitJob',
        'pushNotification',
    ]:
        assert text in js, f'missing required behavior marker: {text}'


def test_filter_drawer_and_feedback_modules_present():
    html = INDEX.read_text(encoding='utf-8')
    js = SCRIPT.read_text(encoding='utf-8')
    css = STYLE.read_text(encoding='utf-8')

    for text in [
        'candidate-status-filter',
        'candidate-job-filter',
        'reset-filters-btn',
        'candidate-detail-drawer',
        'candidate-detail-content',
        'close-drawer-btn',
        'feedback-form',
        'feedback-candidate-select',
        'offer-checklist',
        'task-list',
        'funnel-grid',
        'recommended-candidates',
        'refresh-profile-btn',
        'request-review-btn',
    ]:
        assert text in html, f'missing enhanced module marker: {text}'

    for text in [
        'renderCandidateFilterOptions',
        'renderFeedbackCandidateOptions',
        'submitFeedback',
        'renderOfferChecklist',
        'renderTaskList',
        'renderFunnelGrid',
        'renderRecommendedCandidates',
        'closeCandidateDrawer',
        'toggleCandidatePriority',
        'requestCandidateUpdate',
        'sendInterviewReminder',
        'refreshCandidateProfile',
        'requestPriorityReview',
        'openFeedbackForCandidate',
        'activeView',
        'setActiveView',
        'activateWorkspaceView',
    ]:
        assert text in js, f'missing enhanced behavior marker: {text}'

    for text in [
        '.filters-bar',
        '.detail-drawer__panel',
        '.task-card',
        '.funnel-card',
        '.offer-card',
        '.candidate-action-center',
        '.applicant-action-strip',
    ]:
        assert text in css, f'missing enhanced style marker: {text}'
