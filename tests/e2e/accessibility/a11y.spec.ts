import { expect, test, type BrowserContext } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

import {
  mockAuthorizationAsAdmin,
  mockBookings,
  silenceTelemetry,
  TEST_ZO_USER,
  TEST_ZOSTEL_USER,
} from "../fixtures/api-mocks"

const ONE_DAY_MS = 24 * 60 * 60 * 1000

// We assert on WCAG 2.1 A + AA. Color-contrast is excluded because it
// depends on the rendered theme + Tailwind tokens — we'll address contrast
// systematically when the design system lands. Heading-order is excluded
// for the same reason (placeholder pages render minimal markup today).
const STANDARD_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]
const DISABLED_RULES = ["color-contrast", "heading-order"]

async function seedAuthSession(context: BrowserContext) {
  const validTill = new Date(Date.now() + 30 * ONE_DAY_MS).toISOString()
  await context.addInitScript(
    ({ zoUser, zostelUser, validTill }) => {
      localStorage.setItem(
        "zo-pms-auth",
        JSON.stringify({
          state: {
            user: zoUser,
            token: "test-zo-token",
            expiry: validTill,
            deviceId: "x",
            deviceSecret: "y",
          },
          version: 0,
        })
      )
      localStorage.setItem(
        "zo-pms-zostel-auth",
        JSON.stringify({
          state: {
            user: zostelUser,
            token: "test-zostel-token",
            expiry: validTill,
          },
          version: 0,
        })
      )
    },
    { zoUser: TEST_ZO_USER, zostelUser: TEST_ZOSTEL_USER, validTill }
  )
}

test.describe("accessibility — WCAG 2.1 A/AA", () => {
  test("/login has no detectable a11y violations", async ({ page }) => {
    await silenceTelemetry(page)
    await page.goto("/login")
    await expect(
      page.getByRole("heading", { name: /welcome back/i })
    ).toBeVisible()

    const results = await new AxeBuilder({ page })
      .withTags(STANDARD_TAGS)
      .disableRules(DISABLED_RULES)
      .analyze()

    expect(results.violations).toEqual([])
  })

  test("/dashboard/overview has no detectable a11y violations", async ({
    page,
    context,
  }) => {
    await silenceTelemetry(page)
    await mockAuthorizationAsAdmin(page)
    await mockBookings(page, { count: 2 })
    await seedAuthSession(context)

    await page.goto("/dashboard/overview")
    await expect(page.getByRole("heading", { name: /overview/i })).toBeVisible({
      timeout: 10_000,
    })

    const results = await new AxeBuilder({ page })
      .withTags(STANDARD_TAGS)
      .disableRules(DISABLED_RULES)
      .analyze()

    expect(results.violations).toEqual([])
  })
})
