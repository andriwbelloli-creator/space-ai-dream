// Server functions isoladas do Admin — Lote 5 P0 (Admin Leads Dashboard).
// Reaproveita o padrão de verificação de admin já usado em
// src/lib/credits.functions.ts e src/lib/transform.functions.ts:
// consulta a tabela `user_roles` (role = "admin") com o client service-role.
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/** Linha de lead exposta ao dashboard admin (somente leitura). */
export type AdminLeadRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  plan_interest: string | null;
  room_type: string | null;
  interest: string | null;
  created_at: string;
};

/** Indicadores agregados exibidos nos cards do topo do dashboard. */
export type AdminLeadsKpis = {
  total: number;
  planPaid: number;
  b2b: number;
  last7days: number;
};

/** Resultado da leitura de leads — sucesso, sem permissão ou erro. */
export type AdminLeadsResult =
  | { ok: true; kpis: AdminLeadsKpis; rows: AdminLeadRow[] }
  | { ok: false; reason: "forbidden" | "error"; message?: string };

/** Perfis de lead considerados B2B (profissional), em oposição a "pessoal". */
const B2B_INTERESTS = ["designer", "arquiteto", "imobiliaria", "empresa"];
/** Planos pagos de interesse contabilizados no card "Pro / Premium". */
const PAID_PLANS = ["pro", "premium"];
/** Teto de leitura no P0 — evita varrer a tabela inteira sem paginação. */
const MAX_LEADS = 500;

/**
 * Verifica server-side se o usuário tem role "admin" na tabela `user_roles`.
 * Mesmo padrão de credits.functions.ts / transform.functions.ts.
 */
async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (error) {
      console.error("[admin] verificação de role falhou");
      return false;
    }
    return !!data;
  } catch {
    console.error("[admin] verificação de role lançou exceção");
    return false;
  }
}

/** Server function: informa se o usuário autenticado atual é admin. */
export const checkAdminAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ isAdmin: boolean }> => {
    return { isAdmin: await isUserAdmin(context.userId) };
  });

/**
 * Server function: retorna os leads + KPIs APENAS se o usuário for admin.
 * Não-admin recebe { ok: false, reason: "forbidden" } — nenhum dado trafega.
 * Leitura somente — nenhuma escrita/edição/exclusão.
 */
export const getAdminLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminLeadsResult> => {
    if (!(await isUserAdmin(context.userId))) {
      return { ok: false, reason: "forbidden" };
    }

    try {
      // O types.ts gerado está defasado para `leads` (faltam phone, interest,
      // plan_interest, room_type) — mesmo descompasso já tratado em
      // src/lib/leads.ts. O cast fica restrito a este ponto de leitura.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query = supabaseAdmin.from("leads") as any;
      const { data, error, count } = await query
        .select("id, name, email, phone, source, plan_interest, room_type, interest, created_at", {
          count: "exact",
        })
        .order("created_at", { ascending: false })
        .limit(MAX_LEADS);

      if (error) {
        console.error("[admin] getAdminLeads — query falhou:", error.message);
        return { ok: false, reason: "error", message: "Falha ao carregar os leads." };
      }

      const rows = (data ?? []) as AdminLeadRow[];
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

      const kpis: AdminLeadsKpis = {
        total: typeof count === "number" ? count : rows.length,
        planPaid: rows.filter(
          (r) => r.plan_interest && PAID_PLANS.includes(r.plan_interest.toLowerCase()),
        ).length,
        b2b: rows.filter((r) => r.interest && B2B_INTERESTS.includes(r.interest.toLowerCase()))
          .length,
        last7days: rows.filter((r) => {
          const t = new Date(r.created_at).getTime();
          return !Number.isNaN(t) && t >= sevenDaysAgo;
        }).length,
      };

      return { ok: true, kpis, rows };
    } catch (e) {
      console.error("[admin] getAdminLeads — exceção:", e);
      return { ok: false, reason: "error", message: "Erro inesperado ao carregar os leads." };
    }
  });

// ─── Insights / Funil ───────────────────────────────────────────────────────

const STYLE_LABELS_INSIGHTS: Record<string, string> = {
  japandi: "Japandi",
  modern: "Contemporâneo",
  contemporaneo: "Contemporâneo",
  minimal: "Minimalista",
  minimalista: "Minimalista",
  natural: "Natural",
  industrial: "Industrial",
  luxe: "Luxo discreto",
  escandinavo: "Escandinavo",
};

const ROOM_LABELS_INSIGHTS: Record<string, string> = {
  sala: "Sala",
  quarto: "Quarto",
  cozinha: "Cozinha",
  "home-office": "Home office",
  banheiro: "Banheiro",
  outro: "Outro",
};

