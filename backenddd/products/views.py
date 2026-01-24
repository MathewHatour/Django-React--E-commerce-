# This file handles product-related API endpoints
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Sum, Count, Q
from .models import Product
from .serializers import ProductSerializer, SellerProductSerializer
from orders.models import Order, OrderItem

# ViewSet for managing products (public view)
class ProductViewSet(ModelViewSet):
    # Get all products from the database
    queryset = Product.objects.all()
    # Use ProductSerializer to convert products to/from JSON
    serializer_class = ProductSerializer
    # Allow anyone to view products (no login required)
    permission_classes = [AllowAny]
    # No authentication required to view products
    authentication_classes = []
    # Enable search and ordering features
    filter_backends = [SearchFilter, OrderingFilter]
    # Fields that can be searched
    search_fields = ["title", "description", "category", "brand", "tags"]
    # Fields that can be used for sorting
    ordering_fields = ["price", "title", "created_at", "rating"]


# ViewSet for seller product management
class SellerProductViewSet(ModelViewSet):
    serializer_class = SellerProductSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["title", "description", "category", "brand"]
    ordering_fields = ["price", "title", "created_at", "stock"]
    
    def get_queryset(self):
        """Return only products belonging to the current seller"""
        return Product.objects.filter(seller=self.request.user).order_by('-created_at')
    
    def perform_create(self, serializer):
        """Automatically set the seller to the current user when creating a product"""
        serializer.save(seller=self.request.user)
    
    def perform_update(self, serializer):
        """Ensure seller cannot be changed during update"""
        serializer.save(seller=self.request.user)
    
    @action(detail=False, methods=['get'], url_path='sales-summary')
    def sales_summary(self, request):
        """Get sales summary for the seller"""
        seller = request.user
        
        # Get all order items containing seller's products
        seller_order_items = OrderItem.objects.filter(
            product__seller=seller
        ).select_related('order', 'product')
        
        # Calculate statistics
        total_orders = seller_order_items.values('order').distinct().count()
        total_items_sold = seller_order_items.aggregate(
            total=Sum('quantity')
        )['total'] or 0
        
        total_revenue = sum(
            item.quantity * item.product.price 
            for item in seller_order_items
        )
        
        # Get product count
        total_products = Product.objects.filter(seller=seller).count()
        
        return Response({
            'total_products': total_products,
            'total_orders': total_orders,
            'total_items_sold': total_items_sold,
            'total_revenue': float(total_revenue),
        })
    
    @action(detail=False, methods=['get'], url_path='sales-orders')
    def sales_orders(self, request):
        """Get all orders containing seller's products"""
        seller = request.user
        
        # Get all order items containing seller's products
        seller_order_items = OrderItem.objects.filter(
            product__seller=seller
        ).select_related('order', 'product', 'order__user').order_by('-order__created_at')
        
        # Group by order
        orders_data = {}
        for item in seller_order_items:
            order_id = item.order.id
            if order_id not in orders_data:
                orders_data[order_id] = {
                    'order_id': order_id,
                    'customer': item.order.user.username,
                    'created_at': item.order.created_at,
                    'items': [],
                    'total': 0
                }
            
            item_total = float(item.quantity * item.product.price)
            orders_data[order_id]['items'].append({
                'product_id': item.product.id,
                'product_title': item.product.title,
                'quantity': item.quantity,
                'price': float(item.product.price),
                'total': item_total
            })
            orders_data[order_id]['total'] += item_total
        
        # Convert to list and sort by date
        orders_list = list(orders_data.values())
        orders_list.sort(key=lambda x: x['created_at'], reverse=True)
        
        return Response(orders_list)
