import { useState, useEffect, useCallback } from 'react';
import { useLocation } from '../contexts/LocationContext';
import { DriverLocation } from '../types/tracking';

export const useLocationTracking = (driverId?: string) => {
  const { userLocation, updateDriverLocation, requestLocationPermission, isLocationEnabled } = useLocation();
  const [isTracking, setIsTracking] = useState(false);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  const startTracking = useCallback(async () => {
    if (!driverId) {
      setTrackingError('Driver ID is required for tracking');
      return;
    }

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setTrackingError('Location permission denied');
      return;
    }

    setIsTracking(true);
    setTrackingError(null);
  }, [driverId, requestLocationPermission]);

  const stopTracking = useCallback(() => {
    setIsTracking(false);
  }, []);

  useEffect(() => {
    if (isTracking && userLocation && driverId) {
      const driverLocation: DriverLocation = {
        driverId,
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        timestamp: new Date(),
        accuracy: userLocation.coords.accuracy,
        heading: userLocation.coords.heading || undefined,
        speed: userLocation.coords.speed || undefined,
      };

      updateDriverLocation(driverLocation);
    }
  }, [userLocation, isTracking, driverId, updateDriverLocation]);

  return {
    isTracking,
    trackingError,
    startTracking,
    stopTracking,
    isLocationEnabled,
    currentLocation: userLocation,
  };
};