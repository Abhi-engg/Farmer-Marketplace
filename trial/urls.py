from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    NoteViewSet, CartViewSet, CategoryViewSet, 
    ProductViewSet, BannerViewSet, user_profile, 
    update_profile, FavoriteViewSet, ReviewViewSet
)

router = DefaultRouter()
router.register(r'notes', NoteViewSet)
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'banners', BannerViewSet)
router.register(r'favorites', FavoriteViewSet, basename='favorite')
router.register(r'reviews', ReviewViewSet, basename='review')

urlpatterns = [
    path('', include(router.urls)),
    path('profile/', user_profile, name='user-profile'),
    path('profile/update/', update_profile, name='update-profile'),
] 