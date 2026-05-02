import { state } from './state.js';
import { callClaude, parseJSON } from './api.js';
import { getPrompts } from './prompts.js';
import { showToast } from './render.js';
import { LEVEL_CFG } from './prompts.js';

// ==================== 法语字符标准化 ====================
function normalizeFr(str) {
    return str.toLowerCase()
        .replace(/[àâä]/g, 'a').replace(/[éèêë]/g, 'e').replace(/[îï]/g, 'i')
        .replace(/[ôö]/g, 'o').replace(/[ùûü]/g, 'u').replace(/[ç]/g, 'c')
        .replace(/[œ]/g, 'oe').replace(/[æ]/g, 'ae')
        .replace(/['\u2019\u2018]/g, "'")
        .replace(/\s+/g, ' ').trim();
}

function isCorrect(userInput, correctAnswer) {
    const u = normalizeFr(userInput);
    const c = normalizeFr(correctAnswer);
    if (u === c) return true;
    return u.replace(/[\s\-'.]/g, '') === c.replace(/[\s\-'.]/g, '');
}

// ==================== 渲染交互式填空 ====================
// clozeData: { fill_in: [{id, sentence, answers, hints}], writing_topic }
export function renderClozeInteractive(clozeMarkdown, clozeData) {
    if (!clozeData || !clozeData.fill_in) {
        return `<div class="markdown-content">${clozeMarkdown}</div>`;
    }

    // 提取练习二的Markdown部分
    const withoutJson = clozeMarkdown.replace(/```json[\s\S]*?```/g, '');
    const ex2Match = withoutJson.match(/(###\s*练习二[\s\S]*)/);
    const ex2Html = ex2Match ? marked.parse(ex2Match[1].replace(/###\s*练习三[\s\S]*/,'').trim()) : '';

    // 构建交互式填空HTML
    const fillInHtml = clozeData.fill_in.map(q => {
        // 支持多个空格：按___切割句子
        const parts = q.sentence.split('___');
        const answers = q.answers || [q.answer || ''];
        const hints = q.hints || [q.hint || ''];

        let sentenceHtml = parts[0];
        for (let i = 0; i < answers.length; i++) {
            const inputId = `cloze-${q.id}-${i}`;
            const width = Math.max(80, (answers[i] || '').length * 11);
            sentenceHtml += `<input
                type="text"
                class="cloze-input"
                id="${inputId}"
                data-qid="${q.id}"
                data-idx="${i}"
                data-answer="${(answers[i] || '').replace(/"/g, '&quot;')}"
                data-attempts="0"
                placeholder="..."
                style="min-width:${width}px"
            /><span class="cloze-att" id="${inputId}-att"></span>`;
            if (parts[i + 1] !== undefined) sentenceHtml += parts[i + 1];
        }

        const hintText = hints.filter(Boolean).join(' / ');

        return `<div class="cloze-question" id="cloze-q-${q.id}">
            <strong>${q.id}.</strong> ${sentenceHtml}
            ${hintText ? `<span class="cloze-hint">（提示：${hintText}）</span>` : ''}
        </div>`;
    }).join('');

    return `
        <div class="exercise-section">
            <div class="exercise-section-title">练习一：词块填空</div>
            <p style="font-size:12px;color:var(--text-muted);margin-bottom:14px;">回车确认答案，忽略大小写和变音符（é=e, ç=c）。3次错误后显示答案。</p>
            <div class="cloze-exercise" id="cloze-exercises">${fillInHtml}</div>
            <div id="fill-score-banner" style="display:none;"></div>
        </div>
        ${ex2Html ? `<div class="exercise-section"><div class="markdown-content">${ex2Html}</div></div>` : ''}
    `;
}

// ==================== 写作部分 ====================
export function buildWritingSection(topic) {
    const lv = state.userLevel || 'B1';
    const guide = LEVEL_CFG[lv]?.writingGuide || '';
    const chunks = state.session?.stages[1]?.data?.chunks || [];
    const chunkList = chunks.map(c => `<strong>${c.word}</strong>`).join('、');

    return `
        <div class="exercise-section" style="margin-top:28px;">
            <div class="exercise-section-title">练习三：写作输出</div>
            <p style="margin-bottom:14px;color:var(--text-primary);font-size:15px;">${topic}</p>
            ${chunkList ? `<p style="font-size:13px;color:var(--accent-green);margin-bottom:14px;">💡 本次词块：${chunkList}</p>` : ''}
            ${guide ? `<div class="writing-guide">
                <div class="writing-guide-header" id="writing-guide-toggle">
                    <span id="guide-label">💡 没有思路？点击展开引导</span>
                    <span class="writing-guide-arrow" id="guide-arrow">▼</span>
                </div>
                <div class="writing-guide-body" id="guide-body">${guide}</div>
            </div>` : ''}
            <textarea id="writing-ans" placeholder="在这里写你的答案..." style="margin-top:14px;min-height:180px;"></textarea>
            <div style="margin-top:16px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
                <button class="btn btn-secondary" id="btn-generate-report" style="display:none;">📊 查看精批报告</button>
                <button class="btn btn-primary" id="btn-submit-writing">提交写作</button>
            </div>
            <div id="report-container" style="margin-top:20px;"></div>
        </div>
    `;
}

// ==================== 交互事件 ====================
export function bindClozeEvents() {
    const container = document.getElementById('cloze-exercises');
    if (!container) return;

    container.addEventListener('keydown', e => {
        if (e.key === 'Enter' && e.target.classList.contains('cloze-input')) {
            const qid = parseInt(e.target.dataset.qid);
            const idx = parseInt(e.target.dataset.idx);
            checkOneInput(e.target, qid, idx);
        }
    });

    container.addEventListener('input', e => {
        if (e.target.classList.contains('cloze-input')) {
            if (e.target.classList.contains('wrong')) {
                e.target.classList.remove('wrong');
            }
        }
    });
}

function checkOneInput(inp, qid, idx) {
    if (inp.disabled) return;
    const userVal = inp.value.trim();
    if (!userVal) return;

    const correct = inp.dataset.answer;
    const attempts = parseInt(inp.dataset.attempts) + 1;
    inp.dataset.attempts = attempts;

    const attEl = document.getElementById(`cloze-${qid}-${idx}-att`);

    if (isCorrect(userVal, correct)) {
        inp.classList.remove('wrong');
        inp.classList.add('correct');
        inp.disabled = true;
        if (attEl) attEl.textContent = '✓';
        checkAllFilled();
    } else {
        inp.classList.add('wrong');
        if (attempts >= 3) {
            inp.value = correct;
            inp.classList.remove('wrong');
            inp.classList.add('revealed');
            inp.disabled = true;
            if (attEl) attEl.textContent = '（已显示）';
            checkAllFilled();
        } else {
            if (attEl) attEl.textContent = `${attempts}/3`;
            inp.select();
        }
    }
}

function checkAllFilled() {
    const inputs = document.querySelectorAll('.cloze-input');
    const allDone = Array.from(inputs).every(inp => inp.disabled);
    if (!allDone) return;

    let correct = 0;
    inputs.forEach(inp => { if (inp.classList.contains('correct')) correct++; });
    const total = inputs.length;

    const banner = document.getElementById('fill-score-banner');
    if (banner) {
        const ratio = correct / total;
        const cls = ratio >= 0.8 ? 'good' : ratio >= 0.5 ? 'ok' : 'poor';
        const tkey = ratio >= 0.8 ? 'scoreGood' : ratio >= 0.5 ? 'scoreOk' : 'scorePoor';
        banner.className = `score-banner ${cls}`;
        banner.textContent = state.t(tkey).replace('{n}', `${correct}/${total}`);
        banner.style.display = 'block';

        // 保存答题记录
        state._clozeResults = Array.from(inputs).map(inp => ({
            id: inp.id,
            qid: parseInt(inp.dataset.qid),
            idx: parseInt(inp.dataset.idx),
            userAnswer: inp.value,
            correctAnswer: inp.dataset.answer,
            status: inp.classList.contains('correct') ? 'correct' : inp.classList.contains('revealed') ? 'revealed' : 'wrong'
        }));

        // 显示精批报告按钮
        const reportBtn = document.getElementById('btn-generate-report');
        if (reportBtn) reportBtn.style.display = 'inline-block';
    }
}

// ==================== 精批报告 ====================
export async function generateReport(clozeData) {
    const btn = document.getElementById('btn-generate-report');
    const container = document.getElementById('report-container');
    if (btn) { btn.disabled = true; btn.textContent = '生成中...'; }
    if (container) container.innerHTML = `<div class="text-center" style="padding:40px;"><div class="spinner"></div></div>`;

    try {
        const results = state._clozeResults || [];
        const questions = clozeData?.fill_in || [];

        const summary = results.map(r => {
            const q = questions.find(q => q.id === r.qid);
            return `题${r.qid}(空${r.idx+1})：句子="${q?.sentence||''}"，正确="${r.correctAnswer}"，学生="${r.userAnswer}"，状态=${r.status}`;
        }).join('\n');

        const prompts = getPrompts();
        const raw = await callClaude(`分析填空答题情况：\n\n${summary}`, prompts.report, true);
        const items = parseJSON(raw);

        if (container && Array.isArray(items)) {
            const html = items.map(item => {
                const icon = item.status === 'correct' ? '✅' : item.status === 'revealed' ? '💡' : '❌';
                return `<div class="report-item">
                    <div class="report-icon">${icon}</div>
                    <div class="report-content">
                        <div class="report-word">${item.correct_answer}</div>
                        <div class="report-reason">${item.explanation}</div>
                        ${item.status !== 'correct' ? `<div class="report-reason" style="color:var(--accent-warm);">你的答案：${item.user_answer || '（未作答）'}</div>` : ''}
                    </div>
                </div>`;
            }).join('');
            container.innerHTML = `<h3 style="margin-bottom:14px;color:var(--accent-green);">📊 填空精批报告</h3><div class="report-card">${html}</div>`;
        }

        if (btn) { btn.disabled = false; btn.textContent = '📊 查看精批报告'; }
    } catch(e) {
        if (container) container.innerHTML = `<p style="color:var(--accent-warm);">生成失败，请重试</p>`;
        if (btn) { btn.disabled = false; btn.textContent = '📊 查看精批报告'; }
    }
}

// ==================== 写作引导切换 ====================
export function bindWritingGuideToggle() {
    const toggle = document.getElementById('writing-guide-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
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
