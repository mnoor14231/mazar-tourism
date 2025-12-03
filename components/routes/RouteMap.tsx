'use client';

import { useEffect, useRef } from 'react';
import { RouteResult } from '@/types/route';

interface RouteMapProps {
  route: RouteResult | null;
}

export default function RouteMap({ route }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polylineRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    import('leaflet').then((L) => {
      // Initialize map if not already initialized
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapRef.current!).setView([24.4672, 39.6111], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(mapInstanceRef.current);
      }

      // Clear existing markers and polyline
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      if (polylineRef.current) {
        polylineRef.current.remove();
        polylineRef.current = null;
      }

      if (!route || route.stops.length === 0) {
        return;
      }

      const coordinates: [number, number][] = [];

      // Add markers for each stop
      route.stops.forEach((stop, index) => {
        coordinates.push([stop.latitude, stop.longitude]);

        const isStart = stop.kind === 'start';
        const markerColor = isStart ? '#22c55e' : '#0ea5e9';
        const markerIcon = isStart ? '📍' : `${index}`;

        const icon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              background-color: ${markerColor};
              width: ${isStart ? '40px' : '32px'};
              height: ${isStart ? '40px' : '32px'};
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: ${isStart ? '18px' : '14px'};
            ">
              ${isStart ? markerIcon : index}
            </div>
          `,
          iconSize: [isStart ? 40 : 32, isStart ? 40 : 32],
          iconAnchor: [isStart ? 20 : 16, isStart ? 20 : 16],
        });

        const marker = L.marker([stop.latitude, stop.longitude], { icon }).addTo(
          mapInstanceRef.current
        );

        marker.bindPopup(`
          <div style="text-align: right; direction: rtl; min-width: 150px;">
            <p style="font-weight: bold; margin-bottom: 4px;">
              ${isStart ? '🚩 نقطة البداية' : `📍 المحطة ${index}`}
            </p>
            <p style="color: #666; font-size: 14px;">${stop.label}</p>
          </div>
        `);

        markersRef.current.push(marker);
      });

      // Draw route line
      if (coordinates.length > 1) {
        polylineRef.current = L.polyline(coordinates, {
          color: '#0ea5e9',
          weight: 4,
          opacity: 0.8,
          dashArray: '10, 10',
        }).addTo(mapInstanceRef.current);
      }

      // Fit bounds to show all markers
      if (coordinates.length > 0) {
        const bounds = L.latLngBounds(coordinates);
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    });
  }, [route]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-primary-50 px-4 py-3 border-b">
        <h3 className="font-bold text-primary-800 flex items-center gap-2">
          <span>🗺️</span>
          خريطة المسار
        </h3>
      </div>
      <div ref={mapRef} className="h-80 w-full" />
      {!route && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 rounded-xl">
          <p className="text-gray-500 text-center">
            <span className="text-4xl block mb-2">🗺️</span>
            اختر أماكن لعرض المسار على الخريطة
          </p>
        </div>
      )}
    </div>
  );
}

