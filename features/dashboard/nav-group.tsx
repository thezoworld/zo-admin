import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import type { SidebarNavGroup } from "@/features/dashboard/app-shared"

function Badge({ value }: { value: string | number }) {
  return (
    <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/15 px-1.5 text-[10px] font-semibold text-primary tabular-nums ring-1 ring-primary/20 group-data-[active=true]/menu-button:bg-primary-foreground/20 group-data-[active=true]/menu-button:text-primary-foreground group-data-[active=true]/menu-button:ring-primary-foreground/30 group-data-[collapsible=icon]:hidden">
      {value}
    </span>
  )
}

/**
 * Active row styling:
 *  • In expanded mode → thin left accent bar (via ::before).
 *  • In icon-collapsed mode → bg-primary fill with primary-foreground icon (the "cool" pill).
 * Plus a subtle scale-up animation on hover in icon mode.
 */
const navButtonClass = [
  "relative transition-all",
  // expanded active: thin left accent bar with primary glow
  "data-[active=true]:before:absolute data-[active=true]:before:content-[''] data-[active=true]:before:left-0 data-[active=true]:before:top-1/2 data-[active=true]:before:h-6 data-[active=true]:before:w-1 data-[active=true]:before:-translate-y-1/2 data-[active=true]:before:rounded-r-full data-[active=true]:before:bg-primary data-[active=true]:before:shadow-[0_0_12px_var(--primary)]",
  // collapsed mode tweaks
  "group-data-[collapsible=icon]:rounded-xl group-data-[collapsible=icon]:hover:scale-105 group-data-[collapsible=icon]:transition-transform",
  // collapsed active: filled primary pill
  "group-data-[collapsible=icon]:data-[active=true]:bg-primary group-data-[collapsible=icon]:data-[active=true]:text-primary-foreground group-data-[collapsible=icon]:data-[active=true]:shadow-md group-data-[collapsible=icon]:data-[active=true]:shadow-primary/30 group-data-[collapsible=icon]:data-[active=true]:hover:bg-primary",
  // hide expanded-mode accent bar in icon mode
  "group-data-[collapsible=icon]:data-[active=true]:before:hidden",
].join(" ")

export function NavGroup({ label, items }: SidebarNavGroup) {
  return (
    <SidebarGroup>
      {label && (
        <SidebarGroupLabel className="text-[10px] font-semibold tracking-wider text-sidebar-foreground/50 uppercase">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            asChild
            className="group/collapsible"
            defaultOpen={
              !!item.isActive || item.subItems?.some((i) => !!i.isActive)
            }
            key={item.title}
          >
            <SidebarMenuItem>
              {item.subItems?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={item.isActive}
                      tooltip={item.title}
                      className={navButtonClass}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                      {item.badge !== undefined && <Badge value={item.badge} />}
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        className={
                          "ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 " +
                          (item.badge !== undefined ? "ml-1.5" : "")
                        }
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.subItems?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={subItem.isActive}
                          >
                            <Link href={subItem.path ?? "#"}>
                              {subItem.icon}
                              <span>{subItem.title}</span>
                              {subItem.badge !== undefined && (
                                <Badge value={subItem.badge} />
                              )}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : (
                <SidebarMenuButton
                  asChild
                  isActive={item.isActive}
                  tooltip={item.title}
                  className={navButtonClass}
                >
                  <Link href={item.path ?? "#"}>
                    {item.icon}
                    <span>{item.title}</span>
                    {item.badge !== undefined && <Badge value={item.badge} />}
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
