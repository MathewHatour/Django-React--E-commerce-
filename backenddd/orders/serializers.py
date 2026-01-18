# This file defines how order data is serialized (converted to/from JSON)
from rest_framework import serializers
from decimal import Decimal, InvalidOperation
from .models import Order, OrderItem
from products.models import Product
from products.serializers import ProductSerializer

# Serializer for each product item in an order
class OrderItemSerializer(serializers.ModelSerializer):
    # Include full product details (read-only means it can't be changed)
    product = ProductSerializer(read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ["product", "quantity"]

# Serializer for the entire order
class OrderSerializer(serializers.ModelSerializer):
    # Include all items in this order
    items = OrderItemSerializer(many=True, read_only=True)
    # Calculate total number of items
    total_items = serializers.SerializerMethodField()
    # Calculate total price of the order
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ["id", "items", "total_items", "total_price", "created_at"]

    # This method is called when creating a new order
    def create(self, validated_data):
        # Get the request object (contains user information)
        request = self.context.get("request")
        # Get the user who is making the request
        current_user = getattr(request, "user", None)
        
        # Create a new order for this user
        new_order = Order.objects.create(user=current_user)

        # Get the cart items from the request
        cart_items = self.initial_data.get("items", [])
        items_created = 0
        
        # Loop through each item in the cart
        for cart_item in cart_items:
            # Try to get the product ID from different possible field names
            product_id = cart_item.get("product") or cart_item.get("product_id") or cart_item.get("id")
            # Get the quantity (default to 1 if not provided)
            quantity = cart_item.get("quantity", 1)
            
            # Skip if no product ID was found
            # If product id is missing, we'll try to create a local product from payload
            # when title/price are available
            
            # Try to find the product in the database
            try:
                product = Product.objects.get(pk=product_id)
            except Product.DoesNotExist:
                # Attempt to create a minimal local product using payload (supports DummyJSON items)
                title = cart_item.get("title")
                price = cart_item.get("price")
                description = cart_item.get("description") or ""
                image_url = cart_item.get("image_url") or cart_item.get("thumbnail")
                stock = cart_item.get("stock", 100)

                if title is None or price is None:
                    # Cannot create a product without essential fields; skip
                    continue

                # Convert price to Decimal to match Product.price DecimalField
                try:
                    price_decimal = Decimal(str(price))
                except (InvalidOperation, TypeError):
                    continue

                # Fallback seller is the current user to satisfy FK
                product = Product.objects.create(
                    seller=current_user,
                    title=title,
                    description=description,
                    price=price_decimal,
                    stock=stock,
                    image_url=image_url,
                )
            
            # Create an order item linking the order to the product
            OrderItem.objects.create(
                order=new_order,
                product=product,
                quantity=quantity
            )
            items_created += 1

        # If nothing was created (e.g., all products invalid), raise a validation error
        if items_created == 0:
            # Clean up empty order if nothing could be added
            new_order.delete()
            raise serializers.ValidationError({"items": ["No valid items were provided for this order."]})

        # Return the created order
        return new_order

    # Calculate the total number of items in the order
    def get_total_items(self, order_object):
        return order_object.total_items()

    # Calculate the total price of the order
    def get_total_price(self, order_object):
        return order_object.total_price()
