import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Camera, Upload, Sparkles, X, Wand2, ImageIcon, Check,
  AlertCircle, Zap, Loader2, History, Trash2, Play,
  ChevronLeft, ChevronRight, Layers, GitCompare, Clock,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  type Draft, type DraftVersion, listDrafts, upsertDraft, deleteDraft,
  newDraftId, newVersionId, pushVersion, timeAgo,
} from "@/lib/drafts";
import { transformImage } from "@/lib/transform.functions";
import { BeforeAfter } from "@/components/BeforeAfter";
import useEmblaCarousel from "embla-carousel-react";
import { SHOPPING_LIST, estimateTotal } from "@/lib/shopping";
import { generateBudgetPdf, type BudgetItem } from "@/lib/budget-pdf";
import { FileDown, ShoppingBag, RefreshCw } from "lucide-react";
import { generateShoppingList } from "@/lib/shopping.functions";
import { WhatsAppShareDialog } from "@/components/WhatsAppShareDialog";
import { MessageCircle } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const STYLES = [
  { id: "japandi",    name: "Japandi",        sub: "Calmo, oak e linho" },
  { id: "modern",     name: "Contemporâneo",  sub: "Linhas suaves e arte" },
  { id: "minimal",    name: "Minimalista",    sub: "Menos é mais" },
  { id: "natural",    name: "Natural",        sub: "Madeira e fibras" },
  { id: "industrial", name: "Industrial",     sub: "Tijolo e metal" },
  { id: "luxe",       name: "Luxo discreto",  sub: "Materiais nobres" },
];

const MAX_FILE_MB = 20;
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

type Stage = "idle" | "optimizing" | "uploading" | "generating" | "done" | "error";

async function compressImage(file: File): Promise<{ dataUrl: string; blob: Blob; width: number; height: number }> {
  const bitmap = await createImageBitmap(file).catch(async () => {
    // Fallback: HTMLImageElement (e.g. HEIC won't decode either way)
    const url = URL.createObjectURL(file);
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = url;
    });
    URL.revokeObjectURL(url);
    return img as unknown as ImageBitmap;
  });

  const ratio = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * ratio);
  const h = Math.round(bitmap.height * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("Canvas indisponível");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap as CanvasImageSource, 0, 0, w, h);

  const blob: Blob = await new Promise((res, rej) =>
    canvas.toBlob((b) => (b ? res(b) : rej(new Error("Falha ao comprimir"))), "image/jpeg", JPEG_QUALITY)
  );
  const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  return { dataUrl, blob, width: w, height: h };
}

