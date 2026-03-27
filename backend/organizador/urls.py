from django.urls import path

from organizador.views import (
    DetalleEventoView,
    DetallePerfilView,
    ListaCrearEventosView,
    ListaCrearPerfilesView,
    ResumenOrganizadorView,
)


urlpatterns = [
    path("resumen/", ResumenOrganizadorView.as_view(), name="resumen-organizadores"),
    path("perfiles-organizador/", ListaCrearPerfilesView.as_view(), name="perfiles-organizador"),
    path("perfiles-organizador/<int:pk>/", DetallePerfilView.as_view(), name="detalle-perfil-organizador"),
    path("eventos/", ListaCrearEventosView.as_view(), name="eventos"),
    path("eventos/<int:pk>/", DetalleEventoView.as_view(), name="detalle-evento"),
]
