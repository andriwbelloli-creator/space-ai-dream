/**
 * Coleções editoriais — curadorias TEMÁTICAS (não estilos ou ambientes
 * individuais — ambientes ficam em AmbientesGrid; estilos no StylesCarousel
 * mais acima na home).
 *
 * Cada coleção responde a uma necessidade/contexto do usuário: "tenho um
 * apto pequeno", "moro de aluguel", "quero home office produtivo", etc.
 * Algumas linkam pra ambiente/estilo mais alinhado; outras apontam pro
 * fluxo de upload direto.
 *
 * Layout: feature card grande à esquerda + 2 collection cards stacked à
 * direita no desktop; depois 3 overlay cards equivalentes. Não duplica
 * estilo nem cômodo específico — apenas temas curatoriais.
 */
import {
  EditorialFeatureCard,
  CollectionCard,
  PremiumOverlayCard,
} from "@/components/ui/premium-cards";

import livingWarm from "@/assets/decorated-living-warm.jpg";
import office from "@/assets/gallery-office.jpg";
import bedroom from "@/assets/decorated-bedroom.jpg";
import kitchenIsland from "@/assets/decorated-kitchen-island.jpg";
import moodboardPro from "@/assets/moodboard-pro.jpg";
import bathroomSuite from "@/assets/decorated-bathroom-suite.jpg";

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
              Curadorias <span className="italic">por contexto de vida</span>, não por estilo.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground sm:text-base">
            Coleções que respondem a uma situação real: apartamento pequeno, mudança recente, casa
            de aluguel, orçamento curto, retrofit premium acessível.
          </p>
        </div>

        {/* Linha 1: feature card grande + 2 collections stacked. */}
        <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <EditorialFeatureCard
              src={livingWarm}
              alt="Sala de estar decorada com presença em apartamento compacto"
              kicker="Coleção em destaque"
              title={
                <>
                  Apartamentos pequenos com{" "}
                  <span className="font-serif italic">presença grande</span>.
                </>
              }
              description="Ambientes compactos que ganharam respiro, foco e identidade pessoal. Inspiração curada pra quem precisa otimizar cada metro sem virar showroom frio."
              meta="11 ambientes · todos os estilos"
              ctaLabel="Começar pela sala"
              to="/ambientes/sala"
            />
          </div>
          <div className="grid gap-5 sm:gap-6 lg:col-span-5">
            <CollectionCard
              src={office}
              alt="Home office com madeira e iluminação natural"
              title="Home office produtivo"
              description="Setups pra foco, calls e ergonomia, do compacto ao executivo."
              count="11 estilos disponíveis"
              to="/ambientes/home-office"
            />
            <CollectionCard
              src={bedroom}
              alt="Quarto aconchegante com texturas naturais"
              title="Mudou de casa? Comece pelo quarto"
              description="O cômodo que mais influencia a sensação de chegou em casa."
              count="Recomendado pra mudança"
              to="/ambientes/quarto"
            />
          </div>
        </div>

        {/* Linha 2: 3 overlay cards de contextos curatoriais. */}
        <div className="mt-5 grid grid-cols-1 gap-5 sm:mt-6 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <PremiumOverlayCard
            src={kitchenIsland}
            alt="Cozinha integrada com luz natural pra quem mora de aluguel"
            kicker="Sem reforma"
            title="Projetos pra alugar"
            description="Decoração que vai com você no próximo apartamento, sem precisar de obra."
            aspect="tall"
            to="/orcamento-design-interiores"
            ctaLabel="Quanto custaria"
          />
          <PremiumOverlayCard
            src={bathroomSuite}
            alt="Lavabo em estilo luxo discreto com materiais nobres"
            kicker="Luxo acessível"
            title="Premium em escala compacta"
            description="Onde investir pouco e ter alto impacto: lavabo, hall, cabeceira, mesa de jantar."
            aspect="tall"
            to="/estilos/luxo"
            ctaLabel="Ver estratégia"
          />
          <PremiumOverlayCard
            src={moodboardPro}
            alt="Moodboard com paleta e materiais pra projeto autoral"
            kicker="Inspiração por contexto"
            title="Antes e depois real"
            description="Foto comum do seu ambiente vira proposta visual com lista de compras."
            aspect="tall"
            to="/"
            ctaLabel="Como funciona"
          />
        </div>
      </div>
    </section>
  );
}