const ADMIN_FUNNEL_STEPS: ReadonlyArray<{ event: string; label: string }> = [
  { event: "start_project", label: "Iniciou projeto" },
  { event: "image_uploaded", label: "Enviou foto" },
  { event: "image_generated", label: "Gerou imagem" },
  { event: "shopping_list_loaded", label: "Viu lista" },
  { event: "affiliate_click", label: "Clicou afiliado" },
  { event: "project_made_public", label: "Compartilhou" },
];

const MAX_EVENTS_INSIGHTS = 10_000;
const MAX_PROJECTS_INSIGHTS = 2_000;

export type AdminRankedItem = { slug: string; label: string; count: number };

export type AdminFunnelStep = {
  event: string;
  label: string;
  count: number;
  pct: number;
};

export type AdminInsights = {
  projectsTotal: number;
  projectsPublic: number;
  projectsLast7: number;
  topStyles: AdminRankedItem[];
  topRooms: AdminRankedItem[];
  funnel: AdminFunnelStep[];
  eventCounts: Array<{ event: string; count: number }>;
};

export type AdminInsightsResult =
  | { ok: true; leadsTotal: number; insights: AdminInsights }
  | { ok: false; reason: "forbidden" | "error"; message?: string };

/**
 * Agrega dados do funil de produto para o painel admin. Read-only.
 * Consulta em paralelo: events, projects e leads (count).
 *
 * Nota: a coluna real da tabela `events` é `event` (ver migration
 * 20260522120000_create_events.sql). O `types.ts` gerado está stale e
 * mostra `event_name`, mas a coluna no Postgres se chama `event` mesmo
 * — é por isso que `tracking.functions.ts` insere com a chave `event`.
 */
export const getAdminInsights = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminInsightsResult> => {
    if (!(await isUserAdmin(context.userId))) {
      return { ok: false, reason: "forbidden" };
    }

    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabaseAdmin as any;

      const [eventsRes, projectsRes, leadsRes] = await Promise.all([
        db
          .from("events")
          .select("event, props, created_at")
          .order("created_at", { ascending: false })
          .limit(MAX_EVENTS_INSIGHTS),
        db
          .from("projects")
          .select("id, style_slug, is_public, created_at, ai_response")
          .order("created_at", { ascending: false })
          .limit(MAX_PROJECTS_INSIGHTS),
        db.from("leads").select("id", { count: "exact", head: true }),
      ]);

      type RawEvent = Record<string, unknown>;
      const events: Array<{ event: string; props: Record<string, unknown> }> = (
        (eventsRes.data ?? []) as RawEvent[]
      ).map((row) => ({
        event: String(row["event"] ?? ""),
        props: (typeof row["props"] === "object" && row["props"] !== null
          ? row["props"]
          : {}) as Record<string, unknown>,
      }));

      type ProjectRow = {
        id: string;
        style_slug: string;
        is_public: boolean;
        created_at: string;
        ai_response: { roomType?: string } | null;
      };
      const projects = (projectsRes.data ?? []) as unknown[] as ProjectRow[];

      const leadsTotal: number = typeof leadsRes.count === "number" ? leadsRes.count : 0;

      // Contagem por tipo de evento
      const eventCountMap: Record<string, number> = {};
      for (const e of events) {
        if (e.event) eventCountMap[e.event] = (eventCountMap[e.event] ?? 0) + 1;
      }

      // Funil: cada step relativo ao primeiro (start_project = 100%)
      const baseline = eventCountMap["start_project"] ?? 0;
      const funnel: AdminFunnelStep[] = ADMIN_FUNNEL_STEPS.map((step) => {
        const count = eventCountMap[step.event] ?? 0;
        return {
          event: step.event,
          label: step.label,
          count,
          pct: baseline > 0 ? Math.round((count / baseline) * 100) : 0,
        };
      });

      // Top estilos (dos projetos)
      const styleCounts: Record<string, number> = {};
      for (const p of projects) {
        if (p.style_slug) styleCounts[p.style_slug] = (styleCounts[p.style_slug] ?? 0) + 1;
      }
      const topStyles: AdminRankedItem[] = Object.entries(styleCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([slug, count]) => ({ slug, label: STYLE_LABELS_INSIGHTS[slug] ?? slug, count }));

      // Top ambientes (de ai_response.roomType nos projetos)
      const roomCounts: Record<string, number> = {};
      for (const p of projects) {
        const ai = p.ai_response as { roomType?: string } | null;
        const room = ai?.roomType;
        if (room) roomCounts[room] = (roomCounts[room] ?? 0) + 1;
      }
      const topRooms: AdminRankedItem[] = Object.entries(roomCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([slug, count]) => ({ slug, label: ROOM_LABELS_INSIGHTS[slug] ?? slug, count }));

      return {
        ok: true,
        leadsTotal,
        insights: {
          projectsTotal: projects.length,
          projectsPublic: projects.filter((p) => p.is_public).length,
          projectsLast7: projects.filter((p) => p.created_at >= sevenDaysAgo).length,
          topStyles,
          topRooms,
          funnel,
          eventCounts: Object.entries(eventCountMap)
            .sort((a, b) => b[1] - a[1])
            .map(([event, count]) => ({ event, count })),
        },
      };
    } catch (e) {
      console.error("[admin] getAdminInsights — exceção:", e);
      return { ok: false, reason: "error", message: "Erro inesperado ao carregar os dados." };
    }
  });

