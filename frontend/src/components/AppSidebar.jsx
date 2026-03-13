import { LayoutDashboard, Calendar, Users, Mail, Settings, HelpCircle, Plus } from "lucide-react"
import { NavLink } from "@/components/NavLink"
import { useLocation } from "react-router-dom"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"


const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Mis Eventos", url: "/eventos", icon: Calendar },
  { title: "Invitados", url: "/invitados", icon: Users },
  { title: "Invitaciones", url: "/invitaciones", icon: Mail },
]


const configItems = [
  { title: "Ajustes", url: "/ajustes", icon: Settings },
  { title: "Soporte", url: "/soporte", icon: HelpCircle },
]


export function AppSidebar() {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"
  const location = useLocation()


  return (
    <Sidebar collapsible="icon">
      <div className="p-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Calendar className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg text-foreground">EventFlow</span>
        )}
      </div>


      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>MENÚ PRINCIPAL</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        `hover:bg-accent/50 ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : ""
                        }`
                      }
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


        <SidebarGroup>
          <SidebarGroupLabel>CONFIGURACIÓN</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        `hover:bg-accent/50 ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : ""
                        }`
                      }
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>


      <SidebarFooter className="p-4">
        {!collapsed && (
          <Button
            className="w-full"
            onClick={() => (window.location.href = "/eventos/nuevo")}
          >
            <Plus className="mr-2 h-4 w-4" /> Nuevo Evento
          </Button>
        )}


        {!collapsed && (
          <div className="flex items-center gap-3 mt-4">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                AR
              </AvatarFallback>
            </Avatar>


            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">
                Alex Rivera
              </span>
              <span className="text-xs text-muted-foreground">Admin Pro</span>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
