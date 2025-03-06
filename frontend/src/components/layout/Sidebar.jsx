import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Close sidebar on route change
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location.pathname, isOpen, onClose]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.sidebar')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Prevent scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navigationItems = [
    { 
      name: 'Home', 
      path: '/', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
          />
        </svg>
      )
    },
    { 
      name: 'Markets', 
      path: '/markets', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
          />
        </svg>
      )
    },
    { 
      name: 'Vendors', 
      path: '/vendors', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
          />
        </svg>
      )
    }
  ];

  const authenticatedItems = [
    { 
      name: 'Favorites', 
      path: '/favorites', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
      )
    },
    { 
      name: 'Profile', 
      path: '/profile', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
          />
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div 
        className={`sidebar fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-green-600">LocalMarket</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Close sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors
                  ${location.pathname === item.path 
                    ? 'bg-green-50 text-green-600' 
                    : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}

            {isAuthenticated && (
              <>
                <div className="my-4 border-t border-gray-200" />
                {authenticatedItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors
                      ${location.pathname === item.path 
                        ? 'bg-green-50 text-green-600' 
                        : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                ))}
              </>
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          {isAuthenticated ? (
            <div className="flex items-center">
              <img
                src={user?.avatar || '/default-avatar.png'}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-3">
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                className="block w-full px-4 py-2 text-center text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="block w-full px-4 py-2 text-center text-green-600 bg-white border border-green-600 rounded-lg hover:bg-green-50"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Sidebar;
