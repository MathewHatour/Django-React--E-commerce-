# This file handles product-related API endpoints
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Product
from .serializers import ProductSerializer

# ViewSet for managing products
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
    search_fields = ["title", "description"]
    # Fields that can be used for sorting
    ordering_fields = ["price", "title"]
