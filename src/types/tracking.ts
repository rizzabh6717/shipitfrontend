export interface Location {
  latitude: number;
  longitude: number;
  timestamp: Date;
  accuracy?: number;
}

export interface DriverLocation extends Location {
  driverId: string;
  parcelId?: string;
  heading?: number;
  speed?: number;
}

export interface ParcelTracking {
  parcelId: string;
  driverId: string;
  currentLocation: Location;
  route: Location[];
  status: 'accepted' | 'picked-up' | 'in-transit' | 'delivered';
  estimatedArrival?: Date;
  milestones: TrackingMilestone[];
}

export interface TrackingMilestone {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  location?: Location;
  completed: boolean;
}

export interface DeliveryZone {
  id: string;
  name: string;
  coordinates: Location[];
  color: string;
  active: boolean;
}

export interface NotificationPreferences {
  pushNotifications: boolean;
  locationUpdates: boolean;
  etaChanges: boolean;
  milestoneAlerts: boolean;
  delayWarnings: boolean;
}

export interface AnalyticsData {
  deliveryHeatmap: {
    location: Location;
    count: number;
  }[];
  driverPerformance: {
    driverId: string;
    name: string;
    completedDeliveries: number;
    averageRating: number;
    averageDeliveryTime: number;
    onTimePercentage: number;
  }[];
  routeOptimization: {
    originalDistance: number;
    optimizedDistance: number;
    timeSaved: number;
    fuelSaved: number;
  };
}