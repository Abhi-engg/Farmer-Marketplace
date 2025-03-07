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
  const [searchParams] = useSearchParams();
  const [cartItems, setCartItems] = useState([]);

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

  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
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
    if (newQuantity < 1) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        onCartClick={() => setIsCartOpen(true)} 
        cartItemsCount={getCartItemsCount()}
        cartTotal={calculateCartTotal()}
      />
      
      <main className="container mx-auto px-4 py-8">
        <HeroBanner />
        <CategorySection 
          onCategorySelect={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
        <ProductGrid 
          selectedCategory={selectedCategory} 
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
          cartTotal={calculateCartTotal()}
          itemCount={getCartItemsCount()}
        />
      ) : (
        <CartSidebar 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromCart}
          cartTotal={calculateCartTotal()}
          itemCount={getCartItemsCount()}
        />
      )}
    </div>
  );
};

export default ShopPage;