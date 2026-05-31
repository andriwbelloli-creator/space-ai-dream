## Escopo

Aplicar a direção **Atelier Inteligente** (visual principal) + **Canvas de Decisão** (estrutura funcional) na home (`/`), preservando tudo que já roda. **Casa Viva** fica só como inspiração emocional, não vira UI.

Tudo descrito aqui é **front-end, em arquivos visuais**. Nenhum contrato de backend, hook ou rota muda.

## O que muda

### 1. Design tokens (`src/styles.css`)
Atualizo apenas os valores OKLCH dos tokens existentes para a paleta solicitada — **sem renomear tokens**, então shadcn/ui e todos os componentes continuam funcionando:
- `--background` → marfim arquitetônico `#F7F3EC`
- `--card` → branco cálido `#FFFCF7`
- `--foreground` / `--primary` → grafite profundo `#171717`
- `--muted-foreground` → cinza pedra `#6F6A62`
- `--border` / `--input` → areia `#E5DED2`
- `--accent` / `--ring` → terracota suave `#B87355`
- `--gold-soft` → dourado fosco `#C4A56A`
- Adiciono `--sage` (`#6F8F7A`) e `--ink-blue` (`#0E1116`) como tokens novos (chips Canvas de Decisão e módulos tech).
- Tipografia já está pronta: Plus Jakarta Sans + Instrument Serif.

### 2. Home (`src/routes/index.tsx`)
Reorganizo a sequência da home na ordem do brief, **reaproveitando componentes já existentes** (BeforeAfter, AmbientesGrid, EditorialCollections, PremiumVerticalCard, UploadPhotoModal, LeadFormModal):

1. **Header premium** (já existe) — só refino de CTA "Criar ambiente".
2. **Hero Atelier Inteligente** — headline serif "Transforme seu ambiente antes de reformar", subheadline, CTAs `Criar meu primeiro ambiente` (abre `UploadPhotoModal`, fluxo intacto) + `Ver antes/depois` (scroll/ancora pra galeria), microcopy. À direita: `BeforeAfter` com chips visuais sobrepostos (`Japandi`, `R$ 8.000`, `Preservar piso`, `Lista de compras`, `Variações`).
3. **Faixa de confiança** — 4 selos (Privacidade garantida, IA para interiores, Resultados em segundos, Orçamento e curadoria). Sem números inventados.
4. **Como funciona** — 4 passos com ícones lineares (Envie foto → Escolha estilo → Defina orçamento → Compare e salve).
5. **Canvas de Decisão** — bloco novo, mockup estático com 6 cards (Antes/depois, Variações, Moodboard, Lista de móveis, Orçamento, Próximos passos). Pura UI, sem novo backend.
6. **Transformações reais** — mantém `AmbientesGrid` existente, só refresh de cabeçalho.
7. **Planos** — refino visual dos 3 cards usando `PLANS` de `src/lib/plans.ts`. **CTAs e fluxo de checkout permanecem idênticos** (mesmos handlers).
8. **Prova social** — mantém estrutura atual, só ajusta tipografia editorial; sem inventar métricas.
9. **FAQ** — usa `Accordion` (já importado) com as 5 perguntas do brief.
10. **Footer** — mantém.

### 3. O que NÃO mexe
- `src/integrations/supabase/*`, hooks de auth/credits, `src/lib/plans.ts`, `src/lib/affiliate.ts`, qualquer server function, todas as outras rotas (`/pricing`, `/login`, `/admin/*`, `/checkout/*`, `/ambientes/*`, `/estilos/*`, etc.).
- Props públicas de `BeforeAfter`, `AmbientesGrid`, `UploadPhotoModal`, `LeadFormModal`, `PresentationModal`.
- Nenhum asset gerado por IA é regenerado — uso só o que já está em `src/assets/`.
- `src/routeTree.gen.ts`, `.env*`, `package.json` intocados.
- Nada relacionado a Stripe / billing nesta task (a conversa anterior fica pendente).

### 4. Responsividade
- Mobile: hero empilha (texto → mockup), CTAs full-width, cards do Canvas em 1 coluna, faixa de confiança em scroll horizontal suave, FAQ accordion nativo.
- Tablet: 2 colunas no Canvas e planos.
- Desktop: layout editorial conforme referência Atelier Inteligente.

## Arquivos alterados (estimativa)
- `src/styles.css` — tokens de cor.
- `src/routes/index.tsx` — reorganização visual da home.
- (talvez) `src/components/landing/CanvasDecisao.tsx` — componente novo isolado pro bloco 5, para não inflar mais o `index.tsx`.

## Riscos
- `index.tsx` é grande (2.669 linhas) e mistura várias seções; risco de regressão em seções não citadas. **Mitigação:** mantenho seções existentes que não conflitam com o brief (ex.: `EditorialCollections`, `Tipos2D5D`, `ProfessionalLanding` se já estiverem na home) e só reordeno/refino as visadas.
- Mudança dos tokens OKLCH afeta **todas as páginas**. **Mitigação:** os tokens novos são variações da mesma família warm-neutral atual; visual de outras páginas fica coerente, não quebra.
- Sem testes visuais automatizados — vou validar via preview após cada bloco.

## Validação
- `bun run build` + `bunx tsc --noEmit` verdes.
- Preview em desktop e mobile (viewport 375 e 768).
- Checagem rápida: `/pricing`, `/login`, `/p/$projectId` ainda renderizam corretamente após a mudança de tokens.

## Pergunta antes de executar
Quer que eu rode **tudo de uma vez** (tokens + home reorganizada num único push) ou em **2 fases** (1: tokens + hero novo; 2: Canvas de Decisão + restante)? Duas fases é mais seguro, uma fase é mais rápido.
