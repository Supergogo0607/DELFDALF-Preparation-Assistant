import { state } from './state.js';
import { CONFIG } from './config.js';
import { render } from './render.js';
import { initLangSwitch, bindPageEvents } from './actions.js';

// ==================== 初始化 ====================
marked.setOptions({ breaks: true, gfm: true });

window.addEventListener('DOMContentLoaded', () => {

    // 语言切换
    initLangSwitch();

    // 恢复Session
    const saved = state.loadSession();
    if (saved && saved.articleText) {
        const mins = Math.round((Date.now() - new Date(saved.savedAt)) / 60000);
        const label = mins < 60 ? `${mins}分钟前` : `${Math.round(mins / 60)}小时前`;
        const resume = confirm(`${state.t('resumeTitle')}（${label}，${saved.userLevel}）\n\n是否继续？点击"取消"开始新学习`);
        if (resume) {
            state.userLevel = saved.userLevel;
            state.articleText = saved.articleText;
            state.currentMode = 'learning';
        } else {
            state.clearSession();
        }
    }

    render();
    bindPageEvents();
});
