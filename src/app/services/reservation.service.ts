import { Injectable } from '@angular/core';
import { ReservationRequest } from '../requests/ReservationRequest';
import { WebService } from './web.service';
import { Hotdesk } from '../models/Hotdesk';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  reservations: [] = [];
  desks: [] = [];

  constructor(private webService: WebService) {}

  storageKey: string = 'hdbsv2-reservation';
  setReservation(reservation: ReservationRequest) {
    sessionStorage.setItem(this.storageKey, JSON.stringify(reservation));
  }

  getReservation(): ReservationRequest | null {
    const reservationStr = sessionStorage.getItem(this.storageKey);
    return reservationStr ? JSON.parse(reservationStr) : null;
  }

  getDesksAndReservations(
    deskQueryParams: any,
    reservationQueryParams: any,
    callback?: () => void
  ) {
    forkJoin([
      this.webService.getDesks(deskQueryParams),
      this.webService.getReservations(reservationQueryParams),
    ]).subscribe({
      next: ([desksRes, reservationsRes]: [any, any]) => {
        this.reservations = reservationsRes.reservations;
        this.desks = desksRes.desks;
        // console.log(desksRes.desks);
        // console.log(reservationsRes.reservations);
      },
      error: (err) => {
      },
      complete: () => {
        if (callback) {
          callback();
        }
      },
    });
  }

  updateDesksStatus(
    reservations: any[],
    desks: Hotdesk[],
    callback?: () => void
  ) {
    for (const desk of desks) {
      if (desk.status === 'UNAVAILABLE') {
        desk.status = 'PERMANENTLY UNAVAILABLE';
        continue;
      }

      if (reservations.length == 0) {
        desk.status =
          desk.status === 'PERMANENTLY UNAVAILABLE'
            ? 'PERMANENTLY UNAVAILABLE'
            : 'AVAILABLE';
      }

      desk.status = desk.status === 'AVAILABLE' ? 'AVAILABLE' : desk.status;

      const reservation = reservations.find(
        (r) => r.deskNumber === desk.deskNumber
      );

      if (reservation) {
        if (reservation.mode == 1) {
          desk.status = 'TEMPORARILY UNAVAILABLE';
        } else {
          switch (reservation.status) {
            case 'PENDING':
              desk.status = 'BOOKED';
              break;
            case 'APPROVED':
              desk.status = 'RESERVED';
              break;
            case 'STARTED':
              desk.status = 'OCCUPIED';
              break;
          }
        }
      }
    }

    if(callback) {
      callback();
    }
    return {updatedDesks: desks};
  }
}
