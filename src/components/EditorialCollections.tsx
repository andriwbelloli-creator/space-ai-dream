/**
 * Coleções editoriais — 4 curadorias TEMÁTICAS por contexto de vida
 * (não estilo nem ambiente individual). Ambientes ficam em AmbientesGrid;
 * estilos ficam no StylesCarousel.
 *
 * Layout: 1 card grande à esquerda (col-span-7) + 3 cards menores à direita
 * (2 em cima + 1 embaixo no desktop). Stack vertical no mobile.
 */
import { EditorialFeatureCard, CollectionCard } from "@/components/ui/premium-cards";

import livingWarm from "@/assets/decorated-living-warm.jpg";
import kitchenIsland from "@/assets/decorated-kitchen-island.jpg";
import bathroomSuite from "@/assets/decorated-bathroom-suite.jpg";
import office from "@/assets/gallery-office.jpg";

export function EditorialCollections() {
  return (
    <section
      className="bg-background py-16 sm:py-24"
      aria-labelledby="editorial-collections-heading"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-10 flex flex-col gap-3 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="is-kicker">Coleções editoriais</span>
            <h2
              id="editorial-collections-heading"
              className="mt-3 font-serif text-3xl leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl"
            >
              Inspiração <span className="italic">curada</span>.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground sm:text-base">
            Coleções que respondem a uma situação real: apartamento pequeno, casa de aluguel, luxo
            discreto, home office produtivo.
          </p>
        </div>

        {/* 1 grande à esquerda + 3 menores à direita (2 em cima + 1 abaixo). */}
        <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <EditorialFeatureCard
              src={livingWarm}
              alt="Sala de estar decorada com presença em apartamento compacto"
              kicker="Curadoria"
              title={
                <>
                  Apartamentos compactos com{" "}
                  <span className="font-serif italic">presença premium</span>.
                </>
              }
              description="Ambientes pequenos que ganharam respiro, foco e identidade pessoal. Curadoria pra otimizar cada metro sem virar showroom frio."
              meta="Comece pela sala"
              ctaLabel="Explorar coleção"
              to="/ambientes/sala"
            />
          </div>
          <div className="grid gap-5 sm:gap-6 lg:col-span-5">
            <div className="grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2">
              <CollectionCard
                src={kitchenIsland}
                alt="Cozinha integrada com luz natural pra quem mora de aluguel"
                title="Projetos para alugar"
                description="Decoração que vai com você no próximo apartamento, sem obra."
                count="Tendência"
                to="/orcamento-design-interiores"
              />
              <CollectionCard
                src={bathroomSuite}
                alt="Lavabo em estilo luxo discreto com materiais nobres"
                title="Luxo discreto"
                description="Materiais nobres, paleta restrita, acabamentos refinados."
                count="Premium"
                to="/estilos/luxo"
              />
            </div>
            <CollectionCard
              src={office}
              alt="Home office com madeira e iluminação natural"
              title="Home office produtivo"
              description="Setups pra foco, calls e ergonomia, do compacto ao executivo."
              count="Trabalho"
              to="/ambientes/home-office"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
