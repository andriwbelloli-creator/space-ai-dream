/**
 * Persistência de contexto de retorno pra fluxos protegidos por cadastro,
 * login ou paywall. Garante que o usuário volte exatamente pro lugar de
 * onde saiu, em vez de ser jogado pra home.
 *
 * Estratégia híbrida (combina o melhor de URL e storage):
 *
 *  - URL search params (?redirect=&sourceAction=) carregam o caminho de
 *    volta e a ação de origem. Short, share-friendly, sobrevivem a hard
 *    reload, validados contra open-redirect.
 *  - sessionStorage carrega metadata opcional (productId, generationSeed,
 *    etc) quando o caller precisa de dados ricos que não cabem em URL.
 *    Some quando a aba fecha — sem efeito colateral cross-session.
 *
 * Caller típico no momento de barrar o usuário:
 *
 *   const returnTo = window.location.pathname;
 *   saveReturnContext({ returnTo, sourceAction: "upload_photo" });
 *   navigate({
 *     to: "/login",
 *     search: { redirect: returnTo, sourceAction: "upload_photo", mode: "signup" },
 *   });
 *
 * Caller típico após login/callback bem-sucedido:
 *
 *   const dest = resolveReturnTo(Route.useSearch()) ?? "/";
 *   clearReturnContext();
 *   navigate({ to: dest });
 *
 * Segurança:
 *  - isSafeReturnPath bloqueia open-redirect (URLs absolutas, '//host',
 *    protocol-relative, javascript:, etc).
 *  - Bloqueia também loops indo pra rotas de auth ou pricing.
 *  - Contexto expira em 30 min — fluxo de signup com confirmação por
 *    email cabe; depois disso, fallback pra "/".
 */

const STORAGE_KEY = "idealspace.returnContext.v1";

// 30 minutos cobre signup+confirmação por email sem ser permissivo
// demais. Contextos mais antigos são descartados.
const MAX_AGE_MS = 30 * 60 * 1000;

// Prefixes que NÃO podem ser destino de retorno — geram loop ou caem
// fora do escopo deste mecanismo.
const UNSAFE_PREFIXES = ["/login", "/auth/callback", "/auth/", "/reset-password"];

type SaveInput = {
  /** Path absoluto same-origin (ex: "/vs/planner-5d"). */
  returnTo: string;
  /** Etiqueta curta da ação de origem (ex: "upload_photo"). */
  sourceAction?: string;
  /** Dados ricos opcionais — ficam só no sessionStorage. */
  metadata?: Record<string, string>;
};

export type ReturnContext = {
  returnTo: string;
  sourceAction?: string;
  metadata?: Record<string, string>;
  timestamp: number;
};

type SearchLike = { redirect?: string; sourceAction?: string } | undefined | null;

/**
 * Valida se um path é seguro como destino de retorno:
 *  - é string não-vazia
 *  - começa com '/'
 *  - não começa com '//' (proteção contra protocol-relative URL)
 *  - não contém ':' (proteção contra javascript:, data:, etc)
 *  - não cai em prefix de auth/paywall (proteção contra loop)
 */
export function isSafeReturnPath(path: unknown): path is string {
  if (typeof path !== "string" || path.length === 0) return false;
  if (!path.startsWith("/")) return false;
  if (path.startsWith("//")) return false;
  if (path.includes(":")) return false;
  for (const prefix of UNSAFE_PREFIXES) {
    if (path === prefix) return false;
    if (path.startsWith(prefix + "/")) return false;
    if (path.startsWith(prefix + "?")) return false;
  }
  return true;
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

/**
 * Salva contexto de retorno antes de redirecionar pra login/paywall.
 * Side-effect: grava em sessionStorage. URL é responsabilidade do
 * caller (deve passar ?redirect=&sourceAction= ao navegar). Se
 * returnTo é unsafe ou storage indisponível, no-op silencioso — o
 * mecanismo de URL continua funcionando como fallback.
 */
export function saveReturnContext(input: SaveInput): void {
  if (!isBrowser()) return;
  if (!isSafeReturnPath(input.returnTo)) return;
  const ctx: ReturnContext = {
    returnTo: input.returnTo,
    sourceAction: input.sourceAction,
    metadata: input.metadata,
    timestamp: Date.now(),
  };
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ctx));
  } catch {
    // Safari privado pode bloquear setItem. URL ainda carrega o
    // essencial — não vamos quebrar o fluxo por isso.
  }
}

/**
 * Lê e mescla contexto: URL search params (autoritativos quando válidos)
 * com sessionStorage (fallback se URL não tem, e fonte única de metadata).
 * Retorna null se nada válido (incluindo contexto expirado).
 */
export function getReturnContext(search?: SearchLike): ReturnContext | null {
  // URL: vem do navigate() explícito do caller — mais confiável.
  const urlReturnTo = search?.redirect;
  const urlSourceAction = search?.sourceAction;

  // sessionStorage: fallback + fonte de metadata. Ignora se expirado.
  let stored: ReturnContext | null = null;
  if (isBrowser()) {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ReturnContext>;
        const age = Date.now() - (parsed?.timestamp ?? 0);
        if (
          age >= 0 &&
          age <= MAX_AGE_MS &&
          isSafeReturnPath(parsed?.returnTo) &&
          typeof parsed?.returnTo === "string"
        ) {
          const safeSourceAction =
            typeof parsed.sourceAction === "string" ? parsed.sourceAction : undefined;
          const safeMetadata =
            parsed.metadata && typeof parsed.metadata === "object" ? parsed.metadata : undefined;
          stored = {
            returnTo: parsed.returnTo,
            sourceAction: safeSourceAction,
            metadata: safeMetadata,
            timestamp: parsed.timestamp ?? Date.now(),
          };
        }
      }
    } catch {
      // JSON corrompido ou storage bloqueado — ignora silenciosamente.
    }
  }

  // Resolve: URL > storage pra returnTo e sourceAction. Metadata só
  // vem de storage (não cabe em URL).
  const returnTo = isSafeReturnPath(urlReturnTo) ? urlReturnTo : (stored?.returnTo ?? null);
  if (!returnTo) return null;

  return {
    returnTo,
    sourceAction: urlSourceAction ?? stored?.sourceAction,
    metadata: stored?.metadata,
    timestamp: stored?.timestamp ?? Date.now(),
  };
}

/**
 * Atalho pra o caso mais comum: pegar o path de retorno seguro pra
 * passar a navigate(). Retorna null se nada válido — caller faz
 * `?? "/"` como fallback explícito.
 */
export function resolveReturnTo(search?: SearchLike): string | null {
  const ctx = getReturnContext(search);
  return ctx?.returnTo ?? null;
}

/**
 * Limpa o contexto persistido no sessionStorage. Deve ser chamado
 * após o caller consumir o contexto (ex: depois de navegar pro
 * destino final). A URL é "limpa" naturalmente pela próxima navegação.
 */
export function clearReturnContext(): void {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Sem storage acessível, não há nada a limpar.
  }
}
