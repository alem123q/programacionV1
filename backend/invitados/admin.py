from django.contrib import admin

from invitados.models import Invitado


@admin.register(Invitado)
class InvitadoAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre", "evento", "email", "estado_asistencia")
    list_filter = ("estado_asistencia", "evento")
    search_fields = ("nombre", "email", "evento__titulo")
