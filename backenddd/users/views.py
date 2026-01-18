# This file handles user registration
from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import RegisterSerializer

# This view allows users to create a new account
class RegisterView(generics.CreateAPIView):
    # All users in the database
    queryset = User.objects.all()
    # Use the RegisterSerializer to validate and create users
    serializer_class = RegisterSerializer
