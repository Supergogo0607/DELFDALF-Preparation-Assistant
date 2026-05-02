import { CONFIG } from './config.js';
import { state } from './state.js';
import { showToast } from './render.js';

// ==================== Claude API ====================
export async function callClaude(userMsg, sysPrompt, raw = false) {
    const res = await fetch(CONFIG.WORKER_URL + '/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 3000,
            system: sysPrompt,
            messages: [{ role: 'user', content: userMsg }]
        })
    });

    if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error?.message || 'API Error');
    }

    const data = await res.json();
    const text = data.content.find(c => c.type === 'text')?.text || '';
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
