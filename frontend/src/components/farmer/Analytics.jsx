import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Analytics = () => {
  const [timeFrame, setTimeFrame] = useState('week');
  const [analytics, setAnalytics] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topProducts: [],
    salesByDay: [],
    categoryDistribution: [],
    customerRetention: 0,
    growthRate: 0,
    inventoryTurnover: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeFrame]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/farmer/analytics/', {
        params: { timeFrame }
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const renderOverviewCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-6 text-white">
        <h4 className="text-emerald-100">Total Revenue</h4>
        <p className="text-3xl font-bold mt-2">{formatCurrency(analytics.totalSales)}</p>
        <span className="text-emerald-100 text-sm">
          {analytics.growthRate > 0 ? '↗️' : '↘️'} {formatPercentage(Math.abs(analytics.growthRate))} vs last period
        </span>
      </div>
      
      <div className="bg-white rounded-xl p-6 border border-emerald-100">
        <h4 className="text-emerald-800">Total Orders</h4>
        <p className="text-3xl font-bold text-emerald-600 mt-2">{analytics.totalOrders}</p>
        <span className="text-emerald-600 text-sm">
          Average {formatCurrency(analytics.averageOrderValue)} per order
        </span>
      </div>

      <div className="bg-white rounded-xl p-6 border border-emerald-100">
        <h4 className="text-emerald-800">Active Products</h4>
        <p className="text-3xl font-bold text-emerald-600 mt-2">{analytics.topProducts.length}</p>
        <span className="text-emerald-600 text-sm">+{analytics.topProducts.length - 45} new this month</span>
      </div>
    </div>
  );

  const renderSalesChart = () => (
    <div className="bg-white rounded-xl p-6 border border-emerald-100">
      <h4 className="text-lg font-semibold text-emerald-800 mb-4">Sales Overview</h4>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={analytics.salesByDay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#059669"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderTopProducts = () => (
    <div className="bg-white rounded-xl p-6 border border-emerald-100">
      <h4 className="text-lg font-semibold text-emerald-800 mb-4">Top Products</h4>
      <div className="space-y-4">
        {analytics.topProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-600">
                  {product.units_sold} units sold
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">{formatCurrency(product.revenue)}</p>
              <p className="text-sm text-gray-600">
                {formatPercentage(product.revenue / analytics.totalSales)} of total
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCategoryDistribution = () => (
    <div className="bg-white rounded-xl p-6 border border-emerald-100">
      <h4 className="text-lg font-semibold text-emerald-800 mb-4">Category Distribution</h4>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={analytics.categoryDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#059669"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            />
            <Tooltip formatter={(value) => formatCurrency(value)} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-emerald-800 mb-8">Analytics</h2>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {renderOverviewCards()}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {renderSalesChart()}
        {renderTopProducts()}
      </div>

      {renderCategoryDistribution()}
    </div>
  );
};

export default Analytics; 