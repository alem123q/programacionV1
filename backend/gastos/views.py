from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum

from config.permissions import IsAdminOrOwner, is_admin_user
from gastos.models import Gasto
from gastos.serializers import GastoSerializer


class ResumenGastosView(APIView):
    permission_classes = [IsAdminOrOwner]

    def get(self, request):
        queryset = Gasto.objects.all()
        if not is_admin_user(request.user):
            queryset = queryset.filter(evento__organizador__usuario=request.user)

        total_gastos = queryset.aggregate(total=Sum("monto"))["total"] or 0
        return Response(
            {
                "aplicacion": "gastos",
                "descripcion": "Modulo para registrar y consultar gastos por evento",
                "recursos": [
                    "gastos",
                    "pagado por",
                    "montos",
                ],
                "total_gastos": total_gastos,
            }
        )


class ListaCrearGastosView(generics.ListCreateAPIView):
    serializer_class = GastoSerializer
    permission_classes = [IsAdminOrOwner]

    def get_queryset(self):
        queryset = Gasto.objects.select_related(
            "evento",
            "evento__organizador",
        )
        if is_admin_user(self.request.user):
            return queryset.all()
        return queryset.filter(evento__organizador__usuario=self.request.user)


class DetalleGastoView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GastoSerializer
    permission_classes = [IsAdminOrOwner]

    def get_queryset(self):
        queryset = Gasto.objects.select_related(
            "evento",
            "evento__organizador",
        )
        if is_admin_user(self.request.user):
            return queryset.all()
        return queryset.filter(evento__organizador__usuario=self.request.user)
