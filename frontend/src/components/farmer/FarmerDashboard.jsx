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
        return (
          <div className="max-w-6xl mx-auto">
            <ProductManagement />
          </div>
        );
      case 'orders':
        return <OrderManagement />;
      case 'analytics':
        return <Analytics />;
      default:
        return <div>Coming Soon</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Sidebar */}
      <div className={`bg-white shadow-xl transition-all duration-300 border-r border-green-100 ${
        isSidebarCollapsed ? 'w-20' : 'w-72'
      }`}>
        <div className="p-6 border-b border-green-100 flex justify-between items-center">
          <h1 className={`font-bold text-emerald-800 text-xl ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
            🌾 Farm Central
          </h1>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors"
          >
            {isSidebarCollapsed ? '➡️' : '⬅️'}
          </button>
        </div>
        
        <nav className="p-4">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-4 p-4 rounded-xl mb-2 transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-emerald-100 text-emerald-800 shadow-sm font-medium'
                  : 'hover:bg-emerald-50 text-gray-600 hover:text-emerald-700'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {!isSidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Navigation */}
        <div className="bg-white shadow-sm p-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-200 rounded-xl px-5 py-3 w-72 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <button className="p-3 hover:bg-emerald-50 rounded-xl transition-colors relative">
                🔔
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>
            {farmerData && (
              <div className="flex items-center space-x-3 bg-emerald-50 rounded-xl p-2 pr-4">
                <img
                  src={farmerData.profile_image || '/default-avatar.png'}
                  alt="Profile"
                  className="w-10 h-10 rounded-lg object-cover border-2 border-emerald-200"
                />
                <div className="flex flex-col">
                  <span className="font-medium text-emerald-900">{farmerData.farm_name}</span>
                  <span className="text-sm text-emerald-600">Online</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;