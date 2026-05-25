import { expect, test } from "@playwright/test"

import { silenceTelemetry, TEST_PHONE_DIGITS } from "../fixtures/api-mocks"

test.describe("mobile login — invalid OTP", () => {
  test("shows the incorrect-code message and stays on the OTP step", async ({
    page,
  }) => {
    await silenceTelemetry(page)

    await page.route(/\/api\/v1\/auth\/login\/mobile\/otp\//, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ status: "ok" }),
      })
    )

    // OTP verify rejects with 401.
    await page.route(/\/api\/v1\/auth\/login\/mobile\/(?!otp)/, (route) =>
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ message: "Invalid OTP" }),
      })
    )

    await page.goto("/login")
    await page.getByPlaceholder("Phone number").fill(TEST_PHONE_DIGITS)
    await page.getByRole("button", { name: /send otp/i }).click()

    await expect(
      page.getByRole("heading", { name: /enter the code/i })
    ).toBeVisible()

    const otpSlots = page.locator('[data-slot="input-otp"] input')
    await otpSlots.first().fill("000000")
    await page.getByRole("button", { name: /verify & continue/i }).click()

    // Error surfaces under the OTP field; we stay on /login.
    await expect(
      page.getByText(/code you entered is incorrect|invalid code/i)
    ).toBeVisible()
    await expect(page).toHaveURL(/\/login/)
  })
})
