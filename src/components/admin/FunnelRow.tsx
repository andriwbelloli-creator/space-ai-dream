/**
 * Linha de funil — barra horizontal mostrando contagem vs baseline.
 * Usada em /admin/insights e /admin (Visão Geral). Pct = count / baseline.
 */
export type FunnelStep = {
  event: string;
  label: string;
  count: number;
};

export function FunnelRow({ step, baseline }: { step: FunnelStep; baseline: number }) {
  const pct = baseline > 0 ? Math.min(100, Math.round((step.count / baseline) * 100)) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="w-28 shrink-0 text-xs text-muted-foreground truncate">{step.label}</div>
      <div className="flex-1 min-w-0">
        <div className="h-5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: pct > 0 ? `${Math.max(pct, 1)}%` : "0%" }}
          />
        </div>
      </div>
      <div className="w-10 shrink-0 text-right text-xs font-semibold">{pct}%</div>
      <div className="w-12 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
        {step.count.toLocaleString("pt-BR")}
      </div>
    </div>
  );
}
