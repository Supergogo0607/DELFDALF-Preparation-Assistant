import { CONFIG } from './config.js';
import { state } from './state.js';
import { showToast } from './render.js';

// ==================== Claude API ====================
export async function callClaude(userMsg, sysPrompt, raw = false, useWebSearch = false) {
    const body = {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3000,
        system: sysPrompt,
        messages: [{ role: 'user', content: userMsg }]
    };

    if (useWebSearch) {
        body.tools = [{ type: 'web_search_20250305', name: 'web_search' }];
    }

    const res = await fetch(CONFIG.WORKER_URL + '/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error?.message || 'API Error');
    }

    const data = await res.json();
    // 提取所有text块（web_search可能返回多个content块）
    const text = data.content
        .filter(c => c.type === 'text')
        .map(c => c.text)
        .join('\n') || '';
    return raw ? text : marked.parse(text);
}

// ==================== Supabase ====================
let sb = null;

function initSB() {
    if (CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY && !sb) {
        sb = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
    }
}

export async function sbInsert(table, rows) {
    initSB();
    if (!sb) return;
    try { await sb.from(table).insert(rows); }
    catch(e) { console.warn('Supabase error:', e); }
}

// ==================== 解析工具 ====================
export function parseChunks(rawText) {
    try {
        const m = rawText.match(/```json\s*([\s\S]*?)\s*```/);
        if (!m) return [];
        const arr = JSON.parse(m[1]);
        return Array.isArray(arr) ? arr.filter(c => c.word && c.meaning) : [];
    } catch(e) { return []; }
}

export function parseJSON(rawText) {
    try {
        const m = rawText.match(/```json\s*([\s\S]*?)\s*```/);
        if (!m) return null;
        return JSON.parse(m[1]);
    } catch(e) { return null; }
}
