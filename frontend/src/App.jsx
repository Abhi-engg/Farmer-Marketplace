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

// Lazy loaded components
const HomePage = React.lazy(() => import('./pages/HomePage'));
const MarketDetails = React.lazy(() => import('./pages/MarketDetails'));
const VendorProfile = React.lazy(() => import('./pages/VendorProfile'));
const Favorites = React.lazy(() => import('./pages/Favorites'));
const Login = React.lazy(() => import('./pages/Auth/Login'));
const Signup = React.lazy(() => import('./pages/Auth/Signup'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Header onMenuClick={() => setIsSidebarOpen(true)} />
              
              <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
              />
              
              <main className="flex-grow bg-gray-50">
                <ErrorBoundary>
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/markets/:marketId" element={<MarketDetails />} />
                      <Route path="/vendors/:vendorId" element={<VendorProfile />} />
                      
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

                      <Route
                        path="/MarketDetails"
                        element={
                          <ProtectedRoute>
                            <MarketDetails />
                          </ProtectedRoute>
                        }
                        />
                      

                      {/* 404 Route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </ErrorBoundary>
              </main>

              <Footer />
            </div>
          </Router>

          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Only Route Component
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default App;