// ─── Visão Geral / Overview ─────────────────────────────────────────────────

export type AdminOverviewTotals = {
  users: number;
  projects: number;
  projectsPublic: number;
  leads: number;
  activeSubs: number;
  events7d: number;
  affiliateClicks7d: number;
};

export type AdminOverview = {
  totals: AdminOverviewTotals;
  funnel: AdminFunnelStep[];
  topStyles: AdminRankedItem[];
  topRooms: AdminRankedItem[];
};

export type AdminOverviewResult =
  | { ok: true; overview: AdminOverview }
  | { ok: false; reason: "forbidden" | "error"; message?: string };

/**
 * Visão geral do produto pro painel raiz `/admin`. Agrega contagens das
 * principais tabelas em paralelo. Read-only, gateado por admin.
 *
 * Counts via `head: true, count: "exact"` — não traz linhas, só o número.
 * Mais eficiente que `getAdminInsights` que pulla dados pra ranking.
 */
export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminOverviewResult> => {
    if (!(await isUserAdmin(context.userId))) {
      return { ok: false, reason: "forbidden" };
    }

    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabaseAdmin as any;

      const [
        usersRes,
        projectsTotalRes,
        projectsPublicRes,
        leadsRes,
        activeSubsRes,
        events7dRes,
        affiliateClicks7dRes,
        eventsForFunnelRes,
        projectsForRankingRes,
      ] = await Promise.all([
        db.from("profiles").select("id", { count: "exact", head: true }),
        db.from("projects").select("id", { count: "exact", head: true }),
        db.from("projects").select("id", { count: "exact", head: true }).eq("is_public", true),
        db.from("leads").select("id", { count: "exact", head: true }),
        db
          .from("stripe_subscriptions")
          .select("id", { count: "exact", head: true })
          .eq("status", "active"),
        db
          .from("events")
          .select("id", { count: "exact", head: true })
          .gte("created_at", sevenDaysAgo),
        db
          .from("events")
          .select("id", { count: "exact", head: true })
          .eq("event", "affiliate_click")
          .gte("created_at", sevenDaysAgo),
        // Eventos do funil — limitamos a 7d pra deixar a Visão Geral viva.
        db
          .from("events")
          .select("event")
          .gte("created_at", sevenDaysAgo)
          .limit(MAX_EVENTS_INSIGHTS),
        // Projetos pra ranking de top styles/rooms (todos, cap em 2k).
        db
          .from("projects")
          .select("style_slug, ai_response")
          .order("created_at", { ascending: false })
          .limit(MAX_PROJECTS_INSIGHTS),
      ]);

      const totals: AdminOverviewTotals = {
        users: usersRes.count ?? 0,
        projects: projectsTotalRes.count ?? 0,
        projectsPublic: projectsPublicRes.count ?? 0,
        leads: leadsRes.count ?? 0,
        activeSubs: activeSubsRes.count ?? 0,
        events7d: events7dRes.count ?? 0,
        affiliateClicks7d: affiliateClicks7dRes.count ?? 0,
      };

      // Funil compacto pros eventos das últimas 7d
      type RawEvent = { event: string | null };
      const events = (eventsForFunnelRes.data ?? []) as RawEvent[];
      const eventCountMap: Record<string, number> = {};
      for (const e of events) {
        if (e.event) eventCountMap[e.event] = (eventCountMap[e.event] ?? 0) + 1;
      }
      const baseline = eventCountMap["start_project"] ?? 0;
      const funnel: AdminFunnelStep[] = ADMIN_FUNNEL_STEPS.map((step) => {
        const count = eventCountMap[step.event] ?? 0;
        return {
          event: step.event,
          label: step.label,
          count,
          pct: baseline > 0 ? Math.round((count / baseline) * 100) : 0,
        };
      });

      // Top estilos + ambientes
      type ProjectRow = { style_slug: string | null; ai_response: { roomType?: string } | null };
      const projects = (projectsForRankingRes.data ?? []) as unknown[] as ProjectRow[];

      const styleCounts: Record<string, number> = {};
      for (const p of projects) {
        if (p.style_slug) styleCounts[p.style_slug] = (styleCounts[p.style_slug] ?? 0) + 1;
      }
      const topStyles: AdminRankedItem[] = Object.entries(styleCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([slug, count]) => ({ slug, label: STYLE_LABELS_INSIGHTS[slug] ?? slug, count }));

      const roomCounts: Record<string, number> = {};
      for (const p of projects) {
        const ai = p.ai_response as { roomType?: string } | null;
        const room = ai?.roomType;
        if (room) roomCounts[room] = (roomCounts[room] ?? 0) + 1;
      }
      const topRooms: AdminRankedItem[] = Object.entries(roomCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([slug, count]) => ({ slug, label: ROOM_LABELS_INSIGHTS[slug] ?? slug, count }));

      return {
        ok: true,
        overview: { totals, funnel, topStyles, topRooms },
      };
    } catch (e) {
      console.error("[admin] getAdminOverview — exceção:", e);
      return { ok: false, reason: "error", message: "Erro inesperado ao carregar a visão geral." };
    }
  });

