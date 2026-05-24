/**
 * Card de KPI usado em todas as telas admin. Aceita um subtítulo opcional
 * pra contexto extra (ex: "X nos últimos 7 dias"). Sem semântica de link —
 * apenas exibe um número formatado em pt-BR.
 */
export function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-accent/15 text-accent">
          {icon}
        </span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight">
        {value.toLocaleString("pt-BR")}
      </div>
      {sub && <div className="mt-0.5 text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  );
}
