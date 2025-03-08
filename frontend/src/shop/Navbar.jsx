import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, Heart, LogOut, SlidersHorizontal } from 'lucide-react';
import axios from '../utils/axios';
import debounce from 'lodash/debounce';

const Navbar = ({ onCartClick, cartItemsCount, cartTotal, onSearch, onSort }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const sortOptions = [
    { value: 'relevance', label: '🎯 Best Match' },
    { value: 'price-asc', label: '💰 Price: Low to High' },
    { value: 'price-desc', label: '💎 Price: High to Low' },
    { value: 'name-asc', label: '📝 Name: A to Z' },
    { value: 'name-desc', label: '📝 Name: Z to A' },
    { value: 'newest', label: '✨ Newest First' }
  ];

  // Debounced search function with shorter delay
  const debouncedSearch = useCallback(
    debounce((query) => {
      onSearch?.(query);
      const params = new URLSearchParams(location.search);
      if (query.trim()) {
        params.set('search', query.trim());
      } else {
        params.delete('search');
      }
      navigate(`?${params.toString()}`);
    }, 100), // Reduced debounce delay to 100ms
    [navigate, onSearch]
  );

  // Handle immediate search query updates
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query); // Update local state immediately
    debouncedSearch(query); // Debounce the search callback
  };

  // Update search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search') || '';
    setSearchQuery(searchParam);
  }, [location.search]);

  const handleSortChange = (value) => {
    onSort?.(value);
    setShowSortMenu(false);
  };

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:8000/api/logout/', {
        withCredentials: true
      });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/login';
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
              className="h-8 w-auto"
            />
            <span className="font-semibold text-green-600 text-lg hidden sm:block">
              Farmer's Market
            </span>
          </Link>

          {/* Search Bar with Sort - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative flex items-center w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search for fresh produce..."
                  className="w-full px-4 py-2 pl-10 pr-12 rounded-lg border border-gray-300 
                    focus:outline-none focus:ring-2 focus:ring-green-500
                    placeholder-gray-400 bg-gray-50"
                />
              </div>

              {/* Sort Button */}
              <div className="relative ml-2">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-gray-50 
                    rounded-lg border border-gray-300 flex items-center gap-2
                    transition-colors duration-200 bg-white"
                  title="Sort products"
                >
                  <SlidersHorizontal size={18} />
                  <span className="text-sm hidden sm:inline">Sort</span>
                </button>

                {/* Sort Dropdown */}
                {showSortMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white 
                    ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1" role="menu">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleSortChange(option.value)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700
                            hover:bg-gray-50 hover:text-green-600 transition-colors duration-200
                            flex items-center gap-2"
                          role="menuitem"
                        >
                          <span className="w-6">{option.label.split(' ')[0]}</span>
                          <span>{option.label.split(' ').slice(1).join(' ')}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/favorites"
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-gray-50 
                rounded-full transition-colors duration-200"
              title="Favorites"
            >
              <Heart size={22} />
            </Link>

            <button 
              onClick={onCartClick}
              className="relative p-2 text-gray-600 hover:text-green-600 hover:bg-gray-50 
                rounded-full transition-colors duration-200"
              title="Shopping Cart"
            >
              <ShoppingCart size={22} />
              {cartItemsCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-green-500 text-white 
                  text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </div>
              )}
            </button>

            <div className="flex items-center pl-4 border-l border-gray-200">
              <Link 
                to="/profile"
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-gray-50 
                  rounded-full transition-colors duration-200"
                title="Profile"
              >
                <User size={22} />
              </Link>

              <button
                onClick={handleLogout}
                className="ml-2 flex items-center space-x-1 text-red-600 hover:text-red-700 
                  px-3 py-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                title="Logout"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-green-600 
              hover:bg-gray-50 rounded-full transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="px-4 mb-4">
              <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search for fresh produce..."
                    className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 
                      focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                  />
                </div>
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-gray-50 
                    rounded-lg border border-gray-300 flex items-center
                    transition-colors duration-200 bg-white"
                  title="Sort products"
                >
                  <SlidersHorizontal size={18} />
                </button>
              </div>
              
              {/* Mobile Sort Dropdown */}
              {showSortMenu && (
                <div className="mt-2 rounded-lg shadow-lg bg-white 
                  ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                  <div className="py-1" role="menu">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSortChange(option.value)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700
                          hover:bg-gray-50 hover:text-green-600 transition-colors duration-200
                          flex items-center gap-2"
                        role="menuitem"
                      >
                        <span className="w-6">{option.label.split(' ')[0]}</span>
                        <span>{option.label.split(' ').slice(1).join(' ')}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <Link 
                to="/favorites"
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart size={20} className="mr-3" />
                Favorites
              </Link>
              <Link 
                to="/profile"
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <User size={20} className="mr-3" />
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
  cartTotal: PropTypes.number.isRequired,
  onSearch: PropTypes.func,
  onSort: PropTypes.func
};

export default Navbar;
