"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { NavGroup } from "@/features/dashboard/nav-group"
import { footerNavLinks, navGroups } from "@/features/dashboard/app-shared"
import { Building, Settings } from "@/components/icons"
import { useAuthorization } from "@/features/authorization"

export function AppSidebar() {
  const { associatedOperators, selectedOperator, setSelectedOperator } =
    useAuthorization()

  const selectedId =
    selectedOperator?.id != null ? String(selectedOperator.id) : undefined

  const handleOperatorChange = React.useCallback(
    function pickOperator(value: string) {
      const op = associatedOperators.find((o) => String(o.id) === value)
      if (op) setSelectedOperator(op)
    },
    [associatedOperators, setSelectedOperator]
  )

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="h-16 justify-center">
        <SidebarMenuButton asChild size="lg" className="h-12!">
          <Link href="/dashboard/home" className="flex items-center gap-3">
            <span className="relative inline-flex shrink-0">
              <Image
                src="https://proxy.cdn.zo.xyz/gallery/media/images/0de4ce27-6ca4-4015-8a74-54cdae159712_20260523001302.png"
                alt="Zo World"
                width={36}
                height={36}
                className="size-9 rounded-xl object-contain ring-1 ring-border"
              />
              <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-sidebar" />
            </span>
            <div className="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate text-sm font-bold tracking-wide">
                Zo World
              </span>
              <span className="truncate text-[10px] text-muted-foreground">
                Follow Your Heart
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent>
        {/* Property selector */}
        <SidebarGroup className="pb-0 group-data-[collapsible=icon]:hidden">
          <p className="mb-1.5 px-1 text-[10px] font-semibold tracking-wider text-sidebar-foreground/50 uppercase">
            Property
          </p>
          <Select value={selectedId} onValueChange={handleOperatorChange}>
            <SelectTrigger className="h-12 w-full rounded-xl border-sidebar-border bg-sidebar-accent/40 text-sm transition-all hover:bg-sidebar-accent/70 hover:shadow-sm focus:ring-2 focus:ring-primary/30">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/20">
                  <Building className="size-4" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col items-start leading-tight">
                  <span className="text-[10px] font-medium text-muted-foreground">
                    Viewing
                  </span>
                  <SelectValue placeholder="Select property" />
                </div>
              </div>
            </SelectTrigger>
            <SelectContent>
              {associatedOperators.map((op) => (
                <SelectItem key={String(op.id)} value={String(op.id)}>
                  {(op.name as string) ??
                    (op.code as string) ??
                    `Operator ${String(op.id)}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SidebarGroup>

        {navGroups.map((group, index) => (
          <NavGroup key={`sidebar-group-${index}`} {...group} />
        ))}
      </SidebarContent>

      <SidebarFooter className="gap-2">
        {/* User card */}
        <div className="flex items-center gap-3 rounded-2xl border bg-sidebar-accent/30 p-2.5 transition-colors group-data-[collapsible=icon]:hidden hover:bg-sidebar-accent/60">
          <Avatar className="size-9">
            <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
              SS
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-semibold">Son Shekhawat</p>
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <p className="truncate text-[11px] text-muted-foreground">
                Property Manager
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Settings"
            className="rounded-lg"
          >
            <Settings />
          </Button>
        </div>

        {/* Help links */}
        <div className="flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
          {footerNavLinks.map((item) => (
            <Link
              key={item.title}
              href={item.path ?? "#"}
              className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
            >
              <span className="[&_svg]:size-3.5">{item.icon}</span>
              {item.title}
            </Link>
          ))}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
