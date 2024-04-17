import { Injectable } from '@angular/core';
import { ReservationRequest } from '../requests/ReservationRequest';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  storageKey: string = 'hdbsv2-reservation'
  setReservation(reservation: ReservationRequest) {
    sessionStorage.setItem(this.storageKey, JSON.stringify(reservation))
  }

  getReservation(): ReservationRequest | null {
    const reservationStr = sessionStorage.getItem(this.storageKey);
    return reservationStr ? JSON.parse(reservationStr) : null;
  }
}