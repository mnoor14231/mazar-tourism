'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Place } from '@/types';
import { useAuthStore } from '@/lib/store';
import { usePlacesStore, useFiltersStore, useReservationsStore } from '@/lib/storeDb';
import PlaceCard from '@/components/PlaceCard';
import PlaceFilters from '@/components/PlaceFilters';
import PlaceDetailsModal from '@/components/PlaceDetailsModal';
import PlaceFormModal from '@/components/PlaceFormModal';
import PlacesMap from '@/components/PlacesMap';
import FilterManagement from '@/components/FilterManagement';
import ReservationModal from '@/components/ReservationModal';

interface FilterState {
  [key: string]: string | string[];
}

function ReferencePageContent() {
  const searchParams = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const { places, addPlace, updatePlace, deletePlace } = usePlacesStore();
  const categories = useFiltersStore((state) => state.categories);

  // Initialize filters based on categories
  const initialFilters: FilterState = {};
  categories.forEach((category) => {
    if (category.type === 'single') {
      initialFilters[category.name] = 'all';
    } else {
      initialFilters[category.name] = [];
    }
  });

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | undefined>(undefined);
  const [showMap, setShowMap] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [reservationPlace, setReservationPlace] = useState<Place | null>(null);

  const isManager = user?.role === 'manager';

  // Handle reservation parameter from login redirect
  useEffect(() => {
    const reservePlaceId = searchParams?.get('reserve');
    if (reservePlaceId && user) {
      const place = places.find((p) => p.id === reservePlaceId);
      if (place) {
        setReservationPlace(place);
        setShowReservationModal(true);
        // Clean up URL
        window.history.replaceState({}, '', '/reference');
      }
    }
  }, [searchParams, user, places]);

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

      return true;
    });
  }, [places, filters, categories]);

  const handleDetailsClick = (place: Place) => {
    setSelectedPlace(place);
    setIsDetailsModalOpen(true);
  };

  const handleEditClick = (place: Place) => {
    setEditingPlace(place);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (place: Place) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المكان؟')) {
      deletePlace(place.id);
    }
  };

  const handleAddNew = () => {
    setEditingPlace(undefined);
    setIsFormModalOpen(true);
  };

  const handleSavePlace = (place: Place) => {
    if (editingPlace) {
      updatePlace(place.id, place);
    } else {
      addPlace(place);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - using exact colors: #195B4A (green) */}
      <div className="shadow-lg" style={{ backgroundColor: 'var(--color-button-normal)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                مرجع الأماكن
              </h1>
              <p className="text-white/80">
                اكتشف أفضل الأماكن في المدينة المنورة
              </p>
            </div>

            {isManager && (
              <div className="flex flex-wrap gap-2">
                <FilterManagement />
                <button
                  onClick={handleAddNew}
                  className="bg-[#9D7D4E] hover:bg-[#B69D6D] text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md flex items-center gap-2"
                >
                  <span>➕</span>
                  <span>إضافة مكان جديد</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats - using exact colors from palette */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center border border-gray-100">
            <p className="text-2xl font-bold text-[#195B4A]">{places.length}</p>
            <p className="text-sm text-gray-600">إجمالي الأماكن</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center border border-gray-100">
            <p className="text-2xl font-bold text-[#307C5F]">
              {places.filter((p) => p.type === 'religious').length}
            </p>
            <p className="text-sm text-gray-600">أماكن دينية</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center border border-gray-100">
            <p className="text-2xl font-bold text-[#9D7D4E]">
              {places.filter((p) => p.type === 'historical').length}
            </p>
            <p className="text-sm text-gray-600">أماكن تاريخية</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center border border-gray-100">
            <p className="text-2xl font-bold text-[#6C7475]">
              {places.filter((p) => p.type === 'entertainment').length}
            </p>
            <p className="text-sm text-gray-600">أماكن ترفيهية</p>
          </div>
        </div>

        {/* Filters */}
        <PlaceFilters filters={filters} onFilterChange={setFilters} />

        {/* Map Toggle Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowMap(!showMap)}
            className="btn-primary px-6 py-2.5 rounded-lg font-medium shadow-md flex items-center gap-2 mx-auto"
          >
            <span>🗺️</span>
            <span>{showMap ? 'إخفاء الخريطة' : 'عرض الأماكن على الخريطة'}</span>
          </button>
        </div>

        {/* Map */}
        {showMap && (
          <div className="mb-8">
            <PlacesMap places={filteredPlaces} onPlaceClick={handleDetailsClick} />
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-700 font-medium">
            عرض{' '}
            <span className="text-primary-600 font-bold">
              {filteredPlaces.length}
            </span>{' '}
            من {places.length} مكان
          </p>
        </div>

        {/* Places Grid */}
        {filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                onDetailsClick={() => handleDetailsClick(place)}
                onEditClick={() => handleEditClick(place)}
                onDeleteClick={() => handleDeleteClick(place)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              لم يتم العثور على نتائج
            </h3>
            <p className="text-gray-500">
              جرب تغيير الفلاتر للحصول على نتائج مختلفة
            </p>
          </div>
        )}

        {/* Modals */}
        {selectedPlace && (
          <PlaceDetailsModal
            place={selectedPlace}
            isOpen={isDetailsModalOpen}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setSelectedPlace(null);
            }}
          />
        )}

        <PlaceFormModal
          place={editingPlace}
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingPlace(undefined);
          }}
          onSave={handleSavePlace}
        />

        {/* Reservation Modal */}
        {reservationPlace && (
          <ReservationModal
            place={reservationPlace}
            isOpen={showReservationModal}
            onClose={() => {
              setShowReservationModal(false);
              setReservationPlace(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function ReferencePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#195B4A] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">جاري التحميل...</p>
        </div>
      </div>
    }>
      <ReferencePageContent />
    </Suspense>
  );
}
