/**
 * Cabeçalho editorial padrão da home — kicker bronze + h2 serif com
 * keyword italic em var(--gold-soft) + hairline divider de 16px.
 * Fonte única da verdade do ritmo editorial; testado via stories.
 */
import type React from "react";

export interface SectionHeadProps {
  kicker: string;
  title: React.ReactNode;
  sub?: string;
  /** Centraliza divider e parágrafo (usado em seções com text-center). */
  centered?: boolean;
}

export function SectionHead({ kicker, title, sub, centered = false }: SectionHeadProps) {
  return (
    <div className={centered ? "max-w-2xl mx-auto text-center" : "max-w-2xl"}>
      <span className="is-kicker">{kicker}</span>
      <h2 className="mt-3 font-serif text-3xl leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl">
        {title}
      </h2>
      <span
        aria-hidden
        data-testid="section-hairline"
        className={`mt-5 block h-px w-16 bg-[color:var(--gold-soft)]/60 ${centered ? "mx-auto" : ""}`}
      />
      {sub && (
        <p className={`mt-4 text-muted-foreground ${centered ? "max-w-xl mx-auto" : "max-w-xl"}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

export default SectionHead;