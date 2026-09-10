import { test, expect } from "@playwright/test";

const SECTION_IDS = ["home", "services", "work", "about", "process", "contact"];

test.describe("scroll visibility", () => {
  test("every major section becomes visible while scrolling through the page", async ({
    page,
  }) => {
    await page.goto("/");

    for (const id of SECTION_IDS) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await expect(page.locator(`#${id}`)).toBeVisible();
      // Reveal-on-scroll content must not stay stuck at opacity 0.
      const opacity = await page
        .locator(`#${id}`)
        .evaluate((el) => window.getComputedStyle(el).opacity);
      expect(Number(opacity)).toBeGreaterThan(0);
    }
  });
});
