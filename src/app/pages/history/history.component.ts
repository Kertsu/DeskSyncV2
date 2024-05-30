import { Component, OnInit } from '@angular/core';
import { Reservation } from '../../models/Reservation';
import { WebService } from '../../services/web.service';
import { ParamsBuilderService } from '../../services/params-builder.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
})
export class HistoryComponent {
  loading: boolean = false;
  totalRecords!: number;
  reservations: Reservation[] = [];

  constructor(
    private paramsBuilder: ParamsBuilderService,
    private webService: WebService,
    private userService: UserService
  ) {}
  getImage(reservation: Reservation) {
    return `../../assets/images/map/desk-area/${reservation.deskNumber}.png`;
  }

  loadReservations(event: any) {
    this.loading = true;
    const eventParams = {
      mode: 0,
      ...event,
    };

    const params = this.paramsBuilder.buildParams(eventParams);

    this.webService.getSelfReservationHistory(params).subscribe({
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
}
