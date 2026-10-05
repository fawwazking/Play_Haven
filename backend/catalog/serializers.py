from rest_framework import serializers
from .models import Platform, Game, GameVariant

class PlatformSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = Platform
        fields = ['id', 'name', 'slug', 'category', 'category_display', 'generation']

class GameVariantSerializer(serializers.ModelSerializer):
    platform_name = serializers.CharField(source='platform.name', read_only=True)
    platform_slug = serializers.CharField(source='platform.slug', read_only=True)
    region_display = serializers.CharField(source='get_region_display', read_only=True)
    condition_display = serializers.CharField(source='get_condition_display', read_only=True)

    class Meta:
        model = GameVariant
        fields = [
            'id', 'sku', 'platform', 'platform_name', 'platform_slug', 
            'region', 'region_display', 'condition', 'condition_display', 
            'price', 'stock', 'weight_grams', 'is_active'
        ]

class GameListSerializer(serializers.ModelSerializer):
    variants = GameVariantSerializer(many=True, read_only=True)
    min_price = serializers.SerializerMethodField()
    total_stock = serializers.SerializerMethodField()

    class Meta:
        model = Game
        fields = [
            'id', 'title', 'slug', 'publisher', 'developer', 
            'release_year', 'description', 'cover_image_url', 
            'variants', 'min_price', 'total_stock'
        ]

    def get_min_price(self, obj):
        prices = [v.price for v in obj.variants.all() if v.is_active]
        return min(prices) if prices else 0

    def get_total_stock(self, obj):
        return sum(v.stock for v in obj.variants.all() if v.is_active)
