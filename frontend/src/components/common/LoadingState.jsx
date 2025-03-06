import React from 'react';
import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner';

const LoadingState = ({ 
  text = 'Loading...',
  spinnerSize = 'md',
  spinnerColor = 'green',
  className = ''
}) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center p-6 ${className}`}
      data-testid="loading-state"
    >
      <LoadingSpinner size={spinnerSize} color={spinnerColor} />
      {text && (
        <p className="mt-4 text-gray-600 text-sm font-medium">
          {text}
        </p>
      )}
    </div>
  );
};

LoadingState.propTypes = {
  text: PropTypes.string,
  spinnerSize: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  spinnerColor: PropTypes.oneOf(['green', 'blue', 'gray', 'white']),
  className: PropTypes.string
};

export default LoadingState;