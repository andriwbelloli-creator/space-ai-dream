import type { Meta, StoryObj } from "@storybook/react";
import { SectionHead } from "./SectionHead";

const meta = {
  title: "Editorial/SectionHead",
  component: SectionHead,
  parameters: { layout: "padded" },
} satisfies Meta<typeof SectionHead>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    kicker: "Ambientes vazios",
    title: (
      <>
        Escolha o{" "}
        <span className="italic font-normal text-[color:var(--gold-soft)]">cômodo</span>{" "}
        para começar
      </>
    ),
    sub: "Subtítulo opcional descreve a seção em uma frase curta.",
  },
};

export const Centered: Story = {
  args: { ...Default.args!, kicker: "Assinatura", centered: true },
};

export const WithoutSub: Story = {
  args: { kicker: "Inspirações", title: <>Ambientes para se inspirar</> },
};
