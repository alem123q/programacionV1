from django.contrib.auth import authenticate, get_user_model, login, logout
from django.db import transaction
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from cuentas.models import PerfilUsuario
from cuentas.serializers import (
    LoginSerializer,
    PerfilUsuarioSerializer,
    RegistroSerializer,
    UsuarioSerializer,
)
from organizador.models import PerfilOrganizador


Usuario = get_user_model()


class RegistroView(APIView):
    permission_classes = [AllowAny]

    @transaction.atomic
    def post(self, request):
        serializer = RegistroSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        usuario = Usuario.objects.create_user(
            username=serializer.validated_data["username"],
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
            first_name=serializer.validated_data.get("first_name", ""),
            last_name=serializer.validated_data.get("last_name", ""),
        )
        PerfilUsuario.objects.create(
            usuario=usuario,
            rol=serializer.validated_data.get("rol", PerfilUsuario.Rol.ORGANIZADOR),
        )
        if serializer.validated_data.get("rol", PerfilUsuario.Rol.ORGANIZADOR) == PerfilUsuario.Rol.ORGANIZADOR:
            PerfilOrganizador.objects.create(
                usuario=usuario,
                empresa=serializer.validated_data["empresa"],
                telefono=serializer.validated_data.get("telefono", ""),
            )
        login(request, usuario)

        return Response(
            {
                "mensaje": "Usuario registrado correctamente",
                "usuario": UsuarioSerializer(usuario).data,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        usuario = authenticate(
            request,
            username=serializer.validated_data["username"],
            password=serializer.validated_data["password"],
        )
        if usuario is None:
            return Response(
                {"detalle": "Credenciales inválidas"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        login(request, usuario)
        return Response(
            {
                "mensaje": "Sesion iniciada correctamente",
                "usuario": UsuarioSerializer(usuario).data,
            }
        )


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"mensaje": "Sesion cerrada correctamente"})


class MiPerfilView(APIView):
    def get(self, request):
        return Response(
            {
                "usuario": UsuarioSerializer(request.user).data,
                "perfil": PerfilUsuarioSerializer(
                    getattr(request.user, "perfil_usuario", None)
                ).data
                if getattr(request.user, "perfil_usuario", None)
                else None,
            }
        )
