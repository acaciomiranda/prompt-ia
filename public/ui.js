// ui.js
import { getApiKey, getModel, MODELS, DEFAULT_MODEL, CONFIG } from './api.js';

export function getEl(id) {
    const el = document.getElementById(id);
    if (!el && id !== 'toast') console.warn(`[UI] Elemento #${id} não encontrado no DOM.`);
    return el;
}

export function show(id) {
    const el = getEl(id);
    if (el) el.style.display = 'block';
}

export function hide(id) {
    const el = getEl(id);
    if (el) el.style.display = 'none';
}

export function setLoading(on, label = 'Buscando skills...') {
    const el = getEl('loading');
    if (el) {
        el.classList.toggle('show', on);
        el.setAttribute('aria-hidden', !on);
    }
    const loadingLabel = getEl('loading-label');
    if (loadingLabel) loadingLabel.textContent = label;
    const searchBtn = getEl('search-btn');
    if (searchBtn) searchBtn.disabled = on;
}

export function resetEmptyState() {
    const el = getEl('empty-state');
    if (!el) return;
    el.innerHTML = `
        <div class="icon">🔍</div>
        <p>Nenhuma skill encontrada.<br>Tente termos diferentes.</p>
    `;
    el.classList.remove('show');
}

export function showToast(msg, duration = CONFIG.TOAST_DURATION_MS) {
    const t = getEl('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    t.setAttribute('role', 'alert');
    setTimeout(() => t.classList.remove('show'), duration);
}

export const ERROR_MESSAGES = {
    'API_KEY_MISSING': {
        title: '🔑 API Key não configurada',
        message: 'Configure sua chave do OpenRouter para continuar.',
        action: 'Configurar'
    },
    'RATE_LIMIT': {
        title: '⏱️ Limite atingido',
        message: 'O servidor atingiu o limite de requisições. Tente em instantes.',
        action: null
    },
    'PAYLOAD_PARSE_ERROR': {
        title: '🧩 Erro de resposta',
        message: 'A IA enviou um formato inválido. Tentando novamente...',
        action: 'Retry'
    }
};

export function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('prompts_ia_theme', next);
    showToast(`Tema ${next === 'dark' ? 'Escuro' : 'Claro'} ativado!`);
}

