import { createServerFn } from "@tanstack/react-start";
import type { BudgetItem } from "@/lib/budget-pdf";
import { geminiText } from "@/lib/gemini.server";
import { categoriesForRoom } from "@/lib/room-products";

export type ShoppingInput = {
  imageDataUrl: string;
  style: string;
  styleName?: string;
  roomType?: string;
};
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
    // roomType é opcional — normaliza para string limpa ou undefined.
    const roomType =
      typeof input.roomType === "string" && input.roomType.trim()
        ? input.roomType.trim()
        : undefined;
    return { ...input, roomType };
  })
  .handler(async ({ data }): Promise<ShoppingOutput> => {
    const styleLabel = data.styleName ?? data.style;
    const roomType = data.roomType;
    const allowedCategories = categoriesForRoom(roomType);

    // Quando o cômodo é reconhecido, orienta o Gemini a restringir as
    // recomendações às categorias coerentes com o ambiente.
    const roomDirective =
      roomType && allowedCategories.length
        ? ` O cômodo sob análise é do tipo '${roomType}'. ` +
          "Priorize e restrinja as recomendações de produtos principalmente às categorias " +
          `associadas a este ambiente: ${allowedCategories.join(", ")}. ` +
          "Evite sugerir móveis e decorações que fujam do propósito deste ambiente " +
          "(por exemplo, não recomende sofás ou racks em cozinhas ou banheiros), " +
          "mas permita itens decorativos complementares coerentes."
        : "";

    const sys =
      "Você é um designer de interiores brasileiro. Analise a imagem decorada e " +
      "monte uma lista de compras realista para reproduzir o ambiente. Preços em reais (BRL), " +
      "faixas conservadoras de mercado nacional. Português do Brasil. Sem marcas. " +
      "Use a tag 'Essencial' para móveis principais, 'Recomendado' para iluminação e textêis " +
      "estruturais e 'Opcional' para decoração final. Entre 8 e 12 itens, sem repetir.";

    const userPrompt =
      `Estilo do projeto: ${styleLabel}. ` +
      "Liste os itens visíveis ou implícitos no ambiente decorado, com nome curto, " +
      "categoria e faixa de preço no formato 'R$ 300–900'. Use o travessão (–). " +
      "Responda APENAS com um objeto JSON neste formato exato: " +
      '{"items":[{"tag":"Essencial","name":"Sofá 3 lugares linho","cat":"Móveis principais","price":"R$ 1.200–3.500"}]}. ' +
      'O campo "tag" deve ser exatamente "Essencial", "Recomendado" ou "Opcional".' +
      roomDirective;

    const { text, rateLimited, error } = await geminiText({
      model: "gemini-2.5-flash",
      system: sys,
      userText: userPrompt,
      image: { dataUrl: data.imageDataUrl },
      responseJson: true,
    });

    if (rateLimited) {
      throw new Error("Muitas requisições. Tente novamente em instantes.");
    }
    if (!text) {
      throw new Error(`Falha ao gerar lista${error ? ` (${error})` : ""}.`);
    }

    let parsed: unknown = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      /* ignore — sanitize trata array ausente */
    }

    const items = sanitize((parsed as any)?.items);
    if (!items.length) throw new Error("A IA não retornou uma lista válida.");
    return { items };
  });
