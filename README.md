# prompts-ia 🧠

**Buscador de Skills para IA em português.**
Digite o que você precisa, escolha o modelo, e receba arquivos `SKILL.md` prontos para usar no Claude Code, Cursor, Windsurf e outros agentes de IA.

🔗 **Demo:** [prompt-ia-woad.vercel.app](https://prompt-ia-woad.vercel.app/)

---

## ✨ Funcionalidades

- 🔍 **Busca em português** — sem precisar saber o nome técnico da skill em inglês
- 🤖 **Multi-modelo** — escolha entre modelos gratuitos e pagos via OpenRouter
- 🆓 **Modelos gratuitos incluídos** — Gemma 3, Llama 4, DeepSeek R1, Qwen3 e mais (sem custo por token)
- ⬇️ **Download direto** — gera e baixa o `SKILL.md` com um clique
- 👁️ **Preview antes de baixar** — visualize o conteúdo do arquivo antes de salvar
- 💾 **Configuração persistente** — API Key e modelo ficam salvos no browser
- 🚀 **Zero dependências** — HTML + CSS + JS puro, abre direto no browser
- 🔒 **Seguro** — sanitização de inputs, sem coleta de dados, chaves ficam apenas no seu browser
- ⏱️ **Timeout inteligente** — fallback automático para outro modelo se um demorar mais de 30s

---

## 📁 Estrutura do projeto

```
prompts-ia/
├── public/
│   ├── index.html     ← Interface principal (Premium Dark Mode)
│   ├── style.css      ← Design System (Glassmorphism & Glow)
│   ├── app.js         ← Orquestrador do aplicativo (ES Modules)
│   ├── api.js         ← Módulo de comunicação com OpenRouter
│   ├── ui.js          ← Módulo de manipulação de Interface e DOM
│   └── brain.svg      ← Favicon do app
├── package.json       ← Scripts de desenvolvimento
├── vercel.json        ← Config de deploy no Vercel
├── .gitignore
└── README.md
```

---

## 🚀 Como usar

### Opção 1 — Abrir direto no browser (mais simples)
Abra o arquivo `public/index.html` no seu browser. Não precisa de servidor nem instalação.

> ⚠️ Atenção: ao abrir como arquivo local (`file://`), os ES Modules podem ser bloqueados pelo browser por motivos de segurança (CORS). Use a Opção 2 para desenvolvimento local.

### Opção 2 — Servidor local
```bash
npm install
npm run dev
# Acesse: http://localhost:3000
```

### Opção 3 — Deploy no Vercel
```bash
npx vercel --prod
```

---

## 🔑 Configuração da API Key

A aplicação usa a **OpenRouter API** — um gateway unificado que dá acesso a centenas de modelos de IA com uma única chave.

### Passo a passo:
1. Acesse **[openrouter.ai/keys](https://openrouter.ai/keys)**
2. Crie uma conta gratuita (sem cartão de crédito para modelos free)
3. Gere uma API Key (começa com `sk-or-v1-...`)
4. No app, clique em **⚙ Configurações** (canto superior direito)
5. Cole a chave e escolha o modelo desejado
6. Clique em **Salvar**

> A chave fica salva **apenas no seu browser** (localStorage). Nunca é enviada para nenhum servidor além do OpenRouter.



## 🤖 Modelos disponíveis

### 🆓 Gratuitos (sem custo por token)

| Modelo | ID no OpenRouter | Destaque |
|---|---|---|
| **Gemma 3 27B** | `google/gemma-3-27b-it:free` | Modelo open-weight de alta qualidade, 27B parâmetros |
| **Llama 4 Maverick** | `meta-llama/llama-4-maverick:free` | Arquitetura MoE, excelente para tarefas gerais |
| **Llama 4 Scout** | `meta-llama/llama-4-scout:free` | Versão leve e rápida do Llama 4 |
| **Llama 3.3 70B** | `meta-llama/llama-3.3-70b-instruct:free` | Muito capaz, boa escolha para texto longo |
| **DeepSeek R1** | `deepseek/deepseek-r1:free` | Modelo de raciocínio (chain-of-thought) |
| **Mistral Small 3.1** | `mistralai/mistral-small-3.1-24b-instruct:free` | Leve, rápido e capaz |
| **Qwen3 8B** | `qwen/qwen3-8b:free` | Modelo compacto da Alibaba com bom desempenho |
| **Auto-Gratuito** | `openrouter/free` | OpenRouter escolhe o melhor modelo gratuito disponível |

> Modelos gratuitos têm limite de ~20 requisições/minuto e 200/dia no OpenRouter.

### 💳 Pagos (cobrados por token)

| Modelo | Provider |
|---|---|
| Gemini 2.0 Flash | Google |
| Gemini 2.5 Pro | Google |
| GPT-4o Mini | OpenAI |
| GPT-4o | OpenAI |
| Claude Sonnet 4.5 | Anthropic |
| Claude Haiku 4.5 | Anthropic |
| DeepSeek Chat V3 | DeepSeek |
| Mistral Small 3.1 | Mistral |

---

## 🔄 Fallback automático de modelos

Se o modelo principal falhar (indisponível, erro de rede, ou timeout), o sistema tenta automaticamente os modelos de fallback na seguinte ordem:

1. Modelo selecionado pelo usuário
2. `meta-llama/llama-3.3-70b-instruct:free`
3. `mistralai/mistral-small-3.1-24b-instruct:free`
4. `openrouter/free`

Cada modelo tem **timeout de 30 segundos**. Se não responder no tempo, passa para o próximo.

---

## 📄 Formato do SKILL.md gerado

Cada arquivo gerado segue o padrão compatível com Claude Code e outros agentes:

```markdown
---
name: graphic-design
description: Quando e como usar esta skill...
tags: design, visual, criativo
license: CC0 1.0 Universal
---

# Design Gráfico

[Explicação do propósito e contexto]

## Como usar

[Instruções de ativação]

## Prompt

[Prompt profissional com ${variavel} para campos personalizáveis]

## Exemplos de ativação

- Exemplo 1 de solicitação
- Exemplo 2 de solicitação
- Exemplo 3 de solicitação

## Notas

[Dicas e variações]
```

---

## 🛠️ Como usar os arquivos SKILL.md

### Claude Code
Coloque o arquivo na pasta `.claude/skills/` do seu projeto:
```bash
mkdir -p .claude/skills
mv design-grafico.SKILL.md .claude/skills/
```

### Cursor / Windsurf
Adicione o conteúdo do SKILL.md como uma regra no `.cursorrules` ou nas configurações de skills do editor.

### Qualquer agente OpenAI-compatible
Use o conteúdo do `## Prompt` como system prompt da sua configuração.

---

## 🔒 Segurança

- **API Key no localStorage**: sua chave nunca sai do browser, exceto nas chamadas diretas ao OpenRouter
- **Sanitização de inputs**: todos os dados retornados pela IA são sanitizados antes de serem inseridos no DOM (`escHtml`)
- **IDs seguros**: os IDs das skills geradas pela IA passam por um regex que remove caracteres especiais antes de qualquer uso em eventos (`/[^a-z0-9\-_]/gi`)
- **Event listeners**: os botões de ação usam `addEventListener` em vez de `onclick` inline para evitar injeção de código

---

## 🏗️ Arquitetura técnica

O projeto é uma SPA (Single Page Application) sem bundler — HTML + CSS + JS puro com ES Modules nativos do browser.

```
index.html
    └── <script type="module" src="app.js">
            ├── import from './api.js'    ← fetch, modelos, extractJSON
            └── import from './ui.js'     ← DOM, renderização, modais
```

### Detalhes de cada módulo

| Arquivo | Responsabilidade |
|---|---|
| `app.js` | Orquestração, event handlers globais (`window.*`), lógica de busca e download |
| `api.js` | Configuração de modelos, chamadas fetch com AbortController, parse de JSON da IA |
| `ui.js` | Renderização de cards, modais, toast, download de arquivos |
| `style.css` | Design system com variáveis CSS, dark mode, glassmorphism, responsividade |

---

## 📝 Histórico de atualizações

### v2.4.1 — Abril 2026 (Refinamento de Acessibilidade)
- ✅ **Design System Light Refinado**: Implementada paleta profissional *Slate/Zinc* para o modo claro, garantindo alto contraste e estética premium.
- ✅ **Ajustes de Glassmorphism**: Barra de busca e modais agora possuem opacidade e blur otimizados para fundos claros.
- ✅ **Glow Balance**: Redução da intensidade dos efeitos de neon no modo claro para evitar poluição visual e melhorar o foco no conteúdo.
- ✅ **Toast e UI Polida**: Melhoria nas sombras, bordas e mensagens flutuantes para visibilidade total em qualquer tema.

### v2.4 — Abril 2026 (Bugs e Melhorias Avançadas)
- ✅ **Extermínio de Race Conditions**: Implementado `generatingCache` para evitar múltiplas gerações simultâneas de uma mesma skill.
- ✅ **Exportação em Lote (ZIP)**: Adicionado suporte à biblioteca `JSZip` para baixar todas as skills de uma busca em um único arquivo comprimido.
- ✅ **Tema Claro & Acessibilidade**: Implementado toggle de tema (Dark/Light) com persistência no `localStorage` e suporte a `prefers-color-scheme`.
- ✅ **Robustez no DOM**: Refatoração das funções de UI para prevenir crashes caso elementos esperados não estejam presentes no DOM.
- ✅ **Normalização de Histórico**: Histórico de busca agora ignora espaços extras e diferenças de caixa Alta/Baixa.
- ✅ **Mensagens de Erro Categorizadas**: Interface mais informativa para erros de API Key, Rate Limit e Rede.

### v2.3 — Abril 2026 (Boas Práticas e Código Limpo)
- ✅ **Configurações Centralizadas**: Eliminação de "Magic Numbers" através do objeto `CONFIG` (`api.js`), centralizando timeouts, limites de histórico e tamanhos de lote.
- ✅ **Validação de Entrada**: Implementada validação UX no campo de busca (mínimo 3 caracteres ou aviso de campo vazio via Toast).
- ✅ **Refatoração DRY (ui.js)**: Centralização do gerenciamento de estado vazio (`resetEmptyState`) e lógica de download, reduzindo callbacks aninhados em `app.js`.
- ✅ **Suite de Testes Unitários**: Criado `test.js` para validação de funções críticas como sanitização XSS e extração de JSON da IA.
- ✅ **Aumento de Eficiência**: O limite máximo de tokens foi otimizado para `4096` no objeto `CONFIG` para suportar respostas mais complexas se necessário.

### v2.2 — Abril 2026 (Responsividade e Mobile UX)
- ✅ **Touch Targets (44px)**: Todos os botões e áreas clicáveis foram aumentados para garantir conformidade com Apple HIG e Android UX (mínimo 44x44px).
- ✅ **Refino de Breakpoints (Mobile-First)**:
  - **480px**: Ações de busca reorganizadas em coluna para evitar quebras em telas estreitas.
  - **640px**: Modais agora ocupam 95% da largura e código de preview ajustado para 12px para máxima legibilidade.
  - **768px**: Grid de resultados adaptável para 1 coluna e escala tipográfica do Hero otimizada.
- ✅ **Visibilidade Inteligente**: Elementos secundários (como dicas da topbar) são ocultados em telas pequenas para priorizar a busca.

### v2.1 — Abril 2026 (Acessibilidade e Inclusão)
- ✅ **Focus Management & Trap**: Implementado controle de foco rígido em modais (`ui.js`). O foco agora é capturado ao abrir, mantido dentro do modal (trap) e restaurado ao fechar.
- ✅ **Semântica ARIA**: Adição de `aria-label`, `aria-hidden` e `aria-modal` para melhor experiência com leitores de tela.
- ✅ **Skip Links & Nav**: Adicionado "Skip to Main Content" para usuários de teclado. Todos os inputs agora possuem labels associados (visíveis ou via `.sr-only`).
- ✅ **Contraste WCAG AAA**: Ajuste de cores para conformidade com padrões internacionais de visão.
- ✅ **Aria-Live Status**: Anúncios dinâmicos para estados de carregamento ("Consultando a IA...") via `role="status"`.

### v2.0 — Abril 2026 (Segurança e Robustez)
- ✅ **Content Security Policy (CSP)**: Implementada Meta Tag CSP rigorosa para mitigar XSS e exfiltração de dados (bloqueio de origens não autorizadas).
- ✅ **Validação Estrita de API Key**: O sistema agora valida o formato oficial do OpenRouter (`sk-or-v1-`) antes de aceitar a chave, prevenindo o uso de dados corrompidos.
- ✅ **XSS Defense-in-Depth**: Auditoria e reforço de escaping (`escHtml`) em 100% dos campos dinâmicos retornados pela IA (incluindo tags e IDs).
- ✅ **Anti-Spam & Privacy**: Implementado "Search Cooldown" (trava de 2s entre buscas) para evitar abuso da API. Remoção de todos os logs de console remanescentes que poderiam expor dados da resposta.

### v1.9 — Abril 2026 (Performance e Otimização)
- ✅ **Font Loading**: Implementado carregamento assíncrono de fontes com `preload` e técnica de deferred loading (melhoria em LCP/FCP).
- ✅ **Batch Character Rendering**: Renderização de cards em lotes (batching) com `requestAnimationFrame` para evitar travamentos da Main-Thread.
- ✅ **Debounce de Busca**: Adicionado atraso inteligente no processamento de teclas para evitar submissões duplicadas e sobrecarga da API.
- ✅ **DOM Thrashing Prevention**: Cache lógico no renderizador do histórico de busca para evitar relayouts desnecessários.
- ✅ **Estratégia de Cache (PWA)**: Service Worker atualizado para `Stale-While-Revalidate`, garantindo carregamento instantâneo de recursos estáticos.

### v1.8 — Abril 2026 (Refatoração de Arquitetura)
- ✅ **State Management**: Refatoração das variáveis espalhadas (como `currentSkills`) para um objeto proxy reativo (`state.js`), melhorando a manutenibilidade.
- ✅ **Event Delegation**: Substituição de todos os handlers `onclick="..."` inline no HTML em prol de `data-actions` interceptados na raiz do DOM. Zero poluição de variáveis no construtor `window`.
- ✅ **Error Boundary**: Toda execução assíncrona foi envolvida em um utilitário central `withErrorBoundary()` para prevenção de travamentos silenciosos da UI.

### v1.7 — Abril 2026
- ✅ **Suporte PWA (Progressive Web App)**: agora o Prompts-IA pode ser instalado no celular e desktop nativamente (`manifest.json` e Service Worker suportados).
- ✅ **Histórico de Buscas (UX)**: pesquisas recentes são salvas no `localStorage` e exibidas como `<datalist>` no input, acelerando reconsultas.
- ✅ **Taxímetro de Requisições (Rate Limiting)**: lê e atualiza no top-bar quantas chamadas o modelo atual ainda tem na fila da OpenRouter.
- ✅ **Apresentação em Staggered Fade-in**: cards agora desenham na tela suavemente usando *CSS Cascading Animation*.

### v1.6 — Abril 2026
- ✅ **Favicon adicionado**: ícone `brain.svg` 🧠 aparece na aba do browser
- ✅ **SEO (Page Title dinâmico)**: `<title>` da página agora muda refletindo o termo da busca atual
- ✅ **Indicador de modelo ativo**: mostra o modelo em uso diretamente na topbar
- ✅ **Botão de Copiar**: novo botão no modal de preview para copiar a skill gerada com 1 clique
- ✅ **Responsividade aprimorada**: novos breakpoints de CSS para telas médias (1024px) e tablets (768px)
- ✅ **Correção no Empty State**: estado vazio ("nenhuma skill encontrada") restaurado corretamente caso o usuário recupere a busca após um erro
- ✅ **Timeout de 30s na API**: uso de `AbortController` para cancelar chamadas lentas e tentar o próximo modelo automaticamente
- ✅ **Sanitização de `skill.id`**: IDs retornados pela IA passam por regex `/[^a-z0-9\-_]/gi` antes de qualquer uso
- ✅ **Event listeners seguros**: botões de ação migrados de `onclick` inline para `addEventListener`, eliminando risco de injeção via resposta da IA
- ✅ **README atualizado**: documentação completa de segurança, arquitetura e modelos

### v1.5 — Abril 2026
- ✅ **Arquitetura ES Modules**: código separado em `api.js`, `ui.js` e `app.js` com `import/export` nativos
- ✅ **`vercel.json` corrigido**: `Content-Type: application/javascript` garantido para ES Modules no deploy
- ✅ **`api-banner` adaptado ao dark mode**: cores amarelas legíveis sobre fundo escuro
- ✅ **`.error-details`** adicionado ao CSS: exibição de erros técnicos com estilo consistente
- ✅ **Botão "Attach files" desabilitado** visualmente para evitar confusão na versão de demo
- ✅ **`topbar` corrigida**: fundo `#000` com borda sutil
- ✅ **`extractJSON` aprimorado**: 4 estratégias de parse para máxima resiliência

### v1.4 — Abril 2026
- ✅ **Novo layout da barra de buscas**: Redesign premium com tema escuro (Dark Mode)
- ✅ Implementados efeitos visuais avançados: Glassmorphism e glow animado
- ✅ Botão "Deep thinking" configurado como atalho para as configurações de modelo

### v1.3 — Abril 2026
- ✅ Adicionados **5 modelos gratuitos** via OpenRouter: Gemma 3 27B, Llama 4 Maverick, Llama 4 Scout, DeepSeek Chat V3 (free), Mistral Small 3.1 (free)
- ✅ Seletor de modelos reorganizado em grupos: **Gratuitos** e **Pagos** com optgroup
- ✅ Modelos gratuitos identificados com emoji 🆓 no seletor
- ✅ README completamente reescrito com documentação completa

### v1.2 — Abril 2026
- ✅ Migração da API: **Anthropic → OpenRouter** (`https://openrouter.ai/api/v1`)
- ✅ Painel de configurações com **seleção de modelo** (11 modelos iniciais)
- ✅ Suporte ao formato OpenAI-compatible (headers `Authorization: Bearer`)
- ✅ Validação flexível da API Key (aceita qualquer formato sk-or-*)
- ✅ Label visual no modal distinguindo modelos disponíveis

### v1.1 — Abril 2026
- ✅ **Correção crítica**: `max_tokens` aumentado de 1000 → 2048 (resolvia erro de JSON truncado)
- ✅ Função `extractJSON()` robusta com múltiplas estratégias de parse
- ✅ Repositório separado em 3 arquivos: `index.html`, `style.css`, `app.js`
- ✅ Modal de API Key com validação de formato
- ✅ `package.json`, `vercel.json` e `.gitignore` adicionados
- ✅ `README.md` inicial criado

### v1.0 — Abril 2026
- 🚀 Lançamento inicial como arquivo HTML único
- ✅ Busca em português com geração de skills via Anthropic API
- ✅ Sistema de cards com preview e download de `SKILL.md`
- ✅ Atalhos rápidos por categoria (design, programação, marketing, etc.)
- ✅ Modal de preview do arquivo antes do download
- ✅ Toast notifications para feedback do usuário

---

## 📜 Licença

MIT — use, modifique e distribua livremente.

Os arquivos `SKILL.md` gerados são dedicados ao domínio público via **CC0 1.0 Universal**.
