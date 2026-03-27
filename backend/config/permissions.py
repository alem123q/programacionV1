from rest_framework.permissions import BasePermission

from cuentas.models import PerfilUsuario


def get_user_role(user):
    perfil = getattr(user, "perfil_usuario", None)
    return getattr(perfil, "rol", None)


def is_admin_user(user):
    if not getattr(user, "is_authenticated", False):
        return False

    return user.is_superuser or get_user_role(user) == PerfilUsuario.Rol.ADMINISTRADOR


def get_owner_user(obj):
    if hasattr(obj, "usuario"):
        return obj.usuario

    if hasattr(obj, "organizador"):
        return obj.organizador.usuario

    if hasattr(obj, "evento"):
        return obj.evento.organizador.usuario

    if hasattr(obj, "invitado"):
        return obj.invitado.evento.organizador.usuario

    return None


class IsAdminOrOwner(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        if is_admin_user(request.user):
            return True

        owner = get_owner_user(obj)
        return owner == request.user
