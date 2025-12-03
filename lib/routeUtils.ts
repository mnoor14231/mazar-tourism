import { Place } from '@/types';
import { RouteStop, RouteResult, UserPreferences } from '@/types/route';

// Haversine formula to calculate distance between two points
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Nearest neighbor algorithm to order places
export function buildRouteNearestNeighbor(
  startLat: number,
  startLon: number,
  startLabel: string,
  places: Place[]
): RouteResult {
  if (places.length === 0) {
    return {
      stops: [
        {
          kind: 'start',
          label: startLabel,
          latitude: startLat,
          longitude: startLon,
        },
      ],
      totalDistanceKm: 0,
      estimatedDurationMinutes: 0,
    };
  }

  const stops: RouteStop[] = [
    {
      kind: 'start',
      label: startLabel,
      latitude: startLat,
      longitude: startLon,
    },
  ];

  const remaining = [...places];
  let currentLat = startLat;
  let currentLon = startLon;
  let totalDistance = 0;

  while (remaining.length > 0) {
    // Find nearest place
    let nearestIndex = 0;
    let nearestDistance = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const dist = haversineDistance(
        currentLat,
        currentLon,
        remaining[i].latitude,
        remaining[i].longitude
      );
      if (dist < nearestDistance) {
        nearestDistance = dist;
        nearestIndex = i;
      }
    }

    const nearest = remaining[nearestIndex];
    totalDistance += nearestDistance;

    stops.push({
      kind: 'place',
      label: nearest.name,
      latitude: nearest.latitude,
      longitude: nearest.longitude,
      placeId: nearest.id,
    });

    currentLat = nearest.latitude;
    currentLon = nearest.longitude;
    remaining.splice(nearestIndex, 1);
  }

  // Estimate duration: ~5 min per km driving + 30 min per place
  const estimatedDuration = Math.round(totalDistance * 5 + places.length * 30);

  return {
    stops,
    totalDistanceKm: Math.round(totalDistance * 10) / 10,
    estimatedDurationMinutes: estimatedDuration,
  };
}

// Default center of Madinah
export const MADINAH_CENTER = {
  latitude: 24.4672,
  longitude: 39.6111,
};

// Score places based on user preferences (for Ibn Al-Madinah)
export function scorePlacesByPreferences(
  places: Place[],
  preferences: UserPreferences
): { place: Place; score: number; reason: string }[] {
  return places.map((place) => {
    let score = 0;
    const reasons: string[] = [];

    // Type preference
    if (preferences.preferredTypes?.includes(place.type as any)) {
      score += 30;
      const typeLabels: Record<string, string> = {
        religious: 'مكان ديني',
        historical: 'مكان تاريخي',
        entertainment: 'مكان ترفيهي',
      };
      reasons.push(typeLabels[place.type] || place.type);
    }

    // Age-based preferences
    if (preferences.age) {
      if (preferences.age < 30) {
        // Younger users prefer entertainment and less crowded places
        if (place.type === 'entertainment') {
          score += 10;
        }
        if (place.crowdLevel === 'low' || place.crowdLevel === 'medium') {
          score += 5;
        }
      } else if (preferences.age >= 50) {
        // Older users prefer religious/historical and less crowded places
        if (place.type === 'religious' || place.type === 'historical') {
          score += 10;
        }
        if (place.crowdLevel === 'low') {
          score += 10;
        } else if (place.crowdLevel === 'medium') {
          score += 5;
        }
        // Prefer places suitable for seniors
        if (place.audience.includes('seniors')) {
          score += 15;
        }
      }
      // Middle age (30-50) gets balanced scoring
    }

    // Family/kids/seniors preference
    if (preferences.tripType === 'family' && place.audience.includes('family')) {
      score += 20;
      reasons.push('مناسب للعائلة');
    }

    if (preferences.hasKids && place.audience.includes('kids')) {
      score += 15;
      reasons.push('مناسب للأطفال');
    }

    if (preferences.hasSeniors && place.audience.includes('seniors')) {
      score += 15;
      reasons.push('مناسب لكبار السن');
    }

    // Individual trip preference (less crowded, more flexible)
    if (preferences.tripType === 'individual') {
      if (place.crowdLevel === 'low') {
        score += 8;
      }
      if (!place.requiresBooking) {
        score += 8; // More convenient for solo travelers
      }
    }

    // Crowd level bonus (prefer low crowd)
    if (place.crowdLevel === 'low') {
      score += 10;
      reasons.push('ازدحام منخفض');
    } else if (place.crowdLevel === 'medium') {
      score += 5;
    }

    // Booking bonus (prefer no booking for convenience)
    if (!place.requiresBooking) {
      score += 5;
    }

    // Popularity bonus
    if (place.bookingsCount > 1000000) {
      score += 10;
      reasons.push('مكان شهير');
    }

    return {
      place,
      score,
      reason: reasons.length > 0 ? reasons.join(' • ') : 'مكان مميز',
    };
  });
}

// Generate suggested route based on preferences
export function generateSuggestedRoute(
  places: Place[],
  preferences: UserPreferences,
  startLat: number = MADINAH_CENTER.latitude,
  startLon: number = MADINAH_CENTER.longitude
): { route: RouteResult; suggestions: { place: Place; reason: string }[] } {
  const numberOfPlaces = preferences.numberOfPlaces || 2;
  
  // Score and sort places
  const scored = scorePlacesByPreferences(places, preferences);
  scored.sort((a, b) => b.score - a.score);

  // Take top N places
  const topPlaces = scored.slice(0, numberOfPlaces);
  const selectedPlaces = topPlaces.map((s) => s.place);

  // Build route
  const route = buildRouteNearestNeighbor(
    startLat,
    startLon,
    'نقطة البداية',
    selectedPlaces
  );

  return {
    route,
    suggestions: topPlaces.map((s) => ({ place: s.place, reason: s.reason })),
  };
}

// Format duration in Arabic
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} دقيقة`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return hours === 1 ? 'ساعة واحدة' : `${hours} ساعات`;
  }
  return `${hours} ساعة و ${mins} دقيقة`;
}

// Format distance in Arabic
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} متر`;
  }
  return `${km.toFixed(1)} كم`;
}

