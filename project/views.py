from django.shortcuts import redirect
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.middleware.csrf import get_token

def get_csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})

def login_view(request):
    return JsonResponse({
        'google_oauth_url': f'/social/begin/google-oauth2/'
    })

@login_required
def user_info(request):
    user = request.user
    return JsonResponse({
        'username': user.username,
        'email': user.email,
        'is_authenticated': user.is_authenticated
    })

def logout_view(request):
    logout(request)
    response = JsonResponse({'message': 'Logged out successfully'})
    # Clear any session cookies
    response.delete_cookie('sessionid')
    response.delete_cookie('csrftoken')
    return response

def check_auth(request):
    return JsonResponse({
        'isAuthenticated': request.user.is_authenticated
    }) 