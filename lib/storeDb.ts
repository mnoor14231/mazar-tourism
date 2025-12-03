import { create } from 'zustand';
import { Place, FilterCategory, Reservation, SavedRoute } from '@/types';
import * as api from './api';

interface PlacesState {
  places: Place[];
  isLoading: boolean;
  fetchPlaces: () => Promise<void>;
  addPlace: (place: Place) => Promise<void>;
  updatePlace: (id: string, place: Partial<Place>) => Promise<void>;
  deletePlace: (id: string) => Promise<void>;
}

interface FiltersState {
  categories: FilterCategory[];
  isLoading: boolean;
  fetchFilters: () => Promise<void>;
  addCategory: (category: FilterCategory) => Promise<void>;
}

interface ReservationsState {
  reservations: Reservation[];
  isLoading: boolean;
  fetchReservations: (userId?: string) => Promise<void>;
  addReservation: (reservation: Reservation) => Promise<void>;
  getUserReservations: (userId: string) => Reservation[];
}

interface SavedRoutesState {
  routes: SavedRoute[];
  isLoading: boolean;
  fetchRoutes: (userId: string) => Promise<void>;
  saveRoute: (route: Omit<SavedRoute, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteRoute: (id: string) => Promise<void>;
}

// Places Store with DB
export const usePlacesStore = create<PlacesState>()((set, get) => ({
  places: [],
  isLoading: false,
  fetchPlaces: async () => {
    try {
      set({ isLoading: true });
      const places = await api.fetchPlaces();
      set({ places, isLoading: false });
    } catch (error) {
      console.error('Error fetching places:', error);
      set({ isLoading: false });
    }
  },
  addPlace: async (place) => {
    try {
      const newPlace = await api.createPlace(place);
      set((state) => ({ places: [...state.places, newPlace] }));
    } catch (error) {
      console.error('Error adding place:', error);
    }
  },
  updatePlace: async (id, updatedPlace) => {
    try {
      const updated = await api.updatePlace(id, updatedPlace);
      set((state) => ({
        places: state.places.map((p) => (p.id === id ? updated : p)),
      }));
    } catch (error) {
      console.error('Error updating place:', error);
    }
  },
  deletePlace: async (id) => {
    try {
      await api.deletePlace(id);
      set((state) => ({
        places: state.places.filter((p) => p.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting place:', error);
    }
  },
}));

// Filters Store with DB
export const useFiltersStore = create<FiltersState>()((set) => ({
  categories: [],
  isLoading: false,
  fetchFilters: async () => {
    try {
      set({ isLoading: true });
      const categories = await api.fetchFilters();
      set({ categories, isLoading: false });
    } catch (error) {
      console.error('Error fetching filters:', error);
      set({ isLoading: false });
    }
  },
  addCategory: async (category) => {
    try {
      const newCategory = await api.createFilter(category);
      set((state) => ({ categories: [...state.categories, newCategory] }));
    } catch (error) {
      console.error('Error adding category:', error);
    }
  },
}));

// Reservations Store with DB
export const useReservationsStore = create<ReservationsState>()((set, get) => ({
  reservations: [],
  isLoading: false,
  fetchReservations: async (userId?: string) => {
    try {
      set({ isLoading: true });
      const reservations = await api.fetchReservations(userId);
      set({ reservations, isLoading: false });
    } catch (error) {
      console.error('Error fetching reservations:', error);
      set({ isLoading: false });
    }
  },
  addReservation: async (reservation) => {
    try {
      const newReservation = await api.createReservation(reservation);
      set((state) => ({ reservations: [...state.reservations, newReservation] }));
    } catch (error) {
      console.error('Error adding reservation:', error);
    }
  },
  getUserReservations: (userId) => {
    return get().reservations.filter((r) => r.userId === userId);
  },
}));

// Saved Routes Store with DB
export const useSavedRoutesStore = create<SavedRoutesState>()((set) => ({
  routes: [],
  isLoading: false,
  fetchRoutes: async (userId: string) => {
    try {
      set({ isLoading: true });
      const routes = await api.fetchSavedRoutes(userId);
      set({ routes, isLoading: false });
    } catch (error) {
      console.error('Error fetching saved routes:', error);
      set({ isLoading: false });
    }
  },
  saveRoute: async (route) => {
    try {
      console.log('[SavedRoutesStore] Saving route:', route);
      
      // Validate required fields
      if (!route.userId) {
        throw new Error('userId is required');
      }
      if (!route.placeIds || route.placeIds.length === 0) {
        throw new Error('At least one place is required');
      }
      if (!route.name) {
        throw new Error('Route name is required');
      }

      const newRoute = await api.createSavedRoute(route);
      console.log('[SavedRoutesStore] Route saved successfully:', newRoute);
      
      set((state) => ({ routes: [...state.routes, newRoute] }));
      return newRoute;
    } catch (error: any) {
      console.error('[SavedRoutesStore] Error saving route:', error);
      console.error('[SavedRoutesStore] Error details:', error.message || error);
      throw new Error(`Failed to save route: ${error.message || 'Unknown error'}`);
    }
  },
  deleteRoute: async (id) => {
    try {
      await api.deleteSavedRoute(id);
      set((state) => ({
        routes: state.routes.filter((r) => r.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting route:', error);
    }
  },
}));

