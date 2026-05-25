// Domain model for the /api/v1/admin/pm/bookings endpoint.
// Mirrors the server payload but uses TS-idiomatic optionals where the
// server emits null. Keep this file in sync with the backend contract;
// when it grows past ~150 LOC, split per resource.

export type BookingStatus =
  | "confirmed"
  | "cancelled"
  | "checked_in"
  | "checked_out"
  | "pending"
  | (string & {})

export type Currency = {
  code: string
  name: string
  symbol: string
}

export type Operator = {
  id: number
  name: string
  code: string
  slug: string
  tagline: string | null
  title: string
  type_code: string
  phone: string
  short_description: string | null
}

export type Source = {
  id: number
  name: string
  display_name: string | null
  logo: string | null
  category: number
  default: boolean
  operator: number
  ota_commission_percent: number
  zostel_commission_percent: number
  pricing: number | null
}

export type Guest = {
  id: number
  name: string
  first_name: string
  last_name: string
  email: string
  mobile: string
  gender: string
  address: string
  sso_user_id: string | null
  data: Record<string, unknown>
  mygate_passcode: string | null
  time_create: string
  time_update: string
  country: string | null
}

export type RoomAsset = {
  id: number
  name: string
  parent_name: string | null
  description: string | null
  data: Record<string, unknown>
  inventory: number
  time_create: string
  time_update: string
}

export type RoomLine = {
  id: number
  dates: string[]
  units: number
  price: number
  occupancy: number
  tax_breakup: Record<string, number>
  discount: number
  total_amount: number
  addons: unknown[]
  offer_discount: number
  final_amount: number
  asset: RoomAsset
  name: string
}

export type RoomInfoGuest = {
  name: string
  email: string
  gender: string
  mobile: string
  address: string
  first_name: string
  last_name: string
}

export type RoomInfo = {
  guest: RoomInfoGuest
  price: number
  nights: number
  ref_id: string
  status: number
  checkin: string
  checkout: string
  discount: number
  asset_name: string
  paid_amount: number
  tax_breakup: { cgst: number; sgst: number; total_tax: number }
  total_amount: number
  extra_charges: number
  unit_sequence: number
  advance_amount: number
  inventory_name: string
  transaction_id: string
  paid_extra_charges: number
}

export type Booking = {
  id: number
  code: string
  status: BookingStatus
  guests: Guest[]
  rooms: RoomLine[]
  source: Source
  operator: Operator
  currency: Currency
  rooms_info: RoomInfo[]

  start_date: string
  end_date: string
  time_create: string
  time_update: string

  amount: number
  tax_amount: number
  advance_amount: number
  paid_amount: number
  due_amount: number
  discount: number
  offer_discount: number

  can_pay_later: boolean
  overbooked: boolean
  expected_checkin_count: number
  origin: number
  cancelled_at: string | null

  gst_num: string | null
  guest_notes: string | null
  manager_notes: string | null
  booking_pdf: string | null
  reserved_by: Record<string, unknown>
  meta_details: Record<string, unknown>
  checkins: unknown[]
  created_by: number | null
  coupon: number | null
  channel_booking: number | null
}
