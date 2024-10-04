import { test, expect } from "./fixtures/auth-play.fixture";
import dotenv from "dotenv";

dotenv.config();

const TEST_TIMEOUT = parseInt(process.env.TEST_TIMEOUT || "300000"); // Default to 300000 ms (5 minutes)
const MAX_LEVEL_UPS = parseInt(process.env.MAX_LEVEL_UPS || "20");
const builds = process.env.BUILDS ? process.env.BUILDS.split(",") : ["Knight"];
const MAX_LEVEL = parseInt(process.env.MAX_LEVEL || "5");

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

builds.forEach((build) => {
  test(`Level up ${build} character to the highest level`, async ({
    playPage,
  }) => {
    test.setTimeout(TEST_TIMEOUT);

    await playPage.navigate();

    console.log(`Starting test for ${build} character`);

    await playPage.setCharacterName(build);
    console.log(`Character name set to ${build}`);

    await playPage.selectBuild(build);
    console.log(`Build selected: ${build}`);

    await playPage.clickStart();
    console.log("Start button clicked");

    let currentLevel = await playPage.getLevel();
    let levelUpCount = 0;

    while (currentLevel < MAX_LEVEL && levelUpCount < MAX_LEVEL_UPS) {
      console.log(`Current level: ${currentLevel}`);

      try {
        await playPage.levelUp();
        levelUpCount++;

        const newLevel = await playPage.getLevel();

        if (newLevel === currentLevel) {
          console.warn(
            `Level did not increase after level up attempt ${levelUpCount}`
          );
          break;
        }

        currentLevel = newLevel;

        console.log(`Leveled up to ${currentLevel}`);

        await playPage.takeScreenshot(`${build}-level-${currentLevel}.png`);
      } catch (error) {
        if (isError(error)) {
          console.error(`Error during level up: ${error.message}`);
          await playPage.takeScreenshot(
            `error-leveling-up-${build}-level-${currentLevel}.png`
          );
          break;
        } else {
          console.error("An unknown error occurred during level up.");
          await playPage.takeScreenshot(
            `unknown-error-leveling-up-${build}-level-${currentLevel}.png`
          );
          break;
        }
      }
    }

    console.log(`Final level reached: ${currentLevel}`);

    const finalStats = await playPage.getStats();
    console.log(`Final ${build} character stats:`, finalStats);

    await expect(
      playPage
        .getPage()
        .locator(".text-lg.text-amber-500.font-bold.animate-pulse")
    ).toContainText("You've reached the highest level!");

    const playAgainButton = playPage
      .getPage()
      .locator('button[data-play-again="true"]');
    await expect(playAgainButton).toBeVisible();
    await expect(playAgainButton).toHaveText("Play again");

    expect(currentLevel).toBeGreaterThan(1);

    const statsToCheck = ["Strength", "Agility", "Wisdom", "Magic"];
    statsToCheck.forEach((stat) => {
      expect(finalStats[stat]).toBeGreaterThan(1);
    });

    expect(currentLevel).toBe(MAX_LEVEL);
  });
});
