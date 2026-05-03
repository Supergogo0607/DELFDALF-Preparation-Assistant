import { state } from './state.js';
import { CONFIG } from './config.js';

// ==================== Toast ====================
export function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

// ==================== Loading ====================
export function showLoading(containerId, msg) {
    const el = document.getElementById(containerId);
    if (el) el.innerHTML = `<div class="text-center" style="padding:80px 0;">
        <div class="spinner"></div>
        <p style="margin-top:20px;color:var(--text-secondary);">${msg || state.t('generating')}</p>
    </div>`;
}

// ==================== Main Render ====================
export function render() {
    const app = document.getElementById('app');

    // 邀请码验证
    const entered = localStorage.getItem('invite_code');
    if (entered !== CONFIG.INVITE_CODE) { app.innerHTML = renderInviteGate(); return; }
    if (!CONFIG.WORKER_URL) { app.innerHTML = renderNoWorker(); return; }

    if (!state.currentMode) { app.innerHTML = renderHome(); return; }

    if (state.currentMode === 'learning') {
        if (!state.userLevel) { app.innerHTML = renderLevelSelect(); return; }
        if (!state.session) { app.innerHTML = renderArticleInput(); return; }
        app.innerHTML = renderSessionPage();
    } else if (state.currentMode === 'review') {
        app.innerHTML = renderReview();
    } else if (state.currentMode === 'import') {
        app.innerHTML = renderImport();
    }
}

// ==================== Gates ====================
function renderNoWorker() {
    return `<div class="content-card" style="max-width:600px;margin:60px auto;text-align:center;">
        <p style="color:var(--text-secondary);">Worker URL not configured.</p>
    </div>`;
}

function renderInviteGate() {
    return `<div class="invite-gate fade-in">
        <div style="font-size:48px;margin-bottom:24px;">🔐</div>
        <h2 style="font-family:'Crimson Pro',serif;margin-bottom:8px;font-size:24px;">DELF DALF Pro</h2>
        <p style="color:var(--text-secondary);margin-bottom:24px;font-size:14px;">内测版本 · 请输入访问码</p>
        <input type="text" id="invite-input" placeholder="访问码" style="text-align:center;margin-bottom:16px;">
        <button class="btn btn-primary" style="width:100%;" id="invite-btn">进入</button>
    </div>`;
}

// ==================== Home ====================
function renderHome() {
    const due = state.getTodayReviews().length;
    return `<div class="fade-in">
        <h1 class="text-center" style="font-size:42px;font-weight:700;margin-bottom:12px;font-family:'Crimson Pro',serif;">${state.t('appTitle')}</h1>
        <p class="text-center" style="font-size:16px;color:var(--text-secondary);margin-bottom:60px;">${state.t('selectMode')}</p>
        <div class="mode-grid">
            <div class="mode-card" id="btn-learning">
                <div class="mode-icon">📚</div>
                <div class="mode-title">${state.t('learningMode')}</div>
                <div class="mode-desc">${state.t('learningDesc')}</div>
            </div>
            <div class="mode-card" id="btn-review">
                <div class="mode-icon">🔄</div>
                <div class="mode-title">${state.t('reviewMode')}</div>
                <div class="mode-desc">${state.t('reviewDesc')}</div>
                ${due > 0 ? `<div style="margin-top:20px;padding:12px;background:rgba(166,123,123,0.1);border-radius:8px;color:var(--accent-warm);font-weight:600;font-size:14px;">${state.t('todayReview')}: ${due} ${state.t('words')}</div>` : ''}
            </div>
            <div class="mode-card" id="btn-import">
                <div class="mode-icon">📥</div>
                <div class="mode-title">${state.t('importMode')}</div>
                <div class="mode-desc">${state.t('importDesc')}</div>
            </div>
        </div>
    </div>`;
}

