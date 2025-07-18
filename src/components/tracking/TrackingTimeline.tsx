import React from 'react';
import { motion } from 'framer-motion';
import { TrackingMilestone } from '../../types/tracking';
import { CheckCircle, Clock, MapPin, Package, Truck } from 'lucide-react';

interface TrackingTimelineProps {
  milestones: TrackingMilestone[];
  currentStatus: string;
}

const TrackingTimeline: React.FC<TrackingTimelineProps> = ({
  milestones,
  currentStatus,
}) => {
  const getStatusIcon = (milestone: TrackingMilestone) => {
    if (milestone.completed) {
      return CheckCircle;
    }
    
    switch (milestone.title.toLowerCase()) {
      case 'order accepted':
        return CheckCircle;
      case 'picked up':
        return Package;
      case 'in transit':
        return Truck;
      case 'delivered':
        return MapPin;
      default:
        return Clock;
    }
  };

  const getStatusColor = (milestone: TrackingMilestone, index: number) => {
    if (milestone.completed) {
      return 'text-green-400 bg-green-900/20 border-green-700';
    }
    
    // Current step
    const currentIndex = milestones.findIndex(m => !m.completed);
    if (index === currentIndex) {
      return 'text-blue-400 bg-blue-900/20 border-blue-700';
    }
    
    return 'text-gray-400 bg-gray-900/20 border-gray-700';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Delivery Progress</h3>
      
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-700" />
        
        {milestones.map((milestone, index) => {
          const StatusIcon = getStatusIcon(milestone);
          const isLast = index === milestones.length - 1;
          
          return (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex items-start space-x-4 ${!isLast ? 'pb-6' : ''}`}
            >
              {/* Icon */}
              <div
                className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${getStatusColor(milestone, index)}`}
              >
                <StatusIcon className="h-5 w-5" />
                
                {/* Pulse animation for current step */}
                {!milestone.completed && index === milestones.findIndex(m => !m.completed) && (
                  <motion.div
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 rounded-full bg-blue-400"
                  />
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`font-semibold ${milestone.completed ? 'text-white' : 'text-gray-300'}`}>
                    {milestone.title}
                  </h4>
                  {milestone.timestamp && (
                    <span className="text-sm text-gray-400">
                      {new Date(milestone.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </div>
                
                <p className={`text-sm mt-1 ${milestone.completed ? 'text-gray-300' : 'text-gray-400'}`}>
                  {milestone.description}
                </p>
                
                {milestone.location && (
                  <div className="flex items-center space-x-1 mt-2 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    <span>
                      {milestone.location.latitude.toFixed(4)}, {milestone.location.longitude.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackingTimeline;