import { useState, useEffect } from 'react';

const Login = () => {
  const [manualToken, setManualToken] = useState('');
  const [showDebug, setShowDebug] = useState(false);
  const [authStatus, setAuthStatus] = useState({
    checking: true,
    isLoggedIn: false,
    token: null
  });

  useEffect(() => {
    // Debug: Log URL parameters
    console.log('Current URL:', window.location.href);
    console.log('Search params:', window.location.search);
    
    // Check if already logged in
    const existingToken = localStorage.getItem('token');
    if (existingToken) {
      console.log('Existing token found in localStorage');
      setAuthStatus({
        checking: false,
        isLoggedIn: true,
        token: existingToken
      });
      
      // Redirect to home if not in debug mode
      if (!window.location.search.includes('debug=true')) {
        console.log('Redirecting to home page...');
        window.location.href = '/';
      }
    } else {
      // Check for token in URL
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      
      console.log('Received token in URL:', token ? 'Yes' : 'No');
      
      if (token) {
        console.log('Storing token from URL and redirecting...');
        localStorage.setItem('token', token);
        
        setAuthStatus({
          checking: false,
          isLoggedIn: true,
          token: token
        });
        
        // Clean URL and redirect
        const url = new URL(window.location.href);
        url.searchParams.delete('token');
        
        // Only redirect if not in debug mode
        if (!url.searchParams.get('debug')) {
          window.history.replaceState({}, document.title, url.pathname);
          window.location.href = '/';
        } else {
          window.history.replaceState({}, document.title, url.toString());
        }
      } else {
        console.log('No token found');
        setAuthStatus({
          checking: false,
          isLoggedIn: false,
          token: null
        });
      }
    }
    
    // Check for debug mode
    if (window.location.search.includes('debug=true')) {
      setShowDebug(true);
    }
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const hostname = window.location.hostname;
      const backendUrl = `http://${hostname}:8000`;
      
      // Include debug parameter if in debug mode
      const currentUrl = new URL(window.location.href);
      const debug = currentUrl.searchParams.get('debug');
      
      let redirectUrl = `${backendUrl}/login/google-oauth2/?next=${window.location.origin}/login`;
      if (debug) {
        redirectUrl += `?debug=${debug}`;
      }
      
      console.log('Initiating Google OAuth...');
      console.log('Backend URL:', backendUrl);
      console.log('Redirect URL:', redirectUrl);
      
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  
  const handleManualLogin = () => {
    if (manualToken.trim()) {
      console.log('Storing manual token:', manualToken);
      localStorage.setItem('token', manualToken.trim());
      setAuthStatus({
        checking: false,
        isLoggedIn: true,
        token: manualToken.trim()
      });
      
      // Only redirect if not in debug mode
      if (!showDebug) {
        window.location.href = '/';
      }
    }
  };
  
  const handleLogout = () => {
    console.log('Removing token and logging out');
    localStorage.removeItem('token');
    setAuthStatus({
      checking: false,
      isLoggedIn: false,
      token: null
    });
    setManualToken('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-green-600 mb-8">
          Welcome to Farmer&apos;s Market
        </h2>
        
        <div className="space-y-4">
          {authStatus.checking ? (
            <p className="text-center text-gray-600">Checking authentication status...</p>
          ) : authStatus.isLoggedIn ? (
            <div className="text-center">
              <p className="text-green-600 font-medium mb-4">
                You are logged in!
              </p>
              {!showDebug && (
                <p className="text-gray-600 mb-4">
                  Redirecting to home page...
                </p>
              )}
              {showDebug && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Token: {authStatus.token?.substring(0, 10)}...</p>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <p className="text-center text-gray-600 mb-6">
                Sign in to access the handwritten text extractor and more features
              </p>
              
              <button
                onClick={handleGoogleLogin}
                className="
                  w-full flex items-center justify-center space-x-3
                  px-6 py-3 border-2 border-gray-200 rounded-full
                  hover:bg-gray-50 transition-colors
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                "
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
                  />
                </svg>
                <span className="font-medium text-gray-700">Continue with Google</span>
              </button>
            </>
          )}
          
          {/* Debug section */}
          {showDebug && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Debug Options</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Manual Token Input
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={manualToken}
                      onChange={(e) => setManualToken(e.target.value)}
                      placeholder="Enter token manually"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <button
                      onClick={handleManualLogin}
                      disabled={!manualToken.trim()}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
                    >
                      Set
                    </button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  <p>Current token: {localStorage.getItem('token') ? 
                    `${localStorage.getItem('token').substring(0, 10)}...` : 
                    'None'}
                  </p>
                  <p className="mt-1">Auth status: {JSON.stringify(authStatus)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login; 