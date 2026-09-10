import { test, expect } from "@playwright/test";

test.describe("page load", () => {
  test("loads successfully with the core hero elements visible", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(String(error)));

    const response = await page.goto("/");
    expect(response?.ok()).toBe(true);

    await expect(page.locator("main")).toBeVisible();

    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toHaveCount(1);

    const portrait = page.getByAltText(/Audu Victor/i);
    await expect(portrait).toBeVisible();

    const heroCta = page.getByRole("link", { name: /let.s work together/i }).first();
    await expect(heroCta).toBeVisible();

    expect(errors).toEqual([]);
  });

  test("has exactly one H1 on the page", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  });
});
