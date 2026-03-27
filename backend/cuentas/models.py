from django.contrib.auth import get_user_model
from django.db import models


Usuario = get_user_model()


class PerfilUsuario(models.Model):
    class Rol(models.TextChoices):
        ORGANIZADOR = "organizador", "Organizador"
        ADMINISTRADOR = "administrador", "Administrador"

    id = models.BigAutoField(primary_key=True)
    usuario = models.OneToOneField(
        Usuario,
        on_delete=models.CASCADE,
        related_name="perfil_usuario",
    )
    rol = models.CharField(
        max_length=20,
        choices=Rol.choices,
        default=Rol.ORGANIZADOR,
    )

    class Meta:
        verbose_name = "Perfil de usuario"
        verbose_name_plural = "Perfiles de usuario"

    def __str__(self):
        return f"{self.usuario.username} - {self.rol}"
