import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { geminiText, geminiImage } from "@/lib/gemini.server";
import { uploadImageToStorage } from "@/lib/storage.server";

const MODEL_TEXT = "gemini-2.5-flash-lite";
const MODEL_IMAGE = "gemini-2.5-flash-image";

// Prompts canônicos por slug do catálogo SEO. Cobre os 6 estilos originais
// (renomeados de modern/minimal/luxe → contemporaneo/minimalista/luxo, pra
// alinhar com o catálogo público) e os 5 estilos novos adicionados em
// 2026-05 (boho-chic, mid-century, mediterraneo, art-deco, maximalista).
// STYLE_ALIASES logo abaixo mantém compatibilidade com projetos e drafts
// antigos persistidos com os slugs internos legados.
const STYLE_PROMPTS: Record<string, string> = {
  japandi:
    "Japandi interior: warm oak wood, linen textiles, paper lamps, calm neutral palette, minimal decor, soft natural light.",
  contemporaneo:
    "Contemporary interior: clean lines, curated art, soft curves, warm neutrals with one accent color, designer furniture.",
  minimalista:
    "Minimalist interior: white walls, very few objects, hidden storage, light wood floor, monochrome palette, soft daylight.",
  natural:
    "Natural interior: light wood, rattan and jute fibers, lots of greenery, beige and cream tones, organic textures.",
  industrial:
    "Industrial interior: exposed brick, black steel, leather sofa, vintage Edison bulbs, concrete floor, moody warm light.",
  luxo: "Quiet luxury interior: travertine, brushed brass, bouclé fabric, marble accents, deep neutral palette, ambient lighting.",
  "boho-chic":
    "Bohemian eclectic interior: layered textiles, macramé, rattan, vintage rugs, plants, warm earthy palette, eclectic art, golden hour light.",
  "mid-century":
    "Mid-century modern interior: walnut wood, tapered legs, mustard and olive accents, geometric patterns, atomic-era lighting, warm wood floor.",
  mediterraneo:
    "Mediterranean interior: whitewashed walls, terracotta floor, blue accents, arched openings, woven textures, olive branches, warm coastal light.",
  "art-deco":
    "Art deco interior: bold geometric patterns, brass and gold accents, velvet upholstery, marble and lacquer, jewel tones, dramatic lighting.",
  maximalista:
    "Maximalist interior: vivid colors, mixed patterns, gallery walls, layered textures, statement pieces, eclectic curation, abundant decor.",
  transicional:
    "Transitional interior: balanced blend of classic and contemporary, sophisticated neutral palette, comfortable furniture with clean lines, subtle moldings, elegant textiles, warm lighting, timeless residential composition.",
  "rustico-moderno":
    "Modern farmhouse interior: country warmth meets urban finishing, natural or reclaimed wood, natural fibers, textured fabrics, light warm tones, matte black metals, soft lighting, cozy yet sophisticated.",
  "moderno-organico":
    "Organic modern interior: contemporary base with curved forms and natural materials, light wood, stone, linen, bouclé, handmade ceramics, statement plants, warm neutral palette, soft lighting, tactile and biophilic.",
  classico:
    "Classic traditional interior: symmetry, boiseries, elegant moldings, fine wood, rich fabrics like velvet and heavy linen, sophisticated lighting, neutral or deep tones, formal composition, residential elegance without theatrical excess.",
  brutalista:
    "Sophisticated brutalist interior: exposed concrete, geometric volumes, monolithic forms, raw materials, textured surfaces, sculptural furniture, dramatic lighting, architectural and editorial atmosphere with preserved comfort.",
};

// Retrocompat: drafts e projetos persistidos antes da padronização podem ter
// slugs internos antigos. Convertem pra slug canônico SEO antes do lookup.
const STYLE_ALIASES: Record<string, string> = {
  modern: "contemporaneo",
  minimal: "minimalista",
  luxe: "luxo",
};

export type TransformInput = {
  imageDataUrl: string;
  style: string;
  variant?: number;
  // Hint opcional do cômodo, vindo da rota /ambientes/<slug>. Quando presente
  // e reconhecido por normalizeRoomType(), prevalece sobre a inferência da IA
  // na resposta final — não entra no prompt de geração (evita viés caso a
  // foto não bata com o hint).
  roomTypeHint?: string;
};
export type TransformOutput = {
  error: string | null;
  imageDataUrl: string | null;
  creditsLeft: number | null;
  roomType?: string;
};

