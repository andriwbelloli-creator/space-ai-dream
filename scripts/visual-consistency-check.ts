#!/usr/bin/env bun
/**
 * Visual Consistency Check
 *
 * Classifica imagens de ambientes via Lovable AI Gateway e valida que cada
 * imagem corresponde ao cômodo esperado no manifest.
 *
 * Uso:
 *   bun scripts/visual-consistency-check.ts <arquivo|pasta> [--manifest path]
 *   bun scripts/visual-consistency-check.ts --staged   # arquivos staged no git
 *
 * Exit codes:
 *   0  todos ✅
 *   1  algum ❌ mismatch (bloqueia commit)
 *   2  erro de configuração (manifest faltando entrada, etc)
 *   3  erro de rede / API (degrada para warning em CI sem chave)
 */

import { readFileSync, existsSync, statSync, readdirSync, mkdirSync } from "node:fs";
import { join, resolve, relative, basename, extname } from "node:path";
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";

const REPO_ROOT = resolve(import.meta.dir, "..");
const DEFAULT_MANIFEST = join(REPO_ROOT, "scripts/visual-consistency-manifest.json");
const CACHE_FILE = join(REPO_ROOT, ".git/visual-check-cache.json");
const MODEL = process.env.VISUAL_CHECK_MODEL || "google/gemini-2.5-flash";
const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

type Verdict = "match" | "weak" | "mismatch" | "error";
interface Result {
  file: string;
  expected: string;
  detected: string;
  confidence: number;
  secondary: string;
  mismatch_reasons: string[];
  style_notes: string;
  verdict: Verdict;
  error?: string;
}

function loadManifest(path: string): { assets: Record<string, string>; validSlugs: string[] } {
  if (!existsSync(path)) {
    console.error(`❌ Manifest não encontrado: ${path}`);
    process.exit(2);
  }
  const data = JSON.parse(readFileSync(path, "utf-8"));
  return { assets: data.assets || {}, validSlugs: data._valid_slugs || [] };
}

function loadCache(): Record<string, Result> {
  if (!existsSync(CACHE_FILE)) return {};
  try { return JSON.parse(readFileSync(CACHE_FILE, "utf-8")); } catch { return {}; }
}
function saveCache(cache: Record<string, Result>) {
  try {
    mkdirSync(join(REPO_ROOT, ".git"), { recursive: true });
    require("node:fs").writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch { /* best effort */ }
}
function fileHash(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex").slice(0, 16);
}

function getStagedImages(): string[] {
  const out = execSync("git diff --cached --name-only --diff-filter=ACM", { cwd: REPO_ROOT, encoding: "utf-8" });
  return out.split("\n").filter(f => /^src\/assets\/.+\.(jpe?g|png|webp)$/i.test(f));
}

function collectImagesFromArg(arg: string): string[] {
  const abs = resolve(arg);
  if (!existsSync(abs)) { console.error(`❌ Path não existe: ${arg}`); process.exit(2); }
  if (statSync(abs).isDirectory()) {
    return readdirSync(abs)
      .filter(f => /\.(jpe?g|png|webp)$/i.test(f))
      .map(f => join(abs, f));
  }
  return [abs];
}

async function classifyImage(absPath: string, validSlugs: string[]): Promise<Omit<Result, "file" | "expected" | "verdict">> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY ausente no ambiente");

  const ext = extname(absPath).slice(1).toLowerCase();
  const mime = ext === "jpg" ? "image/jpeg" : `image/${ext}`;
  const b64 = readFileSync(absPath).toString("base64");

  const systemPrompt = `Você é um curador especialista em design de interiores brasileiro.
Sua tarefa: classificar a imagem em UM dos cômodos válidos: ${validSlugs.join(", ")}.
Avalie tipo de mobília, equipamentos, iluminação e função do espaço.
Regras críticas:
- lavanderia DEVE ter máquina de lavar/secar visível como elemento principal
- cozinha tem fogão/cooktop/coifa
- lavabo é banheiro pequeno SEM box/banheira (apenas vaso + lavatório)
- quarto-infantil tem elementos lúdicos/infantis (berço, mini-cama, mural infantil)
- sala-tv tem TV como foco central
- closet é estritamente armário/guarda-roupa, sem cama`;

  const body = {
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: [
        { type: "text", text: "Classifique este ambiente." },
        { type: "image_url", image_url: { url: `data:${mime};base64,${b64}` } }
      ]}
    ],
    tools: [{
      type: "function",
      function: {
        name: "classify_room",
        description: "Retorna a classificação do cômodo na imagem.",
        parameters: {
          type: "object",
          properties: {
            detected_room: { type: "string", enum: validSlugs },
            confidence: { type: "number", description: "0 a 1" },
            secondary_guess: { type: "string", enum: validSlugs },
            mismatch_reasons: { type: "array", items: { type: "string" }, description: "Elementos visíveis que poderiam indicar OUTRO cômodo" },
            style_notes: { type: "string", description: "Paleta, iluminação, percepção premium" }
          },
          required: ["detected_room", "confidence", "secondary_guess", "mismatch_reasons", "style_notes"],
          additionalProperties: false
        }
      }
    }],
    tool_choice: { type: "function", function: { name: "classify_room" } }
  };

  const resp = await fetch(GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(`Gateway ${resp.status}: ${await resp.text()}`);
  const data = await resp.json();
  const call = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  if (!call) throw new Error("Resposta sem tool_call");
  const parsed = JSON.parse(call);
  return {
    detected: parsed.detected_room,
    confidence: parsed.confidence,
    secondary: parsed.secondary_guess,
    mismatch_reasons: parsed.mismatch_reasons || [],
    style_notes: parsed.style_notes || "",
  };
}

