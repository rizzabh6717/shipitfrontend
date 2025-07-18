import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { TrendingUp, MapPin, Clock, Users, Package, Route } from 'lucide-react';
import LiveMap from '../components/tracking/LiveMap';

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'deliveries' | 'revenue' | 'efficiency'>('deliveries');

  // Mock analytics data
  const deliveryStats = {
    totalDeliveries: 1247,
    completedDeliveries: 1198,
    averageDeliveryTime: 45,
    onTimePercentage: 94.2,
    totalRevenue: 156780,
    activeDrivers: 89,
  };

  const deliveryTrends = [
    { date: '2024-01-01', deliveries: 45, revenue: 5600, efficiency: 92 },
    { date: '2024-01-02', deliveries: 52, revenue: 6400, efficiency: 89 },
    { date: '2024-01-03', deliveries: 48, revenue: 5900, efficiency: 95 },
    { date: '2024-01-04', deliveries: 61, revenue: 7200, efficiency: 91 },
    { date: '2024-01-05', deliveries: 55, revenue: 6800, efficiency: 93 },
    { date: '2024-01-06', deliveries: 58, revenue: 7100, efficiency: 96 },
    { date: '2024-01-07', deliveries: 63, revenue: 7800, efficiency: 94 },
  ];

  const deliveryHeatmapData = [
    { location: { latitude: 19.0760, longitude: 72.8777 }, count: 45 },
    { location: { latitude: 19.0820, longitude: 72.8850 }, count: 32 },
    { location: { latitude: 19.0900, longitude: 72.8900 }, count: 28 },
    { location: { latitude: 19.0650, longitude: 72.8700 }, count: 38 },
    { location: { latitude: 19.0950, longitude: 72.8950 }, count: 22 },
  ];

  const driverPerformance = [
    { name: 'Rajesh Kumar', deliveries: 156, rating: 4.8, onTime: 96 },
    { name: 'Priya Sharma', deliveries: 142, rating: 4.9, onTime: 94 },
    { name: 'Amit Das', deliveries: 138, rating: 4.7, onTime: 92 },
    { name: 'Sneha Gupta', deliveries: 134, rating: 4.6, onTime: 89 },
    { name: 'Ravi Reddy', deliveries: 128, rating: 4.5, onTime: 87 },
  ];

  const deliveryTimeDistribution = [
    { timeRange: '< 30 min', count: 245, percentage: 19.6 },
    { timeRange: '30-45 min', count: 387, percentage: 31.0 },
    { timeRange: '45-60 min', count: 298, percentage: 23.9 },
    { timeRange: '60-90 min', count: 189, percentage: 15.2 },
    { timeRange: '> 90 min', count: 128, percentage: 10.3 },
  ];

  const routeOptimization = {
    originalDistance: 1250,
    optimizedDistance: 980,
    timeSaved: 45,
    fuelSaved: 15.2,
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const getMetricData = () => {
    switch (selectedMetric) {
      case 'deliveries':
        return deliveryTrends.map(d => ({ ...d, value: d.deliveries }));
      case 'revenue':
        return deliveryTrends.map(d => ({ ...d, value: d.revenue }));
      case 'efficiency':
        return deliveryTrends.map(d => ({ ...d, value: d.efficiency }));
      default:
        return deliveryTrends.map(d => ({ ...d, value: d.deliveries }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-gray-400 mt-2">Comprehensive delivery insights and performance metrics</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Total Deliveries',
              value: deliveryStats.totalDeliveries.toLocaleString(),
              change: '+12.5%',
              icon: Package,
              color: 'blue',
            },
            {
              title: 'Success Rate',
              value: `${deliveryStats.onTimePercentage}%`,
              change: '+2.1%',
              icon: TrendingUp,
              color: 'green',
            },
            {
              title: 'Avg. Delivery Time',
              value: `${deliveryStats.averageDeliveryTime} min`,
              change: '-5.2%',
              icon: Clock,
              color: 'yellow',
            },
            {
              title: 'Active Drivers',
              value: deliveryStats.activeDrivers.toString(),
              change: '+8.3%',
              icon: Users,
              color: 'purple',
            },
          ].map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{metric.title}</p>
                  <p className={`text-2xl font-bold text-${metric.color}-400`}>{metric.value}</p>
                  <p className={`text-sm ${
                    metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {metric.change} from last period
                  </p>
                </div>
                <metric.icon className={`h-8 w-8 text-${metric.color}-400`} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Delivery Trends Chart */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Delivery Trends</h3>
              <div className="flex space-x-2">
                {['deliveries', 'revenue', 'efficiency'].map((metric) => (
                  <button
                    key={metric}
                    onClick={() => setSelectedMetric(metric as any)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      selectedMetric === metric
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {metric.charAt(0).toUpperCase() + metric.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={getMetricData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Delivery Time Distribution */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-6">Delivery Time Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deliveryTimeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {deliveryTimeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Driver Performance */}
          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-6">Top Driver Performance</h3>
            <div className="space-y-4">
              {driverPerformance.map((driver, index) => (
                <motion.div
                  key={driver.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {driver.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{driver.name}</p>
                      <p className="text-sm text-gray-400">{driver.deliveries} deliveries</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-400">Rating</p>
                        <p className="font-semibold text-yellow-400">★ {driver.rating}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-400">On Time</p>
                        <p className="font-semibold text-green-400">{driver.onTime}%</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Route Optimization */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Route className="h-5 w-5 mr-2 text-blue-400" />
              Route Optimization
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Original Distance</span>
                <span className="text-white font-semibold">{routeOptimization.originalDistance} km</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Optimized Distance</span>
                <span className="text-green-400 font-semibold">{routeOptimization.optimizedDistance} km</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Time Saved</span>
                <span className="text-blue-400 font-semibold">{routeOptimization.timeSaved} min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Fuel Saved</span>
                <span className="text-purple-400 font-semibold">{routeOptimization.fuelSaved} L</span>
              </div>
              
              <div className="mt-6 p-4 bg-green-900/20 border border-green-700 rounded-lg">
                <p className="text-green-400 font-semibold">
                  {Math.round(((routeOptimization.originalDistance - routeOptimization.optimizedDistance) / routeOptimization.originalDistance) * 100)}% 
                  efficiency improvement
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Through AI-powered route optimization
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Heatmap */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-red-400" />
            Delivery Heatmap
          </h3>
          <div className="h-96">
            <LiveMap
              className="rounded-lg overflow-hidden"
              showTraffic={false}
              showRoute={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;