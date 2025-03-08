import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Navbar,
  HeroBanner,
  CategorySection,
  ProductGrid,
  CartSidebar,
  CartModal
} from './';

const ShopPage = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [cartItems, setCartItems] = useState(() => {
    // Initialize cart from localStorage
    const savedCart = localStorage.getItem('shopCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [products, setProducts] = useState([]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle URL params for category
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category.charAt(0).toUpperCase() + category.slice(1));
    }
  }, [searchParams]);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  // Handle sort
  const handleSort = (value) => {
    setSortBy(value);
    const params = new URLSearchParams(searchParams);
    if (value !== 'relevance') {
      params.set('sort', value);
    } else {
      params.delete('sort');
    }
    setSearchParams(params);
  };

  // Load initial state from URL
  useEffect(() => {
    const query = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'relevance';
    setSearchQuery(query);
    setSortBy(sort);
  }, [searchParams]);

  // Load published products and handle storage changes
  useEffect(() => {
    const loadProducts = () => {
      const savedProducts = localStorage.getItem('farmerProducts');
      if (savedProducts) {
        const allProducts = JSON.parse(savedProducts);
        const publishedProducts = allProducts.filter(p => p.published);
        setProducts(publishedProducts);
      }
    };

    loadProducts();
    window.addEventListener('storage', loadProducts);
    return () => window.removeEventListener('storage', loadProducts);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shopCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // Check if adding one more would exceed available stock
        if (existingItem.quantity + 1 > product.stock) {
          alert(`Sorry, only ${product.stock} ${product.unit}(s) available`);
          return prevItems;
        }
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    setCartItems(prevItems => {
      const product = products.find(p => p.id === productId);
      if (product && newQuantity > product.stock) {
        alert(`Sorry, only ${product.stock} ${product.unit}(s) available`);
        return prevItems;
      }
      if (newQuantity < 1) {
        return prevItems.filter(item => item.id !== productId);
      }
      return prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setCartItems([]);
      setIsCartOpen(false);
    }
  };

  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const checkStockAvailability = () => {
    const unavailableItems = cartItems.filter(item => {
      const product = products.find(p => p.id === item.id);
      return !product || item.quantity > product.stock;
    });
    return unavailableItems.length === 0;
  };

  const handleCheckout = () => {
    if (!checkStockAvailability()) {
      alert('Some items in your cart are no longer available in the requested quantity');
      return;
    }
    // Proceed with checkout
    alert('Proceeding to checkout...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        onCartClick={() => setIsCartOpen(true)}
        cartItemsCount={getCartItemsCount()}
        cartTotal={calculateCartTotal()}
        onSearch={handleSearch}
        onSort={handleSort}
      />
      
      <main className="container mx-auto px-4 py-8">
        <HeroBanner />
        <CategorySection 
          onCategorySelect={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
        <ProductGrid 
          products={products}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          sortBy={sortBy}
          onAddToCart={handleAddToCart}
        />
      </main>

      {/* Cart UI based on screen size */}
      {isMobile ? (
        <CartModal 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromCart}
          onClearCart={handleClearCart}
          cartTotal={calculateCartTotal()}
          itemCount={getCartItemsCount()}
          onCheckout={handleCheckout}
        />
      ) : (
        <CartSidebar 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromCart}
          onClearCart={handleClearCart}
          cartTotal={calculateCartTotal()}
          itemCount={getCartItemsCount()}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  );
};

export default ShopPage;