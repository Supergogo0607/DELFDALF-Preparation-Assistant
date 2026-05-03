import { state } from './state.js';
import { CONFIG } from './config.js';
import { callClaude, parseChunks, parseJSON, sbInsert } from './api.js';
import { getPrompts, LEVEL_CFG } from './prompts.js';
import {
    render, showToast, showLoading, renderSessionPage,
    renderStage1Content, renderStage2Content, renderStage3Shell,
    renderStage4Content, renderStage5Content, renderCompletionContent,
    renderFlashcard
} from './render.js';
import {
    renderClozeInteractive, generateReport, bindClozeEvents
} from './cloze.js';

// ==================== 语言切换 ====================
export function initLangSwitch() {
    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.addEventListener('click', () => {
            state.setLang(btn.dataset.lang);
            document.querySelectorAll('.lang-option').forEach(b => b.classList.toggle('active', b.dataset.lang === btn.dataset.lang));
            render();
            bindPageEvents();
        });
    });
}

// ==================== 页面事件绑定（每次render后调用）====================
export function bindPageEvents() {
    const app = document.getElementById('app');
    if (!app) return;

    // 邀请码
    bindId('invite-btn', () => {
        const val = document.getElementById('invite-input')?.value.trim();
        if (val === CONFIG.INVITE_CODE) { localStorage.setItem('invite_code', val); render(); bindPageEvents(); }
        else showToast('邀请码错误');
    });

    // 首页模式选择
    bindId('btn-learning', () => { state.currentMode = 'learning'; render(); bindPageEvents(); });
    bindId('btn-review', () => { state.currentMode = 'review'; render(); bindPageEvents(); });
    bindId('btn-import', () => { state.currentMode = 'import'; render(); bindPageEvents(); });

    // 返回首页
    document.querySelectorAll('#btn-back-home, #btn-back-home-done').forEach(el => {
        el?.addEventListener('click', () => {
            state.currentMode = null;
            render(); bindPageEvents();
        });
    });

    // 等级选择
    document.querySelectorAll('.level-card').forEach(card => {
        card.addEventListener('click', () => {
            state.setLevel(card.dataset.level);
            render(); bindPageEvents();
        });
    });

    // 换等级
    bindId('btn-change-level', () => { state.setLevel(null); render(); bindPageEvents(); });

    // 文章输入字数统计
    const articleInput = document.getElementById('article-input');
    if (articleInput) {
        articleInput.addEventListener('input', () => {
            state.articleText = articleInput.value;
            const wc = articleInput.value.trim().split(/\s+/).filter(w => w).length;
            const wcEl = document.getElementById('wc');
            if (wcEl) wcEl.textContent = `${wc} ${state.t('wordCount')}`;
        });
        // 恢复已输入的文章
        if (state.articleText) {
            articleInput.value = state.articleText;
            articleInput.dispatchEvent(new Event('input'));
        }
    }

    // 开始学习
    bindId('btn-start', startLearning);

    // Session页面
    bindId('btn-new-session', () => {
        if (confirm('开始新的学习会清除当前进度，确定吗？')) {
            state.clearSession();
            state.articleText = '';
            render(); bindPageEvents();
        }
    });

    bindId('btn-continue-stage', continueActiveStage);
    bindId('btn-go-review', () => { state.currentMode = 'review'; render(); bindPageEvents(); });
    bindId('btn-go-review-done', () => { state.currentMode = 'review'; render(); bindPageEvents(); });

    // 关卡完成按钮
    bindId('btn-complete-stage1', () => completeAndNext(1));
    bindId('btn-complete-stage2', () => completeAndNext(2));
    bindId('btn-complete-stage4', () => completeAndNext(4));
    bindId('btn-complete-stage5', () => {
        completeAndNext(5);
        // 全部完成后显示完成页面
        setTimeout(() => {
            const sc = document.getElementById('stage-content');
            if (sc) { sc.innerHTML = renderCompletionContent(); bindPageEvents(); }
        }, 100);
    });

    // 写作提交
    bindId('btn-submit-writing', submitWriting);
    bindId('btn-generate-report', () => {
        const clozeData = state.session?.stages[3]?.data?.clozeData;
        generateReport(clozeData);
    });

    // PDF + 保存记录
    bindId('btn-pdf', dlPdf);
    bindId('btn-save-record', saveRecord);

    // 复习闪卡
    const fcInput = document.getElementById('fc-input');
    if (fcInput) {
        fcInput.addEventListener('keydown', e => {
            if (e.key !== 'Enter') return;
            const correct = fcInput.dataset.word;
            const ok = normalizeFcInput(fcInput.value) === normalizeFcInput(correct);
            fcInput.style.borderColor = ok ? 'var(--accent-green)' : 'var(--accent-warm)';
            fcInput.style.color = ok ? 'var(--accent-green)' : 'var(--accent-warm)';
            if (ok) { document.getElementById('mem-btns')?.classList.add('show'); showToast(state.t('success')); }
        });
    }

    document.querySelectorAll('.memory-btn').forEach(btn => {
        btn.addEventListener('click', () => recordMem(parseInt(btn.dataset.mem), btn.dataset.word));
    });

    document.querySelectorAll('.flashcard-audio').forEach(btn => {
        btn.addEventListener('click', () => playAudio(btn.dataset.word));
    });

    // 已完成关卡可以点击复习
    document.querySelectorAll('.stage-node.clickable').forEach(node => {
        node.addEventListener('click', () => {
            const n = parseInt(node.dataset.stage);
            if (state.getStageStatus(n) === 'completed') showStageContent(n);
        });
    });

    // 导入
    bindId('btn-do-import', doImport);

    // 写作引导折叠（HTML插入后才绑定，避免找不到元素）
    const guideToggle = document.getElementById('writing-guide-toggle');
    if (guideToggle) {
        guideToggle.addEventListener('click', () => {
            const body = document.getElementById('guide-body');
            const arrow = document.getElementById('guide-arrow');
            const label = document.getElementById('guide-label');
            if (!body) return;
            const isOpen = body.classList.contains('open');
            body.classList.toggle('open', !isOpen);
            if (arrow) arrow.classList.toggle('open', !isOpen);
            if (label) label.textContent = isOpen ? '💡 没有思路？点击展开引导' : '收起引导';
        });
    }

    // 填空事件
    bindClozeEvents();
}

