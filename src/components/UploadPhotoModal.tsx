import { useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Sparkles, X, Wand2, ImageIcon, Check } from "lucide-react";

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

export function UploadPhotoModal({ open, onOpenChange }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [style, setStyle] = useState<string>("japandi");
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
    setDone(false);
  };

  const generate = () => {
    if (!preview) return;
    setGenerating(true);
    setDone(false);
    window.setTimeout(() => {
      setGenerating(false);
      setDone(true);
    }, 1800);
  };

  const reset = () => {
    setPreview(null);
    setDone(false);
    setGenerating(false);
  };

  const close = (o: boolean) => {
    onOpenChange(o);
    if (!o) setTimeout(reset, 250);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent
        className="max-w-[calc(100vw-1.5rem)] sm:max-w-2xl rounded-3xl p-0 overflow-hidden border-0 shadow-2xl max-h-[92vh] overflow-y-auto"
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
            Tire uma foto ou envie uma imagem. A IA cria uma versão decorada com lista de compras.
          </p>

          {/* Upload zone */}
          <div className="mt-5 relative rounded-2xl border border-dashed bg-muted/40 overflow-hidden aspect-[5/3]">
            {preview ? (
              <>
                <img src={preview} alt="Sua foto" className="absolute inset-0 h-full w-full object-cover" />
                {generating && (
                  <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px] grid place-items-center text-background">
                    <div className="flex items-center gap-2 text-sm">
                      <Sparkles className="h-4 w-4 animate-pulse text-accent" /> Gerando ambiente decorado…
                    </div>
                  </div>
                )}
                {done && !generating && (
                  <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-accent text-accent-foreground text-[10px] uppercase tracking-widest px-2.5 py-1">
                    <Check className="h-3 w-3" /> Pronto
                  </div>
                )}
                <button
                  onClick={reset}
                  className="absolute bottom-3 left-3 rounded-full bg-background/85 backdrop-blur text-xs px-3 py-1.5 border"
                >
                  Trocar foto
                </button>
              </>
            ) : (
              <div className="absolute inset-0 grid place-items-center text-center px-6">
                <div>
                  <div className="mx-auto h-12 w-12 rounded-2xl bg-accent/15 text-accent grid place-items-center">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Use uma foto do ambiente — vazio ou já mobiliado — em boa luz.
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
                </div>
              </div>
            )}

            <input
              ref={cameraInput}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>

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
            <Button
              onClick={generate}
              disabled={!preview || generating}
              className="h-11 rounded-full bg-foreground text-background hover:bg-foreground/90 px-5 text-sm flex-1"
            >
              <Wand2 className="h-4 w-4 mr-1.5" />
              {generating ? "Gerando…" : done ? "Gerar nova variação" : "Gerar com IA"}
            </Button>
            <Button variant="outline" onClick={() => close(false)} className="h-11 rounded-full px-5 text-sm">
              Fechar
            </Button>
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">
            Suas fotos são privadas e usadas apenas para gerar seu projeto. Você pode excluir a qualquer momento.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}