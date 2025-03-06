import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <svg
            className="w-64 h-64 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="text-3xl font-semibold text-gray-900">Page Not Found</h2>
          <p className="text-gray-600 max-w-sm mx-auto">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Button
              variant="primary"
              onClick={() => window.history.back()}
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              }
            >
              Go Back
            </Button>
            <Link to="/">
              <Button
                variant="outline"
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                }
              >
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Help Links */}
          <div className="mt-12 space-x-4 text-sm">
            <Link to="/contact" className="text-green-600 hover:text-green-700">
              Contact Support
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/faq" className="text-green-600 hover:text-green-700">
              FAQs
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/sitemap" className="text-green-600 hover:text-green-700">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
