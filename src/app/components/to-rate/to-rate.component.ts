import { Component, OnInit } from '@angular/core';
import { WebService } from '../../services/web.service';
import { ParamsBuilderService } from '../../services/params-builder.service';
import { UserService } from '../../services/user.service';

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
  }[] = [];

  first: number = 0;
  limit: number = 10;

  constructor(private webService: WebService, private paramsBuilder: ParamsBuilderService, private userService: UserService) {}

  ngOnInit(): void {
    const eventParams = { mode: 0, filters: {}, first: this.first, rows: this.limit, sortField: 'createdAt', sortOrder: -1   };
    // const params = this.paramsBuilder.buildParams(eventParams);
    this.webService.getSelfToRateReservations(eventParams).subscribe({
      next: (res: any) => {
        console.log(res)
        this.toRateReservations = res;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('complete');
      },
    });
  }
}
