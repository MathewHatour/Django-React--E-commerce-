# This file defines the database model for products
from django.db import models
from django.contrib.auth.models import User

# Model representing a product in the store
class Product(models.Model):
    # Link to the user who is selling this product
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    # Product name/title (maximum 200 characters)
    title = models.CharField(max_length=200)
    # Detailed description of the product
    description = models.TextField()
    # Product price (10 digits total, 2 decimal places)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    # How many items are in stock
    stock = models.IntegerField()
    # Category of the product
    category = models.CharField(max_length=100, blank=True, default='')
    # Brand name
    brand = models.CharField(max_length=100, blank=True, default='')
    # Tags for product (comma-separated)
    tags = models.CharField(max_length=500, blank=True, default='')
    # Discount percentage (0-100)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0, blank=True)
    # URL to the product image (optional - can be blank or null)
    image_url = models.URLField(blank=True, null=True)
    # Additional image URLs (stored as JSON text)
    additional_images = models.TextField(blank=True, default='[]')
    # Star rating (1.00 to 5.00)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    # Number of reviews
    reviews_count = models.IntegerField(default=0)
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # This method returns a string representation of the product
    # Used in Django admin and when printing the product
    def __str__(self):
        return self.title
    
    # Calculate the final price after discount
    def get_discounted_price(self):
        if self.discount > 0:
            discount_amount = self.price * (self.discount / 100)
            return self.price - discount_amount
        return self.price
