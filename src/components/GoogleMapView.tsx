import type { Event } from '../types/event.ts';

interface GoogleMapViewProps {
  events: Event[];
}

export const GoogleMapView = ({ events }: GoogleMapViewProps) => {
  console.log(events);
  return (
    <div className="w-full h-full bg-gray-200 flex items-center justify-center">지도 표시 영역</div>
  );
};