// ==================== Level Select ====================
function renderLevelSelect() {
    return `<div class="fade-in"><div class="learning-content">
        <div class="content-card text-center">
            <h2 class="section-title">${state.t('selectLevel')}</h2>
            <div class="mode-grid" style="margin-top:40px;">
                ${['A1','A2','B1','B2','C1','C2'].map(lv => `
                    <div class="mode-card level-card" data-level="${lv}" style="padding:32px;">
                        <div style="font-size:36px;font-weight:700;margin-bottom:12px;font-family:'Crimson Pro',serif;">${lv}</div>
                        <div style="font-size:13px;color:var(--text-secondary);">${state.t('levelDesc.'+lv)}</div>
                    </div>`).join('')}
            </div>
        </div>
    </div></div>`;
}

// ==================== Article Input ====================
function renderArticleInput() {
    const t = state.calcTime('');
    return `<div class="fade-in"><div class="learning-content">
        <div class="content-card">
            <div class="flex justify-between items-center mb-20">
                <div class="flex items-center gap-12">
                    <span class="level-badge">${state.userLevel}</span>
                    <span class="time-estimate">
                        <svg style="width:14px;height:14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        ~${state.calcTime(state.articleText)||20} ${state.t('minutes')}
                    </span>
                </div>
                <button class="btn btn-secondary" id="btn-change-level">${state.t('back')}</button>
            </div>
            <label class="input-label">${state.t('inputArticle')}</label>
            <textarea id="article-input" style="min-height:300px;" placeholder="Collez votre article ici...">${state.articleText || ''}</textarea>
            <div class="flex justify-between items-center mt-20">
                <span id="wc" style="color:var(--text-secondary);font-size:14px;">0 ${state.t('wordCount')}</span>
                <div class="flex gap-12">
                    <button class="btn btn-secondary" id="btn-back-home">${state.t('back')}</button>
                    <button class="btn btn-primary" id="btn-start">${state.t('start')}</button>
                </div>
            </div>
        </div>
    </div></div>`;
}

// ==================== Session Page (关卡界面) ====================
export function renderSessionPage() {
    const s = state.session;
    const activeStage = state.getActiveStage();
    const isComplete = state.isSessionComplete();

    // 进度条数据
    const stageKeys = [1, 2, 3, 4, 5];
    const stageLabels = [
        state.t('stage1'), state.t('stage2'), state.t('stage3'),
        state.t('stage4'), state.t('stage5')
    ];

    const nodesHtml = stageKeys.map((n, i) => {
        const st = state.getStageStatus(n);
        const circleClass = st === 'completed' ? 'done' : st === 'active' ? 'active' : 'locked';
        const labelClass = st === 'locked' ? 'locked' : st === 'active' ? 'active' : '';
        const inner = st === 'completed' ? '✓' : n;
        const clickable = st === 'completed' ? 'clickable' : '';
        return `<div class="stage-node ${clickable}" data-stage="${n}">
            <div class="stage-circle ${circleClass}">${inner}</div>
            <div class="stage-label ${labelClass}">${stageLabels[i]}</div>
        </div>`;
    }).join('');

    const segsHtml = [1, 2, 3, 4].map(i => {
        const st = state.getStageStatus(i);
        const next = state.getStageStatus(i + 1);
        const cls = st === 'completed' ? (next === 'completed' ? 'done' : 'active') : '';
        return `<div class="stage-seg ${cls}"></div>`;
    }).join('');

    // 当前关卡卡片
    let currentCardHtml = '';
    if (isComplete) {
        currentCardHtml = `<div class="stage-current-card" style="border-color:var(--accent-green);">
            <div>
                <div class="stage-current-title">${state.t('completionTitle')}</div>
                <div class="stage-current-sub">${state.t('completionSub')}</div>
            </div>
            <button class="btn btn-sm btn-primary" id="btn-go-review">${state.t('goReview')}</button>
        </div>`;
    } else if (activeStage) {
        const stageFullNames = {
            1: state.t('stage1Full'), 2: state.t('stage2Full'), 3: state.t('stage3Full'),
            4: state.t('stage4Full'), 5: state.t('stage5Full')
        };
        currentCardHtml = `<div class="stage-current-card">
            <div>
                <div class="stage-current-title">${stageFullNames[activeStage]}</div>
                <div class="stage-current-sub" id="stage-current-sub">—</div>
            </div>
            <button class="btn btn-sm btn-primary" id="btn-continue-stage">${state.t('stageContinue')}</button>
        </div>`;
    }

    return `<div class="fade-in">
        <div class="learning-header">
            <div class="flex items-center gap-12">
                <span class="level-badge">${state.userLevel}</span>
                <span style="font-size:13px;color:var(--text-secondary);max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                    ${s.articleText.substring(0, 60)}...
                </span>
            </div>
            <button class="btn btn-secondary btn-sm" id="btn-new-session">${state.t('back')}</button>
        </div>

        <div class="stage-progress">
            <div class="stage-nodes">${nodesHtml}</div>
            <div class="stage-bar-wrap">${segsHtml}</div>
            ${currentCardHtml}
        </div>

        <div class="learning-content">
            <div id="stage-content"></div>
        </div>
    </div>`;
}

