import { useState } from "react"
import { Download, UserPlus, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"

import { DashboardLayout } from "@/components/DashboardLayout"
import { StatusBadge } from "@/components/StatusBadge"

import { mockGuests } from "@/lib/mock-data"

const filters = [
  "Todos los invitados",
  "Confirmados",
  "Pendientes",
  "Cancelados"
]

const GuestManagementPage = () => {
  const [activeFilter, setActiveFilter] = useState(0)

  const filteredGuests =
    activeFilter === 0
      ? mockGuests
      : mockGuests.filter((g) => {
          if (activeFilter === 1) return g.status === "confirmado"
          if (activeFilter === 2) return g.status === "pendiente"
          if (activeFilter === 3) return g.status === "cancelado"
          return true
        })

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Gestión de Invitados
          </h1>

          <p className="text-muted-foreground">
            Organiza y controla el acceso a tu evento corporativo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>

          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Añadir Invitado
          </Button>
        </div>
      </div>

      {/* Filters */}

      <div className="flex gap-2 mb-6">
        {filters.map((f, i) => (
          <Button
            key={f}
            variant={activeFilter === i ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(i)}
          >
            {f}
          </Button>
        ))}
      </div>

      {/* Table */}

      <div className="bg-card rounded-xl border overflow-hidden">

        <table className="w-full text-sm">

          <thead>
            <tr className="border-b bg-muted/50">

              <th className="w-10 p-4">
                <Checkbox />
              </th>

              <th className="text-left p-4 font-medium text-muted-foreground">
                NOMBRE
              </th>

              <th className="text-left p-4 font-medium text-muted-foreground">
                EMAIL
              </th>

              <th className="text-left p-4 font-medium text-muted-foreground">
                ESTADO
              </th>

              <th className="text-left p-4 font-medium text-muted-foreground">
                FECHA REGISTRO
              </th>

              <th className="text-left p-4 font-medium text-muted-foreground">
                ACCIONES
              </th>

            </tr>
          </thead>

          <tbody>

            {filteredGuests.map((guest) => (

              <tr
                key={guest.id}
                className="border-b last:border-0 hover:bg-muted/30 transition-colors"
              >

                <td className="p-4">
                  <Checkbox />
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-3">

                    <Avatar className="h-8 w-8">

                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {guest.initials}
                      </AvatarFallback>

                    </Avatar>

                    <div>
                      <div className="font-medium text-foreground">
                        {guest.name}
                      </div>

                      {guest.company && (
                        <div className="text-xs text-muted-foreground">
                          {guest.role} @ {guest.company}
                        </div>
                      )}

                    </div>

                  </div>
                </td>

                <td className="p-4 text-muted-foreground">
                  {guest.email}
                </td>

                <td className="p-4">
                  <StatusBadge status={guest.status} />
                </td>

                <td className="p-4 text-muted-foreground">
                  {guest.date}
                </td>

                <td className="p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary"
                  >
                    Ver
                  </Button>
                </td>

              </tr>

            ))}

          </tbody>
        </table>

        {/* Pagination */}

        <div className="flex items-center justify-between p-4 border-t">

          <span className="text-sm text-muted-foreground">
            Mostrando <strong>{filteredGuests.length}</strong> de{" "}
            <strong>750</strong> invitados
          </span>

          <div className="flex items-center gap-1">

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button size="sm" className="h-8 w-8 p-0">
              1
            </Button>

            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              2
            </Button>

            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              3
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}

export default GuestManagementPage