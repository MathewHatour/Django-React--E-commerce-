from django.db import models
from django.contrib.auth.models import User
from products.models import Product

# Main Order model
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    # Total items in this order
    def total_items(self):
        return sum(item.quantity for item in self.items.all())

    # Total price of this order
    def total_price(self):
        return sum(item.quantity * item.product.price for item in self.items.all())

# Each product in an order
class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
