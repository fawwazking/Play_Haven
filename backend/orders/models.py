import uuid
from django.db import models
from django.contrib.auth import get_user_model
from catalog.models import GameVariant

User = get_user_model()

class OrderStatus(models.TextChoices):
    PENDING = 'PENDING', 'Pending Payment'
    PAID = 'PAID', 'Sudah Dibayar'
    SHIPPED = 'SHIPPED', 'Sedang Dikirim'
    COMPLETED = 'COMPLETED', 'Selesai'
    CANCELLED = 'CANCELLED', 'Dibatalkan'

class Order(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_number = models.CharField(max_length=50, unique=True, db_index=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    status = models.CharField(max_length=20, choices=OrderStatus.choices, default=OrderStatus.PENDING, db_index=True)
    
    # Detail Pembeli & Pengiriman
    recipient_name = models.CharField(max_length=150)
    recipient_phone = models.CharField(max_length=20)
    shipping_address = models.TextField()
    subdistrict_id = models.CharField(max_length=50) # RajaOngkir subdistrict / city ID
    courier_name = models.CharField(max_length=50) # JNE, POS, TIKI
    courier_service = models.CharField(max_length=50) # REG, YES, dll
    shipping_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_weight_grams = models.PositiveIntegerField(default=120)
    tracking_number = models.CharField(max_length=100, blank=True, null=True)

    # Finansial & Midtrans Snap
    subtotal_amount = models.DecimalField(max_digits=12, decimal_places=2)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    snap_token = models.CharField(max_length=255, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.order_number} - {self.recipient_name} ({self.get_status_display()})"

class OrderItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    variant = models.ForeignKey(GameVariant, on_delete=models.PROTECT, related_name='order_items')
    quantity = models.PositiveIntegerField(default=1)
    
    # Snapshot harga saat transaksi dibuat
    price_at_purchase = models.DecimalField(max_digits=12, decimal_places=2)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.quantity}x {self.variant} @ Rp {self.price_at_purchase}"
