'use client';

import { Place } from '@/types';
import { RouteResult } from '@/types/route';
import { formatDistance, formatDuration } from '@/lib/routeUtils';

interface RouteSummaryProps {
  route: RouteResult | null;
  selectedPlaces: Place[];
  suggestions?: { place: Place; reason: string }[];
}

export default function RouteSummary({ route, selectedPlaces, suggestions }: RouteSummaryProps) {
  if (!route || route.stops.length <= 1) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <div className="text-5xl mb-4">🛤️</div>
        <h3 className="font-bold text-gray-800 mb-2">لم يتم إنشاء مسار بعد</h3>
        <p className="text-gray-600 text-sm">
          اختر أماكن من القائمة أو استخدم ابن المدينة لإنشاء مسار
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-l from-primary-600 to-primary-700 text-white p-4">
        <h3 className="font-bold text-lg mb-1">ملخص المسار</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span>📍</span>
            <span>{route.stops.length} محطات</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📏</span>
            <span>{formatDistance(route.totalDistanceKm)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>⏱️</span>
            <span>{formatDuration(route.estimatedDurationMinutes)}</span>
          </div>
        </div>
      </div>

      {/* Stops List */}
      <div className="p-4">
        <div className="space-y-4">
          {route.stops.map((stop, index) => {
            const isStart = stop.kind === 'start';
            const isLast = index === route.stops.length - 1;
            const place = selectedPlaces.find((p) => p.id === stop.placeId);
            const suggestion = suggestions?.find((s) => s.place.id === stop.placeId);

            return (
              <div key={index} className="relative">
                {/* Connector Line */}
                {!isLast && (
                  <div className="absolute right-[18px] top-[40px] bottom-[-16px] w-0.5 bg-gray-200" />
                )}

                <div className="flex gap-3">
                  {/* Number Badge */}
                  <div
                    className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold ${
                      isStart ? 'bg-green-500' : 'bg-primary-500'
                    }`}
                  >
                    {isStart ? '🚩' : index}
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-gray-50 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-gray-800">{stop.label}</p>
                        {isStart && (
                          <p className="text-xs text-gray-500 mt-1">نقطة البداية</p>
                        )}
                        {place && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            <span className="px-2 py-0.5 rounded text-xs bg-primary-100 text-primary-700">
                              {place.type === 'religious' && 'ديني'}
                              {place.type === 'historical' && 'تاريخي'}
                              {place.type === 'entertainment' && 'ترفيهي'}
                            </span>
                            {place.crowdLevel && (
                              <span
                                className={`px-2 py-0.5 rounded text-xs ${
                                  place.crowdLevel === 'low'
                                    ? 'bg-green-100 text-green-700'
                                    : place.crowdLevel === 'medium'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {place.crowdLevel === 'low' && 'ازدحام منخفض'}
                                {place.crowdLevel === 'medium' && 'ازدحام متوسط'}
                                {place.crowdLevel === 'high' && 'ازدحام عالي'}
                              </span>
                            )}
                          </div>
                        )}
                        {suggestion && (
                          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <span>✨</span>
                            {suggestion.reason}
                          </p>
                        )}
                      </div>
                      {place && place.images[0] && (
                        <img
                          src={place.images[0]}
                          alt={place.name}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                    </div>
                    {place && (
                      <p className="text-xs text-gray-600 mt-2">{place.openingHours}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 px-4 py-3 border-t">
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-green-500">●</span>
            <span>نقطة البداية</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary-500">●</span>
            <span>الأماكن المختارة</span>
          </div>
          <div className="flex items-center gap-2">
            <span>---</span>
            <span>مسار مقترح</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          * المسافات والأوقات تقريبية وتعتمد على الطريق الفعلي وحركة المرور
        </p>
      </div>
    </div>
  );
}

