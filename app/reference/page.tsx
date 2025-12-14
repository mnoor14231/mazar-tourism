'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Image from 'next/image';
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

  // Hero carousel images - using place images
  const heroImages = useMemo(() => {
    const uniqueImages = new Set<string>();
    places.forEach(place => {
      if (place.images && place.images.length > 0) {
        place.images.forEach(img => uniqueImages.add(img));
      }
    });
    return Array.from(uniqueImages).slice(0, 8);
  }, [places]);

  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  // Auto-rotate hero images
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Search state
  const [searchValue, setSearchValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter places based on search
  const searchFilteredPlaces = useMemo(() => {
    if (!searchValue.trim()) return filteredPlaces;
    const searchLower = searchValue.toLowerCase();
    return filteredPlaces.filter(place =>
      place.name.toLowerCase().includes(searchLower) ||
      place.description.toLowerCase().includes(searchLower)
    );
  }, [filteredPlaces, searchValue]);

  return (
    <div className="min-h-screen scroll-smooth" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Hero Section with Image Carousel - Matching Figma */}
      <div className="relative h-[400px] sm:h-[500px] overflow-hidden">
        {/* Background Images Carousel */}
        <div className="absolute inset-0">
          {heroImages.length > 0 ? (
            <>
              {heroImages.map((img, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    idx === currentHeroImage ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image
                    src={img || '/landingpage.jpg'}
                    alt={`صورة ${idx + 1}`}
                    fill
                    className="object-cover"
                    priority={idx === 0}
                  />
                </div>
              ))}
            </>
          ) : (
            <Image
              src="/landingpage.jpg"
              alt="المدينة المنورة"
              fill
              className="object-cover"
              priority
            />
          )}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B2F29]/70 via-[#0D3B2F]/50 to-[#195B4A]/80" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              مرجع الأماكن
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
              اكتشف أفضل الأماكن في المدينة المنورة
            </p>
          </div>
        </div>

        {/* Carousel Navigation Dots */}
        {heroImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentHeroImage(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentHeroImage
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Manager Actions */}
        {isManager && (
          <div className="flex flex-wrap gap-2 mb-6">
            <FilterManagement />
            <button
              onClick={handleAddNew}
              className="bg-[#9D7D4E] hover:bg-[#B69D6D] text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>إضافة مكان جديد</span>
            </button>
          </div>
        )}

        {/* Search Section - Matching Figma */}
        <div className="mb-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="ابحث عن المكان..."
                className="w-full px-4 py-3 pr-12 rounded-[10px] border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ ['--tw-ring-color' as any]: '#2D4A3E' }}
              />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 rounded-[10px] border border-gray-200 bg-white hover:bg-gray-50 transition-colors flex items-center gap-2 relative"
              style={showFilters ? { backgroundColor: '#2D4A3E', color: 'white', borderColor: '#2D4A3E' } : {}}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4">
              <PlaceFilters filters={filters} onFilterChange={setFilters} />
            </div>
          )}
        </div>

        {/* Map Toggle Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowMap(!showMap)}
            className="px-6 py-2.5 rounded-lg font-medium shadow-md flex items-center gap-2 mx-auto transition-all hover:opacity-90"
            style={{ backgroundColor: '#2D4A3E', color: 'white' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span>{showMap ? 'إخفاء الخريطة' : 'عرض الأماكن على الخريطة'}</span>
          </button>
        </div>

        {/* Map */}
        {showMap && (
          <div className="mb-8">
            <PlacesMap places={searchFilteredPlaces} onPlaceClick={handleDetailsClick} />
          </div>
        )}

        {/* Results Count - Matching Figma */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            عرض {searchFilteredPlaces.length} من {places.length} مكان
          </h3>
        </div>

        {/* Places Grid */}
        {searchFilteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchFilteredPlaces.map((place) => (
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
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              لم يتم العثور على نتائج
            </h3>
            <p className="text-gray-500">
              جرب تغيير الفلاتر أو البحث للحصول على نتائج مختلفة
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
