import type { DestinationKey } from '../constants/tripImages.ts';

export type Trip = {
  id: number;
  title: string;
  destination: DestinationKey;
  startDate: string;
  endDate: string;
  members?: string[];
  createdBy?: string;
};

export interface TripCreateRequest {
  destination: string;
  start_date: string;
  end_date: string;
  member: string[];
  title: string;
  created_by: string;
}
