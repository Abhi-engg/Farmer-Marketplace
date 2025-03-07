import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../utils/axios';
import Button from './ui/Button';
import PropTypes from 'prop-types';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const NavLink = ({ to, children }) => (
    <button 
      onClick={() => {
        navigate(to);
        setIsMobileMenuOpen(false);
      }} 
      className={`
        relative px-3 py-2 text-sm font-medium
        transition-all duration-200 ease-in-out
        group hover:text-green-100
        ${location.pathname === to 
          ? 'text-white' 
          : 'text-green-100/90'
        }
      `}
    >
      {children}
      <span className={`
        absolute bottom-0 left-0 w-full h-0.5 
        bg-white transform origin-left
        transition-transform duration-200 ease-out
        ${location.pathname === to ? 'scale-x-100' : 'scale-x-0'}
        group-hover:scale-x-100
      `}></span>
    </button>
  );

  NavLink.propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
  };

  return (
    <nav className={`
      fixed top-0 w-full z-50 transition-all duration-300
      ${isScrolled 
        ? 'bg-green-700/95 backdrop-blur-sm shadow-lg' 
        : 'bg-green-700'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-8">
            <button 
              onClick={() => navigate('/')} 
              className="
                text-xl font-bold text-white 
                hover:text-green-100 transition-colors
                flex items-center space-x-2
              "
            >
              <svg 
                className="w-8 h-8" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                />
              </svg>
              <span>Farmer Marketplace</span>
            </button>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/products">Products</NavLink>
              <NavLink to="/cart">Cart</NavLink>
            </div>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon with Badge */}
            <button 
              onClick={() => navigate('/cart')}
              className="relative p-2 text-white hover:text-green-100 transition-colors"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
              <span className="
                absolute -top-1 -right-1 
                bg-red-500 text-white text-xs 
                w-4 h-4 rounded-full
                flex items-center justify-center
              ">
                0
              </span>
            </button>

            <Button
              onClick={handleLogout}
              variant="secondary"
              size="sm"
              className="
                bg-red-500 hover:bg-red-600 
                text-white shadow-sm
                hover:shadow-md transition-all
              "
            >
              Logout
            </Button>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white hover:text-green-100 transition-colors"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                ) : (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`
          md:hidden 
          transition-all duration-300 ease-in-out
          ${isMobileMenuOpen 
            ? 'max-h-48 opacity-100' 
            : 'max-h-0 opacity-0'
          }
          overflow-hidden
        `}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/products">Products</NavLink>
            <NavLink to="/cart">Cart</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;