import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline, InfoWindow } from '@react-google-maps-api';
import { motion, AnimatePresence } from 'framer-motion';
import { DriverLocation, Location, ParcelTracking } from '../../types/tracking';
import { Truck, Package, MapPin } from 'lucide-react';

interface LiveMapProps {
  tracking?: ParcelTracking;
  driverLocation?: DriverLocation;
  pickupLocation?: Location;
  deliveryLocation?: Location;
  className?: string;
  showTraffic?: boolean;
  showRoute?: boolean;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 19.0760, // Mumbai
  lng: 72.8777,
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'all',
      elementType: 'geometry.fill',
      stylers: [{ color: '#1f2937' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#374151' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#4b5563' }],
    },
  ],
};

const LiveMap: React.FC<LiveMapProps> = ({
  tracking,
  driverLocation,
  pickupLocation,
  deliveryLocation,
  className = '',
  showTraffic = false,
  showRoute = true,
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [routePath, setRoutePath] = useState<google.maps.LatLng[]>([]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Update route path when tracking data changes
  useEffect(() => {
    if (tracking?.route && showRoute) {
      const path = tracking.route.map(
        (location) => new google.maps.LatLng(location.latitude, location.longitude)
      );
      setRoutePath(path);
    }
  }, [tracking?.route, showRoute]);

  // Auto-center map on driver location
  useEffect(() => {
    if (map && driverLocation) {
      const center = new google.maps.LatLng(driverLocation.latitude, driverLocation.longitude);
      map.panTo(center);
    }
  }, [map, driverLocation]);

  const getMarkerIcon = (type: 'driver' | 'pickup' | 'delivery') => {
    const baseIcon = {
      scaledSize: new google.maps.Size(40, 40),
      anchor: new google.maps.Point(20, 20),
    };

    switch (type) {
      case 'driver':
        return {
          ...baseIcon,
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#3B82F6" stroke="#1E40AF" stroke-width="2"/>
              <path d="M12 20L16 16L20 20L28 12" stroke="white" stroke-width="2" fill="none"/>
            </svg>
          `),
        };
      case 'pickup':
        return {
          ...baseIcon,
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#10B981" stroke="#059669" stroke-width="2"/>
              <rect x="12" y="14" width="16" height="12" rx="2" fill="white"/>
            </svg>
          `),
        };
      case 'delivery':
        return {
          ...baseIcon,
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#EF4444" stroke="#DC2626" stroke-width="2"/>
              <path d="M20 8L24 16H16L20 8Z" fill="white"/>
              <rect x="16" y="16" width="8" height="8" fill="white"/>
            </svg>
          `),
        };
    }
  };

  return (
    <div className={`relative ${className}`}>
      <LoadScript googleMapsApiKey={process.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={
            driverLocation
              ? { lat: driverLocation.latitude, lng: driverLocation.longitude }
              : defaultCenter
          }
          zoom={13}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={mapOptions}
        >
          {/* Driver Marker */}
          {driverLocation && (
            <Marker
              position={{ lat: driverLocation.latitude, lng: driverLocation.longitude }}
              icon={getMarkerIcon('driver')}
              onClick={() => setSelectedMarker('driver')}
              animation={google.maps.Animation.BOUNCE}
            />
          )}

          {/* Pickup Location Marker */}
          {pickupLocation && (
            <Marker
              position={{ lat: pickupLocation.latitude, lng: pickupLocation.longitude }}
              icon={getMarkerIcon('pickup')}
              onClick={() => setSelectedMarker('pickup')}
            />
          )}

          {/* Delivery Location Marker */}
          {deliveryLocation && (
            <Marker
              position={{ lat: deliveryLocation.latitude, lng: deliveryLocation.longitude }}
              icon={getMarkerIcon('delivery')}
              onClick={() => setSelectedMarker('delivery')}
            />
          )}

          {/* Route Polyline */}
          {routePath.length > 0 && (
            <Polyline
              path={routePath}
              options={{
                strokeColor: '#3B82F6',
                strokeOpacity: 0.8,
                strokeWeight: 4,
                geodesic: true,
              }}
            />
          )}

          {/* Info Windows */}
          {selectedMarker === 'driver' && driverLocation && (
            <InfoWindow
              position={{ lat: driverLocation.latitude, lng: driverLocation.longitude }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="p-2">
                <h3 className="font-semibold text-gray-800 flex items-center">
                  <Truck className="h-4 w-4 mr-2 text-blue-600" />
                  Driver Location
                </h3>
                <p className="text-sm text-gray-600">
                  Speed: {driverLocation.speed ? `${Math.round(driverLocation.speed * 3.6)} km/h` : 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  Updated: {new Date(driverLocation.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </InfoWindow>
          )}

          {selectedMarker === 'pickup' && pickupLocation && (
            <InfoWindow
              position={{ lat: pickupLocation.latitude, lng: pickupLocation.longitude }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="p-2">
                <h3 className="font-semibold text-gray-800 flex items-center">
                  <Package className="h-4 w-4 mr-2 text-green-600" />
                  Pickup Location
                </h3>
              </div>
            </InfoWindow>
          )}

          {selectedMarker === 'delivery' && deliveryLocation && (
            <InfoWindow
              position={{ lat: deliveryLocation.latitude, lng: deliveryLocation.longitude }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="p-2">
                <h3 className="font-semibold text-gray-800 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-red-600" />
                  Delivery Location
                </h3>
              </div>
            </InfoWindow>
          )}

          {/* Traffic Layer */}
          {showTraffic && map && (
            <></>
          )}
        </GoogleMap>
      </LoadScript>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (map && driverLocation) {
              map.panTo({ lat: driverLocation.latitude, lng: driverLocation.longitude });
              map.setZoom(15);
            }
          }}
          className="bg-white hover:bg-gray-50 text-gray-800 p-2 rounded-lg shadow-lg border border-gray-200"
        >
          <Truck className="h-5 w-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default LiveMap;