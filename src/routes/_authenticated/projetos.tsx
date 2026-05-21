import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { IdealSpaceLogo } from "@/components/IdealSpaceLogo";
import { Loader2, ImageIcon } from "lucide-react";

type ProjectRow = {
  id: string;
  title: string | null;
  style_slug: string | null;
  before_url: string | null;
  after_url: string | null;
  created_at: string;
};

export const Route = createFileRoute("/_authenticated/projetos")({
  head: () => ({
    meta: [{ title: "Meus projetos — Ideal Space" }],
  }),
  component: ProjetosPage,
});

function ProjetosPage() {
  const [projects, setProjects] = useState<ProjectRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, style_slug, before_url, after_url, created_at")
        .order("created_at", { ascending: false });
      if (!active) return;
      if (error) {
        console.error("listar projetos falhou", error);
        setError("Não foi possível carregar seus projetos.");
        setProjects([]);
        return;
      }
      setProjects((data ?? []) as ProjectRow[]);
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 md:px-8">
          <Link to="/" aria-label="Ideal Space — início">
            <IdealSpaceLogo />
          </Link>
          <Link
            to="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Início
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10 md:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Meus projetos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Os ambientes que você gerou com IA ficam salvos aqui.
        </p>

        {projects === null ? (
          <div className="mt-12 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Carregando…
          </div>
        ) : error ? (
          <div className="mt-12 text-center text-sm text-muted-foreground">{error}</div>
        ) : projects.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-border bg-card p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
              <ImageIcon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-semibold text-foreground">
              Você ainda não tem projetos.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Gere seu primeiro ambiente na página inicial.
            </p>
            <Link
              to="/"
              className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Criar meu primeiro ambiente
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
            {projects.map((p) => (
              <div
                key={p.id}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
              >
                <div className="relative aspect-[4/3] bg-muted">
                  {p.after_url && (
                    <img
                      src={p.after_url}
                      alt={p.title ?? "Projeto"}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  {p.before_url && (
                    <img
                      src={p.before_url}
                      alt="Antes da transformação"
                      className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  {p.before_url && (
                    <span className="absolute bottom-2 left-2 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-foreground backdrop-blur">
                      <span className="group-hover:hidden">Depois</span>
                      <span className="hidden group-hover:inline">Antes</span>
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <div className="truncate text-sm font-medium text-foreground">
                    {p.title ?? "Projeto"}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {new Date(p.created_at).toLocaleDateString("pt-BR")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
