import { useState } from "react";
import { Sparkles, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getCuradoria, type CuratedPiece } from "@/lib/curadoria";
import { buildAffiliateLinks } from "@/lib/affiliate";
import { useTrack } from "@/lib/use-track";

/**
 * "O Atelier sugere" — vitrine editorial curada que aparece logo
 * abaixo da ShoppingList automatica no painel de resultado da IA.
 *
 * Estrategia:
 * - Curadoria estatica por estilo (src/lib/curadoria.ts), 3 pecas.
 * - Reusa buildAffiliateLinks (zero logica nova de afiliado).
 * - Tracking com source: "curated" pra segmentar conversao vs lista.
 * - Sem imagens novas (governanca proibe regenerar via IA); usa
 *   icone Lucide + tipografia editorial pra carregar a narrativa.
 */
export function AtelierCurated({
  styleId,
  styleName,
  roomType,
}: {
  styleId?: string;
  styleName?: string;
  roomType?: string;
}) {
  const track = useTrack();
  const pieces = getCuradoria(styleId);
  const [open, setOpen] = useState(false);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      track("curated_modal_opened", {
        style: styleId || undefined,
        roomType: roomType ?? undefined,
        items: pieces.length,
      });
    }
  };

  const resolveUrl = (piece: CuratedPiece) => {
    const links = buildAffiliateLinks(piece.searchQuery);
    return (
      (links.find((m) => m.id === "amazon") ?? links[0])?.url ??
      `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(piece.searchQuery)}`
    );
  };

  const providerFromUrl = (url: string): string => {
    try {
      const host = new URL(url).hostname.toLowerCase();
      if (host.includes("amazon")) return "amazon";
      if (host.includes("magazinevoce") || host.includes("magazineluiza")) return "magalu";
      if (host.includes("mercadolivre") || host.includes("mercadolibre")) return "mercadolivre";
      if (host.includes("google")) return "google_shopping";
      return host.replace(/^www\./, "") || "desconhecido";
    } catch {
      return "desconhecido";
    }
  };

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    piece: CuratedPiece,
    url: string,
    position: number,
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    track("affiliate_click", {
      provider: providerFromUrl(url),
      productName: piece.name,
      productCategory: piece.category,
      productUrl: url,
      roomType: roomType ?? undefined,
      style: styleId || undefined,
      position: position + 1,
      source: "curated",
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const delayClass = (i: number): string => {
    const map = ["is-card-enter-delay-1", "is-card-enter-delay-2", "is-card-enter-delay-3"];
    return map[i] ?? "";
  };

  return (
    <>
      {/* Teaser inline — botão que abre o modal premium. O foco volta
          automaticamente pra este botão ao fechar (Radix Dialog). */}
      <button
        type="button"
        onClick={() => handleOpenChange(true)}
        className="mt-5 w-full text-left rounded-2xl border border-accent/20 bg-accent/[0.04] p-4 sm:p-5 is-atelier-card group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <div className="flex items-start gap-2.5 is-fade-up">
          <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-accent is-sparkle-pulse">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] uppercase tracking-[0.18em] text-accent font-medium">
              O Atelier sugere
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {pieces.length} peças escolhidas a dedo pra dialogar com{" "}
              <span className="italic text-foreground">{styleName ?? "esse estilo"}</span>.
            </p>
          </div>
          <span className="mt-1 inline-flex items-center gap-1 text-[12px] font-medium text-accent shrink-0">
            Ver curadoria
            <ExternalLink className="h-3 w-3 is-arrow-slide" aria-hidden />
          </span>
        </div>
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="is-dialog-premium max-w-2xl max-h-[90vh] overflow-y-auto sm:rounded-2xl border-accent/20"
          onOpenAutoFocus={(e) => {
            // Evita focus visível no botão de fechar; deixa o título focável
            // via Radix automaticamente; foco retorna ao trigger no close.
            e.preventDefault();
          }}
        >
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 text-accent is-sparkle-pulse">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0 pr-8">
              <DialogTitle className="text-[11px] uppercase tracking-[0.18em] text-accent font-medium">
                O Atelier sugere
              </DialogTitle>
              <DialogDescription className="mt-1.5 text-sm text-muted-foreground">
                Peças escolhidas a dedo pra dialogar com{" "}
                <span className="italic text-foreground">{styleName ?? "esse estilo"}</span>.
              </DialogDescription>
            </div>
          </div>

          <ul className="mt-2 grid gap-3 sm:grid-cols-3">
            {pieces.map((piece, i) => {
              const url = resolveUrl(piece);
              return (
                <li
                  key={piece.name}
                  className={`flex flex-col rounded-xl border bg-card/70 p-3.5 is-atelier-card group is-card-enter ${delayClass(i)}`}
                >
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {piece.category}
                  </div>
                  <div className="mt-1 text-[13px] font-medium text-foreground leading-snug">
                    {piece.name}
                  </div>
                  <p className="mt-1.5 text-[12px] italic text-muted-foreground leading-relaxed">
                    {piece.why}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-[12px] tabular-nums text-foreground/80">
                      {piece.priceRange}
                    </span>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handleClick(e, piece, url, i)}
                      className="inline-flex items-center gap-1 text-[12px] font-medium text-accent hover:underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                    >
                      Ver peça
                      <ExternalLink className="h-3 w-3 is-arrow-slide" aria-hidden />
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>

          <p className="mt-1 text-[10px] text-muted-foreground/80">
            Links de afiliado. Podemos receber comissão sem custo adicional pra você.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
