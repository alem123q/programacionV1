from rest_framework import serializers

from config.permissions import is_admin_user
from invitados.models import Invitado
from invitaciones.models import Invitacion


class InvitacionSerializer(serializers.ModelSerializer):
    invitado = serializers.PrimaryKeyRelatedField(queryset=Invitado.objects.all())

    class Meta:
        model = Invitacion
        fields = [
            "id",
            "invitado",
            "canal_envio",
            "estado",
            "codigo_acceso",
            "fecha_envio",
            "mensaje_personalizado",
        ]
        read_only_fields = ["codigo_acceso"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.user.is_authenticated and not is_admin_user(request.user):
            self.fields["invitado"].queryset = Invitado.objects.filter(
                evento__organizador__usuario=request.user
            )

    def validate_invitado(self, value):
        request = self.context.get("request")
        if request and not is_admin_user(request.user) and value.evento.organizador.usuario != request.user:
            raise serializers.ValidationError(
                "Solo puedes crear invitaciones para invitados de tus eventos"
            )
        return value
