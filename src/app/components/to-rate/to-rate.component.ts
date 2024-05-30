import { Component, OnInit } from '@angular/core';
import { WebService } from '../../services/web.service';
import { ParamsBuilderService } from '../../services/params-builder.service';

@Component({
  selector: 'app-to-rate',
  templateUrl: './to-rate.component.html',
  styleUrl: './to-rate.component.css',
})
export class ToRateComponent implements OnInit {
  toRateReservations: {
    user: string;
    reservation: string;
    deskNumber: number;
    status: string;
    mode: number;
    date: string;
  }[] = [];

  first: number = 0;
  limit: number = 10;
  totalRecords!: number;

  constructor(private webService: WebService, private paramsBuilder: ParamsBuilderService) {}

  ngOnInit(): void {
    const eventParams = { mode: 0, filters: {}, first: this.first, rows: this.limit, sortField: 'createdAt', sortOrder: -1   };
    this.webService.getSelfToRateReservations(eventParams).subscribe({
      next: (res: any) => {
        console.log(res)
        this.toRateReservations = res.toRateReservations;
        this.totalRecords = res.totalDocuments;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('complete');
      },
    });
  }
  getImage(deskNumber: number) {
    return `../../assets/images/map/desk-area/${deskNumber}.png`;
  }
}
