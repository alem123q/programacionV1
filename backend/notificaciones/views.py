from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from config.permissions import IsAdminOrOwner, is_admin_user
from notificaciones.models import Notificacion
from notificaciones.serializers import NotificacionSerializer


class ResumenNotificacionesView(APIView):
    permission_classes = [IsAdminOrOwner]

    def get(self, request):
        return Response(
            {
                "aplicacion": "notificaciones",
                "descripcion": "Modulo para registrar y seguir notificaciones vinculadas a invitados e invitaciones",
                "recursos": [
                    "notificaciones",
                    "canales",
                    "estados de entrega",
                ],
            }
        )


class ListaCrearNotificacionesView(generics.ListCreateAPIView):
    serializer_class = NotificacionSerializer
    permission_classes = [IsAdminOrOwner]

    def get_queryset(self):
        queryset = Notificacion.objects.select_related(
            "invitado",
            "invitado__evento",
            "invitacion",
        )
        if is_admin_user(self.request.user):
            return queryset.all()
        return queryset.filter(invitado__evento__organizador__usuario=self.request.user)


class DetalleNotificacionView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NotificacionSerializer
    permission_classes = [IsAdminOrOwner]

    def get_queryset(self):
        queryset = Notificacion.objects.select_related(
            "invitado",
            "invitado__evento",
            "invitacion",
        )
        if is_admin_user(self.request.user):
            return queryset.all()
        return queryset.filter(invitado__evento__organizador__usuario=self.request.user)
