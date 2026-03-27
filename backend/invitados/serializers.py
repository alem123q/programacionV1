from rest_framework import serializers

from config.permissions import is_admin_user
from invitados.models import Invitado
from organizador.models import Evento


class InvitadoSerializer(serializers.ModelSerializer):
    evento = serializers.PrimaryKeyRelatedField(queryset=Evento.objects.all())

    class Meta:
        model = Invitado
        fields = [
            "id",
            "evento",
            "nombre",
            "email",
            "telefono",
            "cantidad_acompanantes",
            "estado_asistencia",
            "observaciones",
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
                "Solo puedes agregar invitados a tus propios eventos"
            )
        return value
