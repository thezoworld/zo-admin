"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  Briefcase01Icon,
  BubbleChatIcon,
  ComputerIcon,
  Doc01Icon,
  Home01Icon,
  InformationCircleIcon,
  Megaphone02Icon,
  Menu01Icon,
  PoolIcon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons"

import type { NavIconName } from "@/features/dashboard/navigation-links"

const ICONS = {
  Home: Home01Icon,
  Menu: Menu01Icon,
  Info: InformationCircleIcon,
  WorkBooth: Briefcase01Icon,
  Doc: Doc01Icon,
  SwimmingPool: PoolIcon,
  Chat: BubbleChatIcon,
  Monitor: ComputerIcon,
  People: UserMultiple02Icon,
  Megaphone: Megaphone02Icon,
} as const

export function NavIcon({
  name,
  className,
}: {
  name: NavIconName
  className?: string
}) {
  return <HugeiconsIcon icon={ICONS[name]} className={className} />
}
