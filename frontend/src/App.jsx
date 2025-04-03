import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Home from './components/Home';
import Navbar from './components/Navbar';
import FarmerDashboard from './components/farmer/FarmerDashboard';
import ProductListings from './components/products/ProductListings';
import ProductDetails from './components/products/ProductDetails';
import ShoppingCart from './components/cart/ShoppingCart';
import TextExtractor from './components/TextExtractor';
// Import Shop Components
import ShopPage from './shop/ShopPage';
import PropTypes from 'prop-types';

// Create a wrapper component to handle navbar visibility
const NavbarWrapper = ({ children }) => {
  const location = useLocation();
  const hideNavbarPaths = ['/farmer/dashboard', '/login', '/shop']; // Added /shop to hide default navbar
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      {children}
    </>
  );
};

NavbarWrapper.propTypes = {
  children: PropTypes.node.isRequired
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/check-auth/', {
        withCredentials: true
      });
      setIsAuthenticated(response.data.isAuthenticated);
      // If authenticated and on login page, redirect to home
      if (response.data.isAuthenticated && window.location.pathname === '/login') {
        window.location.href = '/';
      }
    } catch (error) {
      setIsAuthenticated(false);
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <NavbarWrapper>
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
          />
          <Route 
            path="/" 
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/farmer/dashboard" 
            element={isAuthenticated ? <FarmerDashboard /> : <Navigate to="/login" />}  
          />
          <Route 
            path="/products" 
            element={isAuthenticated ? <ProductListings /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/products/:id" 
            element={isAuthenticated ? <ProductDetails /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/cart" 
            element={isAuthenticated ? <ShoppingCart /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/text-extractor" 
            element={isAuthenticated ? <TextExtractor /> : <Navigate to="/login" />} 
          />
          {/* Add Shop Routes */}
          <Route 
            path="/shop/*" 
            element={isAuthenticated ? <ShopPage /> : <Navigate to="/login" />} 
          />
        </Routes>
      </NavbarWrapper>
    </Router>
  );
}

export default App;
