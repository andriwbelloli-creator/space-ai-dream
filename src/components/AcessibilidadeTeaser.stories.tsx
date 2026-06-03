import type { Meta, StoryObj } from "@storybook/react";
import { AcessibilidadeTeaser } from "./AcessibilidadeTeaser";

const meta = {
  title: "Editorial/AcessibilidadeTeaser",
  component: AcessibilidadeTeaser,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AcessibilidadeTeaser>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
