import PropTypes from 'prop-types';
import { useState } from 'react';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';

const Navbar = ({ onCartClick, cartItemsCount, cartTotal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img 
              src="/logo.svg" 
              alt="Farmer Marketplace" 
              className="h-8"
            />
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={onCartClick}
              className="relative flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full"
            >
              <ShoppingCart size={24} />
              {cartItemsCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </div>
              )}
              {cartTotal > 0 && (
                <span className="text-sm font-medium">₹{cartTotal.toFixed(2)}</span>
              )}
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <User size={24} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex px-4 mb-4">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="space-y-2">
              <button 
                onClick={onCartClick}
                className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
              >
                <ShoppingCart size={20} className="mr-3" />
                Cart (3)
              </button>
              <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100">
                <User size={20} className="mr-3" />
                Profile
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
