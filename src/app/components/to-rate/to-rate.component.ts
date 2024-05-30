import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebService } from '../../services/web.service';
import { ParamsBuilderService } from '../../services/params-builder.service';
import { SocketService } from '../../services/socket.service';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { FeedbackComponent } from '../feedback/feedback.component';
import { UserService } from '../../services/user.service';

interface ToRate {
  user: string;
  reservation: string;
  deskNumber: number;
  status: string;
  mode: number;
  date: string;
}
@Component({
  selector: 'app-to-rate',
  templateUrl: './to-rate.component.html',
  styleUrl: './to-rate.component.css',
  providers: [DialogService],
})
export class ToRateComponent implements OnInit, OnDestroy {
  toRateReservations: ToRate[] = [];

  ref: DynamicDialogRef | undefined = undefined;

  first: number = 0;
  limit: number = 10;
  totalRecords!: number;

  user!: any;

  storageEventListener!: (event: StorageEvent) => void

  constructor(
    private webService: WebService,
    private paramsBuilder: ParamsBuilderService,
    private socketService: SocketService,
    private dialogService: DialogService,
    private userService: UserService
  ) {
    this.storageEventListener = (event: StorageEvent) => {
      if (event.key === 'hdbsv2User') {
        this.user = JSON.parse(event.newValue as string);
      }
    };
    window.addEventListener('storage', this.storageEventListener);
  }

  ngOnInit(): void {
    this.user = this.userService.getUser();
    const eventParams = {
      mode: 0,
      filters: {
        status: {
          matchMode: 'equals',
          value: 'PENDING',
        },
      },
      first: this.first,
      rows: this.limit,
      sortField: 'createdAt',
      sortOrder: -1,
    };
    const params = this.paramsBuilder.buildParams(eventParams);
    this.webService.getSelfToRateReservations(params).subscribe({
      next: (res: any) => {
        console.log(res);
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

    this.socketService.reservationEnded.subscribe((res: any) => {
      this.toRateReservations = this.toRateReservations.concat(res);
      this.totalRecords = this.toRateReservations.length;
      if (this.user) {
        this.user.toRate += 1;
      }
      this.userService.setUser(this.user);
    });

    window.addEventListener('storage', this.storageEventListener, false);
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.storageEventListener);
  }
  getImage(deskNumber: number) {
    return `../../assets/images/map/desk-area/${deskNumber}.png`;
  }

  loadMore() {
    this.first += this.limit;
    const eventParams = {
      mode: 0,
      filters: {},
      first: this.first,
      rows: this.limit,
      sortField: 'createdAt',
      sortOrder: -1,
    };
    this.webService.getSelfToRateReservations(eventParams).subscribe({
      next: (res: any) => {
        console.log(res);
        this.toRateReservations = this.toRateReservations.concat(
          res.toRateReservations
        );
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

  openDialog(toRate: ToRate) {
    const { deskNumber, user, reservation } = toRate;
    const dialogConfig: DynamicDialogConfig = {
      header: `Feedback on your reservation on Hotdesk #${deskNumber}`,
      data: {
        deskNumber,
        user,
        reservation,
      },
      modal: true,
      closeOnEscape: true,
      breakpoints: { '2000px': '30vw', '1440px': '60vw', '500px': '90vw' },
    };
    this.ref = this.dialogService.open(FeedbackComponent, dialogConfig);

    let self = this;
    this.ref.onClose.subscribe((feedback) => {
      this.toRateReservations = this.toRateReservations.filter((r) => {
        self.user.toRate -= 1;
        self.userService.setUser(self.user)
        return r.reservation !== feedback.reservation;
      });
    });
  }
}
