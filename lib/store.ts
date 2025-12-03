import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Place, FilterCategory, Reservation } from '@/types';
import { mockPlaces } from './mockData';
import * as api from './api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

interface PlacesState {
  places: Place[];
  addPlace: (place: Place) => void;
  updatePlace: (id: string, place: Partial<Place>) => void;
  deletePlace: (id: string) => void;
}

interface FiltersState {
  categories: FilterCategory[];
  addCategory: (category: FilterCategory) => void;
  updateCategory: (id: string, category: Partial<FilterCategory>) => void;
  deleteCategory: (id: string) => void;
  addOptionToCategory: (categoryId: string, option: { value: string; label: string; color?: string }) => void;
  removeOptionFromCategory: (categoryId: string, optionId: string) => void;
}

// Default filter categories
const defaultCategories: FilterCategory[] = [
  {
    id: 'type',
    name: 'type',
    nameAr: 'نوع المكان',
    type: 'single',
    options: [
      { id: 'religious', value: 'religious', label: 'ديني', color: '#059669' },
      { id: 'historical', value: 'historical', label: 'تاريخي', color: '#d97706' },
      { id: 'entertainment', value: 'entertainment', label: 'ترفيهي', color: '#7c3aed' },
    ],
  },
  {
    id: 'audience',
    name: 'audience',
    nameAr: 'المناسبة / الفئة',
    type: 'multi',
    options: [
      { id: 'family', value: 'family', label: 'عائلي' },
      { id: 'kids', value: 'kids', label: 'أطفال' },
      { id: 'seniors', value: 'seniors', label: 'كبار سن' },
      { id: 'friends', value: 'friends', label: 'أصدقاء' },
    ],
  },
  {
    id: 'environment',
    name: 'environment',
    nameAr: 'البيئة',
    type: 'single',
    options: [
      { id: 'indoor', value: 'indoor', label: 'داخلي' },
      { id: 'outdoor', value: 'outdoor', label: 'خارجي' },
      { id: 'mixed', value: 'mixed', label: 'مختلط' },
    ],
  },
  {
    id: 'booking',
    name: 'requiresBooking',
    nameAr: 'الحجز',
    type: 'single',
    options: [
      { id: 'yes', value: 'yes', label: 'يتطلب حجز' },
      { id: 'no', value: 'no', label: 'بدون حجز' },
    ],
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      login: async (username: string, password: string) => {
        try {
          set({ isLoading: true });
          const data = await api.loginUser(username, password);
          if (data.success && data.user) {
            set({ user: data.user, isLoading: false });
            return true;
          }
          set({ isLoading: false });
          return false;
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          return false;
        }
      },
      logout: () => set({ user: null }),
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const usePlacesStore = create<PlacesState>()(
  persist(
    (set) => ({
      places: mockPlaces,
      addPlace: (place) =>
        set((state) => ({ places: [...state.places, place] })),
      updatePlace: (id, updatedPlace) =>
        set((state) => ({
          places: state.places.map((p) =>
            p.id === id ? { ...p, ...updatedPlace } : p
          ),
        })),
      deletePlace: (id) =>
        set((state) => ({
          places: state.places.filter((p) => p.id !== id),
        })),
    }),
    {
      name: 'places-storage',
    }
  )
);

export const useFiltersStore = create<FiltersState>()(
  persist(
    (set) => ({
      categories: defaultCategories,
      addCategory: (category) =>
        set((state) => ({ categories: [...state.categories, category] })),
      updateCategory: (id, updatedCategory) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updatedCategory } : c
          ),
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),
      addOptionToCategory: (categoryId, option) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === categoryId
              ? {
                  ...c,
                  options: [
                    ...c.options,
                    { ...option, id: Date.now().toString() },
                  ],
                }
              : c
          ),
        })),
      removeOptionFromCategory: (categoryId, optionId) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === categoryId
              ? {
                  ...c,
                  options: c.options.filter((o) => o.id !== optionId),
                }
              : c
          ),
        })),
    }),
    {
      name: 'filters-storage',
    }
  )
);

interface ReservationsState {
  reservations: Reservation[];
  addReservation: (reservation: Reservation) => void;
  cancelReservation: (id: string) => void;
  getUserReservations: (userId: string) => Reservation[];
}

export const useReservationsStore = create<ReservationsState>()(
  persist(
    (set, get) => ({
      reservations: [],
      addReservation: (reservation) =>
        set((state) => ({ reservations: [...state.reservations, reservation] })),
      cancelReservation: (id) =>
        set((state) => ({
          reservations: state.reservations.map((r) =>
            r.id === id ? { ...r, status: 'cancelled' } : r
          ),
        })),
      getUserReservations: (userId) => {
        return get().reservations.filter((r) => r.userId === userId);
      },
    }),
    {
      name: 'reservations-storage',
    }
  )
);

