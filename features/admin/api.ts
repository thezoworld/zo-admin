import { zostelServer } from "@/lib/api/client"
import { defineMutation, defineQuery } from "@/lib/api/factory"

export const adminQueryApis = {
  ADMIN_PROFILE_SEARCH: defineQuery({
    server: zostelServer,
    path: "/api/v1/admin/profile/search",
    key: ["admin", "profile", "search"],
  }),
  ADMIN_PM_CHECKIN: defineQuery({
    server: zostelServer,
    path: "/api/v1/admin/pm/checkins",
    key: ["admin", "pm", "checkins"],
  }),
  ADMIN_PM_CHECKIN_SEARCH: defineQuery({
    server: zostelServer,
    path: "/api/v1/admin/pm/checkin/search",
    key: ["admin", "pm", "checkin", "search"],
  }),
  ADMIN_PM_BOOKINGS: defineQuery({
    server: zostelServer,
    path: "/api/v1/admin/pm/bookings",
    key: ["admin", "pm", "bookings"],
  }),
  ADMIN_PM_BOOKING_SEARCH: defineQuery({
    server: zostelServer,
    path: "/api/v1/admin/pm/booking/search",
    key: ["admin", "pm", "booking", "search"],
  }),
  ADMIN_PM_REPORTS: defineQuery({
    server: zostelServer,
    path: "/api/v1/admin/pm/reports",
    key: ["admin", "pm", "reports"],
  }),
  ADMIN_PM_GUEST_PROFILE: defineQuery({
    server: zostelServer,
    path: "/api/v1/admin/pm/guest-profile",
    key: ["admin", "pm", "guest-profile"],
  }),
  ADMIN_PM_USER_NOTES: defineQuery({
    server: zostelServer,
    path: "/api/v1/admin/pm/user-notes",
    key: ["admin", "pm", "user-notes"],
  }),
  ADMIN_USERS: defineQuery({
    server: zostelServer,
    path: "/api/v1/admin/users",
    key: ["admin", "users"],
  }),
  ADMIN_ASSOCIATION: defineQuery({
    server: zostelServer,
    path: "/api/v1/admin/association",
    key: ["admin", "association"],
  }),
  ADMIN_ACCESS_GROUP: defineQuery({
    server: zostelServer,
    path: "/api/v1/admin/access-group",
    key: ["admin", "access-group"],
  }),
  ADMIN_USER_ACCESS_GROUP: defineQuery({
    server: zostelServer,
    path: "/api/v1/admin/user-access-group",
    key: ["admin", "user-access-group"],
  }),
  ADMIN_PM_OPERATOR_ROOMS: defineQuery({
    server: zostelServer,
    path: "/api/v1/admin/pm/operator",
    key: ["admin", "pm", "operator", "rooms"],
  }),
  ADMIN_PM_BLOCKED_ROOM: defineQuery({
    server: zostelServer,
    path: "/api/v1/admin/pm/blocked-room",
    key: ["admin", "pm", "blocked-room"],
  }),
  ADMIN_PM_STAY_CALENDAR: defineQuery({
    server: zostelServer,
    path: "/api/v1/admin/pm/stay-calendar",
    key: ["admin", "pm", "stay-calendar"],
  }),
}

export const adminMutationApis = {
  ADMIN_PM_GUEST_PROFILE: defineMutation({
    server: zostelServer,
    path: "/api/v1/admin/pm/guest-profile",
  }),
  ADMIN_PROFILE: defineMutation({
    server: zostelServer,
    path: "/api/v1/admin/profile",
  }),
  ADMIN_PM_CHECKIN: defineMutation({
    server: zostelServer,
    path: "/api/v1/admin/pm/checkins",
  }),
  ADMIN_PM_USER_NOTES: defineMutation({
    server: zostelServer,
    path: "/api/v1/admin/pm/user-notes",
  }),
  ADMIN_PM_BOOKINGS: defineMutation({
    server: zostelServer,
    path: "/api/v1/admin/pm/bookings",
  }),
  ADMIN_ASSOCIATION: defineMutation({
    server: zostelServer,
    path: "/api/v1/admin/association",
  }),
  ADMIN_USER_ACCESS_GROUP: defineMutation({
    server: zostelServer,
    path: "/api/v1/admin/user-access-group",
  }),
  ADMIN_PM_BLOCKED_ROOM_BLOCK: defineMutation({
    server: zostelServer,
    path: "/api/v1/admin/pm/blocked-room/block",
    multipart: true,
  }),
  ADMIN_PM_BLOCKED_ROOM_UNBLOCK: defineMutation({
    server: zostelServer,
    path: "/api/v1/admin/pm/blocked-room",
  }),
}

export type ADMIN_QUERY_ENDPOINTS = keyof typeof adminQueryApis
export type ADMIN_MUTATION_ENDPOINTS = keyof typeof adminMutationApis
