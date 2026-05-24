import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Copy, MessageCircle, Globe, Lock, Check, AlertCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { toggleProjectPublic } from "@/lib/projects.functions";
import { logEvent } from "@/lib/tracking.functions";
import { WhatsAppShareDialog } from "@/components/WhatsAppShareDialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** ID do projeto que sera tornado publico. */
  projectId: string;
  /** Nome amigavel exibido no header do dialog. */
  projectName: string;
  /** Estado inicial. Atualiza otimisticamente ao alternar. */
  initialIsPublic: boolean;
  /** Callback invocado quando o estado muda no servidor. */
  onPublicChange?: (next: boolean) => void;
};

/**
 * Dialog de compartilhamento de projeto. Faz 2 coisas:
 * 1) Permite tornar publico (opt-in LGPD explicito);
 * 2) Quando publico, mostra link pra copiar + acesso ao share via WhatsApp.
 *
 * NUNCA expoe a foto original do usuario na pagina publica — so o resultado
 * gerado pela IA. Disclaimer explicito no dialog.
 */
export function ShareProjectDialog({
  open,
  onOpenChange,
  projectId,
  projectName,
  initialIsPublic,
  onPublicChange,
}: Props) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [pending, setPending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [waOpen, setWaOpen] = useState(false);
  const toggle = useServerFn(toggleProjectPublic);
  const track = useServerFn(logEvent);

  useEffect(() => {
    if (open) setIsPublic(initialIsPublic);
  }, [open, initialIsPublic]);

  const publicUrl =
    typeof window !== "undefined" ? `${window.location.origin}/p/${projectId}` : `/p/${projectId}`;

  const onToggle = async (next: boolean) => {
    if (pending) return;
    setPending(true);
    setIsPublic(next); // otimista
    try {
      await toggle({ data: { id: projectId, isPublic: next } });
      onPublicChange?.(next);
      void track({
        data: {
          event: next ? "project_made_public" : "project_made_private",
          props: { projectId },
        },
      }).catch(() => {});
      toast.success(next ? "Projeto agora é público." : "Projeto voltou a ser privado.");
    } catch (e) {
      setIsPublic(!next); // rollback
      const msg = e instanceof Error ? e.message : "Não foi possível atualizar a visibilidade.";
      toast.error(msg);
    } finally {
      setPending(false);
    }
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      void track({
        data: { event: "share_link_copied", props: { projectId } },
      }).catch(() => {});
      toast.success("Link copiado.");
    } catch {
      toast.error("Não foi possível copiar. Selecione o link manualmente.");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              {isPublic ? (
                <Globe className="h-5 w-5 text-accent" />
              ) : (
                <Lock className="h-5 w-5 text-muted-foreground" />
              )}
              Compartilhar projeto
            </DialogTitle>
            <DialogDescription>
              Gere um link público para mostrar{" "}
              <span className="font-medium text-foreground">{projectName}</span> a qualquer pessoa,
              mesmo sem conta no Ideal Space.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-2xl border bg-card/60 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-medium text-foreground">
                  {isPublic ? "Página pública ativa" : "Tornar público"}
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                  Quem tiver o link verá o antes e depois e a lista de produtos sugeridos. Você pode
                  desligar a qualquer momento.
                </p>
              </div>
              <Switch
                checked={isPublic}
                onCheckedChange={onToggle}
                disabled={pending}
                aria-label="Tornar projeto público"
              />
            </div>

            {isPublic && (
              <div className="mt-4 space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Link público
                </label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={publicUrl}
                    onFocus={(e) => e.currentTarget.select()}
                    className="h-10 rounded-xl text-xs"
                  />
                  <Button
                    type="button"
                    onClick={onCopy}
                    variant="outline"
                    className="h-10 rounded-xl px-3"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Button
                  type="button"
                  onClick={() => setWaOpen(true)}
                  className="mt-2 h-10 w-full rounded-full bg-[#25D366] hover:bg-[#1ebe5a] text-white"
                >
                  <MessageCircle className="h-4 w-4 mr-1.5" /> Enviar pelo WhatsApp
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-accent/30 bg-accent/5 px-3 py-2.5 text-[11px] leading-relaxed text-muted-foreground">
            <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
            <span>
              <span className="font-medium text-foreground">LGPD.</span> Sua foto original{" "}
              <span className="font-medium text-foreground">não</span> aparece na página pública.
              Apenas o resultado gerado pela IA e o estilo escolhido.
            </span>
          </div>

          {!isPublic && (
            <div className="flex items-start gap-2 rounded-xl border bg-muted/30 px-3 py-2.5 text-[11px] text-muted-foreground">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              Ative o botão acima para gerar o link.
            </div>
          )}
        </DialogContent>
      </Dialog>

      <WhatsAppShareDialog
        open={waOpen}
        onOpenChange={setWaOpen}
        projectName={projectName}
        publicUrl={publicUrl}
      />
    </>
  );
}
