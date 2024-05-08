import { Component } from '@angular/core';
import { Reservation } from '../../models/Reservation';
import { MessageService, ConfirmationService } from 'primeng/api';
import { WebService } from '../../services/web.service';
import { ParamsBuilderService } from '../../services/params-builder.service';

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

  constructor(
    private webService: WebService,
    private messageService: MessageService,
    private paramsBuilder: ParamsBuilderService,
    private confirmationService: ConfirmationService
  ) {}

  cancelSelectedReservations() {}
  loadReservations(event: any) {
    this.loading = true;
    const eventParams = { mode: 0, ...event };
    const params = this.paramsBuilder.buildParams(eventParams);

    this.webService.getSelfReservations(params).subscribe({
      next: (res: any) => {
        console.log(res);
        this.reservations = res.reservations;
        this.totalRecords = res.totalDocuments;
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
      },
      complete: () => {},
    });
  }
  onSelectionChange(event: any) {}
  onSelectAllChange(event: any) {}

  getImage(reservation: Reservation) {
    return `../../assets/images/map/desk-area/${reservation.deskNumber}.png`;
  }
  confirm(reservation: Reservation) {
    this.confirmationService.confirm({
      message: `Are you sure you want to canel this reservation?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cancelReservation(reservation);
      },
    });
  }

  cancelReservation(reservation: Reservation) {
    this.webService.cancelReservation(reservation).subscribe({
      next: (res: any) => {
        console.log(res);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: res.message,
          life: 3000,
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.error,
        });
      },
      complete: () => {
        this.reservations = this.reservations.filter(
          (r) => r.id !== reservation.id
        );
        this.totalRecords = this.reservations.length;
      },
    });
  }
}
