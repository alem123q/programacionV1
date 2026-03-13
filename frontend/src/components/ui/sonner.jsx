import { Toaster as Sonner, toast } from "sonner"
import { useState, useEffect } from "react"

const Toaster = ({ ...props }) => {
  const [theme, setTheme] = useState("light")

  // Detectar tema del sistema (opcional)
  useEffect(() => {
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)")
    setTheme(darkQuery.matches ? "dark" : "light")

    const listener = (e) => setTheme(e.matches ? "dark" : "light")
    darkQuery.addEventListener("change", listener)
    return () => darkQuery.removeEventListener("change", listener)
  }, [])

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }