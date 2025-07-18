import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, Phone, User, Clock, MapPin } from 'lucide-react';
import LiveMap from '../components/tracking/LiveMap';
import TrackingTimeline from '../components/tracking/TrackingTimeline';
import { useRealTimeUpdates } from '../hooks/useRealTimeUpdates';
import { useLocation } from '../contexts/LocationContext';
import { ParcelTracking, TrackingMilestone } from '../types/tracking';

const LiveTracking: React.FC = () => {
  const { parcelId } = useParams<{ parcelId: string }>();
  const navigate = useNavigate();
  const { driverLocations } = useLocation();
  const { tracking, isConnected } = useRealTimeUpdates(parcelId);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  // Mock data for demonstration
  const [mockTracking] = useState<ParcelTracking>({
    parcelId: parcelId || '1',
    driverId: 'driver-1',
    currentLocation: {
      latitude: 19.0760,
      longitude: 72.8777,
      timestamp: new Date(),
    },
    route: [
      { latitude: 19.0760, longitude: 72.8777, timestamp: new Date() },
      { latitude: 19.0820, longitude: 72.8850, timestamp: new Date() },
      { latitude: 19.0900, longitude: 72.8900, timestamp: new Date() },
    ],
    status: 'in-transit',
    estimatedArrival: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
    milestones: [
      {
        id: '1',
        title: 'Order Accepted',
        description: 'Driver has accepted your delivery request',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        completed: true,
      },
      {
        id: '2',
        title: 'Picked Up',
        description: 'Package has been picked up from sender',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        completed: true,
      },
      {
        id: '3',
        title: 'In Transit',
        description: 'Package is on the way to destination',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        completed: true,
      },
      {
        id: '4',
        title: 'Delivered',
        description: 'Package will be delivered to recipient',
        timestamp: new Date(),
        completed: false,
      },
    ],
  });

  const currentTracking = tracking || mockTracking;
  const driverLocation = driverLocations.get(currentTracking.driverId);

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // Send message via WebSocket
      console.log('Sending message:', chatMessage);
      setChatMessage('');
    }
  };

  const formatETA = (eta: Date) => {
    const now = new Date();
    const diff = eta.getTime() - now.getTime();
    const minutes = Math.round(diff / (1000 * 60));
    
    if (minutes <= 0) return 'Arriving now';
    if (minutes < 60) return `${minutes} min`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-white">Live Tracking</h1>
              <p className="text-sm text-gray-400">Parcel ID: {parcelId}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
              isConnected 
                ? 'bg-green-900/20 text-green-400 border border-green-700'
                : 'bg-red-900/20 text-red-400 border border-red-700'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-400' : 'bg-red-400'
              }`} />
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>

            {/* ETA */}
            {currentTracking.estimatedArrival && (
              <div className="flex items-center space-x-2 bg-blue-900/20 text-blue-400 border border-blue-700 px-3 py-1 rounded-full text-sm">
                <Clock className="h-4 w-4" />
                <span>ETA: {formatETA(currentTracking.estimatedArrival)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="h-96 lg:h-[600px]">
                <LiveMap
                  tracking={currentTracking}
                  driverLocation={driverLocation}
                  pickupLocation={{ latitude: 19.0760, longitude: 72.8777, timestamp: new Date() }}
                  deliveryLocation={{ latitude: 19.0900, longitude: 72.8900, timestamp: new Date() }}
                  showTraffic={true}
                  showRoute={true}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Driver Info */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Driver Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Rajesh Kumar</p>
                    <p className="text-sm text-gray-400">★ 4.8 (127 deliveries)</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-300">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">Tata Ace - MH12AB1234</span>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => setShowChat(!showChat)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Chat</span>
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200">
                    <Phone className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <TrackingTimeline
                milestones={currentTracking.milestones}
                currentStatus={currentTracking.status}
              />
            </div>

            {/* Package Details */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Package Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Item:</span>
                  <span className="text-white">Electronics Package</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Size:</span>
                  <span className="text-white">Medium</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Value:</span>
                  <span className="text-white">₹15,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fee:</span>
                  <span className="text-green-400">₹350</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 w-80 bg-gray-800 rounded-lg border border-gray-700 shadow-xl z-50"
          >
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">Chat with Driver</h3>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="h-64 p-4 overflow-y-auto">
              <div className="space-y-3">
                <div className="bg-gray-700 rounded-lg p-3 max-w-xs">
                  <p className="text-sm text-white">I'm on my way to pick up your package!</p>
                  <p className="text-xs text-gray-400 mt-1">2:30 PM</p>
                </div>
                <div className="bg-blue-600 rounded-lg p-3 max-w-xs ml-auto">
                  <p className="text-sm text-white">Great! Thank you for the update.</p>
                  <p className="text-xs text-blue-200 mt-1">2:32 PM</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LiveTracking;