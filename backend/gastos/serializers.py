from rest_framework import serializers

from config.permissions import is_admin_user
from gastos.models import Gasto
from organizador.models import Evento


class GastoSerializer(serializers.ModelSerializer):
    evento = serializers.PrimaryKeyRelatedField(queryset=Evento.objects.all())

    class Meta:
        model = Gasto
        fields = [
            "id",
            "evento",
            "concepto",
            "pagado_por",
            "pagado_por_iniciales",
            "monto",
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.user.is_authenticated and not is_admin_user(request.user):
            self.fields["evento"].queryset = Evento.objects.filter(
                organizador__usuario=request.user
            )

    def validate_evento(self, value):
        request = self.context.get("request")
        if request and not is_admin_user(request.user) and value.organizador.usuario != request.user:
            raise serializers.ValidationError(
                "Solo puedes registrar gastos en tus propios eventos"
            )
        return value
