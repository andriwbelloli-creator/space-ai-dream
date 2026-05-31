import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

type EditorialCard = {
  /** Imagem ilustrativa do card (lado esquerdo). */
  image: string;
  alt: string;
  /** Titulo serif grande (Moodboard / Materiais / Lista de compras). */
  title: string;
  /** Linhas auxiliares (cor swatches, mock table, etc) — opcional. */
  meta?: React.ReactNode;
  /** Destino do card. Default `/`. */
  to?: string;
};

type Props = {
  cards: EditorialCard[];
};

/**
 * Linha horizontal com 3 cards editoriais (imagem | titulo + meta + arrow).
 * Mockup: Moodboard / Materiais / Lista de compras. Reaproveitada pela home
 * e pelas landings SEO.
 */
export function EditorialCardsRow({ cards }: Props) {
  return (
    <section className="bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 pb-8 sm:px-6 md:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.to ?? "/"}
            className="group flex items-stretch overflow-hidden rounded-3xl border border-border/70 bg-card transition hover:shadow-[var(--shadow-editorial-md)]"
          >
            <div className="w-2/5 shrink-0 overflow-hidden bg-muted">
              <img
                src={card.image}
                alt={card.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-5">
              <h3 className="font-serif text-2xl leading-tight tracking-tight text-foreground">
                {card.title}
              </h3>
              <div className="mt-3 flex items-end justify-between gap-3">
                <div className="min-h-[2rem] flex-1 text-xs text-muted-foreground">
                  {card.meta}
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-foreground/70 transition group-hover:translate-x-1 group-hover:text-foreground" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
