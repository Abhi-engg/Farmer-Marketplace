import { useState, useEffect, useCallback } from 'react';
import axios from '../../utils/axios';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('today');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/farmer/orders/', {
        params: { 
          status: filterStatus !== 'all' ? filterStatus : undefined,
          date_range: dateRange
        }
      });
      setOrders(response.data.orders);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, dateRange]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/farmer/orders/${orderId}/status/`, {
        status: newStatus
      });
      fetchOrders();
      // Show success notification
      showNotification('Order status updated successfully', 'success');
    } catch (error) {
      console.error('Error updating order status:', error);
      showNotification('Failed to update order status', 'error');
    }
  };

  const showNotification = (message, type) => {
    // Implement toast notification
    console.log(`${type}: ${message}`);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      processing: '🔄',
      shipped: '🚚',
      delivered: '✅',
      cancelled: '❌'
    };
    return icons[status.toLowerCase()] || '📦';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => 
    order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-3xl font-bold text-emerald-800 mb-8">Orders</h2>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'New Orders', count: 12, color: 'bg-blue-500' },
          { label: 'Processing', count: 5, color: 'bg-yellow-500' },
          { label: 'Completed', count: 28, color: 'bg-green-500' },
          { label: 'Cancelled', count: 2, color: 'bg-red-500' }
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 border border-emerald-100">
            <div className={`w-12 h-12 ${stat.color} rounded-lg mb-4 opacity-80`}></div>
            <h4 className="font-medium text-emerald-800">{stat.label}</h4>
            <p className="text-2xl font-bold text-emerald-600 mt-2">{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Order List */}
      <div className="bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden">
        {/* Add your order table here */}
      </div>
    </div>
  );
};

export default OrderManagement; 