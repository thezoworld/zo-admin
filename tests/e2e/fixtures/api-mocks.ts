import type { Page, Route } from "@playwright/test"

// Shared backend mocks for the e2e suite.
//
// Rules of engagement:
//  - Never hit a real backend from these tests.
//  - Every test installs its own page.route() handlers via the factories
//    below. Tests own the data they assert on.
//  - Keep the shapes in sync with features/<name>/types/. When the contract
//    changes, this file changes alongside.

export const TEST_PHONE_DIGITS = "9876543210"
export const TEST_OTP = "123456"

export const TEST_ZO_USER = {
  id: "test-zo-user-id",
  pid: "TEST123",
  first_name: "Test",
  last_name: "User",
  email_address: "",
  wallet_address: "",
  mobile_number: "919876543210",
  membership: "none",
  roles: [],
} as const

export const TEST_ZOSTEL_USER = {
  id: "UA-TEST",
  pid: "TEST456",
  first_name: "Test",
  last_name: "User",
  email_address: "",
  wallet_address: "",
  mobile_number: "919876543210",
  membership: "none",
} as const

export const TEST_OPERATOR = {
  id: 118,
  name: "Test Property",
  code: "TEST",
  data: {},
  kyc_documents: [],
} as const

const ONE_DAY_MS = 24 * 60 * 60 * 1000
const farFuture = () => new Date(Date.now() + 30 * ONE_DAY_MS).toISOString()

async function json(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  })
}

/** Mock the Zo + Zostel auth endpoints with successful responses. */
export async function mockAuthHappyPath(page: Page) {
  await page.route(/\/api\/v1\/auth\/login\/mobile\/otp\//, (route) =>
    json(route, { status: "ok" })
  )

  // /login/mobile/  — OTP verify
  await page.route(/\/api\/v1\/auth\/login\/mobile\/(?!otp)/, (route) =>
    json(route, {
      user: TEST_ZO_USER,
      token: "test-zo-token",
      valid_till: farFuture(),
    })
  )

  await page.route(/\/api\/v1\/auth\/request-otp\/zostel\//, (route) =>
    json(route, {
      mobile_number: TEST_PHONE_DIGITS,
      mobile_country_code: "91",
      code: "654321",
    })
  )

  await page.route(/\/api\/v1\/auth\/activate\//, (route) =>
    json(route, {
      user: TEST_ZOSTEL_USER,
      user_token: "test-zostel-token",
      token_expiry: farFuture(),
    })
  )
}

/** Mock authorization queries so the dashboard renders for a cas-admin user. */
export async function mockAuthorizationAsAdmin(page: Page) {
  await page.route(/\/api\/v1\/authorization\/my\/association\//, (route) =>
    json(route, {
      associations: [{ model: "Operator", value: String(TEST_OPERATOR.id) }],
    })
  )

  await page.route(/\/api\/v1\/authorization\/scope\/me\//, (route) =>
    json(route, {
      permissions: [{ scope: "*", principal: "group:cas-admin" }],
    })
  )

  await page.route(/\/api\/v1\/crs\/operators\//, (route) =>
    json(route, { results: [TEST_OPERATOR] })
  )
}

/** Mock authorization queries so the user has no role on any operator. */
export async function mockAuthorizationAsNoAccess(page: Page) {
  await page.route(/\/api\/v1\/authorization\/my\/association\//, (route) =>
    json(route, { associations: [] })
  )

  await page.route(/\/api\/v1\/authorization\/scope\/me\//, (route) =>
    json(route, { permissions: [] })
  )

  await page.route(/\/api\/v1\/crs\/operators\//, (route) =>
    json(route, { results: [] })
  )
}

export type MockBookingOptions = {
  count?: number
}

export async function mockBookings(
  page: Page,
  options: MockBookingOptions = {}
) {
  const count = options.count ?? 1
  const bookings = Array.from({ length: count }).map((_, index) => ({
    id: 30685073 + index,
    code: "TEST-" + String(1000 + index + 1).slice(1),
    status: "confirmed",
    guests: [
      {
        id: 1,
        name: "Manish Choudhary",
        first_name: "Manish",
        last_name: "Choudhary",
        email: "test@example.com",
        mobile: "918448844380",
        gender: "O",
        address: "India",
        sso_user_id: null,
        data: {},
        mygate_passcode: null,
        time_create: "",
        time_update: "",
        country: null,
      },
    ],
    rooms: [
      {
        id: 951,
        dates: ["2026-05-24", "2026-05-25"],
        units: 1,
        price: 4998,
        occupancy: 2,
        tax_breakup: {},
        discount: 0,
        total_amount: 4998,
        addons: [],
        offer_discount: 0,
        final_amount: 4998,
        asset: {
          id: 2414,
          name: "1",
          parent_name: null,
          description: null,
          data: {},
          time_create: "",
          time_update: "",
          inventory: 951,
        },
        name: "Deluxe Private Room",
      },
    ],
    source: {
      id: 1,
      name: "Zostel - Website",
      ota_commission_percent: 0,
      zostel_commission_percent: 0,
      category: 1,
      display_name: null,
      logo: null,
      default: false,
      operator: TEST_OPERATOR.id,
      pricing: null,
    },
    checkins: [],
    due_amount: 0,
    operator: {
      id: TEST_OPERATOR.id,
      name: TEST_OPERATOR.name,
      code: TEST_OPERATOR.code,
      slug: "test",
      tagline: null,
      title: "Test Property",
      type_code: "B",
      phone: "",
      short_description: null,
    },
    expected_checkin_count: 0,
    currency: { code: "INR", name: "Indian Rupee", symbol: "₹" },
    start_date: "2026-05-24",
    end_date: "2026-05-26",
    reserved_by: {},
    amount: 4998,
    tax_amount: 0,
    advance_amount: 1049.58,
    paid_amount: 1049.58,
    discount: 0,
    offer_discount: 0,
    can_pay_later: false,
    gst_num: null,
    guest_notes: null,
    manager_notes: null,
    meta_details: {},
    rooms_info: [],
    overbooked: false,
    origin: 1,
    cancelled_at: null,
    time_create: "",
    time_update: "",
    booking_pdf: null,
    created_by: null,
    coupon: null,
    channel_booking: null,
  }))

  await page.route(/\/api\/v1\/admin\/pm\/bookings\//, (route) =>
    json(route, { results: bookings, count: bookings.length })
  )
}

/** Block a Sentry tunnel route so failed requests don't pollute logs. */
export async function silenceTelemetry(page: Page) {
  await page.route(/\/monitoring/, (route) => route.fulfill({ status: 200 }))
}
