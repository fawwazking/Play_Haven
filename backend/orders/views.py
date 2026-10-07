import hashlib
import uuid
import requests
import midtransclient
from decimal import Decimal
from django.db import transaction
from django.conf import settings
from rest_framework import status, views, permissions
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Order, OrderItem
from catalog.models import GameVariant

def get_midtrans_snap():
    return midtransclient.Snap(
        is_production=getattr(settings, 'MIDTRANS_IS_PRODUCTION', False),
        server_key=getattr(settings, 'MIDTRANS_SERVER_KEY', ''),
        client_key=getattr(settings, 'MIDTRANS_CLIENT_KEY', '')
    )

class ShippingCostView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        destination = request.data.get('destination')
        weight = request.data.get('weight', 200)
        courier = request.data.get('courier', 'jne').lower()

        api_key = getattr(settings, 'RAJAONGKIR_API_KEY', '')
        origin = getattr(settings, 'RAJAONGKIR_ORIGIN_SUBDISTRICT', '575')

        url = "https://api.rajaongkir.com/starter/cost"
        headers = {
            'key': api_key,
            'content-type': 'application/x-www-form-urlencoded'
        }
        data = {
            'origin': origin,
            'destination': destination,
            'weight': int(weight),
            'courier': courier
        }

        try:
            res = requests.post(url, data=data, headers=headers, timeout=10)
            if res.status_code == 200:
                result = res.json()
                services = result.get('rajaongkir', {}).get('results', [{}])[0].get('costs', [])
                formatted = []
                for s in services:
                    formatted.append({
                        'service': s.get('service'),
                        'description': s.get('description'),
                        'cost': s.get('cost', [{}])[0].get('value', 0),
                        'etd': s.get('cost', [{}])[0].get('etd', '')
                    })
                return Response({'courier': courier.upper(), 'services': formatted})
            else:
                return Response({
                    'courier': courier.upper(),
                    'services': [
                        {'service': 'REG', 'description': 'Layanan Reguler', 'cost': 18000, 'etd': '2-3'},
                        {'service': 'YES', 'description': 'Yakin Esok Sampai', 'cost': 32000, 'etd': '1-1'}
                    ]
                })
        except Exception:
            return Response({
                'courier': courier.upper(),
                'services': [
                    {'service': 'REG', 'description': 'Layanan Reguler Standar', 'cost': 18000, 'etd': '2-3'}
                ]
            })

