from django.urls import path

from gastos.views import DetalleGastoView, ListaCrearGastosView, ResumenGastosView


urlpatterns = [
    path("resumen/", ResumenGastosView.as_view(), name="resumen-gastos"),
    path("gastos/", ListaCrearGastosView.as_view(), name="gastos"),
    path("gastos/<int:pk>/", DetalleGastoView.as_view(), name="detalle-gasto"),
]

