type Props = { className?: string; mark?: boolean };

export function IdealSpaceLogo({ className = "", mark = false }: Props) {
  if (mark) {
    return (
      <svg viewBox="0 0 40 40" className={className} aria-label="Ideal Space">
        <defs>
          <linearGradient id="isg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="currentColor" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="34" height="34" rx="9" fill="none" stroke="url(#isg)" strokeWidth="1.6" />
        <path d="M13 27V14h2v13h-2zm6 0V14h7c2.8 0 4.8 1.7 4.8 4.1 0 1.8-1 3.1-2.6 3.6 1.8.4 2.9 1.7 2.9 3.7 0 2.6-2 4.3-5.1 4.3H19zm2-7.6h4.6c1.6 0 2.6-.9 2.6-2.3s-1-2.3-2.6-2.3H21v4.6zm0 6h5c1.7 0 2.8-1 2.8-2.5s-1.1-2.4-2.8-2.4H21V25.4z"
              fill="currentColor" />
        <circle cx="32" cy="9" r="1.8" fill="currentColor" />
      </svg>
    );
  }
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-8 w-8 text-foreground">
        <rect x="3" y="3" width="34" height="34" rx="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M13 27V14h2v13h-2zm6 0V14h7c2.8 0 4.8 1.7 4.8 4.1 0 1.8-1 3.1-2.6 3.6 1.8.4 2.9 1.7 2.9 3.7 0 2.6-2 4.3-5.1 4.3H19zm2-7.6h4.6c1.6 0 2.6-.9 2.6-2.3s-1-2.3-2.6-2.3H21v4.6zm0 6h5c1.7 0 2.8-1 2.8-2.5s-1.1-2.4-2.8-2.4H21V25.4z"
              fill="currentColor" />
        <circle cx="32" cy="9" r="1.8" fill="var(--accent)" />
      </svg>
      <div className="leading-none">
        <div className="font-semibold tracking-tight text-foreground text-[15px]">
          Ideal<span className="text-accent">.</span>Space
        </div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-0.5">
          AI Interior Studio
        </div>
      </div>
    </div>
  );
}