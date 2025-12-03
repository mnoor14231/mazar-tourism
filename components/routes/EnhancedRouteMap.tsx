'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Place } from '@/types';
import { RouteResult, RouteStop } from '@/types/route';

// Custom marker for start point
const startIcon = L.divIcon({
  className: 'custom-marker-start',
  html: `
    <div style="
      position: relative;
      width: 50px;
      height: 50px;
    ">
      <div style="
        background: linear-gradient(135deg, #22c55e, #16a34a);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(34, 197, 94, 0.5);
        border: 3px solid white;
        position: absolute;
        top: 0;
        left: 5px;
      ">
        <span style="font-size: 18px;">🚩</span>
      </div>
      <div style="
        position: absolute;
        bottom: -8px;
        left: 17px;
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 12px solid #16a34a;
      "></div>
    </div>
  `,
  iconSize: [50, 60],
  iconAnchor: [25, 55],
  popupAnchor: [0, -50],
});

// Custom marker for places (with reservation indicator)
const createPlaceIcon = (place: Place, index: number) => {
  const requiresBooking = place.requiresBooking;
  const bgColor = requiresBooking 
    ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
    : 'linear-gradient(135deg, #0ea5e9, #0284c7)';
  const shadowColor = requiresBooking 
    ? 'rgba(239, 68, 68, 0.5)' 
    : 'rgba(14, 165, 233, 0.5)';
  
  const typeEmoji = place.type === 'religious' ? '🕌' 
    : place.type === 'historical' ? '🏛️' 
    : '🎭';

  return L.divIcon({
    className: 'custom-marker-place',
    html: `
      <div style="
        position: relative;
        width: 60px;
        height: 75px;
      ">
        <div style="
          background: ${bgColor};
          width: 50px;
          height: 50px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 20px ${shadowColor};
          border: 3px solid white;
          position: absolute;
          top: 0;
          left: 5px;
        ">
          <span style="transform: rotate(45deg); font-size: 22px;">${typeEmoji}</span>
        </div>
        ${requiresBooking ? `
          <div style="
            position: absolute;
            top: -5px;
            right: 0;
            background: #fbbf24;
            color: #92400e;
            font-size: 10px;
            font-weight: bold;
            padding: 2px 5px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          ">حجز!</div>
        ` : ''}
      </div>
    `,
    iconSize: [60, 75],
    iconAnchor: [30, 70],
    popupAnchor: [0, -65],
  });
};

// Component to fit map bounds
function MapBoundsHandler({ route }: { route: RouteResult }) {
  const map = useMap();

  useEffect(() => {
    if (route.stops.length > 0) {
      const bounds = L.latLngBounds(
        route.stops.map((stop) => [stop.latitude, stop.longitude])
      );
      map.fitBounds(bounds, { padding: [80, 80] });
    }
  }, [map, route]);

  return null;
}

interface EnhancedRouteMapProps {
  route: RouteResult;
  selectedPlaces: Place[];
  suggestions?: { place: Place; reason: string }[];
  onPlaceSelect: (place: Place | null) => void;
  onReservation: (place: Place) => void;
}

