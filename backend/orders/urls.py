from django.urls import path
from .views import (
    ShippingCostView, 
    CreateOrderView, 
    MidtransWebhookView, 
    AdminDashboardStatsView, 
    AdminOrdersView, 
    AdminStockUpdateView,
    AdminUsersView
)
from .auth_views import RegisterView, LoginView, ProfileView

urlpatterns = [
    # Auth endpoints
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/profile/', ProfileView.as_view(), name='auth-profile'),

    # Orders & Checkout
    path('shipping/cost/', ShippingCostView.as_view(), name='shipping-cost'),
    path('orders/create/', CreateOrderView.as_view(), name='order-create'),
    path('payments/webhook/', MidtransWebhookView.as_view(), name='midtrans-webhook'),
    
    # Admin API
    path('admin-api/stats/', AdminDashboardStatsView.as_view(), name='admin-stats'),
    path('admin-api/orders/', AdminOrdersView.as_view(), name='admin-orders'),
    path('admin-api/stock-update/', AdminStockUpdateView.as_view(), name='admin-stock-update'),
    path('admin-api/users/', AdminUsersView.as_view(), name='admin-users'),
]
