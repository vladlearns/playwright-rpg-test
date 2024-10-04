import { Page, expect } from "@playwright/test";
import { CharacterCard } from "../components/character-card.component";
import { HeaderComponent } from "../components/header.component";
import { retry } from "../utils/retry";

export class PlayPage {
  readonly characterCard: CharacterCard;
  readonly header: HeaderComponent;
  private page: Page;

  constructor(page: Page) {
    this.page = page;
    this.characterCard = new CharacterCard(page);
    this.header = new HeaderComponent(page);
  }

  async navigate() {
    await this.page.goto("/play");
  }

  async setCharacterName(name: string) {
    await this.page.fill('input[name="name"]', name);
  }

  async selectBuild(build: string) {
    await retry(
      async () => {
        await this.page.click('button[role="combobox"]');
        await this.page.waitForSelector('[role="listbox"]', {
          state: "visible",
          timeout: 5000,
        });
        await this.page.click(`[role="option"]:has-text("${build}")`, {
          timeout: 5000,
        });
        await this.page.waitForSelector('[role="listbox"]', {
          state: "hidden",
          timeout: 5000,
        });
        const buttonText = await this.page.textContent(
          'button[role="combobox"]'
        );
        if (!buttonText?.toLowerCase().includes(build.toLowerCase())) {
          throw new Error(
            `Build ${build} was not selected. Current button text: ${buttonText}`
          );
        }
      },
      3,
      1000
    );
  }

  async clickStart() {
    const startButtonSelector = 'button.bg-primary:has-text("Start!")';
    await this.page.waitForSelector(startButtonSelector, {
      state: "visible",
      timeout: 5000,
    });
    await this.page.click(startButtonSelector);
    await this.page
      .waitForSelector(startButtonSelector, {
        state: "detached",
        timeout: 5000,
      })
      .catch(() =>
        console.log("Start button did not disappear, but continuing...")
      );
  }

  async levelUp() {
    await this.completeClickTask();
    await this.completeUploadTask();
    await this.completeTypeTask();
    await this.completeSlideTask();
  }

  private async completeClickTask() {
    const clickButton = this.page.locator('button:has-text("Click me")');
    const clickCount = 5;

    await clickButton.waitFor({ state: "visible", timeout: 5000 });
    await expect(clickButton).toBeEnabled();

    for (let i = 0; i < clickCount; i++) {
      try {
        await clickButton.click({ timeout: 5000 });
        console.log(`Clicked 'Click me' button ${i + 1}/${clickCount} times`);

        await this.page.waitForTimeout(200);
      } catch (error) {
        console.error(`Error clicking button on attempt ${i + 1}:`, error);
        throw error;
      }
    }

    console.log("Checking if the button is disabled after 5 clicks");

    try {
      await expect(clickButton).toBeDisabled({ timeout: 5000 });
      console.log("The button is correctly disabled after 5 clicks.");
    } catch (error) {
      console.error("The button is not disabled after 5 clicks:", error);
      throw error;
    }
  }

  private async completeUploadTask() {
    const fileInput = this.page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "dummy.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("dummy content"),
    });
  }

  private async completeTypeTask() {
    await this.page.fill(
      'section[data-testid="adventure-typer"] input',
      "Lorem Ipsum"
    );
  }

  private async completeSlideTask() {
    const slider = this.page.locator('[data-orientation="horizontal"]').first();
    await slider.waitFor({ state: "visible" });
    const sliderBounds = await slider.boundingBox();
    if (sliderBounds) {
      const startX = sliderBounds.x + 5;
      const endX = sliderBounds.x + sliderBounds.width - 2;
      const y = sliderBounds.y + sliderBounds.height / 2;

      await this.page.mouse.move(startX, y);
      await this.page.mouse.down();
      await this.page.mouse.move(endX, y, { steps: 50 });
      await this.page.mouse.up();
    }
    await this.page.waitForTimeout(1000);
  }

  async getLevel(): Promise<number> {
    return retry(async () => {
      const levelText = await this.page.textContent(
        '[data-character-stats="Level"] span'
      );
      return parseInt(levelText || "0", 10);
    });
  }

  async getStats(): Promise<Record<string, number>> {
    return this.characterCard.getStats();
  }

  public getPage(): Page {
    return this.page;
  }

  async takeScreenshot(path: string) {
    await this.page.screenshot({ path });
  }
}
