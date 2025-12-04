'use client';

import { useState } from 'react';
import { Place, Reservation } from '@/types';
import { useAuthStore } from '@/lib/store';
import { useReservationsStore, usePlacesStore } from '@/lib/storeDb';
import { useRouter } from 'next/navigation';

interface ReservationModalProps {
  place: Place;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReservationModal({
  place,
  isOpen,
  onClose,
}: ReservationModalProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const addReservation = useReservationsStore((state) => state.addReservation);
  const updatePlace = usePlacesStore((state) => state.updatePlace);
  
  const [step, setStep] = useState<'payment' | 'success'>('payment');
  const [paymentMethod, setPaymentMethod] = useState<'apple-pay' | 'credit-card'>('apple-pay');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [processing, setProcessing] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  if (!isOpen) return null;

  // Redirect to login if not authenticated
  if (!user) {
    // Store the place ID to return to after login
    localStorage.setItem('pendingReservation', place.id);
    router.push('/login');
    return null;
  }

  const price = place.reservationPrice || 0;

  const handlePayment = () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Generate QR code data
      const reservationId = `RES-${Date.now()}`;
      const qrData = JSON.stringify({
        id: reservationId,
        place: place.name,
        user: user.username,
        date: new Date().toISOString(),
        price: price,
      });

      const newReservation: Reservation = {
        id: reservationId,
        placeId: place.id,
        userId: user.id || user.username,
        reservationDate: new Date().toISOString(),
        numberOfPeople: numberOfPeople,
        totalPrice: price,
        paymentMethod: paymentMethod,
        qrCode: qrData,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addReservation(newReservation);
      
      // Update bookings count
      updatePlace(place.id, {
        bookingsCount: place.bookingsCount + 1,
      });

      setReservation(newReservation);
      setStep('success');
      setProcessing(false);
    }, 2000);
  };

  const handleClose = () => {
    setStep('payment');
    setPaymentMethod('credit-card');
    setCardNumber('');
    setCardName('');
    setCardExpiry('');
    setCardCVV('');
    setReservation(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full">
          {step === 'payment' ? (
            <>
              {/* Header */}
              <div className="border-b border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-800 text-center">
                  حجز {place.name}
                </h2>
                <button
                  onClick={handleClose}
                  className="absolute top-4 left-4 text-gray-400 hover:text-gray-600"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Price */}
                <div className="bg-primary-50 rounded-xl p-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">المبلغ الإجمالي</p>
                  <p className="text-4xl font-bold text-primary-700">
                    {price === 0 ? 'مجاني' : `${price} ريال`}
                  </p>
                </div>

                {/* Number of People */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    عدد الأشخاص
                  </label>
                  <select
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(Number(e.target.value))}
                    className="input-field"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'شخص' : num === 2 ? 'شخصان' : 'أشخاص'}
                      </option>
                    ))}
                  </select>
                </div>

                {price > 0 && (
                  <>
                    {/* Payment Method */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        طريقة الدفع
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('apple-pay')}
                          className={`p-5 rounded-xl border-2 transition-all hover:scale-105 ${
                            paymentMethod === 'apple-pay'
                              ? 'border-[#000000] bg-gray-50 shadow-lg'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <img
                            src="/applepay.png"
                            alt="Apple Pay"
                            className="h-10 mx-auto"
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('credit-card')}
                          className={`p-5 rounded-xl border-2 transition-all hover:scale-105 ${
                            paymentMethod === 'credit-card'
                              ? 'shadow-lg'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <div className="text-3xl mb-2">💳</div>
                          <div className="text-sm font-semibold text-gray-700">بطاقة ائتمان</div>
                        </button>
                      </div>
                    </div>

                    {/* Credit Card Form */}
                    {paymentMethod === 'credit-card' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            رقم البطاقة
                          </label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            اسم حامل البطاقة
                          </label>
                          <input
                            type="text"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="الاسم كما يظهر على البطاقة"
                            className="input-field"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              تاريخ الانتهاء
                            </label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/YY"
                              maxLength={5}
                              className="input-field"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              CVV
                            </label>
                            <input
                              type="text"
                              value={cardCVV}
                              onChange={(e) => setCardCVV(e.target.value)}
                              placeholder="123"
                              maxLength={3}
                              className="input-field"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Submit Button */}
                <button
                  onClick={handlePayment}
                  disabled={processing || (price > 0 && paymentMethod === 'credit-card' && (!cardNumber || !cardName || !cardExpiry || !cardCVV))}
                  className={`w-full py-4 text-lg font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 shadow-lg hover:shadow-xl ${
                    paymentMethod === 'apple-pay'
                      ? 'bg-black text-white hover:bg-gray-900'
                      : 'bg-gradient-to-r from-[#195B4A] to-[#307C5F] text-white hover:from-[#307C5F] hover:to-[#195B4A]'
                  }`}
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري المعالجة...
                    </span>
                  ) : price === 0 ? (
                    'تأكيد الحجز'
                  ) : paymentMethod === 'apple-pay' ? (
                    <span className="flex items-center justify-center gap-3">
                      <img src="/applepay.png" alt="Apple Pay" className="h-6" />
                      ادفع {price} ريال
                    </span>
                  ) : (
                    `ادفع ${price} ريال`
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Success View */}
              <div className="p-6 text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    تم الحجز بنجاح! 🎉
                  </h3>
                  <p className="text-gray-600">
                    رقم الحجز: {reservation?.id}
                  </p>
                </div>

                {/* QR Code */}
                <div className="bg-white border-4 border-gray-200 rounded-xl p-6 inline-block">
                  <div className="bg-gray-100 p-8 rounded-lg">
                    <svg
                      width="200"
                      height="200"
                      viewBox="0 0 200 200"
                      className="mx-auto"
                    >
                      {/* Simple QR code placeholder */}
                      <rect width="200" height="200" fill="white" />
                      <g fill="black">
                        {/* Create a simple pattern */}
                        {Array.from({ length: 10 }).map((_, i) =>
                          Array.from({ length: 10 }).map((_, j) => (
                            <rect
                              key={`${i}-${j}`}
                              x={i * 20}
                              y={j * 20}
                              width="18"
                              height="18"
                              fill={(i + j) % 2 === 0 ? 'black' : 'white'}
                            />
                          ))
                        )}
                      </g>
                      <text x="100" y="100" textAnchor="middle" fontSize="12" fill="red" fontWeight="bold">
                        QR
                      </text>
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    احفظ هذا الرمز لإظهاره عند الدخول
                  </p>
                </div>

                {/* Details */}
                <div className="bg-gray-50 rounded-xl p-4 text-right space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">المكان:</span>
                    <span className="font-semibold">{place.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">التاريخ:</span>
                    <span className="font-semibold">
                      {new Date().toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  {price > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">المبلغ:</span>
                      <span className="font-semibold">{price} ريال</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleClose}
                  className="btn-primary w-full"
                >
                  تم
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

