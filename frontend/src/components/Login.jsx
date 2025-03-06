import React from 'react';
import './styles.css';

const Login = () => {
  const handleGoogleLogin = async () => {
    try {
      // Get the current hostname (localhost or 127.0.0.1)
      const hostname = window.location.hostname;
      const backendUrl = `http://${hostname}:8000`;
      
      // Direct redirect to Google OAuth
      window.location.href = `${backendUrl}/login/google-oauth2/`;
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="container">
      <div className="login-container">
        <h2 className="login-title">Welcome Back!</h2>
        <button className="google-button" onClick={handleGoogleLogin}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
            />
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login; 