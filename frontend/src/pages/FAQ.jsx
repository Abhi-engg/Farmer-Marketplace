import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full py-6 text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-gray-900">{question}</span>
          <svg
            className={`w-6 h-6 text-gray-500 transform transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
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
      </button>
      {isOpen && (
        <div className="pb-6">
          <p className="text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "How do I find local markets near me?",
      answer: "You can use our search feature with your location to find markets in your area. The map view also shows all markets near you with real-time updates on their operating hours."
    },
    {
      question: "Can I sell my products at these markets?",
      answer: "Yes! You'll need to register as a vendor and complete our verification process. Once approved, you can apply to sell at any of our partner markets."
    },
    {
      question: "How do I contact a vendor?",
      answer: "Visit the vendor's profile page and use the 'Contact Vendor' button. You can send messages directly through our platform."
    },
    // Add more FAQs as needed
  ];

  const categories = [
    "Getting Started",
    "Buying",
    "Selling",
    "Account",
    "Payments",
    "Support"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our platform. Can't find what you're looking for?{' '}
            <Link to="/contact" className="text-green-600 hover:text-green-700">
              Contact our support team
            </Link>
            .
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              className="px-6 py-2 rounded-full bg-white shadow-sm text-gray-600 hover:text-green-600 transition-colors"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search FAQs..."
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <svg
              className="w-6 h-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
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
          </div>
        </div>

        {/* FAQ List */}
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>

        {/* Still Need Help */}
        <div className="text-center mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Still need help?
          </h2>
          <div className="flex justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center text-green-600 hover:text-green-700"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Contact Support
            </Link>
            <Link
              to="/community"
              className="inline-flex items-center text-green-600 hover:text-green-700"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
              Community Forum
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 