export function initTheme() {
    const saved = localStorage.getItem('prompts_ia_theme') || 
                  (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', saved);
}

export function escHtml(s) {
    return String(s ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

export function updateApiKeyUI() {
    const key = getApiKey();
    const btn = getEl('btn-api-key');
    const banner = getEl('api-banner');
    const indicator = getEl('active-model-indicator');

    const currentModelId = getModel();
    const modelObj = MODELS.find(m => m.id === currentModelId) || MODELS.find(m => m.id === DEFAULT_MODEL);
    
    if (indicator && modelObj) {
        indicator.textContent = `Modelo: ${modelObj.label.replace('🆓 ', '')}`;
        indicator.style.display = 'inline-block';
    }

    if (key) {
        if (btn) { btn.textContent = '⚙ Configurações ✓'; btn.classList.add('configured'); }
        if (banner) banner.classList.remove('show');
    } else {
        if (btn) { btn.textContent = '⚙ Configurações'; btn.classList.remove('configured'); }
        if (banner) banner.classList.add('show');
    }
}

export function updateRateLimitUI(remaining) {
    const el = getEl('rate-limit-indicator');
    if (el) {
        el.textContent = `${remaining} reqs. API`;
        el.style.display = 'inline-block';
    }
}

export function populateModelSelect() {
    const sel = getEl('model-select');
    if (!sel) return;
    const current = getModel();
    sel.innerHTML = '';

    const groups = {
        free: { label: '🆓 Gratuitos (sem custo)', models: [] },
        paid: { label: '💳 Pagos', models: [] },
    };

    MODELS.forEach(m => {
        (m.free ? groups.free : groups.paid).models.push(m);
    });

    Object.values(groups).forEach(g => {
        if (!g.models.length) return;
        const og = document.createElement('optgroup');
        og.label = g.label;
        g.models.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m.id;
            opt.textContent = m.label;
            if (m.id === current) opt.selected = true;
            og.appendChild(opt);
        });
        sel.appendChild(og);
    });

    if (!sel.value) sel.value = DEFAULT_MODEL;
}

let lastFocus = null;

function setupFocusTrap(modalId, closeFn) {
    const modal = getEl(modalId);
    if (!modal) return;
    
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const trap = (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
        if (e.key === 'Escape') closeFn();
    };

    modal._trapHandler = trap; // Guarda para remoção
    modal.addEventListener('keydown', trap);
}

function removeFocusTrap(modalId) {
    const modal = getEl(modalId);
    if (modal && modal._trapHandler) {
        modal.removeEventListener('keydown', modal._trapHandler);
        delete modal._trapHandler;
    }
}

export function openApiKeyModal() {
    lastFocus = document.activeElement;
    populateModelSelect();
    getEl('apikey-input').value = getApiKey();
    getEl('apikey-modal').classList.add('show');
    getEl('apikey-input').focus();
    setupFocusTrap('apikey-modal', closeApiKeyModal);
}

export function closeApiKeyModal() {
    getEl('apikey-modal').classList.remove('show');
    removeFocusTrap('apikey-modal');
    if (lastFocus) lastFocus.focus();
}

export function closeModal() {
    getEl('modal').classList.remove('show');
    removeFocusTrap('modal');
    if (lastFocus) lastFocus.focus();
}

// Preview Modal (chamado em app.js) precisa de track de foco também
export function openPreviewModal() {
    lastFocus = document.activeElement;
    getEl('modal').classList.add('show');
    getEl('modal-code').focus(); // Foco no código para leitura
    setupFocusTrap('modal', closeModal);
}

export function handleDownloadFromPreview(skill, content) {
    triggerDownload(`${skill.id}.SKILL.md`, content);
    showToast(`✓ ${skill.title_pt} — baixado!`);
    closeModal();
}

export function triggerDownload(filename, content) {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export async function renderSkills(skills, query) {
    const resultsTitle = getEl('results-title');
    if (resultsTitle) {
        resultsTitle.innerHTML = `<strong>${skills.length} skills</strong> encontradas para <strong>"${escHtml(query)}"</strong>`;
    }

    const list = getEl('skills-list');
    if (!list) return;

    // Exibe botão de baixar tudo se houver skills
    const dlAll = getEl('btn-download-all');
    if (dlAll) dlAll.style.display = skills.length > 0 ? 'flex' : 'none';

    list.innerHTML = '';

    const BATCH_SIZE = CONFIG.BATCH_SIZE;
    for (let i = 0; i < skills.length; i += BATCH_SIZE) {
        const batch = skills.slice(i, i + BATCH_SIZE);
        
        batch.forEach((skill, batchIndex) => {
            const index = i + batchIndex;
            const badgeClass = skill.relevance === 'exact' ? 'badge-exact' : 'badge-related';
            const badgeLabel = skill.relevance === 'exact' ? 'EXATA' : 'RELACIONADA';
            const tagsHtml = (skill.tags || []).slice(0, 4)
                .map(t => `<span class="stag">${escHtml(String(t))}</span>`).join('');

            // Sanitiza o ID para prevenir injeção de código via resposta da IA
            const safeId = String(skill.id || '').replace(/[^a-z0-9\-_]/gi, '');

            const card = document.createElement('div');
            card.className = 'skill-card fade-in-up';
            card.style.animationDelay = `${index * 0.12}s`;
            card.innerHTML = `
      <div class="skill-card-body">
        <div class="skill-card-head">
          <span class="skill-name">${escHtml(skill.title_pt)}</span>
          <span class="skill-badge ${badgeClass}">${badgeLabel}</span>
        </div>
        <div class="skill-desc">${escHtml(skill.description_pt)}</div>
        <div class="skill-preview">${escHtml(skill.prompt_content)}</div>
        <div class="skill-tags">${tagsHtml}</div>
      </div>
      <div class="skill-actions">
        <button class="btn-dl" data-action="downloadSkill" data-skill-id="${safeId}">
          ⬇ Baixar SKILL.md
        </button>
        <button class="btn-secondary" data-action="previewSkill" data-preview-id="${safeId}">
          👁 Visualizar
        </button>
      </div>
    `;
            list.appendChild(card);
        });

        // Yield to main thread (Batching) para manter 60FPS
        await new Promise(resolve => requestAnimationFrame(resolve));
    }
}