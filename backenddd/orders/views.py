from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Order, OrderItem
from .serializers import OrderSerializer
from products.models import Product

class OrderViewSet(ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    # Only show orders for the logged-in user
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    # Create order from frontend cart
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
