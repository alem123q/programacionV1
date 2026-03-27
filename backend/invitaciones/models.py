import uuid

from django.db import models

from invitados.models import Invitado


class Invitacion(models.Model):
    class CanalEnvio(models.TextChoices):
        EMAIL = "email", "Email"
        WHATSAPP = "whatsapp", "WhatsApp"
        LINK = "link", "Link"

    class EstadoInvitacion(models.TextChoices):
        PENDIENTE = "pendiente", "Pendiente"
        ENVIADA = "enviada", "Enviada"
        ENTREGADA = "entregada", "Entregada"
        ABIERTA = "abierta", "Abierta"
        VENCIDA = "vencida", "Vencida"

    id = models.BigAutoField(primary_key=True)
    invitado = models.OneToOneField(
        Invitado,
        on_delete=models.CASCADE,
        related_name="invitacion",
    )
    canal_envio = models.CharField(
        max_length=20,
        choices=CanalEnvio.choices,
        default=CanalEnvio.EMAIL,
    )
    estado = models.CharField(
        max_length=15,
        choices=EstadoInvitacion.choices,
        default=EstadoInvitacion.PENDIENTE,
    )
    codigo_acceso = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    fecha_envio = models.DateTimeField(null=True, blank=True)
    mensaje_personalizado = models.TextField(blank=True)

    class Meta:
        verbose_name = "Invitación"
        verbose_name_plural = "Invitaciones"

    def __str__(self):
        return f"Invitacion para {self.invitado.nombre}"
