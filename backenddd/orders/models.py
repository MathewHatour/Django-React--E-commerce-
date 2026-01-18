# This file defines the database models for orders
from django.db import models
from decimal import Decimal
from django.contrib.auth.models import User
from products.models import Product

# Model representing a customer order
class Order(models.Model):
    # Link to the user who placed this order
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # Date and time when the order was created (automatically set)
    created_at = models.DateTimeField(auto_now_add=True)

    # Calculate the total number of items in this order
    def total_items(self):
        total = 0
        # Loop through all items in this order
        for item in self.items.all():
            # Add the quantity of each item to the total
            total += item.quantity
        return total

    # Calculate the total price of this order
    def total_price(self):
        total = Decimal("0")
        # Loop through all items in this order
        for item in self.items.all():
            # Calculate price for this item (quantity * product price)
            item_price = item.quantity * item.product.price
            # Add to total
            total += item_price
        return total

# Model representing a single product item within an order
class OrderItem(models.Model):
    # Link to the order this item belongs to
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    # Link to the product being ordered
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    # How many of this product are in the order (default is 1)
    quantity = models.PositiveIntegerField(default=1)