type RoomType =
  | "sala"
  | "quarto"
  | "cozinha"
  | "home-office"
  | "banheiro"
  | "quarto-infantil"
  | "outro";

const ROOM_TYPES: ReadonlyArray<RoomType> = [
  "sala",
  "quarto",
  "cozinha",
  "home-office",
  "banheiro",
  "quarto-infantil",
  "outro",
];

// Slugs compostos do picker /ambientes que resolvem para uma categoria-base
// canônica. Sem isto, caíam em "outro" e envenenavam a inferência da IA: o hint
// "outro" sobrescrevia o room_type que o modelo teria inferido. Sprint 4 Commit A.
// quarto-infantil NÃO entra aqui: é categoria própria (resolve via ROOM_TYPES).
const ROOM_SLUG_ALIASES: Record<string, RoomType> = {
  "sala-jantar": "sala",
  "sala-tv": "sala",
  "varanda-gourmet": "cozinha",
  closet: "quarto",
  lavabo: "banheiro",
};

/**
 * Normaliza, de forma resiliente e defensiva, o `room_type` retornado pela IA.
 * Aceita variações comuns (PT/EN, com/sem hífen) e nunca estoura erro:
 * - valor ausente/nulo/não-string ou vazio → undefined
 * - valor reconhecido → o RoomType canônico correspondente
 * - string não reconhecida → "outro"
 */
function normalizeRoomType(value: unknown): RoomType | undefined {
  if (typeof value !== "string") return undefined;
  const v = value.trim().toLowerCase();
  if (!v) return undefined;
  if ((ROOM_TYPES as ReadonlyArray<string>).includes(v)) return v as RoomType;
  // Slugs compostos do picker /ambientes → categoria-base (evita "outro").
  if (v in ROOM_SLUG_ALIASES) return ROOM_SLUG_ALIASES[v];
  if (["home office", "homeoffice", "office", "escritório", "escritorio"].includes(v)) {
    return "home-office";
  }
  if (["living room", "living", "sala de estar", "sala de jantar", "living-room"].includes(v)) {
    return "sala";
  }
  if (["bedroom", "dormitório", "dormitorio"].includes(v)) return "quarto";
  if (v === "kitchen") return "cozinha";
  if (["bathroom", "wc"].includes(v)) return "banheiro";
  return "outro";
}

