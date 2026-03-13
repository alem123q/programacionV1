export const mockEvents = [
  {
    id: "1",
    name: "Conferencia Tech 2024",
    date: "15 Octubre, 2024",
    time: "18:00 - 22:00",
    location: "Auditorio Central, CDMX",
    guests: 500,
    status: "confirmado",
    image: "conference",
    description:
      "Evento principal de lanzamiento de nuestra nueva suite de software. Se espera la asistencia de 150 invitados VIP, incluyendo accionistas clave y prensa especializada.",
  },
  {
    id: "2",
    name: "Boda de Ana y Luis",
    date: "22 Noviembre, 2024",
    time: "16:00 - 23:00",
    location: "Jardín Botánico",
    guests: 150,
    status: "pendiente",
    image: "wedding",
  },
  {
    id: "3",
    name: "Workshop Creativo UI",
    date: "05 Diciembre, 2024",
    time: "09:00 - 14:00",
    location: "Co-working Spaces NY",
    guests: 30,
    status: "en_curso",
    image: "workshop",
  },
]

export const mockGuests = [
  {
    id: "1",
    name: "John Doe",
    company: "TechFlow",
    role: "CEO",
    email: "john.doe@techflow.com",
    status: "confirmado",
    date: "12 Oct, 2023",
    initials: "JD",
  },
  {
    id: "2",
    name: "Sarah Miller",
    company: "Creativa",
    role: "Designer",
    email: "sarah.m@creativa.io",
    status: "pendiente",
    date: "15 Oct, 2023",
    initials: "SM",
  },
  {
    id: "3",
    name: "Robert King",
    company: "Logistics+",
    role: "Director",
    email: "robert.k@logistics.net",
    status: "cancelado",
    date: "10 Oct, 2023",
    initials: "RK",
  },
  {
    id: "4",
    name: "Elena Lopez",
    company: "MediaCorp",
    role: "Manager",
    email: "e.lopez@mediacorp.es",
    status: "confirmado",
    date: "18 Oct, 2023",
    initials: "EL",
  },
  {
    id: "5",
    name: "Carlos Ruiz",
    email: "carlos.ruiz@gmail.com",
    status: "confirmado",
    date: "20 Oct, 2023",
    initials: "CR",
  },
  {
    id: "6",
    name: "Elena Martínez",
    email: "elena.mtz@startup.co",
    status: "pendiente",
    date: "21 Oct, 2023",
    initials: "EM",
  },
  {
    id: "7",
    name: "Roberto Gómez",
    email: "roberto@tech-news.es",
    status: "confirmado",
    date: "22 Oct, 2023",
    initials: "RG",
  },
  {
    id: "8",
    name: "Sofía Lozano",
    email: "slozano@invest.com",
    status: "sin_respuesta",
    date: "23 Oct, 2023",
    initials: "SL",
  },
]

export const mockExpenses = [
  { id: "1", concept: "Catering VIP (150pax)", paidBy: "Juan D.", paidByInitials: "JD", amount: 4500 },
  { id: "2", concept: "Alquiler de Salón", paidBy: "Marina A.", paidByInitials: "MA", amount: 2800 },
  { id: "3", concept: "Equipos de Sonido", paidBy: "Juan D.", paidByInitials: "JD", amount: 1200 },
  { id: "4", concept: "Diseño e Imprenta", paidBy: "Carlos P.", paidByInitials: "CP", amount: 650 },
]

export const statusColors = {
  confirmado: "bg-success/10 text-success border-success/20",
  pendiente: "bg-warning/10 text-warning border-warning/20",
  en_curso: "bg-primary/10 text-primary border-primary/20",
  en_progreso: "bg-primary/10 text-primary border-primary/20",
  cancelado: "bg-destructive/10 text-destructive border-destructive/20",
  sin_respuesta: "bg-muted text-muted-foreground border-border",
}

export const statusLabels = {
  confirmado: "Confirmado",
  pendiente: "Pendiente",
  en_curso: "En Curso",
  en_progreso: "En Progreso",
  cancelado: "Cancelado",
  sin_respuesta: "Sin Respuesta",
}