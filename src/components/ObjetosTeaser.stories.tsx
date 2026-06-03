import type { Meta, StoryObj } from "@storybook/react";
import { ObjetosTeaser } from "./ObjetosTeaser";

const meta = {
  title: "Editorial/ObjetosTeaser",
  component: ObjetosTeaser,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ObjetosTeaser>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