// ==================== 工具函数 ====================
function bindId(id, fn) {
    document.getElementById(id)?.addEventListener('click', fn);
}

function normalizeFcInput(str) {
    return (str || '').toLowerCase().trim();
}

// ==================== 开始学习 ====================
async function startLearning() {
    const uses = parseInt(localStorage.getItem('use_count') || '0');
    if (uses >= CONFIG.MAX_USES) { showToast(state.t('usedUp')); return; }

    const articleEl = document.getElementById('article-input');
    state.articleText = articleEl?.value.trim() || '';
    if (!state.articleText) { showToast(state.t('noInput')); return; }

    const wc = state.articleText.split(/\s+/).length;
    if (wc > 800) { showToast(state.t('tooLong')); return; }

    localStorage.setItem('use_count', uses + 1);

    // 建立新Session
    state.newSession(state.articleText, state.userLevel);
    render();
    bindPageEvents();

    // 自动开始关卡一
    await runStage1();
}

// ==================== 继续当前关卡 ====================
async function continueActiveStage() {
    const active = state.getActiveStage();
    if (!active) return;
    await showStageContent(active);
}

async function showStageContent(n) {
    const sc = document.getElementById('stage-content');
    if (!sc) return;

    const data = state.getStageData(n);

    // 如果已有缓存数据，直接渲染
    if (data && n === 1) { sc.innerHTML = renderStage1Content(data.html, data.chunks); bindPageEvents(); return; }
    if (data && n === 2) { sc.innerHTML = renderStage2Content(data.thematicItems); bindPageEvents(); return; }
    if (data && n === 3) {
        const ih = renderClozeInteractive(data.clozeMarkdown, data.clozeData);
        sc.innerHTML = renderStage3Shell(ih, '');
        bindPageEvents(); bindClozeEvents();
        return;
    }
    if (n === 4) { sc.innerHTML = renderStage4Content(); bindPageEvents(); return; }
    if (n === 5) {
        // 关卡五：显示写作界面（无论有无缓存都重新显示，因为需要用户输入）
        sc.innerHTML = buildStage5WritingUI(state.session?.stages[3]?.data?.clozeData?.writing_topic || '');
        bindPageEvents();
        return;
    }

    // 没有缓存，重新生成
    if (n === 1) await runStage1();
    else if (n === 2) await runStage2();
    else if (n === 3) await runStage3();
    else if (n === 4) { sc.innerHTML = renderStage4Content(); bindPageEvents(); }
    else if (n === 5) {
        sc.innerHTML = buildStage5WritingUI(state.session?.stages[3]?.data?.clozeData?.writing_topic || '');
        bindPageEvents();
    }
}

