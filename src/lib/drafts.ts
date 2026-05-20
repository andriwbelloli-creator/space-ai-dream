const KEY = "ideal_space_drafts_v1";
const MAX_DRAFTS = 6;
const MAX_VERSIONS = 8;

export type DraftStatus = "draft" | "generating" | "done";

export type DraftVersionResult = { url: string; style: string; styleName?: string; label?: string };

export type DraftVersion = {
  id: string;
  createdAt: number;
  style: string;
  styleName?: string;
  results: DraftVersionResult[];
  note?: string;
};

export type Draft = {
  id: string;
  createdAt: number;
  updatedAt: number;
  status: DraftStatus;
  style: string;
  styleName?: string;
  preview: string; // data URL of optimized source
  result?: string; // legacy: first/only generated result
  results?: DraftVersionResult[];
  meta?: { w: number; h: number; original: number; optimized: number };
  progress?: number;
  title?: string;
  versions?: DraftVersion[];
  activeVersionId?: string;
};

function safeParse(raw: string | null): Draft[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function listDrafts(): Draft[] {
  if (typeof window === "undefined") return [];
  try {
    return safeParse(window.localStorage.getItem(KEY))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

function writeAll(drafts: Draft[]) {
  try {
    // Trim oldest if over budget
    const sorted = [...drafts].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, MAX_DRAFTS);
    window.localStorage.setItem(KEY, JSON.stringify(sorted));
  } catch (e) {
    // Storage full — drop oldest and retry once
    try {
      const trimmed = [...drafts]
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .slice(0, Math.max(1, MAX_DRAFTS - 2));
      window.localStorage.setItem(KEY, JSON.stringify(trimmed));
    } catch {
      /* give up silently — drafts are best-effort */
    }
  }
}

export function upsertDraft(draft: Draft) {
  if (typeof window === "undefined") return;
  const all = listDrafts();
  const idx = all.findIndex((d) => d.id === draft.id);
  if (idx >= 0) all[idx] = draft;
  else all.unshift(draft);
  writeAll(all);
}

export function deleteDraft(id: string) {
  if (typeof window === "undefined") return;
  writeAll(listDrafts().filter((d) => d.id !== id));
}

export function newDraftId() {
  return `d_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function timeAgo(ts: number) {
  const s = Math.max(1, Math.round((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s atrás`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}min atrás`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h atrás`;
  const d = Math.round(h / 24);
  return `${d}d atrás`;
}