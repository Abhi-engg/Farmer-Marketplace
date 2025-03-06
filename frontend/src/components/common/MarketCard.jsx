import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { formatDistance } from 'date-fns';

const MarketCard = ({ market, onFavorite }) => {
  const isOpen = () => {
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const time = now.getHours() * 100 + now.getMinutes();
    
    const hours = market.hours[day];
    if (!hours) return false;
    
    const [open, close] = hours.split('-').map(t => parseInt(t.replace(':', '')));
    return time >= open && time <= close;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative h-48">
        <img
          src={market.image}
          alt={market.name}
          className="w-full h-full object-cover"
        />
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onFavorite(market.id);
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
        >
          <svg
            className={`w-5 h-5 ${market.isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
        {/* Status Badge */}
        <div className="absolute bottom-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isOpen()
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {isOpen() ? 'Open Now' : 'Closed'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Link to={`/markets/${market.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-green-600">
            {market.name}
          </h3>
        </Link>
        
        {/* Location & Distance */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>{market.location}</span>
          {market.distance && (
            <span className="ml-2 text-gray-400">
              • {formatDistance(0, market.distance)} away
            </span>
          )}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {market.categories.map((category) => (
            <span
              key={category}
              className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
            >
              {category}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-yellow-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="ml-1 text-gray-600">{market.rating} ({market.reviewCount})</span>
          </div>
          <div className="flex items-center text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span>{market.vendorCount} vendors</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Next market day: {market.nextMarketDay}
          </div>
          <Link
            to={`/markets/${market.id}`}
            className="text-sm font-medium text-green-600 hover:text-green-700"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

MarketCard.propTypes = {
  market: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    distance: PropTypes.number,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    rating: PropTypes.number.isRequired,
    reviewCount: PropTypes.number.isRequired,
    vendorCount: PropTypes.number.isRequired,
    nextMarketDay: PropTypes.string.isRequired,
    hours: PropTypes.object.isRequired,
    isFavorite: PropTypes.bool.isRequired,
  }).isRequired,
  onFavorite: PropTypes.func.isRequired,
};

export default MarketCard;

