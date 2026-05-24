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

const BUDGET_LABELS: Record<string, string> = {
  baixo: "Baixo",
  medio: "Médio",
  médio: "Médio",
  alto: "Alto",
};

export type AdminProjectSample = {
  id: string;
  styleSlug: string | null;
  roomType: string | null;
  category: string | null;
  budgetRange: string | null;
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
  topCategories: AdminRankedItem[];
  topBudgets: AdminRankedItem[];
  recent: AdminProjectSample[];
};

export type AdminProjectsResult =
  | { ok: true; projects: AdminProjects }
  | { ok: false; reason: "forbidden" | "error"; message?: string };

/**
 * Lista projetos com breakdown por estilo, ambiente, categoria e orçamento.
 * Os primeiros 30 da consulta também voltam como amostra pra tabela.
 * Read-only, sem PII.
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
          .select(
            "id, style_slug, category, budget_range, after_url, is_public, created_at, ai_response",
          )
          .order("created_at", { ascending: false })
          .limit(MAX_PROJECTS_INSIGHTS),
      ]);

      type ProjectRow = {
        id: string;
        style_slug: string | null;
        category: string | null;
        budget_range: string | null;
        after_url: string | null;
        is_public: boolean | null;
        created_at: string;
        ai_response: { roomType?: string } | null;
      };
      const projects = (listRes.data ?? []) as unknown[] as ProjectRow[];

      // Rankings (agregação JS — simples pro volume MVP).
      const styleCounts: Record<string, number> = {};
      const roomCounts: Record<string, number> = {};
      const categoryCounts: Record<string, number> = {};
      const budgetCounts: Record<string, number> = {};

      for (const p of projects) {
        if (p.style_slug) styleCounts[p.style_slug] = (styleCounts[p.style_slug] ?? 0) + 1;
        const room = (p.ai_response as { roomType?: string } | null)?.roomType;
        if (room) roomCounts[room] = (roomCounts[room] ?? 0) + 1;
        if (p.category) categoryCounts[p.category] = (categoryCounts[p.category] ?? 0) + 1;
        if (p.budget_range) budgetCounts[p.budget_range] = (budgetCounts[p.budget_range] ?? 0) + 1;
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
        category: p.category,
        budgetRange: p.budget_range,
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
          topCategories: rank(categoryCounts, {}),
          topBudgets: rank(budgetCounts, BUDGET_LABELS),
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
          displayName: p.display_name,
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
