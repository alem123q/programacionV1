from django.contrib import admin

from gastos.models import Gasto


@admin.register(Gasto)
class GastoAdmin(admin.ModelAdmin):
    list_display = ("id", "concepto", "evento", "pagado_por", "pagado_por_iniciales", "monto")
    search_fields = ("concepto", "pagado_por", "evento__titulo")
