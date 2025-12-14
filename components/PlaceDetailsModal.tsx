'use client';

import { useState } from 'react';
import { Place } from '@/types';
import ReservationModal from './ReservationModal';

interface PlaceDetailsModalProps {
  place: Place;
  isOpen: boolean;
  onClose: () => void;
}

export default function PlaceDetailsModal({
  place,
  isOpen,
  onClose,
}: PlaceDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReservationModal, setShowReservationModal] = useState(false);

  if (!isOpen) return null;

  const getCrowdLabel = (level?: string) => {
    const labels: Record<string, string> = {
      low: 'منخفض',
      medium: 'متوسط',
      high: 'عالي',
    };
    return level ? labels[level] : 'غير محدد';
  };

  const getCrowdColor = (level?: string) => {
    if (level === 'low') return 'text-green-600 bg-green-50';
    if (level === 'medium') return 'text-yellow-600 bg-yellow-50';
    if (level === 'high') return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % place.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + place.images.length) % place.images.length
    );
  };

  const handleReserve = () => {
    setShowReservationModal(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-[10px] shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto scroll-smooth modal-scrollbar">
            {/* Close Button - Top Right (RTL) */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="إغلاق"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Image Carousel */}
            {place.images.length > 0 && (
              <div className="relative h-80 bg-gray-200">
                <img
                  src={place.images[currentImageIndex]}
                  alt={place.name}
                  className="w-full h-full object-cover"
                />

                {place.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>

                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 space-x-reverse">
                      {place.images.map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-2 h-2 rounded-full ${
                            idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-bold text-center" style={{ color: '#2D4A3E' }}>
                {place.name}
              </h2>

              {/* Description */}
              <div>
                <h3 className="text-xl font-bold mb-3 text-center" style={{ color: '#2D4A3E' }}>
                  نبذة عن المكان
                </h3>
                <p className="text-gray-700 leading-relaxed text-right">{place.description}</p>
              </div>

              {/* Opening Hours - Matching Figma */}
              <div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#2D4A3E' }}>
                  أوقات العمل
                </h3>
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="w-5 h-5 flex-shrink-0" style={{ color: '#C38822' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-base">{place.openingHours || '8 صباحاً - 12 ظهراً ، 4 مساءً - 8 مساءً'}</p>
                </div>
              </div>

              {/* Crowd Level - Matching Figma */}
              {place.crowdLevel && (
                <div>
                  <h3 className="text-xl font-bold mb-3 inline-block" style={{ color: '#2D4A3E' }}>
                    حالة الازدحام
                  </h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        place.crowdLevel === 'low'
                          ? 'bg-green-100 text-green-700'
                          : place.crowdLevel === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {getCrowdLabel(place.crowdLevel)}
                    </span>
                  </div>
                </div>
              )}

              {/* Annual Visitors Count - Matching Figma */}
              <div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#2D4A3E' }}>
                  عدد الزوار السنوي
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-800">
                    {place.bookingsCount.toLocaleString('ar-SA')}
                  </span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>

              {/* Booking Info - Matching Figma */}
              <div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#2D4A3E' }}>
                  معلومات الحجز
                </h3>
                {place.requiresBooking ? (
                  <div className="bg-green-50 border border-green-200 rounded-[10px] p-4">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700">يتطلب حجز مسبق</span>
                      </div>
                      {place.reservationPrice !== undefined && place.reservationPrice > 0 && (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-lg font-bold text-gray-800">{place.reservationPrice} ريال</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleReserve}
                      className="w-full px-6 py-3 rounded-[10px] font-medium text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#C38822' }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      احجز الآن
                    </button>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-[10px] p-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700">بدون حجز</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Current Events - Matching Figma */}
              <div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#2D4A3E' }}>
                  الأحداث الحالية
                </h3>
                {place.currentEvents && place.currentEvents.length > 0 ? (
                  <ul className="space-y-2">
                    {place.currentEvents.map((event, idx) => (
                      <li
                        key={idx}
                        className="bg-blue-50 border border-blue-200 rounded-[10px] p-4 flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <span className="text-gray-700">{event}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-[10px] p-4">
                    <p className="text-gray-600 text-center">لا توجد فعاليات خاصة حاليًا</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      <ReservationModal
        place={place}
        isOpen={showReservationModal}
        onClose={() => setShowReservationModal(false)}
      />
    </>
  );
}
