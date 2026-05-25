"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { useSidebar } from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ChevronsLeft, ChevronsRight } from "@/components/icons"

export function CustomSidebarTrigger() {
  const { toggleSidebar, state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild>
        <Button
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          variant="outline"
          size="icon-sm"
          onClick={toggleSidebar}
          className="relative overflow-hidden rounded-full"
        >
          <ChevronsLeft
            className={cn(
              "transition-all duration-300 ease-out",
              isCollapsed
                ? "-translate-x-2 scale-0 opacity-0"
                : "translate-x-0 scale-100 opacity-100"
            )}
          />
          <ChevronsRight
            className={cn(
              "absolute transition-all duration-300 ease-out",
              isCollapsed
                ? "translate-x-0 scale-100 opacity-100"
                : "translate-x-2 scale-0 opacity-0"
            )}
          />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="px-2 py-1" side="right">
        {isCollapsed ? "Expand" : "Collapse"} sidebar{" "}
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>b</Kbd>
        </KbdGroup>
      </TooltipContent>
    </Tooltip>
  )
}