function formatKB(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

type Variation = { id: string; url: string; style: string; styleName?: string; label?: string };

export function UploadPhotoModal({ open, onOpenChange }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [style, setStyle] = useState<string>("japandi");
  const [stage, setStage] = useState<Stage>("idle");
  const [progress, setProgress] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ original: number; optimized: number; w: number; h: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [versions, setVersions] = useState<DraftVersion[]>([]);
  const [activeVersionId, setActiveVersionId] = useState<string | null>(null);
  const [compareVersionId, setCompareVersionId] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const abortRef = useRef<{ cancelled: boolean } | null>(null);

  const [emblaRef, embla] = useEmblaCarousel({ loop: false, align: "start" });
  const [waOpen, setWaOpen] = useState(false);

  useEffect(() => {
    if (!embla) return;
    const onSel = () => setActiveIdx(embla.selectedScrollSnap());
    embla.on("select", onSel);
    return () => { embla.off("select", onSel); };
  }, [embla]);

  useEffect(() => {
    if (embla) embla.reInit();
  }, [embla, variations.length]);

  // Load drafts whenever the modal opens
  useEffect(() => {
    if (open) setDrafts(listDrafts());
  }, [open]);

  // Autosave current work as a draft (debounced via stage transitions)
  useEffect(() => {
    if (!preview || !draftId) return;
    const styleName = STYLES.find((s) => s.id === style)?.name;
    const status: Draft["status"] =
      stage === "done" ? "done" : stage === "uploading" || stage === "generating" ? "generating" : "draft";
    const draft: Draft = {
      id: draftId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status,
      style,
      styleName,
      preview,
      result: variations[0]?.url,
      results: variations.length
        ? variations.map((v) => ({ url: v.url, style: v.style, styleName: v.styleName, label: v.label }))
        : undefined,
      meta: meta ?? undefined,
      progress,
      title: `${styleName ?? "Projeto"} · ${new Date().toLocaleDateString("pt-BR")}`,
    };
    // Preserve original createdAt if existing
    const existing = listDrafts().find((d) => d.id === draftId);
    if (existing) draft.createdAt = existing.createdAt;
    upsertDraft(draft);
    setDrafts(listDrafts());
  }, [preview, variations, style, stage, progress, meta, draftId]);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setMeta(null);

    if (!file.type.startsWith("image/")) {
      setError("Formato não suportado. Envie uma imagem (JPG, PNG ou WebP).");
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`Imagem muito grande. Máximo ${MAX_FILE_MB}MB.`);
      return;
    }

    setStage("optimizing");
    setProgress(15);
    try {
      const { dataUrl, blob, width, height } = await compressImage(file);
      setProgress(60);
      setPreview(dataUrl);
      setMeta({ original: file.size, optimized: blob.size, w: width, h: height });
      if (!draftId) setDraftId(newDraftId());
      setProgress(100);
      setTimeout(() => {
        setStage("idle");
        setProgress(0);
      }, 250);
    } catch (e) {
      setError("Não conseguimos preparar essa imagem. Tente outra foto.");
      setStage("error");
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const variationLabels = ["Opção A", "Opção B", "Opção C", "Opção D"];

  const generate = async (count: number = 1, reset: boolean = false) => {
    if (!preview) return;
    setError(null);
    if (reset) setVariations([]);
    const startIdx = reset ? 0 : variations.length;
    setPendingCount(count);
    setDoneCount(0);
    setStage("uploading");
    setProgress(0);
    const ticket = { cancelled: false };
    abortRef.current = ticket;

    // Animated progress while we await
    let p = 0;
    const tick = () => {
      if (ticket.cancelled) return;
      p += Math.random() * 5 + 2;
      if (p < 45) setStage("uploading");
      else setStage("generating");
      setProgress(Math.min(94, p));
      if (p < 94) setTimeout(tick, 280);
    };
    tick();

    const styleName = STYLES.find((s) => s.id === style)?.name;

    try {
      const tasks = Array.from({ length: count }, (_, i) =>
        transformImage({ data: { imageDataUrl: preview, style, variant: startIdx + i } })
          .then((out) => {
            if (ticket.cancelled) return null;
            const v: Variation = {
              id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
              url: out.imageDataUrl,
              style,
              styleName,
              label: variationLabels[(startIdx + i) % variationLabels.length],
            };
            setVariations((prev) => {
              const next = [...prev, v];
              // jump to first new one
              setTimeout(() => embla?.scrollTo(reset ? 0 : prev.length), 50);
              return next;
            });
            setDoneCount((d) => d + 1);
            return v;
          })
          .catch((err) => {
            if (ticket.cancelled) return null;
            throw err;
          })
      );
      const results = await Promise.allSettled(tasks);
      if (ticket.cancelled) return;
      const anySuccess = results.some((r) => r.status === "fulfilled" && r.value);
      const firstError = results.find((r) => r.status === "rejected") as PromiseRejectedResult | undefined;
      if (!anySuccess && firstError) {
        setError(firstError.reason?.message ?? "Não foi possível gerar agora.");
        setStage("error");
        setProgress(0);
        return;
      }
      setProgress(100);
      setStage("done");
      // Snapshot this generation as a new version in the project history.
      if (draftId) {
        const finalVars = reset
          ? variations.slice(0, 0) // placeholder, we'll read fresh below
          : variations;
        // Read latest variations from state synchronously via functional update
        setVariations((curr) => {
          const version: DraftVersion = {
            id: newVersionId(),
            createdAt: Date.now(),
            style,
            styleName,
            results: curr.map((v) => ({ url: v.url, style: v.style, styleName: v.styleName, label: v.label })),
            note: `${curr.length} ${curr.length === 1 ? "variação" : "variações"} · ${styleName ?? style}`,
          };
          pushVersion(draftId, version);
          setVersions(listDrafts().find((d) => d.id === draftId)?.versions ?? []);
          setActiveVersionId(version.id);
          setDrafts(listDrafts());
          return curr;
        });
        void finalVars;
      }
    } catch (e: any) {
      if (ticket.cancelled) return;
      setError(e?.message ?? "Não foi possível gerar agora. Tente novamente.");
      setStage("error");
      setProgress(0);
    }
  };

  const reset = () => {
    abortRef.current && (abortRef.current.cancelled = true);
    setPreview(null);
    setVariations([]);
    setActiveIdx(0);
    setPendingCount(0);
    setDoneCount(0);
    setDraftId(null);
    setStage("idle");
    setProgress(0);
    setError(null);
    setMeta(null);
  };

  const resumeDraft = (d: Draft) => {
    setPreview(d.preview);
    const legacy = d.result ? [{
      id: "legacy",
      url: d.result,
      style: d.style,
      styleName: d.styleName,
      label: variationLabels[0],
    } as Variation] : [];
    const restored: Variation[] = d.results?.length
      ? d.results.map((r, i) => ({
          id: `r_${i}`,
          url: r.url,
          style: r.style,
          styleName: r.styleName,
          label: r.label ?? variationLabels[i % variationLabels.length],
        }))
      : legacy;
    setVariations(restored);
    setActiveIdx(0);
    setStyle(d.style);
    setMeta(d.meta ?? null);
    setDraftId(d.id);
    setStage(d.status === "done" ? "done" : "idle");
    setProgress(d.status === "done" ? 100 : 0);
    setError(null);
  };

  const removeDraft = (id: string) => {
    deleteDraft(id);
    setDrafts(listDrafts());
    if (draftId === id) reset();
  };

  const close = (o: boolean) => {
    onOpenChange(o);
    if (!o) setTimeout(reset, 250);
  };

  const generating = stage === "uploading" || stage === "generating";
  const done = stage === "done";
  const optimizing = stage === "optimizing";
  const stageLabel =
    stage === "uploading" ? "Enviando foto otimizada…" :
    stage === "generating" ? "Gerando ambiente decorado…" :
    stage === "optimizing" ? "Otimizando imagem…" : "";

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent
        className={`max-w-[calc(100vw-1.5rem)] rounded-3xl p-0 overflow-hidden border-0 shadow-2xl max-h-[92vh] overflow-y-auto ${
          variations.length > 0 ? "sm:max-w-2xl lg:max-w-5xl" : "sm:max-w-2xl"
        }`}
      >
        <button
          aria-label="Fechar"
          onClick={() => close(false)}
          className="absolute top-3 right-3 z-20 h-9 w-9 rounded-full bg-background/85 backdrop-blur grid place-items-center hover:bg-background"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-5 sm:p-7">
          <div className="text-[10px] uppercase tracking-[0.22em] text-accent">Criar com IA</div>
          <h3 className="mt-1 text-xl sm:text-2xl font-semibold leading-tight tracking-[-0.01em]">
            Envie a <span className="font-serif italic font-normal">foto do seu ambiente</span>
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Tire uma foto ou envie uma imagem. Otimizamos antes de enviar para gerar mais rápido.
          </p>

          {/* Drafts strip — only when starting fresh */}
          {!preview && drafts.length > 0 && (
            <div className="mt-5 rounded-2xl border bg-card/60 p-3">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  <History className="h-3.5 w-3.5" /> Continue de onde parou
                </div>
                <span className="text-[10px] text-muted-foreground">{drafts.length} salvos neste aparelho</span>
              </div>
              <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1 snap-x snap-mandatory">
                {drafts.map((d) => (
                  <div
                    key={d.id}
                    className="relative shrink-0 w-[140px] snap-start rounded-xl overflow-hidden border bg-background group"
                  >
                    <button onClick={() => resumeDraft(d)} className="block w-full text-left">
                      <div className="relative aspect-[4/3] bg-muted">
                        <img src={d.preview} alt={d.title ?? "Rascunho"} className="absolute inset-0 h-full w-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 to-transparent h-12" />
                        <div className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-background/90 backdrop-blur text-[9px] px-1.5 py-0.5 border">
                          {d.status === "done" ? (
                            <><Check className="h-2.5 w-2.5 text-accent" /> Pronto</>
                          ) : d.status === "generating" ? (
                            <><Loader2 className="h-2.5 w-2.5 animate-spin text-accent" /> Gerando</>
                          ) : (
                            <><Play className="h-2.5 w-2.5" /> Rascunho</>
                          )}
                        </div>
                        <div className="absolute bottom-1.5 left-1.5 right-1.5 text-[10px] text-background leading-tight">
                          <div className="font-medium truncate">{d.styleName ?? "Projeto"}</div>
                          <div className="opacity-75">{timeAgo(d.updatedAt)}</div>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeDraft(d.id); }}
                      aria-label="Excluir rascunho"
                      className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-background/90 border grid place-items-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground">
                Rascunhos ficam neste navegador/aparelho — retome a qualquer momento, mesmo offline.
              </p>
            </div>
          )}

          {/* Project workspace: image + side shopping panel */}
          <div className={`mt-5 ${variations.length > 0 ? "lg:grid lg:grid-cols-[1.4fr_1fr] lg:gap-5 lg:items-start" : ""}`}>
          <div>
          {/* Upload zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={`relative rounded-2xl border border-dashed overflow-hidden aspect-[5/3] transition ${
              isDragging ? "bg-accent/10 border-accent" : "bg-muted/40"
            }`}
          >
            {preview && variations.length > 0 ? (
              <>
                <div ref={emblaRef} className="absolute inset-0 overflow-hidden">
                  <div className="flex h-full">
                    {variations.map((v) => (
                      <div key={v.id} className="relative shrink-0 grow-0 basis-full h-full">
                        <BeforeAfter
                          before={preview}
                          after={v.url}
                          className="absolute inset-0 h-full w-full rounded-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {/* In-progress placeholder slide indicator */}
                {generating && doneCount < pendingCount && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-1.5 rounded-full bg-background/90 backdrop-blur text-[10px] uppercase tracking-widest px-2.5 py-1 border">
                    <Loader2 className="h-3 w-3 animate-spin text-accent" />
                    Gerando {doneCount + 1}/{pendingCount}
                  </div>
                )}
                {variations.length > 1 && (
                  <>
                    <button
                      onClick={() => embla?.scrollPrev()}
                      aria-label="Anterior"
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-background/85 backdrop-blur border grid place-items-center hover:bg-background"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => embla?.scrollNext()}
                      aria-label="Próxima"
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-background/85 backdrop-blur border grid place-items-center hover:bg-background"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={reset}
                  className="absolute bottom-3 left-3 z-10 rounded-full bg-background/85 backdrop-blur text-xs px-3 py-1.5 border"
                >
                  Trocar foto
                </button>
                <div className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-background/85 backdrop-blur text-[10px] px-2.5 py-1 border">
                  <Layers className="h-3 w-3 text-accent" />
                  {variations[activeIdx]?.label ?? `Opção ${activeIdx + 1}`} · {activeIdx + 1}/{variations.length}
                </div>
              </>
            ) : preview ? (
              <>
                <img src={preview} alt="Sua foto" className="absolute inset-0 h-full w-full object-cover" />
                {(generating || optimizing) && (
                  <div className="absolute inset-0 bg-foreground/45 backdrop-blur-[2px] grid place-items-center text-background px-6">
                    <div className="w-full max-w-xs text-center">
                      <div className="flex items-center justify-center gap-2 text-sm">
                        {stage === "generating"
                          ? <Sparkles className="h-4 w-4 animate-pulse text-accent" />
                          : <Loader2 className="h-4 w-4 animate-spin text-accent" />}
                        {stageLabel}
                      </div>
                      <Progress value={progress} className="h-1.5 mt-3 bg-background/30" />
                      <div className="mt-1.5 text-[10px] text-background/70">{Math.round(progress)}%</div>
                    </div>
                  </div>
                )}
                <button
                  onClick={reset}
                  className="absolute bottom-3 left-3 rounded-full bg-background/85 backdrop-blur text-xs px-3 py-1.5 border"
                >
                  Trocar foto
                </button>
                {meta && !generating && !optimizing && (
                  <div className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-background/85 backdrop-blur text-[10px] px-2.5 py-1 border">
                    <Zap className="h-3 w-3 text-accent" />
                    {meta.w}×{meta.h} · {formatKB(meta.optimized)}
                    <span className="text-muted-foreground line-through ml-1">{formatKB(meta.original)}</span>
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 grid place-items-center text-center px-6">
                <div>
                  <div className="mx-auto h-12 w-12 rounded-2xl bg-accent/15 text-accent grid place-items-center">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Arraste uma foto aqui, ou use a câmera do celular. Otimizamos automaticamente.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    <Button
                      size="sm"
                      onClick={() => cameraInput.current?.click()}
                      className="rounded-full bg-foreground text-background hover:bg-foreground/90"
                    >
                      <Camera className="h-4 w-4 mr-1.5" /> Tirar foto
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => fileInput.current?.click()}
                      className="rounded-full"
                    >
                      <Upload className="h-4 w-4 mr-1.5" /> Enviar imagem
                    </Button>
                  </div>
                  <p className="mt-3 text-[10px] text-muted-foreground">
                    JPG, PNG ou WebP · até {MAX_FILE_MB}MB
                  </p>
                </div>
              </div>
            )}

            <input
              ref={cameraInput}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>

          {/* Variation thumbnails */}
          {variations.length > 0 && (
            <div className="mt-3 flex items-center gap-2 overflow-x-auto -mx-1 px-1 pb-1 snap-x snap-mandatory">
              {variations.map((v, i) => {
                const active = i === activeIdx;
                return (
                  <button
                    key={v.id}
                    onClick={() => embla?.scrollTo(i)}
                    className={`relative shrink-0 snap-start rounded-xl overflow-hidden border w-[88px] aspect-[5/3] transition ${
                      active ? "ring-2 ring-accent border-accent" : "opacity-80 hover:opacity-100"
                    }`}
                    aria-label={v.label ?? `Opção ${i + 1}`}
                  >
                    <img src={v.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 text-[9px] text-center text-background bg-foreground/70 py-0.5">
                      {v.label ?? `Opção ${i + 1}`}
                    </span>
                  </button>
                );
              })}
              {generating && Array.from({ length: Math.max(0, pendingCount - doneCount) }).map((_, i) => (
                <div
                  key={`pending_${i}`}
                  className="shrink-0 rounded-xl border w-[88px] aspect-[5/3] bg-muted/60 grid place-items-center"
                >
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ))}
            </div>
          )}
          </div>

          {variations.length > 0 && (
            <ShoppingPanel
              styleName={STYLES.find((s) => s.id === style)?.name ?? "Projeto"}
              variationLabel={variations[activeIdx]?.label}
              styleId={style}
              variation={variations[activeIdx]}
            />
          )}
          </div>

          {error && (
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Style picker */}
          <div className="mt-5">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">Escolha o estilo</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STYLES.map((s) => {
                const active = s.id === style;
                return (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`text-left rounded-xl border px-3 py-2.5 transition ${
                      active
                        ? "border-accent bg-accent/8 ring-1 ring-accent"
                        : "hover:bg-muted/60"
                    }`}
                  >
                    <div className="text-sm font-medium">{s.name}</div>
                    <div className="text-[11px] text-muted-foreground">{s.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer actions */}
          <div className="mt-6 flex flex-col sm:flex-row gap-2">
            {variations.length === 0 ? (
              <>
                <Button
                  onClick={() => generate(1, true)}
                  disabled={!preview || generating || optimizing}
                  className="h-11 rounded-full bg-foreground text-background hover:bg-foreground/90 px-5 text-sm flex-1"
                >
                  <Wand2 className="h-4 w-4 mr-1.5" />
                  {generating ? "Gerando…" : "Gerar com IA"}
                </Button>
                <Button
                  onClick={() => generate(3, true)}
                  disabled={!preview || generating || optimizing}
                  variant="outline"
                  className="h-11 rounded-full px-5 text-sm"
                >
                  <Layers className="h-4 w-4 mr-1.5" /> Gerar 3 variações
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => generate(1, false)}
                  disabled={generating || optimizing || variations.length >= 6}
                  className="h-11 rounded-full bg-foreground text-background hover:bg-foreground/90 px-5 text-sm flex-1"
                >
                  <Wand2 className="h-4 w-4 mr-1.5" />
                  {generating ? "Gerando…" : "Gerar mais uma variação"}
                </Button>
                {variations[activeIdx] && (
                  <a
                    href={variations[activeIdx].url}
                    download={`ideal-space-${style}-${activeIdx + 1}.png`}
                    className="h-11 inline-flex items-center justify-center rounded-full border px-5 text-sm hover:bg-muted"
                  >
                    Baixar selecionada
                  </a>
                )}
                {variations[activeIdx] && (
                  <Button
                    type="button"
                    onClick={() => setWaOpen(true)}
                    className="h-11 rounded-full px-5 text-sm bg-[#25D366] hover:bg-[#1ebe5a] text-white"
                  >
                    <MessageCircle className="h-4 w-4 mr-1.5" /> WhatsApp
                  </Button>
                )}
              </>
            )}
            <Button variant="outline" onClick={() => close(false)} className="h-11 rounded-full px-5 text-sm">
              Fechar
            </Button>
          </div>
          {variations.length > 0 && (
            <p className="mt-2 text-[11px] text-muted-foreground text-center sm:text-left">
              Arraste o slider sobre a imagem para comparar <span className="font-medium text-foreground">antes</span> e <span className="font-medium text-foreground">depois</span>. Deslize lateralmente para ver outras variações.
            </p>
          )}
          <p className="mt-2 text-[10px] text-muted-foreground">
            Reduzimos a imagem para {MAX_DIMENSION}px e qualidade {Math.round(JPEG_QUALITY * 100)}% antes do envio —
            uploads até 5× mais rápidos. Suas fotos são privadas.
          </p>
        </div>
      </DialogContent>
      {variations[activeIdx] && (
        <WhatsAppShareDialog
          open={waOpen}
          onOpenChange={setWaOpen}
          projectName={`${STYLES.find((s) => s.id === style)?.name ?? "Projeto"}${variations[activeIdx]?.label ? " · " + variations[activeIdx].label : ""}`}
          imageUrl={variations[activeIdx]?.url}
          downloadName={`ideal-space-${style}-${activeIdx + 1}.png`}
        />
      )}
    </Dialog>
  );
}

/* ------------------------- Shopping panel ------------------------- */

function ShoppingPanel({
  styleName,
  variationLabel,
  styleId,
  variation,
}: {
  styleName: string;
  variationLabel?: string;
  styleId: string;
  variation?: Variation;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [cache, setCache] = useState<Record<string, BudgetItem[]>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  const vid = variation?.id;
  const aiItems = vid ? cache[vid] : undefined;
  const usingFallback = !aiItems;
  const items: ReadonlyArray<BudgetItem> = aiItems ?? SHOPPING_LIST;

  const fetchList = async () => {
    if (!variation?.url || !vid) return;
    setLoadingId(vid);
    setErrorId(null);
    try {
      const out = await generateShoppingList({
        data: { imageDataUrl: variation.url, style: styleId, styleName },
      });
      setCache((prev) => ({ ...prev, [vid]: out.items }));
    } catch (e: any) {
      setErrorId(vid);
    } finally {
      setLoadingId((cur) => (cur === vid ? null : cur));
    }
  };

  useEffect(() => {
    if (!vid) return;
    if (cache[vid] || loadingId === vid) return;
    void fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vid, variation?.url]);

  const isLoading = loadingId === vid;
  const hasError = errorId === vid && !aiItems;
  const visibleItems: ReadonlyArray<BudgetItem> = unlocked ? items : items.slice(0, 4);
  const total = estimateTotal(items);
  const projectName = variationLabel
    ? `${styleName} · ${variationLabel}`
    : styleName;

  const tagStyles: Record<BudgetItem["tag"], string> = {
    Essencial: "bg-accent text-accent-foreground",
    Recomendado: "bg-foreground/85 text-background",
    Opcional: "bg-muted text-foreground",
  };

  const onDownload = () => {
    generateBudgetPdf({
      project: `Ambiente · ${projectName}`,
      items,
      estimate: total,
    });
  };

  return (
    <aside className="mt-4 lg:mt-0 rounded-2xl border bg-card/60 p-4 sm:p-5 flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-accent">
            <ShoppingBag className="h-3.5 w-3.5" /> Lista de compras
          </div>
          <div className="mt-1 text-sm font-medium leading-tight">{projectName}</div>
          <div className="mt-1 text-[10px] text-muted-foreground">
            {isLoading
              ? "Analisando o ambiente com IA…"
              : hasError
              ? "Não conseguimos analisar — exibindo sugestão padrão."
              : usingFallback
              ? "Sugestão padrão"
              : "Gerada a partir do seu ambiente"}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Estimativa</div>
          <div className="text-sm font-semibold text-foreground">{total}</div>
          <button
            onClick={fetchList}
            disabled={isLoading || !variation}
            className="mt-1 inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
            {isLoading ? "Gerando…" : "Refazer"}
          </button>
        </div>
      </div>

      <ul className="mt-4 -mx-1 divide-y divide-border/60">
        {isLoading && !aiItems
          ? Array.from({ length: 4 }).map((_, i) => (
              <li key={`sk_${i}`} className="px-1 py-2.5 animate-pulse">
                <div className="h-3 w-2/3 rounded bg-muted" />
                <div className="mt-2 h-2.5 w-1/3 rounded bg-muted/60" />
              </li>
            ))
          : visibleItems.map((it) => (
          <li key={it.name} className="flex items-start justify-between gap-3 px-1 py-2.5">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] uppercase tracking-widest rounded-full px-1.5 py-0.5 ${tagStyles[it.tag]}`}>
                  {it.tag}
                </span>
                <span className="text-sm font-medium truncate">{it.name}</span>
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{it.cat}</div>
            </div>
            <div className="text-xs font-medium whitespace-nowrap">{it.price}</div>
          </li>
        ))}
      </ul>

      {!unlocked && items.length > visibleItems.length && (
        <button
          onClick={() => setUnlocked(true)}
          className="mt-3 text-xs rounded-xl border border-dashed py-2 hover:bg-muted/60"
        >
          Ver mais {items.length - visibleItems.length} itens
        </button>
      )}

      <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between">
        <div className="text-[10px] text-muted-foreground">
          {items.length} itens · valores estimados
        </div>
        <div className="text-sm font-semibold">{total}</div>
      </div>

      <Button
        onClick={onDownload}
        className="mt-3 h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-sm"
      >
        <FileDown className="h-4 w-4 mr-1.5" /> Baixar orçamento em PDF
      </Button>
      <p className="mt-2 text-[10px] text-muted-foreground text-center">
        PDF com lista organizada por prioridade e estimativa total.
      </p>
    </aside>
  );
}