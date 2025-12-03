'use client';

import { useEffect, useRef } from 'react';
import { Place } from '@/types';

interface PlacesMapProps {
  places: Place[];
  onPlaceClick: (place: Place) => void;
}

export default function PlacesMap({ places, onPlaceClick }: PlacesMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    // Import Leaflet dynamically
    import('leaflet').then((L) => {
      // Initialize map if not already initialized
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapRef.current!).setView(
          [24.4672, 39.6111],
          13
        );

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapInstanceRef.current);
      }

      // Clear existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      // Add markers for each place
      places.forEach((place) => {
        const getMarkerColor = (type: string) => {
          if (type === 'religious') return '#059669'; // green
          if (type === 'historical') return '#d97706'; // orange
          if (type === 'entertainment') return '#7c3aed'; // purple
          return '#3b82f6'; // blue
        };

        const markerIcon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              background-color: ${getMarkerColor(place.type)};
              width: 32px;
              height: 32px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">
              <div style="
                transform: rotate(45deg);
                margin-top: 3px;
                font-size: 16px;
                text-align: center;
                color: white;
              ">
                ${place.type === 'religious' ? '🕌' : place.type === 'historical' ? '🏛️' : '🎭'}
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });

        const marker = L.marker([place.latitude, place.longitude], {
          icon: markerIcon,
        }).addTo(mapInstanceRef.current);

        const getTypeLabel = (type: string) => {
          const labels: Record<string, string> = {
            religious: 'ديني',
            historical: 'تاريخي',
            entertainment: 'ترفيهي',
          };
          return labels[type] || type;
        };

        marker.bindPopup(`
          <div style="text-align: right; direction: rtl; min-width: 200px;">
            <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 8px;">${place.name}</h3>
            <p style="color: #666; font-size: 14px; margin-bottom: 8px;">${getTypeLabel(place.type)}</p>
            <button
              onclick="window.dispatchEvent(new CustomEvent('placeMarkerClick', { detail: '${place.id}' }))"
              style="
                background-color: #0ea5e9;
                color: white;
                padding: 6px 16px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                width: 100%;
              "
            >
              تفاصيل
            </button>
          </div>
        `);

        markersRef.current.push(marker);
      });

      // Fit bounds to show all markers
      if (places.length > 0) {
        const bounds = L.latLngBounds(
          places.map((p) => [p.latitude, p.longitude] as [number, number])
        );
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    });

    // Listen for custom events from popup buttons
    const handleMarkerClick = (e: any) => {
      const placeId = e.detail;
      const place = places.find((p) => p.id === placeId);
      if (place) {
        onPlaceClick(place);
      }
    };

    window.addEventListener('placeMarkerClick', handleMarkerClick as any);

    return () => {
      window.removeEventListener('placeMarkerClick', handleMarkerClick as any);
    };
  }, [places, onPlaceClick]);

  return (
    <div className="w-full h-96 rounded-xl overflow-hidden shadow-lg">
      <div ref={mapRef} className="w-full h-full"></div>
    </div>
  );
}

