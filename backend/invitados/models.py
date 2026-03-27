from django.db import models

from organizador.models import Evento


class Invitado(models.Model):
    class EstadoAsistencia(models.TextChoices):
        PENDIENTE = "pendiente", "Pendiente"
        CONFIRMADO = "confirmado", "Confirmado"
        RECHAZADO = "rechazado", "Rechazado"

    id = models.BigAutoField(primary_key=True)
    evento = models.ForeignKey(
        Evento,
        on_delete=models.CASCADE,
        related_name="invitados",
    )
    nombre = models.CharField(max_length=120)
    email = models.EmailField()
    telefono = models.CharField(max_length=30, blank=True)
    cantidad_acompanantes = models.PositiveIntegerField(default=0)
    estado_asistencia = models.CharField(
        max_length=15,
        choices=EstadoAsistencia.choices,
        default=EstadoAsistencia.PENDIENTE,
    )
    observaciones = models.TextField(blank=True)

    class Meta:
        verbose_name = "Invitado"
        verbose_name_plural = "Invitados"
        ordering = ["nombre"]
        unique_together = ("evento", "email")

    def __str__(self):
        return f"{self.nombre} - {self.evento.titulo}"
