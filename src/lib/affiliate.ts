// ============================================================
// AFFILIATE TAGS — edite aqui pra ativar comissão
// Essas tags aparecem nas URLs públicas (não são secrets).
// Deixe string vazia "" pra desativar uma loja.
// ============================================================

export const AFFILIATE_TAGS = {
  amazon: "deskly02-20", // Amazon Associates BR (conta Deskly)
  mercadolivre: "", // pendente — matt_tool do ML
  magalu: "", // desativado por regra do CLAUDE.md ("Do not use desklylife")
  awin: "2890163", // Awin Publisher ID (conta Deskly) — desativado até ter merchants
  lomadee: "", // pendente — Lomadee sourceId
} as const;

// Awin/Lomadee são redes — cobrem várias lojas (Casas Bahia, Carrefour,
// Tok&Stok, Leroy Merlin, Kabum, Americanas etc). O link vai por deeplink.

export type Marketplace = {
  id:
    | "mercadolivre"
    | "amazon"
    | "magalu"
    | "shopee"
    | "awin"
    | "lomadee"
    // Fallback search — ativam quando tiver tag
    | "aliexpress"
    | "madeira"
    | "tokstok"
    | "leroymerlin"
    | "kabum";
  label: string;
  short: string;
  network?: "direct" | "awin" | "lomadee";
  build: (query: string) => string;
  enabled: boolean;
};

const enc = (q: string) => encodeURIComponent(q.trim());

export const MARKETPLACES: Marketplace[] = [
  {
    id: "mercadolivre",
    label: "Mercado Livre",
    short: "ML",
    network: "direct",
    // Ativa só quando houver um matt_tool real do Mercado Livre.
    enabled: Boolean(AFFILIATE_TAGS.mercadolivre),
    build: (q) => {
      const slug = enc(q).replace(/%20/g, "-");
      const base = `https://lista.mercadolivre.com.br/${slug}`;
      return AFFILIATE_TAGS.mercadolivre
        ? `${base}#matt_tool=${AFFILIATE_TAGS.mercadolivre}`
        : base;
    },
  },
  {
    id: "amazon",
    label: "Amazon BR",
    short: "AMZ",
    network: "direct",
    // Ativa só com a tag Amazon Associates configurada.
    enabled: Boolean(AFFILIATE_TAGS.amazon),
    build: (q) => {
      const params = new URLSearchParams({ k: q });
      if (AFFILIATE_TAGS.amazon) params.set("tag", AFFILIATE_TAGS.amazon);
      return `https://www.amazon.com.br/s?${params.toString()}`;
    },
  },
  {
    id: "magalu",
    label: "Magalu",
    short: "MGL",
    network: "direct",
    // Ativa só com a loja Magazine Você cadastrada (sem ID = desativada).
    enabled: Boolean(AFFILIATE_TAGS.magalu),
    build: (q) => {
      // Magazine Você: vendas pela sua "loja" do parceiro
      if (AFFILIATE_TAGS.magalu) {
        return `https://www.magazinevoce.com.br/${AFFILIATE_TAGS.magalu}/busca/${enc(q)}/`;
      }
      return `https://www.magazineluiza.com.br/busca/${enc(q)}/`;
    },
  },
  {
    id: "shopee",
    label: "Shopee",
    short: "SHP",
    network: "direct",
    // Sem programa de afiliado Shopee configurado — desativado.
    enabled: false,
    build: (q) => `https://shopee.com.br/search?keyword=${enc(q)}`,
  },
  {
    id: "awin",
    label: "Lojas Awin",
    short: "AWN",
    network: "awin",
    // Desligado: o link cread.php exige awinmid = MERCHANT ID (da loja, ex:
    // Casas Bahia, Tok&Stok, Leroy), não o publisher ID. Hoje só temos o
    // publisher (2890163). Pra reativar, aplicar em cada loja Awin (Programs
    // → Search → Join), pegar o merchant ID de cada e refatorar o builder
    // pra escolher merchant por categoria.
    enabled: false,
    build: (q) =>
      `https://www.awin1.com/cread.php?awinmid=${AFFILIATE_TAGS.awin}&awinaffid=${AFFILIATE_TAGS.awin}&clickref=deskly&ued=${enc(
        `https://www.google.com/search?q=${enc(q + " comprar")}`,
      )}`,
  },
  {
    id: "lomadee",
    label: "Lojas Lomadee",
    short: "LMD",
    network: "lomadee",
    enabled: Boolean(AFFILIATE_TAGS.lomadee),
    build: (q) =>
      `https://redir.lomadee.com/v2/deeplink?sourceId=${AFFILIATE_TAGS.lomadee}&url=${enc(
        `https://www.google.com/search?q=${enc(q + " comprar")}`,
      )}`,
  },
  // ============================================================
  // Fallbacks SEM affiliate tag ainda (links genéricos de busca).
  // Quando cadastrar no programa de afiliados, mover pra
  // AFFILIATE_TAGS + atualizar build() com a tag certa.
  // ============================================================
  {
    id: "aliexpress",
    label: "AliExpress",
    short: "ALI",
    network: "direct",
    enabled: false, // ativar após cadastro AliExpress Affiliates
    build: (q) => `https://pt.aliexpress.com/wholesale?SearchText=${enc(q)}`,
  },
  {
    id: "madeira",
    label: "MadeiraMadeira",
    short: "MDM",
    network: "direct",
    enabled: false,
    build: (q) => `https://www.madeiramadeira.com.br/busca?q=${enc(q)}`,
  },
  {
    id: "tokstok",
    label: "Tok&Stok",
    short: "TKS",
    network: "direct",
    enabled: false,
    build: (q) => `https://www.tokstok.com.br/busca?q=${enc(q)}`,
  },
  {
    id: "leroymerlin",
    label: "Leroy Merlin",
    short: "LRM",
    network: "direct",
    enabled: false,
    build: (q) => `https://www.leroymerlin.com.br/search?term=${enc(q)}`,
  },
  {
    id: "kabum",
    label: "KaBuM!",
    short: "KBM",
    network: "direct",
    enabled: false,
    build: (q) => `https://www.kabum.com.br/busca/${enc(q)}`,
  },
];

