from rest_framework.permissions import BasePermission

from core.tokens import token_admin


class IsAdminToken(BasePermission):
    """Allow only requests carrying `Authorization: Bearer <admin token>`."""

    message = "Butuh login admin. Kirim header Authorization: Bearer <token>."

    def has_permission(self, request, view):
        return token_admin(request) is not None
