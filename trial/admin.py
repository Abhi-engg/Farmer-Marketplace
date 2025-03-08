from django.contrib import admin
from .models import Note, Product, Cart, CartItem, Category, Banner, Favorite, Review

@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ['title', 'order', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['title', 'description']
    ordering = ['order']

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon']
    search_fields = ['name']

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'product', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['user__username', 'product__name', 'comment']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'farmer', 'price', 'unit', 'average_rating', 'review_count']
    list_filter = ['category', 'unit', 'created_at']
    search_fields = ['name', 'farmer', 'location']
    readonly_fields = ['average_rating', 'review_count']

admin.site.register(Note)

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 1

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['id', 'created_at', 'updated_at']
    inlines = [CartItemInline]