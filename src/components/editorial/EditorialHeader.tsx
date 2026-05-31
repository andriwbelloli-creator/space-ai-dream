import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

/**
 * Header padrao do novo layout editorial creme. Usado na home,
 * landings SEO (/estilos, /ambientes) e landings profissionais
 * (/para-arquitetos etc.) pra manter identidade unica.
 *
 * Estrutura: logo serif a esquerda, navegacao centralizada,
 * CTA terracota a direita. Variantes minimas: `ctaTo` permite
 * trocar destino do botao por landing.
 */
type Props = {
  /** Rota destino do CTA principal. Default `/`. */
  ctaTo?: string;
  /** Texto do CTA. Default `Criar ambiente`. */
  ctaLabel?: string;
  /** Callback opcional para abrir modal em vez de navegar. */
  onCtaClick?: () => void;
};

export function EditorialHeader({
  ctaTo = "/",
  ctaLabel = "Criar ambiente",
  onCtaClick,
}: Props) {
  const cta = onCtaClick ? (
    <Button
      onClick={onCtaClick}
      className="h-10 rounded-full bg-accent px-5 text-sm text-accent-foreground hover:opacity-95"
    >
      {ctaLabel}
    </Button>
  ) : (
    <Link
      to={ctaTo}
      className="inline-flex h-10 items-center rounded-full bg-accent px-5 text-sm font-medium text-accent-foreground hover:opacity-95"
    >
      {ctaLabel}
    </Link>
  );

  return (
    <header className="bg-background">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="font-serif text-2xl tracking-tight text-foreground">
          Ideal Space
        </Link>

        <nav className="hidden items-center gap-10 text-sm text-foreground/80 md:flex">
          <a href="/#como-funciona" className="hover:text-foreground transition">
            Como funciona
          </a>
          <a href="/#cards-editoriais" className="hover:text-foreground transition">
            Projetos
          </a>
          <Link to="/pricing" className="hover:text-foreground transition">
            Planos
          </Link>
          <Link to="/login" className="hover:text-foreground transition">
            Entrar
          </Link>
        </nav>

        {cta}
      </div>
    </header>
  );
}
