from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from config.permissions import IsAdminOrOwner, is_admin_user
from invitados.models import Invitado
from invitados.serializers import InvitadoSerializer


class ResumenInvitadosView(APIView):
    permission_classes = [IsAdminOrOwner]

    def get(self, request):
        return Response(
            {
                "aplicacion": "invitados",
                "descripcion": "Modulo para administrar invitados y sus respuestas",
                "recursos": [
                    "invitados",
                    "estados de asistencia",
                ],
            }
        )


class ListaCrearInvitadosView(generics.ListCreateAPIView):
    serializer_class = InvitadoSerializer
    permission_classes = [IsAdminOrOwner]

    def get_queryset(self):
        queryset = Invitado.objects.select_related("evento", "evento__organizador")
        if is_admin_user(self.request.user):
            return queryset.all()
        return queryset.filter(evento__organizador__usuario=self.request.user)


class DetalleInvitadoView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = InvitadoSerializer
    permission_classes = [IsAdminOrOwner]

    def get_queryset(self):
        queryset = Invitado.objects.select_related("evento", "evento__organizador")
        if is_admin_user(self.request.user):
            return queryset.all()
        return queryset.filter(evento__organizador__usuario=self.request.user)
