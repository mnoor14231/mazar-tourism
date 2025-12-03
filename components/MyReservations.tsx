'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useReservationsStore, usePlacesStore } from '@/lib/storeDb';

export default function MyReservations() {
  const user = useAuthStore((state) => state.user);
  const { reservations, isLoading, fetchReservations } = useReservationsStore();
  const { places } = usePlacesStore();
  const [expandedReservation, setExpandedReservation] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchReservations(user.id || user.username);
    }
  }, [user, fetchReservations]);

  const getPlaceName = (placeId: string) => {
    const place = places.find(p => p.id === placeId);
    return place?.name || 'مكان غير معروف';
  };

  const getPlaceImage = (placeId: string) => {
    const place = places.find(p => p.id === placeId);
    return place?.images?.[0] || null;
  };

  if (!user) {
    return (
      <div className="bg-gray-50 rounded-xl p-8 text-center">
        <p className="text-gray-600">يرجى تسجيل الدخول لعرض حجوزاتك</p>
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

  if (reservations.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-8 text-center">
        <div className="text-5xl mb-4">📅</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد حجوزات</h3>
        <p className="text-gray-600">قم بحجز مكان لرؤيته هنا</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <span className="text-4xl">📅</span>
          حجوزاتي
        </h2>
        <div className="bg-[#195B4A] text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
          {reservations.length}
        </div>
      </div>

      {reservations.map((reservation) => {
        const isExpanded = expandedReservation === reservation.id;
        const placeName = getPlaceName(reservation.placeId);
        const placeImage = getPlaceImage(reservation.placeId);

        return (
          <div
            key={reservation.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-[#195B4A]/5 to-transparent border-b border-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* Place Image */}
                  {placeImage && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                      <img
                        src={placeImage}
                        alt={placeName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{placeName}</h3>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="flex items-center gap-2 text-gray-700 bg-white px-3 py-1 rounded-lg shadow-sm">
                        <span className="text-lg">📅</span>
                        <span>{new Date(reservation.reservationDate).toLocaleDateString('ar-SA')}</span>
                      </span>
                      <span className="flex items-center gap-2 text-gray-700 bg-white px-3 py-1 rounded-lg shadow-sm">
                        <span className="text-lg">👥</span>
                        <span>{reservation.numberOfPeople} {reservation.numberOfPeople === 1 ? 'شخص' : 'أشخاص'}</span>
                      </span>
                      {reservation.totalPrice > 0 && (
                        <span className="flex items-center gap-2 text-gray-700 bg-white px-3 py-1 rounded-lg shadow-sm">
                          <span className="text-lg">💰</span>
                          <span>{reservation.totalPrice} ريال</span>
                        </span>
                      )}
                      <span className={`flex items-center gap-2 px-3 py-1 rounded-lg shadow-sm font-semibold ${
                        reservation.status === 'confirmed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        <span>{reservation.status === 'confirmed' ? '✓' : '✗'}</span>
                        <span>{reservation.status === 'confirmed' ? 'مؤكد' : 'ملغي'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedReservation(isExpanded ? null : reservation.id)}
                  className="bg-gradient-to-r from-[#195B4A] to-[#307C5F] hover:from-[#307C5F] hover:to-[#195B4A] text-white py-2 px-6 rounded-lg text-sm font-bold transition-all hover:scale-105 shadow-md"
                >
                  {isExpanded ? '⬆️ إخفاء' : '⬇️ عرض QR'}
                </button>
              </div>
            </div>

            {/* Expanded QR Code */}
            {isExpanded && (
              <div className="p-6 bg-gradient-to-br from-gray-50 to-white text-center">
                <h4 className="text-lg font-bold text-gray-800 mb-4">رمز QR للحجز</h4>
                
                {/* QR Code Display */}
                <div className="bg-white border-4 border-[#195B4A] rounded-2xl p-6 inline-block shadow-xl">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <svg
                      width="250"
                      height="250"
                      viewBox="0 0 250 250"
                      className="mx-auto"
                    >
                      <rect width="250" height="250" fill="white" />
                      <g fill="black">
                        {Array.from({ length: 12 }).map((_, i) =>
                          Array.from({ length: 12 }).map((_, j) => {
                            // Create a more complex pattern based on reservation ID
                            const hash = reservation.id.charCodeAt(i % reservation.id.length) + 
                                        reservation.id.charCodeAt(j % reservation.id.length);
                            return (
                              <rect
                                key={`${i}-${j}`}
                                x={i * 20 + 5}
                                y={j * 20 + 5}
                                width="18"
                                height="18"
                                fill={hash % 2 === 0 ? 'black' : 'white'}
                              />
                            );
                          })
                        )}
                      </g>
                      <text x="125" y="125" textAnchor="middle" fontSize="14" fill="currentColor" fontWeight="bold" className="text-[#195B4A]">
                        {reservation.id.slice(0, 8)}
                      </text>
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 mt-4 font-semibold">
                    أظهر هذا الرمز عند الدخول
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    رقم الحجز: {reservation.id}
                  </p>
                </div>

                {/* Reservation Details */}
                <div className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-right">
                      <span className="text-gray-600">المكان:</span>
                      <p className="font-bold text-gray-800 mt-1">{placeName}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-600">التاريخ:</span>
                      <p className="font-bold text-gray-800 mt-1">
                        {new Date(reservation.reservationDate).toLocaleDateString('ar-SA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-600">عدد الأشخاص:</span>
                      <p className="font-bold text-gray-800 mt-1">{reservation.numberOfPeople}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-600">طريقة الدفع:</span>
                      <p className="font-bold text-gray-800 mt-1">
                        {reservation.paymentMethod === 'apple-pay' ? '🍎 Apple Pay' : '💳 بطاقة ائتمان'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={() => {
                    // In a real app, this would generate and download an actual QR code
                    alert('سيتم تحميل رمز QR قريباً');
                  }}
                  className="mt-4 bg-[#9D7D4E] hover:bg-[#B69D6D] text-white py-2 px-6 rounded-lg font-medium transition-all hover:scale-105 shadow-md"
                >
                  📥 حفظ رمز QR
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

