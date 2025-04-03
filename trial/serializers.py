from rest_framework import serializers
from .models import Note, Product, Cart, CartItem, Category, Banner, Favorite, Review
from django.db import models

class NoteSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'created_at', 'user']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'icon']

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'rating', 'comment', 'created_at', 'user_name']
        read_only_fields = ['user']

class ProductSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    farmer_name = serializers.CharField(source='farmer')
    category_name = serializers.CharField(source='category.name', read_only=True)
    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'unit',
            'quantity', 'image_url', 'farmer_name', 'location',
            'category', 'category_name', 'created_at', 'average_rating',
            'reviews_count', 'is_favorite'
        ]

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None  # or return a default image URL

    def get_average_rating(self, obj):
        if hasattr(obj, 'reviews'):
            avg = obj.reviews.aggregate(models.Avg('rating'))['rating__avg']
            return round(float(avg), 1) if avg else 0.0
        return 0.0

    def get_reviews_count(self, obj):
        if hasattr(obj, 'reviews'):
            return obj.reviews.count()
        return 0

    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Favorite.objects.filter(user=request.user, product=obj).exists()
        return False

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    subtotal = serializers.SerializerMethodField()
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'subtotal']

    def get_subtotal(self, obj):
        return obj.get_cost()

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total', 'item_count', 'created_at', 'updated_at']

    def get_total(self, obj):
        return obj.get_total()

    def get_item_count(self, obj):
        return obj.get_item_count()

class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ['id', 'title', 'description', 'image', 'button_text', 'order']

class FavoriteSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'product', 'product_id', 'created_at']
        read_only_fields = ['user'] 