import { expect, test } from "@playwright/test"

import {
  mockAuthorizationAsAdmin,
  mockBookings,
  silenceTelemetry,
  TEST_ZO_USER,
  TEST_ZOSTEL_USER,
} from "../fixtures/api-mocks"

const ONE_DAY_MS = 24 * 60 * 60 * 1000

test.describe("dashboard — bookings table", () => {
  test("renders a row for each booking returned by the API", async ({
    page,
    context,
  }) => {
    await silenceTelemetry(page)
    await mockAuthorizationAsAdmin(page)
    await mockBookings(page, { count: 3 })

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

    await page.goto("/dashboard/overview")
    await expect(page.getByRole("heading", { name: /overview/i })).toBeVisible({
      timeout: 10_000,
    })

    // Three booking rows from the mock.
    const rows = page.locator('[data-slot="table-body"] tr')
    await expect(rows).toHaveCount(3)
    await expect(page.getByText("TEST-0001").first()).toBeVisible()
    await expect(page.getByText("Manish Choudhary").first()).toBeVisible()
  })
})
