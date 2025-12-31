import { useCallback, useRef, useEffect } from 'react';
import type { Event } from '../types/event.ts';
import { geocodeAddress } from '../utils/map.ts';
import { useThrottle } from '../hooks/useThrottle.tsx';

interface GoogleMapViewProps {
  events: Event[];
}

export const GoogleMapView = ({ events }: GoogleMapViewProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const throttledEvents = useThrottle<Event[]>(events, 1000);

  const createPin = (event: Event) => {
    const pin = document.createElement('div');
    pin.className =
      'size-8 bg-primary-base rounded-full border-2 border-white ring-2 ring-primary-dark';

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

  const initGoogleMap = useCallback(async () => {
    if (!mapRef.current || mapInstanceRef.current) return;
    await google.maps.importLibrary('marker');

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      // 광화문
      center: { lat: 37.5665, lng: 126.978 },
      zoom: 15,
      mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
    });
  }, []);

  useEffect(() => {
    const checkIfGoogleIsLoaded = () => {
      return typeof window.google === 'object' && typeof window.google.maps === 'object';
    };
    if (checkIfGoogleIsLoaded()) {
      initGoogleMap();
    }
  }, [initGoogleMap]);

  useEffect(() => {
    if (!mapInstanceRef.current || throttledEvents.length === 0) return;
    const map = mapInstanceRef.current;
    markersRef.current.forEach((marker) => {
      marker.map = null;
    });
    markersRef.current = [];

    const drawMarkers = async () => {
      const results = await Promise.allSettled(
        throttledEvents.map(async (event) => {
          if (!event.location || !event.eventName) return null;
          try {
            const position = await geocodeAddress(event.location);
            return { position, event };
          } catch (error) {
            console.error('주소 변환 실패:', event.location, error);
          }
        })
      );
      results.forEach((result) => {
        if (result.status === 'rejected') return;
        const res = result.value;
        if (!res) return;
        const marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: res.position,
          content: createPin(res.event),
        });
        markersRef.current.push(marker);
      });
    };
    drawMarkers();
  }, [throttledEvents]);

  return <div className="map" style={{ width: '500px', height: '60vh' }} ref={mapRef}></div>;
};
