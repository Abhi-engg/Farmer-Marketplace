import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import MapComponent from '../components/common/Map';
import MarketCard from '../components/common/MarketCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewType, setViewType] = useState('grid'); // 'grid' or 'map'

  const { data: markets, isLoading, error } = useQuery({
    queryKey: ['markets', searchQuery, selectedCategory],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/markets?search=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(selectedCategory)}`);
        
        if (!response.ok) {
          // Handle HTTP errors
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid response format - expected JSON');
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format - expected array');
        }

        return data;
      } catch (error) {
        console.error('Error fetching markets:', error);
        throw error;
      }
    },
    retry: 1, // Only retry once
    retryDelay: 1000, // Wait 1 second before retrying
  });

  const categories = [
    { id: 'all', name: 'All Markets' },
    { id: 'farmers', name: 'Farmers Markets' },
    { id: 'artisan', name: 'Artisan Markets' },
    { id: 'food', name: 'Food Markets' },
    { id: 'flea', name: 'Flea Markets' },
  ];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm max-w-md">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Error Loading Markets
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
          <div className="mt-6">
            <Button
              variant="primary"
              onClick={() => window.location.reload()}
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-green-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Discover Local Markets Near You
            </h1>
            <p className="text-xl mb-8 text-green-100">
              Connect with local vendors, find fresh produce, and support your community
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search markets by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-full text-gray-900 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Wave Pattern */}
        <div className="absolute bottom-0 w-full">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0V120Z" fill="#f9fafb"/>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Category Filters & View Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex overflow-x-auto pb-2 -mx-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`mx-2 px-6 py-2 rounded-full transition-colors whitespace-nowrap
                  ${selectedCategory === category.id
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-green-50'}`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-white rounded-lg p-1">
            <button
              onClick={() => setViewType('grid')}
              className={`p-2 rounded ${viewType === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-400'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewType('map')}
              className={`p-2 rounded ${viewType === 'map' ? 'bg-green-100 text-green-600' : 'text-gray-400'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Markets Display */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : viewType === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {markets?.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        ) : (
          <div className="h-[600px] rounded-lg overflow-hidden">
            <MapComponent
              markers={markets?.map(market => ({
                position: [market.latitude, market.longitude],
                popup: market.name,
                link: `/markets/${market.id}`
              }))}
            />
          </div>
        )}
      </div>

      {/* Featured Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Markets</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {markets?.filter(m => m.featured)?.slice(0, 3).map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Are you a vendor?</h2>
          <p className="text-xl mb-8 text-green-100">
            Join our platform and reach more customers in your local community
          </p>
          <Link to="/vendor/signup">
            <Button variant="white" size="lg">
              Start Selling Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;