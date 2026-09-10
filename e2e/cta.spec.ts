import { test, expect } from "@playwright/test";

test.describe("call-to-action buttons", () => {
  test("hero primary CTA reveals the contact section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /let.s work together/i }).first().click();
    await expect(page.locator("#contact")).toBeInViewport();
  });

  test("hero secondary CTA reveals the work section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /see my work/i }).click();
    await expect(page.locator("#work")).toBeInViewport();
  });

  test("a service card's CTA reveals the contact section", async ({ page }) => {
    await page.goto("/");
    await page
      .locator("#services")
      .getByRole("link", { name: /discuss a project/i })
      .first()
      .click();
    await expect(page.locator("#contact")).toBeInViewport();
  });
});
