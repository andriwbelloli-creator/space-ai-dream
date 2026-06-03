import type { TestRunnerConfig } from "@storybook/test-runner";
import { getStoryContext } from "@storybook/test-runner";

/**
 * Validações automáticas por story do grupo Editorial.
 * Garante o padrão visual da homepage:
 *   - kicker `.is-kicker` presente
 *   - cor do kicker na faixa bronze (~var(--gold-soft) ≈ #B58A60)
 *   - h2 com font-serif
 *   - hairline divider (1px alto × ~64px largura)
 *   - section padding py-12/14/16/20/24 (ritmo editorial)
 */
const config: TestRunnerConfig = {
  async postVisit(page, context) {
    const storyCtx = await getStoryContext(page, context);
    if (!storyCtx.title.startsWith("Editorial/")) return;

    const root = page.locator("#storybook-root");

    const kickerCount = await root.locator(".is-kicker").count();
    if (kickerCount < 1) {
      throw new Error(`[${context.id}] esperado .is-kicker >= 1, encontrado ${kickerCount}`);
    }

    const kickerColor = await root
      .locator(".is-kicker")
      .first()
      .evaluate((el) => getComputedStyle(el).color);
    const m = kickerColor.match(/\d+/g);
    if (!m || m.length < 3) {
      throw new Error(`[${context.id}] cor do kicker não parseável: ${kickerColor}`);
    }
    const [r, g, b] = m.map(Number);
    const isBronze = r > 140 && r < 220 && g > 100 && g < 180 && b > 60 && b < 140 && r > b;
    if (!isBronze) {
      throw new Error(
        `[${context.id}] kicker fora da faixa bronze (esperado ~rgb(178,138,96), recebido rgb(${r},${g},${b}))`,
      );
    }

    const h2 = root.locator("h2").first();
    if ((await h2.count()) > 0) {
      const fontFamily = await h2.evaluate((el) => getComputedStyle(el).fontFamily);
      if (!/serif|Instrument/i.test(fontFamily)) {
        throw new Error(`[${context.id}] h2 sem font-serif (recebido: ${fontFamily})`);
      }
    }

    const hairlineCount = await root.evaluate(() => {
      return Array.from(document.querySelectorAll("span")).filter((el) => {
        const r = el.getBoundingClientRect();
        return r.height > 0 && r.height <= 2 && r.width >= 48 && r.width <= 96;
      }).length;
    });
    if (hairlineCount < 1) {
      throw new Error(`[${context.id}] hairline divider ausente (esperado 1px × ~64px)`);
    }

    if (storyCtx.parameters?.layout === "fullscreen") {
      const sections = root.locator("section");
      const count = await sections.count();
      for (let i = 0; i < count; i++) {
        const cls = (await sections.nth(i).getAttribute("class")) ?? "";
        if (!cls) continue;
        const hasRhythm = /py-(?:12|14|16|20|24)/.test(cls);
        if (!hasRhythm) {
          throw new Error(
            `[${context.id}] section #${i} sem ritmo editorial (py-12/14/16/20/24). class="${cls.slice(0, 140)}"`,
          );
        }
      }
    }
  },
};

export default config;
