#!/usr/bin/env bun
/**
 * Audita imports de assets visuais em `src/**` e falha se algum asset
 * aparece em mais de um arquivo fonte. Casos legítimos podem ser listados
 * em `scripts/asset-duplicates.allowlist.json` com justificativa explícita.
 *
 * Detecta:
 *  - `import x from "@/assets/foo.jpg"` (e qualquer extensão de imagem).
 *  - Literais com URL CDN `/__l5e/assets-v1/<id>/<filename>`.
 *
 * Rode com: `bun run check:assets`.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";

const ROOT = resolve(import.meta.dir, "..");
const SRC = join(ROOT, "src");
const ALLOWLIST_PATH = join(import.meta.dir, "asset-duplicates.allowlist.json");

const IMAGE_EXT = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".avif",
  ".svg",
  ".ico",
  ".bmp",
  ".tiff",
]);

type AllowEntry = { asset: string; reason: string; allowedFiles: string[] };
type Allowlist = { entries: AllowEntry[] };

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const s = statSync(full);
    if (s.isDirectory()) {
      if (name === "node_modules" || name.startsWith(".")) continue;
      walk(full, out);
    } else if (s.isFile() && /\.(ts|tsx|js|jsx|mjs|cjs|css)$/.test(name)) {
      out.push(full);
    }
  }
  return out;
}

/** Normaliza um caminho de asset relativo ao project root, ex.: "src/assets/foo.jpg". */
function normalizeAssetPath(raw: string, sourceFile: string): string | null {
  // Aliases: "@/assets/..." -> "src/assets/..."
  if (raw.startsWith("@/")) {
    return `src/${raw.slice(2)}`;
  }
  // Caminhos relativos partindo do arquivo fonte
  if (raw.startsWith(".")) {
    const abs = resolve(sourceFile, "..", raw);
    return relative(ROOT, abs);
  }
  // Literal absoluto do CDN — usa o próprio path como chave estável.
  if (raw.startsWith("/__l5e/assets-v1/")) {
    return raw;
  }
  return null;
}

function isImageLike(path: string): boolean {
  const ext = extname(path).toLowerCase();
  if (IMAGE_EXT.has(ext)) return true;
  // Pointer files do Lovable Assets (`.asset.json`) também contam.
  if (path.endsWith(".asset.json")) return true;
  return false;
}

function scan(): Map<string, Set<string>> {
  const files = walk(SRC);
  // asset path -> set of source files
  const usage = new Map<string, Set<string>>();

  // Captura `from "..."`, `import("...")`, e literais soltos.
  const importRe = /from\s+["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g;
  const cdnRe = /["'`](\/__l5e\/assets-v1\/[^"'`\s]+)["'`]/g;

  for (const file of files) {
    const rel = relative(ROOT, file);
    const text = readFileSync(file, "utf8");

    importRe.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = importRe.exec(text))) {
      const raw = m[1] ?? m[2];
      if (!raw) continue;
      if (!isImageLike(raw)) continue;
      const key = normalizeAssetPath(raw, file);
      if (!key) continue;
      if (!usage.has(key)) usage.set(key, new Set());
      usage.get(key)!.add(rel);
    }

    cdnRe.lastIndex = 0;
    while ((m = cdnRe.exec(text))) {
      const key = m[1]!;
      if (!usage.has(key)) usage.set(key, new Set());
      usage.get(key)!.add(rel);
    }
  }

  return usage;
}

function loadAllowlist(): Allowlist {
  try {
    const raw = readFileSync(ALLOWLIST_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<Allowlist>;
    if (!parsed || !Array.isArray(parsed.entries)) {
      return { entries: [] };
    }
    for (const e of parsed.entries) {
      if (
        typeof e.asset !== "string" ||
        typeof e.reason !== "string" ||
        e.reason.trim().length < 5 ||
        !Array.isArray(e.allowedFiles)
      ) {
        throw new Error(
          `Entrada inválida na allowlist (asset, reason >= 5 chars, allowedFiles[] obrigatórios): ${JSON.stringify(e)}`,
        );
      }
    }
    return parsed as Allowlist;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return { entries: [] };
    throw err;
  }
}

function main() {
  const usage = scan();
  const allowlist = loadAllowlist();
  const allowMap = new Map<string, AllowEntry>(
    allowlist.entries.map((e) => [e.asset, e] as const),
  );

  const violations: { asset: string; files: string[] }[] = [];
  for (const [asset, files] of usage) {
    if (files.size <= 1) continue;
    const allowed = allowMap.get(asset);
    if (allowed) {
      const expected = new Set(allowed.allowedFiles);
      const actual = [...files].sort();
      const sameShape =
        actual.length === expected.size && actual.every((f) => expected.has(f));
      if (sameShape) continue;
      violations.push({ asset: `${asset} (allowlist desatualizada)`, files: actual });
      continue;
    }
    violations.push({ asset, files: [...files].sort() });
  }

  if (violations.length === 0) {
    console.log(
      `[check:assets] OK — ${usage.size} assets analisados, sem duplicações fora da allowlist (${allowlist.entries.length} exceções documentadas).`,
    );
    return;
  }

  console.error(
    `\n[check:assets] FAIL — ${violations.length} asset(s) usados em mais de um arquivo:\n`,
  );
  for (const v of violations.sort((a, b) => a.asset.localeCompare(b.asset))) {
    console.error(`  ✗ ${v.asset}`);
    for (const f of v.files) console.error(`      ${f}`);
  }
  console.error(
    `\nPara permitir um caso legítimo, adicione uma entrada em scripts/asset-duplicates.allowlist.json com { asset, reason, allowedFiles }.\n`,
  );
  process.exit(1);
}

main();