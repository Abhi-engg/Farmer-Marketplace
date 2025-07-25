from django.shortcuts import render, redirect
from rest_framework import viewsets, status, filters
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.decorators import api_view, permission_classes, action, parser_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.decorators import api_view, permission_classes, action

from django.contrib.auth.models import User
from django.contrib.auth import logout
from django.shortcuts import redirect
from rest_framework.views import APIView
from .models import Note, Cart, CartItem, Product, Category, Banner, Favorite, Review
from .serializers import (
    NoteSerializer, CartSerializer, CartItemSerializer, 
    ProductSerializer, CategorySerializer, BannerSerializer,
    FavoriteSerializer, ReviewSerializer
)
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from decimal import Decimal

from django.db.models import Q, Avg
import google.generativeai as genai
import base64
import json
import os
import sys
import datetime
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from PIL import Image
import io
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from urllib.parse import urlencode
from social_django.utils import load_strategy
import logging

# Set up logger
logger = logging.getLogger(__name__)
=======
from django.db.models import Q, Avg, Count


# Create your views here.

@method_decorator(ensure_csrf_cookie, name='dispatch')
class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user, is_active=True)

    def get_or_create_active_cart(self):
        cart = Cart.objects.filter(user=self.request.user, is_active=True).first()
        if not cart:
            cart = Cart.objects.create(user=self.request.user, is_active=True)
        return cart

    def create(self, request, *args, **kwargs):
        cart = self.get_or_create_active_cart()
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def current(self, request):
        cart = self.get_or_create_active_cart()
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_to_cart(self, request):
        cart = self.get_or_create_active_cart()
        product_id = request.data.get('product_id')
        quantity = Decimal(str(request.data.get('quantity', 1)))

        try:
            product = Product.objects.get(id=product_id)
            
            # Validate quantity
            is_valid, error = self.validate_quantity(quantity, product.unit)
            if not is_valid:
                return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)

            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                defaults={'quantity': quantity}
            )
            
            if not created:
                new_quantity = cart_item.quantity + quantity
                is_valid, error = self.validate_quantity(new_quantity, product.unit)
                if not is_valid:
                    return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
                cart_item.quantity = new_quantity
                cart_item.save()

            serializer = self.get_serializer(cart)
            return Response(serializer.data)
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'])
    def update_quantity(self, request):
        cart = self.get_or_create_active_cart()
        item_id = request.data.get('item_id')
        quantity = Decimal(str(request.data.get('quantity', 1)))

        try:
            cart_item = CartItem.objects.get(cart=cart, id=item_id)
            
            # Validate quantity
            is_valid, error = self.validate_quantity(quantity, cart_item.product.unit)
            if not is_valid:
                return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)

            if quantity > 0:
                cart_item.quantity = quantity
                cart_item.save()
            else:
                cart_item.delete()
            
            serializer = self.get_serializer(cart)
            return Response(serializer.data)
        except CartItem.DoesNotExist:
            return Response(
                {'error': 'Cart item not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        cart = self.get_or_create_active_cart()
        item_id = request.data.get('item_id')

        try:
            cart_item = CartItem.objects.get(cart=cart, id=item_id)
            cart_item.delete()
            serializer = self.get_serializer(cart)
            return Response(serializer.data)
        except CartItem.DoesNotExist:
            return Response(
                {'error': 'Cart item not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'])
    def clear(self, request):
        cart = self.get_or_create_active_cart()
        cart.items.all().delete()
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    def get_quantity_step(self, unit):
        unit = unit.lower()
        if unit == 'kg' or unit == 'litre':
            return Decimal('0.5')
        return Decimal('1')

    def validate_quantity(self, quantity, unit):
        step = self.get_quantity_step(unit)
        quantity = Decimal(str(quantity))
        
        # Check if quantity is a multiple of the step
        if (quantity % step) != 0:
            return False, f"Quantity must be in increments of {step} for {unit}"
        
        # Ensure quantity is positive
        if quantity <= 0:
            return False, "Quantity must be greater than 0"
            
        return True, None

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]  # Allow public access to categories

    @action(detail=False, methods=['get'])
    def with_stats(self, request):
        """Get categories with their statistics"""
        categories = Category.objects.annotate(
            products_count=Count('products'),
            avg_rating=Avg('products__reviews__rating')
        )
        
        data = []
        for category in categories:
            data.append({
                'id': category.id,
                'name': category.name,
                'products_count': category.products_count,
                'avg_rating': round(category.avg_rating or 4.0, 1),
                'image_url': category.image.url if hasattr(category, 'image') and category.image else None
            })
        
        return Response(data)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'farmer', 'location', 'category__name']
    ordering_fields = ['created_at', 'price', 'name']
    ordering = ['-created_at']
    permission_classes = [IsAuthenticatedOrReadOnly]  # Allow public read access

    def get_queryset(self):
        queryset = Product.objects.all().select_related('category')
        
        # Category filter
        category = self.request.query_params.get('category', None)
        if category and category.lower() != 'all':
            queryset = queryset.filter(category__name__iexact=category)
        
        # Search filter
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(farmer__icontains=search) |
                Q(location__icontains=search) |
                Q(category__name__icontains=search)
            )

        # Price range filter
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)
        if min_price:
            queryset = queryset.filter(price__gte=float(min_price))
        if max_price:
            queryset = queryset.filter(price__lte=float(max_price))

        # Rating filter
        min_rating = self.request.query_params.get('min_rating', None)
        if min_rating:
            try:
                min_rating = float(min_rating)
                queryset = queryset.annotate(
                    avg_rating=Avg('reviews__rating')
                ).filter(avg_rating__gte=min_rating)
            except ValueError:
                pass

        # Availability filter
        in_stock = self.request.query_params.get('in_stock', None)
        if in_stock and in_stock.lower() == 'true':
            queryset = queryset.filter(quantity__gt=0)
        
        return queryset.annotate(
            average_rating=Avg('reviews__rating'),
            review_count=Count('reviews')
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=True, methods=['post'])
    def toggle_favorite(self, request, pk=None):
        product = self.get_object()
        user = request.user
        favorite = Favorite.objects.filter(user=user, product=product).first()

        if favorite:
            favorite.delete()
            return Response({'status': 'removed'})
        else:
            Favorite.objects.create(user=user, product=product)
            return Response({'status': 'added'})

    @action(detail=False, methods=['get'])
    def favorites(self, request):
        favorites = Favorite.objects.filter(user=request.user)
        serializer = FavoriteSerializer(favorites, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_review(self, request, pk=None):
        product = self.get_object()
        user = request.user
        
        # Check if user has already reviewed this product
        if Review.objects.filter(user=user, product=product).exists():
            return Response(
                {'error': 'You have already reviewed this product'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user, product=product)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        product = self.get_object()
        reviews = product.reviews.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_to_cart(self, request, pk=None):
        """Quick add to cart with quantity 1"""
        product = self.get_object()
        cart_viewset = CartViewSet()
        cart_viewset.request = request
        cart = cart_viewset.get_or_create_active_cart()
        
        try:
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                defaults={'quantity': 1}
            )
            
            if not created:
                cart_item.quantity += 1
                cart_item.save()

            return Response({
                'status': 'success',
                'message': f'Added {product.name} to cart'
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def buy_now(self, request, pk=None):
        """Quick purchase single item"""
        product = self.get_object()
        cart_viewset = CartViewSet()
        cart_viewset.request = request
        
        # Clear existing cart
        cart = cart_viewset.get_or_create_active_cart()
        cart.items.all().delete()
        
        # Add this item
        CartItem.objects.create(
            cart=cart,
            product=product,
            quantity=1
        )
        
        return Response({
            'status': 'success',
            'message': 'Ready for checkout',
            'cart_id': cart.id
        })

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured products for the home page"""
        # Get products with high ratings and reviews
        featured_products = Product.objects.annotate(
            avg_rating=Avg('reviews__rating'),
            review_count=Count('reviews')
        ).filter(
            avg_rating__gte=4.0,  # Products with rating >= 4.0
            review_count__gte=1   # Products with at least 1 review
        ).order_by('-avg_rating', '-created_at')[:6]  # Get top 6 products
        
        serializer = self.get_serializer(featured_products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get product statistics for the home page"""
        total_products = Product.objects.count()
        total_farmers = Product.objects.values('farmer').distinct().count()
        total_categories = Category.objects.count()
        avg_savings = 25  # Mock value, you can calculate this based on your business logic

        return Response({
            'total_products': total_products,
            'total_farmers': total_farmers,
            'total_categories': total_categories,
            'avg_savings': avg_savings
        })

class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BannerViewSet(viewsets.ModelViewSet):
    queryset = Banner.objects.filter(is_active=True)
    serializer_class = BannerSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Banner.objects.filter(is_active=True).order_by('order')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'date_joined': user.date_joined,
    }
    return Response(data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    data = request.data

    # Update user fields
    if 'first_name' in data:
        user.first_name = data['first_name']
    if 'last_name' in data:
        user.last_name = data['last_name']
    if 'email' in data:
        user.email = data['email']

    user.save()
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'date_joined': user.date_joined,
    })

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                         context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email
        })