export function buildAffiliateLinks(productName: string) {
  return MARKETPLACES.filter((m) => m.enabled).map((m) => ({
    ...m,
    url: m.build(productName),
  }));
}

// ============================================================
// Hierarquia + subIDs
// ============================================================

export type AffiliateContext = {
  projectId: string; // uuid do projeto (truncamos pra 8 chars no subid)
  roomType?: string | null;
  styleSlug?: string | null;
  budgetRange?: string | null;
  productCategory?: string | null;
  source?: string; // ex: "empty_room_result"
};

export type AffiliateResolved = {
  primaryUrl: string; // URL principal pra "Ver opções"
  primaryProvider: string; // amazon | magalu | mercadolivre | shopee | direct | google_shopping
  fallbackUrl: string; // Google Shopping (sempre disponível pra fallback)
  isDirectProduct: boolean; // true se primary é affiliate_url direto do produto
  subId: string; // string usada nos params (transparência/debug)
};

/**
 * Gera string compacta de subID sem PII pra usar em params dos marketplaces.
 * Formato: `<source>:<projId8>:<room>:<style>:<budget>:<category>`
 * Ex: "er:abc12345:quarto_vazio:moderno:ate_3000:mesa"
 *
 * Cada marketplace aceita um campo subId próprio. Vamos truncar conforme limite.
 * NUNCA inclui email, nome, telefone — só IDs de domínio.
 */
export function compactSubId(ctx: AffiliateContext): string {
  const parts = [
    (ctx.source ?? "er").slice(0, 4),
    ctx.projectId.replace(/-/g, "").slice(0, 8),
    (ctx.roomType ?? "").slice(0, 14),
    (ctx.styleSlug ?? "").slice(0, 14),
    (ctx.budgetRange ?? "").slice(0, 10),
    (ctx.productCategory ?? "").slice(0, 14),
  ];
  return parts.filter(Boolean).join(":");
}

