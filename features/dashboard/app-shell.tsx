import { cn } from "@/lib/utils"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppHeader } from "@/features/dashboard/app-header"
import { CustomSidebarTrigger } from "@/features/dashboard/custom-sidebar-trigger"
import { AppSidebar } from "@/features/dashboard/app-sidebar"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden">
      <SidebarProvider className="relative h-svh">
        <AppSidebar />

        {/* Floating seam toggle between sidebar and content */}
        <div
          className={cn(
            "absolute top-24 z-40 hidden -translate-x-1/2 md:block",
            "peer-data-[state=expanded]:left-(--sidebar-width)",
            "peer-data-[state=collapsed]:left-[calc(var(--sidebar-width-icon)+1.125rem)]",
            "transition-[left] duration-200 ease-linear"
          )}
        >
          <CustomSidebarTrigger />
        </div>

        <SidebarInset className="md:peer-data-[variant=inset]:ml-0">
          <AppHeader />
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 md:p-6">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
