from django.urls import path

from cuentas.views import LoginView, LogoutView, MiPerfilView, RegistroView


urlpatterns = [
    path("crear-usuario/", RegistroView.as_view(), name="crear-usuario"),
    path("iniciar-sesion/", LoginView.as_view(), name="iniciar-sesion"),
    path("cerrar-sesion/", LogoutView.as_view(), name="cerrar-sesion"),
    path("mi-perfil/", MiPerfilView.as_view(), name="mi-perfil"),
]
