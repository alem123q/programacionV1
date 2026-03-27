from django.contrib.auth import get_user_model
from django.db import models


Usuario = get_user_model()


class PerfilOrganizador(models.Model):
    id = models.BigAutoField(primary_key=True)
    usuario = models.OneToOneField(
        Usuario,
        on_delete=models.CASCADE,
        related_name="perfil_organizador",
    )
    empresa = models.CharField(max_length=150)
    telefono = models.CharField(max_length=30, blank=True)

    class Meta:
        verbose_name = "Perfil de organizador"
        verbose_name_plural = "Perfiles de organizador"

    def __str__(self):
        return f"{self.empresa} - {self.usuario.username}"


class Evento(models.Model):
    class Estado(models.TextChoices):
        BORRADOR = "borrador", "Borrador"
        PUBLICADO = "publicado", "Publicado"
        CANCELADO = "cancelado", "Cancelado"

    id = models.BigAutoField(primary_key=True)
    organizador = models.ForeignKey(
        PerfilOrganizador,
        on_delete=models.CASCADE,
        related_name="eventos",
    )
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    fecha_evento = models.DateTimeField()
    ubicacion = models.CharField(max_length=255)
    capacidad = models.PositiveIntegerField(default=0)
    estado = models.CharField(
        max_length=15,
        choices=Estado.choices,
        default=Estado.BORRADOR,
    )

    class Meta:
        verbose_name = "Evento"
        verbose_name_plural = "Eventos"
        ordering = ["fecha_evento"]

    def __str__(self):
        return self.titulo
