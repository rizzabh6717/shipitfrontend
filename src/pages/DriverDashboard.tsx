import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Package, DollarSign, Clock, CheckCircle, Route, Filter } from 'lucide-react';

interface AvailableParcel {
  id: string;
  from: string;
  to: string;
  item: string;
  size: 'small' | 'medium' | 'large';
  fee: number;
  distance: number;
  pickupTime: string;
  sender: {
    name: string;
    rating: number;
  };
}

interface AcceptedParcel {
  id: string;
  from: string;
  to: string;
  item: string;
  fee: number;
  status: 'accepted' | 'picked-up' | 'in-transit' | 'delivered';
  sender: {
    name: string;
    phone: string;
  };
}

const DriverDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'available' | 'accepted'>('available');
  const [tripStart, setTripStart] = useState('');
  const [tripEnd, setTripEnd] = useState('');
  const [sizeFilter, setSizeFilter] = useState<'all' | 'small' | 'medium' | 'large'>('all');

  const [availableParcels] = useState<AvailableParcel[]>([
    {
      id: '1',
      from: 'Mumbai, Maharashtra',
      to: 'Nashik, Maharashtra',
      item: 'Electronics Package',
      size: 'medium',
      fee: 320,
      distance: 165,
      pickupTime: '2:00 PM - 4:00 PM',
      sender: { name: 'Arjun Patel', rating: 4.7 }
    },
    {
      id: '2',
      from: 'Delhi, Delhi',
      to: 'Jaipur, Rajasthan',
      item: 'Important Documents',
      size: 'small',
      fee: 180,
      distance: 280,
      pickupTime: '10:00 AM - 12:00 PM',
      sender: { name: 'Sneha Gupta', rating: 4.9 }
    },
    {
      id: '3',
      from: 'Hyderabad, Telangana',
      to: 'Vijayawada, Andhra Pradesh',
      item: 'Furniture Parts',
      size: 'large',
      fee: 450,
      distance: 275,
      pickupTime: 'Flexible',
      sender: { name: 'Ravi Reddy', rating: 4.5 }
    },
    {
      id: '4',
      from: 'Ahmedabad, Gujarat',
      to: 'Surat, Gujarat',
      item: 'Textile Samples',
      size: 'medium',
      fee: 220,
      distance: 120,
      pickupTime: '3:00 PM - 6:00 PM',
      sender: { name: 'Meera Shah', rating: 4.8 }
    },
    {
      id: '5',
      from: 'Kochi, Kerala',
      to: 'Thiruvananthapuram, Kerala',
      item: 'Medical Equipment',
      size: 'small',
      fee: 160,
      distance: 200,
      pickupTime: 'Morning (8AM - 12PM)',
      sender: { name: 'Dr. Nair', rating: 4.6 }
    },
    {
      id: '6',
      from: 'Chandigarh, Punjab',
      to: 'Amritsar, Punjab',
      item: 'Books & Stationery',
      size: 'large',
      fee: 380,
      distance: 230,
      pickupTime: 'Evening (5PM - 8PM)',
      sender: { name: 'Harpreet Singh', rating: 4.4 }
    }
  ]);

  const [acceptedParcels, setAcceptedParcels] = useState<AcceptedParcel[]>([
    {
      id: 'a1',
      from: 'Pune, Maharashtra',
      to: 'Nagpur, Maharashtra',
      item: 'Medical Supplies',
      fee: 420,
      status: 'in-transit',
      sender: { name: 'Dr. Sharma', phone: '+91 98765 43210' }
    },
    {
      id: 'a2',
      from: 'Lucknow, Uttar Pradesh',
      to: 'Kanpur, Uttar Pradesh',
      item: 'Electronics',
      fee: 250,
      status: 'accepted',
      sender: { name: 'Vikash Kumar', phone: '+91 87654 32109' }
    }
  ]);

  const handleAcceptParcel = (parcelId: string) => {
    const parcel = availableParcels.find(p => p.id === parcelId);
    if (parcel) {
      const acceptedParcel: AcceptedParcel = {
        id: parcel.id,
        from: parcel.from,
        to: parcel.to,
        item: parcel.item,
        fee: parcel.fee,
        status: 'accepted',
        sender: { name: parcel.sender.name, phone: '+91 98765 00000' }
      };
      setAcceptedParcels([...acceptedParcels, acceptedParcel]);
    }
  };

  const filteredParcels = availableParcels.filter(parcel => 
    sizeFilter === 'all' || parcel.size === sizeFilter
  );

  const getSizeColor = (size: string) => {
    switch (size) {
      case 'small': return 'text-green-400 bg-green-900/20 border-green-700';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-700';
      case 'large': return 'text-red-400 bg-red-900/20 border-red-700';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-blue-400 bg-blue-900/20 border-blue-700';
      case 'picked-up': return 'text-purple-400 bg-purple-900/20 border-purple-700';
      case 'in-transit': return 'text-orange-400 bg-orange-900/20 border-orange-700';
      case 'delivered': return 'text-green-400 bg-green-900/20 border-green-700';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Driver Dashboard</h1>
          <p className="text-gray-400 mt-2">Find deliveries along your route and manage accepted parcels</p>
        </div>

        {/* Trip Route Input */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Route className="h-5 w-5 mr-2 text-blue-400" />
            Your Trip Route
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Starting Point</label>
              <input
                type="text"
                value={tripStart}
                onChange={(e) => setTripStart(e.target.value)}
                placeholder="Enter starting location (e.g., Mumbai, Maharashtra)"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Destination</label>
              <input
                type="text"
                value={tripEnd}
                onChange={(e) => setTripEnd(e.target.value)}
                placeholder="Enter destination (e.g., Pune, Maharashtra)"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === 'available'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Available Parcels ({filteredParcels.length})
          </button>
          <button
            onClick={() => setActiveTab('accepted')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === 'accepted'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Accepted Parcels ({acceptedParcels.length})
          </button>
        </div>

        {/* Available Parcels Tab */}
        {activeTab === 'available' && (
          <div>
            {/* Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">Filter by size:</span>
              </div>
              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value as any)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Sizes</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            {/* Available Parcels List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredParcels.map((parcel, index) => (
                <motion.div
                  key={parcel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors duration-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{parcel.item}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSizeColor(parcel.size)}`}>
                          {parcel.size.charAt(0).toUpperCase() + parcel.size.slice(1)}
                        </span>
                        <span className="text-yellow-400">★ {parcel.sender.rating}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">₹{parcel.fee}</div>
                      <div className="text-sm text-gray-400">{parcel.distance} km</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <MapPin className="h-4 w-4 text-green-400" />
                      <span className="text-sm">From: {parcel.from}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <MapPin className="h-4 w-4 text-red-400" />
                      <span className="text-sm">To: {parcel.to}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Clock className="h-4 w-4 text-blue-400" />
                      <span className="text-sm">Pickup: {parcel.pickupTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Sender: {parcel.sender.name}
                    </div>
                    <button
                      onClick={() => handleAcceptParcel(parcel.id)}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Accept Parcel
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Accepted Parcels Tab */}
        {activeTab === 'accepted' && (
          <div className="space-y-6">
            {acceptedParcels.map((parcel, index) => (
              <motion.div
                key={parcel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{parcel.item}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(parcel.status)}`}>
                      {parcel.status.charAt(0).toUpperCase() + parcel.status.slice(1).replace('-', ' ')}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-green-400">₹{parcel.fee}</div>
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

                <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-semibold text-white mb-2">Sender Contact</h4>
                  <div className="text-sm text-gray-300">
                    <p>Name: {parcel.sender.name}</p>
                    <p>Phone: {parcel.sender.phone}</p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  {parcel.status === 'accepted' && (
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                      Mark as Picked Up
                    </button>
                  )}
                  {parcel.status === 'picked-up' && (
                    <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                      Start Transit
                    </button>
                  )}
                  {parcel.status === 'in-transit' && (
                    <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                      Mark as Delivered
                    </button>
                  )}
                </div>
              </motion.div>
            ))}

            {acceptedParcels.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No Accepted Parcels</h3>
                <p className="text-gray-500">Accept parcels from the available list to see them here.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;