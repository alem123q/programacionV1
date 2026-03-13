import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Index = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate("/dashboard")
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-muted-foreground">Cargando aplicación...</p>
    </div>
  )
}

export default Index