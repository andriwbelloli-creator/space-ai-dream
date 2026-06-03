import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Camera,
  Upload,
  Sparkles,
  X,
  Wand2,
  ImageIcon,
  Check,
  AlertCircle,
  Zap,
  Loader2,
  History,
  Trash2,
  Play,
  ChevronLeft,
  ChevronRight,
  Layers,
  GitCompare,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  type Draft,
  type DraftVersion,
  listDrafts,
  upsertDraft,
  deleteDraft,
  newDraftId,
  newVersionId,
  pushVersion,
  timeAgo,
} from "@/lib/drafts";
import { transformImage } from "@/lib/transform.functions";
import { saveReturnContext } from "@/lib/navigation-return";
import { BeforeAfter } from "@/components/BeforeAfter";
import useEmblaCarousel from "embla-carousel-react";
import { getShoppingFallback, estimateTotal, sortByPriority } from "@/lib/shopping";
import { generateBudgetPdf, type BudgetItem } from "@/lib/budget-pdf";
import { FileDown, ShoppingBag, RefreshCw, Download, Lock } from "lucide-react";
import { generateShoppingList } from "@/lib/shopping.functions";
import { buildAffiliateLinks } from "@/lib/affiliate";
import { WhatsAppShareDialog } from "@/components/WhatsAppShareDialog";
import { LeadFormModal } from "@/components/LeadFormModal";
import { AtelierCurated } from "@/components/AtelierCurated";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useCredits } from "@/hooks/use-credits";
import { useTrack } from "@/lib/use-track";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialStyle?: string;
  // Cômodo pré-selecionado, vindo da rota /ambientes/<slug>. Vira chip
  // visual no topo do modal e roomTypeHint enviado pro back.
  initialRoom?: string;
  // Arquivo pré-carregado quando o modal é aberto via drag-and-drop da
  // dropzone do Hero. Quando presente, o modal processa automaticamente
  // (passa pela mesma validação MIME/tamanho via handleFile).
  initialFile?: File;
};

// Catálogo do picker. IDs batem com slugs canônicos do catálogo SEO
// (seo-styles-data.ts) e com STYLE_PROMPTS em transform.functions.ts.
// Ordem prioriza estilos mais comerciais/atuais no topo.
const STYLES = [
  { id: "japandi", name: "Japandi", sub: "Calmo, oak e linho" },
  { id: "contemporaneo", name: "Contemporâneo", sub: "Linhas suaves e arte" },
  { id: "moderno-organico", name: "Moderno orgânico", sub: "Curvas e biofilia" },
  { id: "transicional", name: "Transicional", sub: "Clássico com leveza" },
  { id: "minimalista", name: "Minimalista", sub: "Menos é mais" },
  { id: "natural", name: "Natural aconchegante", sub: "Madeira e fibras" },
  { id: "rustico-moderno", name: "Rústico moderno", sub: "Aconchego com metal preto" },
  { id: "industrial", name: "Industrial", sub: "Tijolo e metal" },
  { id: "luxo", name: "Luxo discreto", sub: "Materiais nobres" },
  { id: "classico", name: "Clássico contemporâneo", sub: "Simetria e boiseries" },
  { id: "boho-chic", name: "Boho chic", sub: "Eclético e acolhedor" },
  { id: "mid-century", name: "Mid-century moderno", sub: "Anos 50/60 quente" },
  { id: "mediterraneo", name: "Mediterrâneo", sub: "Costeiro caiado" },
  { id: "art-deco", name: "Art-déco", sub: "Geometria e brilho" },
  { id: "maximalista", name: "Maximalista", sub: "Cor e camadas" },
  { id: "brutalista", name: "Brutalista contemporâneo", sub: "Concreto escultural" },
];

// Retrocompat: drafts/variations antigas podem ter slugs internos legados
// (modern/minimal/luxe). Converte pro canônico SEO antes de usar — sem isso
// o picker fica sem highlight quando carrega um draft antigo.
const STYLE_ALIASES: Record<string, string> = {
  modern: "contemporaneo",
  minimal: "minimalista",
  luxe: "luxo",
};
const normalizeStyle = (slug: string): string => STYLE_ALIASES[slug] ?? slug;

// Label legível pro chip de ambiente. Slugs novos não estão em RoomType
// canônico (closet, varanda-gourmet etc.), então mantém o slug formatado.
const ROOM_LABELS: Record<string, string> = {
  sala: "Sala de estar",
  quarto: "Quarto",
  cozinha: "Cozinha",
  "home-office": "Home office",
  banheiro: "Banheiro",
  "sala-jantar": "Sala de jantar",
  closet: "Closet",
  "varanda-gourmet": "Varanda gourmet",
  "quarto-infantil": "Quarto infantil",
  lavabo: "Lavabo",
  "sala-tv": "Sala de TV",
};
const labelForRoom = (slug: string): string =>
  ROOM_LABELS[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");

const MAX_FILE_MB = 20;
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

type Stage = "idle" | "optimizing" | "uploading" | "generating" | "done" | "error";

async function compressImage(
  file: File,
): Promise<{ dataUrl: string; blob: Blob; width: number; height: number }> {
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
    canvas.toBlob(
      (b) => (b ? res(b) : rej(new Error("Falha ao comprimir"))),
      "image/jpeg",
      JPEG_QUALITY,
    ),
  );
  const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  return { dataUrl, blob, width: w, height: h };
}

