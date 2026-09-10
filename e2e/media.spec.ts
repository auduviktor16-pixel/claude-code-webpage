import { test, expect } from "@playwright/test";

test.describe("media", () => {
  test("the hero portrait loads successfully", async ({ page }) => {
    await page.goto("/");
    const portrait = page.getByAltText(/Audu Victor/i);
    await expect(portrait).toBeVisible();

    const naturalWidth = await portrait.evaluate((img: HTMLImageElement) => img.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  });

  test("renders no video element when no video is configured", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(String(error)));

    await page.goto("/");
    await expect(page.locator("video")).toHaveCount(0);
    expect(errors).toEqual([]);
  });
});
