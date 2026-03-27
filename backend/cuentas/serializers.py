from django.contrib.auth import get_user_model
from rest_framework import serializers

from config.permissions import is_admin_user
from cuentas.models import PerfilUsuario
from organizador.serializers import PerfilOrganizadorSerializer


Usuario = get_user_model()


class PerfilUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerfilUsuario
        fields = ["id", "rol"]


class UsuarioSerializer(serializers.ModelSerializer):
    perfil = serializers.SerializerMethodField()
    perfil_organizador = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "perfil",
            "perfil_organizador",
        ]

    def get_perfil(self, obj):
        perfil = getattr(obj, "perfil_usuario", None)
        return PerfilUsuarioSerializer(perfil).data if perfil else None

    def get_perfil_organizador(self, obj):
        perfil = getattr(obj, "perfil_organizador", None)
        return PerfilOrganizadorSerializer(perfil).data if perfil else None


class RegistroSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    rol = serializers.ChoiceField(
        choices=PerfilUsuario.Rol.choices,
        required=False,
        default=PerfilUsuario.Rol.ORGANIZADOR,
    )
    empresa = serializers.CharField(max_length=150, required=False, allow_blank=True)
    telefono = serializers.CharField(max_length=30, required=False, allow_blank=True)

    def validate_username(self, value):
        if Usuario.objects.filter(username=value).exists():
            raise serializers.ValidationError("Ese nombre de usuario ya existe")
        return value

    def validate_email(self, value):
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError("Ese email ya existe")
        return value

    def validate(self, attrs):
        request = self.context.get("request")
        current_user = getattr(request, "user", None)
        rol = attrs.get("rol", PerfilUsuario.Rol.ORGANIZADOR)
        empresa = attrs.get("empresa", "").strip()

        if rol == PerfilUsuario.Rol.ADMINISTRADOR and not is_admin_user(current_user):
            raise serializers.ValidationError(
                {"rol": "Solo un administrador puede crear usuarios administradores"}
            )

        if rol == PerfilUsuario.Rol.ORGANIZADOR and not empresa:
            raise serializers.ValidationError(
                {"empresa": "La empresa es obligatoria para organizadores"}
            )
        return attrs


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
