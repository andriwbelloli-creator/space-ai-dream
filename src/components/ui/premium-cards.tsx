import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

/**
 * Premium card library — variantes editoriais reutilizáveis pra construir grids
 * com ritmo: hero grande, vertical premium, horizontal, compacto, com overlay,
 * coleção curada e destaque editorial.
 *
 * Regras:
 * - Aspect ratio é controlado por prop, evita CLS.
 * - Imagens ficam dentro de um wrapper .is-image-zoom-host, com .is-image-zoom
 *   no <img> pra hover scale via CSS.
 * - Hover lift via .is-hover-lift no card root.
 * - Sem libs novas, só Tailwind + tokens já registrados em src/styles.css.
 */

type CardAspect = "square" | "video" | "portrait" | "wide" | "tall";

const aspectClass: Record<CardAspect, string> = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  wide: "aspect-[16/9]",
  tall: "aspect-[4/5]",
};

type CtaProps = {
  ctaLabel?: string;
  to?: string;
  href?: string;
  onClick?: () => void;
};

function CardCta({
  ctaLabel,
  to,
  href,
  onClick,
  variant = "link",
  className,
  asVisualOnly = false,
}: CtaProps & {
  variant?: "link" | "ghost-light";
  className?: string;
  /**
   * Quando true, renderiza um <span> ao invés de <a>/<button>. Use isso
   * quando o card-pai já é clicável (Link/anchor/button) pra evitar
   * anchor-em-anchor (hydration error) e button-em-button.
   */
  asVisualOnly?: boolean;
}) {
  if (!ctaLabel) return null;
  const base = cn(
    "inline-flex items-center gap-1.5 text-sm font-medium transition-colors",
    variant === "link" && "text-foreground group-hover:text-accent",
    variant === "ghost-light" && "text-white/95 group-hover:text-white",
    className,
  );
  const content = (
    <>
      {ctaLabel}
      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
    </>
  );
  if (asVisualOnly) {
    return <span className={base}>{content}</span>;
  }
  if (to) {
    return (
      <Link to={to} className={base}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={base}>
        {content}
      </a>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={base}>
        {content}
      </button>
    );
  }
  return null;
}

/* ------------ Image helper ------------ */

type ImageProps = {
  src: string;
  alt: string;
  aspect?: CardAspect;
  className?: string;
};

function CardImage({ src, alt, aspect = "video", className }: ImageProps) {
  return (
    <div
      className={cn(
        "is-image-zoom-host relative w-full overflow-hidden bg-muted",
        aspectClass[aspect],
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="is-image-zoom absolute inset-0 size-full object-cover"
      />
    </div>
  );
}

/* ------------ Tag ------------ */

type CardTag = { label: string; tone?: "neutral" | "gold" | "accent" };

function CardTagPill({ tag, light = false }: { tag: CardTag; light?: boolean }) {
  const tone = tag.tone ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
        light && tone === "neutral" && "bg-white/15 text-white backdrop-blur-sm",
        !light && tone === "neutral" && "bg-secondary text-secondary-foreground",
        tone === "gold" && "bg-[color:var(--gold-soft)]/15 text-[color:var(--gold-soft)]",
        tone === "accent" && "bg-accent/10 text-accent",
      )}
    >
      {tag.label}
    </span>
  );
}

/* ============================================================
 * 1) PremiumOverlayCard — imagem em destaque + texto sobre gradiente.
 *    Bom pra estilos, ambientes, coleções premium na home.
 * ============================================================ */

