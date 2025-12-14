'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Place } from '@/types';
import { RouteResult } from '@/types/route';
import { buildRouteNearestNeighbor, MADINAH_CENTER } from '@/lib/routeUtils';
import { useAuthStore } from '@/lib/store';
import PlaceSelectionCard from './PlaceSelectionCard';

interface FilterState {
  [key: string]: string | string[];
}

interface ManualSelectionProps {
  places: Place[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onRouteGenerated: (route: RouteResult, selectedPlaces: Place[]) => void;
}

export default function ManualSelection({ places, filters, onFilterChange, onRouteGenerated }: ManualSelectionProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>([]);
  const [startLocation, setStartLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [startDescription, setStartDescription] = useState('');
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const MAX_PLACES = 3;
  const MIN_PLACES = 3;

  // Get search value
  const searchValue = (filters.search as string) || '';

  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, search: value });
  };

  // Check for pending route on mount
  useEffect(() => {
    const pendingRoute = localStorage.getItem('pendingRouteSelection');
    if (pendingRoute && user) {
      try {
        const data = JSON.parse(pendingRoute);
        setSelectedPlaceIds(data.selectedPlaceIds || []);
        setStartDescription(data.startDescription || '');
        if (data.startLocation) {
          setStartLocation(data.startLocation);
          setLocationStatus('success');
        }
        localStorage.removeItem('pendingRouteSelection');
      } catch (e) {
        console.error('Error parsing pending route:', e);
      }
    }
  }, [user]);

  const handleTogglePlace = (placeId: string) => {
    setError('');
    if (selectedPlaceIds.includes(placeId)) {
      setSelectedPlaceIds((prev) => prev.filter((id) => id !== placeId));
    } else {
      if (selectedPlaceIds.length >= MAX_PLACES) {
        setError('يمكنك اختيار ثلاثة أماكن كحد أقصى في المسار الواحد.');
        return;
      }
      setSelectedPlaceIds((prev) => [...prev, placeId]);
    }
  };

  const handleGetLocation = () => {
    setLocationStatus('loading');
    setError('');

    if (!navigator.geolocation) {
      setLocationStatus('error');
      setError('المتصفح لا يدعم خدمة تحديد الموقع.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const detectedLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log('🎯 Location detected:', detectedLocation);
        console.log('📍 Accuracy:', position.coords.accuracy, 'meters');
        console.log('🗺️ Google Maps Link:', `https://www.google.com/maps?q=${detectedLocation.lat},${detectedLocation.lng}`);
        
        setStartLocation(detectedLocation);
        setLocationStatus('success');
      },
      (err) => {
        setLocationStatus('error');
        console.error('❌ Geolocation error:', err);
        if (err.code === err.PERMISSION_DENIED) {
          setError('تم رفض إذن تحديد الموقع. يرجى السماح بالوصول للموقع.');
        } else if (err.code === err.TIMEOUT) {
          setError('انتهت مهلة تحديد الموقع. يرجى المحاولة مرة أخرى.');
        } else {
          setError('حدث خطأ في تحديد الموقع. يرجى المحاولة مرة أخرى.');
        }
      },
      { 
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  const handleBuildRoute = () => {
    setError('');

    if (selectedPlaceIds.length < MIN_PLACES) {
      setError(`يجب اختيار ${MIN_PLACES} أماكن على الأقل لإنشاء المسار.`);
      return;
    }

    // Check if user is logged in
    if (!user) {
      // Save selection to localStorage for after login
      localStorage.setItem('pendingRouteSelection', JSON.stringify({
        selectedPlaceIds,
        startLocation,
        startDescription,
      }));
      localStorage.setItem('pendingRouteRedirect', '/routes');
      router.push('/login');
      return;
    }

    const selectedPlaces = places.filter((p) => selectedPlaceIds.includes(p.id));
    
    // LOCATION IS NOW OPTIONAL
    // If location is detected, use it. Otherwise, use first selected place as start point
    let startLat: number;
    let startLon: number;
    let startLabel: string;
    
    if (startLocation) {
      // Use detected location
      startLat = startLocation.lat;
      startLon = startLocation.lng;
      startLabel = 'موقعك الحالي';
    } else {
      // Use first selected place as start point
      const firstPlace = selectedPlaces[0];
      startLat = firstPlace.latitude;
      startLon = firstPlace.longitude;
      startLabel = firstPlace.name;
    }

    const route = buildRouteNearestNeighbor(startLat, startLon, startLabel, selectedPlaces);
    onRouteGenerated(route, selectedPlaces);
  };

  return (
    <div className="space-y-6">

      {/* Location Card - Matching Figma design */}
      <div
        className={`w-full rounded-[10px] border-2 p-4 flex items-center gap-3 cursor-pointer transition-all ${
          locationStatus === 'loading'
            ? 'bg-gray-100 border-gray-300 cursor-wait'
            : locationStatus === 'success'
            ? 'bg-green-50 border-green-300'
            : 'bg-white border-gray-200 hover:border-gray-300'
        }`}
        onClick={locationStatus !== 'loading' ? handleGetLocation : undefined}
      >
        {/* Checkbox */}
        <div className="flex-shrink-0">
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
              locationStatus === 'success'
                ? 'border-transparent'
                : 'border-gray-300'
            }`}
            style={locationStatus === 'success' ? { backgroundColor: '#C38822' } : {}}
          >
            {locationStatus === 'success' && (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1">
          <p className="font-medium text-gray-800 text-sm">استخدم موقعي الحالي</p>
          <p className="text-xs text-gray-600 mt-0.5">كنقطة بداية للمسار</p>
        </div>

        {/* Icon */}
        <div className="flex-shrink-0">
          {locationStatus === 'loading' ? (
            <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#C38822' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </div>
      </div>


      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[10px] text-sm">
          {error}
        </div>
      )}

      {/* Places Section */}
      <div>
        <h3 className="font-bold text-gray-800 mb-2" style={{ color: '#2D4A3E', fontSize: '1.25rem' }}>اختر الأماكن التي تريد زيارتها</h3>
        <p className="text-sm text-gray-600 mb-4">
          {selectedPlaceIds.length} أماكن مختارة (يجب اختيار {MIN_PLACES} أماكن على الأقل)
        </p>

        {/* Search Box with Filter Icon */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="ابحث عن المكان..."
              className="w-full px-4 py-3 pr-10 rounded-[10px] border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent"
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
        
        {/* Places Grid */}
        {places.length === 0 ? (
          <div className="bg-gray-50 rounded-[10px] p-8 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-gray-600">لا توجد أماكن متاحة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {places.map((place) => (
              <PlaceSelectionCard
                key={place.id}
                place={place}
                isSelected={selectedPlaceIds.includes(place.id)}
                onToggle={() => handleTogglePlace(place.id)}
                disabled={selectedPlaceIds.length >= MAX_PLACES && !selectedPlaceIds.includes(place.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Build Route Button - Fixed at bottom */}
      <div className="sticky bottom-4">
        <button
          onClick={handleBuildRoute}
          disabled={selectedPlaceIds.length < MIN_PLACES}
          className={`w-full py-4 rounded-[10px] text-lg font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
            selectedPlaceIds.length >= MIN_PLACES
              ? 'text-white hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          style={selectedPlaceIds.length >= MIN_PLACES ? { backgroundColor: '#2D4A3E' } : {}}
        >
          {selectedPlaceIds.length < MIN_PLACES ? (
            <>
              <span>اختر {MIN_PLACES - selectedPlaceIds.length} أماكن أخرى</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span>إنشاء المسار ({selectedPlaceIds.length} {selectedPlaceIds.length === 1 ? 'مكان' : 'أماكن'})</span>
            </>
          )}
        </button>

        {/* Hint */}
        {selectedPlaceIds.length >= MIN_PLACES && (
          <p className={`text-xs text-center mt-2 ${startLocation ? 'text-green-600' : 'text-gray-500'}`}>
            {startLocation 
              ? '✓ سيبدأ المسار من موقعك الحالي'
              : `سيبدأ المسار من ${places.find(p => p.id === selectedPlaceIds[0])?.name || 'أول مكان'}`
            }
          </p>
        )}
      </div>
    </div>
  );
}

