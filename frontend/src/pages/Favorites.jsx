import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import MarketCard from '../components/common/MarketCard';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';

const Favorites = () => {
  const [activeTab, setActiveTab] = useState('markets');
  
  const queryClient = useQueryClient();

  // Fetch favorites data
  const { data: favorites, isLoading, error } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const response = await fetch('/api/favorites');
      if (!response.ok) throw new Error('Failed to fetch favorites');
      return response.json();
    }
  });

  const handleRemoveFavorite = async (type, id) => {
    try {
      const response = await fetch(`/api/favorites/${type}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove favorite');
      // Invalidate and refetch favorites
      queryClient.invalidateQueries(['favorites']);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const EmptyState = ({ type }) => (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
        {type === 'markets' ? (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
            />
          </svg>
        ) : (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
            />
          </svg>
        )}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No favorite {type} yet
      </h3>
      <p className="text-gray-600 mb-6">
        Start exploring and save your favorite {type} here!
      </p>
      <Link
        to={type === 'markets' ? '/markets' : '/products'}
        className="inline-flex items-center text-green-600 hover:text-green-700"
      >
        <span>Explore {type}</span>
        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Favorites
            </h1>
            <p className="text-gray-600">
              Keep track of your favorite markets and products
            </p>
          </div>
          
          {/* Quick Actions */}
          <div className="mt-4 md:mt-0 flex gap-4">
            <Button
              variant="outline"
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="flex">
            <button
              className={`flex-1 px-6 py-4 text-sm font-medium rounded-tl-lg transition-colors
                ${activeTab === 'markets' 
                  ? 'bg-green-50 text-green-600 border-b-2 border-green-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('markets')}
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                  />
                </svg>
                Markets ({favorites?.markets?.length || 0})
              </span>
            </button>
            <button
              className={`flex-1 px-6 py-4 text-sm font-medium rounded-tr-lg transition-colors
                ${activeTab === 'products' 
                  ? 'bg-green-50 text-green-600 border-b-2 border-green-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('products')}
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                  />
                </svg>
                Products ({favorites?.products?.length || 0})
              </span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'markets' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {!favorites?.markets?.length ? (
                <EmptyState type="markets" />
              ) : (
                favorites.markets.map((market) => (
                  <MarketCard 
                    key={market.id} 
                    market={market}
                    onRemove={() => handleRemoveFavorite('markets', market.id)}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'products' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {!favorites?.products?.length ? (
                <EmptyState type="products" />
              ) : (
                favorites.products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    onRemove={() => handleRemoveFavorite('products', product.id)}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
