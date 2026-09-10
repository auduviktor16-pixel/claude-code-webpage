import { test, expect } from "@playwright/test";

test.describe("reduced motion", () => {
  test.use({ colorScheme: "dark", reducedMotion: "reduce" });

  test("all content is immediately visible and interactive with no scroll dependency", async ({
    page,
  }) => {
    await page.goto("/");

    const sectionIds = ["services", "work", "about", "process", "contact"];
    for (const id of sectionIds) {
      const opacity = await page
        .locator(`#${id}`)
        .evaluate((el) => window.getComputedStyle(el).opacity);
      expect(Number(opacity)).toBe(1);
    }

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await page.getByRole("link", { name: /let.s work together/i }).first().click();
    await expect(page.locator("#contact")).toBeInViewport();
  });
});
