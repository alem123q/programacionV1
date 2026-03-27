from django.contrib import admin

from cuentas.models import PerfilUsuario


@admin.register(PerfilUsuario)
class PerfilUsuarioAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "rol")
    list_filter = ("rol",)
    search_fields = ("usuario__username", "usuario__email")
