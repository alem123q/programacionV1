from django.contrib import admin

from invitaciones.models import Invitacion


@admin.register(Invitacion)
class InvitacionAdmin(admin.ModelAdmin):
    list_display = ("id", "invitado", "canal_envio", "estado", "fecha_envio")
    list_filter = ("canal_envio", "estado")
    search_fields = ("invitado__nombre", "invitado__email", "codigo_acceso")
