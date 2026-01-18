# This file defines how product data is serialized (converted to/from JSON)
from rest_framework import serializers
from .models import Product

# Serializer for products
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        # Use the Product model
        model = Product
        # Include all fields from the Product model
        fields = '__all__'