// ==================== 关卡完成 ====================
function completeAndNext(stageNum) {
    // 对于占位关卡（4），直接complete并跳到下一关
    state.completeStage(stageNum, state.session.stages[stageNum].data);

    // 更新进度条
    const app = document.getElementById('app');
    app.innerHTML = renderSessionPage();
    bindPageEvents();

    // 自动进入下一关
    const next = stageNum + 1;
    if (next <= 5) {
        setTimeout(() => showStageContent(next), 200);
    }
}

// ==================== 关卡一：可迁移词块 ====================
async function runStage1() {
    const sc = document.getElementById('stage-content');
    if (!sc) return;
    showLoading('stage-content', state.t('generating'));

    try {
        const p = getPrompts();
        const raw = await callClaude(`请分析以下文章：\n\n${state.session.articleText}`, p.vocab, true);
        const chunks = parseChunks(raw);
        const md = marked.parse(raw.replace(/```json[\s\S]*?```/g, '').trim());

        // 词块加入复习库
        const added = state.addChunksToReview(chunks);
        await sbInsert('vocabulary', chunks.map(c => ({
            word: c.word, meaning: c.meaning, example: c.example || '',
            level: state.userLevel, created_at: new Date().toISOString()
        })));

        // 保存到session
        state.completeStage(1, { html: md, chunks });
        state.session.stages[1].status = 'active'; // 保持active直到用户点next
        state._saveSession();

        sc.innerHTML = renderStage1Content(md, chunks);
        bindPageEvents();

        // 更新进度条子标题
        const sub = document.getElementById('stage-current-sub');
        if (sub) sub.textContent = `${chunks.length} 个词块已提取`;

    } catch(e) {
        showToast(state.t('error') + ': ' + e.message);
    }
}

// ==================== 关卡二：主题词块 ====================
async function runStage2() {
    const sc = document.getElementById('stage-content');
    if (!sc) return;
    showLoading('stage-content', state.t('generatingThematic'));

    try {
        const p = getPrompts();
        const raw = await callClaude(`请分析以下文章的主题词块：\n\n${state.session.articleText}`, p.thematic, true);

        // 解析主题词块JSON
        const jsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/);
        let thematicItems = [];
        if (jsonMatch) {
            try { thematicItems = JSON.parse(jsonMatch[1]); } catch(e) {}
        }

        // 主题词块也加入复习库
        state.addChunksToReview(thematicItems.map(t => ({
            word: t.word, meaning: t.meaning,
            example: t.other || t.original || '',
            type: 'THÉMATIQUE'
        })));

        state.completeStage(2, { thematicItems });
        state.session.stages[2].status = 'active';
        state._saveSession();

        sc.innerHTML = renderStage2Content(thematicItems);
        bindPageEvents();

    } catch(e) {
        showToast(state.t('error') + ': ' + e.message);
    }
}

