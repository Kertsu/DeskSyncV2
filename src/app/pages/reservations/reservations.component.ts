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
    private paramsBuilder: ParamsBuilderService,
    private confirmationService: ConfirmationService,
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
        
      },
    });
  }

  
}
