from rest_framework import serializers

from config.permissions import is_admin_user
from invitados.models import Invitado
from invitaciones.models import Invitacion
from notificaciones.models import Notificacion


class NotificacionSerializer(serializers.ModelSerializer):
    invitado = serializers.PrimaryKeyRelatedField(queryset=Invitado.objects.all())
    invitacion = serializers.PrimaryKeyRelatedField(
        queryset=Invitacion.objects.all(),
        allow_null=True,
        required=False,
    )

    class Meta:
        model = Notificacion
        fields = [
            "id",
            "invitado",
            "invitacion",
            "canal",
            "asunto",
            "mensaje",
            "estado",
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.user.is_authenticated and not is_admin_user(request.user):
            self.fields["invitado"].queryset = Invitado.objects.filter(
                evento__organizador__usuario=request.user
            )
            self.fields["invitacion"].queryset = Invitacion.objects.filter(
                invitado__evento__organizador__usuario=request.user
            )

    def validate(self, attrs):
        request = self.context.get("request")
        invitado = attrs.get("invitado") or getattr(self.instance, "invitado", None)
        invitacion = attrs.get("invitacion") or getattr(self.instance, "invitacion", None)

        if request and invitado and not is_admin_user(request.user):
            if invitado.evento.organizador.usuario != request.user:
                raise serializers.ValidationError(
                    {"invitado": "Solo puedes usar invitados de tus propios eventos"}
                )

        if invitacion and invitado and invitacion.invitado_id != invitado.id:
            raise serializers.ValidationError(
                {"invitacion": "La invitacion debe pertenecer al invitado seleccionado"}
            )

        if request and invitacion and not is_admin_user(request.user):
            if invitacion.invitado.evento.organizador.usuario != request.user:
                raise serializers.ValidationError(
                    {"invitacion": "Solo puedes usar invitaciones de tus propios eventos"}
                )

        return attrs
