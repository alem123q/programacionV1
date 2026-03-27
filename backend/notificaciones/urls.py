from django.urls import path

from notificaciones.views import (
    DetalleNotificacionView,
    ListaCrearNotificacionesView,
    ResumenNotificacionesView,
)


urlpatterns = [
    path("resumen/", ResumenNotificacionesView.as_view(), name="resumen-notificaciones"),
    path("notificaciones/", ListaCrearNotificacionesView.as_view(), name="notificaciones"),
    path("notificaciones/<int:pk>/", DetalleNotificacionView.as_view(), name="detalle-notificacion"),
]

