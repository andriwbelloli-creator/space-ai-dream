/**
 * AcessibilidadeTeaser — banda editorial dos 3 pilares de design inclusivo
 * na home (mobilidade, sensorial, baixa visão). Link pra /acessibilidade.
 * Mantém warm sand + bronze italic + hairline divider.
 */
import { Link } from "@tanstack/react-router";
import mobilidadeImg from "@/assets/acessibilidade-mobilidade.jpg";
import sensorialImg from "@/assets/acessibilidade-sensorial.jpg";
import visaoImg from "@/assets/acessibilidade-visao.jpg";

interface Pilar {
  kicker: string;
  title: string;
  keyword: string;
  description: string;
  img: string;
  alt: string;
}

const PILARES: ReadonlyArray<Pilar> = [
  {
    kicker: "Mobilidade",
    title: "Circulação ",
    keyword: "generosa",
    description:
      "Passagens largas, bancadas rebaixadas e mobiliário com vão livre — sem destacar o equipamento.",
    img: mobilidadeImg,
    alt: "Cozinha acessível com bancada rebaixada e circulação ampla",
  },
  {
    kicker: "Sensorial",
    title: "Ambiente ",
    keyword: "calmo",
    description:
      "Paleta sóbria, luz quente difusa e zonas de refúgio para neurodivergência e baixa estimulação.",
    img: sensorialImg,
    alt: "Quarto sensorial com paleta calma e linho natural",
  },
  {
    kicker: "Baixa visão",
    title: "Contraste ",
    keyword: "intencional",
    description:
      "Piso tátil discreto, corrimão em madeira contínuo e luz direcional sobre degraus e portas.",
    img: visaoImg,
    alt: "Corredor com piso tátil em bronze e corrimão em madeira",
  },
];

export function AcessibilidadeTeaser() {
  return (
    <section
      className="bg-muted/30 py-16 sm:py-24"
      aria-labelledby="acessibilidade-teaser-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 flex flex-col gap-6 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="is-kicker">Sessão especial · PCD</span>
            <h2
              id="acessibilidade-teaser-heading"
              className="mt-3 font-serif text-3xl leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl"
            >
              Design que{" "}
              <span className="italic text-[color:var(--gold-soft)]">
                inclui
              </span>{" "}
              sem abrir mão da beleza.
            </h2>
            <span
              aria-hidden="true"
              className="mt-5 block h-px w-16 bg-[color:var(--gold-soft)]/60"
            />
          </div>
          <p className="max-w-sm text-sm text-muted-foreground sm:text-base">
            Mobilidade reduzida, conforto sensorial e baixa visão lidos juntos
            — decisões integradas ao gesto, ao material e à luz.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
          {PILARES.map((p) => (
            <article
              key={p.kicker}
              className="flex flex-col overflow-hidden rounded-2xl bg-background ring-1 ring-border/40"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={p.img}
                  alt={p.alt}
                  width={1024}
                  height={1280}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <span className="is-kicker">{p.kicker}</span>
                <h3 className="mt-3 font-serif text-2xl leading-[1.15] tracking-tight text-foreground sm:text-3xl">
                  {p.title}
                  <span className="italic text-[color:var(--gold-soft)]">
                    {p.keyword}
                  </span>
                  .
                </h3>
                <span
                  aria-hidden="true"
                  className="mt-4 block h-px w-12 bg-[color:var(--gold-soft)]/60"
                />
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center sm:mt-12">
          <Link
            to="/acessibilidade"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90"
          >
            Conhecer a sessão completa
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}