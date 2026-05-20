import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

type Props = {
  before: string;
  after: string;
  alt?: string;
  auto?: boolean;
  className?: string;
  priority?: boolean;
};

export function BeforeAfter({ before, after, alt = "", auto = false, className = "", priority }: Props) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!auto) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const e = (t - start) / 4000;
      setPos(50 + Math.sin(e * Math.PI) * 18);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [auto]);

  const clamp = (n: number) => Math.max(2, Math.min(98, n));
  const move = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setPos(clamp(((clientX - r.left) / r.width) * 100));
  };

  const bump = (delta: number) => setPos((p) => clamp(p + delta));

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (auto) return;
    const big = e.shiftKey ? 10 : 1;
    switch (e.key) {
      case "ArrowLeft":  e.preventDefault(); bump(-big); break;
      case "ArrowRight": e.preventDefault(); bump(+big); break;
      case "Home":       e.preventDefault(); setPos(2); break;
      case "End":        e.preventDefault(); setPos(98); break;
      case " ":
      case "Enter":      e.preventDefault(); setPos(50); break;
      default:
        if (e.key >= "0" && e.key <= "9") {
          e.preventDefault();
          const n = parseInt(e.key, 10);
          setPos(n === 0 ? 50 : clamp(n * 10));
        }
    }
  };

  const reset = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPos(50);
    handleRef.current?.focus();
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-3xl select-none touch-none ${className}`}
      onPointerDown={(e) => { setDragging(true); move(e.clientX); }}
      onPointerMove={(e) => dragging && move(e.clientX)}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
      onDoubleClick={() => setPos(50)}
    >
      <img src={after} alt={alt} className="block w-full h-full object-cover" loading={priority ? "eager" : "lazy"} />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={before} alt="" className="block h-full w-auto max-w-none object-cover" style={{ width: `${10000 / pos}%` }} loading={priority ? "eager" : "lazy"} />
      </div>
      <div className="pointer-events-none absolute top-3 left-3 rounded-full bg-black/60 text-white text-[10px] font-medium tracking-widest uppercase px-2.5 py-1 backdrop-blur">Antes</div>
      <div className="pointer-events-none absolute top-3 right-3 rounded-full bg-accent text-accent-foreground text-[10px] font-medium tracking-widest uppercase px-2.5 py-1">Depois</div>

      {/* Divider + draggable/keyboard handle */}
      <div
        className="absolute top-0 bottom-0 w-px bg-white shadow-[0_0_20px_rgba(255,255,255,0.6)] pointer-events-none"
        style={{ left: `${pos}%` }}
      >
        <button
          ref={handleRef}
          type="button"
          role="slider"
          aria-label="Comparar antes e depois"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(pos)}% antes`}
          tabIndex={auto ? -1 : 0}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onPointerDown={(e) => e.stopPropagation()}
          className={`pointer-events-auto absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-white shadow-xl flex items-center justify-center cursor-ew-resize outline-none transition ${
            focused ? "ring-2 ring-accent ring-offset-2 ring-offset-background" : ""
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-foreground"><path fill="currentColor" d="M8 7l-5 5 5 5V7zm8 0v10l5-5-5-5z"/></svg>
        </button>
      </div>

      {/* Bottom progress track with snap markers + reset */}
      {!auto && (
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 z-10">
          <div
            className="relative flex-1 h-1.5 rounded-full bg-white/30 backdrop-blur cursor-pointer pointer-events-auto"
            onPointerDown={(e) => { e.stopPropagation(); setDragging(true); move(e.clientX); }}
            onPointerMove={(e) => dragging && move(e.clientX)}
            onPointerUp={(e) => { e.stopPropagation(); setDragging(false); }}
          >
            {[25, 50, 75].map((m) => (
              <span
                key={m}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-2 w-px bg-white/60"
                style={{ left: `${m}%` }}
              />
            ))}
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white"
              style={{ width: `${pos}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-white shadow"
              style={{ left: `${pos}%` }}
            />
          </div>
          <span className="text-[10px] font-medium text-white tabular-nums w-9 text-right drop-shadow">
            {Math.round(pos)}%
          </span>
          <button
            type="button"
            onClick={reset}
            aria-label="Centralizar comparação"
            className="pointer-events-auto h-7 w-7 rounded-full bg-white/85 backdrop-blur grid place-items-center hover:bg-white text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}