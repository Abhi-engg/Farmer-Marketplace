from django.db import models
from django.contrib.auth.models import User
from django.db.models import Avg

# Create your models here.

class Note(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='notes'
    )

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']

class Category(models.Model):
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=10)  # For storing emoji icons
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Categories"

class Product(models.Model):
    UNIT_CHOICES = [
        ('kg', 'Kilogram'),
        ('dozen', 'Dozen'),
        ('litre', 'Litre'),
        ('500g', '500 Gram Pack'),
        ('piece', 'Piece'),
        ('bunch', 'Bunch'),
        ('10g', '10 Gram'),
        ('100g', '100 Gram'),
        ('250g', '250 Gram'),
    ]

    name = models.CharField(max_length=200)
    farmer = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/')
    unit = models.CharField(max_length=10, choices=UNIT_CHOICES, default='piece')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    @property
    def average_rating(self):
        return self.reviews.aggregate(Avg('rating'))['rating__avg'] or 0.0

    @property
    def review_count(self):
        return self.reviews.count()

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='carts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def get_total(self):
        return sum(item.get_cost() for item in self.items.all())
    
    def get_item_count(self):
        return self.items.count()

    def __str__(self):
        return f"Cart for {self.user.username}"

    class Meta:
        ordering = ['-created_at']

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=1)

    def get_cost(self):
        return float(self.product.price * self.quantity)

class Banner(models.Model):
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=200)
    image = models.ImageField(upload_to='banners/')
    button_text = models.CharField(max_length=50)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}'s favorite - {self.product.name}"

class Review(models.Model):
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.DecimalField(max_digits=3, decimal_places=1)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}'s review of {self.product.name}"
