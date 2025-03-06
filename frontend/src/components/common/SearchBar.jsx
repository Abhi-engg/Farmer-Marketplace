import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search...",
  shortcutKey = 'k',
  onFocus,
  onBlur,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if Ctrl/Cmd + shortcutKey is pressed
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === shortcutKey.toLowerCase()) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Close search on escape
      if (e.key === 'Escape' && isFocused) {
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcutKey, isFocused]);

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <div className={`relative group ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`
          w-full
          px-4
          py-2.5
          pl-11
          pr-12
          rounded-lg
          border
          bg-white
          transition-all
          duration-200
          placeholder-gray-400
          ${isFocused
            ? 'border-green-500 ring-2 ring-green-100 shadow-sm'
            : 'border-gray-300 hover:border-gray-400'
          }
          focus:outline-none
        `}
        aria-label="Search"
      />

      {/* Search Icon */}
      <svg
        className={`
          absolute
          left-3.5
          top-1/2
          transform
          -translate-y-1/2
          transition-colors
          duration-200
          ${isFocused ? 'text-green-500' : 'text-gray-400'}
        `}
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      {/* Keyboard Shortcut Badge */}
      <div
        className={`
          absolute
          right-3
          top-1/2
          transform
          -translate-y-1/2
          flex
          items-center
          px-1.5
          py-0.5
          rounded-md
          border
          text-xs
          font-medium
          select-none
          transition-colors
          duration-200
          ${isFocused
            ? 'border-green-200 text-green-500 bg-green-50'
            : 'border-gray-200 text-gray-400 bg-gray-50'
          }
        `}
      >
        <span className="text-xs">
          {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
        </span>
        <span className="ml-1 uppercase">{shortcutKey}</span>
      </div>

      {/* Focus Ring Animation */}
      <div
        className={`
          absolute
          inset-0
          rounded-lg
          transition-opacity
          duration-200
          pointer-events-none
          ${isFocused ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          background: 'linear-gradient(to right, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))'
        }}
      />
    </div>
  );
};

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  shortcutKey: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
};

export default SearchBar;
