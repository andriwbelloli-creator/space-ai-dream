# Storybook — Editorial Visual Regression

Cobertura: padrão editorial da homepage (kicker bronze + h2 serif + hairline + ritmo de spacing) nas seções `AmbientesGrid`, `ObjetosTeaser`, `AcessibilidadeTeaser` e no componente compartilhado `SectionHead`. Também cobre `/objetos` e `/acessibilidade` indiretamente, já que essas páginas reutilizam os mesmos componentes.

## Comandos

```bash
bun run storybook            # dev server em http://localhost:6006
bun run build-storybook      # build estático em storybook-static/
bun run test-storybook       # roda test-runner contra o Storybook em pé
```

Fluxo CI sugerido (em terminais paralelos ou via `concurrently`):

```bash
bun run storybook &           # ou: bunx http-server storybook-static -p 6006
bun run test-storybook
```

## O que é validado automaticamente

Em cada story sob `Editorial/*`, o `test-runner` executa `postVisit` e valida:

1. **Kicker presente** — `.is-kicker` aparece pelo menos uma vez.
2. **Cor bronze** — `getComputedStyle(.is-kicker).color` cai na faixa `~rgb(178, 138, 96)` (var(--gold-soft) ≈ #B58A60).
3. **Tipografia** — `h2` usa `font-serif` (Instrument Serif).
4. **Hairline** — span de 1px alto × ~64px largura presente.
5. **Ritmo de spacing** — toda `<section>` em stories `fullscreen` usa `py-12/14/16/20/24`.

Qualquer falha quebra `test-storybook` com mensagem identificando a story.

## Snapshot visual (Chromatic — opcional)

Chromatic está integrado para diff visual pixel-a-pixel em cada PR.

### Setup único (admin do repo)

1. Criar conta em https://www.chromatic.com e conectar o repositório GitHub.
2. Copiar o **Project Token** gerado.
3. No GitHub: **Settings → Secrets and variables → Actions → New repository secret**
   - Nome: `CHROMATIC_PROJECT_TOKEN`
   - Valor: o token copiado acima.
4. Pronto — o workflow `.github/workflows/chromatic.yml` roda automaticamente em todo PR e push em `main`.

### Rodar local (manual)

```bash
bun run build-storybook
CHROMATIC_PROJECT_TOKEN=<token> bun run chromatic
```

### Comportamento do CI

- **Pull Request**: faz upload, comenta o PR com link para revisar diffs. `exitZeroOnChanges` evita quebrar o build — a aprovação visual é manual no Chromatic UI.
- **Push em `main`**: `autoAcceptChanges: main` aceita as novas baselines automaticamente.
- **`onlyChanged: true`**: usa TurboSnap — só re-snapshot de stories afetadas pelo diff (rápido e barato em créditos).
- **`externals`**: mudança em `src/styles.css` ou assets força re-snapshot de todas as stories (garante captura de mudanças no design system).