// ─── Projetos ───────────────────────────────────────────────────────────────
//
// A tabela `projects` NÃO possui `category` nem `budget_range` — essas duas
// dimensões vivem em `analyses` (que é outro modelo conceitual). Não tentamos
// agregá-las aqui pra não fazer query em coluna inexistente.

export type AdminProjectSample = {
  id: string;
  styleSlug: string | null;
  roomType: string | null;
  afterUrl: string | null;
  isPublic: boolean;
  createdAt: string;
};

export type AdminProjects = {
  total: number;
  totalPublic: number;
  totalLast7: number;
  uniqueStyles: number;
  topStyles: AdminRankedItem[];
  topRooms: AdminRankedItem[];
  recent: AdminProjectSample[];
};

export type AdminProjectsResult =
  | { ok: true; projects: AdminProjects }
  | { ok: false; reason: "forbidden" | "error"; message?: string };

/**
 * Lista projetos com breakdown por estilo e ambiente. Os primeiros 30 voltam
 * como amostra pra tabela. Read-only, sem PII.
 */
export const getAdminProjects = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminProjectsResult> => {
    if (!(await isUserAdmin(context.userId))) {
      return { ok: false, reason: "forbidden" };
    }

    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabaseAdmin as any;

      const [totalRes, publicRes, last7Res, listRes] = await Promise.all([
        db.from("projects").select("id", { count: "exact", head: true }),
        db.from("projects").select("id", { count: "exact", head: true }).eq("is_public", true),
        db
          .from("projects")
          .select("id", { count: "exact", head: true })
          .gte("created_at", sevenDaysAgo),
        db
          .from("projects")
          .select("id, style_slug, after_url, is_public, created_at, ai_response")
          .order("created_at", { ascending: false })
          .limit(MAX_PROJECTS_INSIGHTS),
      ]);

      type ProjectRow = {
        id: string;
        style_slug: string | null;
        after_url: string | null;
        is_public: boolean | null;
        created_at: string;
        ai_response: { roomType?: string } | null;
      };
      const projects = (listRes.data ?? []) as unknown[] as ProjectRow[];

      const styleCounts: Record<string, number> = {};
      const roomCounts: Record<string, number> = {};

      for (const p of projects) {
        if (p.style_slug) styleCounts[p.style_slug] = (styleCounts[p.style_slug] ?? 0) + 1;
        const room = (p.ai_response as { roomType?: string } | null)?.roomType;
        if (room) roomCounts[room] = (roomCounts[room] ?? 0) + 1;
      }

      const rank = (
        counts: Record<string, number>,
        labels: Record<string, string>,
      ): AdminRankedItem[] =>
        Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([slug, count]) => ({ slug, label: labels[slug] ?? slug, count }));

      const recent: AdminProjectSample[] = projects.slice(0, 30).map((p) => ({
        id: p.id,
        styleSlug: p.style_slug,
        roomType: (p.ai_response as { roomType?: string } | null)?.roomType ?? null,
        afterUrl: p.after_url,
        isPublic: p.is_public === true,
        createdAt: p.created_at,
      }));

      return {
        ok: true,
        projects: {
          total: totalRes.count ?? 0,
          totalPublic: publicRes.count ?? 0,
          totalLast7: last7Res.count ?? 0,
          uniqueStyles: Object.keys(styleCounts).length,
          topStyles: rank(styleCounts, STYLE_LABELS_INSIGHTS),
          topRooms: rank(roomCounts, ROOM_LABELS_INSIGHTS),
          recent,
        },
      };
    } catch (e) {
      console.error("[admin] getAdminProjects — exceção:", e);
      return { ok: false, reason: "error", message: "Erro inesperado ao carregar os projetos." };
    }
  });

