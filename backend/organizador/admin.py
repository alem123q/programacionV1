from django.contrib import admin

from organizador.models import Evento, PerfilOrganizador


@admin.register(PerfilOrganizador)
class PerfilOrganizadorAdmin(admin.ModelAdmin):
    list_display = ("id", "empresa", "usuario", "telefono")
    search_fields = ("empresa", "usuario__username", "usuario__email")


@admin.register(Evento)
class EventoAdmin(admin.ModelAdmin):
    list_display = ("id", "titulo", "organizador", "fecha_evento", "estado", "capacidad")
    list_filter = ("estado", "fecha_evento")
    search_fields = ("titulo", "ubicacion", "organizador__empresa")
