import { Component } from '@angular/core';
import { Reservation } from '../../models/Reservation';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css',
  providers: [MessageService, ConfirmationService],
})
export class ReservationsComponent {
  loading: boolean = false;
  totalRecords!: number;
  selectAll: boolean = false;

  reservations: Reservation[] = [];
  selectedReservations!: any[] | null;

  cancelSelectedReservations() {}
  loadReservations(event: any) {}
  onSelectionChange(event: any) {}
  onSelectAllChange(event: any) {}

  getImage(reservation: Reservation) {}
  confirm(reservation: Reservation) {}
}
