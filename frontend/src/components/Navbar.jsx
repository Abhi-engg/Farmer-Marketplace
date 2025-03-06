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
    <div className="navbar">
      <div className="nav-links">
        <button 
          onClick={() => navigate('/')} 
          className={`nav-button ${location.pathname === '/' ? 'active' : ''}`}
        >
          Home
        </button>
        <button 
          onClick={handleLogout} 
          className="logout-nav-button"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;