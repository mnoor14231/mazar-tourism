'use client';

import { Place } from '@/types';

interface PlaceSelectionCardProps {
  place: Place;
  isSelected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export default function PlaceSelectionCard({
  place,
  isSelected,
  onToggle,
  disabled,
}: PlaceSelectionCardProps) {
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      religious: 'ديني',
      historical: 'تاريخي',
      entertainment: 'ترفيهي',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      religious: 'bg-green-100 text-green-700',
      historical: 'bg-orange-100 text-orange-700',
      entertainment: 'bg-purple-100 text-purple-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
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

  return (
    <div
      className={`relative bg-white rounded-xl border-2 overflow-hidden transition-all ${
        isSelected
          ? 'border-primary-500 shadow-lg ring-2 ring-primary-200'
          : 'border-gray-200 hover:border-gray-300'
      } ${disabled && !isSelected ? 'opacity-50' : ''}`}
    >
      {/* Selection Badge */}
      {isSelected && (
        <div className="absolute top-2 left-2 z-10 bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
          ✓
        </div>
      )}

      {/* Image */}
      <div className="relative h-32 bg-gray-200">
        <img
          src={place.images[0] || 'https://via.placeholder.com/300x150'}
          alt={place.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Name */}
        <h4 className="font-bold text-gray-800 text-sm mb-2 line-clamp-1">
          {place.name}
        </h4>

        {/* Badges */}
        <div className="flex flex-wrap gap-1 mb-2">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(place.type)}`}>
            {getTypeLabel(place.type)}
          </span>
          {place.requiresBooking ? (
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700">
              يتطلب حجز
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
              بدون حجز
            </span>
          )}
        </div>

        {/* Audience Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {place.audience.slice(0, 3).map((aud) => (
            <span
              key={aud}
              className="px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
            >
              {getAudienceLabel(aud)}
            </span>
          ))}
        </div>

        {/* Toggle Button */}
        <button
          onClick={onToggle}
          disabled={disabled && !isSelected}
          className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
            isSelected
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
          }`}
        >
          {isSelected ? 'إزالة من المسار' : 'إضافة للمسار'}
        </button>
      </div>
    </div>
  );
}

