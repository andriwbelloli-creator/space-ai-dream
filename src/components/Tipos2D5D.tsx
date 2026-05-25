/**
 * Tipos 2D / 5D / Planta baixa — 3 cards honestos sobre o que está
 * disponível hoje versus em desenvolvimento. Copy SEM prometer features
 * que não existem ainda no backend (regra de transparência).
 *
 * Layout: 3 cards em grid horizontal (1 col mobile, 3 cols sm+).
 * Cada card: imagem + badge de status + título + descrição.
 */
import { PremiumVerticalCard } from "@/components/ui/premium-cards";

import decoratedLiving from "@/assets/decorated-living.jpg";
import moodboardPro from "@/assets/moodboard-pro.jpg";
import floorplan from "@/assets/floorplan-apartment.jpg";

export function Tipos2D5D() {
  return (
    <section className="bg-foreground text-background py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="is-kicker text-accent">Visualizações</span>
            <h2 className="mt-3 font-serif text-3xl leading-[1.1] tracking-tight text-background sm:text-4xl md:text-5xl">
              Do <span className="italic">conceito visual</span> à{" "}
              <span className="italic">planta baixa</span>.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-background/70 sm:text-base">
            Hoje o Ideal Space gera o 2D com IA generativa. 5D e planta baixa estão em
            desenvolvimento e entram em ondas pra usuários da lista de espera.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
          <PremiumVerticalCard
            src={decoratedLiving}
            alt="Ambiente decorado pela IA em 2D"
            kicker="Disponível"
            title="2D com IA"
            description="Foto do ambiente vira proposta decorada em segundos. Lista de compras com produtos reais."
            tags={[{ label: "Disponível agora", tone: "accent" }]}
            aspect="video"
            to="/"
            ctaLabel="Criar projeto"
          />
          <PremiumVerticalCard
            src={moodboardPro}
            alt="Render 5D com acabamentos e estimativa de custo"
            kicker="Em desenvolvimento"
            title="5D com render"
            description="Projeto completo com acabamentos, iluminação e estimativa de custo. Em ondas pra lista de espera."
            tags={[{ label: "Em breve", tone: "gold" }]}
            aspect="video"
            to="/para-arquitetos"
            ctaLabel="Entrar na lista"
          />
          <PremiumVerticalCard
            src={floorplan}
            alt="Planta baixa com sugestão de layout de móveis"
            kicker="Em desenvolvimento"
            title="Planta baixa"
            description="Layout com sugestão de disposição de móveis e circulação. Versão conceitual em testes."
            tags={[{ label: "Em breve", tone: "gold" }]}
            aspect="video"
            to="/para-arquitetos"
            ctaLabel="Entrar na lista"
          />
        </div>
      </div>
    </section>
  );
}
