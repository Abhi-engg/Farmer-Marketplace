import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, Home, Package, Heart, LogOut } from 'lucide-react';
import axios from '../utils/axios';

const Navbar = ({ onCartClick, cartItemsCount, cartTotal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:8000/api/logout/', {
        withCredentials: true
      });
      // Force a page reload after logout to clear all states
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect to login on error
      window.location.href = '/login';
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/logo.svg" 
              alt="Farmer Marketplace" 
              className="h-8"
            />
            <span className="font-semibold text-green-600 text-lg hidden sm:block">
              Farmer's Market
            </span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-8"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 
                  focus:outline-none focus:ring-2 focus:ring-green-500
                  placeholder-gray-400"
              />
              <button 
                type="submit"
                className="absolute right-3 top-2.5 text-gray-400 hover:text-green-600"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/shop"
              className="flex items-center space-x-1 text-gray-600 hover:text-green-600"
            >
              <Package size={20} />
              <span>Shop</span>
            </Link>
            
            <Link 
              to="/favorites"
              className="flex items-center space-x-1 text-gray-600 hover:text-green-600"
            >
              <Heart size={20} />
              <span>Favorites</span>
            </Link>

            <button 
              onClick={onCartClick}
              className="relative flex items-center space-x-2 p-2 hover:bg-gray-100 
                rounded-full transition-colors"
            >
              <ShoppingCart size={24} className="text-gray-600" />
              {cartItemsCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-green-500 text-white 
                  text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </div>
              )}
              {cartTotal > 0 && (
                <span className="text-sm font-medium ml-1">
                  ₹{cartTotal.toFixed(2)}
                </span>
              )}
            </button>

            <div className="flex items-center space-x-4">
              <Link 
                to="/profile"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <User size={24} className="text-gray-600" />
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 
                  px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 hover:bg-gray-100 rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <form 
              onSubmit={handleSearch}
              className="flex px-4 mb-4"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 
                  focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </form>
            <div className="space-y-2">
              <Link 
                to="/"
                className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home size={20} className="mr-3 text-gray-600" />
                Home
              </Link>
              <Link 
                to="/shop"
                className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <Package size={20} className="mr-3 text-gray-600" />
                Shop
              </Link>
              <Link 
                to="/favorites"
                className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart size={20} className="mr-3 text-gray-600" />
                Favorites
              </Link>
              <button 
                onClick={() => {
                  onCartClick();
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
              >
                <ShoppingCart size={20} className="mr-3 text-gray-600" />
                Cart ({cartItemsCount}) - ₹{cartTotal.toFixed(2)}
              </button>
              <Link 
                to="/profile"
                className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <User size={20} className="mr-3 text-gray-600" />
                Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50"
              >
                <LogOut size={20} className="mr-3" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  onCartClick: PropTypes.func.isRequired,
  cartItemsCount: PropTypes.number.isRequired,
  cartTotal: PropTypes.number.isRequired
};

export default Navbar;