/**
 * Adiciona subID na URL conforme padrão de cada provider.
 *
 * - Amazon: `ascsubtag`
 * - Magazine Você: `?utm_content=...` (Magalu não tem subID oficial; UTM é seguro)
 * - Mercado Livre: append `&matt_word=...` ao fragmento (matt_tool já existe)
 * - Shopee: até 5 params `af_sub1..af_sub5`
 * - Google Shopping: UTM params
 */
export function appendSubIdToUrl(url: string, provider: string, subId: string): string {
  if (!subId) return url;
  try {
    const safeId = subId.replace(/[^a-zA-Z0-9_:-]/g, "_");
    switch (provider) {
      case "amazon": {
        const u = new URL(url);
        u.searchParams.set("ascsubtag", safeId.slice(0, 64));
        return u.toString();
      }
      case "magalu": {
        const u = new URL(url);
        u.searchParams.set("utm_content", safeId);
        return u.toString();
      }
      case "mercadolivre": {
        const sep = url.includes("#") ? "&" : "#";
        return `${url}${sep}matt_word=${encodeURIComponent(safeId)}`;
      }
      case "shopee": {
        const u = new URL(url);
        // Quebra em partes pra cada af_sub (compatibilidade Shopee)
        const segs = safeId.split(":");
        segs.slice(0, 5).forEach((s, i) => u.searchParams.set(`af_sub${i + 1}`, s));
        return u.toString();
      }
      case "google_shopping":
      case "direct": {
        const u = new URL(url);
        u.searchParams.set("utm_source", "idealspace");
        u.searchParams.set("utm_medium", "empty_room");
        u.searchParams.set("utm_content", safeId);
        return u.toString();
      }
      default:
        return url;
    }
  } catch {
    return url; // URL parsing failed — devolve original
  }
}

/** Builder de busca Google Shopping com query do produto. */
function googleShoppingUrl(productName: string): string {
  const params = new URLSearchParams({ q: productName, tbm: "shop" });
  return `https://www.google.com/search?${params.toString()}`;
}

/**
 * Resolve hierarquia de afiliado pra um produto:
 *  1. Se produto tem affiliate_url direto e tag está ativa → usa esse (direct)
 *  2. Senão, tenta Amazon (tag ativa) → Magalu (tag) → ML (matt_tool) → Shopee
 *  3. fallbackUrl = sempre Google Shopping (independente do primary)
 *
 * SubID injetado em cada URL via appendSubIdToUrl.
 */
export function buildAffiliateLinkForProduct(args: {
  productName: string;
  productAffiliateUrl: string | null; // do products.affiliate_url
  context: AffiliateContext;
}): AffiliateResolved {
  const subId = compactSubId(args.context);
  const fallbackUrl = appendSubIdToUrl(
    googleShoppingUrl(args.productName),
    "google_shopping",
    subId,
  );

  // 1. Direct (produto tem affiliate_url cadastrado)
  if (args.productAffiliateUrl) {
    return {
      primaryUrl: appendSubIdToUrl(args.productAffiliateUrl, "direct", subId),
      primaryProvider: "direct",
      fallbackUrl,
      isDirectProduct: true,
      subId,
    };
  }

  // 2. Hierarquia de marketplaces (ordem: Amazon → Magalu → ML → Shopee)
  const order: Array<{ id: string }> = [
    { id: "amazon" },
    { id: "magalu" },
    { id: "mercadolivre" },
    { id: "shopee" },
  ];

  for (const { id } of order) {
    const mkt = MARKETPLACES.find((m) => m.id === id && m.enabled);
    if (!mkt) continue;
    // Pula se for tag-dependente e não tiver tag (exceto shopee que sempre vale)
    if (id === "amazon" && !AFFILIATE_TAGS.amazon) continue;
    if (id === "magalu" && !AFFILIATE_TAGS.magalu) continue;

    return {
      primaryUrl: appendSubIdToUrl(mkt.build(args.productName), id, subId),
      primaryProvider: id,
      fallbackUrl,
      isDirectProduct: false,
      subId,
    };
  }

  // 3. Último recurso: Google Shopping mesmo
  return {
    primaryUrl: fallbackUrl,
    primaryProvider: "google_shopping",
    fallbackUrl,
    isDirectProduct: false,
    subId,
  };
}
