from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('variant', 'quantity', 'price_at_purchase', 'subtotal')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'recipient_name', 'status', 'total_amount', 'courier_name', 'tracking_number', 'created_at')
    list_filter = ('status', 'courier_name', 'created_at')
    search_fields = ('order_number', 'recipient_name', 'recipient_phone', 'tracking_number')
    inlines = [OrderItemInline]

    def save_model(self, request, obj, form, change):
        # Otomatis ubah status menjadi SHIPPED jika resi diisi oleh admin
        if obj.tracking_number and obj.status == 'PAID':
            obj.status = 'SHIPPED'
        super().save_model(request, obj, form, change)
