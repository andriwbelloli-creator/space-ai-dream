/**
 * /acessibilidade — Página editorial de design inclusivo.
 * Hero magazine + 3 pilares (mobilidade, sensorial, baixa visão)
 * seguindo o padrão warm sand + bronze italic + hairline divider.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/acessibilidade-hero.jpg";
import mobilidadeImg from "@/assets/acessibilidade-mobilidade.jpg";
import sensorialImg from "@/assets/acessibilidade-sensorial.jpg";
import visaoImg from "@/assets/acessibilidade-visao.jpg";

const TITLE = "Design inclusivo e acessível para todos | Ideal Space";
const DESCRIPTION =
  "Ambientes pensados para mobilidade reduzida, conforto sensorial e baixa visão. Curadoria editorial de soluções de acessibilidade integradas ao design — sem perder beleza, presença ou identidade.";

export const Route = createFileRoute("/acessibilidade")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:image", content: heroImg },
    ],
    links: [
      { rel: "canonical", href: "https://idealspace.com.br/acessibilidade" },
    ],
  }),
  component: AcessibilidadePage,
});

interface Pilar {
  kicker: string;
  title: string;
  keyword: string;
  description: string;
  bullets: ReadonlyArray<string>;
  img: string;
  alt: string;
}

const PILARES: ReadonlyArray<Pilar> = [
  {
    kicker: "Pilar 01 · Mobilidade",
    title: "Circulação ",
    keyword: "generosa",
    description:
      "Passagens largas, bancadas rebaixadas e mobiliário com vão livre. Espaço que recebe cadeirantes, idosos e quem usa apoio sem destacar o equipamento — o design abraça a necessidade.",
    bullets: [
      "Passagens mínimas de 90 cm e giros de 1,50 m",
      "Bancadas e pias com altura 78–80 cm e vão livre",
      "Maçanetas alavanca e portas de correr embutidas",
    ],
    img: mobilidadeImg,
    alt: "Cozinha acessível com bancada rebaixada e circulação ampla",
  },
  {
    kicker: "Pilar 02 · Sensorial",
    title: "Ambiente ",
    keyword: "calmo",
    description:
      "Para neurodivergência, autismo e quem precisa de regulação sensorial: paleta sóbria, texturas suaves, luz quente difusa e zonas claras de refúgio. Menos estímulo, mais presença.",
    bullets: [
      "Paleta monocromática warm sand, baixa saturação",
      "Iluminação dimerizável 2700K, sem fluorescente",
      "Têxteis naturais e cantos de refúgio definidos",
    ],
    img: sensorialImg,
    alt: "Quarto sensorial com paleta calma e texteis em linho",
  },
  {
    kicker: "Pilar 03 · Baixa visão",
    title: "Contraste ",
    keyword: "intencional",
    description:
      "Pisos táteis discretos, contrastes guiando o percurso e corrimãos integrados à arquitetura. Acessibilidade visual sem hospitalizar o ambiente — bronze, madeira e travertino fazem o trabalho.",
    bullets: [
      "Piso tátil em bronze escovado embutido no travertino",
      "Corrimão em madeira contínuo a 90 cm",
      "Iluminação direcional reforçando degraus e portas",
    ],
    img: visaoImg,
    alt: "Corredor com piso tátil em bronze e corrimão em madeira",
  },
];

function AcessibilidadePage() {
  return (
    <main className="bg-background">
      {/* HERO */}
      <section
        aria-labelledby="acessibilidade-heading"
        className="border-b border-border/40"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5 lg:pt-8">
            <span className="is-kicker">Sessão especial · PCD</span>
            <h1
              id="acessibilidade-heading"
              className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl"
            >
              Design que{" "}
              <span className="italic text-[color:var(--gold-soft)]">
                inclui
              </span>{" "}
              sem abrir mão da beleza.
            </h1>
            <span
              aria-hidden="true"
              className="mt-6 block h-px w-16 bg-[color:var(--gold-soft)]/60"
            />
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              Acessibilidade não é adaptação tardia, é decisão de projeto. Aqui
              tratamos mobilidade reduzida, conforto sensorial e baixa visão
              como matéria-prima editorial — integrada ao gesto, ao material e
              à luz.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/ambientes"
                className="inline-flex items-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
              >
                Explorar ambientes
              </Link>
              <Link
                to="/estilos"
                className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                Ver estilos compatíveis
              </Link>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-lg">
              <img
                src={heroImg}
                alt="Corredor residencial acessível com corrimão em bronze e iluminação difusa"
                width={1600}
                height={1024}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3 PILARES */}
      <section
        aria-labelledby="pilares-heading"
        className="py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 max-w-2xl sm:mb-16">
            <span className="is-kicker">Três pilares</span>
            <h2
              id="pilares-heading"
              className="mt-3 font-serif text-3xl leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl"
            >
              Um olhar{" "}
              <span className="italic text-[color:var(--gold-soft)]">
                inclusivo amplo
              </span>
              .
            </h2>
            <span
              aria-hidden="true"
              className="mt-5 block h-px w-16 bg-[color:var(--gold-soft)]/60"
            />
            <p className="mt-5 text-sm text-muted-foreground sm:text-base">
              Mobilidade, sensorial e baixa visão lidos juntos. Cada pilar traz
              decisões concretas que cabem em apartamentos reais brasileiros.
            </p>
          </div>

          <div className="space-y-20 sm:space-y-28">
            {PILARES.map((p, i) => (
              <article
                key={p.kicker}
                className={`grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-14 ${
                  i % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
                }`}
              >
                <div className="lg:col-span-7">
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={p.img}
                      alt={p.alt}
                      width={1024}
                      height={1280}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="lg:col-span-5 lg:pt-10">
                  <span className="is-kicker">{p.kicker}</span>
                  <h3 className="mt-3 font-serif text-3xl leading-[1.1] tracking-tight text-foreground sm:text-4xl">
                    {p.title}
                    <span className="italic text-[color:var(--gold-soft)]">
                      {p.keyword}
                    </span>
                    .
                  </h3>
                  <span
                    aria-hidden="true"
                    className="mt-5 block h-px w-12 bg-[color:var(--gold-soft)]/60"
                  />
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {p.description}
                  </p>
                  <ul className="mt-6 space-y-2.5 text-sm text-foreground/80">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-2 inline-block h-px w-4 flex-shrink-0 bg-[color:var(--gold-soft)]"
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/40 bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <span className="is-kicker">Próximo passo</span>
          <h2 className="mt-3 font-serif text-3xl leading-[1.1] tracking-tight text-foreground sm:text-4xl">
            Pronto para projetar{" "}
            <span className="italic text-[color:var(--gold-soft)]">
              para todos
            </span>
            ?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm text-muted-foreground sm:text-base">
            Use o Ideal Space para visualizar seu ambiente com soluções
            inclusivas integradas desde o primeiro render.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90"
            >
              Começar um projeto
            </Link>
            <Link
              to="/objetos"
              className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              Ver objetos curados
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}