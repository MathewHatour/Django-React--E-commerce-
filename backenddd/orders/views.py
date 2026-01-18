# This file handles order-related API endpoints
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Order, OrderItem
from .serializers import OrderSerializer

# ViewSet for managing orders
class OrderViewSet(ModelViewSet):
    # Use OrderSerializer to convert orders to/from JSON
    serializer_class = OrderSerializer
    # Only logged-in users can access orders
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    # This method filters orders to show only the current user's orders
    def get_queryset(self):
        # Get the currently logged-in user
        current_user = self.request.user
        # Return only orders that belong to this user
        user_orders = Order.objects.filter(user=current_user)
        return user_orders

    # This method is called when creating a new order
    def perform_create(self, serializer):
        # Get the currently logged-in user
        current_user = self.request.user
        # Save the order and assign it to the current user
        serializer.save(user=current_user)
