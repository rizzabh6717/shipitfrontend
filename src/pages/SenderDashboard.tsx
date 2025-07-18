import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Plus, Clock, CheckCircle, Truck, MapPin, User, Phone } from 'lucide-react';

interface Parcel {
  id: string;
  from: string;
  to: string;
  item: string;
  size: 'small' | 'medium' | 'large';
  fee: number;
  status: 'pending' | 'accepted' | 'in-transit' | 'delivered';
  createdAt: Date;
  driver?: {
    name: string;
    vehicle: string;
    phone: string;
    rating: number;
  };
}

const SenderDashboard: React.FC = () => {
  const [parcels, setParcels] = useState<Parcel[]>([
    {
      id: '1',
      from: 'Mumbai, Maharashtra',
      to: 'Pune, Maharashtra',
      item: 'Electronics Package',
      size: 'medium',
      fee: 350,
      status: 'accepted',
      createdAt: new Date('2024-01-15'),
      driver: {
        name: 'Rajesh Kumar',
        vehicle: 'Tata Ace - MH12AB1234',
        phone: '+91 98765 43210',
        rating: 4.8
      }
    },
    {
      id: '2',
      from: 'Delhi, Delhi',
      to: 'Gurgaon, Haryana',
      item: 'Important Documents',
      size: 'small',
      fee: 150,
      status: 'pending',
      createdAt: new Date('2024-01-16')
    },
    {
      id: '3',
      from: 'Bangalore, Karnataka',
      to: 'Chennai, Tamil Nadu',
      item: 'Furniture Parts',
      size: 'large',
      fee: 480,
      status: 'delivered',
      createdAt: new Date('2024-01-10'),
      driver: {
        name: 'Priya Sharma',
        vehicle: 'Mahindra Bolero - KA05CD5678',
        phone: '+91 87654 32109',
        rating: 4.9
      }
    },
    {
      id: '4',
      from: 'Kolkata, West Bengal',
      to: 'Bhubaneswar, Odisha',
      item: 'Medical Supplies',
      size: 'medium',
      fee: 280,
      status: 'in-transit',
      createdAt: new Date('2024-01-12'),
      driver: {
        name: 'Amit Das',
        vehicle: 'Maruti Eeco - WB07EF9012',
        phone: '+91 76543 21098',
        rating: 4.7
      }
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-900/20 border-yellow-700';
      case 'accepted': return 'text-blue-400 bg-blue-900/20 border-blue-700';
      case 'in-transit': return 'text-purple-400 bg-purple-900/20 border-purple-700';
      case 'delivered': return 'text-green-400 bg-green-900/20 border-green-700';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'accepted': return CheckCircle;
      case 'in-transit': return Truck;
      case 'delivered': return CheckCircle;
      default: return Package;
    }
  };

  const stats = {
    total: parcels.length,
    pending: parcels.filter(p => p.status === 'pending').length,
    active: parcels.filter(p => p.status === 'accepted' || p.status === 'in-transit').length,
    delivered: parcels.filter(p => p.status === 'delivered').length
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Sender Dashboard</h1>
            <p className="text-gray-400 mt-2">Manage your deliveries and track packages</p>
          </div>
          <Link
            to="/create-parcel"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create New Parcel</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Parcels', value: stats.total, color: 'blue' },
            { label: 'Pending', value: stats.pending, color: 'yellow' },
            { label: 'Active', value: stats.active, color: 'purple' },
            { label: 'Delivered', value: stats.delivered, color: 'green' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</p>
                </div>
                <Package className={`h-8 w-8 text-${stat.color}-400`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Parcels List */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Your Parcels</h2>
          </div>
          <div className="divide-y divide-gray-700">
            {parcels.map((parcel, index) => {
              const StatusIcon = getStatusIcon(parcel.status);
              return (
                <motion.div
                  key={parcel.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 hover:bg-gray-700/50 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <StatusIcon className="h-5 w-5 text-gray-400" />
                        <h3 className="text-lg font-semibold text-white">{parcel.item}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(parcel.status)}`}>
                          {parcel.status.charAt(0).toUpperCase() + parcel.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-gray-300">
                          <MapPin className="h-4 w-4 text-green-400" />
                          <span className="text-sm">From: {parcel.from}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-300">
                          <MapPin className="h-4 w-4 text-red-400" />
                          <span className="text-sm">To: {parcel.to}</span>
                        </div>
                      </div>

                      {parcel.driver && (
                        <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
                          <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
                            <Truck className="h-4 w-4 mr-2 text-blue-400" />
                            Driver Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-300">{parcel.driver.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Truck className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-300">{parcel.driver.vehicle}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-300">{parcel.driver.phone}</span>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center space-x-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm text-gray-300">{parcel.driver.rating}/5.0</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right ml-6">
                      <div className="text-2xl font-bold text-green-400">₹{parcel.fee}</div>
                      <div className="text-sm text-gray-400">
                        {parcel.createdAt.toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {parcel.size} package
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SenderDashboard;