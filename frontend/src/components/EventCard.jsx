import { Calendar, MapPin, Users, Eye, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/StatusBadge"
import { useNavigate } from "react-router-dom"

import conferenceImg from "@/assets/event-conference.jpg"
import weddingImg from "@/assets/event-wedding.jpg"
import workshopImg from "@/assets/event-workshop.jpg"

const imageMap = {
  conference: conferenceImg,
  wedding: weddingImg,
  workshop: workshopImg,
}

export function EventCard({ event }) {
  const navigate = useNavigate()

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-44 overflow-hidden">
        <img
          src={imageMap[event.image] || conferenceImg}
          alt={event.name}
          className="w-full h-full object-cover"
        />

        <div className="absolute top-3 right-3">
          <StatusBadge status={event.status} />
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground text-base mb-2">
          {event.name}
        </h3>

        <div className="space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>{event.date}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5" />
            <span>{event.guests} Invitados</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate(`/eventos/${event.id}`)}
          >
            <Eye className="h-4 w-4 text-primary" />
          </Button>

          <Button variant="outline" size="icon" className="h-8 w-8">
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </Button>

          <Button variant="outline" size="icon" className="h-8 w-8">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}