// ==================== Stage Content Renderers ====================
export function renderStage1Content(html, chunks) {
    const added = chunks.length;
    return `<div class="content-card fade-in">
        <h2 class="section-title">${state.t('stage1Full')}</h2>
        <div class="markdown-content">${html}</div>
        ${added > 0 ? `<div class="chunk-added-banner">✅ ${added} ${state.t('chunksAdded')}</div>` : ''}
        <div class="text-center mt-20">
            <button class="btn btn-primary" id="btn-complete-stage1">${state.t('next')} →</button>
        </div>
    </div>`;
}

export function renderStage2Content(thematicItems) {
    const cardsHtml = thematicItems.map(item => `
        <div class="thematic-card">
            <div class="thematic-word">${item.word} <span class="thematic-pos">${item.pos || ''}</span></div>
            <div class="thematic-meaning">${item.meaning}</div>
            <div class="thematic-label">${state.t('thematicOriginal')}</div>
            <div class="thematic-example">${item.original}</div>
            <div class="thematic-label" style="margin-top:6px;">${state.t('thematicOther')}</div>
            <div class="thematic-other">${item.other}</div>
        </div>`).join('');

    return `<div class="content-card fade-in">
        <h2 class="section-title">${state.t('stage2Full')}</h2>
        <div class="thematic-grid">${cardsHtml}</div>
        <div class="text-center mt-20">
            <button class="btn btn-primary" id="btn-complete-stage2">${state.t('next')} →</button>
        </div>
    </div>`;
}

export function renderStage3Shell(interactiveHtml, writingHtml) {
    return `<div class="content-card fade-in">
        <h2 class="section-title">${state.t('stage3Full')}</h2>
        ${interactiveHtml}
        ${writingHtml}
        <div id="stage3-next-btn" style="display:none;text-align:center;margin-top:24px;">
            <hr style="margin-bottom:24px;border:none;border-top:1px solid var(--border-soft);">
            <p style="font-size:13px;color:var(--text-secondary);margin-bottom:16px;">填空练习完成！进入下一关继续学习 👇</p>
            <button class="btn btn-primary" id="btn-complete-stage3">${state.t('next')} →</button>
        </div>
    </div>`;
}

export function renderStage4Content() {
    return `<div class="content-card fade-in">
        <h2 class="section-title">${state.t('stage4Full')}</h2>
        <div class="mindmap-placeholder">
            <div class="mp-icon">🗂️</div>
            <div class="mp-title">${state.t('stageComingSoon')}</div>
            <div class="mp-sub">思维导图填空功能正在开发中，敬请期待</div>
        </div>
        <div class="text-center mt-20">
            <button class="btn btn-primary" id="btn-complete-stage4">${state.t('next')} →</button>
        </div>
    </div>`;
}

