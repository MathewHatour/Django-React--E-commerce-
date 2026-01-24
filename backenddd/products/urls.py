from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ProductViewSet, SellerProductViewSet

router = DefaultRouter()
router.register('', ProductViewSet, basename='product')

# Separate router for seller endpoints
seller_router = DefaultRouter()
seller_router.register('', SellerProductViewSet, basename='seller-product')

urlpatterns = [
    path('seller/', include(seller_router.urls)),
    path('', include(router.urls)),
]
