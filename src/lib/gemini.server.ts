// Wrapper pra Google AI Studio (Gemini API) — chamadas diretas ao endpoint
// público do Google, usando GOOGLE_AI_API_KEY do env.
//
// Substitui o Lovable AI Gateway: a Lovable só injeta LOVABLE_API_KEY dentro
// do runtime dela, então fora do Lovable (dev local, Cloudflare Workers) os
// endpoints de IA ficam quebrados. Este wrapper resolve chamando o Google direto.

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

type ImagePart = { dataUrl: string }; // "data:image/jpeg;base64,..."

type GeminiPart =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: GeminiPart[] };
    finishReason?: string;
  }>;
  promptFeedback?: { blockReason?: string };
  error?: { code: number; message: string; status: string };
};

function getApiKey(): string {
  const key = process.env.GOOGLE_AI_API_KEY;
  if (!key) throw new Error("GOOGLE_AI_API_KEY não configurada no env.");
  return key;
}

function dataUrlToInline(dataUrl: string): GeminiPart {
  const match = dataUrl.match(/^data:(image\/[a-z]+);base64,(.+)$/);
  if (!match) throw new Error("dataUrl inválido — formato esperado: data:image/...;base64,...");
  return { inlineData: { mimeType: match[1], data: match[2] } };
}

async function callGemini(
  model: string,
  body: Record<string, unknown>,
): Promise<{ status: number; data: GeminiResponse }> {
  const url = `${GEMINI_API_BASE}/${model}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": getApiKey(),
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as GeminiResponse;
  return { status: res.status, data };
}

export type GeminiTextOptions = {
  model: string; // ex: "gemini-2.5-flash"
  system?: string;
  userText: string;
  image?: ImagePart;
  responseJson?: boolean; // força responseMimeType: application/json
  temperature?: number;
};

/**
 * Chamada de texto/JSON. Retorna o texto final do modelo, já limpo de fences
 * markdown.
 */
export async function geminiText(opts: GeminiTextOptions): Promise<{
  text: string | null;
  status: number;
  rateLimited: boolean;
  error: string | null;
}> {
  const parts: GeminiPart[] = [{ text: opts.userText }];
  if (opts.image) parts.push(dataUrlToInline(opts.image.dataUrl));

  const body: Record<string, unknown> = {
    contents: [{ role: "user", parts }],
    generationConfig: {
      ...(opts.responseJson ? { responseMimeType: "application/json" } : {}),
      ...(opts.temperature !== undefined ? { temperature: opts.temperature } : {}),
    },
  };
  if (opts.system) {
    body.systemInstruction = { parts: [{ text: opts.system }] };
  }

  const { status, data } = await callGemini(opts.model, body);
  if (status === 429) return { text: null, status, rateLimited: true, error: "rate_limit" };
  if (status >= 400) {
    return { text: null, status, rateLimited: false, error: data.error?.message ?? `http_${status}` };
  }

  const rawParts = data.candidates?.[0]?.content?.parts ?? [];
  const text = rawParts.find((p): p is { text: string } => "text" in p)?.text ?? null;
  const cleaned = text ? text.replace(/```json|```/g, "").trim() : null;
  return { text: cleaned, status, rateLimited: false, error: null };
}

export type GeminiImageOptions = {
  model: string; // ex: "gemini-2.5-flash-image" (Nano Banana)
  prompt: string;
  inputImage?: ImagePart; // pra edit; sem isso, é gerar do zero
};

/**
 * Image generation/edit. Retorna data URL completo "data:image/...;base64,..."
 * se o modelo gerou.
 *
 * IMPORTANTE: gemini-2.5-flash-image (Nano Banana) EXIGE
 * `responseModalities: ["TEXT", "IMAGE"]` em generationConfig. Sem isso, o
 * modelo responde só texto e o response não tem `inlineData`.
 * Doc: https://ai.google.dev/gemini-api/docs/image-generation
 */
export async function geminiImage(opts: GeminiImageOptions): Promise<{
  dataUrl: string | null;
  status: number;
  rateLimited: boolean;
  error: string | null;
}> {
  const parts: GeminiPart[] = [{ text: opts.prompt }];
  if (opts.inputImage) parts.push(dataUrlToInline(opts.inputImage.dataUrl));

  const body = {
    contents: [{ role: "user", parts }],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  };

  const { status, data } = await callGemini(opts.model, body);
  if (status === 429) return { dataUrl: null, status, rateLimited: true, error: "rate_limit" };
  if (status >= 400) {
    return { dataUrl: null, status, rateLimited: false, error: data.error?.message ?? `http_${status}` };
  }

  const rawParts = data.candidates?.[0]?.content?.parts ?? [];
  const imgPart = rawParts.find(
    (p): p is { inlineData: { mimeType: string; data: string } } => "inlineData" in p,
  );
  const textPart = rawParts.find((p): p is { text: string } => "text" in p);

  if (!imgPart) {
    const blockReason = data.promptFeedback?.blockReason ?? null;
    const finishReason = data.candidates?.[0]?.finishReason ?? null;
    console.warn("[gemini.image] no image returned", {
      model: opts.model,
      status,
      finishReason,
      blockReason,
      hasText: !!textPart,
      textPreview: textPart?.text?.slice(0, 120) ?? null,
    });
    return {
      dataUrl: null,
      status,
      rateLimited: false,
      error: blockReason ? `blocked:${blockReason}` : "no_image_in_response",
    };
  }

  const dataUrl = `data:${imgPart.inlineData.mimeType};base64,${imgPart.inlineData.data}`;
  return { dataUrl, status, rateLimited: false, error: null };
}
