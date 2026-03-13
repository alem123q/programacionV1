import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, Lock, ArrowRight, Calendar } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

const LoginPage = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()
    navigate("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* Top nav */}

      <nav className="h-14 border-b bg-card flex items-center justify-between px-6">

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Calendar className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground">
            EventFlow
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">
            Producto
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Precios
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Soporte
          </a>
        </div>

        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Saber más
        </a>

      </nav>

      {/* Login form */}

      <div className="flex-1 flex items-center justify-center p-4">

        <div className="w-full max-w-md bg-card rounded-xl border p-8">

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">
              Bienvenido
            </h1>
            <p className="text-muted-foreground mt-1">
              Gestiona tus eventos sin complicaciones.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Correo electrónico
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <Input
                  type="email"
                  placeholder="nombre@empresa.com"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-foreground">
                  Contraseña
                </label>

                <a href="#" className="text-sm text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-sm text-muted-foreground"
              >
                Mantener sesión iniciada
              </label>
            </div>

            <Button type="submit" className="w-full h-11">
              Iniciar Sesión
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            ¿No tienes una cuenta?{" "}
            <a className="text-primary font-semibold hover:underline">
              Regístrate gratis
            </a>
          </p>

        </div>

      </div>

      {/* Footer */}

      <footer className="h-14 border-t flex items-center justify-between px-6 text-xs text-muted-foreground">

        <span>
          © 2024 EventFlow SaaS. Todos los derechos reservados.
        </span>

        <div className="flex gap-4">
          <a className="hover:text-foreground">Estatus</a>
          <a className="hover:text-foreground">Seguridad</a>
          <a className="hover:text-foreground">Contacto</a>
        </div>

      </footer>

    </div>
  )
}

export default LoginPage