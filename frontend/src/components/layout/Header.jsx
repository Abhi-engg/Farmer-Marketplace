import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Menu Button & Logo */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="p-2 mr-2 rounded-lg text-gray-600 hover:bg-gray-100 md:hidden"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-green-600">LocalMarket</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-green-600">
              Markets
            </Link>
            <Link to="/vendors" className="text-gray-600 hover:text-green-600">
              Vendors
            </Link>
            <Link to="/sustainability" className="text-gray-600 hover:text-green-600">
              Sustainability
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/favorites" className="text-gray-600 hover:text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>

            {isAuthenticated ? (
              <Button
                variant="ghost"
                onClick={logout}
              >
                Logout
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

Header.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
};

export default Header;
