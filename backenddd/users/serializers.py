# This file defines how user data is serialized (converted to/from JSON)
from django.contrib.auth.models import User
from rest_framework import serializers

# Serializer for user registration
class RegisterSerializer(serializers.ModelSerializer):
    # Password should not be returned in API responses (write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        # Use Django's built-in User model
        model = User
        # Fields that can be set during registration
        fields = ['username', 'email', 'password']

    # This method is called when creating a new user
    def create(self, validated_data):
        # Get the data that was validated
        username = validated_data['username']
        email = validated_data['email']
        password = validated_data['password']
        
        # Create a new user with hashed password
        new_user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        
        # Return the created user
        return new_user
