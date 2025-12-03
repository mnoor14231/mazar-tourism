'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Place } from '@/types';
import { RouteResult } from '@/types/route';
import { buildRouteNearestNeighbor, MADINAH_CENTER } from '@/lib/routeUtils';
import { useAuthStore } from '@/lib/store';
import PlaceSelectionCard from './PlaceSelectionCard';

interface ManualSelectionProps {
  places: Place[];
  onRouteGenerated: (route: RouteResult, selectedPlaces: Place[]) => void;
}

export default function ManualSelection({ places, onRouteGenerated }: ManualSelectionProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>([]);
  const [startLocation, setStartLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [startDescription, setStartDescription] = useState('');
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const MAX_PLACES = 3;

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

    if (selectedPlaceIds.length === 0) {
      setError('الرجاء اختيار مكان واحد على الأقل.');
      return;
    }

    // REQUIRED: Must detect location first
    if (!startLocation) {
      setError('يجب تحديد موقعك أولاً.');
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
    
    // Use detected location
    const startLat = startLocation.lat;
    const startLon = startLocation.lng;
    const startLabel = 'موقعك الحالي';

    const route = buildRouteNearestNeighbor(startLat, startLon, startLabel, selectedPlaces);
    onRouteGenerated(route, selectedPlaces);
  };

  return (
    <div className="space-y-6">
      {/* Selection Counter */}
      <div className="bg-primary-50 rounded-xl p-4 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-primary-800">الأماكن المختارة</h3>
          <p className="text-sm text-primary-600">
            اختر من 1 إلى {MAX_PLACES} أماكن لإنشاء المسار
          </p>
        </div>
        <div className="bg-white rounded-full px-4 py-2 shadow-sm">
          <span className="text-2xl font-bold text-primary-600">{selectedPlaceIds.length}</span>
          <span className="text-gray-500 text-sm"> / {MAX_PLACES}</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Location Status */}
      {locationStatus === 'success' && startLocation && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <p className="font-semibold text-green-800">تم تحديد موقعك</p>
              <p className="text-sm text-green-600">سيبدأ المسار من موقعك الحالي</p>
            </div>
          </div>
          <button
            onClick={() => {
              setLocationStatus('idle');
              setStartLocation(null);
            }}
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            إعادة
          </button>
        </div>
      )}

      {/* Location Error */}
      {locationStatus === 'error' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-800">
            ⚠️ سيتم استخدام وسط المدينة المنورة كنقطة بداية افتراضية
          </p>
        </div>
      )}

      {/* Places Grid */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3">اختر الأماكن ({places.length} مكان متاح)</h3>
        
        {places.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-600">لا توجد أماكن مطابقة للفلاتر المحددة</p>
            <p className="text-sm text-gray-500 mt-1">جرب تغيير الفلاتر للعثور على أماكن</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

      {/* Build Route Buttons */}
      <div className="sticky bottom-4 space-y-3">
        {/* Location Detection Button - REQUIRED */}
        <button
          onClick={handleGetLocation}
          disabled={locationStatus === 'loading'}
          className={`w-full py-3 rounded-xl font-medium transition-all shadow-md ${
            locationStatus === 'loading'
              ? 'bg-gray-300 text-gray-600 cursor-wait'
              : locationStatus === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-primary-100 border-2 border-primary-400 text-primary-700 hover:bg-primary-200'
          }`}
        >
          {locationStatus === 'loading' ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              جاري تحديد موقعك...
            </span>
          ) : locationStatus === 'success' ? (
            <span className="flex items-center justify-center gap-2">
              ✓ تم تحديد موقعك (انقر للتحديث)
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              📍 تحديد موقعي الحالي (مطلوب)
            </span>
          )}
        </button>

        {/* Create Route Button - Disabled until location detected */}
        <button
          onClick={handleBuildRoute}
          disabled={selectedPlaceIds.length === 0 || !startLocation}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
            selectedPlaceIds.length > 0 && startLocation
              ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {!startLocation 
            ? '🗺️ إنشاء المسار (حدد موقعك أولاً)'
            : `🗺️ إنشاء المسار (${selectedPlaceIds.length} ${selectedPlaceIds.length === 1 ? 'مكان' : 'أماكن'})`
          }
        </button>

        {/* Hint */}
        {selectedPlaceIds.length > 0 && (
          <p className={`text-xs text-center ${startLocation ? 'text-green-600' : 'text-orange-600'}`}>
            {startLocation 
              ? '✓ جاهز! سيبدأ المسار من موقعك الحالي'
              : '⚠️ يجب تحديد موقعك أولاً لإنشاء المسار'
            }
          </p>
        )}
      </div>
    </div>
  );
}

