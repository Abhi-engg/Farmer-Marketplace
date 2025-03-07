import PropTypes from 'prop-types';

const Input = ({ 
  className = '', 
  error,
  ...props 
}) => {
  return (
    <div className="w-full">
      <input
        className={`
          w-full px-4 py-3 rounded-lg border border-gray-300
          focus:outline-none focus:border-green-500
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

Input.propTypes = {
  className: PropTypes.string,
  error: PropTypes.string,
};

export default Input;
