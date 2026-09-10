import { test, expect } from "@playwright/test";

async function fillValidForm(page: import("@playwright/test").Page) {
  await page.getByLabel("Name").fill("Jordan Smith");
  await page.getByLabel("Email").fill("jordan@example.com");
  await page
    .getByLabel(/what would you like to automate/i)
    .fill("We need help automating our lead routing workflow end to end.");
}

test.describe("contact form", () => {
  test("shows validation errors on empty submission", async ({ page }) => {
    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();

    await page.getByRole("button", { name: /start a conversation/i }).click();

    await expect(page.getByText(/please enter your full name/i)).toBeVisible();
    await expect(page.getByText(/please enter your email address/i)).toBeVisible();
    await expect(page.getByText(/tell me a bit more/i)).toBeVisible();
  });

  test("shows an error for a malformed email", async ({ page }) => {
    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();

    await page.getByLabel("Name").fill("Jordan Smith");
    await page.getByLabel("Email").fill("not-an-email");
    await page
      .getByLabel(/what would you like to automate/i)
      .fill("We need help automating our lead routing workflow end to end.");
    await page.getByRole("button", { name: /start a conversation/i }).click();

    await expect(page.getByText(/valid email address/i)).toBeVisible();
  });

  test("shows success state after a valid submission (mocked API)", async ({ page }) => {
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({ json: { ok: true } });
    });

    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await fillValidForm(page);
    await page.getByRole("button", { name: /start a conversation/i }).click();

    await expect(page.getByText(/thanks — your message has been sent/i)).toBeVisible();
  });

  test("shows an error state when the API call fails (mocked API)", async ({ page }) => {
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 503,
        json: { ok: false, error: "Message could not be sent automatically right now." },
      });
    });

    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await fillValidForm(page);
    await page.getByRole("button", { name: /start a conversation/i }).click();

    await expect(page.getByText(/message could not be sent automatically/i)).toBeVisible();
  });
});
