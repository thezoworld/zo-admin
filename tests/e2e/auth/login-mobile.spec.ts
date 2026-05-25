import { expect, test } from "@playwright/test"

import {
  mockAuthHappyPath,
  mockAuthorizationAsAdmin,
  mockBookings,
  silenceTelemetry,
  TEST_OTP,
  TEST_PHONE_DIGITS,
} from "../fixtures/api-mocks"

test.describe("mobile login — happy path", () => {
  test("phone + OTP lands the user on /dashboard", async ({ page }) => {
    await silenceTelemetry(page)
    await mockAuthHappyPath(page)
    await mockAuthorizationAsAdmin(page)
    await mockBookings(page)

    await page.goto("/login")
    await expect(
      page.getByRole("heading", { name: /welcome back/i })
    ).toBeVisible()

    await page.getByPlaceholder("Phone number").fill(TEST_PHONE_DIGITS)
    await page.getByRole("button", { name: /send otp/i }).click()

    await expect(
      page.getByRole("heading", { name: /enter the code/i })
    ).toBeVisible()

    // The OTP input is six independent slots; typing into the group fills
    // them sequentially when focus is in the first slot.
    const otpSlots = page.locator('[data-slot="input-otp"] input')
    await otpSlots.first().fill(TEST_OTP)

    await page.getByRole("button", { name: /verify & continue/i }).click()

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })
  })
})
