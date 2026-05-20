import { createServerFn } from "@tanstack/react-start";
import { geminiImage } from "@/lib/gemini.server";

const STYLE_PROMPTS: Record<string, string> = {
  japandi:
    "Japandi interior: warm oak wood, linen textiles, paper lamps, calm neutral palette, minimal decor, soft natural light.",
  modern:
    "Contemporary interior: clean lines, curated art, soft curves, warm neutrals with one accent color, designer furniture.",
  minimal:
    "Minimalist interior: white walls, very few objects, hidden storage, light wood floor, monochrome palette, soft daylight.",
  natural:
    "Natural interior: light wood, rattan and jute fibers, lots of greenery, beige and cream tones, organic textures.",
  industrial:
    "Industrial interior: exposed brick, black steel, leather sofa, vintage Edison bulbs, concrete floor, moody warm light.",
  luxe:
    "Quiet luxury interior: travertine, brushed brass, bouclé fabric, marble accents, deep neutral palette, ambient lighting.",
};

export type TransformInput = { imageDataUrl: string; style: string; variant?: number };
export type TransformOutput = { imageDataUrl: string };

export const transformImage = createServerFn({ method: "POST" })
  .inputValidator((input: TransformInput) => {
    if (!input?.imageDataUrl?.startsWith("data:image/")) {
      throw new Error("Imagem inválida.");
    }
    if (!input.style || typeof input.style !== "string") {
      throw new Error("Estilo inválido.");
    }
    return input;
  })
  .handler(async ({ data }): Promise<TransformOutput> => {
    const stylePrompt = STYLE_PROMPTS[data.style] ?? STYLE_PROMPTS.modern;

    const variantHints = [
      "Variation A: balanced and neutral layout, classic furniture proportions, soft daylight.",
      "Variation B: warmer palette, layered textiles and rugs, accent lighting in the evening.",
      "Variation C: more dramatic and editorial composition, bolder accent piece, statement lamp.",
      "Variation D: airier and minimal arrangement, more negative space, brighter midday light.",
    ];
    const v = typeof data.variant === "number" ? Math.max(0, data.variant) % variantHints.length : 0;
    const variantLine = data.variant !== undefined ? ` ${variantHints[v]}` : "";

    const prompt =
      `Redesign this exact room in the following interior style: ${stylePrompt} ` +
      `Keep the same camera angle, perspective, room geometry, windows and architectural elements. ` +
      `Only change furniture, decor, materials, colors and lighting to match the style. ` +
      `Photorealistic, high quality interior photography, natural light. Do not add text or watermarks.` +
      variantLine;

    const { dataUrl, rateLimited, error } = await geminiImage({
      model: "gemini-2.5-flash-image",
      prompt,
      inputImage: { dataUrl: data.imageDataUrl },
    });

    if (rateLimited) {
      throw new Error("Muitas gerações em pouco tempo. Tente novamente em instantes.");
    }
    if (!dataUrl) {
      throw new Error(
        error
          ? `A IA não retornou uma imagem (${error}). Tente outra foto ou estilo.`
          : "A IA não retornou uma imagem. Tente outra foto ou estilo.",
      );
    }
    return { imageDataUrl: dataUrl };
  });
