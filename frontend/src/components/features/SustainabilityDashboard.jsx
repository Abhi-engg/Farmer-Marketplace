import React from 'react';

const SustainabilityDashboard = ({ metrics }) => {
  const {
    carbonSaved,
    localPurchases,
    foodMilesSaved,
    plasticReduced
  } = metrics || {
    carbonSaved: 0,
    localPurchases: 0,
    foodMilesSaved: 0,
    plasticReduced: 0
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Sustainability Impact</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Carbon Footprint Card */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-green-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-green-600">{carbonSaved}kg</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">Carbon Emissions Saved</p>
        </div>

        {/* Local Purchases Card */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-blue-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-blue-600">{localPurchases}</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">Local Purchases Made</p>
        </div>

        {/* Food Miles Card */}
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-yellow-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-yellow-600">{foodMilesSaved}mi</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">Food Miles Saved</p>
        </div>

        {/* Plastic Reduction Card */}
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-purple-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-purple-600">{plasticReduced}kg</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">Plastic Packaging Reduced</p>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityDashboard;
