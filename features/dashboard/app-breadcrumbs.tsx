"use client"

import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { navGroups } from "@/features/dashboard/app-shared"

function findCrumbs(pathname: string) {
  for (const group of navGroups) {
    for (const item of group.items) {
      if (item.path === pathname) {
        return { group: group.label, item: item.title, icon: item.icon }
      }
      if (item.subItems?.length) {
        for (const sub of item.subItems) {
          if (sub.path === pathname) {
            return {
              group: group.label,
              parent: item.title,
              item: sub.title,
              icon: sub.icon,
            }
          }
        }
      }
    }
  }
  return null
}

export function AppBreadcrumbs() {
  const pathname = usePathname()
  const crumbs = findCrumbs(pathname)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden sm:flex">
          <BreadcrumbLink href="/overview">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        {crumbs?.group && (
          <>
            <BreadcrumbSeparator className="hidden sm:block" />
            <BreadcrumbItem className="hidden text-muted-foreground sm:flex">
              {crumbs.group}
            </BreadcrumbItem>
          </>
        )}
        {"parent" in (crumbs ?? {}) && crumbs?.parent && (
          <>
            <BreadcrumbSeparator className="hidden sm:block" />
            <BreadcrumbItem className="hidden sm:flex">
              {crumbs.parent}
            </BreadcrumbItem>
          </>
        )}
        {crumbs?.item && (
          <>
            <BreadcrumbSeparator className="hidden sm:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-2 [&>svg]:size-3.5">
                {crumbs.icon}
                {crumbs.item}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
