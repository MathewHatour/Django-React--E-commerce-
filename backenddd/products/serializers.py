# This file defines how product data is serialized (converted to/from JSON)
from rest_framework import serializers
from .models import Product
from django.contrib.auth.models import User

# Serializer for products (public view)
class ProductSerializer(serializers.ModelSerializer):
    discounted_price = serializers.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        read_only=True, 
        source='get_discounted_price'
    )
    seller_username = serializers.CharField(source='seller.username', read_only=True)
    
    class Meta:
        # Use the Product model
        model = Product
        # Include all fields from the Product model
        fields = '__all__'
        read_only_fields = ['seller', 'rating', 'reviews_count', 'created_at', 'updated_at']


# Serializer for seller product management (CRUD operations)
class SellerProductSerializer(serializers.ModelSerializer):
    discounted_price = serializers.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        read_only=True, 
        source='get_discounted_price'
    )
    
    class Meta:
        model = Product
        fields = [
            'id', 'title', 'description', 'price', 'stock', 'category',
            'brand', 'tags', 'discount', 'image_url', 'additional_images',
            'rating', 'reviews_count', 'created_at', 'updated_at', 'discounted_price'
        ]
        read_only_fields = ['id', 'rating', 'reviews_count', 'created_at', 'updated_at', 'discounted_price']
    
    def validate_price(self, value):
        """Ensure price is positive"""
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0")
        return value
    
    def validate_stock(self, value):
        """Ensure stock is non-negative"""
        if value < 0:
            raise serializers.ValidationError("Stock cannot be negative")
        return value
    
    def validate_discount(self, value):
        """Ensure discount is between 0 and 100"""
        if value < 0 or value > 100:
            raise serializers.ValidationError("Discount must be between 0 and 100")
        return value
    
    def validate_additional_images(self, value):
        """Validate that additional_images is valid JSON"""
        import json
        if value:
            try:
                json.loads(value)
            except json.JSONDecodeError:
                raise serializers.ValidationError("Additional images must be valid JSON array")
        return value
