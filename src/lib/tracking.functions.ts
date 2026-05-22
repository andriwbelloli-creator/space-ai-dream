// Tracking de eventos do Ideal Space — Lote 6A P0.
// Registra a intenção de clique de afiliado via log estruturado no server-side
// (console.log em JSON). NÃO grava no Supabase, NÃO cria tabelas, NÃO persiste.
// NUNCA inclui PII (nome, e-mail, telefone) — apenas metadados de domínio.
import { createServerFn } from "@tanstack/react-start";

/** Dados mínimos de um clique de afiliado — sem PII. */
export type AffiliateClickEvent = {
  provider: string;
  productName: string;
  productCategory?: string;
  roomType?: string;
  style?: string;
  subId?: string;
  destinationUrl: string;
  timestamp: string;
};

/**
 * Mantém só os campos esperados e os coage a string com limite de tamanho —
 * barreira extra contra PII acidental ou payloads inflados.
 */
function sanitizeEvent(input: AffiliateClickEvent): AffiliateClickEvent {
  const str = (v: unknown, max: number): string => (typeof v === "string" ? v.slice(0, max) : "");
  const optional = (v: unknown, max: number): string | undefined => {
    const s = str(v, max);
    return s ? s : undefined;
  };
  return {
    provider: str(input?.provider, 60),
    productName: str(input?.productName, 200),
    productCategory: optional(input?.productCategory, 120),
    roomType: optional(input?.roomType, 60),
    style: optional(input?.style, 60),
    subId: optional(input?.subId, 200),
    destinationUrl: str(input?.destinationUrl, 1000),
    timestamp: str(input?.timestamp, 40),
  };
}

/**
 * Server function: registra a intenção de clique de afiliado.
 * Emite um log estruturado em JSON no server-side e retorna { ok: true }.
 * Preparação de tracking (Lote 6A P0) — não persiste nada no banco.
 */
export const logAffiliateClick = createServerFn({ method: "POST" })
  .validator((input: AffiliateClickEvent) => sanitizeEvent(input))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    console.log(
      JSON.stringify({
        event: "affiliate_click",
        ...data,
        loggedAt: new Date().toISOString(),
      }),
    );
    return { ok: true };
  });
