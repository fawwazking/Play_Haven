from rest_framework import viewsets
from .models import Platform, Game, GameVariant
from .serializers import PlatformSerializer, GameListSerializer, GameVariantSerializer

class PlatformViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Platform.objects.all().order_by('category', 'name')
    serializer_class = PlatformSerializer

class GameViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Game.objects.all().prefetch_related('variants__platform').order_by('-release_year')
    serializer_class = GameListSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        qs = super().get_queryset()
        platform_slug = self.request.query_params.get('platform')
        category = self.request.query_params.get('category')
        condition = self.request.query_params.get('condition')
        region = self.request.query_params.get('region')
        search = self.request.query_params.get('search')

        if platform_slug:
            qs = qs.filter(variants__platform__slug=platform_slug).distinct()
        if category:
            qs = qs.filter(variants__platform__category=category.upper()).distinct()
        if condition:
            qs = qs.filter(variants__condition=condition.upper()).distinct()
        if region:
            qs = qs.filter(variants__region=region.upper()).distinct()
        if search:
            qs = qs.filter(title__icontains=search).distinct()

        return qs
