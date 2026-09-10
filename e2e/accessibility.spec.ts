import { test, expect } from "@playwright/test";
import { runAxeScan } from "./fixtures/axe";

test.describe("accessibility", () => {
  test("homepage has no serious or critical automated a11y violations", async ({ page }) => {
    await page.goto("/");
    const results = await runAxeScan(page);

    const seriousOrCritical = results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    );

    expect(
      seriousOrCritical,
      JSON.stringify(seriousOrCritical, null, 2),
    ).toEqual([]);
  });

  test("skip link is hidden by default and appears on keyboard focus", async ({ page }) => {
    await page.goto("/");
    const skipLink = page.getByRole("link", { name: /skip to main content/i });

    await expect(skipLink).not.toBeInViewport();
    await page.keyboard.press("Tab");
    await expect(skipLink).toBeFocused();
  });

  test("interactive elements show a visible focus outline", async ({ page }) => {
    await page.goto("/");
    const ctaLink = page.getByRole("link", { name: /let.s work together/i }).first();
    await ctaLink.focus();
    const outline = await ctaLink.evaluate((el) => window.getComputedStyle(el).outlineStyle);
    expect(outline).not.toBe("none");
  });

  test("mobile menu button has correct aria-expanded state", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const menuButton = page.getByRole("button", { name: /open menu/i });
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");

    await menuButton.click();
    const closeButton = page.getByRole("button", { name: /close menu/i });
    await expect(closeButton).toHaveAttribute("aria-expanded", "true");
  });

  test("contact form fields have accessible labels and surfaced errors", async ({ page }) => {
    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();

    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel(/what would you like to automate/i)).toBeVisible();

    await page.getByRole("button", { name: /start a conversation/i }).click();
    const error = page.getByRole("alert").first();
    await expect(error).toBeVisible();
  });
});
