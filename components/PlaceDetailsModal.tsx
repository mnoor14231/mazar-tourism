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
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
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
            <div className="p-8 space-y-6">
              {/* Title */}
              <h2 className="text-3xl font-bold text-gray-800">{place.name}</h2>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  نبذة عن المكان
                </h3>
                <p className="text-gray-700 leading-relaxed">{place.description}</p>
              </div>

              {/* Opening Hours */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  أوقات العمل
                </h3>
                <p className="text-gray-700 bg-gray-50 px-4 py-3 rounded-lg">
                  ⏰ {place.openingHours}
                </p>
              </div>

              {/* Crowd Level */}
              {place.crowdLevel && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    حالة الازدحام
                  </h3>
                  <p
                    className={`inline-block px-4 py-2 rounded-lg font-medium ${getCrowdColor(
                      place.crowdLevel
                    )}`}
                  >
                    {getCrowdLabel(place.crowdLevel)}
                  </p>
                </div>
              )}

              {/* Booking Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  معلومات الحجز
                </h3>
                {place.requiresBooking ? (
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-primary-800 font-medium">
                          📅 يتطلب حجز مسبق
                        </p>
                        {place.reservationPrice !== undefined && place.reservationPrice > 0 && (
                          <p className="text-2xl font-bold text-primary-700 mt-2">
                            {place.reservationPrice} ريال
                          </p>
                        )}
                        {place.reservationPrice === 0 && (
                          <p className="text-lg font-semibold text-green-600 mt-2">
                            مجاني
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleReserve}
                      className="btn-primary w-full"
                    >
                      احجز الآن
                    </button>
                  </div>
                ) : (
                  <p className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                    ✓ لا يتطلب حجز مسبق
                  </p>
                )}
              </div>

              {/* Current Events */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  الأحداث الحالية
                </h3>
                {place.currentEvents && place.currentEvents.length > 0 ? (
                  <ul className="space-y-2">
                    {place.currentEvents.map((event, idx) => (
                      <li
                        key={idx}
                        className="bg-primary-50 text-primary-800 px-4 py-2 rounded-lg flex items-center"
                      >
                        <span className="ml-2">🎯</span>
                        {event}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 bg-gray-50 px-4 py-3 rounded-lg">
                    لا توجد فعاليات خاصة حاليًا
                  </p>
                )}
              </div>

              {/* Visitors Count */}
              <div className="bg-primary-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-700 mb-1">عدد الزوار</p>
                <p className="text-3xl font-bold text-primary-700">
                  {place.bookingsCount.toLocaleString('ar-SA')}
                </p>
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
