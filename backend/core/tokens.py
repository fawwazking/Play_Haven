"""Stateless auth tokens.

Signed with SECRET_KEY via django.core.signing, so no extra table and no
migration is needed (works on Vercel serverless where we cannot add DB tables
from the deploy pipeline).
"""

from django.core import signing
from django.contrib.auth.models import User

SALT = "playhaven.auth"
MAX_AGE_SECONDS = 60 * 60 * 24 * 7  # 7 hari


def issue_token(user) -> str:
    return signing.dumps(
        {"uid": user.pk, "staff": bool(user.is_staff or user.is_superuser)},
        salt=SALT,
        compress=True,
    )


def _bearer(request):
    raw = request.META.get("HTTP_AUTHORIZATION", "")
    if raw.lower().startswith("bearer "):
        return raw[7:].strip()
    return raw.strip()


def token_user(request):
    """Return the User for a valid `Authorization: Bearer <token>`, else None."""
    token = _bearer(request)
    if not token:
        return None
    try:
        payload = signing.loads(token, salt=SALT, max_age=MAX_AGE_SECONDS)
    except signing.BadSignature:
        return None
    user = User.objects.filter(pk=payload.get("uid")).first()
    return user


def token_admin(request):
    user = token_user(request)
    return user if user and (user.is_staff or user.is_superuser) else None