// ==================== 关卡三：填空练习 ====================
async function runStage3() {
    const sc = document.getElementById('stage-content');
    if (!sc) return;
    showLoading('stage-content', state.t('generatingExercise'));

    try {
        const p = getPrompts();
        const chunks = state.session?.stages[1]?.data?.chunks || [];
        const chunkList = chunks.map(c => c.word).join('、');

        const rawCloze = await callClaude(
            `文章：${state.session.articleText}\n\n已学词块：${chunkList}`,
            p.cloze, true
        );

        const clozeData = parseJSON(rawCloze);
        const clozeMarkdown = marked.parse(rawCloze.replace(/```json[\s\S]*?```/g, '').trim());

        state.completeStage(3, { clozeMarkdown, clozeData });
        state.session.stages[3].status = 'active';
        state._saveSession();

        const ih = renderClozeInteractive(clozeMarkdown, clozeData);

        sc.innerHTML = renderStage3Shell(ih, '');
        bindPageEvents();
        bindClozeEvents();

    } catch(e) {
        showToast(state.t('error') + ': ' + e.message);
    }
}

// ==================== 关卡五：写作界面 ====================
function buildStage5WritingUI(topic) {
    const lv = state.userLevel || 'B1';
    const guide = LEVEL_CFG[lv]?.writingGuide || '';
    const chunks = state.session?.stages[1]?.data?.chunks || [];
    const chunkList = chunks.map(c => `<strong>${c.word}</strong>`).join('、');
    const writingTopic = topic || '请根据文章主题，运用今天学习的词块写一段话。';

    return `<div class="content-card fade-in">
        <h2 class="section-title">${state.t('stage5Full')}</h2>
        <p style="margin-bottom:14px;color:var(--text-primary);font-size:15px;font-weight:500;">${writingTopic}</p>
        ${chunkList ? `<p style="font-size:13px;color:var(--accent-green);margin-bottom:14px;">💡 可用词块：${chunkList}</p>` : ''}
        ${guide ? `<div class="writing-guide">
            <div class="writing-guide-header" id="writing-guide-toggle">
                <span id="guide-label">💡 没有思路？点击展开引导</span>
                <span class="writing-guide-arrow" id="guide-arrow">▼</span>
            </div>
            <div class="writing-guide-body" id="guide-body">${guide}</div>
        </div>` : ''}
        <textarea id="writing-ans" placeholder="在这里写你的答案..." style="margin-top:16px;min-height:200px;"></textarea>
        <div class="text-center mt-20">
            <button class="btn btn-primary" id="btn-submit-writing">提交写作</button>
        </div>
    </div>`;
}

// ==================== 关卡五：写作批改 ====================
async function submitWriting() {
    const ans = document.getElementById('writing-ans')?.value || '';
    const sc = document.getElementById('stage-content');
    if (!sc) return;
    showLoading('stage-content', state.t('generatingReport'));

    try {
        const p = getPrompts();
        const chunks = state.session?.stages[1]?.data?.chunks || [];
        const chunkList = chunks.map(c => c.word).join('、');

        const result = await callClaude(
            `原文：${state.session.articleText}\n\n已学词块：${chunkList}\n\n学生写作：${ans}`,
            p.feedback
        );

        await runStage5Writing(result);

    } catch(e) {
        showToast(state.t('error') + ': ' + e.message);
    }
}

async function runStage5Writing(feedback) {
    const sc = document.getElementById('stage-content');
    if (!sc) return;

    state.completeStage(5, { feedback });
    state.session.stages[5].status = 'active';
    state._saveSession();

    // 更新进度条
    const app = document.getElementById('app');
    app.innerHTML = renderSessionPage();
    bindPageEvents();

    setTimeout(() => {
        const sc2 = document.getElementById('stage-content');
        if (sc2) { sc2.innerHTML = renderStage5Content(feedback); bindPageEvents(); }
    }, 100);
}

