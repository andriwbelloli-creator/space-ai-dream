import type { Meta, StoryObj } from "@storybook/react";
import { AmbientesGrid } from "./AmbientesGrid";
import { ObjetosTeaser } from "./ObjetosTeaser";
import { AcessibilidadeTeaser } from "./AcessibilidadeTeaser";
import { SectionHead } from "./SectionHead";

function EditorialRhythm() {
  return (
    <main className="bg-background text-foreground">
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead
            kicker="Padrão editorial"
            title={
              <>
                Ritmo de{" "}
                <span className="italic font-normal text-[color:var(--gold-soft)]">
                  kicker bronze
                </span>{" "}
                em todas as seções
              </>
            }
            sub="Golden master visual: cada seção mantém o mesmo espaçamento e tipografia."
          />
        </div>
      </section>
      <AmbientesGrid />
      <ObjetosTeaser />
      <AcessibilidadeTeaser />
    </main>
  );
}

const meta = {
  title: "Editorial/Rhythm",
  component: EditorialRhythm,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof EditorialRhythm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HomeSections: Story = {};
