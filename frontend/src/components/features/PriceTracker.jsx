import React, { useState } from 'react';

const PriceTracker = ({ product }) => {
  const [alertPrice, setAlertPrice] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsTracking(true);
    setNotifications(prev => [...prev, {
      id: Date.now(),
      message: `Price alert set for ${product.name} at $${alertPrice}`
    }]);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Price Tracker</h2>

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{product?.name}</h3>
            <p className="text-gray-600">Current Price: ${product?.currentPrice}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Lowest: ${product?.lowestPrice}</p>
            <p className="text-sm text-gray-500">Highest: ${product?.highestPrice}</p>
          </div>
        </div>

        {/* Price History Graph Placeholder */}
        <div className="h-40 bg-gray-100 rounded-lg mt-4 flex items-center justify-center">
          <span className="text-gray-500">Price History Graph</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="number"
            value={alertPrice}
            onChange={(e) => setAlertPrice(e.target.value)}
            placeholder="Set alert price"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            step="0.01"
            min="0"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            {isTracking ? 'Tracking...' : 'Set Alert'}
          </button>
        </div>
      </form>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold mb-2">Active Alerts</h3>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm flex justify-between items-center"
            >
              <span>{notification.message}</span>
              <button
                onClick={() => setNotifications(prev => 
                  prev.filter(n => n.id !== notification.id)
                )}
                className="text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriceTracker;
