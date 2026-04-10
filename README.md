# prompts-ia 🧠

**Buscador de Skills para IA em português.**
Digite o que você precisa, escolha o modelo, e receba arquivos `SKILL.md` prontos para usar no Claude Code, Cursor, Windsurf e outros agentes de IA.

---

## ✨ Funcionalidades

- 🔍 **Busca em português** — sem precisar saber o nome técnico da skill em inglês
- 🤖 **Multi-modelo** — escolha entre modelos gratuitos e pagos via OpenRouter
- 🆓 **Modelos gratuitos incluídos** — Gemma 3, Llama 4, DeepSeek, Mistral e mais (sem custo por token)
- ⬇️ **Download direto** — gera e baixa o `SKILL.md` com um clique
- 👁️ **Preview antes de baixar** — visualize o conteúdo do arquivo antes de salvar
- 💾 **Configuração persistente** — API Key e modelo ficam salvos no browser
- 🚀 **Zero dependências** — HTML + CSS + JS puro, abre direto no browser

---

## 📁 Estrutura do projeto

```
prompts-ia/
├── public/
│   ├── index.html     ← Interface principal (Premium Dark Mode)
│   ├── style.css      ← Design System (Glassmorphism & Glow)
│   ├── app.js         ← Orquestrador do aplicativo (ES Modules)
│   ├── api.js         ← Módulo de comunicação com OpenRouter
│   └── ui.js          ← Módulo de manipulação de Interface e DOM
├── package.json       ← Scripts de desenvolvimento
├── vercel.json        ← Config de deploy no Vercel
├── .gitignore
└── README.md
```

---

## 🚀 Como usar

### Opção 1 — Abrir direto no browser (mais simples)
Abra o arquivo `public/index.html` no seu browser. Não precisa de servidor nem instalação.

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

---

## 🤖 Modelos disponíveis

### 🆓 Gratuitos (sem custo por token)

| Modelo | Provider | Destaque |
|---|---|---|
| **Gemma 3 27B** | Google | Modelo open-weight de alta qualidade, 27B parâmetros |
| **Llama 4 Maverick** | Meta | Arquitetura MoE, excelente para tarefas gerais |
| **Llama 4 Scout** | Meta | Versão leve e rápida do Llama 4 |
| **DeepSeek Chat V3** | DeepSeek | Muito competitivo, ótimo custo-benefício |
| **Mistral Small 3.1** | Mistral | Leve, rápido e capaz para a maioria das tarefas |

> Modelos gratuitos têm limite de ~20 requisições/minuto e 200/dia no OpenRouter.

### 💳 Pagos (cobrados por token)

| Modelo | Provider |
|---|---|
| Gemini 2.0 Flash | Google |
| Gemini 2.5 Pro | Google |
| GPT-4o Mini | OpenAI |
| GPT-4o | OpenAI |
| o3 Mini | OpenAI |
| Claude Sonnet 4.5 | Anthropic |
| Claude Haiku 4.5 | Anthropic |
| DeepSeek Chat V3 | DeepSeek |
| Qwen3 30B | Alibaba |
| Mistral Small 3.1 | Mistral |

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

## 📝 Histórico de atualizações

### v1.5 — Abril 2026
- ✅ **Arquitetura ES Modules**: código separado em `api.js`, `ui.js` e `app.js` com `import/export` nativos
- ✅ **`vercel.json` corrigido**: `Content-Type: application/javascript` garantido para ES Modules no deploy
- ✅ **`api-banner` adaptado ao dark mode**: cores amarelas legíveis sobre fundo escuro
- ✅ **`.error-details`** adicionado ao CSS: exibição de erros técnicos com estilo consistente
- ✅ **Botão "Attach files" desabilitado** visualmente para evitar confusão na versão de demo
- ✅ **`topbar` corrigida**: fundo `#000` com borda sutil, sem redundância de variáveis de cor
- ✅ **`extractJSON` aprimorado**: 4 estratégias de parse para máxima resiliência

### v1.4 — Abril 2026
- ✅ **Novo layout da barra de buscas**: Redesign premium com tema escuro (Dark Mode).
- ✅ Implementados efeitos visuais avançados: Glassmorphism e glow animado.
- ✅ Botão "Deep thinking" configurado como atalho para as configurações de modelo.

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