function formatKB(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

type Variation = {
  id: string;
  url: string;
  style: string;
  styleName?: string;
  label?: string;
  roomType?: string;
};

/** Reduz "Opção A" a "A" pra usar como sufixo curto na composição
 *  `${styleName} · ${shortLabel}`. Vazio se label ausente. */
function shortLabel(label: string | undefined): string {
  if (!label) return "";
  const parts = label.trim().split(/\s+/);
  return parts.length > 1 ? parts[parts.length - 1] : label;
}

/** Formata o label de uma variação pra display no carrossel.
 *
 * Regras:
 * - Com `styleName`: monta `${styleName} · ${shortLabel}` (ex.: "Japandi · A").
 * - Anti-colisão: se a mesma combinação (styleName + shortLabel) já apareceu
 *   antes na lista, anexa `#${oneBasedIdx}` pra desambiguar (ex.: "Japandi · A #4").
 *   Cobre o caso de gerar o mesmo estilo 2x na mesma sessão.
 * - Fallback: drafts antigos sem `styleName` caem em `v.label` puro ou "Opção N".
 *
 * Recebe índice 1-based pra alinhar com o que o usuário enxerga.
 */
function formatVariationLabel(
  v: Variation,
  oneBasedIdx: number,
  all: ReadonlyArray<Variation>,
): string {
  if (!v.styleName) return v.label ?? `Opção ${oneBasedIdx}`;
  const base = `${v.styleName} · ${shortLabel(v.label)}`;
  const zeroBasedIdx = oneBasedIdx - 1;
  const collision = all.some(
    (other, otherIdx) =>
      otherIdx < zeroBasedIdx &&
      other.styleName === v.styleName &&
      shortLabel(other.label) === shortLabel(v.label),
  );
  return collision ? `${base} #${oneBasedIdx}` : base;
}

/** Mensagens rotativas exibidas no overlay durante stage === "generating". */
const GENERATING_MESSAGES = [
  "Analisando estrutura…",
  "Aplicando estilo…",
  "Posicionando mobiliário…",
  "Ajustando iluminação…",
  "Gerando lista de produtos…",
  "Finalizando…",
] as const;

export function UploadPhotoModal({
  open,
  onOpenChange,
  initialStyle,
  initialRoom,
  initialFile,
}: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { credits, setBalance } = useCredits();
  const track = useTrack();
  const [preview, setPreview] = useState<string | null>(null);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [style, setStyle] = useState<string>("japandi");
  const [roomHint, setRoomHint] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (open && initialStyle) setStyle(normalizeStyle(initialStyle));
  }, [open, initialStyle]);
  useEffect(() => {
    if (open) setRoomHint(initialRoom);
  }, [open, initialRoom]);
  // Tracking: room deeplinkado (vem do Hero / página de ambiente) é uma
  // decisão deliberada de funil. Registra source pra distinguir do
  // auto-detect que vem na resposta da geração.
  useEffect(() => {
    if (open && initialRoom) {
      track("room_type_selected", { room_type: initialRoom, source: "deeplink" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialRoom]);
  const [stage, setStage] = useState<Stage>("idle");
  const [progress, setProgress] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<{
    original: number;
    optimized: number;
    w: number;
    h: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [versions, setVersions] = useState<DraftVersion[]>([]);
  const [activeVersionId, setActiveVersionId] = useState<string | null>(null);
  const [compareVersionId, setCompareVersionId] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const abortRef = useRef<{ cancelled: boolean } | null>(null);

  // `watchDrag: false` desativa o swipe horizontal do Embla. Sem isso, o
  // carousel captura o pointerdown antes do BeforeAfter dentro dele e o
  // slider 'antes/depois' nunca recebia o drag. Navegacao entre variations
  // continua funcionando pelos botoes ChevronLeft/ChevronRight.
  const [emblaRef, embla] = useEmblaCarousel({
    loop: false,
    align: "start",
    watchDrag: false,
  });
  const [waOpen, setWaOpen] = useState(false);
  // Lote 8 — upsell "Salvar Imagem em HD".
  const [hdLeadOpen, setHdLeadOpen] = useState(false);
  // Banner CTA "Quero executar este projeto" — pós-geração, conecta com arquiteto.
  const [executarOpen, setExecutarOpen] = useState(false);
  // Plano pago confiável: credits.plan vem do getUserCredits (user_roles +
  // user_credits). Sem credits ou plan "free" → tratado como Free (fallback seguro).
  const isPaidUser = !!credits && credits.plan !== "free";
  const handleHdSave = (resultUrl: string) => {
    if (isPaidUser) {
      window.open(resultUrl, "_blank", "noopener,noreferrer");
    } else {
      setHdLeadOpen(true);
    }
  };
  // Remember the carousel slot we want to restore to after embla reinitializes
  // (e.g. when variations are restored from a draft or a version snapshot).
  const pendingScrollIdx = useRef<number | null>(null);

  useEffect(() => {
    if (!embla) return;
    const onSel = () => setActiveIdx(embla.selectedScrollSnap());
    embla.on("select", onSel);
    return () => {
      embla.off("select", onSel);
    };
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    embla.reInit();
    // After reinit, restore the previously active slide if requested.
    if (pendingScrollIdx.current != null && variations.length > 0) {
      const target = Math.min(pendingScrollIdx.current, variations.length - 1);
      // jumpTo (second arg true) → no animation, feels like a real "restore"
      embla.scrollTo(target, true);
      setActiveIdx(target);
      pendingScrollIdx.current = null;
    }
  }, [embla, variations.length]);

  // Load drafts whenever the modal opens
  useEffect(() => {
    if (open) {
      // Promove drafts presos em "generating" ha mais de 2min para
      // "interrupted". Acontece quando o user fecha o modal/navegador
      // durante a geracao — o autosave gravou status="generating" e
      // nada nunca atualizou. Sem isso, o card aparece "Gerando" pra
      // sempre, confundindo o usuario.
      const STALE_MS = 2 * 60 * 1000;
      const now = Date.now();
      listDrafts().forEach((d) => {
        if (d.status === "generating" && now - d.updatedAt > STALE_MS) {
          upsertDraft({ ...d, status: "interrupted" });
        }
      });
      setDrafts(listDrafts());
      track("start_project");
      track("upload_modal_opened");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Autosave current work as a draft (debounced via stage transitions)
  useEffect(() => {
    if (!preview || !draftId) return;
    const styleName = STYLES.find((s) => s.id === style)?.name;
    const status: Draft["status"] =
      stage === "done"
        ? "done"
        : stage === "uploading" || stage === "generating"
          ? "generating"
          : "draft";
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
        ? variations.map((v) => ({
            url: v.url,
            style: v.style,
            styleName: v.styleName,
            label: v.label,
            roomType: v.roomType,
          }))
        : undefined,
      meta: meta ?? undefined,
      progress,
      title: `${styleName ?? "Projeto"} · ${new Date().toLocaleDateString("pt-BR")}`,
      activeIdx,
    };
    // Preserve original createdAt if existing
    const existing = listDrafts().find((d) => d.id === draftId);
    if (existing) draft.createdAt = existing.createdAt;
    // Preserve version history written by pushVersion
    if (existing?.versions) {
      draft.versions = existing.versions;
      draft.activeVersionId = existing.activeVersionId;
    }
    upsertDraft(draft);
    setDrafts(listDrafts());
  }, [preview, variations, style, stage, progress, meta, draftId, activeIdx]);

  // Mensagens rotativas durante a geração: ciclam a cada 450ms enquanto
  // stage === "generating". Reseta o índice ao sair do estado de geração.
  useEffect(() => {
    if (stage !== "generating") {
      setMsgIdx(0);
      return;
    }
    const id = window.setInterval(() => {
      setMsgIdx((i) => (i + 1) % GENERATING_MESSAGES.length);
    }, 450);
    return () => window.clearInterval(id);
  }, [stage]);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setMeta(null);

    // Tracking: arquivo selecionado pelo user (antes da validação). Apenas
    // metadados — NUNCA o conteúdo binário ou nome do arquivo (PII).
    track("upload_file_selected", {
      size_kb: Math.round(file.size / 1024),
      mime: file.type || "unknown",
    });

    if (!file.type.startsWith("image/")) {
      setError("Formato não suportado. Envie uma imagem (JPG, PNG ou WebP).");
      track("upload_file_error", { reason: "invalid_format", mime: file.type || "unknown" });
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`Imagem muito grande. Máximo ${MAX_FILE_MB}MB.`);
      track("upload_file_error", {
        reason: "file_too_large",
        size_mb: Math.round(file.size / 1024 / 1024),
      });
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
      track("image_uploaded");
      setProgress(100);
      setTimeout(() => {
        setStage("idle");
        setProgress(0);
      }, 250);
    } catch (e) {
      setError("Não conseguimos preparar essa imagem. Tente outra foto.");
      setStage("error");
      track("upload_file_error", { reason: "compression_failed" });
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  // Quando o modal abre com `initialFile` (vem da dropzone do Hero via
  // drag-and-drop), processa automaticamente pelo mesmo `handleFile` que
  // o input file dispara — preservando validações de MIME e tamanho.
  // `initialFileRef` evita reprocessar o mesmo arquivo em re-renders.
  const initialFileRef = useRef<File | null>(null);
  useEffect(() => {
    if (open && initialFile && initialFile !== initialFileRef.current) {
      initialFileRef.current = initialFile;
      void handleFile(initialFile);
    } else if (!open) {
      initialFileRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialFile]);

  const variationLabels = ["Opção A", "Opção B", "Opção C", "Opção D"];

  const generate = async (count: number = 1, reset: boolean = false) => {
    if (!preview) return;
    if (!user) {
      // Marca pra home reabrir o modal de upload quando o usuário voltar logado.
      try {
        window.sessionStorage.setItem("is_resume_create", "1");
      } catch {
        /* ignore */
      }
      track("start_project_blocked_by_auth");
      toast.error("Crie sua conta grátis para gerar. Leva 30 segundos.");
      // Preserva contexto: usuário volta pra rota de onde clicou em vez
      // de cair na home. URL carrega redirect+sourceAction (essencial);
      // sessionStorage guarda metadata pra futuras integrações.
      const returnTo = typeof window !== "undefined" ? window.location.pathname : "/";
      saveReturnContext({ returnTo, sourceAction: "upload_photo" });
      navigate({
        to: "/login",
        search: { redirect: returnTo, sourceAction: "upload_photo", mode: "signup" },
      });
      return;
    }
    if (credits && !credits.unlimited && credits.balance < count) {
      toast.error(
        count === 1
          ? "Você não tem créditos. Veja os planos para continuar gerando."
          : `Você precisa de ${count} créditos para gerar ${count} variações.`,
      );
      return;
    }
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

    // Tracking: início da geração. `startedAt` captura o ms pra calcular
    // duration_ms no sucesso/falha. variation_count distingue 1ª geração
    // de "gerar mais variações" (que mantém variations existentes).
    const startedAt = Date.now();
    track("generation_started", {
      style,
      room_hint: roomHint,
      variation_count: count,
      reset,
    });

    try {
      const tasks = Array.from({ length: count }, (_, i) =>
        transformImage({
          data: { imageDataUrl: preview, style, variant: startIdx + i, roomTypeHint: roomHint },
        })
          .then((out) => {
            if (ticket.cancelled) return null;
            if (out.creditsLeft !== null) setBalance(out.creditsLeft);
            if (out.error || !out.imageDataUrl) {
              throw new Error(out.error ?? "Não foi possível gerar agora.");
            }
            const v: Variation = {
              id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
              url: out.imageDataUrl,
              style,
              styleName,
              label: variationLabels[(startIdx + i) % variationLabels.length],
              roomType: out.roomType,
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
          }),
      );
      const results = await Promise.allSettled(tasks);
      if (ticket.cancelled) return;
      const anySuccess = results.some((r) => r.status === "fulfilled" && r.value);
      const firstError = results.find((r) => r.status === "rejected") as
        | PromiseRejectedResult
        | undefined;
      if (!anySuccess && firstError) {
        const reason = firstError.reason?.message ?? "unknown";
        setError(firstError.reason?.message ?? "Não foi possível gerar agora.");
        setStage("error");
        setProgress(0);
        track("generation_failed", {
          style,
          room_hint: roomHint,
          reason: reason.slice(0, 100),
          duration_ms: Date.now() - startedAt,
        });
        return;
      }
      setProgress(100);
      setStage("done");
      // Mantém `image_generated` (funil legado de admin) + adiciona o
      // `generation_succeeded` mais rico (com duração + room detectado).
      const succeededCount = results.filter(
        (r) => r.status === "fulfilled" && r.value,
      ).length;
      const firstFulfilled = results.find(
        (r): r is PromiseFulfilledResult<Variation | null> =>
          r.status === "fulfilled" && r.value !== null,
      );
      track("image_generated", { style });
      track("generation_succeeded", {
        style,
        room_hint: roomHint,
        detected_room: firstFulfilled?.value?.roomType ?? null,
        success_count: succeededCount,
        requested_count: count,
        duration_ms: Date.now() - startedAt,
      });
      // Snapshot this generation as a new version in the project history.
      if (draftId) {
        const justGenerated = results
          .filter((r): r is PromiseFulfilledResult<Variation | null> => r.status === "fulfilled")
          .map((r) => r.value)
          .filter((v): v is Variation => !!v);
        const snapshotVars: Variation[] = reset ? justGenerated : [...variations, ...justGenerated];
        const version: DraftVersion = {
          id: newVersionId(),
          createdAt: Date.now(),
          style,
          styleName,
          results: snapshotVars.map((v) => ({
            url: v.url,
            style: v.style,
            styleName: v.styleName,
            label: v.label,
            roomType: v.roomType,
          })),
          note: `${snapshotVars.length} ${snapshotVars.length === 1 ? "variação" : "variações"} · ${styleName ?? style}`,
          activeIdx: reset ? 0 : variations.length,
        };
        pushVersion(draftId, version);
        const fresh = listDrafts().find((d) => d.id === draftId);
        setVersions(fresh?.versions ?? []);
        setActiveVersionId(version.id);
        setDrafts(listDrafts());
      }
    } catch (e: unknown) {
      if (ticket.cancelled) return;
      const message =
        e instanceof Error ? e.message : "Não foi possível gerar agora. Tente novamente.";
      setError(message);
      setStage("error");
      setProgress(0);
      track("generation_failed", {
        style,
        room_hint: roomHint,
        reason: message.slice(0, 100),
        duration_ms: Date.now() - startedAt,
      });
    } finally {
      // Para o tick animado: ele checa ticket.cancelled antes de chamar
      // setStage. Sem isso, em gerações rápidas (Gemini < 5-7s) o tick
      // sobrescreve o setStage("done") e deixa o botão "Gerando…" preso.
      ticket.cancelled = true;
    }
  };

  const reset = () => {
    if (abortRef.current) abortRef.current.cancelled = true;
    setPreview(null);
    setVariations([]);
    setActiveIdx(0);
    setPendingCount(0);
    setDoneCount(0);
    setDraftId(null);
    setVersions([]);
    setActiveVersionId(null);
    setCompareVersionId(null);
    setStage("idle");
    setProgress(0);
    setError(null);
    setMeta(null);
  };

  const resumeDraft = (d: Draft) => {
    setPreview(d.preview);
    const legacy = d.result
      ? [
          {
            id: "legacy",
            url: d.result,
            style: d.style,
            styleName: d.styleName,
            label: variationLabels[0],
          } as Variation,
        ]
      : [];
    const restored: Variation[] = d.results?.length
      ? d.results.map((r, i) => ({
          id: `r_${i}`,
          url: r.url,
          style: r.style,
          styleName: r.styleName,
          label: r.label ?? variationLabels[i % variationLabels.length],
          roomType: r.roomType,
        }))
      : legacy;
    setVariations(restored);
    const restoredIdx = Math.min(Math.max(0, d.activeIdx ?? 0), Math.max(0, restored.length - 1));
    setActiveIdx(restoredIdx);
    pendingScrollIdx.current = restoredIdx;
    setStyle(normalizeStyle(d.style));
    setMeta(d.meta ?? null);
    setDraftId(d.id);
    setVersions(d.versions ?? []);
    setActiveVersionId(d.activeVersionId ?? d.versions?.[d.versions.length - 1]?.id ?? null);
    setCompareVersionId(null);
    setStage(d.status === "done" ? "done" : "idle");
    setProgress(d.status === "done" ? 100 : 0);
    setError(null);
  };

  const removeDraft = (id: string) => {
    deleteDraft(id);
    setDrafts(listDrafts());
    if (draftId === id) reset();
  };

  const loadVersion = (vid: string) => {
    const v = versions.find((x) => x.id === vid);
    if (!v) return;
    setActiveVersionId(vid);
    setCompareVersionId(null);
    const restored = v.results.map((r, i) => ({
      id: `${vid}_${i}`,
      url: r.url,
      style: r.style,
      styleName: r.styleName,
      label: r.label ?? variationLabels[i % variationLabels.length],
      roomType: r.roomType,
    }));
    setVariations(restored);
    const restoredIdx = Math.min(Math.max(0, v.activeIdx ?? 0), Math.max(0, restored.length - 1));
    setActiveIdx(restoredIdx);
    pendingScrollIdx.current = restoredIdx;
    setStyle(normalizeStyle(v.style));
    // Persist active version pointer
    if (draftId) {
      const existing = listDrafts().find((d) => d.id === draftId);
      if (existing)
        upsertDraft({
          ...existing,
          activeVersionId: vid,
          activeIdx: restoredIdx,
          updatedAt: Date.now(),
        });
    }
  };

  const compareVersion = versions.find((v) => v.id === compareVersionId) ?? null;

  const close = (o: boolean) => {
    onOpenChange(o);
    if (!o) setTimeout(reset, 250);
  };

  const generating = stage === "uploading" || stage === "generating";
  const done = stage === "done";
  const optimizing = stage === "optimizing";
  const stageLabel =
    stage === "uploading"
      ? "Enviando foto otimizada…"
      : stage === "generating"
        ? "Gerando ambiente decorado…"
        : stage === "optimizing"
          ? "Otimizando imagem…"
          : "";

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent
        className={`max-w-[calc(100vw-1.5rem)] rounded-3xl p-0 overflow-hidden border-0 shadow-2xl max-h-[92vh] overflow-y-auto ${
          variations.length > 0 ? "sm:max-w-2xl lg:max-w-5xl" : "sm:max-w-2xl"
        }`}
      >
        <DialogTitle className="sr-only">Criar projeto com IA</DialogTitle>
        <DialogDescription className="sr-only">
          Envie a foto do seu ambiente e gere uma proposta de decoração com inteligência artificial.
        </DialogDescription>
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

          {/* Chip de ambiente pré-selecionado — só aparece quando vem da rota
              /ambientes/<slug>. Vira roomTypeHint enviado pro back. */}
          {roomHint && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs">
              <span className="text-muted-foreground">Ambiente:</span>
              <span className="font-medium text-foreground">{labelForRoom(roomHint)}</span>
            </div>
          )}

          {/* Drafts strip — only when starting fresh */}
          {!preview && drafts.length > 0 && (
            <div className="mt-5 rounded-2xl border bg-card/60 p-3">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  <History className="h-3.5 w-3.5" /> Continue de onde parou
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {drafts.length} salvos neste aparelho
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1 snap-x snap-mandatory">
                {drafts.map((d) => (
                  <div
                    key={d.id}
                    className="relative shrink-0 w-[140px] snap-start rounded-xl overflow-hidden border bg-background group"
                  >
                    <button onClick={() => resumeDraft(d)} className="block w-full text-left">
                      <div className="relative aspect-[4/3] bg-muted">
                        <img
                          src={d.preview}
                          alt={d.title ?? "Rascunho"}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 to-transparent h-12" />
                        <div className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-background/90 backdrop-blur text-[9px] px-1.5 py-0.5 border">
                          {d.status === "done" ? (
                            <>
                              <Check className="h-2.5 w-2.5 text-accent" /> Pronto
                            </>
                          ) : d.status === "generating" ? (
                            <>
                              <Loader2 className="h-2.5 w-2.5 animate-spin text-accent" /> Gerando
                            </>
                          ) : d.status === "interrupted" ? (
                            <>
                              <Clock className="h-2.5 w-2.5 text-muted-foreground" /> Geração
                              interrompida
                            </>
                          ) : (
                            <>
                              <Play className="h-2.5 w-2.5" /> Rascunho
                            </>
                          )}
                        </div>
                        <div className="absolute bottom-1.5 left-1.5 right-1.5 text-[10px] text-background leading-tight">
                          <div className="font-medium truncate">{d.styleName ?? "Projeto"}</div>
                          <div className="opacity-75">{timeAgo(d.updatedAt)}</div>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeDraft(d.id);
                      }}
                      aria-label="Excluir rascunho"
                      className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-background/90 border grid place-items-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground">
                Rascunhos ficam neste navegador/aparelho. Retome a qualquer momento, mesmo offline.
              </p>
            </div>
          )}

          {/* Project workspace: image + side shopping panel */}
          <div
            className={`mt-5 ${variations.length > 0 ? "lg:grid lg:grid-cols-[1.4fr_1fr] lg:gap-5 lg:items-start" : ""}`}
          >
            <div>
              {/* Upload zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
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
                    <div className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-background/85 backdrop-blur text-[10px] px-2.5 py-1 border max-w-[calc(100%-1.5rem)]">
                      <Layers className="h-3 w-3 text-accent shrink-0" />
                      <span className="truncate">
                        {variations[activeIdx]
                          ? formatVariationLabel(
                              variations[activeIdx],
                              activeIdx + 1,
                              variations,
                            )
                          : `Opção ${activeIdx + 1}`}
                      </span>
                      <span className="shrink-0">
                        · {activeIdx + 1}/{variations.length}
                      </span>
                    </div>
                  </>
                ) : preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Sua foto"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    {(generating || optimizing) && (
                      <div className="absolute inset-0 bg-foreground/45 backdrop-blur-[2px] grid place-items-center text-background px-6">
                        <div className="w-full max-w-xs text-center">
                          {/* 5 faixas shimmer — sinal visual de "IA processando". */}
                          {stage === "generating" && (
                            <div className="mx-auto mb-4 max-w-[200px] space-y-1.5">
                              <div className="is-shimmer h-2 w-full rounded bg-background/15" />
                              <div className="is-shimmer h-2 w-[90%] rounded bg-background/15" />
                              <div className="is-shimmer h-2 w-[75%] rounded bg-background/15" />
                              <div className="is-shimmer h-2 w-[85%] rounded bg-background/15" />
                              <div className="is-shimmer h-2 w-[60%] rounded bg-background/15" />
                            </div>
                          )}
                          <div className="flex items-center justify-center gap-2 text-sm">
                            {stage === "generating" ? (
                              <div
                                className="h-5 w-5 shrink-0 rounded-full border-[3px] border-accent/30 border-t-accent animate-spin"
                                style={{ animationDuration: "0.8s" }}
                              />
                            ) : (
                              <Loader2 className="h-4 w-4 animate-spin text-accent" />
                            )}
                            <span aria-live="polite">
                              {stage === "generating" ? GENERATING_MESSAGES[msgIdx] : stageLabel}
                            </span>
                          </div>
                          <Progress value={progress} className="h-1.5 mt-3 bg-background/30" />
                          <div className="mt-1.5 text-[10px] text-background/70">
                            {Math.round(progress)}%
                          </div>
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
                        <span className="text-muted-foreground line-through ml-1">
                          {formatKB(meta.original)}
                        </span>
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
                        Arraste uma foto aqui, ou use a câmera do celular. Otimizamos
                        automaticamente.
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
                          active
                            ? "ring-2 ring-accent border-accent"
                            : "opacity-80 hover:opacity-100"
                        }`}
                        aria-label={formatVariationLabel(v, i + 1, variations)}
                      >
                        <img
                          src={v.url}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <span className="absolute bottom-0 inset-x-0 text-[9px] text-center text-background bg-foreground/70 py-0.5 truncate px-1">
                          {formatVariationLabel(v, i + 1, variations)}
                        </span>
                      </button>
                    );
                  })}
                  {generating &&
                    Array.from({ length: Math.max(0, pendingCount - doneCount) }).map((_, i) => (
                      <div
                        key={`pending_${i}`}
                        className="shrink-0 rounded-xl border w-[88px] aspect-[5/3] bg-muted/60 grid place-items-center"
                      >
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    ))}
                </div>
              )}

              {/* Versions timeline — history of generations for this project */}
              {versions.length > 0 && (
                <div className="mt-4 rounded-2xl border bg-card/60 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> Histórico de versões
                      <span className="text-muted-foreground/70 normal-case tracking-normal">
                        · {versions.length}
                      </span>
                    </div>
                    {versions.length > 1 && (
                      <button
                        onClick={() => {
                          if (compareVersionId) {
                            setCompareVersionId(null);
                            return;
                          }
                          const other = versions
                            .slice()
                            .reverse()
                            .find((v) => v.id !== activeVersionId);
                          setCompareVersionId(other?.id ?? null);
                        }}
                        className={`inline-flex items-center gap-1 text-[10px] rounded-full border px-2 py-1 transition ${
                          compareVersionId
                            ? "bg-accent/10 border-accent text-accent"
                            : "hover:bg-muted"
                        }`}
                      >
                        <GitCompare className="h-3 w-3" />
                        {compareVersionId ? "Sair da comparação" : "Comparar versões"}
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1 snap-x">
                    {versions.map((v, i) => {
                      const isActive = v.id === activeVersionId;
                      const isCompare = v.id === compareVersionId;
                      return (
                        <button
                          key={v.id}
                          onClick={() => {
                            if (compareVersionId && v.id !== activeVersionId) {
                              setCompareVersionId(v.id);
                            } else {
                              loadVersion(v.id);
                            }
                          }}
                          className={`relative shrink-0 snap-start rounded-xl overflow-hidden border w-[110px] text-left transition ${
                            isActive
                              ? "ring-2 ring-accent border-accent"
                              : isCompare
                                ? "ring-2 ring-foreground border-foreground"
                                : "opacity-85 hover:opacity-100"
                          }`}
                        >
                          <div className="relative aspect-[5/3] bg-muted">
                            {v.results[0]?.url ? (
                              <img
                                src={v.results[0].url}
                                alt=""
                                className="absolute inset-0 h-full w-full object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 grid place-items-center text-[10px] text-muted-foreground">
                                vazio
                              </div>
                            )}
                            <div className="absolute top-1 left-1 inline-flex items-center gap-1 rounded-full bg-background/90 backdrop-blur text-[9px] px-1.5 py-0.5 border">
                              v{i + 1}
                            </div>
                            {v.results.length > 1 && (
                              <div className="absolute top-1 right-1 inline-flex items-center gap-0.5 rounded-full bg-background/90 backdrop-blur text-[9px] px-1.5 py-0.5 border">
                                <Layers className="h-2.5 w-2.5" /> {v.results.length}
                              </div>
                            )}
                          </div>
                          <div className="px-2 py-1.5">
                            <div className="text-[10px] font-medium truncate">
                              {v.styleName ?? "Projeto"}
                            </div>
                            <div className="text-[9px] text-muted-foreground">
                              {timeAgo(v.createdAt)}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {compareVersion && activeVersionId && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {[activeVersionId, compareVersion.id].map((vid, col) => {
                        const v = versions.find((x) => x.id === vid)!;
                        const idx = versions.indexOf(v) + 1;
                        return (
                          <div
                            key={vid}
                            className="rounded-xl overflow-hidden border bg-background"
                          >
                            <div className="relative aspect-[5/3] bg-muted">
                              {v.results[0]?.url && (
                                <img
                                  src={v.results[0].url}
                                  alt=""
                                  className="absolute inset-0 h-full w-full object-cover"
                                />
                              )}
                              <div className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-background/90 backdrop-blur text-[10px] px-2 py-0.5 border">
                                {col === 0 ? "A" : "B"} · v{idx}
                              </div>
                            </div>
                            <div className="px-2 py-1.5 flex items-center justify-between">
                              <div className="text-[10px]">
                                <div className="font-medium">{v.styleName ?? "Projeto"}</div>
                                <div className="text-muted-foreground">
                                  {timeAgo(v.createdAt)} · {v.results.length}{" "}
                                  {v.results.length === 1 ? "img" : "imgs"}
                                </div>
                              </div>
                              <button
                                onClick={() => loadVersion(v.id)}
                                className="text-[10px] rounded-full border px-2 py-0.5 hover:bg-muted"
                              >
                                Abrir
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
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

            {/* Curadoria editorial "O Atelier sugere" — complementa a
                shopping list automática com 3 peças narradas pra reforçar
                identidade de estilo e gerar segundo ponto de clique afiliado. */}
            {variations.length > 0 && (
              <AtelierCurated
                styleId={style}
                styleName={STYLES.find((s) => s.id === style)?.name ?? "esse estilo"}
                roomType={variations[activeIdx]?.roomType}
              />
            )}
          </div>

          {/* Banner CTA pós-geração — conecta o usuário com um arquiteto
              real pra executar o projeto que ele acabou de visualizar.
              Renderiza só quando há pelo menos uma variação gerada. */}
          {variations.length > 0 && (
            <div className="mt-5 rounded-2xl bg-accent text-accent-foreground p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="min-w-0">
                <div className="text-base sm:text-lg font-semibold tracking-tight">
                  Quer tirar esse projeto do papel?
                </div>
                <p className="mt-1 text-sm opacity-90">
                  Conectamos você com um arquiteto que vai te chamar no WhatsApp em até 4h úteis.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  track("hero_executar_projeto_click", {
                    style,
                    variation_count: variations.length,
                  });
                  setExecutarOpen(true);
                }}
                className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-full bg-foreground text-background h-11 px-5 text-sm font-semibold hover:bg-foreground/90 transition"
              >
                Quero executar este projeto
              </button>
            </div>
          )}

          {error && (
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Style picker */}
          <div className="mt-5">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">
              Escolha o estilo
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STYLES.map((s) => {
                const active = s.id === style;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setStyle(s.id);
                      // Evento de funil: decisao de estilo é o gatilho do
                      // "começou de verdade" — separado de start_project (abrir modal).
                      track("style_selected", { style: s.id });
                    }}
                    className={`text-left rounded-xl border px-3 py-2.5 transition ${
                      active ? "border-accent bg-accent/8 ring-1 ring-accent" : "hover:bg-muted/60"
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
                  {generating ? "Gerando…" : !user ? "Criar conta para gerar" : "Gerar com IA"}
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
                    variant="outline"
                    onClick={() => handleHdSave(variations[activeIdx].url)}
                    className="h-11 rounded-full px-5 text-sm"
                  >
                    {isPaidUser ? (
                      <Download className="h-4 w-4 mr-1.5" />
                    ) : (
                      <Lock className="h-4 w-4 mr-1.5" />
                    )}
                    Salvar Imagem em HD
                  </Button>
                )}
                {variations[activeIdx] && (
                  <Button
                    type="button"
                    onClick={() => {
                      setWaOpen(true);
                      track("whatsapp_click");
                    }}
                    className="h-11 rounded-full px-5 text-sm bg-[#25D366] hover:bg-[#1ebe5a] text-white"
                  >
                    <MessageCircle className="h-4 w-4 mr-1.5" /> WhatsApp
                  </Button>
                )}
              </>
            )}
            <Button
              variant="outline"
              onClick={() => close(false)}
              className="h-11 rounded-full px-5 text-sm"
            >
              Fechar
            </Button>
          </div>
          {/* Opcao avancada (so na fase pre-resultado): gerar 3 versoes em
              paralelo de uma vez. Link texto pra nao competir visualmente
              com o CTA primario "Gerar com IA". */}
          {variations.length === 0 && (
            <>
              <button
                type="button"
                onClick={() => generate(3, true)}
                disabled={!preview || generating || optimizing}
                className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Layers className="h-3 w-3" />
                Ou gere 3 versões em paralelo
              </button>
              <p className="mt-1 text-[11px] leading-tight text-muted-foreground/80 text-center sm:text-left">
                3 variações de paleta, composição e iluminação ao mesmo tempo
              </p>
            </>
          )}
          {!user && (
            <p className="mt-2 text-[11px] text-muted-foreground text-center sm:text-left">
              Conta gratuita · leva menos de 1 minuto · seu antes/depois fica salvo em Meus
              Projetos.
            </p>
          )}
          {user && credits && (
            <p className="mt-2 text-[11px] text-muted-foreground text-center sm:text-left">
              {credits.unlimited
                ? "Plano ilimitado. Gere quantas vezes precisar."
                : `Você tem ${credits.balance} ${credits.balance === 1 ? "crédito" : "créditos"} · cada geração usa 1.`}
            </p>
          )}
          {variations.length > 0 && (
            <>
              <p className="mt-2 text-xs text-muted-foreground text-center sm:text-left">
                Quer testar outro estilo? Troque abaixo. Tudo fica aqui pra comparar.
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground text-center sm:text-left">
                Arraste o slider sobre a imagem para comparar{" "}
                <span className="font-medium text-foreground">antes</span> e{" "}
                <span className="font-medium text-foreground">depois</span>. Deslize lateralmente
                para ver outras variações.
              </p>
            </>
          )}
          <p className="mt-2 text-[10px] text-muted-foreground">
            Reduzimos a imagem para {MAX_DIMENSION}px e qualidade {Math.round(JPEG_QUALITY * 100)}%
            antes do envio. Uploads até 5× mais rápidos. Suas fotos são privadas.
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
          leadSource="whatsapp-share"
          leadStyle={style}
          leadRoomType={variations[activeIdx]?.roomType}
        />
      )}
      {/* Lote 8 — upsell de download HD para usuário Free (reusa o LeadFormModal). */}
      <LeadFormModal
        open={hdLeadOpen}
        onOpenChange={setHdLeadOpen}
        source="hd-download-upsell"
        planInterest="premium"
        title="Desbloqueie o download em HD"
        description="Faça upgrade para um plano pago e salve suas imagens em alta resolução."
      />
      {/* Variante executar-projeto — conecta o usuário com arquiteto pós-geração.
          projectId ainda não está disponível (transform.functions.ts não retorna);
          dívida técnica pra próxima task. user_id vem do useAuth. */}
      <LeadFormModal
        open={executarOpen}
        onOpenChange={setExecutarOpen}
        source="executar-projeto"
        defaultStyle={style}
        defaultRoomType={variations[activeIdx]?.roomType}
        userId={user?.id}
      />
    </Dialog>
  );
}

