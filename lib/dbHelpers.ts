// Helper functions to parse JSON strings from database

export function parseJsonField<T>(value: string | null | undefined, defaultValue: T): T {
  if (!value) return defaultValue;
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return defaultValue;
  }
}

export function stringifyJsonField<T>(value: T): string {
  return JSON.stringify(value);
}

// Convert database Place to app Place
export function dbPlaceToAppPlace(dbPlace: any): any {
  return {
    ...dbPlace,
    audience: parseJsonField<string[]>(dbPlace.audience, []),
    currentEvents: parseJsonField<string[]>(dbPlace.currentEvents, []),
    images: parseJsonField<string[]>(dbPlace.images, []),
    customFilters: dbPlace.customFilters ? parseJsonField<Record<string, string[]>>(dbPlace.customFilters, {}) : undefined,
  };
}

// Convert app Place to database Place
export function appPlaceToDbPlace(appPlace: any): any {
  const { id, createdAt, updatedAt, ...rest } = appPlace;
  return {
    ...rest,
    audience: stringifyJsonField(appPlace.audience || []),
    currentEvents: stringifyJsonField(appPlace.currentEvents || []),
    images: stringifyJsonField(appPlace.images || []),
    customFilters: appPlace.customFilters ? stringifyJsonField(appPlace.customFilters) : null,
  };
}

// Convert database SavedRoute to app SavedRoute
export function dbRouteToAppRoute(dbRoute: any): any {
  return {
    ...dbRoute,
    placeIds: parseJsonField<string[]>(dbRoute.placeIds, []),
    aiPreferences: dbRoute.aiPreferences ? parseJsonField<any>(dbRoute.aiPreferences, null) : undefined,
  };
}

// Convert app SavedRoute to database SavedRoute
export function appRouteToDbRoute(appRoute: any): any {
  const { id, createdAt, updatedAt, ...rest } = appRoute;
  return {
    ...rest,
    placeIds: stringifyJsonField(appRoute.placeIds || []),
    aiPreferences: appRoute.aiPreferences ? stringifyJsonField(appRoute.aiPreferences) : null,
  };
}

