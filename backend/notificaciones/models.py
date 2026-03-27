from django.db import models

from invitados.models import Invitado
from invitaciones.models import Invitacion


class Notificacion(models.Model):
    class Canal(models.TextChoices):
        EMAIL = "email", "Email"
        WHATSAPP = "whatsapp", "WhatsApp"

    class Estado(models.TextChoices):
        PENDIENTE = "pendiente", "Pendiente"
        ENVIADA = "enviada", "Enviada"
        ENTREGADA = "entregada", "Entregada"
        LEIDA = "leida", "Leida"
        FALLIDA = "fallida", "Fallida"

    id = models.BigAutoField(primary_key=True)
    invitado = models.ForeignKey(
        Invitado,
        on_delete=models.CASCADE,
        related_name="notificaciones",
    )
    invitacion = models.ForeignKey(
        Invitacion,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="notificaciones",
    )
    canal = models.CharField(
        max_length=20,
        choices=Canal.choices,
        default=Canal.EMAIL,
    )
    asunto = models.CharField(max_length=200)
    mensaje = models.TextField()
    estado = models.CharField(
        max_length=15,
        choices=Estado.choices,
        default=Estado.PENDIENTE,
    )

    class Meta:
        verbose_name = "Notificacion"
        verbose_name_plural = "Notificaciones"
        ordering = ["-id"]

    def __str__(self):
        return f"{self.asunto} - {self.invitado.nombre}"
