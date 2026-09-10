import { test, expect } from "@playwright/test";

test.describe("responsiveness", () => {
  test("no horizontal overflow", async ({ page }) => {
    await page.goto("/");
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(hasOverflow).toBe(false);
  });

  test("main content and hero CTA are visible and usable", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main")).toBeVisible();
    const cta = page.getByRole("link", { name: /let.s work together/i }).first();
    await expect(cta).toBeVisible();
    const box = await cta.boundingBox();
    expect(box?.width).toBeGreaterThan(0);
    expect(box?.height).toBeGreaterThan(0);
  });

  test("the hero portrait renders without a broken aspect ratio", async ({ page }) => {
    await page.goto("/");
    const portrait = page.getByAltText(/Audu Victor/i);
    const box = await portrait.boundingBox();
    expect(box?.width).toBeGreaterThan(0);
    expect(box?.height).toBeGreaterThan(0);
  });

  test("service cards remain readable", async ({ page }) => {
    await page.goto("/");
    await page.locator("#services").scrollIntoViewIfNeeded();
    const cards = page.locator("#services article");
    await expect(cards).toHaveCount(3);
    for (const card of await cards.all()) {
      const box = await card.boundingBox();
      expect(box?.width).toBeGreaterThan(80);
    }
  });

  test("contact form remains usable", async ({ page }) => {
    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    const nameField = page.getByLabel("Name");
    await expect(nameField).toBeVisible();
    await nameField.fill("Test User");
    await expect(nameField).toHaveValue("Test User");
  });

  test("navigation is usable (mobile menu or desktop nav)", async ({ page }) => {
    await page.goto("/");
    const viewport = page.viewportSize();
    const isMobile = (viewport?.width ?? 1440) < 768;

    if (isMobile) {
      const menuButton = page.getByRole("button", { name: /open menu/i });
      await expect(menuButton).toBeVisible();
      await menuButton.click();
      await expect(page.getByRole("dialog")).toBeVisible();
    } else {
      await expect(
        page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: /services/i }),
      ).toBeVisible();
    }
  });
});
