export type PlaceType = "religious" | "historical" | "entertainment";
export type Audience = "family" | "kids" | "seniors" | "friends";
export type Environment = "indoor" | "outdoor" | "mixed";
export type CrowdLevel = "low" | "medium" | "high";
export type UserRole = "manager" | "user";

export interface Place {
  id: string;
  name: string;
  description: string;
  type: string; // Changed to string to support custom types
  audience: string[]; // Changed to string[] to support custom audience
  environment: string; // Changed to string to support custom environments
  requiresBooking: boolean;
  reservationPrice?: number; // Price in SAR
  bookingUrl?: string; // URL for external booking if needed
  bookingsCount: number;
  openingHours: string;
  crowdLevel?: CrowdLevel;
  currentEvents?: string[];
  images: string[]; // Can be URLs or base64 data
  latitude: number;
  longitude: number;
  customFilters?: Record<string, string[]>; // For additional custom filters
}

export interface Reservation {
  id: string;
  placeId: string;
  userId: string;
  reservationDate: string;
  numberOfPeople: number;
  totalPrice: number;
  paymentMethod: 'apple-pay' | 'credit-card';
  qrCode: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id?: string;
  username: string;
  role: UserRole;
}

export interface FilterOption {
  id: string;
  value: string;
  label: string;
  color?: string;
}

export interface FilterCategory {
  id: string;
  name: string;
  nameAr: string;
  type: 'single' | 'multi';
  options: FilterOption[];
}

export interface SavedRoute {
  id: string;
  userId: string;
  name: string;
  placeIds: string[];
  startLatitude: number;
  startLongitude: number;
  startLabel: string;
  totalDistanceKm: number;
  estimatedDurationMins: number;
  routeType: 'manual' | 'ai';
  aiPreferences?: any;
  createdAt: string;
  updatedAt: string;
}

