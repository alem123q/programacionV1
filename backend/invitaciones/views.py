from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from config.permissions import IsAdminOrOwner, is_admin_user
from invitaciones.models import Invitacion
from invitaciones.serializers import InvitacionSerializer


class ResumenInvitacionesView(APIView):
    permission_classes = [IsAdminOrOwner]

    def get(self, request):
        return Response(
            {
                "aplicacion": "invitaciones",
                "descripcion": "Modulo para administrar el envio y seguimiento de invitaciones",
                "recursos": [
                    "invitaciones",
                    "canales de envio",
                    "codigos de acceso",
                ],
            }
        )


class ListaCrearInvitacionesView(generics.ListCreateAPIView):
    serializer_class = InvitacionSerializer
    permission_classes = [IsAdminOrOwner]

    def get_queryset(self):
        queryset = Invitacion.objects.select_related(
            "invitado",
            "invitado__evento",
        )
        if is_admin_user(self.request.user):
            return queryset.all()
        return queryset.filter(invitado__evento__organizador__usuario=self.request.user)


class DetalleInvitacionView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = InvitacionSerializer
    permission_classes = [IsAdminOrOwner]

    def get_queryset(self):
        queryset = Invitacion.objects.select_related(
            "invitado",
            "invitado__evento",
        )
        if is_admin_user(self.request.user):
            return queryset.all()
        return queryset.filter(invitado__evento__organizador__usuario=self.request.user)
