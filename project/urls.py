"""
URL configuration for project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from . import views
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.contrib.auth.views import LogoutView
from django.shortcuts import redirect
from django.http import JsonResponse

def auth_complete(request):
    """Handle OAuth completion and redirect"""
    if request.user.is_authenticated:
        return redirect('http://localhost:3000')  # Redirect to React frontend
    return JsonResponse({'error': 'Authentication failed'}, status=401)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/csrf/', views.get_csrf, name='csrf'),
    path('api/user/', views.user_info, name='user_info'),
    path('api/login/', views.login_view, name='login'),
    path('api/logout/', views.logout_view, name='logout'),
    path('api/check-auth/', views.check_auth, name='check_auth'),
    path('', include('social_django.urls', namespace='social')),
    path('api/', include('trial.urls')),
    path('auth/complete/', auth_complete, name='auth-complete'),
    path('logout/', LogoutView.as_view(
        next_page='http://localhost:3000/login'
    ), name='logout'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