export default function EnhancedRouteMap({
  route,
  selectedPlaces,
  suggestions,
  onPlaceSelect,
  onReservation,
}: EnhancedRouteMapProps) {
  // Calculate center point
  const center = useMemo(() => {
    if (route.stops.length === 0) {
      return { lat: 24.4672, lng: 39.6111 };
    }
    const avgLat = route.stops.reduce((sum, s) => sum + s.latitude, 0) / route.stops.length;
    const avgLng = route.stops.reduce((sum, s) => sum + s.longitude, 0) / route.stops.length;
    return { lat: avgLat, lng: avgLng };
  }, [route]);

  // Route polyline points
  const polylinePoints = useMemo(() => {
    return route.stops.map((stop) => [stop.latitude, stop.longitude] as [number, number]);
  }, [route]);

  // Get place for stop
  const getPlaceForStop = (placeId?: string) => {
    return selectedPlaces.find((p) => p.id === placeId);
  };

  // Get suggestion for place
  const getSuggestionForPlace = (placeId: string) => {
    return suggestions?.find((s) => s.place.id === placeId);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'religious': return 'ديني';
      case 'historical': return 'تاريخي';
      case 'entertainment': return 'ترفيهي';
      default: return type;
    }
  };

  const getAudienceLabel = (aud: string) => {
    switch (aud) {
      case 'family': return 'عائلي';
      case 'kids': return 'أطفال';
      case 'seniors': return 'كبار سن';
      case 'friends': return 'أصدقاء';
      default: return aud;
    }
  };

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapBoundsHandler route={route} />

      {/* Route Line - Shadow */}
      <Polyline
        positions={polylinePoints}
        pathOptions={{
          color: '#000',
          weight: 6,
          opacity: 0.2,
        }}
      />

      {/* Route Line - Main */}
      <Polyline
        positions={polylinePoints}
        pathOptions={{
          color: '#0ea5e9',
          weight: 4,
          opacity: 0.9,
        }}
      />

      {/* Route Line - Animated overlay */}
      <Polyline
        positions={polylinePoints}
        pathOptions={{
          color: '#22d3ee',
          weight: 2,
          opacity: 0.7,
          dashArray: '10, 10',
        }}
      />

      {/* Markers */}
      {route.stops.map((stop, index) => {
        const isStart = stop.kind === 'start';
        const place = getPlaceForStop(stop.placeId);
        const suggestion = place ? getSuggestionForPlace(place.id) : null;

        return (
          <Marker
            key={index}
            position={[stop.latitude, stop.longitude]}
            icon={isStart ? startIcon : (place ? createPlaceIcon(place, index) : startIcon)}
            eventHandlers={{
              click: () => {
                if (place) onPlaceSelect(place);
              },
            }}
          >
            <Popup maxWidth={350} minWidth={280}>
              <div className="rtl text-right p-1" style={{ direction: 'rtl' }}>
                {isStart ? (
                  <div className="text-center py-2">
                    <div className="text-3xl mb-2">🚩</div>
                    <h3 className="font-bold text-gray-800 text-lg">{stop.label}</h3>
                    <p className="text-gray-500 text-sm mt-1">نقطة البداية</p>
                    <div className="text-xs text-gray-400 mt-2">
                      {stop.latitude.toFixed(5)}, {stop.longitude.toFixed(5)}
                    </div>
                  </div>
                ) : place ? (
                  <div>
                    {/* Image */}
                    {place.images[0] && (
                      <div className="relative -mx-1 -mt-1 mb-3">
                        <img
                          src={place.images[0]}
                          alt={place.name}
                          className="w-full h-32 object-cover rounded-t-lg"
                        />
                        <div className="absolute bottom-2 right-2 flex gap-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
                            place.type === 'religious' ? 'bg-green-500/90 text-white' :
                            place.type === 'historical' ? 'bg-orange-500/90 text-white' :
                            'bg-purple-500/90 text-white'
                          }`}>
                            {getTypeLabel(place.type)}
                          </span>
                        </div>
                        {place.requiresBooking && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <span>⚠️</span>
                            يتطلب حجز
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content */}
                    <h3 className="font-bold text-gray-800 text-lg mb-1">{place.name}</h3>
                    
                    {suggestion && (
                      <p className="text-primary-600 text-sm flex items-center gap-1 mb-2">
                        <span>✨</span>
                        {suggestion.reason}
                      </p>
                    )}

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{place.description}</p>

                    {/* Info */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <span>⏰</span>
                        <span>{place.openingHours}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <span>👥</span>
                        <span>{place.bookingsCount.toLocaleString('ar-SA')} زائر</span>
                      </div>
                      {place.crowdLevel && (
                        <div className="flex items-center gap-2 text-sm">
                          <span>📊</span>
                          <span className={
                            place.crowdLevel === 'low' ? 'text-green-600' :
                            place.crowdLevel === 'medium' ? 'text-yellow-600' :
                            'text-red-600'
                          }>
                            {place.crowdLevel === 'low' && 'ازدحام منخفض'}
                            {place.crowdLevel === 'medium' && 'ازدحام متوسط'}
                            {place.crowdLevel === 'high' && 'ازدحام عالي'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Audience Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {place.audience.map((aud) => (
                        <span
                          key={aud}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {getAudienceLabel(aud)}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    {place.requiresBooking ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReservation(place);
                        }}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                      >
                        <span>📅</span>
                        احجز الآن
                      </button>
                    ) : (
                      <div className="w-full bg-green-100 text-green-700 py-2.5 rounded-lg font-medium text-center flex items-center justify-center gap-2">
                        <span>✓</span>
                        دخول مجاني بدون حجز
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <h3 className="font-bold text-gray-800">{stop.label}</h3>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

