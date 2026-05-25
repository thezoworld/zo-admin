import { expect, test } from "@playwright/test"

import {
  mockAuthorizationAsNoAccess,
  silenceTelemetry,
  TEST_ZO_USER,
  TEST_ZOSTEL_USER,
} from "../fixtures/api-mocks"

const ONE_DAY_MS = 24 * 60 * 60 * 1000

test.describe("authorization — no access", () => {
  test("a signed-in user with no role lands on the Access Denied screen", async ({
    page,
    context,
  }) => {
    await silenceTelemetry(page)
    await mockAuthorizationAsNoAccess(page)

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

    await page.goto("/dashboard")
    await expect(
      page.getByRole("heading", { name: /access denied/i })
    ).toBeVisible({ timeout: 10_000 })
    await expect(page.getByRole("button", { name: /logout/i })).toBeVisible()
  })
})
