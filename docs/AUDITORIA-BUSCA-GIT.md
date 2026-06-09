# Auditoria — BUSCA-GIT v0.1.0

**Data:** 2026-06-09  
**Estado:** Concepção (pré-MVP)

---

## 1. RESUMO EXECUTIVO

- **Sistema:** BUSCA-GIT — Raio-X de repositórios GitHub em português claro
- **Estado geral:** Concepção com scaffold completo
- **Maturidade:** 1.5 / 5
- **Principais riscos:** Código não testado, dependência de token GitHub, sem LLM configurado

---

## 2. VISÃO POR ÁREA

### Produto e Contexto
- **Estado:** Conceito validado, copy definida, especificação completa
- **Forças:**
  - Diferencial claro (resolver garimpo manual de repositórios)
  - Público-alvo segmentado (devs, arquitetos, estudantes, times)
  - Documentação do produto completa (README, funcionalidades, stack, estrutura)
- **Lacunas:**
  - Sem validação com usuários reais
  - Sem protótipo funcional executável
  - Concorrência: GitHub Copilot, OpenCode, resumos nativos do GitHub
- **Riscos:**
  - Escopo pode crescer sem controle
  - Monetização indefinida

### Arquitetura
- **Estado:** Scaffold completo, mas não testado
- **Forças:**
  - Separação clara em `electron/main`, `electron/preload`, `src`, `shared`
  - IPC handlers definidos para todos os serviços
  - Estrutura de serviços modular (github, analyzer, llm, storage)
  - Tipos compartilhados em `shared/contracts`
- **Lacunas:**
  - Nenhum código foi executado ou testado
  - Dependências não instaladas (`npm install` nunca rodado)
  - `electron.vite.config.ts` configurado mas não validado
  - Schemas do Zod definidos mas sem testes de validação

### Frontend (React)
- **Estado:** Esqueleto mínimo
- **Forças:**
  - Páginas definidas (Home, Analyze, Report, History, Settings)
  - Preload com contextBridge expondo API segura
  - Tailwind + shadcn/ui no stack alvo
- **Lacunas:**
  - Apenas componentes vazios (retornam `<div>` estático)
  - Sem roteamento implementado
  - Sem estado global (Zustand não configurado)
  - Sem chamadas reais aos IPC handlers
  - `App.tsx` minimalista sem navegação

### Backend / Electron Main
- **Estado:** Implementado mas não executado
- **Forças:**
  - Octokit integrado com parser de URL e fallback
  - `analyzeRepo` IPC handler encadeia metadados → arquivos → stack → propósito → saúde
  - Detector de stack por arquivos-chave (`package.json`, `requirements.txt`, etc.)
  - Health score baseado em dias desde último push, stars, forks, issues
  - Suporte a dois provedores LLM (OpenAI + Gemini) com JSON mode
  - SQLite configurado com cache, histórico e settings
- **Lacunas:**
  - Nenhum teste unitário ou de integração
  - Tratamento de erros básico (sem retry, sem rate limit handling)
  - GitHub token lido de `process.env` sem fallback para UI
  - `detectPurpose` não usa LLM ainda (apenas fallback por tópicos)
  - Sem limite de requisições para evitar abuso da API

### Segurança
- **Estado:** Adequado para app local
- **Forças:**
  - contextBridge usado para isolar Node do renderer
  - Sem exposição desnecessária de APIs nativas
  - .env.example sem segredos reais
- **Lacunas:**
  - Token GitHub armazenado em env var ou SQLite sem criptografia
  - LLM API key em texto plano no SQLite
  - Sem validação de URL além de regex simples
  - Sem rate limiting no IPC handler

### DevOps
- **Estado:** Inexistente
- **Forças:**
  - `electron-vite` configurado com dev/build/preview
  - `tsconfig` separado para node/web
  - `electron-builder` nas devDependencies
- **Lacunas:**
  - Sem CI/CD
  - Sem script de setup (npm install + build)
  - Sem Docker
  - Sem relatório de licenciamento de dependências

### Testes e Qualidade
- **Estado:** Zero
- **Lacunas:**
  - Nenhum teste escrito
  - Nenhum framework de teste configurado
  - Nenhuma validação de tipo executada (`npm run typecheck`)
  - Nenhum linter configurado

---

## 3. FALHAS CRÍTICAS

| Falha | Local | Impacto |
|-------|-------|---------|
| **Código não executado** | Projeto inteiro | Nada funciona até npm install + dev |
| **LLM não configurado de fato** | `services/llm/provider.ts` | Resumo de propósito sempre cai no fallback genérico |
| **Sem testes** | Projeto inteiro | Qualquer refatoração é às cegas |

Nenhuma falha de segurança crítica identificada (app local, sem exposição de rede).

---

## 4. PLANO DE AÇÃO PRIORIZADO

### Corrigir imediatamente (antes de qualquer execução)
- Rodar `npm install` e verificar se a build compila
- Configurar GitHub token funcional no `.env`
- Rodar `npm run typecheck` para validar TypeScript

### Antes do MVP
- Instalar dependências e fazer `electron-vite dev` funcionar
- Conectar frontend aos IPC handlers com chamadas reais
- Implementar tela de URL → resultado funcional (mesmo sem LLM)
- Adicionar feedback de loading e erro na UI
- Testar com repositório real (ex.: `pulso-painel`)

### Próximo ciclo
- Implementar cache SQLite funcional
- Adicionar histórico de análises na UI
- Conectar LLM (OpenAI ou Gemini) para resumo inteligente
- Adicionar testes unitários para `analyzer/` e `github/`

### Melhorias desejáveis
- Vitest + Testing Library para testes
- ESLint + Prettier
- CI via GitHub Actions
- Modo escuro
- Exportar relatório em Markdown

---

## 5. CONSELHO ESTRATÉGICO

BUSCA-GIT tem a base certa: arquitetura limpa, separação de responsabilidades, tipos compartilhados. **O próximo passo não é código novo — é fazer o que já existe rodar.** Instale as dependências, suba o dev, e teste com 3 repositórios reais (um pequeno, um médio, um grande). Depois que o pipeline completo funcionar uma vez, aí sim adicione o LLM e o cache. Não adianta ter 40 arquivos bem estruturados se nenhum deles foi executado.

**Ação única mais importante:** `cd BUSCA-GIT && npm install && npm run dev`
