import React from 'react';
import { motion } from 'framer-motion';
import { DriverLocation } from '../../types/tracking';
import { Truck } from 'lucide-react';

interface DriverMarkerProps {
  location: DriverLocation;
  isActive?: boolean;
  onClick?: () => void;
}

const DriverMarker: React.FC<DriverMarkerProps> = ({
  location,
  isActive = false,
  onClick,
}) => {
  const getRotation = () => {
    return location.heading ? `rotate(${location.heading}deg)` : 'rotate(0deg)';
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
      className={`relative cursor-pointer ${isActive ? 'z-20' : 'z-10'}`}
      style={{
        transform: getRotation(),
      }}
    >
      {/* Pulse Animation */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.7, 0, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`absolute inset-0 rounded-full ${
          isActive ? 'bg-blue-400' : 'bg-green-400'
        }`}
      />
      
      {/* Main Marker */}
      <div
        className={`relative w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
          isActive ? 'bg-blue-500' : 'bg-green-500'
        }`}
      >
        <Truck className="h-5 w-5 text-white" />
      </div>

      {/* Speed Indicator */}
      {location.speed && location.speed > 0 && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
            {Math.round(location.speed * 3.6)} km/h
          </div>
        </div>
      )}

      {/* Accuracy Circle */}
      {location.accuracy && (
        <div
          className="absolute border border-blue-300 rounded-full opacity-30"
          style={{
            width: `${Math.max(20, location.accuracy / 10)}px`,
            height: `${Math.max(20, location.accuracy / 10)}px`,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
    </motion.div>
  );
};

export default DriverMarker;