/* ------------------------- Shopping panel ------------------------- */

/** Deriva o nome do provider a partir do host da URL de destino (sem PII). */
function affiliateProviderFromUrl(url: string): string {
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host.includes("amazon")) return "amazon";
    if (host.includes("mercadolivre") || host.includes("mercadolibre")) return "mercadolivre";
    if (host.includes("magazinevoce") || host.includes("magazineluiza")) return "magalu";
    if (host.includes("shopee")) return "shopee";
    if (host.includes("google")) return "google_shopping";
    return host.replace(/^www\./, "") || "desconhecido";
  } catch {
    return "desconhecido";
  }
}

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
  const [leadOpen, setLeadOpen] = useState(false);
  const track = useTrack();

  const roomType = variation?.roomType;
  const vid = variation?.id;
  const aiItems = vid ? cache[vid] : undefined;
  const usingFallback = !aiItems;
  // Ordena por prioridade da tag (Essencial > Recomendado > Opcional) tanto
  // pra UI quanto pro PDF, garantindo que os itens de maior impacto visual
  // aparecam primeiro e maximizem a chance de clique afiliado.
  const items: ReadonlyArray<BudgetItem> = sortByPriority(aiItems ?? getShoppingFallback(roomType));

  const fetchList = async () => {
    if (!variation?.url || !vid) return;
    setLoadingId(vid);
    setErrorId(null);
    try {
      const out = await generateShoppingList({
        data: {
          imageDataUrl: variation.url,
          style: styleId,
          styleName,
          roomType,
        },
      });
      setCache((prev) => ({ ...prev, [vid]: out.items }));
      track("shopping_list_loaded");
    } catch {
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
  const projectName = variationLabel ? `${styleName} · ${variationLabel}` : styleName;

  const tagStyles: Record<BudgetItem["tag"], string> = {
    // Paleta editorial: bronze suave para o anchor, neutros para o resto.
    // Evita pastéis saturados (rosa/laranja) que destoam de areia/bronze.
    Essencial: "bg-accent/15 text-accent ring-1 ring-accent/25",
    Recomendado: "bg-foreground/8 text-foreground ring-1 ring-foreground/15",
    Opcional: "bg-muted text-muted-foreground ring-1 ring-border",
  };

  const buyUrl = (name: string) => {
    const links = buildAffiliateLinks(name);
    return (
      (links.find((m) => m.id === "amazon") ?? links[0])?.url ??
      `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(name)}`
    );
  };

  // Lote 6A — registra a intenção de clique de afiliado antes de redirecionar.
  // Fire-and-forget: o tracking nunca bloqueia nem atrasa a abertura do link.
  // `tag` e `position` ajudam a entender quais sao as faixas que convertem mais
  // (essencial costuma converter melhor que opcional, primeiros itens melhor
  // que os de baixo).
  const handleAffiliateClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: BudgetItem,
    url: string,
    position: number,
  ) => {
    // Cliques modificados (ctrl/cmd/shift/alt) seguem o comportamento nativo.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    track("affiliate_click", {
      provider: affiliateProviderFromUrl(url),
      productName: item.name,
      productCategory: item.cat,
      productUrl: url,
      roomType: roomType ?? undefined,
      style: styleId || undefined,
      tag: item.tag,
      position: position + 1,
      source: "shopping_list",
    });
    // window.open síncrono (dentro do gesto) — evita bloqueio de pop-up.
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Lote affiliate-conversion: registra quando o usuario expande a lista
  // (clica em "Ver mais N itens"). Sinal forte de interesse, ajuda a calibrar
  // a quantidade de itens visiveis na primeira dobra.
  const onExpand = () => {
    setUnlocked(true);
    track("shopping_list_expanded", {
      roomType: roomType ?? undefined,
      style: styleId || undefined,
      totalItems: items.length,
    });
  };

  const onDownload = () => {
    generateBudgetPdf({
      project: `Ambiente · ${projectName}`,
      items,
      estimate: total,
    });
    track("pdf_download");
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
                ? "Não conseguimos analisar. Exibindo sugestão padrão."
                : usingFallback
                  ? "Sugestão padrão"
                  : "Gerada a partir do seu ambiente"}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Estimativa
          </div>
          <div className="text-sm font-semibold text-foreground">{total}</div>
          <button
            onClick={fetchList}
            disabled={isLoading || !variation}
            className="mt-1 inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
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
          : visibleItems.map((it, idx) => (
              <li key={it.name}>
                <a
                  href={buyUrl(it.name)}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  onClick={(e) => handleAffiliateClick(e, it, buyUrl(it.name), idx)}
                  className="flex items-start justify-between gap-3 rounded-lg px-1 py-2.5 transition-colors hover:bg-muted/60"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`shrink-0 text-[10px] font-semibold uppercase tracking-wider rounded-full px-2 py-0.5 ${tagStyles[it.tag]}`}
                      >
                        {it.tag}
                      </span>
                      <span
                        className={`text-sm truncate ${it.tag === "Essencial" ? "font-semibold" : "font-medium"}`}
                      >
                        {it.name}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{it.cat}</div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-0.5">
                    <span className="text-xs font-medium whitespace-nowrap">{it.price}</span>
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-accent">
                      Ver na loja <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </a>
              </li>
            ))}
      </ul>

      <p className="mt-2 px-1 text-[10px] leading-relaxed text-muted-foreground">
        Sugestões aproximadas pelo estilo do ambiente, sem garantia de produto idêntico. Os links
        levam para a busca em lojas parceiras e alguns podem gerar comissão para o Ideal Space, sem
        custo a mais para você.
      </p>

      {!unlocked && items.length > visibleItems.length && (
        <button
          onClick={onExpand}
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

      {/* Isca de conversão — orçamento + lista completa com a equipe */}
      <div className="mt-3 rounded-xl border border-accent/30 bg-accent/5 p-3.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-accent">
          <Sparkles className="h-3.5 w-3.5" /> Receba a lista completa de compras
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
          A nossa equipe envia o orçamento detalhado e a lista completa deste ambiente pelo
          WhatsApp.
        </p>
        <button
          type="button"
          onClick={() => setLeadOpen(true)}
          className="mt-2.5 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent py-2.5 text-xs font-semibold text-accent-foreground hover:opacity-95 transition"
        >
          <MessageCircle className="h-3.5 w-3.5" /> Receber orçamento por WhatsApp
        </button>
      </div>

      <LeadFormModal
        open={leadOpen}
        onOpenChange={setLeadOpen}
        source="shopping-list"
        defaultRoomType={roomType}
        defaultStyle={styleId}
        title="Solicitar orçamento completo"
        description="Deixe seus dados e a nossa equipe envia um orçamento detalhado deste ambiente pelo WhatsApp."
      />
    </aside>
  );
}
