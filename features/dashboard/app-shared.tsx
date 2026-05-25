import type { ReactNode } from "react"
import {
  Briefcase,
  FileText,
  HelpCircle,
  Home,
  Info,
  LayoutDashboard,
  LifeBuoy,
  MessageSquare,
  Monitor,
  Users,
  Waves,
} from "@/components/icons"

export type SidebarNavItem = {
  title: string
  path?: string
  icon?: ReactNode
  isActive?: boolean
  badge?: string | number
  subItems?: SidebarNavItem[]
}

export type SidebarNavGroup = {
  label?: string
  items: SidebarNavItem[]
}

export const navGroups: SidebarNavGroup[] = [
  {
    label: "Front desk",
    items: [
      {
        title: "Home",
        path: "/dashboard/home",
        icon: <Home />,
      },
      {
        title: "Overview",
        path: "/dashboard/overview",
        icon: <LayoutDashboard />,
        isActive: true,
      },
      {
        title: "Pending Web Check-ins",
        path: "/dashboard/pending-web-checkins",
        icon: <Info />,
      },
      {
        title: "Future Web Check-ins",
        path: "/dashboard/web-checkins",
        icon: <Briefcase />,
      },
      {
        title: "Digital Register",
        path: "/dashboard/digital-register",
        icon: <FileText />,
      },
    ],
  },
  {
    label: "Guest services",
    items: [
      {
        title: "Activity Manager",
        path: "/activity-manager",
        icon: <Waves />,
      },
      {
        title: "Chat",
        path: "/chat",
        icon: <MessageSquare />,
        badge: 5,
      },
      {
        title: "Chat Access",
        path: "/chat-access",
        icon: <MessageSquare />,
      },
    ],
  },
  {
    label: "Insights",
    items: [
      {
        title: "Reports",
        path: "/reports",
        icon: <Monitor />,
      },
      {
        title: "Demand Dashboard",
        path: "/demand-dashboard",
        icon: <Monitor />,
      },
    ],
  },
  {
    label: "Property",
    items: [
      {
        title: "Resource Center",
        path: "/resource-center",
        icon: <Info />,
      },
      {
        title: "Staff",
        path: "/staff",
        icon: <Users />,
      },
    ],
  },
]

export const footerNavLinks: SidebarNavItem[] = [
  {
    title: "Help Center",
    path: "/help",
    icon: <HelpCircle />,
  },
  {
    title: "Support",
    path: "/support",
    icon: <LifeBuoy />,
  },
]

export const navLinks: SidebarNavItem[] = [
  ...navGroups.flatMap((group) =>
    group.items.flatMap((item) =>
      item.subItems?.length ? [item, ...item.subItems] : [item]
    )
  ),
  ...footerNavLinks,
]
