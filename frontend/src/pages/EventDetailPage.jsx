import { Calendar, MapPin, Clock, Share2, UserPlus, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DashboardLayout } from "@/components/DashboardLayout"
import { StatusBadge } from "@/components/StatusBadge"
import { mockEvents, mockGuests, mockExpenses } from "@/lib/mock-data"
import { useParams } from "react-router-dom"

const EventDetailPage = () => {
  const { id } = useParams()

  const event = mockEvents.find((e) => e.id === id) || mockEvents[0]
  const guests = mockGuests.slice(0, 4)
  const expenses = mockExpenses

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)

  return (
    <DashboardLayout>
      <div className="text-sm text-muted-foreground mb-4">
        <a href="/eventos" className="text-primary hover:underline">
          Eventos
        </a>{" "}
        / {event.name}
      </div>

      {/* Event header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <StatusBadge status={event.status} />
                <h1 className="text-2xl font-bold text-foreground">
                  {event.name}
                </h1>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {event.date}
                </span>

                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {event.location}
                </span>

                {event.time && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {event.time}
                  </span>
                )}
              </div>

              {event.description && (
                <p className="mt-4 text-sm text-muted-foreground max-w-2xl">
                  {event.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>

              <Button variant="outline">Editar Evento</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guests & Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Guests */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Lista de Invitados
                </h2>
                <p className="text-sm text-muted-foreground">
                  84 de 150 confirmados
                </p>
              </div>

              <Button size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Agregar Invitado
              </Button>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-2 font-medium italic">Nombre</th>
                  <th className="text-left py-2 font-medium italic">Email</th>
                  <th className="text-left py-2 font-medium italic">Estado</th>
                </tr>
              </thead>

              <tbody>
                {guests.map((g) => (
                  <tr key={g.id} className="border-b last:border-0">
                    <td className="py-3 text-foreground">{g.name}</td>

                    <td className="py-3 text-primary">{g.email}</td>

                    <td className="py-3">
                      <StatusBadge status={g.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <a
              href="/invitados"
              className="text-primary text-sm hover:underline mt-4 block text-center"
            >
              Ver todos los invitados
            </a>
          </CardContent>
        </Card>

        {/* Expenses */}
        <Card>
          <CardContent className="p-6">

            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Control de Gastos
                </h2>

                <p className="text-sm text-muted-foreground">
                  {expenses.length} items registrados
                </p>
              </div>

              <Button size="sm">
                <DollarSign className="mr-2 h-4 w-4" />
                Agregar Gasto
              </Button>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-2 font-medium italic">
                    Concepto
                  </th>

                  <th className="text-left py-2 font-medium italic">
                    Pagado Por
                  </th>

                  <th className="text-right py-2 font-medium italic">
                    Monto
                  </th>
                </tr>
              </thead>

              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id} className="border-b last:border-0">

                    <td className="py-3 text-foreground">
                      {exp.concept}
                    </td>

                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {exp.paidByInitials}
                          </AvatarFallback>
                        </Avatar>

                        <span className="text-muted-foreground">
                          {exp.paidBy}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 text-right text-foreground font-medium">
                      ${exp.amount.toLocaleString()}.00
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <span className="font-semibold text-muted-foreground">
                TOTAL DE GASTOS
              </span>

              <div className="text-right">
                <span className="text-xl font-bold text-destructive">
                  ${totalExpenses.toLocaleString()}.00
                </span>

                <p className="text-xs text-muted-foreground">
                  Presupuesto: $12,000.00
                </p>
              </div>
            </div>

          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  )
}

export default EventDetailPage