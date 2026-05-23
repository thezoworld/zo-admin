import * as React from "react"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  Activity01Icon,
  ArrowDown01Icon,
  ArrowDownRight01Icon,
  Building03Icon,
  ArrowLeft01Icon,
  ArrowLeftDoubleIcon,
  ArrowRightDoubleIcon,
  ArrowUpRight01Icon,
  BedDoubleIcon,
  Briefcase01Icon,
  BubbleChatIcon,
  Calendar01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  ComputerIcon,
  CreditCardIcon,
  DashboardSquare01Icon,
  HelpCircleIcon,
  InformationCircleIcon,
  KeyboardIcon,
  LifebuoyIcon,
  Logout03Icon,
  Menu01Icon,
  Moon02Icon,
  Note01Icon,
  Notification03Icon,
  PlusSignIcon,
  RupeeIcon,
  Search01Icon,
  Settings01Icon,
  SmartPhone01Icon,
  Sun03Icon,
  UserIcon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons"

type IconProps = Omit<React.ComponentProps<typeof HugeiconsIcon>, "icon">

function makeIcon(icon: IconSvgElement, displayName: string) {
  const Component = React.forwardRef<SVGSVGElement, IconProps>(
    function HugeIcon(props, ref) {
      return <HugeiconsIcon ref={ref} icon={icon} {...props} />
    }
  )
  Component.displayName = displayName
  return Component
}

// ---- Header / common UI ----
export const Bell = makeIcon(Notification03Icon, "Bell")
export const Search = makeIcon(Search01Icon, "Search")
export const HelpCircle = makeIcon(HelpCircleIcon, "HelpCircle")
export const Settings = makeIcon(Settings01Icon, "Settings")
export const Menu = makeIcon(Menu01Icon, "Menu")
export const LogOut = makeIcon(Logout03Icon, "LogOut")
export const User = makeIcon(UserIcon, "User")
export const Users = makeIcon(UserMultipleIcon, "Users")
export const CreditCard = makeIcon(CreditCardIcon, "CreditCard")
export const Keyboard = makeIcon(KeyboardIcon, "Keyboard")
export const LifeBuoy = makeIcon(LifebuoyIcon, "LifeBuoy")
export const Sun = makeIcon(Sun03Icon, "Sun")
export const Moon = makeIcon(Moon02Icon, "Moon")
export const X = makeIcon(Cancel01Icon, "X")
export const ChevronsLeft = makeIcon(ArrowLeftDoubleIcon, "ChevronsLeft")
export const ChevronsRight = makeIcon(ArrowRightDoubleIcon, "ChevronsRight")

// ---- Overview ----
export const ArrowUpRight = makeIcon(ArrowUpRight01Icon, "ArrowUpRight")
export const ArrowDownRight = makeIcon(ArrowDownRight01Icon, "ArrowDownRight")
export const BedDouble = makeIcon(BedDoubleIcon, "BedDouble")
export const Calendar = makeIcon(Calendar01Icon, "Calendar")
export const CheckCircle2 = makeIcon(CheckmarkCircle02Icon, "CheckCircle2")
export const IndianRupee = makeIcon(RupeeIcon, "IndianRupee")
export const Plus = makeIcon(PlusSignIcon, "Plus")

// ---- Login ----
export const ArrowLeft = makeIcon(ArrowLeft01Icon, "ArrowLeft")
export const Phone = makeIcon(SmartPhone01Icon, "Phone")

// ---- Property selector ----
export const Building = makeIcon(Building03Icon, "Building")
export const ChevronDown = makeIcon(ArrowDown01Icon, "ChevronDown")

// ---- Sidebar nav ----
export const LayoutDashboard = makeIcon(
  DashboardSquare01Icon,
  "LayoutDashboard"
)
export const Info = makeIcon(InformationCircleIcon, "Info")
export const Briefcase = makeIcon(Briefcase01Icon, "Briefcase")
export const FileText = makeIcon(Note01Icon, "FileText")
export const Waves = makeIcon(Activity01Icon, "Waves")
export const MessageSquare = makeIcon(BubbleChatIcon, "MessageSquare")
export const Monitor = makeIcon(ComputerIcon, "Monitor")
