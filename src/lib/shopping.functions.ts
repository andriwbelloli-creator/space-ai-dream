import { createServerFn } from "@tanstack/react-start";
import type { BudgetItem } from "@/lib/budget-pdf";

export type ShoppingInput = { imageDataUrl: string; style: string; styleName?: string };
export type ShoppingOutput = { items: BudgetItem[] };

const TAGS = ["Essencial", "Recomendado", "Opcional"] as const;

function sanitize(raw: unknown): BudgetItem[] {
  if (!Array.isArray(raw)) return [];
  const out: BudgetItem[] = [];
  for (const it of raw) {
    if (!it || typeof it !== "object") continue;
    const name = String((it as any).name ?? "").trim();
    const cat = String((it as any).cat ?? (it as any).category ?? "").trim();
    const price = String((it as any).price ?? "").trim();
    const tagRaw = String((it as any).tag ?? "Recomendado").trim();
    const tag = (TAGS as ReadonlyArray<string>).includes(tagRaw)
      ? (tagRaw as BudgetItem["tag"])
      : "Recomendado";
    if (!name || !cat || !price) continue;
    out.push({ tag, name, cat, price });
    if (out.length >= 12) break;
  }
  return out;
}

export const generateShoppingList = createServerFn({ method: "POST" })
  .inputValidator((input: ShoppingInput) => {
    if (!input?.imageDataUrl?.startsWith("data:image/")) {
      throw new Error("Imagem inválida.");
    }
    if (!input?.style) throw new Error("Estilo inválido.");
    return input;
  })
  .handler(async ({ data }): Promise<ShoppingOutput> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY não configurada.");

    const styleLabel = data.styleName ?? data.style;

    const sys =
      "Você é um designer de interiores brasileiro. Analise a imagem decorada e " +
      "monte uma lista de compras realista para reproduzir o ambiente. Preços em reais (BRL), " +
      "faixas conservadoras de mercado nacional. Português do Brasil. Sem marcas. " +
      "Use a tag 'Essencial' para móveis principais, 'Recomendado' para iluminação e textêis " +
      "estruturais e 'Opcional' para decoração final. Entre 8 e 12 itens, sem repetir.";

    const userPrompt =
      `Estilo do projeto: ${styleLabel}. ` +
      "Liste os itens visíveis ou implícitos no ambiente decorado, com nome curto, " +
      "categoria e faixa de preço no formato 'R$ 300–900'. Use o travessão (–).";

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: sys },
          {
            role: "user",
            content: [
              { type: "text", text: userPrompt },
              { type: "image_url", image_url: { url: data.imageDataUrl } },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "submit_shopping_list",
              description: "Submete a lista de compras estruturada do ambiente decorado.",
              parameters: {
                type: "object",
                properties: {
                  items: {
                    type: "array",
                    minItems: 6,
                    maxItems: 12,
                    items: {
                      type: "object",
                      properties: {
                        tag: { type: "string", enum: ["Essencial", "Recomendado", "Opcional"] },
                        name: { type: "string", description: "Nome curto do item, ex.: 'Sofá 3 lugares linho'." },
                        cat: { type: "string", description: "Categoria, ex.: 'Móveis principais', 'Iluminação', 'Decoração'." },
                        price: { type: "string", description: "Faixa de preço em reais, ex.: 'R$ 1.200–3.500'." },
                      },
                      required: ["tag", "name", "cat", "price"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["items"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "submit_shopping_list" } },
      }),
    });

    if (!res.ok) {
      if (res.status === 429) throw new Error("Muitas requisições. Tente novamente em instantes.");
      if (res.status === 402) throw new Error("Créditos de IA esgotados.");
      const txt = await res.text().catch(() => "");
      throw new Error(`Falha ao gerar lista (${res.status}). ${txt.slice(0, 160)}`);
    }

    const json: any = await res.json();
    const call = json?.choices?.[0]?.message?.tool_calls?.[0];
    let parsed: unknown = null;
    try {
      const args = call?.function?.arguments;
      parsed = typeof args === "string" ? JSON.parse(args) : args;
    } catch { /* ignore */ }

    const items = sanitize((parsed as any)?.items);
    if (!items.length) throw new Error("A IA não retornou uma lista válida.");
    return { items };
  });