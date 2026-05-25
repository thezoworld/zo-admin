import { expect, test } from "@playwright/test"

import {
  mockAuthorizationAsAdmin,
  mockBookings,
  silenceTelemetry,
  TEST_ZO_USER,
  TEST_ZOSTEL_USER,
} from "../fixtures/api-mocks"

const ONE_DAY_MS = 24 * 60 * 60 * 1000

test.describe("session persistence", () => {
  test("refreshing /dashboard with stored tokens keeps the user signed in", async ({
    page,
    context,
  }) => {
    await silenceTelemetry(page)
    await mockAuthorizationAsAdmin(page)
    await mockBookings(page)

    // Seed the Zustand-persist storage with valid sessions BEFORE the app
    // boots so the dashboard layout sees `isLoggedIn === true` on first
    // hydration.
    const validTill = new Date(Date.now() + 30 * ONE_DAY_MS).toISOString()

    await context.addInitScript(
      ({ zoUser, zostelUser, validTill }) => {
        const zo = {
          state: {
            user: zoUser,
            token: "test-zo-token",
            expiry: validTill,
            deviceId: "test-device-id",
            deviceSecret: "test-device-secret",
          },
          version: 0,
        }
        const zostel = {
          state: {
            user: zostelUser,
            token: "test-zostel-token",
            expiry: validTill,
          },
          version: 0,
        }
        localStorage.setItem("zo-pms-auth", JSON.stringify(zo))
        localStorage.setItem("zo-pms-zostel-auth", JSON.stringify(zostel))
      },
      { zoUser: TEST_ZO_USER, zostelUser: TEST_ZOSTEL_USER, validTill }
    )

    await page.goto("/dashboard/overview")
    await expect(page).toHaveURL(/\/dashboard\/overview/)
    await expect(page.getByRole("heading", { name: /overview/i })).toBeVisible({
      timeout: 10_000,
    })
  })
})
