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

  const getTypeBgColor = (type: string) => {
    const colors: Record<string, string> = {
      religious: '#2D4A3E',
      historical: '#C38822',
      entertainment: '#6B5B95',
    };
    return colors[type] || '#6B7280';
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
      className={`relative bg-white rounded-[10px] overflow-hidden transition-all border-2 flex items-center gap-3 p-3 ${
        isSelected
          ? 'shadow-md'
          : 'border-gray-200 hover:border-gray-300'
      } ${disabled && !isSelected ? 'opacity-50' : 'cursor-pointer'}`}
      style={isSelected ? { borderColor: '#C38822' } : {}}
      onClick={!disabled || isSelected ? onToggle : undefined}
    >
      {/* Checkbox on the left */}
      <div className="flex-shrink-0">
        <div
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            isSelected
              ? 'border-transparent'
              : 'border-gray-300'
          }`}
          style={isSelected ? { backgroundColor: '#C38822' } : {}}
        >
          {isSelected && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>

      {/* Content in the middle */}
      <div className="flex-1 min-w-0">
        {/* Name */}
        <h4 className="font-bold text-gray-800 text-sm mb-2 line-clamp-1">
          {place.name}
        </h4>

        {/* Duration and Location - Matching Figma design */}
        <div className="flex flex-col gap-1.5">
          {/* Duration */}
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-gray-600">
              {place.openingHours?.includes('ساعة') 
                ? place.openingHours.match(/\d+\s*ساعة/)?.[0] || '1 ساعة'
                : '1 ساعة'}
            </span>
          </div>
          
          {/* Location */}
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs text-gray-600">
              {place.environment === 'outdoor' ? 'خارج المدينة' : 
               place.environment === 'indoor' ? 'وسط المدينة' : 
               'وسط المدينة'}
            </span>
          </div>
        </div>
      </div>

      {/* Image on the right */}
      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-200">
        <img
          src={place.images[0] || 'https://via.placeholder.com/300x150'}
          alt={place.name}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

