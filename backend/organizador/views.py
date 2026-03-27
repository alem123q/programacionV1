from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from config.permissions import IsAdminOrOwner, is_admin_user
from organizador.models import Evento, PerfilOrganizador
from organizador.serializers import EventoSerializer, PerfilOrganizadorSerializer


class ResumenOrganizadorView(APIView):
    permission_classes = [IsAdminOrOwner]

    def get(self, request):
        return Response(
            {
                "aplicacion": "organizador",
                "descripcion": "Modulo base para la gestion de organizadores y eventos",
                "recursos": [
                    "perfiles de organizador",
                    "eventos",
                ],
            }
        )


class ListaCrearPerfilesView(generics.ListCreateAPIView):
    serializer_class = PerfilOrganizadorSerializer
    permission_classes = [IsAdminOrOwner]

    def get_queryset(self):
        queryset = PerfilOrganizador.objects.select_related("usuario")
        if is_admin_user(self.request.user):
            return queryset.all()
        return queryset.filter(usuario=self.request.user)


class DetallePerfilView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PerfilOrganizadorSerializer
    permission_classes = [IsAdminOrOwner]

    def get_queryset(self):
        queryset = PerfilOrganizador.objects.select_related("usuario")
        if is_admin_user(self.request.user):
            return queryset.all()
        return queryset.filter(usuario=self.request.user)


class ListaCrearEventosView(generics.ListCreateAPIView):
    serializer_class = EventoSerializer
    permission_classes = [IsAdminOrOwner]

    def get_queryset(self):
        queryset = Evento.objects.select_related("organizador", "organizador__usuario")
        if is_admin_user(self.request.user):
            return queryset.all()
        return queryset.filter(organizador__usuario=self.request.user)


class DetalleEventoView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EventoSerializer
    permission_classes = [IsAdminOrOwner]

    def get_queryset(self):
        queryset = Evento.objects.select_related("organizador", "organizador__usuario")
        if is_admin_user(self.request.user):
            return queryset.all()
        return queryset.filter(organizador__usuario=self.request.user)
