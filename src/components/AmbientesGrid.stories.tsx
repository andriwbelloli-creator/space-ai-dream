import type { Meta, StoryObj } from "@storybook/react";
import { AmbientesGrid } from "./AmbientesGrid";

const meta = {
  title: "Editorial/AmbientesGrid",
  component: AmbientesGrid,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AmbientesGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
