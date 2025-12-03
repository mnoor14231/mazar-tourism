'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Place } from '@/types';
import { RouteResult } from '@/types/route';
import { formatDistance, formatDuration } from '@/lib/routeUtils';
import { useAuthStore } from '@/lib/store';
import { useSavedRoutesStore } from '@/lib/storeDb';
import JourneyTimeline from './JourneyTimeline';

// Dynamically import map to avoid SSR issues
const EnhancedRouteMap = dynamic(() => import('./EnhancedRouteMap'), { ssr: false });

interface RouteResultModalProps {
  route: RouteResult;
  selectedPlaces: Place[];
  suggestions?: { place: Place; reason: string }[];
  onClose: () => void;
  onReservation: (place: Place) => void;
}

export default function RouteResultModal({
  route,
  selectedPlaces,
  suggestions,
  onClose,
  onReservation,
}: RouteResultModalProps) {
  const user = useAuthStore((state) => state.user);
  const { saveRoute } = useSavedRoutesStore();
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const getSuggestionForPlace = (placeId: string) => {
    return suggestions?.find((s) => s.place.id === placeId);
  };

  // Count places requiring reservation
  const reservationCount = selectedPlaces.filter((p) => p.requiresBooking).length;

  const handleSaveRoute = async () => {
    if (!user) {
      alert('يرجى تسجيل الدخول لحفظ المسار');
      return;
    }

    console.log('[RouteResultModal] Saving route with user:', user);
    console.log('[RouteResultModal] User ID:', user.id || user.username);

    // Validate user has ID
    if (!user.id && !user.username) {
      alert('خطأ: لم يتم العثور على معرف المستخدم. يرجى تسجيل الدخول مرة أخرى.');
      return;
    }

    // Validate we have places
    if (!selectedPlaces || selectedPlaces.length === 0) {
      alert('يرجى إضافة أماكن للمسار قبل الحفظ');
      return;
    }

    // Validate route stops
    if (!route.stops || route.stops.length === 0) {
      alert('خطأ: لا توجد نقاط في المسار');
      return;
    }

    setIsSaving(true);
    try {
      const routeData = {
        userId: user.id || user.username,
        name: `مسار ${new Date().toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' })}`,
        placeIds: selectedPlaces.map(p => p.id),
        startLatitude: route.stops[0].latitude,
        startLongitude: route.stops[0].longitude,
        startLabel: route.stops[0].label,
        totalDistanceKm: route.totalDistanceKm,
        estimatedDurationMins: route.estimatedDurationMinutes,
        routeType: suggestions && suggestions.length > 0 ? 'ai' : 'manual',
        aiPreferences: suggestions && suggestions.length > 0 ? {
          tripType: 'family',
          preferredTypes: [],
        } : undefined,
      };

      console.log('[RouteResultModal] Saving route data:', JSON.stringify(routeData, null, 2));
      const savedRoute = await saveRoute(routeData);
      console.log('[RouteResultModal] Route saved successfully!', savedRoute);

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error('[RouteResultModal] Error saving route:', error);
      const errorMessage = error.message || error.toString();
      alert(`حدث خطأ أثناء حفظ المسار:\n${errorMessage}\n\nيرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-l from-primary-600 to-teal-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div>
              <h2 className="text-xl font-bold">مسارك في المدينة المنورة</h2>
              <p className="text-white/80 text-sm">اضغط على أي مكان في الخريطة لعرض التفاصيل</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="hidden sm:flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{route.stops.length - 1}</div>
              <div className="text-xs text-white/80">أماكن</div>
            </div>
            <div className="w-px h-10 bg-white/30" />
            <div className="text-center">
              <div className="text-2xl font-bold">{formatDistance(route.totalDistanceKm)}</div>
              <div className="text-xs text-white/80">المسافة</div>
            </div>
            <div className="w-px h-10 bg-white/30" />
            <div className="text-center">
              <div className="text-2xl font-bold">{formatDuration(route.estimatedDurationMinutes)}</div>
              <div className="text-xs text-white/80">الوقت</div>
            </div>
          </div>
        </div>

        {/* Reservation Alert */}
        {reservationCount > 0 && (
          <div className="bg-red-50 border-b border-red-200 px-4 py-3 flex items-center gap-3">
            <div className="bg-red-500 text-white rounded-full p-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <span className="text-red-800 font-medium">
                {reservationCount === 1 ? 'مكان واحد' : `${reservationCount} أماكن`} في مسارك يتطلب حجز مسبق
              </span>
              <span className="text-red-600 text-sm mr-2">- اضغط على المكان للحجز</span>
            </div>
          </div>
        )}

        {/* Mobile Stats */}
        <div className="sm:hidden bg-gray-50 border-b px-4 py-2 flex justify-around text-center">
          <div>
            <div className="text-lg font-bold text-gray-800">{route.stops.length - 1}</div>
            <div className="text-xs text-gray-500">أماكن</div>
          </div>
          <div className="w-px bg-gray-300" />
          <div>
            <div className="text-lg font-bold text-gray-800">{formatDistance(route.totalDistanceKm)}</div>
            <div className="text-xs text-gray-500">المسافة</div>
          </div>
          <div className="w-px bg-gray-300" />
          <div>
            <div className="text-lg font-bold text-gray-800">{formatDuration(route.estimatedDurationMinutes)}</div>
            <div className="text-xs text-gray-500">الوقت</div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Journey Timeline */}
            <JourneyTimeline 
              places={selectedPlaces}
              startLocation={{
                label: route.stops[0].label,
                lat: route.stops[0].latitude,
                lng: route.stops[0].longitude
              }}
              onPlaceClick={setSelectedPlace}
              onReservation={onReservation}
            />

            {/* Save Route Button */}
            <div className="flex justify-center">
              {saveSuccess ? (
                <div className="bg-green-50 border-2 border-green-500 text-green-700 px-8 py-3 rounded-xl font-bold flex items-center gap-3 animate-bounce-in shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  تم حفظ المسار بنجاح!
                </div>
              ) : (
                <button
                  onClick={handleSaveRoute}
                  disabled={isSaving || !user}
                  className="bg-gradient-to-r from-[#9D7D4E] to-[#B69D6D] hover:from-[#B69D6D] hover:to-[#9D7D4E] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 transform hover:scale-105"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      {user ? 'احفظ هذا المسار' : 'سجل دخولك للحفظ'}
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Map Container */}
            <div className="h-[400px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
              <EnhancedRouteMap
                route={route}
                selectedPlaces={selectedPlaces}
                suggestions={suggestions}
                onPlaceSelect={setSelectedPlace}
                onReservation={onReservation}
              />
            </div>
          </div>
        </div>

        {/* Footer with Google Maps Link */}
        <div className="bg-gray-50 border-t p-3 flex items-center justify-between gap-4">
          <div className="text-sm text-gray-600 hidden sm:block">
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              نقطة البداية
            </span>
            <span className="mx-3">|</span>
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 bg-primary-500 rounded-full"></span>
              مكان للزيارة
            </span>
            <span className="mx-3">|</span>
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              يتطلب حجز
            </span>
          </div>
          <a
            href={`https://www.google.com/maps/dir/${route.stops.map((s) => `${s.latitude},${s.longitude}`).join('/')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <span>🗺️</span>
            <span>فتح في خرائط جوجل</span>
          </a>
        </div>
      </div>
    </div>
  );
}

