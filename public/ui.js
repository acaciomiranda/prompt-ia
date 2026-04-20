// ui.js
import { getApiKey, getModel, MODELS, DEFAULT_MODEL } from './api.js';

export function getEl(id) {
    return document.getElementById(id);
}

export function show(id) {
    getEl(id).style.display = 'block';
}

export function hide(id) {
    getEl(id).style.display = 'none';
}

export function setLoading(on, label = 'Buscando skills...') {
    const el = getEl('loading');
    if (el) el.classList.toggle('show', on);
    const loadingLabel = getEl('loading-label');
    if (loadingLabel) loadingLabel.textContent = label;
    const searchBtn = getEl('search-btn');
    if (searchBtn) searchBtn.disabled = on;
}

export function showToast(msg, duration = 3000) {
    const t = getEl('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), duration);
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

export function openApiKeyModal() {
    populateModelSelect();
    getEl('apikey-input').value = getApiKey();
    getEl('apikey-modal').classList.add('show');
    getEl('apikey-input').focus();
}

export function closeApiKeyModal() {
    getEl('apikey-modal').classList.remove('show');
}

export function closeModal() {
    getEl('modal').classList.remove('show');
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
    list.innerHTML = '';

    const BATCH_SIZE = 4;
    for (let i = 0; i < skills.length; i += BATCH_SIZE) {
        const batch = skills.slice(i, i + BATCH_SIZE);
        
        batch.forEach((skill, batchIndex) => {
            const index = i + batchIndex;
            const badgeClass = skill.relevance === 'exact' ? 'badge-exact' : 'badge-related';
            const badgeLabel = skill.relevance === 'exact' ? 'EXATA' : 'RELACIONADA';
            const tagsHtml = (skill.tags || []).slice(0, 4)
                .map(t => `<span class="stag">${escHtml(t)}</span>`).join('');

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