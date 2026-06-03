# Plano — Curadoria "O Atelier Sugere"

## Objetivo
Acoplar uma seleção curada editorial (3–4 peças) ao ambiente gerado, complementando a `ShoppingList` automática. O usuário vê a lista funcional (toda categoria coberta) E uma vitrine curada com narrativa ("essas peças combinam com o estilo X que você gerou"), aumentando densidade visual, ticket médio e cliques afiliados.

## Diagnóstico (read-only, já feito)
- `ShoppingPanel` em `src/components/UploadPhotoModal.tsx:1490` já renderiza lista IA + fallback estático + `buildAffiliateLinks` + tracking `affiliate_click`.
- `getShoppingFallback(roomType)` cobre 6 cômodos.
- Estilos disponíveis: vêm do parâmetro `style: styleId` passado pra `generateShoppingList`.
- Afiliado Amazon ativo, Magalu em fallback genérico (governança vigente).
- Tracking `useTrack()` disponível e já em uso.

## Escopo (mínimo viável)

### 1. Catálogo estático de curadoria — `src/lib/curadoria.ts` (novo)
- Dicionário `CURADORIA_BY_STYLE`: chave = `styleId` (ex.: `escandinavo`, `industrial`, `boho`), valor = array de 3–4 peças.
- Cada peça: `{ name, category, why, priceRange, imageHint, searchQuery }`.
  - `why`: 1 frase editorial curta ("a luz quente equilibra o cinza do concreto"). Sem em-dash.
  - `imageHint`: termo pra placeholder visual (não vamos gerar imagens novas — governança proíbe regenerar; usa fotos do `src/assets/` que já existem, ou ícone Lucide como fallback).
  - `searchQuery`: termo passado pra `buildAffiliateLinks` (reaproveita 100% da lógica atual).
- Fallback genérico (`default`) quando o estilo não estiver mapeado.

### 2. Componente `AtelierCurated` — `src/components/AtelierCurated.tsx` (novo)
- Props: `{ styleId, styleName, roomType }`.
- Layout: bloco editorial logo abaixo do `ShoppingPanel` no `UploadPhotoModal`. Header pequeno: "O Atelier sugere" + subtítulo "Peças escolhidas pra dialogar com [estilo]".
- 3–4 cards horizontais (mobile: stack): imagem/ícone + nome + 1 linha de `why` + price range + CTA "Ver na Amazon" (mesmo padrão visual do `ShoppingPanel`, paleta areia/bronze).
- Reusa `handleAffiliateClick` pattern → dispara `track("affiliate_click", { source: "curated" })` (novo `source` pra segmentar conversão curadoria vs lista).

### 3. Integração no `UploadPhotoModal`
- 1 import + 1 `<AtelierCurated />` logo após o `</aside>` do `ShoppingPanel` no painel de resultado.
- Sem alteração no pipeline IA, no `generateShoppingList`, no PDF, no paywall.

## Arquivos afetados (3)
- **novo**: `src/lib/curadoria.ts`
- **novo**: `src/components/AtelierCurated.tsx`
- **editado**: `src/components/UploadPhotoModal.tsx` (1 import + 1 tag JSX, ~3 linhas)

## Arquivos proibidos tocados
Nenhum.

## Riscos
- **Baixo**: estilo `styleId` pode vir com strings inesperadas → fallback `default` resolve.
- **Baixo**: layout no mobile pode ficar denso somando ShoppingList + Curadoria → cards horizontais colapsam pra stack vertical com `gap-3`.
- **Nulo** em pipeline IA, auth, pagamento, Stripe, OAuth.
- **Nulo** em SEO (componente dentro de modal, não indexável).

## QA checklist
- [ ] `bun run build` verde
- [ ] `bunx tsc --noEmit` verde nos 3 arquivos
- [ ] Modal abre, ambiente gera, ShoppingList aparece, Curadoria aparece logo abaixo
- [ ] Clique em CTA da curadoria abre Amazon em nova aba
- [ ] Network: evento `affiliate_click` com `source: "curated"` disparado
- [ ] Mobile 390px: cards empilham sem overflow
- [ ] Sem em-dash em nenhuma copy visível
- [ ] Estilo desconhecido cai no fallback `default` sem quebrar

## Fora de escopo (não fazer agora)
- Gerar imagens novas via IA (proibido pelo CLAUDE.md).
- Buscar peças reais via scraping Amazon (sem Browserless, sem autorização).
- Mexer em pricing/paywall.
- Persistir curadoria no Cloud (estático basta pro MVP).
- Magalu tag (segue fallback genérico).

## Próximo passo
Aguardar seu **ok** ou **ajuste de escopo** antes de criar os arquivos.
