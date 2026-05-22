import { useEffect, useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageCircle, ShieldCheck, AlertCircle, Download } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  imageUrl?: string;
  downloadName?: string;
};

// Brazilian phone: 10–11 digits (DDD + número), aceita também com 55 prefixo
const phoneSchema = z
  .string()
  .trim()
  .min(10, { message: "Informe DDD + número (mín. 10 dígitos)." })
  .max(20, { message: "Número muito longo." })
  .transform((v) => v.replace(/\D/g, ""))
  .refine((d) => d.length === 10 || d.length === 11 || d.length === 12 || d.length === 13, {
    message: "Número inválido. Use DDD + número (com ou sem 55).",
  });

const formSchema = z.object({
  phone: phoneSchema,
  consent: z.literal(true, {
    errorMap: () => ({ message: "Você precisa autorizar o uso do seu número." }),
  }),
});

const CONSENT_KEY = "is_wa_consent";

function formatBR(d: string) {
  // Display only — não normaliza para envio
  const v = d.replace(/\D/g, "").slice(0, 15);
  if (v.length <= 2) return v;
  if (v.length <= 6) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
  if (v.length <= 10) return `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
  return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7, 11)}`;
}

export function WhatsAppShareDialog({
  open,
  onOpenChange,
  projectName,
  imageUrl,
  downloadName,
}: Props) {
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    try {
      const saved = window.localStorage.getItem(CONSENT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { phone?: string; consent?: boolean };
        if (parsed.phone) setPhone(formatBR(parsed.phone));
        if (parsed.consent) setConsent(true);
      }
    } catch {
      /* ignore */
    }
  }, [open]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = formSchema.safeParse({ phone, consent });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Dados inválidos.");
      return;
    }
    let digits = parsed.data.phone;
    if (digits.length === 10 || digits.length === 11) digits = "55" + digits;

    try {
      window.localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({ phone: digits, consent: true, ts: Date.now() }),
      );
    } catch {
      /* ignore */
    }

    const msg =
      `Olá! Acabei de gerar um projeto no Ideal Space: ${projectName}. ` +
      `Veja o antes e depois decorado pela IA. ` +
      `(Imagem em anexo — basta tocar no clipe 📎 e selecionar o arquivo baixado.)`;
    const url = `https://wa.me/${encodeURIComponent(digits)}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-[#25D366]/15 text-[#128C7E] grid place-items-center">
              <MessageCircle className="h-4 w-4" />
            </span>
            Enviar no WhatsApp
          </DialogTitle>
          <DialogDescription>
            Vamos abrir o WhatsApp com uma mensagem pronta sobre o seu projeto{" "}
            <span className="font-medium text-foreground">{projectName}</span>.
          </DialogDescription>
        </DialogHeader>

        {imageUrl && (
          <div className="rounded-2xl border bg-muted/40 p-3 flex items-center gap-3">
            <img src={imageUrl} alt="" className="h-14 w-20 rounded-lg object-cover border" />
            <div className="text-xs text-muted-foreground leading-relaxed flex-1">
              O WhatsApp não permite anexar imagens automaticamente. Baixe primeiro e anexe na
              conversa.
            </div>
            <a
              href={imageUrl}
              download={downloadName ?? "ideal-space.png"}
              className="inline-flex h-8 items-center gap-1 rounded-full bg-foreground text-background px-3 text-[11px] hover:bg-foreground/90 shrink-0"
            >
              <Download className="h-3 w-3" /> Baixar
            </a>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <Label htmlFor="wa-phone" className="text-xs">
              Seu WhatsApp
            </Label>
            <Input
              id="wa-phone"
              inputMode="tel"
              autoComplete="tel"
              placeholder="(11) 91234-5678"
              value={phone}
              maxLength={20}
              onChange={(e) => setPhone(formatBR(e.target.value))}
              className="mt-1 h-11 rounded-xl"
            />
            <p className="mt-1 text-[10px] text-muted-foreground">
              Adicionamos o código do país (+55) automaticamente.
            </p>
          </div>

          <label className="flex items-start gap-2.5 rounded-xl border bg-card/60 p-3 cursor-pointer">
            <Checkbox
              checked={consent}
              onCheckedChange={(v) => setConsent(v === true)}
              className="mt-0.5"
            />
            <span className="text-[11px] text-muted-foreground leading-relaxed">
              <ShieldCheck className="inline h-3 w-3 mr-1 text-accent" />
              Autorizo o Ideal Space a usar meu número exclusivamente para enviar este projeto e
              mensagens relacionadas. Posso revogar a qualquer momento. Conforme a{" "}
              <span className="text-foreground font-medium">LGPD (Lei 13.709/18)</span>.
            </span>
          </label>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button
              type="submit"
              className="flex-1 h-11 rounded-full bg-[#25D366] hover:bg-[#1ebe5a] text-white"
            >
              <MessageCircle className="h-4 w-4 mr-1.5" /> Abrir WhatsApp
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 rounded-full px-5"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
