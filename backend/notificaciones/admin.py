from django.contrib import admin

from notificaciones.models import Notificacion


@admin.register(Notificacion)
class NotificacionAdmin(admin.ModelAdmin):
    list_display = ("id", "asunto", "invitado", "canal", "estado")
    list_filter = ("canal", "estado")
    search_fields = ("asunto", "mensaje", "invitado__nombre", "invitado__email")
