'use client';

import { Place } from '@/types';
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

  const getTypeBgColor = (type: string) => {
    const colors: Record<string, string> = {
      religious: '#2D4A3E',
      historical: '#C38822',
      entertainment: '#6B5B95',
      shopping: '#E74C3C',
      restaurant: '#3498DB',
    };
    return colors[type] || '#6B7280';
  };

  return (
    <div className="bg-white rounded-[10px] shadow-md p-4 border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5" style={{ color: '#2D4A3E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <h3 className="text-lg font-bold text-gray-800">مسار رحلتك</h3>
        <div className="flex-1 h-0.5" style={{ background: 'linear-gradient(to left, transparent, #2D4A3E)' }}></div>
      </div>

      {/* Timeline Container - Horizontal Layout */}
      <div className="relative">
        <div className="overflow-x-auto pb-2 scrollbar-thin">
          <div className="flex items-center gap-0 min-w-max px-2">
            {/* Start Location */}
            {startLocation && (
              <>
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110" style={{ backgroundColor: '#C38822' }}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm" style={{ color: '#C38822', border: '2px solid #C38822' }}>
                      0
                    </div>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-gray-700 text-center max-w-[80px] line-clamp-2">
                    {startLocation.label || 'نقطة البداية'}
                  </p>
                  <span className="text-xs px-2 py-0.5 rounded-full mt-1" style={{ backgroundColor: 'rgba(195, 136, 34, 0.1)', color: '#C38822' }}>
                    البداية
                  </span>
                </div>

                {/* Connecting Line */}
                <div className="flex-shrink-0 h-0.5 w-10 mx-2" style={{ background: 'linear-gradient(to left, #2D4A3E, #C38822)' }}></div>
              </>
            )}

            {/* Places */}
            {places.map((place, index) => (
              <div key={place.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <button
                      onClick={() => handlePlaceClick(place)}
                      className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 border-2 border-white cursor-pointer focus:outline-none"
                      style={{ backgroundColor: getTypeBgColor(place.type) }}
                    >
                      {place.images && place.images[0] ? (
                        <img
                          src={place.images[0]}
                          alt={place.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      )}
                    </button>
                    
                    {/* Order Number Badge */}
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm pointer-events-none" style={{ color: '#2D4A3E', border: '2px solid #2D4A3E' }}>
                      {index + 1}
                    </div>

                    {/* Booking Required Badge */}
                    {place.requiresBooking && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReservation(place);
                        }}
                        className="absolute -bottom-1 -left-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-md border border-white hover:bg-red-600 hover:scale-110 transition-all cursor-pointer z-10"
                        title="احجز الآن"
                      >
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                    )}

                    {/* Hover Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                      <div className="bg-gray-800 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
                        <p className="font-bold text-sm mb-1">{place.name}</p>
                        {place.requiresBooking && (
                          <p className="text-red-300 text-xs">يتطلب حجز مسبق</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handlePlaceClick(place)}
                    className="mt-2 text-xs font-semibold text-gray-700 text-center max-w-[80px] line-clamp-2 hover:opacity-80 transition-colors"
                  >
                    {place.name}
                  </button>
                  {/* Category Badge instead of location */}
                  <span 
                    className="text-xs px-2 py-0.5 rounded-full mt-1 text-white font-medium"
                    style={{ backgroundColor: getTypeBgColor(place.type) }}
                  >
                    {getTypeLabel(place.type)}
                  </span>
                </div>

                {/* Connecting Line */}
                {index < places.length - 1 && (
                  <div className="flex-shrink-0 relative mx-2">
                    <div className="h-0.5 w-10" style={{ backgroundColor: '#2D4A3E' }}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <svg width="12" height="12" viewBox="0 0 12 12" style={{ color: '#2D4A3E' }}>
                        <path d="M6 0 L10 6 L6 5 L2 6 Z" fill="currentColor" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Hint */}
        {places.length > 4 && (
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
        )}
      </div>

      {/* Interactive Place Details Card */}
      {selectedPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[10px] shadow-2xl max-w-md w-full overflow-hidden">
            {/* Image Header */}
            <div className="relative h-48">
              {selectedPlace.images && selectedPlace.images[0] ? (
                <img
                  src={selectedPlace.images[0]}
                  alt={selectedPlace.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: getTypeBgColor(selectedPlace.type) }}>
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
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
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>يتطلب حجز</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedPlace.name}</h3>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span 
                  className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: getTypeBgColor(selectedPlace.type) }}
                >
                  {getTypeLabel(selectedPlace.type)}
                </span>
                {selectedPlace.environment && (
                  <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: 'rgba(45, 74, 62, 0.1)', color: '#2D4A3E' }}>
                    {selectedPlace.environment === 'indoor' ? 'داخلي' : selectedPlace.environment === 'outdoor' ? 'خارجي' : 'مختلط'}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                {selectedPlace.description}
              </p>

              {/* Info */}
              <div className="space-y-2 mb-5">
                {selectedPlace.openingHours && (
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-600">ساعات العمل:</span>
                    <span className="font-semibold text-gray-800">{selectedPlace.openingHours}</span>
                  </div>
                )}
                {selectedPlace.bookingsCount > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-gray-600">عدد الزوار:</span>
                    <span className="font-semibold" style={{ color: '#2D4A3E' }}>{selectedPlace.bookingsCount.toLocaleString('ar-SA')}</span>
                  </div>
                )}
                {selectedPlace.reservationPrice && selectedPlace.reservationPrice > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-600">السعر:</span>
                    <span className="font-semibold" style={{ color: '#C38822' }}>{selectedPlace.reservationPrice} ريال</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {selectedPlace.requiresBooking && onReservation && (
                  <button
                    onClick={() => handleReservation(selectedPlace)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-[10px] font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>احجز الآن</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedPlace(null)}
                  className={`${selectedPlace.requiresBooking ? 'flex-1' : 'w-full'} text-white py-3 px-4 rounded-[10px] font-bold transition-all flex items-center justify-center gap-2`}
                  style={{ backgroundColor: '#2D4A3E' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
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

