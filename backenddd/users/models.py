from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    USER_TYPE_CHOICES = [
        ('customer', 'Customer'),
        ('seller', 'Seller'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=20, blank=True)
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='customer')

    def __str__(self):
        return f"{self.user.username} ({self.user_type})"
