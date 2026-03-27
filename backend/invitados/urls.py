from django.urls import path

from invitados.views import (
    DetalleInvitadoView,
    ListaCrearInvitadosView,
    ResumenInvitadosView,
)


urlpatterns = [
    path("resumen/", ResumenInvitadosView.as_view(), name="resumen-invitados"),
    path("invitados/", ListaCrearInvitadosView.as_view(), name="invitados"),
    path("invitados/<int:pk>/", DetalleInvitadoView.as_view(), name="detalle-invitado"),
]
