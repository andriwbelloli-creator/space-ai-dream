/**
 * marketing-attribution.ts — captura de atribuição de marketing (Sprint 1).
 *
 * Captura parâmetros de origem/campanha da URL de entrada e persiste em
 * localStorage com modelo first-touch + last-touch, para futuramente
 * relacionar origem com lead, projeto, checkout e assinatura.
 *
 * Princípio de atribuição:
 *  - first_touch: primeira origem conhecida do dispositivo. Gravado uma vez,
 *    nunca sobrescrito. Inclui a primeira visita mesmo sem UTM (baseline).
 *  - last_touch: última origem de CAMPANHA conhecida. Atualizado somente
 *    quando chega uma nova UTM/click id válida — revisitas diretas (sem
 *    parâmetro) NÃO apagam a última campanha conhecida.
 *
 * Privacidade (LGPD):
 *  - NUNCA armazena PII (nome, e-mail, telefone, CPF, endereço).
 *  - Guarda apenas UTMs, click ids, referrer (site de origem) e landing_path.
 *  - localStorage (não cookie) — banner de consentimento é Sprint 2.
 *
 * SSR-safe: todas as funções degradam para no-op/null quando `window` não
 * existe (execução no servidor do TanStack Start).
 */

const STORAGE_KEY = "idealspace.attribution.v1";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

const CLICK_ID_KEYS = ["gclid", "fbclid", "ttclid"] as const;

type UtmKey = (typeof UTM_KEYS)[number];
type ClickIdKey = (typeof CLICK_ID_KEYS)[number];

/** Um "toque" de atribuição — origem conhecida em um momento. Sem PII. */
export type AttributionTouch = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  ttclid?: string;
  /** URL do site de origem (document.referrer). Vazio em acesso direto. */
  referrer?: string;
  /** Caminho de entrada same-origin (pathname, sem query). */
  landing_path?: string;
  /** ISO timestamp da captura deste toque. */
  captured_at: string;
};

export type MarketingAttribution = {
  first_touch: AttributionTouch;
  last_touch: AttributionTouch;
};

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/** Trunca valores para evitar payloads inflados e lixo. */
function clean(value: string | null): string | undefined {
  if (!value) return undefined;
  const v = value.trim().slice(0, 200);
  return v.length ? v : undefined;
}

/**
 * Lê UTMs + click ids da query string e referrer/landing_path do contexto.
 * Retorna o toque atual e se ele carrega sinal de campanha (UTM ou click id).
 */
function readCurrentTouch(): { touch: AttributionTouch; hasCampaign: boolean } {
  const params = new URLSearchParams(window.location.search);
  const touch: AttributionTouch = { captured_at: new Date().toISOString() };

  let hasCampaign = false;
  for (const key of UTM_KEYS) {
    const val = clean(params.get(key));
    if (val) {
      touch[key as UtmKey] = val;
      hasCampaign = true;
    }
  }
  for (const key of CLICK_ID_KEYS) {
    const val = clean(params.get(key));
    if (val) {
      touch[key as ClickIdKey] = val;
      hasCampaign = true;
    }
  }

  const ref = clean(document.referrer);
  // Ignora referrer same-origin (navegação interna não é "origem").
  if (ref && !ref.startsWith(window.location.origin)) {
    touch.referrer = ref;
  }
  touch.landing_path = window.location.pathname;

  return { touch, hasCampaign };
}

function readStored(): MarketingAttribution | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<MarketingAttribution>;
    if (!parsed?.first_touch || !parsed?.last_touch) return null;
    return parsed as MarketingAttribution;
  } catch {
    return null;
  }
}

/**
 * Captura a atribuição da URL atual e persiste. Idempotente por carregamento.
 *
 *  - Primeira visita: grava first_touch e last_touch (baseline, mesmo direto).
 *  - Visitas seguintes: atualiza SÓ last_touch e SÓ quando há UTM/click id
 *    novos. first_touch nunca é sobrescrito.
 *
 * Retorna a atribuição vigente e `isNewCampaignTouch` = true quando este
 * load trouxe um novo toque de campanha (útil pra disparar evento uma vez).
 * No SSR retorna null.
 */
export function captureMarketingAttribution(): {
  attribution: MarketingAttribution;
  isFirstTouch: boolean;
  isNewCampaignTouch: boolean;
} | null {
  if (!isBrowser()) return null;

  const { touch, hasCampaign } = readCurrentTouch();
  const stored = readStored();

  // Primeira visita absoluta: estabelece baseline.
  if (!stored) {
    const attribution: MarketingAttribution = { first_touch: touch, last_touch: touch };
    persist(attribution);
    return { attribution, isFirstTouch: true, isNewCampaignTouch: hasCampaign };
  }

  // Visitas seguintes: só atualiza last_touch se houver campanha nova.
  if (hasCampaign) {
    const attribution: MarketingAttribution = {
      first_touch: stored.first_touch,
      last_touch: touch,
    };
    persist(attribution);
    return { attribution, isFirstTouch: false, isNewCampaignTouch: true };
  }

  // Revisita direta/sem parâmetro: preserva tudo.
  return { attribution: stored, isFirstTouch: false, isNewCampaignTouch: false };
}

function persist(attribution: MarketingAttribution): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Safari privado / storage cheio — no-op. Atribuição é best-effort.
  }
}

/**
 * Lê a atribuição persistida sem capturar nada novo. Para outros fluxos
 * (lead, checkout, eventos) anexarem origem. Retorna null se nada salvo
 * ou no SSR.
 */
export function getMarketingAttribution(): MarketingAttribution | null {
  if (!isBrowser()) return null;
  return readStored();
}

/**
 * Achata a atribuição em props planas (strings/booleans) para anexar a um
 * evento de tracking. Sem PII; referrer vira só o domínio. `prefix` escolhe
 * first/last touch (default last). Limita-se a chaves curtas pra caber no
 * sanitizeProps do logEvent (máx. 12 chaves).
 */
export function attributionToEventProps(
  which: "first" | "last" = "last",
): Record<string, string> {
  const attr = getMarketingAttribution();
  if (!attr) return {};
  const t = which === "first" ? attr.first_touch : attr.last_touch;
  const props: Record<string, string> = {};
  if (t.utm_source) props.utm_source = t.utm_source;
  if (t.utm_medium) props.utm_medium = t.utm_medium;
  if (t.utm_campaign) props.utm_campaign = t.utm_campaign;
  if (t.utm_content) props.utm_content = t.utm_content;
  if (t.utm_term) props.utm_term = t.utm_term;
  if (t.gclid) props.gclid = t.gclid;
  if (t.fbclid) props.fbclid = t.fbclid;
  if (t.ttclid) props.ttclid = t.ttclid;
  if (t.landing_path) props.landing_path = t.landing_path;
  if (t.referrer) {
    try {
      props.referrer_domain = new URL(t.referrer).hostname;
    } catch {
      /* referrer malformado — ignora */
    }
  }
  return props;
}
