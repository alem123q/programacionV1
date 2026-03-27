from django.contrib.auth import get_user_model
from rest_framework import serializers

from config.permissions import is_admin_user
from organizador.models import Evento, PerfilOrganizador


Usuario = get_user_model()


class PerfilOrganizadorSerializer(serializers.ModelSerializer):
    usuario = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.all())

    class Meta:
        model = PerfilOrganizador
        fields = [
            "id",
            "usuario",
            "empresa",
            "telefono",
        ]

    def validate_usuario(self, value):
        request = self.context.get("request")
        if request and not is_admin_user(request.user) and value != request.user:
            raise serializers.ValidationError(
                "Solo puedes crear o modificar tu propio perfil de organizador"
            )
        return value


class EventoSerializer(serializers.ModelSerializer):
    organizador = serializers.PrimaryKeyRelatedField(
        queryset=PerfilOrganizador.objects.all()
    )

    class Meta:
        model = Evento
        fields = [
            "id",
            "organizador",
            "titulo",
            "descripcion",
            "fecha_evento",
            "ubicacion",
            "capacidad",
            "estado",
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.user.is_authenticated and not is_admin_user(request.user):
            self.fields["organizador"].queryset = PerfilOrganizador.objects.filter(
                usuario=request.user
            )

    def validate_organizador(self, value):
        request = self.context.get("request")
        if request and not is_admin_user(request.user) and value.usuario != request.user:
            raise serializers.ValidationError(
                "Solo puedes usar tu propio perfil de organizador"
            )
        return value
