export function ShoppingSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="mt-3 -mx-1">
      {/* Header shimmer */}
      <div className="flex items-center gap-2 px-1 py-2">
        <div
          className="h-5 w-5 shrink-0 rounded-full border-[3px] border-accent/30 border-t-accent animate-spin"
          style={{ animationDuration: "0.8s" }}
        />
        <div className="h-3 w-40 rounded bg-muted/70 is-shimmer" />
      </div>

      <ul className="divide-y divide-border/60">
        {Array.from({ length: count }).map((_, i) => (
          <li key={`sk_${i}`} className="px-1 py-2.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-center gap-1.5">
                  <div className="h-5 w-16 rounded-full bg-accent/15 is-shimmer" />
                  <div className="h-4 w-2/3 rounded bg-muted/70 is-shimmer" />
                </div>
                <div className="h-3 w-1/3 rounded bg-muted/50 is-shimmer" />
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <div className="h-3.5 w-14 rounded bg-muted/70 is-shimmer" />
                <div className="h-3 w-16 rounded bg-accent/15 is-shimmer" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
