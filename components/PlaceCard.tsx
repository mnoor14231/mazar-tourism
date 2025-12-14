'use client';

import Image from 'next/image';
import { Place } from '@/types';
import { useAuthStore } from '@/lib/store';

interface PlaceCardProps {
  place: Place;
  onDetailsClick: () => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}

export default function PlaceCard({
  place,
  onDetailsClick,
  onEditClick,
  onDeleteClick,
}: PlaceCardProps) {
  const user = useAuthStore((state) => state.user);
  const isManager = user?.role === 'manager';

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      religious: 'ديني',
      historical: 'تاريخي',
      entertainment: 'ترفيهي',
    };
    return labels[type] || type;
  };

  const getAudienceLabel = (audience: string) => {
    const labels: Record<string, string> = {
      family: 'عائلي',
      kids: 'أطفال',
      seniors: 'كبار سن',
      friends: 'أصدقاء',
    };
    return labels[audience] || audience;
  };

  const getEnvironmentLabel = (env: string) => {
    const labels: Record<string, string> = {
      indoor: 'داخلي',
      outdoor: 'خارجي',
      mixed: 'مختلط',
    };
    return labels[env] || env;
  };

  const getCrowdColor = (level?: string) => {
    if (level === 'low') return 'bg-green-500';
    if (level === 'medium') return 'bg-yellow-500';
    if (level === 'high') return 'bg-red-500';
    return 'bg-gray-400';
  };

  const getCrowdLabel = (level?: string) => {
    const labels: Record<string, string> = {
      low: 'ازدحام منخفض',
      medium: 'ازدحام متوسط',
      high: 'ازدحام عالي',
    };
    return level ? labels[level] : '';
  };

  const getTypeBgColor = (type: string) => {
    const colors: Record<string, string> = {
      religious: '#2D4A3E',
      historical: '#C38822',
      entertainment: '#6B5B95',
    };
    return colors[type] || '#6B7280';
  };

  const getLocationLabel = (place: Place) => {
    // Use custom location if available, otherwise derive from environment
    if (place.name.includes('شمال') || place.name.includes('جبل أحد') || place.name.includes('حديقة الملك فهد')) {
      return 'شمال المدينة';
    }
    if (place.name.includes('جنوب') || place.name.includes('قباء')) {
      return 'جنوب المدينة';
    }
    if (place.name.includes('شرق') || place.name.includes('السيرة النبوية')) {
      return 'شرق المدينة';
    }
    if (place.name.includes('غرب') || place.name.includes('القبلتين')) {
      return 'غرب المدينة';
    }
    if (place.name.includes('مول') || place.name.includes('المسجد النبوي')) {
      return 'وسط المدينة';
    }
    if (place.environment === 'outdoor') return 'خارج المدينة';
    return 'وسط المدينة';
  };

  return (
    <div className="bg-white rounded-[10px] overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition-all">
      {/* Image Section with Hover Zoom Effect */}
      <div className="relative h-48 bg-gray-200 overflow-hidden group cursor-pointer">
        {place.images && place.images[0] ? (
          <div className="relative w-full h-full">
            <Image
              src={place.images[0]}
              alt={place.name}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = `https://via.placeholder.com/400x300/2D4A3E/FFFFFF?text=${encodeURIComponent(place.name)}`;
              }}
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-sm">لا توجد صورة</span>
          </div>
        )}
        
        {/* Category Badge - Top Right (Oval with golden background matching Figma) */}
        <span 
          className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium text-white"
          style={{ backgroundColor: '#C38822' }}
        >
          {getTypeLabel(place.type)}
        </span>

        {/* Heart/Favorite Button - Bottom Left (Matching Figma) */}
        <button
          className="absolute bottom-3 left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm border border-gray-200"
          aria-label="إضافة للمفضلة"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Place Name */}
        <h4 className="text-lg font-bold text-gray-800 mb-3 line-clamp-1">
          {place.name}
        </h4>

        {/* Tags - Matching Figma (golden/light backgrounds) */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {place.audience.slice(0, 3).map((aud) => (
            <span
              key={aud}
              className="px-2 py-1 rounded-full text-xs"
              style={{ backgroundColor: '#F5E6D3', color: '#1A1A1A' }}
            >
              {getAudienceLabel(aud)}
            </span>
          ))}
          <span 
            className="px-2 py-1 rounded-full text-xs"
            style={{ backgroundColor: '#F5E6D3', color: '#1A1A1A' }}
          >
            {getEnvironmentLabel(place.environment)}
          </span>
        </div>

        {/* Location and Booking Info */}
        <div className="flex flex-col gap-2 mb-4">
          {/* Location */}
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs text-gray-600">
              {getLocationLabel(place)}
            </span>
          </div>

          {/* Booking Status */}
          <div className="flex items-center gap-2">
            {place.requiresBooking ? (
              <>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs text-gray-600">يتطلب حجز</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs text-gray-600">بدون حجز</span>
              </>
            )}
          </div>
        </div>

        {/* Price Section - Matching Figma (مجاناً in golden) */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
          <span className="text-xs text-gray-600">السعر</span>
          <span 
            className="text-sm font-bold"
            style={{ color: place.reservationPrice && place.reservationPrice > 0 ? '#1A1A1A' : '#C38822' }}
          >
            {place.reservationPrice && place.reservationPrice > 0
              ? `${place.reservationPrice} ريال`
              : 'مجاناً'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onDetailsClick}
            className="flex-1 px-4 py-2 rounded-[10px] font-medium text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: '#2D4A3E', color: 'white' }}
          >
            التفاصيل
          </button>

          {isManager && (
            <>
              <button
                onClick={onEditClick}
                className="px-4 py-2 bg-blue-500 text-white rounded-[10px] hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                تعديل
              </button>
              <button
                onClick={onDeleteClick}
                className="px-4 py-2 bg-red-500 text-white rounded-[10px] hover:bg-red-600 transition-colors text-sm font-medium"
              >
                حذف
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

