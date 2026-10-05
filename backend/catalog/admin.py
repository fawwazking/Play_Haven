from django.contrib import admin
from .models import Platform, Game, GameVariant

@admin.register(Platform)
class PlatformAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'generation', 'slug')
    list_filter = ('category', 'generation')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}

class GameVariantInline(admin.TabularInline):
    model = GameVariant
    extra = 1

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ('title', 'publisher', 'developer', 'release_year')
    search_fields = ('title', 'publisher', 'developer')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [GameVariantInline]

@admin.register(GameVariant)
class GameVariantAdmin(admin.ModelAdmin):
    list_display = ('game', 'platform', 'region', 'condition', 'price', 'stock', 'weight_grams', 'is_active')
    list_filter = ('platform__category', 'platform', 'region', 'condition', 'is_active')
    search_fields = ('game__title', 'sku')
