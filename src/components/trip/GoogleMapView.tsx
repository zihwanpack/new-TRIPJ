import { useRef, useEffect, useState } from 'react';
import type { Event } from '../../types/event.ts';
import { geocodeAddress } from '../../utils/trip/geocodeAddress.ts';
import { useThrottle } from '../../hooks/common/useThrottle.tsx';
import { env } from '../../schemas/common/envSchema.ts';
import { loadGoogleMaps } from '../../utils/trip/loadGoogleMaps.ts';

interface GoogleMapViewProps {
  events: Event[];
}

export const GoogleMapView = ({ events }: GoogleMapViewProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const throttledEvents = useThrottle<Event[]>(events, 1000);
  const [isMapReady, setIsMapReady] = useState<boolean>(false);

  const createPin = (event: Event) => {
    const pin = document.createElement('div');
    pin.innerHTML = `
      <div class="relative group z-10">
        <div class="size-4 bg-primary-base rounded-full border-2 border-white shadow-sm cursor-pointer transition-transform duration-200 group-hover:scale-110"></div>
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 invisible opacity-0 translate-y-2
                    group-hover:visible group-hover:opacity-100 group-hover:translate-y-0
                    transition-all duration-300 ease-out bg-white rounded-xl shadow-xl border border-gray-100
                    w-56 text-xs overflow-hidden
        ">
          <div class="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <h3 class="font-bold text-gray-800 text-sm truncate">${event.eventName}</h3>
            <div class="flex items-center text-gray-500 mt-1 space-x-1">
              <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <span class="truncate">${event.location}</span>
            </div>
          </div>

          <div class="px-4 py-3">
            <ul class="space-y-1.5 w-full">
              ${event.cost
                .map(
                  (cost) => `
                <li class="flex justify-between items-center text-gray-600">
                  <span class="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] text-gray-500 font-medium">${cost.category}</span>
                  <span class="font-semibold text-gray-800">${cost.value.toLocaleString()}원</span>
                </li>
              `
                )
                .join('')}
            </ul>
          </div>

          <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-gray-100 rotate-45 transform"></div>
        </div>
      </div>
    `;
    return pin;
  };
  useEffect(() => {
    const initGoogleMap = async () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      await loadGoogleMaps();
      await google.maps.importLibrary('marker');

      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        center: { lat: 37.5665, lng: 126.978 },
        zoom: 15,
        mapId: env.VITE_GOOGLE_MAP_ID,
      });

      setIsMapReady(true);
    };
    initGoogleMap();
  }, []);

  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || throttledEvents.length === 0) return;

    const map = mapInstanceRef.current;

    markersRef.current.forEach((marker) => (marker.map = null));
    markersRef.current = [];

    const drawMarkers = async () => {
      const bounds = new google.maps.LatLngBounds();
      const results = await Promise.allSettled(
        throttledEvents.map(async (event) => {
          if (!event.location || !event.eventName) return null;
          const position = await geocodeAddress(event.location);
          return { position, event };
        })
      );

      results.forEach((result) => {
        if (result.status !== 'fulfilled' || !result.value) return;

        const marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: result.value.position,
          content: createPin(result.value.event),
        });

        markersRef.current.push(marker);
        bounds.extend(result.value.position);
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds);
      }
    };

    drawMarkers();
  }, [throttledEvents, isMapReady]);

  return (
    <div className="relative">
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          지도 불러오는 중...
        </div>
      )}
      <div ref={mapRef} style={{ width: '500px', height: '60vh' }} />
    </div>
  );
};
