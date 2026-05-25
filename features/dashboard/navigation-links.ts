import type { RequiredRole } from "@/features/authorization"

export type NavIconName =
  | "Home"
  | "Menu"
  | "Info"
  | "WorkBooth"
  | "Doc"
  | "SwimmingPool"
  | "Chat"
  | "Monitor"
  | "People"
  | "Megaphone"

export type NavigationLink = {
  id: string
  name: string
  link: string
  iconName: NavIconName
  minAccess: RequiredRole
  requiredDataKey?: string
}

export type NavigationSet = {
  id: string
  title: string
  list: NavigationLink[]
}

export const navigationLinks: NavigationSet[] = [
  {
    id: "",
    title: "",
    list: [
      {
        id: "home",
        name: "Home",
        link: "/dashboard/home",
        iconName: "Home",
        minAccess: "front-desk-manager",
      },
      {
        id: "overview",
        name: "Overview",
        link: "/dashboard/overview",
        iconName: "Menu",
        minAccess: "front-desk-manager",
      },
      {
        id: "announcements",
        name: "Announcements",
        link: "/dashboard/announcements",
        iconName: "Megaphone",
        minAccess: "front-desk-manager",
      },
      {
        id: "pending",
        name: "Pending Web Check-ins",
        link: "/dashboard/pending-web-checkins",
        iconName: "Info",
        minAccess: "front-desk-manager",
      },
      {
        id: "web-checkins",
        name: "Future Web Check-ins",
        link: "/dashboard/web-checkins",
        iconName: "WorkBooth",
        minAccess: "front-desk-manager",
      },
      {
        id: "digital-register",
        name: "Digital Register",
        link: "/dashboard/digital-register",
        iconName: "Doc",
        minAccess: "front-desk-manager",
      },
      {
        id: "activities",
        name: "Activity Manager",
        link: "/dashboard/activity-manager",
        iconName: "SwimmingPool",
        minAccess: "activity-manager",
      },
      {
        id: "chat",
        name: "Chat",
        link: "/dashboard/chat",
        iconName: "Chat",
        minAccess: "activity-manager",
        requiredDataKey: "enabled_pm_chat",
      },
      {
        id: "chat-access",
        name: "Chat Access",
        link: "/dashboard/chat-access",
        iconName: "Chat",
        minAccess: "front-desk-manager",
        requiredDataKey: "enabled_pm_chat",
      },
      {
        id: "reports",
        name: "Reports",
        link: "/dashboard/reports",
        iconName: "Monitor",
        minAccess: "front-desk-manager",
      },
      {
        id: "demand-dashboard",
        name: "Demand Dashboard",
        link: "/dashboard/demand-dashboard",
        iconName: "Monitor",
        minAccess: "property-manager",
        requiredDataKey: "demand_dashboard_url",
      },
      {
        id: "resource-center",
        name: "Resource Center",
        link: "/dashboard/resource-center",
        iconName: "Info",
        minAccess: "property-manager",
        requiredDataKey: "resource_center_url",
      },
      {
        id: "staff",
        name: "Staff",
        link: "/dashboard/staff",
        iconName: "People",
        minAccess: "property-manager",
      },
    ],
  },
]
