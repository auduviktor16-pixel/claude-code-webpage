import { test, expect, type Page } from "@playwright/test";

const SECTIONS: { name: RegExp; id: string }[] = [
  { name: /^services$/i, id: "services" },
  { name: /^work$/i, id: "work" },
  { name: /^about$/i, id: "about" },
  { name: /^contact$/i, id: "contact" },
];

async function clickNavLink(page: Page, name: RegExp) {
  const viewport = page.viewportSize();
  const isMobile = (viewport?.width ?? 1440) < 768;

  if (isMobile) {
    await page.getByRole("button", { name: /open menu/i }).click();
    await page.getByRole("dialog").getByRole("link", { name }).click();
  } else {
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name }).click();
  }
}

test.describe("primary navigation", () => {
  for (const section of SECTIONS) {
    test(`clicking "${section.id}" scrolls to #${section.id} without hiding it under the sticky nav`, async ({
      page,
    }) => {
      await page.goto("/");
      await clickNavLink(page, section.name);
      await expect(page).toHaveURL(new RegExp(`#${section.id}$`));

      const target = page.locator(`#${section.id}`);
      await expect(target).toBeInViewport();

      const header = page.locator("header");
      const headerBox = await header.boundingBox();
      const targetBox = await target.boundingBox();
      if (headerBox && targetBox) {
        expect(targetBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height - 4);
      }
    });
  }
});
