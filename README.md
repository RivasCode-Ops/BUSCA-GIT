# BUSCA-GIT

**Raio-X de repositórios GitHub em português claro.**

Aplicativo desktop que analisa repositórios do GitHub e explica, de forma prática, **o que o projeto faz, qual stack usa, como ele está estruturado e se vale a pena estudar, reaproveitar ou descartar**.

---

## Resumo Executivo

| Campo | Valor |
|-------|-------|
| **Propósito** | Reduzir o tempo gasto entendendo repositórios com README ruim, documentação incompleta ou código espalhado |
| **Modelo** | App desktop local com Electron |
| **Stack** | Electron + React + TypeScript + electron-vite + Octokit + SQLite + LLM |
| **Entrada** | URL do GitHub |
| **Saída** | Relatório técnico-prático em linguagem simples |
| **Público** | Devs, arquitetos, estudantes, times técnicos |
| **Maturidade** | Concepção (pré-MVP) |

---

## Funcionalidades

### Centrais
- Colar URL de repositório GitHub e validar origem
- Ler metadados: linguagem principal, linguagens por volume de código, atividade recente via commits (GitHub API)
- Mapear árvore básica e identificar arquivos-chave (`package.json`, `README`, `requirements.txt`, `Dockerfile`, configs, rotas, serviços)
- Detectar stack com base em dependências, convenções de pasta e arquivos de configuração
- Gerar resumo objetivo com propósito, funcionalidades, limitações, dificuldade de execução e maturidade
- Exibir relatório final com visão técnica + visão prática para tomada de decisão

### Extras (versões seguintes)
- Histórico local de análises
- Comparação entre dois ou mais repositórios
- Exportação do relatório em Markdown / JSON
- Cache local para não reprocessar o mesmo repo
- Score "bom para estudo / bom para produção / bom para reaproveitamento"

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Desktop shell | **Electron** — multiplataforma, acesso a APIs nativas |
| Frontend | **React + TypeScript** |
| Build | **electron-vite** — centraliza main, preload e renderer |
| API GitHub | **Octokit** — cliente oficial da REST API |
| Ponte segura | **contextBridge** + preload script |
| Estado / UI | **React Query + Zustand** |
| Banco local | **better-sqlite3** (SQLite) |
| Validação | **Zod** |
| Estilo | **Tailwind + shadcn/ui** |
| Empacotamento | **electron-builder** |
| IA | **Gemini ou OpenAI** — inferir propósito, funcionalidades e limitações |

---

## Estrutura do Projeto

```
BUSCA-GIT/
├─ electron/
│  ├─ main/
│  │  ├─ index.ts
│  │  ├─ ipc/
│  │  │  ├─ analyzeRepo.ts
│  │  │  ├─ getRepoMetadata.ts
│  │  │  ├─ getRepoFiles.ts
│  │  │  └─ settings.ts
│  │  ├─ services/
│  │  │  ├─ github/
│  │  │  │  ├─ client.ts
│  │  │  │  ├─ commits.ts
│  │  │  │  ├─ languages.ts
│  │  │  │  └─ repoTree.ts
│  │  │  ├─ analyzer/
│  │  │  │  ├─ detectStack.ts
│  │  │  │  ├─ detectPurpose.ts
│  │  │  │  ├─ importantFiles.ts
│  │  │  │  └─ healthScore.ts
│  │  │  ├─ llm/
│  │  │  │  ├─ provider.ts
│  │  │  │  ├─ prompts.ts
│  │  │  │  └─ schema.ts
│  │  │  └─ storage/
│  │  │     ├─ db.ts
│  │  │     ├─ cache.ts
│  │  │     └─ history.ts
│  │  └─ utils/
│  │     └─ paths.ts
│  └─ preload/
│     └─ index.ts
│
├─ src/
│  ├─ pages/
│  │  ├─ Home.tsx
│  │  ├─ Analyze.tsx
│  │  ├─ Report.tsx
│  │  ├─ History.tsx
│  │  └─ Settings.tsx
│  ├─ components/
│  ├─ features/
│  ├─ hooks/
│  ├─ store/
│  ├─ lib/
│  └─ main.tsx
│
├─ shared/
│  ├─ contracts/
│  ├─ schemas/
│  └─ constants/
│
├─ data/
├─ public/
├─ build/
├─ release/
├─ package.json
├─ electron.vite.config.ts
└─ tsconfig.json
```

---

## Pipeline de Análise

```
URL do GitHub
     │
     ▼
1. Coleta de metadados (Octokit)
     │
     ▼
2. Leitura de arquivos-chave
     │
     ▼
3. Classificação da stack
     │
     ▼
4. Geração do resumo (LLM)
     │
     ▼
5. Exibição do relatório
```

---

## Plano de Ação

| Prioridade | Ação |
|------------|------|
| Imediato | Publicar README.md + estrutura de pastas |
| Antes do MVP | Configurar boilerplate Electron + Vite + React + TypeScript |
| Antes do MVP | Implementar autenticação GitHub (token) + Octokit para metadados |
| Antes do MVP | Criar pipeline de análise: metadados → arquivos → stack → LLM |
| Antes do MVP | Implementar tela de URL → relatório |
| Próximo ciclo | Histórico local + cache SQLite |
| Próximo ciclo | Score de reaproveitamento |
| Melhorias | Comparação entre repos, exportação MD/JSON |

---

## Licença

MIT
