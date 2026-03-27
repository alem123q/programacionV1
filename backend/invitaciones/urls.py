from django.urls import path

from invitaciones.views import (
    DetalleInvitacionView,
    ListaCrearInvitacionesView,
    ResumenInvitacionesView,
)


urlpatterns = [
    path("resumen/", ResumenInvitacionesView.as_view(), name="resumen-invitaciones"),
    path("invitaciones/", ListaCrearInvitacionesView.as_view(), name="invitaciones"),
    path("invitaciones/<int:pk>/", DetalleInvitacionView.as_view(), name="detalle-invitacion"),
]
