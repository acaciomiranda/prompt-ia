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

### v1.7 — Abril 2026 (Atual)
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
