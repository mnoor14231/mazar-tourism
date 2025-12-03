'use client';

import { Place } from '@/types';
import Image from 'next/image';
import { useState } from 'react';

interface JourneyTimelineProps {
  places: Place[];
  startLocation?: { label: string; lat: number; lng: number };
  onPlaceClick?: (place: Place) => void;
  onReservation?: (place: Place) => void;
}

export default function JourneyTimeline({ places, startLocation, onPlaceClick, onReservation }: JourneyTimelineProps) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  if (places.length === 0) return null;

  const handlePlaceClick = (place: Place) => {
    setSelectedPlace(place);
    if (onPlaceClick) {
      onPlaceClick(place);
    }
  };

  const handleReservation = (place: Place) => {
    if (onReservation) {
      onReservation(place);
    }
    setSelectedPlace(null);
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      religious: '🕌',
      historical: '🏛️',
      entertainment: '🎭',
      shopping: '🛍️',
      restaurant: '🍽️',
    };
    return icons[type] || '📍';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      religious: 'ديني',
      historical: 'تاريخي',
      entertainment: 'ترفيهي',
      shopping: 'تسوق',
      restaurant: 'مطعم',
    };
    return labels[type] || type;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-2 mb-6">
        <div className="text-2xl">🗺️</div>
        <h3 className="text-xl font-bold text-gray-800">مسار رحلتك</h3>
        <div className="flex-1 h-0.5 bg-gradient-to-r from-[#195B4A] to-transparent"></div>
      </div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Horizontal Scroll Container */}
        <div className="overflow-x-auto pb-4 scrollbar-thin">
          <div className="flex items-center gap-0 min-w-max px-2">
            {/* Start Location */}
            {startLocation && (
              <>
                <div className="flex flex-col items-center journey-timeline-item animate-fade-in">
                  <div className="relative group">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#9D7D4E] to-[#B69D6D] flex items-center justify-center text-2xl shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl">
                      🚩
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-[#9D7D4E] shadow-md border-2 border-[#B69D6D]">
                      0
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-gray-800 text-center max-w-[100px] line-clamp-2">
                    {startLocation.label || 'نقطة البداية'}
                  </p>
                  <p className="text-xs text-gray-500">البداية</p>
                </div>

                {/* Connecting Line */}
                <div className="flex-shrink-0 h-0.5 w-12 bg-gradient-to-r from-[#B69D6D] via-[#307C5F] to-[#195B4A] mx-2"></div>
              </>
            )}

            {/* Places */}
            {places.map((place, index) => (
              <div key={place.id} className="flex items-center">
                <div className="flex flex-col items-center journey-timeline-item animate-fade-in" style={{ animationDelay: `${(index + 1) * 100}ms` }}>
                  <div className="relative group">
                    {/* Place Image/Icon - Now Clickable */}
                    <button
                      onClick={() => handlePlaceClick(place)}
                      className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-[#195B4A] to-[#307C5F] flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl border-4 border-white cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#B69D6D]/50"
                    >
                      {place.images && place.images[0] ? (
                        <img
                          src={place.images[0]}
                          alt={place.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl">{getTypeIcon(place.type)}</span>
                      )}
                    </button>
                    
                    {/* Order Number Badge */}
                    <div className="absolute -top-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-[#195B4A] shadow-md border-2 border-[#307C5F] pointer-events-none">
                      {index + 1}
                    </div>

                    {/* Booking Required Badge - Clickable */}
                    {place.requiresBooking && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReservation(place);
                        }}
                        className="absolute -bottom-1 -left-1 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:bg-red-600 hover:scale-110 transition-all cursor-pointer z-10"
                        title="احجز الآن"
                      >
                        <span className="text-xs">📅</span>
                      </button>
                    )}

                    {/* Enhanced Hover Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white text-xs rounded-xl py-3 px-4 whitespace-nowrap shadow-2xl border border-gray-700">
                        <p className="font-bold text-sm mb-1">{place.name}</p>
                        <p className="text-gray-300 mb-1">{getTypeLabel(place.type)}</p>
                        {place.requiresBooking && (
                          <p className="text-red-300 flex items-center gap-1">
                            <span>📅</span>
                            <span>يتطلب حجز مسبق</span>
                          </p>
                        )}
                        <p className="text-[#B69D6D] text-xs mt-2 font-medium">اضغط للتفاصيل</p>
                      </div>
                      <div className="w-2 h-2 bg-gray-900 transform rotate-45 absolute top-full left-1/2 -translate-x-1/2 -mt-1"></div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handlePlaceClick(place)}
                    className="mt-3 text-sm font-semibold text-gray-800 text-center max-w-[120px] line-clamp-2 hover:text-[#195B4A] transition-colors"
                  >
                    {place.name}
                  </button>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#195B4A]/10 text-[#195B4A] font-medium">
                      {getTypeLabel(place.type)}
                    </span>
                  </div>
                </div>

                {/* Connecting Line */}
                {index < places.length - 1 && (
                  <div className="flex-shrink-0 relative mx-3">
                    <div className="h-0.5 w-12 bg-gradient-to-r from-[#195B4A] to-[#307C5F]"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <svg width="16" height="16" viewBox="0 0 16 16" className="text-[#307C5F]">
                        <path d="M8 0 L12 8 L8 7 L4 8 Z" fill="currentColor" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Hint */}
        {places.length > 3 && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/50 pointer-events-none"></div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-6 flex-wrap">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-2xl">📍</span>
          <span className="text-gray-600">عدد الأماكن:</span>
          <span className="font-bold text-[#195B4A]">{places.length}</span>
        </div>
        {places.some(p => p.requiresBooking) && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-2xl">📅</span>
            <span className="text-gray-600">يتطلب حجز:</span>
            <span className="font-bold text-red-600">
              {places.filter(p => p.requiresBooking).length}
            </span>
          </div>
        )}
      </div>

      {/* Interactive Place Details Card */}
      {selectedPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-bounce-in">
            {/* Image Header */}
            <div className="relative h-48">
              {selectedPlace.images && selectedPlace.images[0] ? (
                <img
                  src={selectedPlace.images[0]}
                  alt={selectedPlace.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#195B4A] to-[#307C5F] flex items-center justify-center">
                  <span className="text-6xl">{getTypeIcon(selectedPlace.type)}</span>
                </div>
              )}
              <button
                onClick={() => setSelectedPlace(null)}
                className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {selectedPlace.requiresBooking && (
                <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                  <span>📅</span>
                  <span>يتطلب حجز</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedPlace.name}</h3>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-[#195B4A]/10 text-[#195B4A] rounded-full text-sm font-semibold">
                  {getTypeLabel(selectedPlace.type)}
                </span>
                {selectedPlace.environment && (
                  <span className="px-3 py-1 bg-[#307C5F]/10 text-[#307C5F] rounded-full text-sm font-semibold">
                    {selectedPlace.environment === 'indoor' ? '🏠 داخلي' : selectedPlace.environment === 'outdoor' ? '🌳 خارجي' : '🏠🌳 مختلط'}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-4 leading-relaxed">
                {selectedPlace.description}
              </p>

              {/* Info */}
              <div className="space-y-2 mb-6">
                {selectedPlace.openingHours && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-xl">⏰</span>
                    <span className="text-gray-600">ساعات العمل:</span>
                    <span className="font-semibold text-gray-800">{selectedPlace.openingHours}</span>
                  </div>
                )}
                {selectedPlace.bookingsCount > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-xl">👥</span>
                    <span className="text-gray-600">عدد الزوار:</span>
                    <span className="font-semibold text-[#195B4A]">{selectedPlace.bookingsCount.toLocaleString('ar-SA')}</span>
                  </div>
                )}
                {selectedPlace.reservationPrice && selectedPlace.reservationPrice > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-xl">💰</span>
                    <span className="text-gray-600">السعر:</span>
                    <span className="font-semibold text-[#9D7D4E]">{selectedPlace.reservationPrice} ريال</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {selectedPlace.requiresBooking && onReservation && (
                  <button
                    onClick={() => handleReservation(selectedPlace)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-xl font-bold transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>📅</span>
                    <span>احجز الآن</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedPlace(null)}
                  className={`${selectedPlace.requiresBooking ? 'flex-1' : 'w-full'} bg-gradient-to-r from-[#195B4A] to-[#307C5F] hover:from-[#307C5F] hover:to-[#195B4A] text-white py-3 px-4 rounded-xl font-bold transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2`}
                >
                  <span>✓</span>
                  <span>تم</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

