import { useState } from 'react';
import { 
  UserIcon, 
  ShoppingBagIcon, 
  ChartBarIcon, 
  CubeIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import ProfileManagement from './ProfileManagement';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import Analytics from './Analytics';

const FarmerDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'products', name: 'Products', icon: CubeIcon },
    { id: 'orders', name: 'Orders', icon: ShoppingBagIcon },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileManagement />;
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'analytics':
        return <Analytics />;
      default:
        return <ProfileManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg h-screen fixed">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-green-600">Farmer Dashboard</h2>
          </div>
          <nav className="mt-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-6 py-4 text-lg ${
                  activeTab === tab.id
                    ? 'bg-green-50 text-green-600 border-r-4 border-green-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-6 h-6 mr-3" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard; 