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

Para regressão visual pixel-a-pixel, conectar o projeto no Chromatic:

```bash
bunx chromatic --project-token=<TOKEN>
```

Não é necessário para o test-runner local rodar.