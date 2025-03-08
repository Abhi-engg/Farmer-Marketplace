from django.shortcuts import render
from rest_framework import viewsets, status, filters
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.decorators import api_view, permission_classes, action
from django.contrib.auth.models import User
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

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'farmer', 'location', 'category__name']
    ordering_fields = ['created_at', 'price', 'name']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Product.objects.all()
        category = self.request.query_params.get('category', None)
        search = self.request.query_params.get('search', None)
        min_rating = self.request.query_params.get('min_rating', None)
        
        if category and category.lower() != 'all':
            queryset = queryset.filter(category__name__iexact=category)
        
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(farmer__icontains=search) |
                Q(location__icontains=search) |
                Q(category__name__icontains=search)
            )

        if min_rating:
            try:
                min_rating = float(min_rating)
                queryset = queryset.annotate(
                    avg_rating=Avg('reviews__rating')
                ).filter(avg_rating__gte=min_rating)
            except ValueError:
                pass
        
        return queryset

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
