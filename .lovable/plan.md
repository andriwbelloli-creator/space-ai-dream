## Objetivo
Garantir que nenhum asset visual de `src/assets/` apareça em mais de uma seção do site, com **enforcement automático** que quebra o build se uma duplicação for introduzida.

## Contexto (estado atual)
Hoje há duplicação real em pares antes/depois, capas de estilos e blocos editoriais. Exemplos detectados na auditoria de hoje:
- `decorated-living.jpg` → home (`styleMidCentury`), Tipos2D5D, EditorialCollections.
- `decorated-bathroom-suite.jpg` → home (`styleArtDeco`), EditorialCollections.
- `empty-living.jpg` / `decorated-living-warm.jpg` → hero + AmbientesGrid Essenciais.
- `decorated-bedroom.jpg` → hero + AmbientesGrid.
- `decorated-kitchen.jpg`, `decorated-bathroom.jpg` → idem.

Restrição CLAUDE.md §7: não posso regenerar via IA imagens já em UI. Catálogo atual: ~27 assets de cômodos. Resolver 100% sem novas imagens exige remover usos.

## Entregáveis

### 1. Script de auditoria — `scripts/check-asset-duplicates.ts`
- Varre `src/**/*.{ts,tsx}` com regex/AST leve.
- Captura todo import de `@/assets/...` e todo literal `/__l5e/assets-v1/...`.
- Agrupa por arquivo de asset; reporta qualquer asset usado em >1 arquivo fonte.
- Exit code 1 se houver duplicação.

### 2. Allowlist explícita — `scripts/asset-duplicates.allowlist.json`
- Lista de pares `{ asset, reason, allowedFiles[] }` para casos legítimos (ex.: mesmo asset usado em página SEO + sitemap programático).
- Toda exceção exige justificativa em texto; sem isso o script falha.

### 3. Integração no build
- Adicionar `"check:assets": "tsx scripts/check-asset-duplicates.ts"` em `package.json`.
- Chamado no início de `bun run build` via script wrapper (`predev`/`prebuild` não funcionam direto com Bun + Vite; uso um script "build" composto).

### 4. Plano de remediação do estado atual
- **Hero (6 projetos)**: mantém os pares atuais.
- **AmbientesGrid Essenciais (4 cards antes/depois)**: reverter pra static cards (`PremiumOverlayCard`) ou remover o tier Essenciais, já que todos os pares duplicam hero. Confirmação sua antes de executar.
- **Capas de estilos na home** (`styleMidCentury` = `decorated-living`, `styleArtDeco` = `decorated-bathroom-suite`): trocar por assets não usados em outro lugar, ou usar 1 dos slots restantes únicos.
- **EditorialCollections / Tipos2D5D**: auditar e trocar pelos assets ainda únicos do catálogo.
- Quando não houver alternativa, listar na allowlist com motivo objetivo.

## Arquivos afetados (estimativa)
- Criados: `scripts/check-asset-duplicates.ts`, `scripts/asset-duplicates.allowlist.json`.
- Editados: `package.json` (1 script novo), `src/components/AmbientesGrid.tsx`, `src/routes/index.tsx` (substituição de imports de capas), possivelmente `src/components/EditorialCollections.tsx`, `src/components/Tipos2D5D.tsx`, `src/components/home/AtelierHero.tsx`.

## Arquivos proibidos tocados
Nenhum (sem `.env`, sem `routeTree.gen.ts`, sem `CLAUDE.md`).

## Riscos
- **Build vai quebrar** assim que o script entrar, até resolvermos as duplicações atuais ou popularmos a allowlist. Estratégia: 1ª PR adiciona script + allowlist contendo TODAS as duplicações atuais (snapshot), depois remediação por commits pequenos esvazia a allowlist.
- Possível regressão visual em seções que perderem imagem familiar. Mitigação: substituir 1 por vez, validando o preview.
- Não resolve quarto: só existe 1 par e ele já está no hero. Decisão necessária: remover quarto do BeforeAfter ou aceitar duplicação documentada na allowlist.

## QA
- `bun run build` verde.
- `bunx tsc --noEmit` verde.
- `bun run check:assets` verde com allowlist vazia (objetivo final).
- Smoke visual: home, /ambientes/sala, /ambientes/quarto, /ambientes/cozinha, /ambientes/banheiro, /objetos.

## Perguntas que preciso de decisão antes de editar
1. Pode reverter os 4 cards Essenciais (sala/quarto/cozinha/banheiro) pro formato estático original (sem BeforeAfter)?
2. Posso remover usos duplicados em EditorialCollections / Tipos2D5D / capas de estilos da home, mesmo que isso mude o visual dessas seções?
3. Caso falte par único pra alguma seção (ex.: quarto), prefere: (a) remover a seção, (b) deixar com placeholder neutro, (c) aceitar duplicação documentada na allowlist?
