import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const VendorProfile = () => {
  const { vendorId } = useParams();
  const [activeTab, setActiveTab] = useState('products');

  // Fetch vendor details
  const { data: vendor, isLoading, error } = useQuery({
    queryKey: ['vendor', vendorId],
    queryFn: async () => {
      const response = await fetch(`/api/vendors/${vendorId}`);
      if (!response.ok) throw new Error('Failed to fetch vendor details');
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

  const handleContact = () => {
    toast.success('Message sent to vendor!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Vendor Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
            {/* Vendor Image */}
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              <img
                src={vendor.image}
                alt={vendor.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Vendor Info */}
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {vendor.name}
              </h1>
              <p className="text-gray-600 mb-4 max-w-2xl">
                {vendor.description}
              </p>
              
              {/* Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {vendor.productsCount}
                  </div>
                  <div className="text-sm text-gray-500">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {vendor.marketsCount}
                  </div>
                  <div className="text-sm text-gray-500">Markets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {vendor.rating}
                  </div>
                  <div className="text-sm text-gray-500">Rating</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <Button
                  variant="primary"
                  onClick={handleContact}
                  leftIcon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  }
                >
                  Contact Vendor
                </Button>
                <Button
                  variant="outline"
                  leftIcon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  }
                >
                  Save Vendor
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'products'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'markets'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('markets')}
          >
            Markets
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
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendor.products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-3">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 font-bold">${product.price}</span>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'markets' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendor.markets.map((market) => (
              <div key={market.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <img
                  src={market.image}
                  alt={market.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{market.name}</h3>
                  <p className="text-gray-600 mb-3">{market.address}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {market.schedule}
                    </div>
                    <Button variant="outline" size="sm">
                      Visit Market
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {vendor.reviews.map((review) => (
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
                      <span className="ml-2 text-sm text-gray-500">
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorProfile;
