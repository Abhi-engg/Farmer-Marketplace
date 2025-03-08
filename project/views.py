from django.shortcuts import redirect
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@ensure_csrf_cookie
def get_csrf(request):
    """Get CSRF token for making authenticated requests"""
    return JsonResponse({'csrfToken': get_token(request)})

@api_view(['GET'])
def user_info(request):
    """Get current user information"""
    if request.user.is_authenticated:
        return Response({
            'isAuthenticated': True,
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
            }
        })
    return Response({'isAuthenticated': False})

@api_view(['GET'])
def check_auth(request):
    """Check if user is authenticated"""
    return Response({
        'isAuthenticated': request.user.is_authenticated,
        'user': {
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email
        } if request.user.is_authenticated else None
    })

@api_view(['POST', 'GET'])
def logout_view(request):
    """Logout the user and clear session"""
    if request.user.is_authenticated:
        logout(request)
        response = Response({
            'message': 'Successfully logged out',
            'redirectUrl': '/login'
        }, status=status.HTTP_200_OK)
        response.delete_cookie('sessionid')
        response.delete_cookie('csrftoken')
        return response
    return Response({
        'message': 'No user to logout',
        'redirectUrl': '/login'
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
def login_view(request):
    """Handle login request"""
    if request.user.is_authenticated:
        return Response({
            'isAuthenticated': True,
            'redirectUrl': '/'
        })
    return Response({
        'isAuthenticated': False,
        'googleLoginUrl': '/login/google-oauth2/',
        'message': 'Please login with Google'
    }) 