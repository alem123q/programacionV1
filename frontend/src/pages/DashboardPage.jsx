import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/DashboardLayout"
import { EventCard } from "@/components/EventCard"
import { mockEvents } from "@/lib/mock-data"
import { useNavigate } from "react-router-dom"

const DashboardPage = () => {
  const navigate = useNavigate()

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mis Eventos</h1>
          <p className="text-muted-foreground">
            Gestiona y organiza tus próximos lanzamientos y reuniones.
          </p>
        </div>

        <Button onClick={() => navigate("/eventos/nuevo")}>
          <Plus className="mr-2 h-4 w-4" />
          Crear Evento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button variant="outline">Cargar más eventos</Button>
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage