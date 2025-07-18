import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { DriverLocation, ParcelTracking, NotificationPreferences } from '../types/tracking';
import toast from 'react-hot-toast';

interface LocationContextType {
  socket: Socket | null;
  userLocation: GeolocationPosition | null;
  driverLocations: Map<string, DriverLocation>;
  parcelTracking: Map<string, ParcelTracking>;
  isLocationEnabled: boolean;
  notificationPreferences: NotificationPreferences;
  connectSocket: () => void;
  disconnectSocket: () => void;
  updateDriverLocation: (location: DriverLocation) => void;
  subscribeToParcel: (parcelId: string) => void;
  unsubscribeFromParcel: (parcelId: string) => void;
  requestLocationPermission: () => Promise<boolean>;
  updateNotificationPreferences: (preferences: Partial<NotificationPreferences>) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(null);
  const [driverLocations, setDriverLocations] = useState<Map<string, DriverLocation>>(new Map());
  const [parcelTracking, setParcelTracking] = useState<Map<string, ParcelTracking>>(new Map());
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>({
    pushNotifications: true,
    locationUpdates: true,
    etaChanges: true,
    milestoneAlerts: true,
    delayWarnings: true,
  });

  const connectSocket = () => {
    if (!socket) {
      const newSocket = io(process.env.VITE_WEBSOCKET_URL || 'ws://localhost:3001');
      
      newSocket.on('connect', () => {
        console.log('Connected to WebSocket server');
        toast.success('Connected to real-time tracking');
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
        toast.error('Disconnected from real-time tracking');
      });

      newSocket.on('driver-location-update', (data: DriverLocation) => {
        setDriverLocations(prev => new Map(prev.set(data.driverId, data)));
      });

      newSocket.on('parcel-tracking-update', (data: ParcelTracking) => {
        setParcelTracking(prev => new Map(prev.set(data.parcelId, data)));
        
        if (notificationPreferences.milestoneAlerts) {
          const latestMilestone = data.milestones[data.milestones.length - 1];
          if (latestMilestone?.completed) {
            toast.success(`${latestMilestone.title}: ${latestMilestone.description}`);
          }
        }
      });

      newSocket.on('eta-update', (data: { parcelId: string; eta: Date; delay?: number }) => {
        if (notificationPreferences.etaChanges) {
          const message = data.delay 
            ? `Delivery delayed by ${data.delay} minutes`
            : `ETA updated: ${new Date(data.eta).toLocaleTimeString()}`;
          toast.info(message);
        }
      });

      setSocket(newSocket);
    }
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const updateDriverLocation = (location: DriverLocation) => {
    if (socket) {
      socket.emit('driver-location-update', location);
    }
  };

  const subscribeToParcel = (parcelId: string) => {
    if (socket) {
      socket.emit('subscribe-parcel', parcelId);
    }
  };

  const unsubscribeFromParcel = (parcelId: string) => {
    if (socket) {
      socket.emit('unsubscribe-parcel', parcelId);
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        });
      });
      
      setUserLocation(position);
      setIsLocationEnabled(true);
      
      // Start watching position for drivers
      navigator.geolocation.watchPosition(
        (position) => setUserLocation(position),
        (error) => console.error('Location tracking error:', error),
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 30000,
        }
      );
      
      return true;
    } catch (error) {
      console.error('Location permission denied:', error);
      setIsLocationEnabled(false);
      return false;
    }
  };

  const updateNotificationPreferences = (preferences: Partial<NotificationPreferences>) => {
    setNotificationPreferences(prev => ({ ...prev, ...preferences }));
  };

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      disconnectSocket();
    };
  }, []);

  const value = {
    socket,
    userLocation,
    driverLocations,
    parcelTracking,
    isLocationEnabled,
    notificationPreferences,
    connectSocket,
    disconnectSocket,
    updateDriverLocation,
    subscribeToParcel,
    unsubscribeFromParcel,
    requestLocationPermission,
    updateNotificationPreferences,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};