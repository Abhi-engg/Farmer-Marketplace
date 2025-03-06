import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';

// Create context
const AuthContext = createContext(null);

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Verify token with backend
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Clear invalid token
        localStorage.removeItem('authToken');
      }
    } catch (err) {
      console.error('Auth status check failed:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token
      localStorage.setItem('authToken', data.token);
      
      // Set user data
      setUser(data.user);
      
      // Show success message
      toast.success('Successfully logged in!');

      return data;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup
  const signup = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Save token
      localStorage.setItem('authToken', data.token);
      
      // Set user data
      setUser(data.user);
      
      // Show success message
      toast.success('Account created successfully!');

      return data;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Call logout endpoint if needed
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      // Clear local storage
      localStorage.removeItem('authToken');
      
      // Clear user data
      setUser(null);
      
      // Show success message
      toast.success('Successfully logged out!');
    } catch (err) {
      console.error('Logout failed:', err);
      toast.error('Logout failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      setUser(prevUser => ({
        ...prevUser,
        ...updates
      }));

      toast.success('Profile updated successfully!');
      return data;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
