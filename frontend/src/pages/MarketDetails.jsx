import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Map } from '../components/common/Map';

const MarketDetails = () => {
  const { marketId } = useParams();
  const [activeTab, setActiveTab] = useState('about');

  // Fetch market details
  const { data: market, isLoading, error } = useQuery({
    queryKey: ['market', marketId],
    queryFn: async () => {
      const response = await fetch(`/api/markets/${marketId}`);
      if (!response.ok) throw new Error('Failed to fetch market details');
      return response.json();
    }
  });

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
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  const handleFavorite = async () => {
    try {
      // Add to favorites API call here
      toast.success('Added to favorites!');
    } catch (error) {
      toast.error(`Failed to add to favorites: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96">
        <img
          src={market.coverImage}
          alt={market.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              {market.name}
            </h1>
            <p className="text-white text-lg mb-4">
              {market.address}
            </p>
            <div className="flex items-center space-x-4">
              <Button
                variant="primary"
                onClick={() => window.open(market.directions, '_blank')}
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              >
                Get Directions
              </Button>
              <Button
                variant="outline"
                onClick={handleFavorite}
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                }
              >
                Add to Favorites
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'about'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'vendors'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('vendors')}
          >
            Vendors
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'reviews'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">About the Market</h2>
                  <p className="text-gray-600">{market.description}</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Hours of Operation</h2>
                  <div className="space-y-2">
                    {market.hours.map((hour, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-600">{hour.day}</span>
                        <span className="text-gray-900 font-medium">{hour.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {market.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'vendors' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {market.vendors.map((vendor) => (
                  <div key={vendor.id} className="bg-white rounded-lg shadow-sm p-6">
                    <img
                      src={vendor.image}
                      alt={vendor.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-lg font-semibold mb-2">{vendor.name}</h3>
                    <p className="text-gray-600 mb-4">{vendor.description}</p>
                    <Button
                      variant="outline"
                      fullWidth
                      to={`/vendors/${vendor.id}`}
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {market.reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center mb-4">
                      <img
                        src={review.userImage}
                        alt={review.userName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="ml-3">
                        <h3 className="font-medium">{review.userName}</h3>
                        <div className="flex items-center text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'stroke-current'}`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Map */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Location</h2>
                <div className="h-64 rounded-lg overflow-hidden mb-4">
                  <Map
                    center={[market.latitude, market.longitude]}
                    zoom={15}
                    markers={[
                      {
                        position: [market.latitude, market.longitude],
                        popup: market.name,
                      },
                    ]}
                  />
                </div>
                <p className="text-gray-600 mb-4">{market.address}</p>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => window.open(market.directions, '_blank')}
                >
                  Get Directions
                </Button>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Contact</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-600">{market.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600">{market.email}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <a
                      href={market.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketDetails;