// ─── Usuários ───────────────────────────────────────────────────────────────

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  premium: "Premium",
};

const EMAIL_LIKE_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Quando a Supabase Auth não recebe `full_name` do OAuth, ela grava o e-mail
 * em `profiles.display_name`. Esta função evita vazar e-mail nas telas que
 * prometem "sem PII" — retorna null se o valor parece um e-mail, deixando
 * a UI cair no fallback "Sem nome".
 */
function maskEmailLikeName(name: string | null): string | null {
  if (!name) return null;
  const trimmed = name.trim();
  if (!trimmed) return null;
  if (EMAIL_LIKE_RE.test(trimmed)) return null;
  return trimmed;
}

export type AdminUserRow = {
  id: string;
  displayName: string | null;
  plan: string | null;
  credits: number | null;
  projectCount: number;
  createdAt: string;
};

export type AdminUsers = {
  total: number;
  newLast7: number;
  activeLast7: number;
  paid: number;
  planBreakdown: AdminRankedItem[];
  topByProjects: AdminUserRow[];
};

export type AdminUsersResult =
  | { ok: true; users: AdminUsers }
  | { ok: false; reason: "forbidden" | "error"; message?: string };

/**
 * Distribuição de usuários por plano + top 20 por # projetos. Usa events
 * pra calcular ativos (distinct user_id em 7d). Não expõe email/phone.
 * `display_name` é texto público escolhido pelo próprio usuário.
 */
export const getAdminUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminUsersResult> => {
    if (!(await isUserAdmin(context.userId))) {
      return { ok: false, reason: "forbidden" };
    }

    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabaseAdmin as any;

      const [totalRes, newRes, paidRes, profilesRes, eventsRes, projectsRes] = await Promise.all([
        db.from("profiles").select("id", { count: "exact", head: true }),
        db
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .gte("created_at", sevenDaysAgo),
        db
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .in("plan", ["pro", "premium"]),
        db
          .from("profiles")
          .select("id, display_name, plan, credits, created_at")
          .order("created_at", { ascending: false })
          .limit(MAX_PROJECTS_INSIGHTS),
        db
          .from("events")
          .select("user_id")
          .gte("created_at", sevenDaysAgo)
          .not("user_id", "is", null)
          .limit(MAX_EVENTS_INSIGHTS),
        db.from("projects").select("user_id").limit(MAX_EVENTS_INSIGHTS),
      ]);

      type ProfileRow = {
        id: string;
        display_name: string | null;
        plan: string | null;
        credits: number | null;
        created_at: string;
      };
      const profiles = (profilesRes.data ?? []) as ProfileRow[];

      // Ativos = usuários distintos em events nos últimos 7d
      const activeIds = new Set<string>();
      for (const e of (eventsRes.data ?? []) as Array<{ user_id: string | null }>) {
        if (e.user_id) activeIds.add(e.user_id);
      }

      // Contagem de projetos por user_id
      const projectCounts: Record<string, number> = {};
      for (const p of (projectsRes.data ?? []) as Array<{ user_id: string | null }>) {
        if (p.user_id) projectCounts[p.user_id] = (projectCounts[p.user_id] ?? 0) + 1;
      }

      // Breakdown por plano (null → "free" pra normalizar a visualização)
      const planCounts: Record<string, number> = {};
      for (const p of profiles) {
        const plan = (p.plan ?? "free").toLowerCase();
        planCounts[plan] = (planCounts[plan] ?? 0) + 1;
      }
      const planBreakdown: AdminRankedItem[] = Object.entries(planCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([slug, count]) => ({ slug, label: PLAN_LABELS[slug] ?? slug, count }));

      // Top 20 por # projetos
      const topByProjects: AdminUserRow[] = profiles
        .map((p) => ({
          id: p.id,
          displayName: maskEmailLikeName(p.display_name),
          plan: p.plan,
          credits: p.credits,
          projectCount: projectCounts[p.id] ?? 0,
          createdAt: p.created_at,
        }))
        .filter((u) => u.projectCount > 0)
        .sort((a, b) => b.projectCount - a.projectCount)
        .slice(0, 20);

      return {
        ok: true,
        users: {
          total: totalRes.count ?? 0,
          newLast7: newRes.count ?? 0,
          activeLast7: activeIds.size,
          paid: paidRes.count ?? 0,
          planBreakdown,
          topByProjects,
        },
      };
    } catch (e) {
      console.error("[admin] getAdminUsers — exceção:", e);
      return { ok: false, reason: "error", message: "Erro inesperado ao carregar os usuários." };
    }
  });

