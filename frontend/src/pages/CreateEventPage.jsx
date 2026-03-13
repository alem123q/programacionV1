import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Info, MapPin, FileText, Calendar, Clock, Save } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/DashboardLayout"

const CreateEventPage = () => {
  const navigate = useNavigate()
  const [name, setName] = useState("")

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="text-sm text-muted-foreground mb-1">
          <a href="/eventos" className="text-primary hover:underline">
            Eventos
          </a>{" "}
          &gt; Nuevo
        </div>

        <h1 className="text-2xl font-bold text-foreground">
          Crear Nuevo Evento
        </h1>

        <p className="text-muted-foreground">
          Planifica y organiza cada detalle de tu próximo gran momento.
        </p>
      </div>

      <div className="max-w-3xl bg-card rounded-xl border p-8 space-y-8">
        {/* Info General */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Información General
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Nombre del evento
              </label>

              <Input
                placeholder="Ej. Lanzamiento de Producto 2024"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Fecha
                </label>

                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                  <Input type="date" className="pl-9" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Hora
                </label>

                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                  <Input type="time" className="pl-9" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Location */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Ubicación
            </h2>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Lugar del evento
            </label>

            <Input placeholder="Dirección o nombre del local" />
          </div>

          <div className="mt-4 rounded-lg bg-muted h-40 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="h-6 w-6 mx-auto mb-1" />
              <span className="text-sm">
                Haz clic para ajustar la ubicación en el mapa
              </span>
            </div>
          </div>
        </section>

        {/* Details */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Detalles adicionales
            </h2>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Descripción
            </label>

            <Textarea
              placeholder="Describe los objetivos, invitados o cualquier información relevante..."
              rows={5}
            />
          </div>
        </section>

        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            Cancelar
          </Button>

          <Button onClick={() => navigate("/dashboard")}>
            <Save className="mr-2 h-4 w-4" />
            Guardar evento
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          🔒 Información protegida
        </span>
        <span className="flex items-center gap-1">
          ☁️ Auto-guardado habilitado
        </span>
      </div>
    </DashboardLayout>
  )
}

export default CreateEventPage