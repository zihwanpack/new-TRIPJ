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