// ─── Receita / Assinaturas ──────────────────────────────────────────────────

const SUBSCRIPTION_STATUS_LABELS: Record<string, string> = {
  active: "Ativa",
  canceled: "Cancelada",
  past_due: "Em atraso",
  trialing: "Trial",
  incomplete: "Incompleta",
  incomplete_expired: "Expirada",
  unpaid: "Não paga",
};

export type AdminSubscriptionRow = {
  id: string;
  status: string;
  priceId: string;
  productId: string;
  environment: string;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
  createdAt: string;
};

export type AdminRevenue = {
  total: number;
  active: number;
  canceledLast30: number;
  renewingNext30: number;
  byStatus: AdminRankedItem[];
  byPrice: AdminRankedItem[];
  byEnvironment: AdminRankedItem[];
  recent: AdminSubscriptionRow[];
};

export type AdminRevenueResult =
  | { ok: true; revenue: AdminRevenue }
  | { ok: false; reason: "forbidden" | "error"; message?: string };

/**
 * Read-only stripe_subscriptions. NÃO altera assinaturas, pricing nem checkout.
 * Apenas conta status, agrupa por price_id e environment, lista as 30 mais recentes.
 */
export const getAdminRevenue = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminRevenueResult> => {
    if (!(await isUserAdmin(context.userId))) {
      return { ok: false, reason: "forbidden" };
    }

    try {
      const now = Date.now();
      const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();
      const thirtyDaysAhead = new Date(now + 30 * 24 * 60 * 60 * 1000).toISOString();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabaseAdmin as any;

      const [totalRes, activeRes, canceledRes, renewingRes, listRes] = await Promise.all([
        db.from("stripe_subscriptions").select("id", { count: "exact", head: true }),
        db
          .from("stripe_subscriptions")
          .select("id", { count: "exact", head: true })
          .eq("status", "active"),
        db
          .from("stripe_subscriptions")
          .select("id", { count: "exact", head: true })
          .eq("status", "canceled")
          .gte("updated_at", thirtyDaysAgo),
        db
          .from("stripe_subscriptions")
          .select("id", { count: "exact", head: true })
          .eq("status", "active")
          .lte("current_period_end", thirtyDaysAhead)
          .gte("current_period_end", new Date(now).toISOString()),
        db
          .from("stripe_subscriptions")
          .select(
            "id, status, price_id, product_id, environment, cancel_at_period_end, current_period_end, created_at",
          )
          .order("created_at", { ascending: false })
          .limit(MAX_PROJECTS_INSIGHTS),
      ]);

      type SubRow = {
        id: string;
        status: string;
        price_id: string;
        product_id: string;
        environment: string;
        cancel_at_period_end: boolean;
        current_period_end: string | null;
        created_at: string;
      };
      const subs = (listRes.data ?? []) as unknown[] as SubRow[];

      const statusCounts: Record<string, number> = {};
      const priceCounts: Record<string, number> = {};
      const envCounts: Record<string, number> = {};

      for (const s of subs) {
        statusCounts[s.status] = (statusCounts[s.status] ?? 0) + 1;
        if (s.price_id) priceCounts[s.price_id] = (priceCounts[s.price_id] ?? 0) + 1;
        if (s.environment) envCounts[s.environment] = (envCounts[s.environment] ?? 0) + 1;
      }

      const recent: AdminSubscriptionRow[] = subs.slice(0, 30).map((s) => ({
        id: s.id,
        status: s.status,
        priceId: s.price_id,
        productId: s.product_id,
        environment: s.environment,
        cancelAtPeriodEnd: s.cancel_at_period_end,
        currentPeriodEnd: s.current_period_end,
        createdAt: s.created_at,
      }));

      return {
        ok: true,
        revenue: {
          total: totalRes.count ?? 0,
          active: activeRes.count ?? 0,
          canceledLast30: canceledRes.count ?? 0,
          renewingNext30: renewingRes.count ?? 0,
          byStatus: Object.entries(statusCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([slug, count]) => ({
              slug,
              label: SUBSCRIPTION_STATUS_LABELS[slug] ?? slug,
              count,
            })),
          byPrice: Object.entries(priceCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([slug, count]) => ({ slug, label: slug, count })),
          byEnvironment: Object.entries(envCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([slug, count]) => ({ slug, label: slug, count })),
          recent,
        },
      };
    } catch (e) {
      console.error("[admin] getAdminRevenue — exceção:", e);
      return { ok: false, reason: "error", message: "Erro inesperado ao carregar a receita." };
    }
  });

