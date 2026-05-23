import { Link } from "@tanstack/react-router";
import { IdealSpaceLogo } from "@/components/IdealSpaceLogo";

/**
 * Footer global do Ideal Space. Vivia inline em src/routes/index.tsx —
 * extraido pra componente reutilizavel pra que as landings programaticas
 * (`/ambientes/$slug`, `/estilos/$slug`) e qualquer outra pagina possa
 * reaproveitar sem duplicar markup.
 *
 * Estrutura: 4 colunas (Produto, Recursos, Profissionais, Legal) +
 * 2 navs de landings programaticas (ambiente e estilo) + creditos.
 */
export function Footer() {
  const cols = [
    {
      t: "Produto",
      l: [
        { label: "Criar com IA", href: "/" },
        { label: "Ambientes", href: "#ambientes" },
        { label: "Estilos", href: "#estilos" },
        { label: "Galeria", href: "#galeria" },
        { label: "Planos", href: "/pricing" },
      ],
    },
    {
      t: "Recursos",
      l: [
        { label: "Design 2D", href: "/pricing" },
        { label: "Planejamento 5D", href: "/pricing" },
        { label: "Planta baixa", href: "/pricing" },
        { label: "Virtual staging", href: "#galeria" },
        { label: "Lista de compras", href: "#galeria" },
      ],
    },
    {
      t: "Profissionais",
      l: [
        { label: "Designers", href: "#pro" },
        { label: "Arquitetos", href: "#pro" },
        { label: "Imobiliárias", href: "#pro" },
        { label: "Clínicas", href: "#pro" },
        { label: "Corretores", href: "#pro" },
      ],
    },
    {
      t: "Legal",
      l: [
        { label: "Termos de Uso", href: "/legal#termos" },
        { label: "Política de Privacidade", href: "/legal#privacidade" },
        { label: "Política de Imagens", href: "/legal#imagens" },
        { label: "LGPD", href: "/legal#lgpd" },
        { label: "Afiliados", href: "/legal#afiliados" },
        { label: "Aviso sobre IA", href: "/legal#aviso-ia" },
      ],
    },
  ];
  // Landing pages programáticas — um link interno por ambiente e por estilo,
  // para que os crawlers descubram e distribuam autoridade para essas páginas.
  const roomLinks = [
    { slug: "sala", label: "Sala" },
    { slug: "quarto", label: "Quarto" },
    { slug: "cozinha", label: "Cozinha" },
    { slug: "home-office", label: "Home office" },
    { slug: "banheiro", label: "Banheiro" },
  ];
  const styleLinks = [
    { slug: "japandi", label: "Japandi" },
    { slug: "contemporaneo", label: "Contemporâneo" },
    { slug: "minimalista", label: "Minimalista" },
    { slug: "natural", label: "Natural" },
    { slug: "industrial", label: "Industrial" },
    { slug: "luxo", label: "Luxo discreto" },
  ];
  return (
    <footer className="bg-foreground text-background/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 pb-28 lg:pb-16">
        <div className="grid lg:grid-cols-[1.4fr_3fr] gap-10">
          <div>
            <div className="text-background">
              <Link to="/" aria-label="Ideal Space, página inicial">
                <IdealSpaceLogo />
              </Link>
            </div>
            <p className="mt-5 text-sm text-background/60 max-w-sm">
              Plataforma de design de interiores com IA. Geração 2D rápida, planejamento 5D e
              recursos de planta baixa para projetos residenciais e profissionais.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
            {cols.map((c) => (
              <div key={c.t}>
                <div className="text-background text-xs uppercase tracking-widest">{c.t}</div>
                <ul className="mt-4 space-y-2">
                  {c.l.map((x) => (
                    <li key={x.label}>
                      <a className="hover:text-background transition" href={x.href}>
                        {x.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Landing pages por ambiente e estilo — links internos para SEO. */}
        <div className="mt-12 pt-8 border-t border-white/10 space-y-4 text-sm">
          <nav aria-label="Decorar por ambiente">
            <span className="text-background text-xs uppercase tracking-widest">
              Decorar por ambiente
            </span>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-background/55">
              {roomLinks.map((r) => (
                <a
                  key={r.slug}
                  href={`/ambientes/${r.slug}`}
                  className="hover:text-background transition"
                >
                  {r.label}
                </a>
              ))}
            </div>
          </nav>
          <nav aria-label="Decorar por estilo">
            <span className="text-background text-xs uppercase tracking-widest">
              Decorar por estilo
            </span>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-background/55">
              {styleLinks.map((s) => (
                <a
                  key={s.slug}
                  href={`/estilos/${s.slug}`}
                  className="hover:text-background transition"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </nav>
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4 justify-between text-xs text-background/50">
          <div>© {new Date().getFullYear()} Ideal Space. Todos os direitos reservados.</div>
          <div className="max-w-2xl">
            Ideal Space usa IA para gerar ideias visuais de ambientes. As imagens são ilustrativas e
            os produtos sugeridos podem conter links de afiliados.
          </div>
        </div>
      </div>
    </footer>
  );
}
