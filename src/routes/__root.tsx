import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">Esta página não existe ou foi movida.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Algo deu errado</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ocorreu um erro inesperado. Tente recarregar a página ou volte ao início.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ideal Space | Design de interiores com IA" },
      {
        name: "description",
        content:
          "Plataforma de design de interiores com IA. Transforme ambientes vazios em espaços decorados e veja o antes e depois do seu cômodo em poucos minutos.",
      },
      { name: "author", content: "Ideal Space" },
      { property: "og:title", content: "Ideal Space | Design de interiores com IA" },
      {
        property: "og:description",
        content:
          "Envie a foto do seu ambiente e receba uma versão decorada com IA, com lista de compras e orçamento estimado.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://idealspace.com.br" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Ideal Space | Design de interiores com IA" },
      {
        name: "twitter:description",
        content:
          "Decoração com IA: foto antes e depois, lista de compras e orçamento estimado para o seu ambiente.",
      },
      { property: "og:image", content: "https://idealspace.com.br/og-image.jpg" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Ideal Space | Design de interiores com IA" },
      { property: "og:site_name", content: "Ideal Space" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:image", content: "https://idealspace.com.br/og-image.jpg" },
      { name: "twitter:image:alt", content: "Ideal Space | Design de interiores com IA" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/icon-192.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

/**
 * Em SSR, lê env vars do Worker runtime (Cloudflare expõe via process.env)
 * e injeta em `window.__SUPABASE_ENV__` antes do bundle do client rodar.
 *
 * Por que isto existe: o Vite faz string replacement de `import.meta.env.VITE_*`
 * apenas em build-time. Se as vars não estiverem disponíveis ao bundler do
 * Cloudflare Workers Builds (estão como runtime vars, não build vars), o
 * client.ts vê `undefined` e dispara o erro "Missing Supabase environment
 * variable(s)".
 *
 * Esta injeção via SSR torna o client independente de build-time replacement —
 * ele lê em runtime do `window.__SUPABASE_ENV__` populado aqui.
 *
 * Só o anon key + URL são expostos (já são públicos por design do Supabase).
 * O service_role NUNCA aparece aqui — fica apenas no server fn handlers.
 */
/**
 * Fallback público hardcoded — URL e ANON key do Supabase do projeto
 * `tuftobschhomtwsuerus`. A anon key é PÚBLICA por design do Supabase
 * (qualquer client browser que loga vê — RLS protege os dados, não a
 * key). Usada apenas como último recurso quando o runtime do Worker
 * não expõe as vars via process.env.
 *
 * NÃO inclui service_role nem GOOGLE_AI_API_KEY — esses continuam só
 * como Cloudflare Runtime Secrets.
 */
const PUBLIC_SUPABASE_FALLBACK = {
  url: "https://tuftobschhomtwsuerus.supabase.co",
  key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1ZnRvYnNjaGhvbXR3c3VlcnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5Nzg2MDEsImV4cCI6MjA5NDU1NDYwMX0._Ej0gmZOwxVBQCTGqvAX578MN7KxVm6ILg1uRgaMqVQ",
};

function readPublicSupabaseEnv() {
  if (typeof window !== "undefined") {
    // Em hidration no client, lê o valor já populado pelo SSR pra preservar
    // o mesmo HTML output (evita hydration mismatch).
    type WinEnv = Window & {
      __SUPABASE_ENV__?: { url?: string; key?: string };
    };
    const w = window as WinEnv;
    return {
      url: w.__SUPABASE_ENV__?.url || PUBLIC_SUPABASE_FALLBACK.url,
      key: w.__SUPABASE_ENV__?.key || PUBLIC_SUPABASE_FALLBACK.key,
    };
  }
  // SSR: lê do runtime do Worker. Cloudflare permite cadastrar vars com
  // nomes diferentes (com/sem prefixo VITE_, NEXT_PUBLIC_, PUBLIC_) — tenta
  // todos pra evitar exigir reconfiguração manual no dashboard.
  const env = typeof process !== "undefined" ? process.env ?? {} : {};
  const url =
    env.SUPABASE_URL ||
    env.VITE_SUPABASE_URL ||
    env.NEXT_PUBLIC_SUPABASE_URL ||
    env.PUBLIC_SUPABASE_URL ||
    PUBLIC_SUPABASE_FALLBACK.url;
  const key =
    env.SUPABASE_PUBLISHABLE_KEY ||
    env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    env.SUPABASE_ANON_KEY ||
    env.VITE_SUPABASE_ANON_KEY ||
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    env.PUBLIC_SUPABASE_ANON_KEY ||
    PUBLIC_SUPABASE_FALLBACK.key;
  return { url, key };
}

function RootShell({ children }: { children: React.ReactNode }) {
  const env = readPublicSupabaseEnv();
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
        {/* Bootstrap das env vars públicas do Supabase. Renderizado em
            SSR e no hydration do cliente com o mesmo conteúdo. */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `window.__SUPABASE_ENV__=${JSON.stringify(env)};`,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