// ─── Créditos ───────────────────────────────────────────────────────────────

const CREDIT_KIND_LABELS: Record<string, string> = {
  signup_bonus: "Bônus de cadastro",
  generation: "Consumo (geração)",
  subscription_grant: "Crédito de assinatura",
  admin_adjust: "Ajuste admin",
  refund: "Reembolso",
};

export type AdminCreditTxRow = {
  id: string;
  amount: number;
  kind: string;
  reference: string | null;
  userId: string;
  userName: string | null;
  createdAt: string;
};

export type AdminCredits = {
  totalTx: number;
  creditsAdded: number;
  creditsConsumed: number;
  uniqueUsers: number;
  byKind: AdminRankedItem[];
  topConsumers: Array<{ userId: string; userName: string | null; consumed: number }>;
  recent: AdminCreditTxRow[];
};

export type AdminCreditsResult =
  | { ok: true; credits: AdminCredits }
  | { ok: false; reason: "forbidden" | "error"; message?: string };

/**
 * Read-only credit_transactions. Não cria nem altera transações.
 * Soma valores positivos (adições) e negativos (consumos) separadamente.
 */
export const getAdminCredits = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminCreditsResult> => {
    if (!(await isUserAdmin(context.userId))) {
      return { ok: false, reason: "forbidden" };
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabaseAdmin as any;

      const [totalRes, txRes, profilesRes] = await Promise.all([
        db.from("credit_transactions").select("id", { count: "exact", head: true }),
        db
          .from("credit_transactions")
          .select("id, amount, kind, reference, user_id, created_at")
          .order("created_at", { ascending: false })
          .limit(MAX_EVENTS_INSIGHTS),
        db.from("profiles").select("id, display_name").limit(MAX_PROJECTS_INSIGHTS),
      ]);

      type TxRow = {
        id: string;
        amount: number;
        kind: string;
        reference: string | null;
        user_id: string;
        created_at: string;
      };
      const txs = (txRes.data ?? []) as TxRow[];

      type ProfileRow = { id: string; display_name: string | null };
      const profileMap = new Map<string, string | null>();
      for (const p of (profilesRes.data ?? []) as ProfileRow[]) {
        profileMap.set(p.id, p.display_name);
      }

      let creditsAdded = 0;
      let creditsConsumed = 0;
      const kindCounts: Record<string, number> = {};
      const userConsumption: Record<string, number> = {};
      const uniqueUsers = new Set<string>();

      for (const t of txs) {
        if (t.amount > 0) creditsAdded += t.amount;
        else if (t.amount < 0) creditsConsumed += Math.abs(t.amount);
        kindCounts[t.kind] = (kindCounts[t.kind] ?? 0) + 1;
        uniqueUsers.add(t.user_id);
        if (t.amount < 0) {
          userConsumption[t.user_id] = (userConsumption[t.user_id] ?? 0) + Math.abs(t.amount);
        }
      }

      const topConsumers = Object.entries(userConsumption)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([userId, consumed]) => ({
          userId,
          userName: maskEmailLikeName(profileMap.get(userId) ?? null),
          consumed,
        }));

      const recent: AdminCreditTxRow[] = txs.slice(0, 30).map((t) => ({
        id: t.id,
        amount: t.amount,
        kind: t.kind,
        reference: t.reference,
        userId: t.user_id,
        userName: maskEmailLikeName(profileMap.get(t.user_id) ?? null),
        createdAt: t.created_at,
      }));

      return {
        ok: true,
        credits: {
          totalTx: totalRes.count ?? 0,
          creditsAdded,
          creditsConsumed,
          uniqueUsers: uniqueUsers.size,
          byKind: Object.entries(kindCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([slug, count]) => ({
              slug,
              label: CREDIT_KIND_LABELS[slug] ?? slug,
              count,
            })),
          topConsumers,
          recent,
        },
      };
    } catch (e) {
      console.error("[admin] getAdminCredits — exceção:", e);
      return { ok: false, reason: "error", message: "Erro inesperado ao carregar os créditos." };
    }
  });

// ─── Afiliados ──────────────────────────────────────────────────────────────

export type AdminAffiliateProduct = {
  name: string;
  category: string | null;
  count: number;
  lastUrl: string | null;
};

export type AdminWishlistProduct = {
  name: string;
  count: number;
  avgPriceCents: number | null;
  lastUrl: string | null;
};

export type AdminAffiliateClickRow = {
  id: string;
  productName: string | null;
  productCategory: string | null;
  productUrl: string | null;
  clickedAt: string;
};