// ==================== 复习 ====================
function recordMem(lvl, word) {
    const iv = { 3: [1,3,7,15,30], 2: [1,2,4,8,16], 1: [0.5,1,2,4,8] };
    const card = state.reviewSchedule.find(r => r.word === word);
    state.reviewSchedule = state.reviewSchedule.filter(r => r.word !== word);
    iv[lvl].forEach((d, i) => {
        const dt = new Date();
        dt.setDate(dt.getDate() + Math.ceil(d));
        state.reviewSchedule.push({
            word, meaning: card?.meaning || '', example: card?.example || '',
            type: card?.type || 'EXPRESSION',
            reviewDate: dt.toISOString().split('T')[0], level: lvl, attempt: i + 1
        });
    });
    state.saveReviewSchedule();
    showToast(state.t('saved'));
    setTimeout(() => { render(); bindPageEvents(); }, 1000);
}

function playAudio(word) {
    const u = new SpeechSynthesisUtterance(word);
    u.lang = 'fr-FR'; u.rate = 0.8;
    function speak() {
        const vs = window.speechSynthesis.getVoices();
        const v = [
            vs.find(v => v.name.includes('Google') && v.lang.startsWith('fr')),
            vs.find(v => v.lang === 'fr-FR'),
            vs.find(v => v.lang.startsWith('fr'))
        ].find(Boolean);
        if (v) u.voice = v;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
    }
    window.speechSynthesis.getVoices().length > 0 ? speak() : (window.speechSynthesis.onvoiceschanged = speak);
}

// ==================== PDF ====================
function dlPdf() {
    showToast(state.t('pdfGenerating'));
    const date = new Date().toLocaleDateString('fr-FR');
    const lv = state.userLevel || '';
    const s = state.session;
    const div = document.createElement('div');
    div.style.cssText = 'padding:40px;font-family:serif;color:#2C2C2B;max-width:800px;';
    div.innerHTML = `
        <div style="text-align:center;margin-bottom:32px;border-bottom:2px solid #5E6D62;padding-bottom:20px;">
            <h1 style="font-size:28px;font-weight:700;margin-bottom:8px;">DELF DALF Pro</h1>
            <p style="color:#6B6B68;">Niveau ${lv} · ${date}</p>
        </div>
        ${s?.stages[1]?.data?.html ? `<h2 style="color:#5E6D62;margin:24px 0 12px;">📚 Expressions transférables</h2><div>${s.stages[1].data.html}</div><hr style="margin:24px 0;">` : ''}
        ${s?.stages[3]?.data?.clozeMarkdown ? `<h2 style="color:#5E6D62;margin:24px 0 12px;">✍️ Exercices</h2><div>${s.stages[3].data.clozeMarkdown}</div><hr style="margin:24px 0;">` : ''}
        ${s?.stages[5]?.data?.feedback ? `<h2 style="color:#5E6D62;margin:24px 0 12px;">✅ Corrections</h2><div>${s.stages[5].data.feedback}</div>` : ''}`;
    document.body.appendChild(div);
    html2pdf().set({
        margin: [10,10,10,10],
        filename: `DALF_${lv}_${date.replace(/\//g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(div).save().then(() => document.body.removeChild(div));
}

// ==================== 保存记录 ====================
async function saveRecord() {
    const d = {
        date: new Date().toISOString(),
        level: state.userLevel,
        article_excerpt: state.session?.articleText.substring(0, 200) || '',
        vocabulary_count: state.session?.stages[1]?.data?.chunks?.length || 0,
        has_feedback: !!state.session?.stages[5]?.data?.feedback,
        lang: state.lang
    };
    const h = JSON.parse(localStorage.getItem('practice_history') || '[]');
    h.unshift(d);
    localStorage.setItem('practice_history', JSON.stringify(h.slice(0, 50)));
    await sbInsert('practice_sessions', [d]);
    showToast(state.t('recordSaved'));
}

// ==================== 导入 ====================
function doImport() {
    const inp = document.getElementById('import-input');
    const chunks = inp.value.trim().split('\n').map(l => {
        const [word, meaning] = l.split('|').map(s => s.trim());
        return word && meaning ? { word, meaning, type: 'IMPORTED' } : null;
    }).filter(Boolean);
    const added = state.addChunksToReview(chunks);
    showToast(`${state.t('success')}: ${added} ${state.t('words')}`);
    setTimeout(() => { state.currentMode = 'review'; render(); bindPageEvents(); }, 1000);
}
