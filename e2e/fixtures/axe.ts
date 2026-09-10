import type { Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

export async function runAxeScan(page: Page) {
  return new AxeBuilder({ page }).analyze();
}
