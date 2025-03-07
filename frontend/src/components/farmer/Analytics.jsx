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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-gray-600 text-sm mb-2">Total Sales</h3>
        <p className="text-2xl font-bold text-green-600">
          {formatCurrency(analytics.totalSales)}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {analytics.growthRate > 0 ? '↗️' : '↘️'} {formatPercentage(Math.abs(analytics.growthRate))} vs last period
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-gray-600 text-sm mb-2">Total Orders</h3>
        <p className="text-2xl font-bold text-blue-600">{analytics.totalOrders}</p>
        <p className="text-sm text-gray-500 mt-2">
          Average {formatCurrency(analytics.averageOrderValue)} per order
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-gray-600 text-sm mb-2">Customer Retention</h3>
        <p className="text-2xl font-bold text-purple-600">
          {formatPercentage(analytics.customerRetention)}
        </p>
        <p className="text-sm text-gray-500 mt-2">Returning customers</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-gray-600 text-sm mb-2">Inventory Turnover</h3>
        <p className="text-2xl font-bold text-orange-600">
          {analytics.inventoryTurnover.toFixed(1)}x
        </p>
        <p className="text-sm text-gray-500 mt-2">Stock rotation rate</p>
      </div>
    </div>
  );

  const renderSalesChart = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4">Sales Trend</h3>
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
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4">Top Products</h3>
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Analytics Dashboard</h2>
        <select
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <div className="space-y-6">
        {/* Overview Cards */}
        {renderOverviewCards()}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderSalesChart()}
          {renderCategoryDistribution()}
        </div>

        {/* Top Products */}
        {renderTopProducts()}
      </div>
    </div>
  );
};

export default Analytics; 