export type PremiumOverlayCardProps = CtaProps & {
  src: string;
  alt: string;
  title: React.ReactNode;
  kicker?: string;
  description?: string;
  tags?: CardTag[];
  aspect?: CardAspect;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export function PremiumOverlayCard({
  src,
  alt,
  title,
  kicker,
  description,
  tags,
  aspect = "tall",
  className,
  size = "md",
  ctaLabel,
  to,
  href,
  onClick,
}: PremiumOverlayCardProps) {
  const Wrapper: React.ElementType = to || href || onClick ? (onClick ? "button" : "a") : "div";
  const wrapperProps: React.HTMLAttributes<HTMLElement> & {
    href?: string;
    to?: string;
    type?: "button";
  } = to
    ? {} // handled by Link wrapper below
    : href
      ? { href }
      : onClick
        ? { onClick, type: "button" }
        : {};

  const content = (
    <div
      className={cn(
        "group is-hover-lift is-image-zoom-host is-gradient-overlay-b relative isolate flex h-full flex-col justify-end overflow-hidden rounded-2xl bg-foreground text-white",
        aspectClass[aspect],
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="is-image-zoom absolute inset-0 -z-10 size-full object-cover"
      />
      <div
        className={cn(
          "relative z-10 flex flex-col gap-2",
          size === "sm" && "p-4",
          size === "md" && "p-5 sm:p-6",
          size === "lg" && "p-6 sm:p-8",
        )}
      >
        {kicker ? <span className="is-kicker text-white/85">{kicker}</span> : null}
        <h3
          className={cn(
            "font-serif leading-tight tracking-tight",
            size === "sm" && "text-xl sm:text-2xl",
            size === "md" && "text-2xl sm:text-3xl",
            size === "lg" && "text-3xl sm:text-4xl",
          )}
        >
          {title}
        </h3>
        {description ? <p className="line-clamp-2 text-sm text-white/85">{description}</p> : null}
        {tags && tags.length > 0 ? (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {tags.map((tag, i) => (
              <CardTagPill key={i} tag={tag} light />
            ))}
          </div>
        ) : null}
        {ctaLabel ? (
          <div className="mt-3">
            <CardCta
              ctaLabel={ctaLabel}
              {...(to ? { to } : href ? { href } : onClick ? { onClick } : {})}
              variant="ghost-light"
              asVisualOnly={!!(to || href || onClick)}
            />
          </div>
        ) : null}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
      >
        {content}
      </Link>
    );
  }
  return (
    <Wrapper {...wrapperProps} className="block h-full text-left">
      {content}
    </Wrapper>
  );
}

/* ============================================================
 * 2) PremiumVerticalCard — imagem topo + texto. Estilos, ambientes,
 *    inspirations. Light theme, editorial.
 * ============================================================ */

export type PremiumVerticalCardProps = CtaProps & {
  src: string;
  alt: string;
  title: string;
  kicker?: string;
  description?: string;
  tags?: CardTag[];
  aspect?: CardAspect;
  className?: string;
};

export function PremiumVerticalCard({
  src,
  alt,
  title,
  kicker,
  description,
  tags,
  aspect = "video",
  className,
  ctaLabel,
  to,
  href,
  onClick,
}: PremiumVerticalCardProps) {
  const inner = (
    <article
      className={cn(
        "group is-hover-lift flex h-full flex-col overflow-hidden rounded-2xl bg-card border",
        className,
      )}
    >
      <CardImage src={src} alt={alt} aspect={aspect} />
      <div className="flex flex-1 flex-col gap-2 p-5">
        {kicker ? <span className="is-kicker">{kicker}</span> : null}
        <h3 className="font-serif text-xl leading-tight tracking-tight text-foreground">{title}</h3>
        {description ? (
          <p className="line-clamp-3 text-sm text-muted-foreground">{description}</p>
        ) : null}
        {tags && tags.length > 0 ? (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {tags.map((tag, i) => (
              <CardTagPill key={i} tag={tag} />
            ))}
          </div>
        ) : null}
        {ctaLabel ? (
          <div className="mt-auto pt-3">
            <CardCta
              ctaLabel={ctaLabel}
              {...(to ? { to } : href ? { href } : onClick ? { onClick } : {})}
              asVisualOnly={!!(to || href || onClick)}
            />
          </div>
        ) : null}
      </div>
    </article>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
      >
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className="block h-full">
        {inner}
      </a>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="block h-full text-left">
        {inner}
      </button>
    );
  }
  return inner;
}

/* ============================================================
 * 3) PremiumHorizontalCard — imagem lateral. Coleções, chamadas
 *    de fluxo, conteúdo editorial inline.
 * ============================================================ */

export type PremiumHorizontalCardProps = CtaProps & {
  src: string;
  alt: string;
  title: string;
  kicker?: string;
  description?: string;
  tags?: CardTag[];
  imageSide?: "left" | "right";
  className?: string;
};

export function PremiumHorizontalCard({
  src,
  alt,
  title,
  kicker,
  description,
  tags,
  imageSide = "left",
  className,
  ctaLabel,
  to,
  href,
  onClick,
}: PremiumHorizontalCardProps) {
  const imageEl = (
    <div className="w-full sm:w-2/5 shrink-0">
      <CardImage src={src} alt={alt} aspect="video" className="sm:aspect-square" />
    </div>
  );
  const textEl = (
    <div className="flex flex-1 flex-col gap-2 p-5 sm:p-6">
      {kicker ? <span className="is-kicker">{kicker}</span> : null}
      <h3 className="font-serif text-xl leading-tight tracking-tight text-foreground">{title}</h3>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      {tags && tags.length > 0 ? (
        <div className="mt-1 flex flex-wrap gap-1.5">
          {tags.map((tag, i) => (
            <CardTagPill key={i} tag={tag} />
          ))}
        </div>
      ) : null}
      {ctaLabel ? (
        <div className="mt-auto pt-3">
          <CardCta
            ctaLabel={ctaLabel}
            {...(to ? { to } : href ? { href } : onClick ? { onClick } : {})}
            asVisualOnly={!!(to || href || onClick)}
          />
        </div>
      ) : null}
    </div>
  );

  const inner = (
    <article
      className={cn(
        "group is-hover-lift flex h-full flex-col overflow-hidden rounded-2xl border bg-card sm:flex-row",
        imageSide === "right" && "sm:flex-row-reverse",
        className,
      )}
    >
      {imageEl}
      {textEl}
    </article>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
      >
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className="block h-full">
        {inner}
      </a>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="block h-full text-left w-full">
        {inner}
      </button>
    );
  }
  return inner;
}

