import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Select = forwardRef(({
  label,
  options,
  error,
  helper,
  disabled = false,
  required = false,
  placeholder = 'Select an option',
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const baseSelectStyles = `
    w-full
    px-4
    py-2
    bg-white
    border
    rounded-lg
    transition-colors
    duration-200
    appearance-none
    focus:outline-none
    focus:ring-2
    disabled:bg-gray-50
    disabled:cursor-not-allowed
    pr-10
  `;

  const selectStyles = error
    ? `${baseSelectStyles} border-red-300 text-red-900 focus:border-red-500 focus:ring-red-200`
    : `${baseSelectStyles} border-gray-300 text-gray-900 focus:border-green-500 focus:ring-green-200`;

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label className="flex text-sm font-medium text-gray-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          disabled={disabled}
          required={required}
          className={`${selectStyles} ${className}`}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className={`h-5 w-5 ${error ? 'text-red-500' : 'text-gray-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {(error || helper) && (
        <p className={`text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helper}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

Select.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  error: PropTypes.string,
  helper: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
};

export default Select; 