export const transformImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: TransformInput) => {
    if (!input?.imageDataUrl?.startsWith("data:image/")) {
      throw new Error("Imagem inválida.");
    }
    if (!input.style || typeof input.style !== "string") {
      throw new Error("Estilo inválido.");
    }
    return input;
  })
  .handler(async ({ data, context }): Promise<TransformOutput> => {
    if (!process.env.GOOGLE_AI_API_KEY) {
      return {
        error: "IA não configurada (GOOGLE_AI_API_KEY ausente).",
        imageDataUrl: null,
        creditsLeft: null,
      };
    }

    // 0) Admin bypass — admins geram sem consumir créditos.
    let isAdmin = false;
    try {
      const { data: roleRow } = await supabaseAdmin
        .from("user_roles")
        .select("role")
        .eq("user_id", context.userId)
        .eq("role", "admin")
        .maybeSingle();
      isAdmin = !!roleRow;
    } catch (e) {
      console.error("admin role check failed", e);
    }

    // 1) Consome 1 crédito atomicamente (admin pula).
    let creditsLeft: number | null = null;
    if (!isAdmin) {
      try {
        const { data: rpcData, error: rpcErr } = await supabaseAdmin.rpc("consume_credit", {
          _user_id: context.userId,
          _reference: data.style,
        });
        if (rpcErr) {
          if (String(rpcErr.message || "").includes("insufficient_credits")) {
            return {
              error: "Você não tem créditos suficientes. Assine um plano para continuar gerando.",
              imageDataUrl: null,
              creditsLeft: 0,
            };
          }
          console.error("consume_credit error", rpcErr);
          return {
            error: "Não foi possível validar seus créditos. Tente novamente.",
            imageDataUrl: null,
            creditsLeft: null,
          };
        }
        creditsLeft = typeof rpcData === "number" ? rpcData : null;
      } catch (e) {
        console.error("consume_credit threw", e);
        return {
          error: "Não foi possível validar seus créditos. Tente novamente.",
          imageDataUrl: null,
          creditsLeft: null,
        };
      }
    }

    // Devolve o crédito em falha dura — o user não perde geração por erro nosso.
    const refund = async (reason: string) => {
      if (isAdmin) return;
      try {
        await supabaseAdmin
          .from("user_credits")
          .update({ balance: (creditsLeft ?? 0) + 1 })
          .eq("user_id", context.userId);
        await supabaseAdmin.from("credit_transactions").insert({
          user_id: context.userId,
          amount: 1,
          kind: "refund",
          reference: reason,
        });
        creditsLeft = (creditsLeft ?? 0) + 1;
      } catch (e) {
        console.error("refund failed", e);
      }
    };

    // 2) Valida que a foto é um ambiente interno redecorável — roda ANTES da
    //    geração cara; se reprovar, estorna o crédito.
    const validation = await geminiText({
      model: MODEL_TEXT,
      system:
        'Você é um curador visual de fotos de ambientes internos. Sua tarefa é decidir se a imagem mostra um CÔMODO/AMBIENTE INTERNO real que pode ser redecorado.\n\nResponda SOMENTE em JSON no formato: {"valid":boolean,"reason":string,"is_empty_room":boolean,"room_type":"sala"|"quarto"|"cozinha"|"home-office"|"banheiro"|"outro"}.\n\nRegras:\n- APROVE (valid:true) se a foto mostrar um ambiente interno real e identificável — sala, quarto, cozinha, banheiro, escritório/home office, varanda, closet, hall, lavanderia, sala de jantar, etc. Aceite o ambiente mesmo que esteja bagunçado, mal iluminado ou pouco mobiliado.\n- REPROVE (valid:false) fotos de: paisagem, fachada ou área externa; foto que é só uma pessoa, selfie ou pet; comida; documento, screenshot ou print de tela; produto isolado sem o ambiente ao redor; render 3D claramente artificial; ou qualquer imagem onde não dá pra identificar um cômodo.\n- Defina is_empty_room=true se o ambiente estiver VAZIO ou SEMI-VAZIO (sem mobília montada), mas que poderia ser mobiliado e decorado. Defina is_empty_room=false se já houver mobília/decoração no ambiente, ou se a foto for reprovada.\n- No campo "room_type", classifique o cômodo usando EXATAMENTE um destes valores: "sala" (para salas de estar, salas de jantar e salas em geral), "quarto" (para dormitórios), "cozinha", "home-office" (para escritórios e ambientes de trabalho), "banheiro", "outro" (para lavanderias, halls, closets, varandas ou locais não identificáveis). Se a foto for reprovada ou o cômodo não puder ser identificado, use "outro".\n- No campo "reason", seja específico em português (ex.: "Isso parece uma foto de paisagem, não de um cômodo").',
      userText: "Avalie esta foto como possível ambiente interno para redecoração.",
      image: { dataUrl: data.imageDataUrl },
      responseJson: true,
    });

    if (validation.rateLimited) {
      console.error("[transform] validation rate limited", {
        status: validation.status,
        error: validation.error,
        model: MODEL_TEXT,
      });
      await refund("rate_limit_validation");
      return {
        error:
          "Estamos com muitas solicitações no momento. Aguarde alguns instantes e tente novamente.",
        imageDataUrl: null,
        creditsLeft,
      };
    }
    // Guardado num escopo mais amplo para reaproveitar o `room_type` ao
    // persistir o projeto e ao devolver a resposta da Server Function.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let parsed: any = null;
    if (validation.text) {
      try {
        parsed = JSON.parse(validation.text);
        if (parsed && parsed.valid === false) {
          await refund("invalid_photo");
          const baseReason = parsed?.reason || "envie uma foto de um cômodo da sua casa.";
          return {
            error: `Essa foto não parece um ambiente interno: ${baseReason} Envie a foto de um cômodo (sala, quarto, cozinha, escritório, etc).`,
            imageDataUrl: null,
            creditsLeft,
          };
        }
      } catch {
        /* best-effort — se o JSON não parsear, segue pra geração.
           normalizeRoomType(parsed?.room_type) lidará com `parsed` nulo. */
        parsed = null;
      }
    }

    // 3) Resolve o estilo: aceita slug canônico SEO ou alias antigo. Slug
    //    desconhecido é erro acionável (refund + mensagem clara), nunca
    //    fallback silencioso — usuário não pode pagar 1 crédito por algo
    //    que ele não pediu.
    const canonicalStyle = STYLE_ALIASES[data.style] ?? data.style;
    const stylePrompt = STYLE_PROMPTS[canonicalStyle];
    if (!stylePrompt) {
      await refund("unknown_style");
      return {
        error: `Estilo "${data.style}" não está disponível. Escolha um estilo do catálogo.`,
        imageDataUrl: null,
        creditsLeft,
      };
    }
    const styleName = canonicalStyle.charAt(0).toUpperCase() + canonicalStyle.slice(1);

    const variantHints = [
      "Variation A: balanced and neutral layout, classic furniture proportions, soft daylight.",
      "Variation B: warmer palette, layered textiles and rugs, accent lighting in the evening.",
      "Variation C: more dramatic and editorial composition, bolder accent piece, statement lamp.",
      "Variation D: airier and minimal arrangement, more negative space, brighter midday light.",
    ];
    const v =
      typeof data.variant === "number" ? Math.max(0, data.variant) % variantHints.length : 0;
    const variantLine = data.variant !== undefined ? variantHints[v] : "";

    const regionMap = [
      ``,
      `REGION-BY-REGION PRESERVATION MAP — mentally segment the input into the regions below and treat each one separately. Apply the LOCK rules before doing anything else.`,
      ``,
      `[A] WINDOW REGION (any pixel showing a window frame, glass, sill, mullion, blind, curtain or visible exterior view)`,
      `   LOCK: same count of windows, same outline shape, same position inside the frame, same proportions, same mullion grid, same sill height, same opening direction, same curtain/blind presence and length.`,
      `   ALLOWED: curtain fabric color/texture only — and only if the original already had curtains.`,
      `   FORBIDDEN: adding, removing, widening, narrowing, mirroring, sliding, splitting or merging any window. Do not invent a new window where there is a blank wall.`,
      ``,
      `[B] WALL / CEILING / FLOOR REGION (vertical planes, baseboards, crown molding, ceiling plane, floor plane, doors, door frames, columns, beams, outlets, switches, AC unit)`,
      `   LOCK: same wall corners, same ceiling height, same floor plane and floor pattern direction, same door positions, same outlets/switches in the same pixels.`,
      `   ALLOWED: wall paint color and finish, floor material (wood/tile/rug) — but the geometric edges stay in the same pixels.`,
      `   FORBIDDEN: moving a corner, raising/lowering the ceiling, hiding a door, repainting it as a wall, or changing the floor orientation.`,
      ``,
      `[C] MAIN FURNITURE REGION (the large furniture pieces already present — e.g. bed, sofa, dining table, desk, wardrobe, kitchen counter, shelving units)`,
      `   LOCK: each existing large piece keeps the same footprint and orientation, against the same wall as in the original. Same count of major pieces.`,
      `   ALLOWED: restyle the material, upholstery, finish and accessories of each piece to match "${styleName}".`,
      `   FORBIDDEN: rotating a piece, moving it to another wall, removing a piece, or adding a large new piece that was not in the original.`,
      ``,
      `[D] CIRCULATION AREA (the open/empty floor space — the walking paths and clear areas of the room)`,
      `   LOCK: keep this area CLEAR. Same negative space, same floor visible, same walking path as the original.`,
      `   ALLOWED: a rug whose footprint stays inside the original empty area; small plant in a corner if it fits.`,
      `   FORBIDDEN: dropping a new sofa, cabinet, large furniture piece or storage unit into this region — it must not get more crowded than the original.`,
      ``,
      `[E] LIGHT (direction, color temperature, shadow length)`,
      `   LOCK: same primary light direction (where shadows fall), same time-of-day feel, same window-light intensity.`,
      `   ALLOWED: add small decorative lamps consistent with the style — but they do not become the dominant light source.`,
      `   FORBIDDEN: flipping daytime to nighttime (or vice-versa), changing shadow direction, or replacing daylight with strong colored neon unless the chosen style explicitly calls for it.`,
    ].join("\n");

    const editPrompt = [
      `Photorealistic interior redesign of THIS EXACT room, restyled as: ${styleName}.`,
      `Style direction: ${stylePrompt}.`,
      ``,
      `STRICT PRESERVATION RULES — do not change any of these:`,
      `- Camera position, focal length and perspective are IDENTICAL to the input photo (same vanishing points, same eye level, same framing and crop).`,
      `- Room architecture is IDENTICAL: walls, corners, ceiling height, floor plane, doors and door frames stay exactly where they are.`,
      `- Windows: same count, same shape, same position, same size, same frame/mullions. Do NOT add, remove, move or resize any window.`,
      `- Natural light direction, color temperature and shadow direction from the windows are preserved.`,
      `- Overall room layout and the position of every existing large furniture piece against its wall stay the same. Keep each piece in its original spot.`,
      `- Aspect ratio and resolution match the input. No cropping, no zoom-in, no zoom-out, no re-framing.`,
      regionMap,
      ``,
      `WHAT YOU CAN CHANGE (always within the region rules above):`,
      `- Furniture style, decor, wall color/finish, rug, lighting fixtures, plants, accessories — restyled to match "${styleName}".`,
      `- Surface materials and color palette consistent with the chosen style.`,
      ...(variantLine ? [`- ${variantLine}`] : []),
      ``,
      `BEFORE YOU RENDER — quick self-check (do this silently, do not output it):`,
      `1. Count the windows in the input and confirm the output has the exact same count in the same positions.`,
      `2. Confirm the wall corners and ceiling line are in the same pixels.`,
      `3. Confirm each large furniture piece is on the same wall and in the same spot as the input.`,
      `4. Confirm the circulation/walkway area is not more crowded than the input.`,
      `If any check fails, restart and fix it.`,
      ``,
      `QUALITY:`,
      `- Photorealistic, professionally staged, sharp, natural daylight unless the original is clearly artificial-lit.`,
      `- Brazilian apartment context (realistic proportions, outlets, plug types if visible).`,
      `- No text, no captions, no watermarks, no logos, no UI overlays, no people, no pets.`,
      `- Do not output a collage, before/after split, frame or border. Output a single full-bleed photo.`,
    ].join("\n");

    const imageRes = await geminiImage({
      model: MODEL_IMAGE,
      prompt: editPrompt,
      inputImage: { dataUrl: data.imageDataUrl },
    });

    if (imageRes.rateLimited) {
      console.error("[transform] image rate limited", {
        status: imageRes.status,
        error: imageRes.error,
        model: MODEL_IMAGE,
      });
      await refund("rate_limit_image");
      return {
        error:
          "Estamos com muitas solicitações no momento. Aguarde alguns instantes e tente novamente.",
        imageDataUrl: null,
        creditsLeft,
      };
    }
    if (!imageRes.dataUrl) {
      console.error("[transform] image generation failed", {
        status: imageRes.status,
        error: imageRes.error,
        model: MODEL_IMAGE,
      });
      await refund("no_image_returned");
      return {
        error: "Não conseguimos gerar a imagem agora. Tente novamente em instantes.",
        imageDataUrl: null,
        creditsLeft,
      };
    }

    // 4) Sobe a imagem gerada e a foto original pro Storage — as URLs públicas
    //    vão pro banco (evita base64 gigante na coluna).
    const [storedAfter, storedBefore] = await Promise.all([
      uploadImageToStorage(imageRes.dataUrl, "generated", context.userId),
      uploadImageToStorage(data.imageDataUrl, "uploaded", context.userId),
    ]);
    // Fallback do "depois": o próprio data URL, pra não perder a geração.
    const storedUrl = storedAfter ?? imageRes.dataUrl;

    // Resolução do cômodo: hint da rota (/ambientes/<slug>) tem prioridade
    // quando reconhecido. Senão, cai na inferência da IA. Senão, "outro".
    const hintedRoom = data.roomTypeHint ? normalizeRoomType(data.roomTypeHint) : undefined;
    const inferredRoom = normalizeRoomType(parsed?.room_type);
    const finalRoomType: RoomType = hintedRoom ?? inferredRoom ?? "outro";

    // 5) Persiste o projeto na tabela `projects` (best-effort). Grava slug
    //    canônico (não alias) pra manter o banco coerente em projetos novos.
    try {
      const { error: persistErr } = await context.supabase.from("projects").insert({
        user_id: context.userId,
        title: `Projeto ${styleName}`,
        style_slug: canonicalStyle,
        before_url: storedBefore,
        after_url: storedUrl,
        ai_prompt: editPrompt,
        ai_model: MODEL_IMAGE,
        ai_response: {
          style: canonicalStyle,
          variant: data.variant ?? null,
          roomType: finalRoomType,
        },
      });
      if (persistErr) {
        console.error("persist project failed", persistErr);
      } else {
        // Lote 2 — evento de funil. Fire-and-forget: nunca afeta a geração.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        void (supabaseAdmin as any)
          .from("events")
          .insert({
            event: "project_saved",
            user_id: context.userId,
            props: { style: canonicalStyle },
          })
          .then(undefined, () => {});
      }
    } catch (e) {
      console.error("persist project failed", e);
    }

    // Devolve o data URL pro client — exibição, lista de compras e rascunhos.
    return {
      error: null,
      imageDataUrl: imageRes.dataUrl,
      creditsLeft,
      roomType: finalRoomType,
    };
  });