/* ============================================================
 * 4) PremiumCompactCard — categoria/filtro rápido com ícone ou
 *    thumb pequeno. Bom pra navegação secundária.
 * ============================================================ */

export type PremiumCompactCardProps = CtaProps & {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  src?: string;
  alt?: string;
  className?: string;
};

export function PremiumCompactCard({
  title,
  description,
  icon: Icon,
  src,
  alt,
  className,
  ctaLabel,
  to,
  href,
  onClick,
}: PremiumCompactCardProps) {
  const inner = (
    <div
      className={cn(
        "group is-hover-lift flex h-full items-start gap-4 rounded-2xl border bg-card p-4 sm:p-5",
        className,
      )}
    >
      {src ? (
        <div className="size-12 shrink-0 overflow-hidden rounded-xl bg-muted">
          <img
            src={src}
            alt={alt ?? ""}
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
        </div>
      ) : Icon ? (
        <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-foreground">
          <Icon className="size-5" />
        </div>
      ) : null}
      <div className="flex flex-col gap-0.5">
        <h4 className="text-sm font-semibold leading-snug text-foreground">{title}</h4>
        {description ? (
          <p className="line-clamp-2 text-xs text-muted-foreground">{description}</p>
        ) : null}
        {ctaLabel ? (
          <div className="mt-2">
            <CardCta
              ctaLabel={ctaLabel}
              {...(to ? { to } : href ? { href } : onClick ? { onClick } : {})}
              asVisualOnly={!!(to || href || onClick)}
            />
          </div>
        ) : null}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
      >
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className="block h-full">
        {inner}
      </a>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="block h-full text-left w-full">
        {inner}
      </button>
    );
  }
  return inner;
}

