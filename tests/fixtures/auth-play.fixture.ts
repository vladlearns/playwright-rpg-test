import { test as base } from "@playwright/test";
import { PlayPage } from "../page-objects/play.page";

type PlayPageFixture = {
  playPage: PlayPage;
};

export const test = base.extend<PlayPageFixture>({
  playPage: async ({ page }, use) => {
    await use(new PlayPage(page));
  },
});

export { expect } from "@playwright/test";
