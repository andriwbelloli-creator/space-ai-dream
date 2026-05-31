import { Link } from "@tanstack/react-router";
import { PLANS, formatPlanPrice } from "@/lib/plans";

/**
 * Bloco de planos do mockup: "Planos" em serif gigante a esquerda + 3 cards
 * (Essencial / Profissional [destaque com badge dourado MAIS ESCOLHIDO] /
 * Atelier) a direita. Le de `src/lib/plans.ts` sem alterar contrato.
 *
 * Pega 3 dos 4 planos disponiveis: Starter, Premium (highlight), Pro.
 * Renomeia visualmente sem mexer em IDs internos (que sao chave pra Stripe):
 *   Starter   -> Essencial
 *   Premium   -> Profissional
 *   Pro       -> Atelier
 */

const DISPLAY_NAMES: Record<string, { name: string; tagline: string }> = {
  starter: {
    name: "Essencial",
    tagline: "Para transformar um ambiente com praticidade.",
  },
  premium: {
    name: "Profissional",
    tagline: "Mais recursos, curadoria e orçamento detalhado.",
  },
  pro: {
    name: "Atelier",
    tagline: "Experiência completa com especialista dedicado.",
  },
};

export function PlansBlock() {
  // Pega Essencial/Profissional/Atelier nessa ordem visual exata do mockup.
  const featured = (["starter", "premium", "pro"] as const)
    .map((id) => PLANS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <section className="bg-background pb-20 pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:gap-10">
          {/* Coluna esquerda — título Planos + divider dourado */}
          <div className="lg:pt-6">
            <h2 className="font-serif text-5xl tracking-tight text-foreground lg:text-6xl">
              Planos
            </h2>
            <div className="mt-3 h-[2px] w-12 bg-[var(--gold-soft)]" />
          </div>

          {/* Coluna direita — 3 cards de planos */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {featured.map((plan) => {
              const display = DISPLAY_NAMES[plan.id] ?? { name: plan.name, tagline: plan.tagline };
              const isHighlight = Boolean(plan.highlight);
              return (
                <Link
                  key={plan.id}
                  to={plan.ctaHref}
                  className={[
                    "relative flex flex-col rounded-3xl border bg-card p-6 transition hover:-translate-y-1 hover:shadow-[var(--shadow-editorial-md)]",
                    isHighlight
                      ? "border-[var(--gold-soft)] ring-1 ring-[var(--gold-soft)]"
                      : "border-border/70",
                  ].join(" ")}
                >
                  {isHighlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--gold-soft)] px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--gold-foreground)]">
                      Mais escolhido
                    </div>
                  )}

                  <h3 className="font-serif text-2xl leading-tight tracking-tight text-foreground">
                    {display.name}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {display.tagline}
                  </p>

                  <div className="mt-8 flex items-baseline gap-1.5">
                    <span className="text-xs text-muted-foreground">R$</span>
                    <span className="font-serif text-5xl text-foreground">
                      {Math.round(plan.monthly)}
                    </span>
                    <span className="text-xs text-muted-foreground">/ambiente</span>
                  </div>
                  <div className="sr-only">{formatPlanPrice(plan.monthly)}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
