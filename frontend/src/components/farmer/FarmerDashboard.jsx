import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import ProfileManagement from './ProfileManagement';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import Analytics from './Analytics';

const FarmerDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [farmerData, setFarmerData] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFarmerData();
    fetchNotifications();
  }, []);

  const fetchFarmerData = async () => {
    try {
      const response = await axios.get('/api/farmer/profile/');
      setFarmerData(response.data);
    } catch (error) {
      console.error('Error fetching farmer data:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/farmer/notifications/');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const menuItems = [
    { id: 'profile', icon: '👤', label: 'Profile' },
    { id: 'products', icon: '📦', label: 'Products' },
    { id: 'orders', icon: '📑', label: 'Orders' },
    { id: 'analytics', icon: '📊', label: 'Analytics' },
    { id: 'messages', icon: '💬', label: 'Messages' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
    { id: 'help', icon: '📖', label: 'Help' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileManagement farmerData={farmerData} onUpdate={fetchFarmerData} />;
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'analytics':
        return <Analytics />;
      default:
        return <div>Coming Soon</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className={`font-bold text-green-800 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
            Farmer Dashboard
          </h1>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isSidebarCollapsed ? '➡️' : '⬅️'}
          </button>
        </div>
        
        <nav className="p-4">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${
                activeTab === item.id
                  ? 'bg-green-100 text-green-800'
                  : 'hover:bg-gray-100'
              }`}
            >
              <span>{item.icon}</span>
              {!isSidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Navigation */}
        <div className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="🔍 Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded-lg px-4 py-2 w-64"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                🔔
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>
            {farmerData && (
              <div className="flex items-center space-x-2">
                <img
                  src={farmerData.profile_image || '/default-avatar.png'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-medium">{farmerData.farm_name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;