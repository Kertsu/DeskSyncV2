import { User } from "./User";

export interface Reservation {
  id: string;
  user: User | string;
  deskNumber: number;
  startTime: string;
  endTime: string;
  date: string;
  status: string;
  mode: number;
}