import type { Cost } from './cost.ts';

export type Event = {
  id: number;
  tripId: number;
  eventName: string;
  location: string;
  startDate: string;
  endDate: string;
  cost: Cost[];
};
