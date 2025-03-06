import React, { Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';

// Auth Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Lazy loaded components with loading fallbacks
const HomePage = React.lazy(() => import('./pages/HomePage'));
const MarketDetails = React.lazy(() => import('./pages/MarketDetails'));
const VendorProfile = React.lazy(() => import('./pages/VendorProfile'));
const Favorites = React.lazy(() => import('./pages/Favorites'));
const Login = React.lazy(() => import('./pages/Auth/Login'));
const Signup = React.lazy(() => import('./pages/Auth/Signup'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const FAQ = React.lazy(() => import('./pages/FAQ'));

// Create a client for React Query with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      suspense: false,
      useErrorBoundary: true,
    },
  },
});

// Layout wrapper component
const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <ErrorBoundary>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[50vh]">
              <LoadingSpinner size="lg" />
            </div>
          }>
            {children}
          </Suspense>
        </ErrorBoundary>
      </main>

      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/markets/:marketId" element={<MarketDetails />} />
                <Route path="/vendors/:vendorId" element={<VendorProfile />} />
                <Route path="/faq" element={<FAQ />} />
                
                {/* Auth Routes */}
                <Route 
                  path="/login" 
                  element={
                    <PublicOnlyRoute>
                      <Login />
                    </PublicOnlyRoute>
                  } 
                />
                <Route 
                  path="/signup" 
                  element={
                    <PublicOnlyRoute>
                      <Signup />
                    </PublicOnlyRoute>
                  } 
                />
                
                {/* Protected Routes */}
                <Route
                  path="/favorites"
                  element={
                    <ProtectedRoute>
                      <Favorites />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>

            {/* Global Toast Notifications */}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 5000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  borderRadius: '8px',
                },
                success: {
                  icon: '✅',
                  style: {
                    background: '#059669',
                  },
                },
                error: {
                  icon: '❌',
                  style: {
                    background: '#DC2626',
                  },
                },
              }}
            />
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

// Public Only Route Component (for login/signup)
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default App;