/* ============================================================
 * 5) EditorialFeatureCard — hero grande dentro de grids editoriais.
 *    Imagem dominante, copy editorial extensa, 1 CTA forte.
 * ============================================================ */

export type EditorialFeatureCardProps = CtaProps & {
  src: string;
  alt: string;
  kicker?: string;
  title: React.ReactNode;
  description?: string;
  meta?: string;
  tags?: CardTag[];
  className?: string;
};

export function EditorialFeatureCard({
  src,
  alt,
  kicker,
  title,
  description,
  meta,
  tags,
  className,
  ctaLabel,
  to,
  href,
  onClick,
}: EditorialFeatureCardProps) {
  const inner = (
    <article
      className={cn(
        "group is-hover-lift is-image-zoom-host is-gradient-overlay-b relative isolate flex h-full min-h-[24rem] flex-col justify-end overflow-hidden rounded-3xl bg-foreground text-white sm:min-h-[28rem]",
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="is-image-zoom absolute inset-0 -z-10 size-full object-cover"
      />
      <div className="relative z-10 flex flex-col gap-3 p-6 sm:p-8">
        {kicker ? <span className="is-kicker text-white/85">{kicker}</span> : null}
        <h3 className="font-serif text-3xl leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
          {title}
        </h3>
        {description ? (
          <p className="max-w-md text-sm text-white/90 sm:text-base">{description}</p>
        ) : null}
        {tags && tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, i) => (
              <CardTagPill key={i} tag={tag} light />
            ))}
          </div>
        ) : null}
        {(meta || ctaLabel) && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-4">
            {meta ? (
              <span className="text-xs uppercase tracking-wider text-white/75">{meta}</span>
            ) : (
              <span />
            )}
            {ctaLabel ? (
              <CardCta
                ctaLabel={ctaLabel}
                {...(to ? { to } : href ? { href } : onClick ? { onClick } : {})}
                variant="ghost-light"
                asVisualOnly={!!(to || href || onClick)}
              />
            ) : null}
          </div>
        )}
      </div>
    </article>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-3xl"
      >
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className="block h-full">
        {inner}
      </a>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="block h-full text-left w-full">
        {inner}
      </button>
    );
  }
  return inner;
}

/* ============================================================
 * 6) CollectionCard — tema curatorial, ex: "Apartamentos pequenos",
 *    "Luxo discreto". Imagem + título + count + CTA editorial.
 * ============================================================ */

export type CollectionCardProps = CtaProps & {
  src: string;
  alt: string;
  title: string;
  description?: string;
  count?: string;
  className?: string;
};

export function CollectionCard({
  src,
  alt,
  title,
  description,
  count,
  className,
  ctaLabel = "Explorar coleção",
  to,
  href,
  onClick,
}: CollectionCardProps) {
  const inner = (
    <article
      className={cn(
        "group is-hover-lift is-image-zoom-host is-gradient-overlay-b relative isolate flex h-full min-h-[18rem] flex-col justify-between overflow-hidden rounded-2xl bg-foreground text-white",
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="is-image-zoom absolute inset-0 -z-10 size-full object-cover"
      />
      <div className="relative z-10 flex justify-end p-5">
        {count ? (
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {count}
          </span>
        ) : null}
      </div>
      <div className="relative z-10 flex flex-col gap-2 p-5 sm:p-6">
        <span className="is-kicker text-white/80">Coleção</span>
        <h3 className="font-serif text-2xl leading-tight tracking-tight sm:text-3xl">{title}</h3>
        {description ? <p className="line-clamp-2 text-sm text-white/85">{description}</p> : null}
        <div className="mt-2">
          <CardCta
            ctaLabel={ctaLabel}
            {...(to ? { to } : href ? { href } : onClick ? { onClick } : {})}
            variant="ghost-light"
            asVisualOnly={!!(to || href || onClick)}
          />
        </div>
      </div>
    </article>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
      >
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className="block h-full">
        {inner}
      </a>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="block h-full text-left w-full">
        {inner}
      </button>
    );
  }
  return inner;
}
