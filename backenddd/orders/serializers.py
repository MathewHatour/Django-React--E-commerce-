from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product
from products.serializers import ProductSerializer

# Serializer for each product in an order
class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    class Meta:
        model = OrderItem
        fields = ["product", "quantity"]

# Serializer for the order itself
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total_items = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ["id", "items", "total_items", "total_price", "created_at"]

    def create(self, validated_data):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        order = Order.objects.create(user=user)

        items_data = self.initial_data.get("items", [])
        for item in items_data:
            product_id = item.get("product") or item.get("product_id") or item.get("id")
            quantity = item.get("quantity", 1)
            if not product_id:
                continue
            try:
                product = Product.objects.get(pk=product_id)
            except Product.DoesNotExist:
                continue
            OrderItem.objects.create(order=order, product=product, quantity=quantity)

        return order

    def get_total_items(self, obj):
        return obj.total_items()

    def get_total_price(self, obj):
        return obj.total_price()
