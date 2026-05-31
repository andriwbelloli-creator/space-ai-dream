## Escopo confirmado

- **Páginas alvo**: `/` (home), `/estilos/$styleSlug`, `/ambientes/$roomSlug`, `/estilos/$styleSlug/$roomSlug`, `/para-arquitetos`, `/para-designers`, `/para-imobiliarias`.
- **Fora do escopo**: `/admin/*`, `/_authenticated/*` (projetos, minha-conta), `/checkout/*`, `/login`, `/auth/callback`, `/pricing`, `/legal`, `/p/$projectId`, `/reset-password`, `/vs/planner-5d`, `/orcamento-design-interiores`. Continuam exatamente como estão.
- **Fidelidade**: pixel-a-pixel ao mockup (paleta creme, serif display, card laranja MAIS ESCOLHIDO, before/after central, cards moodboard/materiais/lista, bloco de planos no fundo).
- **Build quebrado autorizado a permanecer**: trabalho só em JSX + CSS, zero alteração em chamadas Supabase tipadas, zero alteração em `types.ts`, zero migration, zero `client.ts`.

## Riscos aceitos pelo usuário

- 69 erros TS continuam.
- Componentes que hoje chamam Supabase tipado (ex.: `use-credits`, `projects.functions`) **não serão tocados** — só os componentes de apresentação.
- Se um componente visual depende de dados tipados quebrados, mantenho o import existente sem alterar a forma da chamada.

## Design system (novo, em `src/styles.css`)

Tokens derivados do mockup, em `oklch`:

```text
--background:       oklch(0.965 0.012 75)   /* creme #f5f0e6 */
--foreground:       oklch(0.22 0.02 60)     /* near-black quente */
--muted:            oklch(0.92 0.015 75)
--muted-foreground: oklch(0.5 0.02 60)
--accent:           oklch(0.62 0.17 42)     /* laranja terracota CTA */
--accent-foreground:oklch(0.98 0.01 75)
--gold:             oklch(0.72 0.10 75)     /* badge MAIS ESCOLHIDO */
--card:             oklch(0.98 0.008 75)
--border:           oklch(0.85 0.015 75)
--radius:           1.25rem                 /* cards 20-24px */

--font-display: "Cormorant Garamond", "Instrument Serif", Georgia, serif;
--font-sans:    "Inter", system-ui, sans-serif;
```

Tudo via token semântico — nenhum componente recebe hex direto.

## Estrutura visual (template comum)

```text
┌─────────────────────────────────────────────┐
│ Header creme: Logo serif | nav | CTA laranja│
├──────────────┬──────────────────────────────┤
│ H1 serif XL  │  Before/After interativo     │
│ subtítulo    │  + 3 chips flutuantes        │
│ 2 CTAs       │  (estilo / orçamento / piso) │
│ 3 features   │                              │
├──────────────┴──────────────────────────────┤
│ 3 cards horizontais: Moodboard / Materiais  │
│ / Lista de compras (imagem + título serif)  │
├─────────────────────────────────────────────┤
│ Planos: 3 cards, central com badge dourado  │
└─────────────────────────────────────────────┘
```

## Arquivos a criar

1. `src/components/layout/EditorialHeader.tsx` — header creme reaproveitável (logo serif, nav, CTA laranja).
2. `src/components/editorial/HeroBeforeAfter.tsx` — hero split com `BeforeAfter` existente + chips flutuantes.
3. `src/components/editorial/FeatureChips.tsx` — 3 chips (Antes/depois, Lista, Orçamento).
4. `src/components/editorial/EditorialCardsRow.tsx` — 3 cards Moodboard/Materiais/Lista (genérico, recebe props).
5. `src/components/editorial/PlansBlock.tsx` — bloco de 3 planos com card central destacado (lê de `src/lib/plans.ts` sem alterar contrato).

## Arquivos a editar (apresentação apenas)

- `src/styles.css` — substituir tokens da paleta, adicionar `--gold`, importar fontes serif via `@import` do Google Fonts.
- `src/routes/index.tsx` — montar nova home com os 5 componentes acima.
- `src/components/landing/ProfessionalLanding.tsx` — trocar header, hero, seção de promessas e CTA final pela nova linguagem (mantendo props e LeadFormModal intactos).
- `src/components/ExpandedLanding.tsx` — aplicar mesma linguagem (hero serif + before/after + cards editoriais + FAQ + final CTA).

## Arquivos NÃO tocados

- `src/integrations/supabase/*` (todos).
- `src/lib/*.functions.ts` e `*.server.ts`.
- `src/lib/plans.ts`, `src/lib/auth.tsx`, `src/lib/credits*`, `src/lib/checkout*`, `src/lib/stripe*`.
- `src/routes/_authenticated/*`, `src/routes/admin.*`, `src/routes/checkout.*`, `src/routes/login.tsx`, `src/routes/pricing.tsx`, `src/routes/legal.tsx`.
- `src/components/LeadFormModal.tsx`, `src/components/UploadPhotoModal.tsx`, `CourseModal`, `PresentationModal`, `RewardModal`, `Share*`.
- `Footer.tsx` (mantém atual; ajusto só cores via tokens, sem mudar estrutura).
- `src/routeTree.gen.ts`, `.env`, `supabase/config.toml`, `CLAUDE.md`.

## Imagens

- Reuso assets existentes em `src/assets/` (`decorated-living.jpg`, `moodboard-pro.jpg`, `floorplan-apartment.jpg` e o par before/after que `BeforeAfter` já consome).
- Nenhuma regeneração de imagem (proibido por CLAUDE.md §7).

## Tipografia

- Adicionar Google Fonts via `@import` no topo de `src/styles.css`:
  - Cormorant Garamond (display serif)
  - Inter (sans body)
- H1/H2: `font-display`, peso 500, tracking apertado.
- Body: `font-sans`.

## Validações ao final

- `bun run build` (relatar resultado).
- `bunx tsc --noEmit` (esperado: continuar com os 69 erros pré-existentes; não devo introduzir novos).
- Smoke visual em `/`, `/estilos/escandinavo`, `/ambientes/sala`, `/para-arquitetos` no preview.

## Fora deste plano (não faço agora)

- Resolver os 69 erros TS.
- Tocar em `types.ts` ou banco.
- Redesenhar `/pricing`, `/login`, `/admin/*`, `/_authenticated/*`.
- Trocar copy ou pricing (só visual).
- Commit/push (Faixa Vermelha — aguardo autorização separada depois do diff pronto).

## Resultado esperado

Home e 6 rotas de landing SEO com o visual do mockup, com a mesma linguagem de header/hero/cards/planos, mantendo todo o backend, auth, créditos, Stripe e afiliados intocados.