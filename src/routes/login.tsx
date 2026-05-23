import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { logEvent } from "@/lib/tracking.functions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleButton } from "@/components/GoogleButton";
import { IdealSpaceLogo } from "@/components/IdealSpaceLogo";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Loader2, ArrowLeft, CheckCircle2, Eye, EyeOff } from "lucide-react";

type Mode = "signin" | "signup" | "forgot";

type LoginMode = "signin" | "signup" | "forgot";
type LoginSearch = { redirect?: string; mode?: LoginMode };

const SAFE_REDIRECT = (raw: unknown): string | undefined => {
  if (typeof raw !== "string" || !raw) return undefined;
  // Só aceita caminhos relativos same-origin — previne open-redirect.
  if (!raw.startsWith("/") || raw.startsWith("//")) return undefined;
  return raw;
};

const VALID_MODES: LoginMode[] = ["signin", "signup", "forgot"];

export const Route = createFileRoute("/login")({
  validateSearch: (search): LoginSearch => ({
    redirect: SAFE_REDIRECT(search.redirect),
    mode: VALID_MODES.includes(search.mode as LoginMode) ? (search.mode as LoginMode) : undefined,
  }),
  beforeLoad: async ({ search }) => {
    // Já autenticado → pula a tela de login e vai pro destino/início.
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      throw redirect({ to: search.redirect ?? "/" });
    }
  },
  head: () => ({
    meta: [
      { title: "Entrar | Ideal Space" },
      {
        name: "description",
        content:
          "Entre ou crie sua conta no Ideal Space para gerar ambientes com IA, salvar projetos e acessar seus favoritos.",
      },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
  component: LoginPage,
});

function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "E-mail ou senha incorretos.";
  if (m.includes("email not confirmed")) return "Confirme seu e-mail antes de entrar.";
  if (m.includes("user already registered") || m.includes("already exists"))
    return "Já existe uma conta com este e-mail. Tente entrar.";
  if (m.includes("password should be at least"))
    return "A senha precisa ter pelo menos 6 caracteres.";
  if (m.includes("pwned") || m.includes("compromised") || m.includes("leaked"))
    return "Essa senha apareceu em vazamentos públicos. Escolha outra mais forte.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Muitas tentativas. Aguarde alguns segundos e tente novamente.";
  if (m.includes("network")) return "Falha de conexão. Verifique sua internet.";
  return message;
}

function passwordStrength(pw: string): { score: 0 | 1 | 2 | 3 | 4; label: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["Muito fraca", "Fraca", "Razoável", "Boa", "Forte"];
  return { score: Math.min(score, 4) as 0 | 1 | 2 | 3 | 4, label: labels[Math.min(score, 4)] };
}

function LoginPage() {
  const navigate = useNavigate();
  const track = useServerFn(logEvent);
  const { user } = useAuth();
  const { redirect: redirectTo, mode: initialMode } = Route.useSearch();
  const dest = redirectTo ?? "/";

  // Belt-and-suspenders ao beforeLoad: em SSR e race de hidratação,
  // supabase.auth.getSession() pode retornar null mesmo com sessão válida
  // no localStorage. Quando o AuthProvider termina de restaurar e `user`
  // materializa, redireciona pro destino — com guard explícito contra
  // /login pra impedir loop.
  useEffect(() => {
    if (!user) return;
    const target = dest && !dest.startsWith("/login") ? dest : "/";
    navigate({ to: target });
  }, [user, dest, navigate]);

  const [mode, setMode] = useState<Mode>(initialMode ?? "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const strength = useMemo(() => passwordStrength(password), [password]);

  const validate = (): string | null => {
    if (mode === "forgot") {
      if (!email.trim()) return "Informe seu e-mail.";
      return null;
    }
    if (!email.trim()) return "Informe seu e-mail.";
    if (!password) return "Informe sua senha.";
    if (mode === "signup") {
      if (password.length < 8) return "A senha precisa ter pelo menos 8 caracteres.";
      if (password !== passwordConfirm) return "As senhas não coincidem.";
    }
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        void track({ data: { event: "signup_started" } }).catch(() => {});
        // emailRedirectTo passa por /auth/callback (processa o code) e depois
        // navega pro `dest` validado. NUNCA direto pra rota privada.
        const redirectUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(dest)}`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
          },
        });
        if (error) throw error;
        // Mensagem genérica anti-enumeração: não confirma se o email é novo ou existente.
        toast.success("Se esse e-mail for novo, te enviamos um link de confirmação.");
        setMode("signin");
      } else if (mode === "forgot") {
        const redirectUrl = `${window.location.origin}/reset-password`;
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectUrl,
        });
        if (error) throw error;
        setForgotSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
        navigate({ to: dest });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao autenticar";
      toast.error(friendlyAuthError(msg));
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setLoading(true);
    try {
      // Sempre via /auth/callback — processa o code do OAuth e navega pro
      // `dest` validado depois. Nunca redirecionar OAuth direto pra rota privada.
      const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(dest)}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: callbackUrl },
      });
      if (error) {
        toast.error("Falha ao entrar com Google", { description: error.message });
        return;
      }
      // signInWithOAuth faz o redirect automático pra accounts.google.com
    } catch (err) {
      toast.error("Falha ao entrar com Google", {
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setLoading(false);
    }
  };

  const heading =
    mode === "signin" ? "Entrar" : mode === "signup" ? "Criar conta" : "Recuperar senha";
  const subtitle =
    mode === "signin"
      ? "Acesse seus projetos e ambientes salvos."
      : mode === "signup"
        ? "É grátis. Sem cartão de crédito."
        : "Vamos enviar um link pro seu e-mail para criar uma nova senha.";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-10 md:px-8">
      <div className="flex w-full max-w-md flex-col items-stretch gap-6">
        <div className="w-full rounded-3xl border border-border bg-card p-6 shadow-lg md:p-8">
          <div className="mb-6 text-center">
            <div className="mb-5 flex justify-center">
              <IdealSpaceLogo />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{heading}</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
          </div>

          {mode === "forgot" && forgotSent ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              {/* Mensagem genérica (OWASP Forgot Password Cheat Sheet):
                  NÃO confirmar se o email existe. Mesma resposta pra qualquer input. */}
              <p className="mt-3 text-sm font-semibold text-foreground">
                Se este e-mail estiver cadastrado, enviaremos um link de redefinição.
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Verifique também a caixa de spam. O link expira em 1 hora.
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-4 w-full"
                onClick={() => {
                  setForgotSent(false);
                  setMode("signin");
                }}
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Voltar para entrar
              </Button>
            </div>
          ) : (
            <>
              {/* Google OAuth — só faz sentido em signin/signup (não em forgot) */}
              {mode !== "forgot" && (
                <>
                  <GoogleButton onClick={onGoogle} loading={loading} />
                  <div className="relative my-5 flex items-center">
                    <div className="flex-1 border-t border-border" />
                    <span className="mx-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      ou
                    </span>
                    <div className="flex-1 border-t border-border" />
                  </div>
                </>
              )}

              <form onSubmit={onSubmit} className="space-y-4" noValidate>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@email.com"
                  />
                </div>
                {mode !== "forgot" && (
                  <div>
                    <div className="flex items-baseline justify-between">
                      <Label htmlFor="password">Senha</Label>
                      {mode === "signin" && (
                        <button
                          type="button"
                          className="text-xs font-medium text-accent hover:underline"
                          onClick={() => setMode("forgot")}
                        >
                          Esqueci minha senha
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete={mode === "signup" ? "new-password" : "current-password"}
                        required
                        minLength={mode === "signup" ? 8 : 6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={mode === "signup" ? "Mínimo 8 caracteres" : "Sua senha"}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                        aria-pressed={showPassword}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {mode === "signup" && password.length > 0 && (
                      <div className="mt-2" aria-live="polite">
                        <div className="flex h-1.5 gap-1">
                          {[0, 1, 2, 3].map((i) => (
                            <span
                              key={i}
                              className={`h-full flex-1 rounded-full transition-colors ${
                                i < strength.score
                                  ? strength.score >= 3
                                    ? "bg-emerald-600"
                                    : strength.score === 2
                                      ? "bg-amber-500"
                                      : "bg-destructive"
                                  : "bg-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="mt-1.5 text-[11px] text-muted-foreground">
                          Força:{" "}
                          <span className="font-semibold text-foreground">{strength.label}</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {mode === "signup" && (
                  <div>
                    <Label htmlFor="password-confirm">Confirmar senha</Label>
                    <Input
                      id="password-confirm"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      placeholder="Repita a senha"
                    />
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className="h-11 w-full"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : mode === "signin" ? (
                    "Entrar"
                  ) : mode === "signup" ? (
                    "Criar conta"
                  ) : (
                    "Enviar link de recuperação"
                  )}
                </Button>
                {mode === "signup" && (
                  <p className="text-center text-xs leading-relaxed text-muted-foreground">
                    Ao criar uma conta você concorda com os{" "}
                    <a
                      href="/legal#termos"
                      className="font-medium text-foreground underline underline-offset-2 hover:text-accent"
                    >
                      Termos de uso
                    </a>{" "}
                    e a{" "}
                    <a
                      href="/legal#privacidade"
                      className="font-medium text-foreground underline underline-offset-2 hover:text-accent"
                    >
                      Política de privacidade
                    </a>
                    .
                  </p>
                )}
              </form>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                {mode === "signin" && (
                  <>
                    Ainda não tem conta?{" "}
                    <button
                      type="button"
                      className="font-semibold text-accent hover:underline"
                      onClick={() => setMode("signup")}
                    >
                      Criar conta
                    </button>
                  </>
                )}
                {mode === "signup" && (
                  <>
                    Já tem conta?{" "}
                    <button
                      type="button"
                      className="font-semibold text-accent hover:underline"
                      onClick={() => setMode("signin")}
                    >
                      Entrar
                    </button>
                  </>
                )}
                {mode === "forgot" && (
                  <button
                    type="button"
                    className="font-semibold text-accent hover:underline"
                    onClick={() => setMode("signin")}
                  >
                    <ArrowLeft className="-mt-0.5 mr-1 inline h-3.5 w-3.5" />
                    Voltar para entrar
                  </button>
                )}
              </p>
            </>
          )}

          <p className="mt-4 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              ← Voltar para o site
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
