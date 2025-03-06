import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const Navbar = () => {
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

  return (
    <nav className="bg-green-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold">Farmer Marketplace</h1>
            <button 
              onClick={() => navigate('/')} 
              className={`nav-button ${location.pathname === '/' ? 'bg-green-600' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => navigate('/products')} 
              className={`nav-button ${location.pathname === '/products' ? 'bg-green-600' : ''}`}
            >
              Products
            </button>
            <button 
              onClick={() => navigate('/cart')} 
              className={`nav-button ${location.pathname === '/cart' ? 'bg-green-600' : ''}`}
            >
              Cart
            </button>
          </div>
          
          <button 
            onClick={handleLogout} 
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;