import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { TooltipProvider } from "@/components/ui/tooltip"
import { PanelLeft } from "lucide-react"

// Constantes de configuración
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"

// Contexto del sidebar
const SidebarContext = React.createContext(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider")
  return context
}

// Proveedor del sidebar
export const SidebarProvider = ({ defaultOpen = true, children }) => {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(defaultOpen)
  const [openMobile, setOpenMobile] = React.useState(false)

  const toggleSidebar = () => {
    if (isMobile) setOpenMobile((o) => !o)
    else setOpen((o) => !o)
  }

  const state = open ? "expanded" : "collapsed"

  return (
    <SidebarContext.Provider
      value={{ state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar }}
    >
      <TooltipProvider delayDuration={0}>
        <div
          style={{
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          }}
          className="flex min-h-screen w-full"
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
}

// Sidebar principal
export const Sidebar = ({ children, side = "left", collapsible = "offcanvas", className, ...props }) => {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          side={side}
          className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
          style={{ "--sidebar-width": SIDEBAR_WIDTH_MOBILE }}
          {...props}
        >
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      className={cn(
        "fixed inset-y-0 z-10 flex h-screen w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground transition-all",
        side === "left" ? "left-0" : "right-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Botón para abrir/cerrar sidebar
export const SidebarTrigger = React.forwardRef(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(e) => {
        onClick?.(e)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})

// Componentes internos del sidebar (para AppSidebar.jsx)
export const SidebarContent = ({ children }) => <div className="flex-1 overflow-y-auto">{children}</div>
export const SidebarGroup = ({ children }) => <div className="mb-4">{children}</div>
export const SidebarGroupContent = ({ children }) => <div className="flex flex-col">{children}</div>
export const SidebarGroupLabel = ({ children }) => (
  <span className="px-4 py-2 text-xs font-semibold text-muted-foreground">{children}</span>
)
export const SidebarMenu = ({ children }) => <div className="flex flex-col">{children}</div>
export const SidebarMenuButton = Slot
export const SidebarMenuItem = ({ children }) => <div className="px-2 py-1">{children}</div>
export const SidebarFooter = ({ children }) => <div className="mt-auto p-4">{children}</div>