export type RouteStop = {
  kind: 'start' | 'place';
  label: string;
  latitude: number;
  longitude: number;
  placeId?: string;
};

export type RouteResult = {
  stops: RouteStop[];
  totalDistanceKm: number;
  estimatedDurationMinutes: number;
};

export type UserPreferences = {
  duration?: string; // e.g., "يوم واحد", "يومين", etc.
  tripType?: 'individual' | 'family';
  hasKids?: boolean;
  hasSeniors?: boolean;
  age?: number; // User's age for better recommendations
  preferredTypes?: ('religious' | 'historical' | 'entertainment')[];
  numberOfPlaces?: 1 | 2 | 3;
};

export type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
};

export type ConversationState = {
  step: 'duration' | 'tripType' | 'age' | 'placeTypes' | 'numberOfPlaces' | 'complete';
  preferences: UserPreferences;
};

