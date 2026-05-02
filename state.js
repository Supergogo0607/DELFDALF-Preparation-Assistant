import { T } from './config.js';

export class AppState {
    constructor() {
        this.lang = localStorage.getItem('app_lang') || 'zh';
        this.currentMode = null;
        this.userLevel = localStorage.getItem('user_level') || null;
        this.articleText = '';

        // 关卡系统：每个session有5个关卡
        this.session = null; // { articleText, userLevel, stages: {1..5} }

        this.reviewSchedule = [];
        this._loadReviewSchedule();
    }

    // ==================== 翻译 ====================
    t(key) {
        const keys = key.split('.');
        let v = T[this.lang];
        for (const k of keys) v = v?.[k];
        return v || key;
    }

    setLang(lang) { this.lang = lang; localStorage.setItem('app_lang', lang); }
    setLevel(level) { this.userLevel = level; localStorage.setItem('user_level', level); }

    // ==================== 复习计划 ====================
    _loadReviewSchedule() {
        try { this.reviewSchedule = JSON.parse(localStorage.getItem('review_schedule') || '[]'); }
        catch(e) { this.reviewSchedule = []; }
    }

    saveReviewSchedule() {
        localStorage.setItem('review_schedule', JSON.stringify(this.reviewSchedule));
    }

    addChunksToReview(chunks) {
        const today = new Date().toISOString().split('T')[0];
        let added = 0;
        chunks.forEach(c => {
            if (c.word && c.meaning && !this.reviewSchedule.some(r => r.word === c.word)) {
                this.reviewSchedule.push({
                    word: c.word, meaning: c.meaning, example: c.example || '',
                    type: c.type || 'EXPRESSION', reviewDate: today, level: 1, attempt: 0
                });
                added++;
            }
        });
        this.saveReviewSchedule();
        return added;
    }

    getTodayReviews() {
        const today = new Date().toISOString().split('T')[0];
        return this.reviewSchedule.filter(r => r.reviewDate === today);
    }

    // ==================== Session（关卡系统）====================
    // session 结构：
    // {
    //   articleText, userLevel, savedAt,
    //   stages: {
    //     1: { status: 'completed'|'active'|'locked', data: {html, chunks} },
    //     2: { status, data: {html, thematicChunks} },
    //     3: { status, data: {html, clozeData} },
    //     4: { status, data: null },  // 思维导图占位
    //     5: { status, data: {writingTopic} },
    //   }
    // }

    newSession(articleText, userLevel) {
        this.session = {
            articleText,
            userLevel,
            savedAt: new Date().toISOString(),
            stages: {
                1: { status: 'active', data: null },
                2: { status: 'locked', data: null },
                3: { status: 'locked', data: null },
                4: { status: 'locked', data: null },
                5: { status: 'locked', data: null },
            }
        };
        this._saveSession();
    }

    completeStage(stageNum, data) {
        if (!this.session) return;
        this.session.stages[stageNum].status = 'completed';
        this.session.stages[stageNum].data = data;
        // 解锁下一关
        const next = stageNum + 1;
        if (next <= 5) this.session.stages[next].status = 'active';
        this.session.savedAt = new Date().toISOString();
        this._saveSession();
    }

    getActiveStage() {
        if (!this.session) return null;
        for (let i = 1; i <= 5; i++) {
            if (this.session.stages[i].status === 'active') return i;
        }
        return null; // 全部完成
    }

    getStageStatus(n) {
        return this.session?.stages[n]?.status || 'locked';
    }

    getStageData(n) {
        return this.session?.stages[n]?.data || null;
    }

    isSessionComplete() {
        if (!this.session) return false;
        return Object.values(this.session.stages).every(s => s.status === 'completed');
    }

    _saveSession() {
        localStorage.setItem('delf_session', JSON.stringify(this.session));
    }

    loadSession() {
        try {
            const raw = localStorage.getItem('delf_session');
            if (!raw) return null;
            this.session = JSON.parse(raw);
            return this.session;
        } catch(e) { return null; }
    }

    clearSession() {
        this.session = null;
        localStorage.removeItem('delf_session');
    }

    // ==================== 工具 ====================
    calcTime(text) {
        if (!text || !this.userLevel) return 15;
        const wc = text.trim().split(/\s+/).length;
        const rates = { A1:8, A2:6, B1:5, B2:4, C1:3, C2:2.5 };
        return Math.max(8, Math.min(60, Math.ceil((wc/100) * (rates[this.userLevel]||5)) + 20));
    }
}

export const state = new AppState();