export function renderStage5Content(feedback) {
    return `<div class="content-card fade-in">
        <h2 class="section-title">${state.t('stage5Full')}</h2>
        <div class="markdown-content">${feedback}</div>
        <div class="flex gap-12 mt-20" style="justify-content:center;flex-wrap:wrap;">
            <button class="btn btn-secondary" id="btn-pdf">📄 ${state.t('downloadPdf')}</button>
            <button class="btn btn-secondary" id="btn-save-record">💾 ${state.t('saveRecord')}</button>
            <button class="btn btn-primary" id="btn-complete-stage5">${state.t('next')} →</button>
        </div>
    </div>`;
}

export function renderCompletionContent() {
    return `<div class="content-card fade-in text-center" style="padding:60px 40px;">
        <div style="font-size:64px;margin-bottom:20px;">🎉</div>
        <h2 style="font-family:'Crimson Pro',serif;font-size:32px;margin-bottom:12px;">${state.t('completionTitle')}</h2>
        <p style="color:var(--text-secondary);margin-bottom:40px;">${state.t('completionSub')}</p>
        <div class="flex gap-12" style="justify-content:center;flex-wrap:wrap;">
            <button class="btn btn-secondary" id="btn-back-home-done">${state.t('backHome')}</button>
            <button class="btn btn-primary" id="btn-go-review-done">${state.t('goReview')}</button>
        </div>
    </div>`;
}

// ==================== Review ====================
function renderReview() {
    const due = state.getTodayReviews();
    if (!due.length) return `<div class="fade-in text-center" style="padding:100px 20px;">
        <div style="font-size:64px;margin-bottom:24px;">✅</div>
        <h2 style="font-size:32px;font-weight:700;margin-bottom:16px;">${state.t('allDone')}</h2>
        <p style="color:var(--text-secondary);margin-bottom:40px;">${state.t('noDueReviews')}</p>
        <button class="btn btn-secondary" id="btn-back-home">${state.t('back')}</button>
    </div>`;
    return renderFlashcard(due[0]);
}

export function renderFlashcard(card) {
    const w = (card.word || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
    return `<div class="flashcard-container fade-in">
        <div class="flashcard">
            <div class="flashcard-header">
                <span class="flashcard-type">${card.type || 'EXPRESSION'}</span>
                <button class="flashcard-audio" data-word="${w}">
                    <svg style="width:18px;height:18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
                    </svg>
                </button>
            </div>
            <div class="flashcard-meaning">"${card.meaning}"</div>
            ${card.example ? `<p style="font-size:13px;color:var(--text-muted);margin-bottom:20px;font-style:italic;">${card.example}</p>` : ''}
            <input type="text" id="fc-input" class="flashcard-input" placeholder="${state.t('typeWord')}..." data-word="${w}">
            <div id="mem-btns" class="memory-buttons">
                <button class="memory-btn proficient" data-mem="3" data-word="${w}">${state.t('proficient')}</button>
                <button class="memory-btn hesitant" data-mem="2" data-word="${w}">${state.t('hesitant')}</button>
                <button class="memory-btn forgotten" data-mem="1" data-word="${w}">${state.t('forgotten')}</button>
            </div>
        </div>
        <div class="text-center mt-20">
            <button class="btn btn-secondary" id="btn-back-home">${state.t('back')}</button>
        </div>
    </div>`;
}

// ==================== Import ====================
function renderImport() {
    return `<div class="fade-in"><div class="learning-content"><div class="content-card">
        <h2 class="section-title">${state.t('importMode')}</h2>
        <p style="margin-bottom:12px;color:var(--text-secondary);">${state.t('importFormat')}: ${state.t('importExample')}</p>
        <p style="font-family:monospace;font-size:13px;color:var(--text-secondary);margin-bottom:20px;line-height:2;">
            avoir besoin de + inf. | 需要做某事<br>
            en ce qui concerne + nom | 关于……
        </p>
        <textarea id="import-input" placeholder="avoir besoin de + inf. | 需要做某事" style="min-height:200px;"></textarea>
        <div class="flex justify-between mt-20">
            <button class="btn btn-secondary" id="btn-back-home">${state.t('back')}</button>
            <button class="btn btn-primary" id="btn-do-import">${state.t('importBtn')}</button>
        </div>
    </div></div></div>`;
}
