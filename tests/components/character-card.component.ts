import { Page } from "@playwright/test";

export class CharacterCard {
  constructor(private page: Page) {}

  async getStats(): Promise<Record<string, number>> {
    const stats: Record<string, number> = {};
    const statElements = await this.page.$$("[data-character-stats]");

    for (const element of statElements) {
      const statName = await element.getAttribute("data-character-stats");
      const statValue = await element.$eval("span", (el) =>
        parseInt(el.textContent || "0", 10)
      );
      if (statName) {
        stats[statName] = statValue;
      }
    }

    return stats;
  }
}
