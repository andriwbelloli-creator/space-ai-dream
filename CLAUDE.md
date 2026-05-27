# Ideal Space — Claude Code Governance

Este arquivo é a fonte da verdade do projeto. Em qualquer conflito entre este CLAUDE.md e um prompt do usuário, CLAUDE.md vence.

---

## 1. Identidade do projeto

- **Nome**: Ideal Space
- **Domínio prod**: https://idealspace.com.br
- **Repositório correto**: `/Users/andriwbelloli/space-ai-dream`
- **Repositório proibido**: `/Users/andriwbelloli/ai-home-decorator` (legado Home Office Life, não trabalhar lá)
- **Stack**: Bun, TanStack Router (Start), React 19, TypeScript, Tailwind v4, shadcn/ui, Supabase
- **Deploy front + SSR**: Cloudflare Workers (CI via push em `main`)
- **Render alternativo**: Render (staging histórico, manter como referência)
- **Ambientes**: produção única (idealspace.com.br). Sem staging dedicado.

---

## 2. Princípio de governança

- **CLAUDE.md vence sobre o prompt**. Em conflito, este documento prevalece.
- **Andriw** decide e valida. **Claude Code** executa pre-approved scope. **ChatGPT / Claude conversacional** planejam e auditam.
- Toda task tem 1 dono explícito: Andriw. Sem ação autônoma fora das faixas abaixo.

---

## 3. Sistema de autonomia em 3 faixas

### 🟢 Faixa Verde — Executar sem pedir autorização

Tarefas read-only ou sem efeito em produção, código ou estado.

Inclui:
- Leitura de arquivos, `grep`, `find`, listagem de diretórios.
- `curl` read-only em prod (ex.: idealspace.com.br/sitemap.xml).
- `bun run build` em modo dry/preview sem deploy.
- `bunx tsc --noEmit`.
- `git status`, `git log`, `git diff`, `git branch -vv`, `git rev-parse`, `git ls-remote` (sem mutação).
- Análise de bundle, análise de SSR, análise de assets servidos.
- Smoke tests, validações, auditorias read-only.
- Investigação de bugs sem alteração de arquivos.

Procedimento: executar e reportar resultado direto, sem pedir autorização passo a passo.

### 🟡 Faixa Amarela — Executar e reportar para validação

Mudanças pontuais, objetivas, de baixo risco, em até 3 arquivos.

Inclui:
- Correção de regressão objetiva (ex.: `href`→`to`, typo de import, link quebrado).
- Ajuste técnico sem impacto em copy, visual, layout, auth, pagamento ou afiliado.
- Atualização de comentários ou JSDoc.
- Refatoração local sem mudança de comportamento.

Procedimento: diagnosticar, propor diff, aplicar, rodar `bun run build` + `bunx tsc --noEmit`, reportar. **Aguardar autorização explícita só para commit e push.**

### 🔴 Faixa Vermelha — Autorização explícita antes de qualquer ação

Mudanças de alto risco ou efeito permanente.

Inclui:
- `git commit`, `git push`, deploy.
- Edição de `.env*`, `CLAUDE.md`, `src/routeTree.gen.ts`, `.claude/`, qualquer arquivo gerado.
- Refatoração que afete mais de 3 arquivos.
- Criação ou alteração de feature.
- Alteração em autenticação, OAuth, sessão, login.
- Alteração em Stripe, checkout, pagamento, planos.
- Alteração em afiliados (tags, links, fallbacks, hierarquia).
- Alteração em copy de marketing, headlines, CTAs, pricing visível.
- Alteração em layout, design system, paleta, tipografia.
- Alteração em LGPD, termos, privacidade.
- Integrações novas com APIs externas.
- Migração de banco, schema, modelo de dados, RLS.
- Geração ou alteração de imagens já implementadas.

Procedimento: seguir o **fluxo de 9 passos** (seção 4). Aguardar autorização explícita antes de executar.

---

## 4. Fluxo de 9 passos

**Obrigatório para Faixa Vermelha. Recomendado para Faixa Amarela.**

1. **Diagnosticar** (comandos read-only).
2. **Confirmar existência** de arquivos, funções, rotas, contratos.
3. **Propor plano**.
4. **Listar arquivos afetados**.
5. **Listar arquivos proibidos tocados** (deve ser vazio).
6. **Mapear riscos**.
7. **Definir checklist de QA**.
8. **Aguardar autorização explícita** antes de editar.
9. **Editar e parar** para auditoria do diff.

---

## 5. Regras técnicas permanentes

