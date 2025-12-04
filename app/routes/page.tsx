'use client';

import { useState, useMemo, useEffect } from 'react';
import { Place } from '@/types';
import { RouteResult } from '@/types/route';
import { usePlacesStore, useFiltersStore, useSavedRoutesStore } from '@/lib/storeDb';
import { useAuthStore } from '@/lib/store';
import RouteFilters from '@/components/routes/RouteFilters';
import ManualSelection from '@/components/routes/ManualSelection';
import IbnAlMadinah from '@/components/routes/IbnAlMadinah';
import RouteResultModal from '@/components/routes/RouteResultModal';
import PlaceDetailsModal from '@/components/PlaceDetailsModal';
import ReservationModal from '@/components/ReservationModal';
import SavedRoutes from '@/components/SavedRoutes';
import MyReservations from '@/components/MyReservations';

type Mode = 'manual' | 'ibnalmadinah';

interface FilterState {
  [key: string]: string | string[];
}

export default function RoutesPage() {
  const user = useAuthStore((state) => state.user);
  const { places } = usePlacesStore();
  const categories = useFiltersStore((state) => state.categories);

  const [mode, setMode] = useState<Mode>('manual');
  const [view, setView] = useState<'create' | 'saved-routes' | 'reservations'>('create');
  const [filters, setFilters] = useState<FilterState>({});

  // Initialize filters based on categories
  useEffect(() => {
    setFilters((prevFilters) => {
      const updatedFilters: FilterState = { ...prevFilters };
      let hasChanges = false;

      categories.forEach((category) => {
        if (!(category.name in updatedFilters)) {
          // New category - initialize it
          if (category.type === 'single') {
            updatedFilters[category.name] = 'all';
          } else {
            updatedFilters[category.name] = [];
          }
          hasChanges = true;
        }
      });

      // Ensure search filter exists
      if (!('search' in updatedFilters)) {
        updatedFilters.search = '';
        hasChanges = true;
      }

      return hasChanges ? updatedFilters : prevFilters;
    });
  }, [categories]); // Only re-run when categories change

  const [currentRoute, setCurrentRoute] = useState<RouteResult | null>(null);
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [suggestions, setSuggestions] = useState<{ place: Place; reason: string }[]>([]);
  const [showRouteResult, setShowRouteResult] = useState(false);
  const [selectedPlaceForDetails, setSelectedPlaceForDetails] = useState<Place | null>(null);
  const [placeForReservation, setPlaceForReservation] = useState<Place | null>(null);

  // Filter places based on current filters
  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      // Check each filter category
      for (const category of categories) {
        const filterValue = filters[category.name];

        if (category.type === 'single') {
          // Single select filter
          if (filterValue && filterValue !== 'all') {
            if (category.name === 'type') {
              if (place.type !== filterValue) return false;
            } else if (category.name === 'environment') {
              if (place.environment !== filterValue) return false;
            } else if (category.name === 'requiresBooking') {
              const requiresBooking = filterValue === 'yes';
              if (place.requiresBooking !== requiresBooking) return false;
            } else {
              // Custom single filter
              const placeValue = place.customFilters?.[category.name]?.[0];
              if (placeValue !== filterValue) return false;
            }
          }
        } else {
          // Multi select filter
          const selectedValues = filterValue as string[];
          if (selectedValues && selectedValues.length > 0) {
            if (category.name === 'audience') {
              const hasMatch = selectedValues.some((v) => place.audience.includes(v));
              if (!hasMatch) return false;
            } else {
              // Custom multi filter
              const placeValues = place.customFilters?.[category.name] || [];
              const hasMatch = selectedValues.some((v) => placeValues.includes(v));
              if (!hasMatch) return false;
            }
          }
        }
      }

      // Search filter
      const searchTerm = filters.search as string;
      if (searchTerm && searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        if (!place.name.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  }, [places, filters, categories]);

  const handleManualRouteGenerated = (route: RouteResult, places: Place[]) => {
    setCurrentRoute(route);
    setSelectedPlaces(places);
    setSuggestions([]);
    setShowRouteResult(true);
  };

  const handleIbnRouteGenerated = (
    route: RouteResult,
    places: Place[],
    suggs: { place: Place; reason: string }[]
  ) => {
    setCurrentRoute(route);
    setSelectedPlaces(places);
    setSuggestions(suggs);
    setShowRouteResult(true);
  };

  const handleCloseRouteResult = () => {
    setShowRouteResult(false);
  };

  const handlePlaceClick = (place: Place) => {
    setSelectedPlaceForDetails(place);
  };

  const handleReservation = (place: Place) => {
    setPlaceForReservation(place);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header - using exact color #195B4A */}
        <div className="shadow-lg" style={{ backgroundColor: 'var(--color-button-normal)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                المسار
              </h1>
              <p className="text-white/80">
                اختر طريقك لاكتشاف المدينة المنورة
              </p>
            </div>

            {/* View Switcher */}
            {user && (
              <div className="flex gap-3 justify-center flex-wrap">
                <button
                  onClick={() => setView('create')}
                  className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2 ${
                    view === 'create'
                      ? 'bg-white'
                      : 'text-white border-2 border-white/30'
                  }`}
                  style={view === 'create' 
                    ? { color: 'var(--color-button-normal)' } 
                    : { backgroundColor: 'rgba(25, 91, 74, 0.5)' }
                  }
                >
                  <span className="text-xl">➕</span>
                  <span>إنشاء مسار</span>
                </button>
                <button
                  onClick={() => setView('saved-routes')}
                  className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2 ${
                    view === 'saved-routes'
                      ? 'text-white'
                      : 'text-white border-2 border-white/30'
                  }`}
                  style={view === 'saved-routes' 
                    ? { backgroundColor: 'var(--color-accent)' } 
                    : { backgroundColor: 'rgba(25, 91, 74, 0.5)' }
                  }
                >
                  <span className="text-xl">🗺️</span>
                  <span>رحلاتي</span>
                </button>
                <button
                  onClick={() => setView('reservations')}
                  className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2 ${
                    view === 'reservations'
                      ? 'bg-[#9D7D4E] text-white'
                      : 'bg-[#195B4A]/50 hover:bg-[#195B4A]/70 text-white border-2 border-white/30'
                  }`}
                >
                  <span className="text-xl">📅</span>
                  <span>حجوزاتي</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          {view === 'saved-routes' ? (
            /* Saved Routes Section */
            <SavedRoutes />
          ) : view === 'reservations' ? (
            /* Reservations Section */
            <MyReservations />
          ) : (
            <>
              {/* Filters */}
              <RouteFilters filters={filters} onFilterChange={setFilters} />

              {/* Mode Switch */}
              <div className="bg-white rounded-xl shadow-md p-2 mb-6 border border-gray-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => setMode('manual')}
                    className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      mode === 'manual'
                        ? 'bg-[#195B4A] text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>✋</span>
                    اختيار يدوي
                  </button>
                  <button
                    onClick={() => setMode('ibnalmadinah')}
                    className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      mode === 'ibnalmadinah'
                        ? 'bg-[#9D7D4E] text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>🧔</span>
                    ابن المدينة
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div>
                {mode === 'manual' ? (
                  <ManualSelection
                    places={filteredPlaces}
                    onRouteGenerated={handleManualRouteGenerated}
                  />
                ) : (
                  <div className="max-w-3xl mx-auto">
                    <IbnAlMadinah
                      places={filteredPlaces}
                      onRouteGenerated={handleIbnRouteGenerated}
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {/* Features Info */}
          <div className="mt-12 bg-[#195B4A]/10 rounded-2xl p-8 border border-[#195B4A]/20">
            <h2 className="text-2xl font-bold text-[#195B4A] mb-6 text-center">
              مميزات خدمة المسار
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                <div className="text-4xl mb-3">✋</div>
                <h3 className="font-bold text-gray-800 mb-2">اختيار يدوي</h3>
                <p className="text-sm text-gray-600">
                  اختر الأماكن التي تريدها بنفسك وسنبني لك المسار الأمثل
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                <div className="text-4xl mb-3">🧔</div>
                <h3 className="font-bold text-gray-800 mb-2">ابن المدينة</h3>
                <p className="text-sm text-gray-600">
                  مساعدك الذكي يفهم تفضيلاتك ويقترح لك أفضل المسارات
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                <div className="text-4xl mb-3">🗺️</div>
                <h3 className="font-bold text-gray-800 mb-2">خريطة تفاعلية</h3>
                <p className="text-sm text-gray-600">
                  شاهد مسارك على الخريطة مع تقدير المسافات والأوقات
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Route Result Modal */}
      {showRouteResult && currentRoute && (
        <RouteResultModal
          route={currentRoute}
          selectedPlaces={selectedPlaces}
          suggestions={suggestions}
          onClose={handleCloseRouteResult}
          onReservation={handleReservation}
        />
      )}

      {/* Place Details Modal */}
      {selectedPlaceForDetails && (
        <PlaceDetailsModal
          place={selectedPlaceForDetails}
          isOpen={!!selectedPlaceForDetails}
          onClose={() => setSelectedPlaceForDetails(null)}
        />
      )}

      {/* Reservation Modal */}
      {placeForReservation && (
        <ReservationModal
          place={placeForReservation}
          isOpen={!!placeForReservation}
          onClose={() => setPlaceForReservation(null)}
        />
      )}
    </>
  );
}
