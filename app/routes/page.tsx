'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Place } from '@/types';
import { RouteResult } from '@/types/route';
import { usePlacesStore, useFiltersStore } from '@/lib/storeDb';
import ManualSelection from '@/components/routes/ManualSelection';
import IbnAlMadinah from '@/components/routes/IbnAlMadinah';
import RouteResultModal from '@/components/routes/RouteResultModal';
import PlaceDetailsModal from '@/components/PlaceDetailsModal';
import ReservationModal from '@/components/ReservationModal';

type Mode = 'manual' | 'ibnalmadinah';

interface FilterState {
  [key: string]: string | string[];
}

export default function RoutesPage() {
  const { places } = usePlacesStore();
  const categories = useFiltersStore((state) => state.categories);

  const [mode, setMode] = useState<Mode>('manual');
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
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        {/* Hero Section - Matching Figma design */}
        <div className="relative h-[400px] sm:h-[500px] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/landingpage.jpg"
              alt="المدينة المنورة"
              fill
              className="object-cover"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B2F29]/70 via-[#0D3B2F]/50 to-[#195B4A]/80" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                خطط مسارك في المدينة
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
                انشئ مساراً مخصصاً يناسب وقتك واهتماماتك يدوياً أو بمساعدة الذكاء الاصطناعي
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Mode Switch - Figma style */}
          <div className="bg-white rounded-xl shadow-md p-2 mb-6 border border-gray-100">
            <div className="flex gap-2">
              <button
                onClick={() => setMode('manual')}
                className={`flex-1 py-3 px-4 rounded-[10px] font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  mode === 'manual'
                    ? 'text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={mode === 'manual' ? { backgroundColor: '#2D4A3E' } : {}}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                مسار يدوي
              </button>
              <button
                onClick={() => setMode('ibnalmadinah')}
                className={`flex-1 py-3 px-4 rounded-[10px] font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  mode === 'ibnalmadinah'
                    ? 'text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={mode === 'ibnalmadinah' ? { backgroundColor: '#C38822' } : {}}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                تخطيط ابن المدينة
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div>
            {mode === 'manual' ? (
              <ManualSelection
                places={filteredPlaces}
                filters={filters}
                onFilterChange={setFilters}
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
