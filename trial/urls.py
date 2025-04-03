from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .views import (
    NoteViewSet, CartViewSet, CategoryViewSet, 
    ProductViewSet, BannerViewSet, user_profile, 
    update_profile, FavoriteViewSet, ReviewViewSet,
    CustomAuthToken, ExtractTextView, oauth_complete,
    test_gemini_api, gemini_diagnostic, gemini_test_page
)
import logging

logger = logging.getLogger(__name__)

router = DefaultRouter()
router.register(r'notes', NoteViewSet)
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'banners', BannerViewSet)
router.register(r'favorites', FavoriteViewSet, basename='favorite')
router.register(r'reviews', ReviewViewSet, basename='review')

# CSRF token endpoint
@ensure_csrf_cookie
@api_view(['GET'])
def get_csrf(request):
    logger.info(f"CSRF token requested by {request.META.get('REMOTE_ADDR')}")
    return Response({'detail': 'CSRF cookie set'})

# Check authentication status
@api_view(['GET'])
def check_auth(request):
    logger.info(f"Auth check for user: {request.user}")
    logger.debug(f"Auth headers: {request.headers.get('Authorization', 'Not found')}")
    logger.debug(f"Is authenticated: {request.user.is_authenticated}")
    return Response({
        'isAuthenticated': request.user.is_authenticated,
        'username': request.user.username if request.user.is_authenticated else None
    })

urlpatterns = [
    path('', include(router.urls)),
    path('extract-text/', ExtractTextView.as_view(), name='extract-text'),
    path('profile/', user_profile, name='user-profile'),
    path('profile/update/', update_profile, name='update-profile'),
    path('test-gemini/', test_gemini_api, name='test-gemini'),
    path('diagnostic/', gemini_diagnostic, name='gemini-diagnostic'),
    path('test-page/', gemini_test_page, name='gemini-test-page'),
    path('oauth/complete/', oauth_complete, name='oauth-complete'),
    path('', include('social_django.urls', namespace='social')),
    path('token/', CustomAuthToken.as_view(), name='token'),
    path('csrf/', get_csrf, name='csrf'),
    path('check-auth/', check_auth, name='check-auth'),
] 