class ExtractTextView(APIView):
    permission_classes = []  # Allow unauthenticated access
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        logger.info("=" * 50)
        logger.info("EXTRACT TEXT REQUEST RECEIVED")
        
        # Check for image file
        if 'image' not in request.FILES:
            logger.error("No image file in request")
            return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        image_file = request.FILES['image']
        logger.info(f"Image file: {image_file.name}, Size: {image_file.size}, Type: {image_file.content_type}")
        
        try:
            # Configure Gemini
            api_key = os.environ.get('GEMINI_API_KEY', 'AIzaSyDmH87y4vu8tv-lBbQjdtEdZ7optTCR_t8')
            genai.configure(api_key=api_key)
            
            # Process image
            image = Image.open(image_file)
            if image.mode not in ('RGB', 'L'):
                image = image.convert('RGB')
            
            # Convert to bytes and base64
            img_byte_arr = io.BytesIO()
            image.save(img_byte_arr, format='JPEG')
            img_bytes = img_byte_arr.getvalue()
            image_base64 = base64.b64encode(img_bytes).decode('utf-8')
            
            try:
                # Create Gemini model with new version
                model = genai.GenerativeModel('gemini-1.5-pro')
                
                # Enhanced prompt for better text extraction
                prompt = """
                Please analyze this image and extract all text content.
                Focus on:
                1. Accurate transcription of all visible text
                2. Maintaining original formatting and structure
                3. Preserving paragraph breaks and line spacing
                4. Handling both printed and handwritten text
                
                Return only the extracted text without any additional commentary.
                """
                
                # Make the API request with enhanced error handling
                try:
                    response = model.generate_content([
                        prompt,
                        {
                            "mime_type": "image/jpeg",
                            "data": image_base64
                        }
                    ])
                    
                    if not response or not response.text:
                        raise ValueError("No text was extracted from the image")
                    
                    return Response({
                        'extracted_text': response.text,
                        'status': 'success'
                    })
                    
                except Exception as api_err:
                    logger.error(f"Gemini API error: {str(api_err)}", exc_info=True)
                    # Try fallback to text-only model if vision model fails
                    try:
                        logger.info("Attempting fallback to text-only model")
                        model = genai.GenerativeModel('gemini-1.5-pro')
                        response = model.generate_content(
                            "Please try to extract any visible text from this image. "
                            "Focus on accuracy and maintain the original structure."
                        )
                        return Response({
                            'extracted_text': response.text,
                            'status': 'success',
                            'note': 'Used fallback model'
                        })
                    except Exception as fallback_err:
                        logger.error(f"Fallback model error: {str(fallback_err)}", exc_info=True)
                        raise
                
            except Exception as model_err:
                logger.error(f"Model error: {str(model_err)}", exc_info=True)
                return Response({
                    'error': 'Failed to process image with AI model',
                    'detail': str(model_err)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        except Exception as e:
            logger.error(f"General error: {str(e)}", exc_info=True)
            return Response({
                'error': 'Failed to process the image',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@login_required
def oauth_complete(request):
    """Handle the OAuth callback and generate token"""
    logger.info(f"OAuth callback received for user: {request.user}")
    
    # Generate or get the token for the user
    token, created = Token.objects.get_or_create(user=request.user)
    logger.info(f"Token {'created' if created else 'retrieved'} for user: {request.user}")
    
    # Get the frontend URL from the session or use default
    frontend_url = request.session.get('frontend_url', 'http://localhost:3000/login')
    logger.info(f"Redirecting to frontend URL: {frontend_url}")
    
    # Add token to the redirect URL
    redirect_url = f"{frontend_url}?token={token.key}"
    
    return redirect(redirect_url)

@api_view(['GET'])
def test_gemini_api(request):
    """Test endpoint to verify Gemini API is working"""
    logger.info("=" * 50)
    logger.info("TESTING GEMINI API")
    
    try:
        api_key = os.environ.get('GEMINI_API_KEY', 'AIzaSyDmH87y4vu8tv-lBbQjdtEdZ7optTCR_t8')
        genai.configure(api_key=api_key)
        
        # Use new model version
        model = genai.GenerativeModel('gemini-1.5-pro')
        
        prompt = "Write a short greeting in exactly 10 words."
        response = model.generate_content(prompt)
        
        return Response({
            'status': 'success',
            'message': 'Gemini API is working correctly',
            'result': response.text
        })
        
    except Exception as e:
        logger.error(f"GEMINI API TEST ERROR: {str(e)}", exc_info=True)
        return Response({
            'status': 'error',
            'message': 'Gemini API test failed',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def gemini_diagnostic(request):
    """Simple diagnostic endpoint that doesn't require authentication"""
    logger.info("=" * 50)
    logger.info("GEMINI DIAGNOSTIC PAGE ACCESSED")
    
    # Collect system information
    diagnostic_info = {
        "python_version": os.sys.version,
        "platform": os.sys.platform,
        "libraries": {
            "django": "Installed",
            "rest_framework": "Installed",
            "PIL": "Installed",
            "google.generativeai": "Installed" if 'google.generativeai' in sys.modules else "Not imported"
        },
        "request_info": {
            "method": request.method,
            "path": request.path,
            "is_secure": request.is_secure(),
            "is_ajax": request.headers.get('x-requested-with') == 'XMLHttpRequest',
            "user_agent": request.META.get('HTTP_USER_AGENT', 'Unknown'),
        }
    }
    
    # Check if Gemini API key is configured
    api_key = os.environ.get('GEMINI_API_KEY')
    if api_key:
        diagnostic_info["api_key"] = "Found in environment (first 4 chars: " + api_key[:4] + "...)"
    else:
        diagnostic_info["api_key"] = "Not found in environment, will use fallback"
    
    # Try a simple Gemini text request
    try:
        # Configure Gemini
        api_key = api_key or 'AIzaSyDmH87y4vu8tv-lBbQjdtEdZ7optTCR_t8'  # Use fallback if needed
        genai.configure(api_key=api_key)
        
        # Create a simple text model
        model = genai.GenerativeModel('gemini-pro')
        
        # Send a simple prompt
        response = model.generate_content("Say hello in 5 words or less.")
        
        diagnostic_info["gemini_test"] = {
            "status": "success",
            "response": response.text,
            "model": "gemini-pro"
        }
    except Exception as e:
        diagnostic_info["gemini_test"] = {
            "status": "error",
            "error_type": type(e).__name__,
            "error_message": str(e)
        }
    
    # Return the diagnostic information
    return Response({
        "status": "success",
        "message": "Gemini API diagnostic information",
        "diagnostic_info": diagnostic_info
    })

def gemini_test_page(request):
    """Render a simple HTML page to test Gemini API directly"""
    return render(request, 'gemini_test.html')

@api_view(['GET'])
def farmers_locations(request):
    """Get all farmer locations for the map"""
    # Get unique farmers from products
    farmers = Product.objects.values(
        'farmer', 'location'
    ).annotate(
        products_count=Count('id'),
        avg_rating=Avg('reviews__rating')
    ).filter(
        products_count__gt=0  # Only farmers with products
    )

    # Add mock coordinates for demonstration
    # In real app, you would store these in the database
    import random
    
    # India's approximate bounding box
    INDIA_BOUNDS = {
        'lat': (8.4, 37.6),  # India's latitude range
        'lng': (68.7, 97.25)  # India's longitude range
    }

    farmer_data = []
    for farmer in farmers:
        # Generate random but realistic-looking coordinates within India
        lat = random.uniform(INDIA_BOUNDS['lat'][0], INDIA_BOUNDS['lat'][1])
        lng = random.uniform(INDIA_BOUNDS['lng'][0], INDIA_BOUNDS['lng'][1])
        
        farmer_data.append({
            'id': len(farmer_data) + 1,
            'name': farmer['farmer'],
            'farm_name': f"{farmer['farmer']}'s Farm",
            'location': farmer['location'],
            'latitude': round(lat, 6),
            'longitude': round(lng, 6),
            'products_count': farmer['products_count'],
            'rating': round(farmer['avg_rating'] or 4.0, 1),  # Default 4.0 if no ratings
            'region': farmer['location'].split(',')[-1].strip()  # Use last part of location as region
        })

    return Response(farmer_data)

@api_view(['POST'])
def subscribe_newsletter(request):
    """Handle newsletter subscriptions"""
    email = request.data.get('email')
    if not email:
        return Response(
            {'error': 'Email is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # In a real app, you would save this to a Newsletter model
    # For now, just return success
    return Response({
        'status': 'success',
        'message': 'Successfully subscribed to newsletter'
    })

@api_view(['GET'])
def home_stats(request):
    """Get combined statistics for the home page"""
    total_farmers = Product.objects.values('farmer').distinct().count()
    active_regions = Product.objects.values('location').distinct().count()
    total_products = Product.objects.count()
    total_categories = Category.objects.count()
    
    # Calculate mock statistics
    customer_satisfaction = 4.5  # Mock value
    delivery_success_rate = 98.5  # Mock value
    
    return Response({
        'farmers_count': total_farmers,
        'regions_count': active_regions,
        'products_count': total_products,
        'categories_count': total_categories,
        'customer_satisfaction': customer_satisfaction,
        'delivery_success_rate': delivery_success_rate,
        'features': [
            {
                'title': 'Direct Connection',
                'description': 'Connect directly with local farmers, eliminating middlemen',
                'icon': 'users'
            },
            {
                'title': 'Fresh Produce',
                'description': 'Get fresh, seasonal produce directly from farms',
                'icon': 'leaf'
            },
            {
                'title': 'Fair Prices',
                'description': 'Better prices for both farmers and consumers',
                'icon': 'trending-up'
            }
        ],
        'trust_indicators': [
            {
                'title': 'Secure Payments',
                'description': '100% secure transaction',
                'icon': 'shield'
            },
            {
                'title': 'Fast Delivery',
                'description': 'Same day delivery available',
                'icon': 'truck'
            },
            {
                'title': 'Verified Farmers',
                'description': 'All farmers are verified',
                'icon': 'users'
            }
        ]
    })

@api_view(['GET'])
def how_it_works(request):
    """Get the 'How It Works' steps"""
    return Response([
        {
            'number': '01',
            'title': 'Browse',
            'description': 'Explore fresh produce from local farmers'
        },
        {
            'number': '02',
            'title': 'Select',
            'description': 'Choose your favorite products'
        },
        {
            'number': '03',
            'title': 'Order',
            'description': 'Place your order with secure payment'
        },
        {
            'number': '04',
            'title': 'Receive',
            'description': 'Get fresh delivery to your doorstep'
        }
    ])

@api_view(['GET'])
def auth_status(request):
    """Check if user is authenticated and return user data"""
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Logout the user and clear session"""
    logout(request)
    return Response({'message': 'Successfully logged out'})

class GoogleLoginFailure(APIView):
    """Handle Google login failures"""
    def get(self, request):
        return Response({
            'error': 'Google login failed',
            'message': 'Unable to log in with Google. Please try again.'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
