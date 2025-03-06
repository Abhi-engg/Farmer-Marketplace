import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
  className = '',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  const modalContent = (
    <CSSTransition
      in={isOpen}
      timeout={200}
      classNames="modal"
      unmountOnExit
    >
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="flex min-h-screen items-center justify-center p-4">
          <div
            className={`
              relative
              bg-white
              w-full
              ${sizes[size]}
              rounded-xl
              shadow-xl
              transform
              transition-all
              ${className}
            `}
          >
            {/* Header */}
            {(title || showClose) && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                {title && (
                  <h3 className="text-lg font-semibold text-gray-900">
                    {title}
                  </h3>
                )}
                {showClose && (
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="px-6 py-4">{children}</div>
          </div>
        </div>
      </div>
    </CSSTransition>
  );

  return createPortal(modalContent, document.body);
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  showClose: PropTypes.bool,
  className: PropTypes.string,
};

export default Modal; 