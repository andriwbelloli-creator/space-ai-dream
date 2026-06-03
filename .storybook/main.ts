import type { StorybookConfig } from "@storybook/react-vite";
import path from "node:path";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx|mdx)"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  core: { disableTelemetry: true },
  viteFinal: async (cfg) => {
    cfg.resolve = cfg.resolve ?? {};
    cfg.resolve.alias = {
      ...(cfg.resolve.alias as Record<string, string>),
      "@": path.resolve(__dirname, "../src"),
    };
    cfg.plugins = (cfg.plugins ?? []).filter((p: unknown) => {
      const name = (p as { name?: string } | null)?.name ?? "";
      return !name.startsWith("vite-plugin-cloudflare") && !name.startsWith("tanstack");
    });
    return cfg;
  },
};

export default config;