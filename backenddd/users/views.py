# This file handles user registration and login
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer
from .models import Profile

# This view allows users to create a new account
class RegisterView(generics.CreateAPIView):
    # All users in the database
    queryset = User.objects.all()
    # Use the RegisterSerializer to validate and create users
    serializer_class = RegisterSerializer


# Custom login view that includes user_type
class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Please provide both username and password'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Try to authenticate user
        from django.contrib.auth import authenticate
        user = authenticate(username=username, password=password)
        
        if user is None:
            return Response(
                {'error': 'Invalid username or password'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Get or create profile
        profile, created = Profile.objects.get_or_create(
            user=user,
            defaults={'user_type': 'customer'}
        )
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'username': user.username,
            'user_type': profile.user_type
        })
