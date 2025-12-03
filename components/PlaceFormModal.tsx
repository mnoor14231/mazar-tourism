'use client';

import { useState, useEffect, useRef } from 'react';
import { Place } from '@/types';
import { usePlacesStore, useFiltersStore } from '@/lib/storeDb';
import { processImage, parseGoogleMapsUrl, isValidCoordinate } from '@/lib/utils';

interface PlaceFormModalProps {
  place?: Place;
  isOpen: boolean;
  onClose: () => void;
  onSave: (place: Place) => void;
}

export default function PlaceFormModal({
  place,
  isOpen,
  onClose,
  onSave,
}: PlaceFormModalProps) {
  const categories = useFiltersStore((state) => state.categories);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<Place>({
    id: '',
    name: '',
    description: '',
    type: 'religious',
    audience: [],
    environment: 'outdoor',
    requiresBooking: false,
    bookingUrl: '',
    bookingsCount: 0,
    openingHours: '',
    crowdLevel: undefined,
    currentEvents: [],
    images: [],
    latitude: 24.4672,
    longitude: 39.6111,
    customFilters: {},
  });

  const [newEvent, setNewEvent] = useState('');
  const [newImage, setNewImage] = useState('');
  const [mapLink, setMapLink] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    if (place) {
      setFormData(place);
    } else {
      // Reset form
      setFormData({
        id: Date.now().toString(),
        name: '',
        description: '',
        type: 'religious',
        audience: [],
        environment: 'outdoor',
        requiresBooking: false,
        bookingUrl: '',
        bookingsCount: 0,
        openingHours: '',
        crowdLevel: undefined,
        currentEvents: [],
        images: [],
        latitude: 24.4672,
        longitude: 39.6111,
        customFilters: {},
      });
      setMapLink('');
      setUploadError('');
      setLocationError('');
    }
  }, [place, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate coordinates
    if (!isValidCoordinate(formData.latitude, formData.longitude)) {
      setLocationError('الإحداثيات غير صحيحة');
      return;
    }
    
    onSave(formData);
    onClose();
  };

  const handleFilterChange = (categoryName: string, value: string, isMulti: boolean) => {
    if (categoryName === 'type') {
      setFormData({ ...formData, type: value });
    } else if (categoryName === 'audience') {
      const currentAudience = formData.audience || [];
      const newAudience = currentAudience.includes(value)
        ? currentAudience.filter((a) => a !== value)
        : [...currentAudience, value];
      setFormData({ ...formData, audience: newAudience });
    } else if (categoryName === 'environment') {
      setFormData({ ...formData, environment: value });
    } else if (categoryName === 'requiresBooking') {
      setFormData({ ...formData, requiresBooking: value === 'yes' });
    } else {
      // Custom filter
      const customFilters = formData.customFilters || {};
      if (isMulti) {
        const current = customFilters[categoryName] || [];
        const newValues = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        setFormData({
          ...formData,
          customFilters: { ...customFilters, [categoryName]: newValues },
        });
      } else {
        setFormData({
          ...formData,
          customFilters: { ...customFilters, [categoryName]: [value] },
        });
      }
    }
  };

  const addEvent = () => {
    if (newEvent.trim()) {
      setFormData((prev) => ({
        ...prev,
        currentEvents: [...(prev.currentEvents || []), newEvent.trim()],
      }));
      setNewEvent('');
    }
  };

  const removeEvent = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      currentEvents: prev.currentEvents?.filter((_, i) => i !== index) || [],
    }));
  };

  // Handle image file upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError('');
    
    try {
      const file = files[0];
      const base64Image = await processImage(file, 2); // Max 2MB
      
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, base64Image],
      }));
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      setUploadError(error.message || 'حدث خطأ أثناء رفع الصورة');
    }
  };

  // Add image from URL
  const addImageUrl = () => {
    if (newImage.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImage.trim()],
      }));
      setNewImage('');
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Parse Google Maps link
  const handleMapLinkParse = () => {
    if (!mapLink.trim()) {
      setLocationError('الرجاء إدخال رابط خرائط جوجل');
      return;
    }

    const coords = parseGoogleMapsUrl(mapLink);
    if (coords) {
      setFormData((prev) => ({
        ...prev,
        latitude: coords.latitude,
        longitude: coords.longitude,
      }));
      setLocationError('');
      setMapLink('');
    } else {
      setLocationError('رابط خرائط جوجل غير صحيح');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
            <h2 className="text-2xl font-bold text-gray-800">
              {place ? 'تعديل المكان' : 'إضافة مكان جديد'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم المكان *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="input-field"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                النبذة *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="input-field"
                rows={4}
                required
              />
            </div>

            {/* Dynamic Filters */}
            {categories.map((category) => {
              if (category.name === 'requiresBooking') return null; // Handle separately
              
              const isType = category.name === 'type';
              const isAudience = category.name === 'audience';
              const isEnvironment = category.name === 'environment';
              
              let currentValue: string | string[];
              if (isType) currentValue = formData.type;
              else if (isAudience) currentValue = formData.audience;
              else if (isEnvironment) currentValue = formData.environment;
              else currentValue = formData.customFilters?.[category.name] || [];

              return (
                <div key={category.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {category.nameAr} *
                  </label>
                  {category.type === 'single' ? (
                    <select
                      value={Array.isArray(currentValue) ? currentValue[0] || '' : currentValue}
                      onChange={(e) =>
                        handleFilterChange(category.name, e.target.value, false)
                      }
                      className="input-field"
                      required={isType || isEnvironment}
                    >
                      <option value="">اختر...</option>
                      {category.options.map((option) => (
                        <option key={option.id} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {category.options.map((option) => {
                        const isSelected = Array.isArray(currentValue) && currentValue.includes(option.value);
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() =>
                              handleFilterChange(category.name, option.value, true)
                            }
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              isSelected
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Booking Required */}
            <div className="flex items-center space-x-3 space-x-reverse">
              <input
                type="checkbox"
                id="requiresBooking"
                checked={formData.requiresBooking}
                onChange={(e) =>
                  setFormData({ ...formData, requiresBooking: e.target.checked })
                }
                className="w-5 h-5 text-primary-600 rounded"
              />
              <label htmlFor="requiresBooking" className="text-sm font-medium text-gray-700">
                يتطلب حجز مسبق
              </label>
            </div>

            {/* Reservation Price */}
            {formData.requiresBooking && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  سعر الحجز (بالريال السعودي)
                </label>
                <input
                  type="number"
                  value={formData.reservationPrice ?? 0}
                  onChange={(e) =>
                    setFormData({ ...formData, reservationPrice: parseInt(e.target.value) || 0 })
                  }
                  className="input-field"
                  placeholder="0 = مجاني"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  اترك 0 للحجز المجاني، أو أدخل السعر بالريال
                </p>
              </div>
            )}

            {/* Bookings Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عدد الحجوزات / الزوار
              </label>
              <input
                type="number"
                value={formData.bookingsCount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bookingsCount: parseInt(e.target.value) || 0,
                  })
                }
                className="input-field"
                min="0"
              />
            </div>

            {/* Opening Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ساعات العمل *
              </label>
              <input
                type="text"
                value={formData.openingHours}
                onChange={(e) =>
                  setFormData({ ...formData, openingHours: e.target.value })
                }
                className="input-field"
                placeholder="مثال: 8 صباحاً - 10 مساءً"
                required
              />
            </div>

            {/* Crowd Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مستوى الازدحام
              </label>
              <select
                value={formData.crowdLevel || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    crowdLevel: e.target.value ? (e.target.value as any) : undefined,
                  })
                }
                className="input-field"
              >
                <option value="">غير محدد</option>
                <option value="low">منخفض</option>
                <option value="medium">متوسط</option>
                <option value="high">عالي</option>
              </select>
            </div>

            {/* Current Events */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الأحداث الحالية
              </label>
              <div className="space-y-2">
                {formData.currentEvents?.map((event, idx) => (
                  <div key={idx} className="flex items-center space-x-2 space-x-reverse">
                    <span className="flex-1 bg-gray-50 px-3 py-2 rounded-lg text-sm">
                      {event}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeEvent(idx)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      حذف
                    </button>
                  </div>
                ))}
                <div className="flex space-x-2 space-x-reverse">
                  <input
                    type="text"
                    value={newEvent}
                    onChange={(e) => setNewEvent(e.target.value)}
                    className="input-field flex-1"
                    placeholder="إضافة حدث جديد"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEvent())}
                  />
                  <button
                    type="button"
                    onClick={addEvent}
                    className="btn-secondary whitespace-nowrap"
                  >
                    إضافة
                  </button>
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الصور
              </label>
              
              {/* Display uploaded images */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt={`صورة ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 left-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload button */}
              <div className="space-y-3">
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="btn-primary cursor-pointer inline-block text-center"
                  >
                    📷 رفع صورة (حد أقصى 2 ميجابايت)
                  </label>
                  {uploadError && (
                    <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                  )}
                </div>

                {/* Or add URL */}
                <div className="border-t pt-3">
                  <p className="text-sm text-gray-600 mb-2">أو أضف رابط صورة:</p>
                  <div className="flex space-x-2 space-x-reverse">
                    <input
                      type="url"
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      className="input-field flex-1"
                      placeholder="https://..."
                    />
                    <button
                      type="button"
                      onClick={addImageUrl}
                      className="btn-secondary whitespace-nowrap"
                    >
                      إضافة
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Location - Google Maps Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الموقع (رابط خرائط جوجل) *
              </label>
              <div className="space-y-3">
                <div className="flex space-x-2 space-x-reverse">
                  <input
                    type="text"
                    value={mapLink}
                    onChange={(e) => setMapLink(e.target.value)}
                    className="input-field flex-1"
                    placeholder="الصق رابط خرائط جوجل هنا..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleMapLinkParse())}
                  />
                  <button
                    type="button"
                    onClick={handleMapLinkParse}
                    className="btn-primary whitespace-nowrap"
                  >
                    تحديد الموقع
                  </button>
                </div>
                
                {locationError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {locationError}
                  </div>
                )}

                {/* Embedded Map Preview */}
                {formData.latitude && formData.longitude && isValidCoordinate(formData.latitude, formData.longitude) && (
                  <div className="border-2 border-green-200 rounded-xl overflow-hidden">
                    <div className="bg-green-50 px-4 py-2 border-b border-green-200">
                      <p className="text-sm font-semibold text-green-800 flex items-center">
                        <span className="ml-2">✓</span>
                        تم تحديد الموقع بنجاح
                      </p>
                    </div>
                    <div className="relative h-64 bg-gray-100">
                      <iframe
                        src={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}&output=embed`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="موقع المكان"
                      ></iframe>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 text-sm text-gray-700">
                      <div className="flex justify-between items-center">
                        <span>
                          <strong>الإحداثيات:</strong> {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                        </span>
                        <a
                          href={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          فتح في خرائط جوجل ↗
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 font-semibold mb-2">
                    📍 كيفية الحصول على الرابط:
                  </p>
                  <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                    <li>افتح خرائط جوجل (Google Maps)</li>
                    <li>ابحث عن المكان أو انقر عليه على الخريطة</li>
                    <li>انسخ الرابط من المتصفح</li>
                    <li>الصق الرابط هنا واضغط "تحديد الموقع"</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3 space-x-reverse pt-4 border-t">
              <button type="submit" className="btn-primary flex-1">
                {place ? 'حفظ التعديلات' : 'إضافة المكان'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
