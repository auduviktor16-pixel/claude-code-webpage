import { test, expect } from "@playwright/test";

test.describe("social links", () => {
  test("renders no social links when none are configured", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer.getByRole("link", { name: /linkedin/i })).toHaveCount(0);
    await expect(footer.getByRole("link", { name: /^x$/i })).toHaveCount(0);
    await expect(footer.getByRole("link", { name: /github/i })).toHaveCount(0);
  });

  test("never renders a dead placeholder link", async ({ page }) => {
    await page.goto("/");
    const deadLinks = await page.locator('a[href="#"]').count();
    expect(deadLinks).toBe(0);
  });

  test("hides the BetapayAI external CTA when no live URL is configured", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.locator("#work").getByRole("link", { name: /explore betapayai/i }),
    ).toHaveCount(0);
  });
});
