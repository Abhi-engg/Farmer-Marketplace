import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Input = forwardRef(({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  type = 'text',
  disabled = false,
  required = false,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const baseInputStyles = `
    w-full
    px-4
    py-2
    bg-white
    border
    rounded-lg
    transition-colors
    duration-200
    placeholder-gray-400
    focus:outline-none
    focus:ring-2
    disabled:bg-gray-50
    disabled:cursor-not-allowed
    ${leftIcon ? 'pl-12' : ''}
    ${rightIcon ? 'pr-12' : ''}
  `;

  const inputStyles = error
    ? `${baseInputStyles} border-red-300 text-red-900 focus:border-red-500 focus:ring-red-200`
    : `${baseInputStyles} border-gray-300 text-gray-900 focus:border-green-500 focus:ring-green-200`;

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label className="flex text-sm font-medium text-gray-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">{leftIcon}</span>
          </div>
        )}

        <input
          ref={ref}
          type={type}
          disabled={disabled}
          required={required}
          className={`${inputStyles} ${className}`}
          {...props}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className={error ? 'text-red-500' : 'text-gray-500'}>
              {rightIcon}
            </span>
          </div>
        )}
      </div>

      {(error || helper) && (
        <p className={`text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helper}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  helper: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
};

export default Input; 