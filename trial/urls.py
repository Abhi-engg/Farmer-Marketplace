from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    NoteViewSet, CartViewSet, CategoryViewSet, 
    ProductViewSet, BannerViewSet, user_profile, 
    update_profile, FavoriteViewSet, ReviewViewSet,
    farmers_locations, subscribe_newsletter,
    home_stats, how_it_works, auth_status,
    logout_view, GoogleLoginFailure
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
    path('farmers/locations/', farmers_locations, name='farmer-locations'),
    path('subscribe/', subscribe_newsletter, name='subscribe-newsletter'),
    path('home/stats/', home_stats, name='home-stats'),
    path('how-it-works/', how_it_works, name='how-it-works'),
    path('auth/status/', auth_status, name='auth-status'),
    path('auth/logout/', logout_view, name='auth-logout'),
    path('auth/google/failure/', GoogleLoginFailure.as_view(), name='google-failure'),
] 