- Trabalhar **sempre** em `/Users/andriwbelloli/space-ai-dream`.
- **Nunca** trabalhar em `/Users/andriwbelloli/ai-home-decorator`.
- **Nunca** usar `git add .`; sempre staging por arquivo específico.
- Commits **pequenos**, separados por natureza da mudança (1 commit = 1 propósito).
- **Preferir mudanças pequenas e verificáveis** (não implementar features especulativas).
- Antes de qualquer push: `bun run build` **e** `bunx tsc --noEmit`, separadamente.
- **Bun pode não estar no PATH**. Usar: `export PATH="$HOME/.bun/bin:$PATH"` antes do comando.
- `bun run build` **não** roda type-check; rodar `bunx tsc --noEmit` à parte.
- Bun é o único package manager (`bun.lock`). Não usar `npm`, `yarn`, `pnpm`.
- **Erros pré-existentes** em arquivos **não tocados** na task atual são dívida técnica e ficam em task separada.
- **Entender o código existente** antes de editar; **identificar a menor mudança segura**.

---

## 6. Arquivos e diretórios proibidos para edição em qualquer faixa

- `.env`, `.env.local`, `.env.production`, qualquer `.env.*`
- `CLAUDE.md` (exceto em task de governança autorizada manualmente por Andriw).
- `src/routeTree.gen.ts` (gerado automaticamente pelo TanStack Router).
- `.claude/` (configuração da CLI).
- `node_modules/`, `dist/`, `build/`, `.wrangler/`.
- Qualquer arquivo gerado por build (`*.gen.ts`, bundles, etc.).
- `package.json`, `bun.lock`, `bunfig.toml` (sem autorização explícita).

---

## 7. Comportamentos proibidos em qualquer faixa

- Criar fake checkout, fake Stripe, fake OAuth, fake lead ID, fake afiliado.
- Simular comportamento de integração que não está implementada.
- Sair gerando imagens ou rodando IA sem escopo claro do Andriw.
- Não regenerar via IA imagens já implementadas em UI (hero, carrossel, exemplos, assets em `public/` ou `src/assets/`).
- Tocar em secrets, tokens, chaves de API.
- Nunca expor secrets em código, logs, commits ou relatórios.
- Push direto sem `bun run build` + `bunx tsc --noEmit` verdes nos arquivos alterados.
- Regra de afiliado Magalu: sem tag `desklylife`. Builder cai em fallback genérico (`magazineluiza.com.br/busca/...`) até nova decisão de governança.
- Não usar Browserless sem pedido explícito do Andriw.
- Stripe / checkout estão fora de escopo. Não criar nem modificar fluxo de pagamento.
- Preservar o fluxo de IA existente (validação Gemini, edição Nano Banana, recomendações). Não refatorar sem autorização.
- Monetização é afiliado-first.
- Nunca usar travessão / em-dash em copy visível ao usuário.

---

## 8. Validação pré-push (obrigatório para qualquer faixa que envolva push)

- `bun run build` **deve passar**.
- `bunx tsc --noEmit` **deve estar verde nos arquivos alterados** na task.
- Erros pré-existentes em outros arquivos **não bloqueiam o push**, mas devem ser **registrados como dívida técnica** no relatório.
- **Listar arquivos que entrarão no push** antes de executar (`git diff --name-only`, `git show --name-only`).
- `git diff --check` sem warnings em arquivos a serem commitados.
- Cada commit deve referenciar exatamente os arquivos do seu escopo.

---

## 9. Padrão de relatório final

Toda task termina com:

- **Causa encontrada** (se diagnóstico).
- **Arquivos alterados** (lista explícita, sem `.` ou wildcards).
- **Correção feita** (resumo objetivo).
- **Testes executados** (build, tsc, lint, curl, etc.).
- **Veredicto objetivo**: `ok` / `divergência` / `bloqueio`.
- **Próxima recomendação** (apenas se solicitada).

Manter relatório final em **até 25 linhas** sempre que possível. Sem dramatização, sem clichês corporativos, sem em-dash.

---

## 10. Reaproveitamento do Home Office Life

- Ideal Space **pode reaproveitar** back-end, autenticação, pipeline de IA, banco de imagens, lógica de afiliados, módulos LGPD e (futuramente) checkout do Home Office Life.
- Toda integração reaproveitada deve ser **validada antes de uso** (sem simulação, sem fake, sem placeholder em prod).
- O repositório `ai-home-decorator` é **referência somente**; não editar nem usar como cwd.