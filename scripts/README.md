# Scripts de governança visual

## visual-consistency-check.ts

Classifica imagens de ambientes via Lovable AI Gateway (`google/gemini-2.5-flash`) e valida que cada imagem corresponde ao cômodo esperado, usando tool-calling para output estruturado.

### Uso manual

```bash
# Pasta inteira (extrai slug esperado do nome do arquivo)
bun scripts/visual-consistency-check.ts /mnt/documents/lote1-candidatos/

# Arquivo único
bun scripts/visual-consistency-check.ts src/assets/decorated-lavanderia.jpg

# Só imagens staged (usado pelo pre-commit hook)
bun scripts/visual-consistency-check.ts --staged
```

### Manifest

`scripts/visual-consistency-manifest.json` mapeia `caminho-do-asset → slug-esperado`. Toda imagem nova em `src/assets/*.{jpg,png,webp}` precisa de entrada antes de ser commitada — caso contrário o hook bloqueia.

### Veredictos

| Símbolo | Significado | Bloqueia commit? |
|---|---|---|
| ✅ match | detectado == esperado, confidence ≥ 75% | não |
| ⚠️ weak | detectado == esperado, confidence 50–75% | não (warning) |
| ❌ mismatch | detectado ≠ esperado OU confidence < 50% | **sim** |
| 🔥 error | falha de API / manifest | sim se manifest, senão warning |

### Cache

Resultados ficam em `.git/visual-check-cache.json` por `sha256(arquivo)`. Re-rodar `git commit --amend` sem alterar a imagem não gasta créditos.

### Bypass de emergência

`git commit --no-verify` pula o hook. Desencorajado — usar apenas se a IA estiver fora ou em hotfix urgente.

## Pre-commit hook

Definido em `.husky/pre-commit`. Dispara o verificador apenas quando o commit toca:
- `src/assets/*.{jpg,png,webp}`
- `src/lib/seo-rooms-data.ts`
- `src/lib/seo-landing-images.ts`
- `src/components/AmbientesGrid.tsx`

Setup automático via `bun install` (script `prepare` do `package.json`).