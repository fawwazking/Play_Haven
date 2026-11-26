"""Resolve cart lines: DB game variants (uuid) or storefront hardware (`hw-<id>`)."""

from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import IntegrityError

from catalog.models import Condition, Game, GameVariant, Platform, Region
from .hardware_catalog import HARDWARE_BY_ID

HW_PREFIX = "hw-"

_BRAND_TO_CATEGORY = (
    ("playstation", "PLAYSTATION"),
    ("sony", "PLAYSTATION"),
    ("xbox", "XBOX"),
    ("microsoft", "XBOX"),
    ("nintendo", "NINTENDO"),
)


def _category_for(item):
    haystack = f"{item['brand']} {item['platform']}".lower()
    for needle, category in _BRAND_TO_CATEGORY:
        if needle in haystack:
            return category
    return "PLAYSTATION"  # Steam / voucher lain: netral


def _sku_for(item):
    return f"HW-{item['id'].upper()[:56]}"


def ensure_hardware_variant(item):
    """Create the catalog rows for a storefront hardware product (idempotent).

    ponytail: rows appear lazily on the first checkout, so no migration and no
    seed step is needed. Move to a dedicated HardwareProduct model + seed
    command when hardware needs its own admin CRUD.
    """
    category = _category_for(item)
    platform = Platform.objects.get_or_create(
        slug=f"hw-{category.lower()}",
        defaults={
            "name": f"{category.title()} Hardware",
            "category": category,
            "generation": "Hardware",
        },
    )[0]
    game = Game.objects.get_or_create(
        slug=item["slug"],
        defaults={
            "title": item["name"],
            "publisher": item["brand"],
            "developer": item["brand"],
            "release_year": item["release_year"],
            "description": item["description"][:2000],
            "cover_image_url": item["image"],
        },
    )[0]
    variant, _ = GameVariant.objects.get_or_create(
        game=game,
        platform=platform,
        region=Region.ALL,
        condition=Condition.SEALED,
        defaults={
            "sku": _sku_for(item),
            "price": Decimal(str(item["price"])),
            "stock": item["stock"],
            "weight_grams": item["weight_grams"],
        },
    )
    return variant


def resolve_cart_variant(variant_id):
    """Return (variant, error_message). Accepts a GameVariant uuid or `hw-<id>`."""
    variant_id = str(variant_id or "").strip()
    if variant_id.startswith(HW_PREFIX):
        item = HARDWARE_BY_ID.get(variant_id[len(HW_PREFIX):])
        if not item:
            return None, f"Produk hardware tidak dikenal: {variant_id}"
        try:
            return ensure_hardware_variant(item), None
        except IntegrityError:
            # Dua request bersamaan membuat baris yang sama: pakai yang sudah ada.
            variant = GameVariant.objects.filter(sku=_sku_for(item)).first()
            if variant is None:
                return None, f"Gagal menyiapkan produk hardware: {variant_id}"
            return variant, None
    try:
        return GameVariant.objects.select_for_update().get(id=variant_id), None
    except (GameVariant.DoesNotExist, ValidationError, ValueError):
        return None, f"Varian game tidak ditemukan: {variant_id}"
