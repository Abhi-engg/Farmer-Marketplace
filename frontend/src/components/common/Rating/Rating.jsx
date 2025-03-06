import React from 'react';

const Rating = ({ rating, showNumber = false }) => {
  return (
    <div className="flex items-center">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 15.585l-6.327 3.323 1.209-7.037L.172 7.332l7.046-1.024L10 0l2.782 6.308 7.046 1.024-4.71 4.539 1.209 7.037z"
              clipRule="evenodd"
            />
          </svg>
        ))}
      </div>
      {showNumber && (
        <span className="ml-2 text-gray-600">{rating.toFixed(1)}</span>
      )}
    </div>
  );
};

export default Rating; 