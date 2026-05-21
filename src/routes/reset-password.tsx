import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IdealSpaceLogo } from "@/components/IdealSpaceLogo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nova senha — Ideal Space" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Supabase entrega a sessão via fragment quando o user clica no link do
  // e-mail; getSession() resolve assim que o cliente processa.
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setHasSession(!!data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === "PASSWORD_RECOVERY" || s) setHasSession(true);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      toast.success("Senha atualizada!");
      setTimeout(() => navigate({ to: "/" }), 1200);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao atualizar a senha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-10 md:px-8">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-lg md:p-8">
          <div className="mb-6 text-center">
            <div className="mb-5 flex justify-center">
              <IdealSpaceLogo />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Definir nova senha
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Escolha uma senha forte com pelo menos 6 caracteres.
            </p>
          </div>

          {!ready ? (
            <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Carregando…
            </div>
          ) : !hasSession ? (
            <div className="rounded-2xl border border-amber-400/40 bg-amber-400/10 p-5 text-center">
              <p className="text-sm font-semibold text-foreground">Link inválido ou expirado.</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Solicite um novo link de recuperação.
              </p>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link to="/login">Voltar para entrar</Link>
              </Button>
            </div>
          ) : done ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground">
                Senha atualizada com sucesso!
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground">Redirecionando…</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">Nova senha</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div>
                <Label htmlFor="confirm">Confirmar nova senha</Label>
                <Input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repita a senha"
                />
              </div>
              <Button type="submit" disabled={loading} className="h-11 w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar nova senha"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
