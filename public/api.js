// api.js
export const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const MODELS = [
    { id: 'google/gemma-3-27b-it:free', label: '🆓 Gemma 3 27B (Google)', free: true },
    { id: 'meta-llama/llama-4-maverick:free', label: '🆓 Llama 4 Maverick (Meta)', free: true },
    { id: 'meta-llama/llama-4-scout:free', label: '🆓 Llama 4 Scout (Meta)', free: true },
    { id: 'meta-llama/llama-3.3-70b-instruct:free', label: '🆓 Llama 3.3 70B (Meta)', free: true },
    { id: 'deepseek/deepseek-r1:free', label: '🆓 DeepSeek R1 (raciocínio)', free: true },
    { id: 'mistralai/mistral-small-3.1-24b-instruct:free', label: '🆓 Mistral Small 3.1', free: true },
    { id: 'qwen/qwen3-8b:free', label: '🆓 Qwen3 8B (Alibaba)', free: true },
    { id: 'openrouter/free', label: '🆓 Auto-Gratuito (OpenRouter)', free: true },
    { id: 'google/gemini-2.0-flash-001', label: 'Gemini 2.0 Flash', free: false },
    { id: 'google/gemini-2.5-pro-preview-03-25', label: 'Gemini 2.5 Pro', free: false },
    { id: 'openai/gpt-4o-mini', label: 'GPT-4o Mini', free: false },
    { id: 'openai/gpt-4o', label: 'GPT-4o', free: false },
    { id: 'anthropic/claude-sonnet-4-5', label: 'Claude Sonnet 4.5', free: false },
    { id: 'anthropic/claude-haiku-4-5', label: 'Claude Haiku 4.5', free: false },
    { id: 'deepseek/deepseek-chat-v3-0324', label: 'DeepSeek Chat V3', free: false },
    { id: 'mistralai/mistral-small-3.1-24b-instruct', label: 'Mistral Small 3.1', free: false },
];

export const DEFAULT_MODEL = 'google/gemma-3-27b-it:free';

export const FALLBACK_CHAIN = [
    'meta-llama/llama-3.3-70b-instruct:free',
    'mistralai/mistral-small-3.1-24b-instruct:free',
    'openrouter/free',
];

export const CONFIG = {
    API_TIMEOUT_MS: 30000,
    MAX_TOKENS: 4096,
    SEARCH_HISTORY_LIMIT: 10,
    SEARCH_DEBOUNCE_MS: 300,
    SEARCH_COOLDOWN_MS: 2000,
    TOAST_DURATION_MS: 3000,
    BATCH_SIZE: 4,
    SURPRISE_TERMS: [
        "Especialista em Python", "Redator de SEO", "Data Scientist", "UI Designer de Apps", 
        "Arquiteto de Microsserviços", "Copywriting para E-commerce", "Especialista em Docker", 
        "Analista de Cibersegurança", "Professor de Inglês", "Estrategista de Marketing",
        "Desenvolvedor Frontend React", "Engenheiro de Prompt"
    ]
};

export function getApiKey() { 
    const key = localStorage.getItem('prompts_ia_api_key') || ''; 
    // Validação de segurança: Verifica se a chave segue o padrão OpenRouter sk-or-v1-...
    if (key && !key.startsWith('sk-or-v1-')) {
        console.warn('[SECURITY] API Key com formato inválido detectada no storage.');
        return '';
    }
    return key;
}
export function getModel() { return localStorage.getItem('prompts_ia_model') || DEFAULT_MODEL; }
export function saveModel(id) { localStorage.setItem('prompts_ia_model', id); }

export async function callAI({ system, user, maxTokens = CONFIG.MAX_TOKENS, _modelOverride }) {
    const key = getApiKey();
    if (!key) throw new Error('API_KEY_MISSING');

    const primary = _modelOverride || getModel();
    const chain = [primary, ...FALLBACK_CHAIN.filter(m => m !== primary)];
    let lastError = null;
    const DEBUG = true; // Flag de debug para monitorar fallback

    for (const model of chain) {
        try {
            if (DEBUG) console.log(`[API] Tentando modelo: ${model}...`);
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), CONFIG.API_TIMEOUT_MS);

            const res = await fetch(OPENROUTER_URL, {
                method: 'POST',
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${key}`,
                    'HTTP-Referer': window.location.href,
                    'X-Title': 'prompts-ia',
                },
                body: JSON.stringify({
                    model,
                    max_tokens: maxTokens,
                    messages: [
                        { role: 'system', content: system },
                        { role: 'user', content: user },
                    ],
                }),
            });

            clearTimeout(timeout);

            const remaining = res.headers.get('x-ratelimit-remaining') || res.headers.get('x-ratelimit-limit-requests-remaining');
            if (remaining !== null && window.updateRateLimitUI) {
                window.updateRateLimitUI(remaining);
            }

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                const msg = err?.error?.message || `HTTP ${res.status}`;
                if (res.status === 401) throw new Error('API_KEY_INVALID');
                if (msg.includes('No endpoints') || res.status === 404 || res.status === 400) {
                    lastError = new Error(msg);
                    continue;
                }
                throw new Error(msg);
            }

            const data = await res.json();
            return data.choices?.[0]?.message?.content || '';

        } catch (err) {
            if (DEBUG) console.warn(`[API] Falha no modelo ${model}:`, err.message);
            if (err.message === 'API_KEY_INVALID') throw err;
            if (err.name === 'AbortError') {
                lastError = new Error('Timeout: a IA demorou mais de 30s para responder. Tente novamente.');
                continue;
            }
            lastError = err;
        }
    }
    throw lastError || new Error('Todos os modelos falharam. Tente novamente.');
}

/**
 * Extrai e limpa JSON de uma string enviada pela IA.
 * Procura pelo primeiro [ ou { e o respectivo último ] ou },
 * permitindo que a IA envie conversas fora do JSON.
 */
export function extractJSON(raw) {
    if (!raw) throw new Error('A resposta da IA veio vazia.');

    // 1. Tenta parse simples (caso venha limpo)
    let cleaned = raw.trim();
    try { return JSON.parse(cleaned); } catch (_) {}

    // 2. Remove blocos de código Markdown backticks
    cleaned = raw.replace(/```(?:json)?\s*/gi, '').replace(/```\s*/g, '').trim();
    try { return JSON.parse(cleaned); } catch (_) {}

    // 3. Procura por um array completo [...]
    const firstBracket = raw.indexOf('[');
    const lastBracket = raw.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket > firstBracket) {
        const jsonPart = raw.substring(firstBracket, lastBracket + 1);
        try { return JSON.parse(jsonPart); } catch (_) {}
    }

    // 4. Procura por um objeto completo {...}
    const firstBrace = raw.indexOf('{');
    const lastBrace = raw.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
        const jsonPart = raw.substring(firstBrace, lastBrace + 1);
        try { return JSON.parse(jsonPart); } catch (_) {}
    }

    // Se falhar tudo, lança um erro com a resposta bruta para depuração
    console.error('[extractJSON] Falha ao extrair JSON da resposta:', raw);
    throw new SyntaxError('Não foi possível extrair JSON válido. A IA pode estar indisponível ou respondeu fora do formato.');
}
