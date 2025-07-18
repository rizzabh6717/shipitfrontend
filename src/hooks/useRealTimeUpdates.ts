import { useState, useEffect } from 'react';
import { useLocation } from '../contexts/LocationContext';
import { ParcelTracking } from '../types/tracking';

export const useRealTimeUpdates = (parcelId?: string) => {
  const { socket, parcelTracking, subscribeToParcel, unsubscribeFromParcel } = useLocation();
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    if (socket) {
      const handleConnect = () => setIsConnected(true);
      const handleDisconnect = () => setIsConnected(false);

      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);

      setIsConnected(socket.connected);

      return () => {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
      };
    }
  }, [socket]);

  useEffect(() => {
    if (parcelId && isConnected) {
      subscribeToParcel(parcelId);
      return () => unsubscribeFromParcel(parcelId);
    }
  }, [parcelId, isConnected, subscribeToParcel, unsubscribeFromParcel]);

  useEffect(() => {
    if (parcelId && parcelTracking.has(parcelId)) {
      setLastUpdate(new Date());
    }
  }, [parcelId, parcelTracking]);

  const currentTracking = parcelId ? parcelTracking.get(parcelId) : null;

  return {
    isConnected,
    lastUpdate,
    tracking: currentTracking,
    allTracking: parcelTracking,
  };
};