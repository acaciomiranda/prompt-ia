// app.js
import { getApiKey, saveModel, callAI, extractJSON, CONFIG } from './api.js';
import { 
    getEl, hide, show, setLoading, showToast, renderSkills, 
    updateApiKeyUI, updateRateLimitUI, openApiKeyModal, closeApiKeyModal, closeModal, 
    triggerDownload, escHtml, resetEmptyState, handleDownloadFromPreview, openPreviewModal,
    initTheme, toggleTheme, ERROR_MESSAGES
} from './ui.js';
import { AppState } from './state.js';

// Função global injetada apenas se estritamente útil para callbacks externos
window.updateRateLimitUI = updateRateLimitUI;

// ─── Error Boundary ───────────────────────────────────────────────────────────
async function withErrorBoundary(fn) {
    try {
        await fn();
    } catch (err) {
        console.error('[ErrorBoundary]', err);
        showToast(`❌ Erro inesperado: ${err.message || 'Falha na aplicação'}`);
        setLoading(false);
    }
}

// ─── Histórico de Busca ───────────────────────────────────────────────────────
function updateSearchHistory(query) {
    const normalize = (s) => s.trim().toLowerCase();
    let history = JSON.parse(localStorage.getItem('prompts_ia_history') || '[]');
    history = history.filter(item => normalize(item) !== normalize(query)); // Remove duplicado normalizado
    history.unshift(query.trim());
    history = history.slice(0, CONFIG.SEARCH_HISTORY_LIMIT); 
    localStorage.setItem('prompts_ia_history', JSON.stringify(history));
    renderSearchHistory();
}

let lastHistoryStr = '';
function renderSearchHistory() {
    const list = getEl('search-history');
    if (!list) return;
    
    const historyStr = localStorage.getItem('prompts_ia_history') || '[]';
    // Otimização de Perfomance: Retorna cedo se o estado JSON é idêntico para evitar DOM Thrashing
    if (historyStr === lastHistoryStr) return; 
    lastHistoryStr = historyStr;
    
    const history = JSON.parse(historyStr);
    list.innerHTML = '';
    history.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item;
        list.appendChild(opt);
    });
}

// ─── Debounce Utils ───────────────────────────────────────────────────────────
function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}
const debouncedSearch = debounce(() => withErrorBoundary(doSearch), CONFIG.SEARCH_DEBOUNCE_MS);

// ─── Search ───────────────────────────────────────────────────────────────────
let isSearching = false;

function quickSearch(q) {
  getEl('search-input').value = q;
  debouncedSearch();
}

async function doSearch() {
  if (isSearching) return;
  
  const q = getEl('search-input').value.trim();
  
  if (!q) {
    showToast('⚠️ Digite algo para buscar');
    return;
  }
  
  if (q.length < 3) {
    showToast('⚠️ Digite pelo menos 3 caracteres');
    return;
  }

  if (!getApiKey()) {
    openApiKeyModal();
    return;
  }

  isSearching = true;
  setLoading(true, 'Consultando a IA...');
  hide('results-area');
  resetEmptyState();
  
  // S8: Atualizar título da página dinamicamente para SEO
  document.title = `Busca: ${q} — prompts-ia`;

  AppState.clear();

  try {
    const skills = await fetchSkillsForQuery(q);

    if (!skills || !skills.length) {
      getEl('empty-state').classList.add('show');
      return;
    }

    AppState.set('skills', skills);
    renderSkills(skills, q);
    updateSearchHistory(q);
    show('results-area');

  } catch (err) {
    console.error('[doSearch]', err);

    if (err.message === 'API_KEY_MISSING' || err.message === 'API_KEY_INVALID') {
      openApiKeyModal();
      showToast('⚠ Configure sua API Key para continuar.');
    } else {
      const errorMsg = err.message || 'Erro desconhecido';
      getEl('empty-state').innerHTML = `
        <div class="icon">⚠️</div>
        <p>Erro ao buscar skills.</p>
        <div class="error-details">
          ${escHtml(errorMsg)}
          <br><br>
          <small>Verifique o console (F12) para detalhes técnicos.</small>
        </div>
      `;
      getEl('empty-state').classList.add('show');
    }
  } finally {
    setLoading(false);
    // Cooldown de segurança para evitar spam
    setTimeout(() => { isSearching = false; }, CONFIG.SEARCH_COOLDOWN_MS);
  }
}

function saveApiKey() {
  const key   = getEl('apikey-input').value.trim();
  const model = getEl('model-select').value;

  if (!key) {
    showToast('⚠ Cole sua API Key do OpenRouter.');
    return;
  }
  localStorage.setItem('prompts_ia_api_key', key);
  saveModel(model);
  updateApiKeyUI();
  closeApiKeyModal();
  showToast('✓ Configurações salvas!');
};

// ─── Geração de Skills ────────────────────────────────────────────────────────
const generatingCache = new Set();

async function fetchSkillsForQuery(query) {
  const system = `Você é um especialista em engenharia de prompts.
Retorne APENAS um array JSON de objetos com a estrutura:
[{"id":"slug-aqui","title_pt":"Título em PT","title_en":"Title in EN","description_pt":"Descrição em português de 1-2 frases.","tags":["tag1","tag2","tag3"],"prompt_content":"Prompt profissional em inglês...","relevance":"exact"}]`;

  const user = `Consulta do usuário: "${query}"

Gere 4 skills (2 exatas, 2 relacionadas) para este tema. Retorne o resultado em formato JSON.`;

  const raw = await callAI({ system, user, maxTokens: 2048 });
  return extractJSON(raw);
}

async function generateSkillMD(skill) {
  const system = `Você gera arquivos SKILL.md profissionais para agentes de IA (Claude Code, Cursor, Windsurf).
Retorne APENAS o conteúdo do arquivo, sem explicações adicionais.`;

  const user = `Gere um SKILL.md completo para:
- Título: ${skill.title_en}
- Descrição: ${skill.description_pt}
- Tags: ${skill.tags.join(', ')}
- Prompt base: ${skill.prompt_content}

Use este formato exato:

---
name: ${skill.id}
description: ${skill.description_pt}
tags: ${skill.tags.join(', ')}
license: CC0 1.0 Universal
---

# ${skill.title_pt}

[2 parágrafos explicando o propósito e contexto da skill]

## Como usar

[Instruções claras de quando e como ativar esta skill]

## Prompt

[O prompt principal, detalhado e profissional, com \${variavel} para campos personalizáveis]

## Exemplos de ativação

- [Exemplo 1 de solicitação do usuário]
- [Exemplo 2 de solicitação do usuário]
- [Exemplo 3 de solicitação do usuário]

## Notas

[Dicas, variações e observações importantes]`;

  return callAI({ system, user, maxTokens: 2048 });
}

// ─── Download e Preview ───────────────────────────────────────────────────────

async function downloadSkill(id, btn) {
  const skill = AppState.get('skills').find(s => s.id === id);
  if (!skill) return;

  const orig = btn.innerHTML;
  btn.disabled = true;
  btn.classList.add('loading');
  btn.innerHTML = '⏳ Gerando...';

  try {
    const cache = AppState.get('cache');
    const content = cache[id] || await generateSkillMD(skill);
    cache[id] = content;
    triggerDownload(`${skill.id}.SKILL.md`, content);
    showToast(`✓ ${skill.title_pt} — baixado!`);
  } catch (err) {
    console.error('[downloadSkill]', err);
    showToast('Erro ao gerar SKILL.md. Tente novamente.');
  } finally {
    btn.disabled = false;
    btn.classList.remove('loading');
    btn.innerHTML = orig;
  }
}

async function downloadAll() {
  const skills = AppState.get('skills');
  if (!skills.length) return;
  
  const btn = getEl('btn-download-all');
  if (btn) {
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '⏳ Gerando ZIP...';
    
    try {
      const zip = new JSZip();
      const cache = AppState.get('cache');
      
      for (const skill of skills) {
        if (!cache[skill.id]) cache[skill.id] = await generateSkillMD(skill);
        zip.file(`${skill.id}.SKILL.md`, cache[skill.id]);
      }
      
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prompts-ia-pack.zip`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('📦 Pacote ZIP baixado!');
    } catch (err) {
      console.error('[downloadAll]', err);
      showToast('❌ Erro ao gerar pacote ZIP.');
    } finally {
      btn.disabled = false;
      btn.innerHTML = orig;
    }
  }
}

async function previewSkill(id) {
  const skill = AppState.get('skills').find(s => s.id === id);
  if (!skill) return;

  if (generatingCache.has(id)) {
    showToast('⏳ Aguarde, a skill já está sendo gerada...');
    return;
  }

  getEl('modal-preview-title').textContent = skill.title_pt;
  getEl('modal-filename').textContent = `${skill.id}.SKILL.md`;
  getEl('modal-code').textContent     = '⏳ Gerando preview...';
  
  openPreviewModal();

  try {
    generatingCache.add(id);
    const cache = AppState.get('cache');
    if (!cache[id]) {
      cache[id] = await generateSkillMD(skill);
    }
    getEl('modal-code').textContent = cache[id];
    
    // Configura buttons internos do modal
    const dlBtn = getEl('modal-dl-btn');
    if(dlBtn) {
       dlBtn.onclick = () => handleDownloadFromPreview(skill, cache[id]);
    }

    const copyBtn = getEl('modal-copy-btn');
    if (copyBtn) {
      copyBtn.onclick = async () => {
        try {
          await navigator.clipboard.writeText(cache[id]);
          showToast('📋 Copiado para a área de transferência!');
        } catch (err) {
          console.error('[copySkill]', err);
          showToast('❌ Erro ao copiar conteúdo.');
        }
      };
    }

  } catch (err) {
    getEl('modal-code').textContent = `Erro: ${err.message}`;
  } finally {
    generatingCache.delete(id);
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Inicialização
  initTheme();
  updateApiKeyUI();
  renderSearchHistory();
  getEl('search-input').focus();

  // Master Event Delegation
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    
    const action = target.dataset.action;
    
    if (action === 'toggleTheme') toggleTheme();
    if (action === 'downloadAll') withErrorBoundary(downloadAll);
    if (action === 'openApiKeyModal') openApiKeyModal();
    if (action === 'closeApiKeyModal') closeApiKeyModal();
    if (action === 'closeModal') closeModal();
    if (action === 'doSearch') debouncedSearch();
    if (action === 'saveApiKey') saveApiKey();
    if (action === 'quickSearch') {
        const q = target.dataset.query;
        if (q) quickSearch(q);
    }
    if (action === 'downloadSkill') {
        const id = target.dataset.skillId;
        if (id) withErrorBoundary(() => downloadSkill(id, target));
    }
    if (action === 'previewSkill') {
        const id = target.dataset.previewId;
        if (id) withErrorBoundary(() => previewSkill(id));
    }
  });

  // Enter para buscar
  getEl('search-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') debouncedSearch();
  });

  // Fechar modal com Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal();
      closeApiKeyModal();
    }
  });

  // Fechar modal clicando no overlay
  getEl('modal').addEventListener('click', e => {
    if (e.target === getEl('modal')) closeModal();
  });
  getEl('apikey-modal').addEventListener('click', e => {
    if (e.target === getEl('apikey-modal')) closeApiKeyModal();
  });

  // Enter na input da API key
  getEl('apikey-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') saveApiKey();
  });
});
