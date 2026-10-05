from rest_framework.routers import DefaultRouter
from .views import PlatformViewSet, GameViewSet

router = DefaultRouter()
router.register(r'platforms', PlatformViewSet, basename='platform')
router.register(r'games', GameViewSet, basename='game')

urlpatterns = router.urls
