import { useEffect, useRef, useState } from "react";

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
  const ref = useRef<HTMLDivElement>(null);

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

  const move = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(2, Math.min(98, p)));
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-3xl select-none touch-none ${className}`}
      onPointerDown={(e) => { setDragging(true); move(e.clientX); }}
      onPointerMove={(e) => dragging && move(e.clientX)}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <img src={after} alt={alt} className="block w-full h-full object-cover" loading={priority ? "eager" : "lazy"} />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={before} alt="" className="block h-full w-auto max-w-none object-cover" style={{ width: `${10000 / pos}%` }} loading={priority ? "eager" : "lazy"} />
      </div>
      <div className="pointer-events-none absolute top-3 left-3 rounded-full bg-black/60 text-white text-[10px] font-medium tracking-widest uppercase px-2.5 py-1 backdrop-blur">Antes</div>
      <div className="pointer-events-none absolute top-3 right-3 rounded-full bg-accent text-accent-foreground text-[10px] font-medium tracking-widest uppercase px-2.5 py-1">Depois</div>
      <div
        className="absolute top-0 bottom-0 w-px bg-white shadow-[0_0_20px_rgba(255,255,255,0.6)]"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-white shadow-xl flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-foreground"><path fill="currentColor" d="M8 7l-5 5 5 5V7zm8 0v10l5-5-5-5z"/></svg>
        </div>
      </div>
    </div>
  );
}