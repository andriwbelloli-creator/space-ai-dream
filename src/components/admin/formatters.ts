/** Formata um campo opcional — vazio/nulo vira travessão. */
export function cell(value: string | null | undefined): string {
  const v = value?.trim();
  return v ? v : "—";
}

/** Formata uma data ISO em pt-BR (data + hora curtas). */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

/** Formata apenas a data (sem hora) em pt-BR curto. */
export function formatDateOnly(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-BR");
}
