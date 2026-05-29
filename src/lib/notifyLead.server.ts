/**
 * notifyExecutarProjetoLead — server function que dispara notificação por
 * WhatsApp ao Andriw via CallMeBot quando um lead com source="executar-projeto"
 * é criado. Distribuição manual no MVP: Andriw recebe na hora e aciona o
 * arquiteto dentro do SLA de 4h prometido ao usuário.
 *
 * SEGURANÇA: roda EXCLUSIVAMENTE server-side (sufixo `.server.ts` +
 * `createServerFn` garantem que `CALLMEBOT_APIKEY` nunca vai pro bundle
 * browser). Variáveis de ambiente lidas via `process.env.*` no Worker.
 *
 * DEGRADA GRACEFULLY: se as envs não estão configuradas, faz `console.warn`
 * e retorna sem quebrar. O lead já foi salvo antes desta chamada; notificação
 * é best-effort e nunca bloqueia o fluxo.
 *
 * CallMeBot: https://www.callmebot.com/blog/free-api-whatsapp-messages/
 * Endpoint: GET https://api.callmebot.com/whatsapp.php?phone=X&text=Y&apikey=Z
 */
import { createServerFn } from "@tanstack/react-start";

type NotifyPayload = {
  name: string;
  phone: string;
  email?: string;
  cep?: string;
  city?: string;
  investment_range?: string;
  start_timing?: string;
};

/** Mapa enum→label de faixa de investimento. Mantém em sync com LeadFormModal. */
const INVESTMENT_LABELS: Record<string, string> = {
  ate_3k: "Até R$ 3 mil",
  "3k_10k": "R$ 3-10 mil",
  "10k_30k": "R$ 10-30 mil",
  "30k_100k": "R$ 30-100 mil",
  acima_100k: "Acima de R$ 100 mil",
};

/** Mapa enum→label de quando começar. Mantém em sync com LeadFormModal. */
const TIMING_LABELS: Record<string, string> = {
  agora: "Agora",
  proximo_mes: "Próximo mês",
  "2_3_meses": "Em 2-3 meses",
  explorando: "Só explorando",
};

export const notifyExecutarProjetoLead = createServerFn({ method: "POST" })
  .inputValidator((input: NotifyPayload) => {
    if (!input?.name || !input?.phone) {
      throw new Error("Notificação requer name e phone.");
    }
    return input;
  })
  .handler(async ({ data }): Promise<{ ok: boolean; error?: string }> => {
    const phone = process.env.CALLMEBOT_PHONE;
    const apikey = process.env.CALLMEBOT_APIKEY;
    if (!phone || !apikey) {
      console.warn(
        "[notify-lead] CALLMEBOT_PHONE ou CALLMEBOT_APIKEY ausente; notificação ignorada.",
      );
      return { ok: false, error: "callmebot_not_configured" };
    }

    const investmentLabel = data.investment_range
      ? (INVESTMENT_LABELS[data.investment_range] ?? data.investment_range)
      : "-";
    const timingLabel = data.start_timing
      ? (TIMING_LABELS[data.start_timing] ?? data.start_timing)
      : "-";
    const location = data.city || data.cep || "-";

    // Texto plano, sem emoji, pra evitar problemas de encoding no GET.
    const text = [
      "Novo lead Ideal Space",
      `Nome: ${data.name}`,
      `WhatsApp: ${data.phone}`,
      `Cidade: ${location}`,
      `Orcamento: ${investmentLabel}`,
      `Quando: ${timingLabel}`,
    ].join("\n");

    const url =
      `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}` +
      `&text=${encodeURIComponent(text)}` +
      `&apikey=${encodeURIComponent(apikey)}`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error("[notify-lead] CallMeBot fetch failed", {
          status: res.status,
        });
        return { ok: false, error: `http_${res.status}` };
      }
      return { ok: true };
    } catch (e) {
      console.error("[notify-lead] CallMeBot fetch threw", e);
      return {
        ok: false,
        error: e instanceof Error ? e.message : "unknown",
      };
    }
  });
