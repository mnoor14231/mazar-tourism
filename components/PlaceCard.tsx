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

  return (
    <div className="card">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={place.images[0] || 'https://via.placeholder.com/400x300'}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        {place.crowdLevel && (
          <div className="absolute top-3 left-3 bg-white px-3 py-1.5 rounded-full shadow-md flex items-center space-x-2 space-x-reverse">
            <div className={`w-3 h-3 rounded-full ${getCrowdColor(place.crowdLevel)}`}></div>
            <span className="text-xs font-medium">{getCrowdLabel(place.crowdLevel)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-3">{place.name}</h3>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="badge bg-primary-100 text-primary-700">
            {getTypeLabel(place.type)}
          </span>
          <span className="badge bg-teal-100 text-teal-700">
            {getEnvironmentLabel(place.environment)}
          </span>
          {place.audience.slice(0, 2).map((aud) => (
            <span key={aud} className="badge bg-purple-100 text-purple-700">
              {getAudienceLabel(aud)}
            </span>
          ))}
        </div>

        {/* Booking Info */}
        <div className="flex items-center space-x-2 space-x-reverse mb-3 text-sm">
          {place.requiresBooking ? (
            <>
              <span className="text-orange-600">📅</span>
              <span className="text-orange-600 font-medium">يتطلب حجز</span>
            </>
          ) : (
            <>
              <span className="text-green-600">✓</span>
              <span className="text-green-600 font-medium">بدون حجز</span>
            </>
          )}
        </div>

        {/* Bookings Count */}
        <p className="text-sm text-gray-600 mb-4">
          زارنا <span className="font-bold text-primary-600">{place.bookingsCount.toLocaleString('ar-SA')}</span> زائر
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onDetailsClick}
            className="flex-1 btn-primary text-sm py-2"
          >
            تفاصيل
          </button>

          {isManager && (
            <>
              <button
                onClick={onEditClick}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                تعديل
              </button>
              <button
                onClick={onDeleteClick}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
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