export type AdminAffiliates = {
  totalClicks: number;
  clicks7d: number;
  affiliateClickEvents7d: number;
  wishlistItems: number;
  topClicked: AdminAffiliateProduct[];
  topWishlisted: AdminWishlistProduct[];
  recent: AdminAffiliateClickRow[];
};

export type AdminAffiliatesResult =
  | { ok: true; affiliates: AdminAffiliates }
  | { ok: false; reason: "forbidden" | "error"; message?: string };

/**
 * Performance de afiliados. Combina product_clicks (tabela dedicada) com
 * events.event="affiliate_click" (tracking de funil). Wishlist como sinal
 * de demanda. Read-only.
 */
export const getAdminAffiliates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminAffiliatesResult> => {
    if (!(await isUserAdmin(context.userId))) {
      return { ok: false, reason: "forbidden" };
    }

    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabaseAdmin as any;

      const [
        totalClicksRes,
        clicks7dRes,
        affEvents7dRes,
        wishlistTotalRes,
        clicksListRes,
        wishlistListRes,
      ] = await Promise.all([
        db.from("product_clicks").select("id", { count: "exact", head: true }),
        db
          .from("product_clicks")
          .select("id", { count: "exact", head: true })
          .gte("clicked_at", sevenDaysAgo),
        db
          .from("events")
          .select("id", { count: "exact", head: true })
          .eq("event", "affiliate_click")
          .gte("created_at", sevenDaysAgo),
        db.from("wishlist").select("id", { count: "exact", head: true }),
        db
          .from("product_clicks")
          .select("id, product_name, product_category, product_url, clicked_at")
          .order("clicked_at", { ascending: false })
          .limit(MAX_EVENTS_INSIGHTS),
        db
          .from("wishlist")
          .select("product_name, product_url, price_cents")
          .limit(MAX_EVENTS_INSIGHTS),
      ]);

      type ClickRow = {
        id: string;
        product_name: string | null;
        product_category: string | null;
        product_url: string | null;
        clicked_at: string;
      };
      const clicks = (clicksListRes.data ?? []) as ClickRow[];

      // Agrupa cliques por produto
      const productAgg: Record<
        string,
        { count: number; category: string | null; lastUrl: string | null }
      > = {};
      for (const c of clicks) {
        const key = c.product_name?.trim();
        if (!key) continue;
        if (!productAgg[key]) {
          productAgg[key] = { count: 0, category: c.product_category, lastUrl: c.product_url };
        }
        productAgg[key].count += 1;
      }
      const topClicked: AdminAffiliateProduct[] = Object.entries(productAgg)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 10)
        .map(([name, v]) => ({ name, category: v.category, count: v.count, lastUrl: v.lastUrl }));

      // Wishlist por produto
      type WishRow = {
        product_name: string;
        product_url: string | null;
        price_cents: number | null;
      };
      const wishlist = (wishlistListRes.data ?? []) as WishRow[];
      const wishAgg: Record<
        string,
        { count: number; sumPrice: number; pricedCount: number; lastUrl: string | null }
      > = {};
      for (const w of wishlist) {
        const key = w.product_name?.trim();
        if (!key) continue;
        if (!wishAgg[key]) {
          wishAgg[key] = { count: 0, sumPrice: 0, pricedCount: 0, lastUrl: w.product_url };
        }
        wishAgg[key].count += 1;
        if (w.price_cents) {
          wishAgg[key].sumPrice += w.price_cents;
          wishAgg[key].pricedCount += 1;
        }
      }
      const topWishlisted: AdminWishlistProduct[] = Object.entries(wishAgg)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 10)
        .map(([name, v]) => ({
          name,
          count: v.count,
          avgPriceCents: v.pricedCount > 0 ? Math.round(v.sumPrice / v.pricedCount) : null,
          lastUrl: v.lastUrl,
        }));

      const recent: AdminAffiliateClickRow[] = clicks.slice(0, 30).map((c) => ({
        id: c.id,
        productName: c.product_name,
        productCategory: c.product_category,
        productUrl: c.product_url,
        clickedAt: c.clicked_at,
      }));

      return {
        ok: true,
        affiliates: {
          totalClicks: totalClicksRes.count ?? 0,
          clicks7d: clicks7dRes.count ?? 0,
          affiliateClickEvents7d: affEvents7dRes.count ?? 0,
          wishlistItems: wishlistTotalRes.count ?? 0,
          topClicked,
          topWishlisted,
          recent,
        },
      };
    } catch (e) {
      console.error("[admin] getAdminAffiliates — exceção:", e);
      return { ok: false, reason: "error", message: "Erro inesperado ao carregar os afiliados." };
    }
  });