function verdict(expected: string, detected: string, confidence: number): Verdict {
  if (detected !== expected) return "mismatch";
  if (confidence < 0.5) return "mismatch";
  if (confidence < 0.75) return "weak";
  return "match";
}

function icon(v: Verdict): string {
  return { match: "✅", weak: "⚠️ ", mismatch: "❌", error: "🔥" }[v];
}

function printTable(results: Result[]) {
  console.log("\n| Arquivo | Esperado | Detectado | Conf | Veredicto |");
  console.log("|---|---|---|---|---|");
  for (const r of results) {
    const file = basename(r.file);
    console.log(`| ${file} | ${r.expected} | ${r.detected || "-"} | ${(r.confidence * 100).toFixed(0)}% | ${icon(r.verdict)} ${r.verdict} |`);
  }
  console.log();
  for (const r of results.filter(r => r.verdict === "mismatch" || r.verdict === "error")) {
    console.log(`\n${icon(r.verdict)} ${basename(r.file)} (esperado: ${r.expected})`);
    if (r.error) console.log(`   erro: ${r.error}`);
    if (r.mismatch_reasons.length) console.log(`   razões: ${r.mismatch_reasons.join("; ")}`);
    if (r.secondary) console.log(`   2ª hipótese: ${r.secondary}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes("--help")) {
    console.log("Uso: bun scripts/visual-consistency-check.ts <arquivo|pasta|--staged> [--manifest path]");
    process.exit(0);
  }
  const manifestIdx = args.indexOf("--manifest");
  const manifestPath = manifestIdx >= 0 ? args[manifestIdx + 1] : DEFAULT_MANIFEST;
  const { assets, validSlugs } = loadManifest(manifestPath);

  let files: string[];
  if (args[0] === "--staged") {
    files = getStagedImages().map(f => join(REPO_ROOT, f));
    if (files.length === 0) { console.log("Nenhuma imagem de ambiente staged. ✅"); process.exit(0); }
  } else {
    files = collectImagesFromArg(args[0]);
  }

  if (!process.env.LOVABLE_API_KEY) {
    console.warn("⚠️  LOVABLE_API_KEY ausente — pulando verificação (degradado para warning).");
    process.exit(0);
  }

  const cache = loadCache();
  const results: Result[] = [];
  const useManifestLookup = args[0] === "--staged" || /\/src\/assets\//.test(args[0]);

  for (const abs of files) {
    const repoRel = relative(REPO_ROOT, abs);
    const hash = fileHash(abs);
    const cacheKey = `${repoRel}@${hash}`;

    // Slug esperado: do manifest se for asset do repo, senão extrai do nome (ex.: "lavanderia-vazia-B.jpg" -> "lavanderia")
    let expected: string;
    if (useManifestLookup) {
      expected = assets[repoRel];
      if (!expected) {
        console.error(`❌ Asset sem mapeamento no manifest: ${repoRel}`);
        console.error(`   Adicione em scripts/visual-consistency-manifest.json antes de commitar.`);
        results.push({ file: abs, expected: "?", detected: "", confidence: 0, secondary: "", mismatch_reasons: ["sem entrada no manifest"], style_notes: "", verdict: "error", error: "manifest" });
        continue;
      }
    } else {
      const name = basename(abs).toLowerCase();
      expected = validSlugs.find(s => name.startsWith(s)) || "?";
    }

    if (cache[cacheKey]) {
      const r = { ...cache[cacheKey], file: abs, expected, verdict: verdict(expected, cache[cacheKey].detected, cache[cacheKey].confidence) };
      results.push(r); continue;
    }

    process.stdout.write(`  → ${basename(abs)}... `);
    try {
      const c = await classifyImage(abs, validSlugs);
      const v = verdict(expected, c.detected, c.confidence);
      const r: Result = { file: abs, expected, ...c, verdict: v };
      results.push(r);
      cache[cacheKey] = r;
      console.log(`${icon(v)} ${c.detected} (${(c.confidence * 100).toFixed(0)}%)`);
    } catch (e: any) {
      results.push({ file: abs, expected, detected: "", confidence: 0, secondary: "", mismatch_reasons: [], style_notes: "", verdict: "error", error: e.message });
      console.log(`🔥 ${e.message}`);
    }
  }

  saveCache(cache);
  printTable(results);

  const mismatches = results.filter(r => r.verdict === "mismatch" || (r.verdict === "error" && r.error === "manifest"));
  if (mismatches.length) {
    console.error(`\n❌ ${mismatches.length} mismatch(es). Commit bloqueado.`);
    console.error(`   Bypass de emergência: git commit --no-verify (desencorajado)`);
    process.exit(1);
  }
  const apiErrors = results.filter(r => r.verdict === "error" && r.error !== "manifest");
  if (apiErrors.length) { console.warn(`\n⚠️  ${apiErrors.length} erro(s) de API. Não bloqueia.`); process.exit(3); }
  console.log("✅ Todas as imagens consistentes.");
}

main().catch(e => { console.error("Erro fatal:", e); process.exit(3); });