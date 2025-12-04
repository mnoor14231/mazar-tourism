'use client';

import { useEffect, useState } from 'react';
import { SavedRoute, Place } from '@/types';
import { useSavedRoutesStore, usePlacesStore } from '@/lib/storeDb';
import { useAuthStore } from '@/lib/store';
import { formatDistance, formatDuration } from '@/lib/routeUtils';
import JourneyTimeline from './routes/JourneyTimeline';
import PlaceDetailsModal from './PlaceDetailsModal';
import ReservationModal from './ReservationModal';

interface SavedRoutesProps {
  onLoadRoute?: (route: SavedRoute) => void;
}

export default function SavedRoutes({ onLoadRoute }: SavedRoutesProps) {
  const user = useAuthStore((state) => state.user);
  const { routes, isLoading, fetchRoutes, deleteRoute } = useSavedRoutesStore();
  const { places } = usePlacesStore();
  const [expandedRoute, setExpandedRoute] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [placeForReservation, setPlaceForReservation] = useState<Place | null>(null);

  useEffect(() => {
    if (user) {
      // Use the same userId format as when saving (id or username as fallback)
      const userId = user.id || user.username;
      console.log('[SavedRoutes] Fetching routes for userId:', userId);
      fetchRoutes(userId);
    }
  }, [user, fetchRoutes]);

  const getPlacesByIds = (placeIds: string[]): Place[] => {
    return placeIds
      .map((id) => places.find((p) => p.id === id))
      .filter((p): p is Place => p !== undefined);
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المسار؟')) {
      await deleteRoute(id);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-50 rounded-xl p-8 text-center">
        <p className="text-gray-600">يرجى تسجيل الدخول لعرض المسارات المحفوظة</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="text-gray-600 mt-4">جاري التحميل...</p>
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-8 text-center">
        <div className="text-5xl mb-4">🗺️</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد مسارات محفوظة</h3>
        <p className="text-gray-600">قم بإنشاء مسار جديد وحفظه لرؤيته هنا</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <span className="text-4xl">🗺️</span>
          رحلاتي السابقة
        </h2>
        <div className="text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg" style={{ backgroundColor: 'var(--color-button-normal)' }}>
          {routes.length}
        </div>
      </div>
      
      {routes.map((route) => {
        const routePlaces = getPlacesByIds(route.placeIds);
        const isExpanded = expandedRoute === route.id;

        return (
          <div
            key={route.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#195B4A]/30"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-[#195B4A]/5 to-transparent border-b border-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{route.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        route.routeType === 'ai'
                          ? 'bg-gradient-to-r from-[#9D7D4E] to-[#B69D6D] text-white'
                          : 'bg-gradient-to-r from-[#195B4A] to-[#307C5F] text-white'
                      }`}
                    >
                      {route.routeType === 'ai' ? '🧔 ابن المدينة' : '✋ يدوي'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-2 text-gray-700 bg-white px-3 py-1 rounded-lg shadow-sm">
                      <span className="text-lg">📍</span>
                      <span className="font-semibold">{routePlaces.length}</span>
                      <span>{routePlaces.length === 1 ? 'مكان' : 'أماكن'}</span>
                    </span>
                    <span className="flex items-center gap-2 text-gray-700 bg-white px-3 py-1 rounded-lg shadow-sm">
                      <span className="text-lg">📏</span>
                      <span className="font-semibold">{formatDistance(route.totalDistanceKm)}</span>
                    </span>
                    <span className="flex items-center gap-2 text-gray-700 bg-white px-3 py-1 rounded-lg shadow-sm">
                      <span className="text-lg">⏱️</span>
                      <span className="font-semibold">{formatDuration(route.estimatedDurationMins)}</span>
                    </span>
                    <span className="flex items-center gap-2 text-gray-500 text-xs">
                      <span>🗓️</span>
                      {new Date(route.createdAt).toLocaleDateString('ar-SA', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2 flex-wrap justify-end">
                  <button
                    onClick={() => setExpandedRoute(isExpanded ? null : route.id)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-all hover:scale-105 shadow-sm"
                  >
                    {isExpanded ? '⬆️ إخفاء' : '⬇️ عرض التفاصيل'}
                  </button>
                  {onLoadRoute && (
                    <button
                      onClick={() => onLoadRoute(route)}
                      className="bg-gradient-to-r from-[#195B4A] to-[#307C5F] hover:from-[#307C5F] hover:to-[#195B4A] text-white py-2 px-4 rounded-lg text-sm font-bold transition-all hover:scale-105 shadow-md"
                    >
                      🗺️ فتح المسار
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(route.id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all hover:scale-105 shadow-sm"
                  >
                    🗑️ حذف
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
                {/* Journey Timeline Preview */}
                <div className="mb-6">
                  <JourneyTimeline 
                    places={routePlaces}
                    startLocation={{
                      label: route.startLabel,
                      lat: route.startLatitude,
                      lng: route.startLongitude
                    }}
                    onPlaceClick={setSelectedPlace}
                    onReservation={setPlaceForReservation}
                  />
                </div>

                {/* AI Preferences */}
                {route.aiPreferences && (
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="text-2xl">🧔</span>
                      تفضيلات ابن المدينة
                    </h4>
                    <div className="bg-gradient-to-r from-[#9D7D4E]/10 to-[#B69D6D]/10 rounded-xl p-4 border border-[#B69D6D]/30">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">👥</span>
                          <span className="text-gray-600">نوع الرحلة:</span>
                          <span className="font-semibold text-gray-800">
                            {route.aiPreferences.tripType === 'family' ? 'عائلية' : 'فردية'}
                          </span>
                        </div>
                        {route.aiPreferences.age && (
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🎂</span>
                            <span className="text-gray-600">العمر:</span>
                            <span className="font-semibold text-gray-800">{route.aiPreferences.age} سنة</span>
                          </div>
                        )}
                        {route.aiPreferences.preferredTypes && route.aiPreferences.preferredTypes.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-lg">❤️</span>
                            <span className="text-gray-600">الأماكن المفضلة:</span>
                            <span className="font-semibold text-gray-800">
                              {route.aiPreferences.preferredTypes.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Route Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                    <div className="text-3xl mb-2">🕌</div>
                    <div className="text-2xl font-bold text-[#195B4A]">
                      {routePlaces.filter(p => p.type === 'religious').length}
                    </div>
                    <div className="text-xs text-gray-600">أماكن دينية</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                    <div className="text-3xl mb-2">🏛️</div>
                    <div className="text-2xl font-bold text-[#307C5F]">
                      {routePlaces.filter(p => p.type === 'historical').length}
                    </div>
                    <div className="text-xs text-gray-600">أماكن تاريخية</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                    <div className="text-3xl mb-2">🎭</div>
                    <div className="text-2xl font-bold text-[#9D7D4E]">
                      {routePlaces.filter(p => p.type === 'entertainment').length}
                    </div>
                    <div className="text-xs text-gray-600">أماكن ترفيهية</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                    <div className="text-3xl mb-2">📅</div>
                    <div className="text-2xl font-bold text-red-600">
                      {routePlaces.filter(p => p.requiresBooking).length}
                    </div>
                    <div className="text-xs text-gray-600">تتطلب حجز</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Place Details Modal */}
      {selectedPlace && (
        <PlaceDetailsModal
          place={selectedPlace}
          isOpen={!!selectedPlace}
          onClose={() => setSelectedPlace(null)}
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
    </div>
  );
}

