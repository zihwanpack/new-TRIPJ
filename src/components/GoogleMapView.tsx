import { useRef, useEffect, useState } from 'react';
import type { Event } from '../types/event.ts';
import { geocodeAddress } from '../utils/map.ts';
import { useThrottle } from '../hooks/useThrottle.tsx';
import { env } from '../schemas/envSchema.ts';

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
      <div class="relative group">
        <div class="size-3 bg-primary-base rounded-full border-2 border-white"></div>
        <div class="
          absolute bottom-6 left-1/2 -translate-x-1/2
          hidden group-hover:block
          bg-white p-3 rounded-lg shadow-lg
          w-48 text-xs
        ">
          <div class="font-bold">${event.eventName}</div>
          <div class="text-gray-500 mt-1">${event.location}</div>
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

let googleMapsPromise: Promise<void> | null = null;

const loadGoogleMaps = () => {
  if (googleMapsPromise) return googleMapsPromise;

  googleMapsPromise = new Promise((resolve) => {
    if (window.google?.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${env.VITE_GOOGLE_MAPS_API_KEY}&language=ko`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });

  return googleMapsPromise;
};