class CreateOrderView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        items_data = request.data.get('items', [])
        recipient_name = request.data.get('recipient_name')
        recipient_phone = request.data.get('recipient_phone')
        shipping_address = request.data.get('shipping_address')
        subdistrict_id = request.data.get('subdistrict_id', '1')
        courier_name = request.data.get('courier_name', 'JNE')
        courier_service = request.data.get('courier_service', 'REG')
        shipping_cost = Decimal(str(request.data.get('shipping_cost', 0)))

        if not items_data or not recipient_name or not shipping_address:
            return Response({'error': 'Data pesanan dan pengiriman tidak lengkap'}, status=status.HTTP_400_BAD_REQUEST)

        order_number = f"PH-{uuid.uuid4().hex[:8].upper()}"

        try:
            with transaction.atomic():
                total_weight = 100
                subtotal_amount = Decimal('0.00')
                order_items_to_create = []

                variant_ids = [item['variant_id'] for item in items_data]
                locked_variants = {
                    str(v.id): v 
                    for v in GameVariant.objects.select_for_update().filter(id__in=variant_ids)
                }

                for item in items_data:
                    vid = str(item['variant_id'])
                    qty = int(item['quantity'])

                    if vid not in locked_variants:
                        return Response({'error': f'Varian game tidak ditemukan: {vid}'}, status=status.HTTP_404_NOT_FOUND)

                    variant = locked_variants[vid]

                    if variant.stock < qty:
                        return Response({
                            'error': f'Stok kaset habis untuk {variant.game.title} [{variant.get_condition_display()}]. Tersisa: {variant.stock}'
                        }, status=status.HTTP_409_CONFLICT)

                    variant.stock -= qty
                    variant.save()

                    item_subtotal = variant.price * qty
                    subtotal_amount += item_subtotal
                    total_weight += (variant.weight_grams * qty)

                    order_items_to_create.append({
                        'variant': variant,
                        'quantity': qty,
                        'price_at_purchase': variant.price,
                        'subtotal': item_subtotal
                    })

                total_amount = subtotal_amount + shipping_cost

                order = Order.objects.create(
                    order_number=order_number,
                    user=request.user if request.user.is_authenticated else None,
                    recipient_name=recipient_name,
                    recipient_phone=recipient_phone,
                    shipping_address=shipping_address,
                    subdistrict_id=subdistrict_id,
                    courier_name=courier_name,
                    courier_service=courier_service,
                    shipping_cost=shipping_cost,
                    total_weight_grams=total_weight,
                    subtotal_amount=subtotal_amount,
                    total_amount=total_amount,
                    status='PENDING'
                )

                for oi in order_items_to_create:
                    OrderItem.objects.create(
                        order=order,
                        variant=oi['variant'],
                        quantity=oi['quantity'],
                        price_at_purchase=oi['price_at_purchase'],
                        subtotal=oi['subtotal']
                    )

                snap = get_midtrans_snap()
                param = {
                    "transaction_details": {
                        "order_id": order.order_number,
                        "gross_amount": int(total_amount)
                    },
                    "customer_details": {
                        "first_name": recipient_name,
                        "phone": recipient_phone,
                    }
                }
                snap_transaction = snap.create_transaction(param)
                order.snap_token = snap_transaction.get('token')
                order.save()

                return Response({
                    'order_number': order.order_number,
                    'total_amount': order.total_amount,
                    'snap_token': order.snap_token,
                    'redirect_url': snap_transaction.get('redirect_url')
                }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MidtransWebhookView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        order_number = data.get('order_id')
        status_code = data.get('status_code')
        gross_amount = data.get('gross_amount')
        signature_key = data.get('signature_key')
        transaction_status = data.get('transaction_status')
        fraud_status = data.get('fraud_status')

        server_key = getattr(settings, 'MIDTRANS_SERVER_KEY', '')
        raw_str = f"{order_number}{status_code}{gross_amount}{server_key}"
        expected_sig = hashlib.sha512(raw_str.encode('utf-8')).hexdigest()

        if signature_key != expected_sig:
            return Response({'error': 'Invalid Midtrans signature'}, status=status.HTTP_403_FORBIDDEN)

        try:
            with transaction.atomic():
                order = Order.objects.select_for_update().get(order_number=order_number)

                if order.status == 'PAID':
                    return Response({'status': 'Already marked as PAID'})

                if transaction_status in ['capture', 'settlement']:
                    if fraud_status == 'challenge':
                        order.status = 'PENDING'
                    else:
                        order.status = 'PAID'
                    order.save()
                elif transaction_status in ['cancel', 'deny', 'expire']:
                    order.status = 'CANCELLED'
                    order.save()
                    for item in order.items.all():
                        item.variant.stock += item.quantity
                        item.variant.save()

            return Response({'status': 'Webhook successfully processed'})
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

class AdminDashboardStatsView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        total_orders = Order.objects.count()
        paid_orders = Order.objects.filter(status='PAID').count()
        pending_orders = Order.objects.filter(status='PENDING').count()
        total_revenue = sum(o.total_amount for o in Order.objects.filter(status='PAID'))
        total_games = GameVariant.objects.count()
        total_stock = sum(v.stock for v in GameVariant.objects.all())
        low_stock_items = [
            {
                'id': str(v.id),
                'title': v.game.title,
                'platform': v.platform.name,
                'condition': v.condition,
                'stock': v.stock,
                'price': float(v.price)
            }
            for v in GameVariant.objects.select_related('game', 'platform').filter(stock__lte=5)[:10]
        ]

        return Response({
            'total_orders': total_orders,
            'paid_orders': paid_orders,
            'pending_orders': pending_orders,
            'total_revenue': float(total_revenue),
            'total_variants': total_games,
            'total_stock': total_stock,
            'low_stock_items': low_stock_items
        })

class AdminOrdersView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        orders = Order.objects.select_related('user').prefetch_related('items__variant__game').order_by('-created_at')[:50]
        data = []
        for o in orders:
            items_data = [
                {
                    'title': item.variant.game.title,
                    'quantity': item.quantity,
                    'price': float(item.price_at_purchase)
                }
                for item in o.items.all()
            ]
            data.append({
                'order_number': o.order_number,
                'customer_name': o.recipient_name,
                'customer_email': (o.user.email if o.user else "") or "-",
                'customer_phone': o.recipient_phone,
                'shipping_courier': f"{o.courier_name} {o.courier_service}".strip(),
                'shipping_city': o.shipping_address[:40] if o.shipping_address else "-",
                'status': o.status,
                'total_amount': float(o.total_amount),
                'created_at': o.created_at.strftime('%Y-%m-%d %H:%M'),
                'items': items_data
            })
        return Response(data)

    def post(self, request):
        order_number = request.data.get('order_number')
        new_status = request.data.get('status')
        if not order_number or not new_status:
            return Response({'error': 'Parameter missing'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            order = Order.objects.get(order_number=order_number)
            order.status = new_status.upper()
            order.save()
            return Response({'status': 'success', 'order_status': order.status})
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

class AdminStockUpdateView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        variant_id = request.data.get('variant_id')
        new_stock = request.data.get('stock')
        if not variant_id or new_stock is None:
            return Response({'error': 'Parameter missing'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            variant = GameVariant.objects.get(id=variant_id)
            variant.stock = int(new_stock)
            variant.save()
            return Response({'status': 'success', 'variant_id': str(variant.id), 'stock': variant.stock})
        except GameVariant.DoesNotExist:
            return Response({'error': 'Variant not found'}, status=status.HTTP_404_NOT_FOUND)

class AdminUsersView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        users = User.objects.all().order_by('-date_joined')[:100]
        data = []
        for u in users:
            order_count = u.orders.count()
            data.append({
                'id': u.id,
                'username': u.username,
                'email': u.email or "-",
                'full_name': f"{u.first_name} {u.last_name}".strip() or "-",
                'is_staff': u.is_staff,
                'is_superuser': u.is_superuser,
                'is_active': u.is_active,
                'role': 'Admin' if (u.is_staff or u.is_superuser) else 'Customer',
                'order_count': order_count,
                'date_joined': u.date_joined.strftime('%Y-%m-%d %H:%M') if u.date_joined else "-",
                'last_login': u.last_login.strftime('%Y-%m-%d %H:%M') if u.last_login else "Belum Pernah",
            })
        return Response(data)
