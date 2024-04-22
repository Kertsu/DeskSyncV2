import { Component, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ParamsBuilderService } from '../../services/params-builder.service';
import { WebService } from '../../services/web.service';
import { forkJoin } from 'rxjs';
import { User } from '../../models/User';
import { Reservation } from '../../models/Reservation';

@Component({
  selector: 'app-manage-reservations',
  templateUrl: './manage-reservations.component.html',
  styleUrl: './manage-reservations.component.css',
  providers: [MessageService, ConfirmationService],
})
export class ManageReservationsComponent {
  checked = new FormControl();

  loading: boolean = false;
  totalRecords!: number;
  selectAll: boolean = false;

  users: User[] = [];
  reservations: Reservation[] = [
    // {
    //   id: '65c899a350ab95ded5945bdc',
    //   user: 'Kurtd Daniel Bigtas',
    //   deskNumber: 24,
    //   date:  '2024-02-22T00:00:00.000Z',
    //   startTime: '2024-02-22T00:00:00.000Z',
    //   endTime: '2024-02-22T09:00:00.000Z',
    //   status: 'PENDING',
    //   mode: 0,
    //   createdAt: '2024-02-11T09:55:47.820Z',
    //   updatedAt: '2024-02-11T09:55:47.820Z',
    //   __v: 0,
    // },
    // {
    //   id: '65c899ba50ab95ded5945bfd',
    //   user: 'Kurtd Daniel Bigtas',
    //   deskNumber: 80,
    //   date:  '2024-02-25T00:00:00.000Z',
    //   startTime: '2024-02-25T00:00:00.000Z',
    //   endTime: '2024-02-25T09:00:00.000Z',
    //   status: 'APPROVED',
    //   mode: 0,
    //   createdAt: '2024-02-11T09:56:10.185Z',
    //   updatedAt: '2024-02-11T09:56:10.185Z',
    //   __v: 0,
    // },
    // {
    //   id: '65c899cb50ab95ded5945c13',
    //   user: 'Kurtd Daniel Bigtas',
    //   deskNumber: 46,
    //   date:  '2024-02-19T00:00:00.000Z',
    //   startTime: '2024-02-19T00:00:00.000Z',
    //   endTime: '2024-02-19T09:00:00.000Z',
    //   status: 'STARTED',
    //   mode: 0,
    //   createdAt: '2024-02-11T09:56:27.906Z',
    //   updatedAt: '2024-02-11T09:56:27.906Z',
    //   __v: 0,
    // },
  ];

  reservation!: any;

  selectedReservations!: any[] | null;

  submitted: boolean = false;

  @ViewChild('dt') dt: Table | undefined;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private webService: WebService,
    private paramsBuilder: ParamsBuilderService
  ) {}

  ngOnInit() {}

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  deleteSelectedReservations() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to reject the selected reservations?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.reservations = this.reservations.filter(
          (val) => !this.selectedReservations?.includes(val)
        );
        this.selectedReservations = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Reservations Rejected',
          life: 3000,
        });
      },
    });
  }

  deleteReservation(reservation: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to reject this reservation?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.reservations = this.reservations.filter(
          (val) => val.id !== reservation.id
        );
        this.reservation = {};
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Reservation Rejected',
          life: 3000,
        });
      },
    });
  }

  getImage(reservation: any) {
    return `../../assets/images/map/desk-area/${reservation.deskNumber}.png`;
  }

  loadReservations(event: any) {
    this.loading = true;
    const eventParams = { mode: 0, ...event };
    const params = this.paramsBuilder.buildParams(eventParams);

    forkJoin([
      this.webService.getUsers(),
      this.webService.getReservations(params),
    ]).subscribe({
      next: ([users, reservations]: [any, any]) => {
        this.loading = false;
        console.log('USERS', users);
        console.log('RESERVATIONS', reservations);
        this.users = users.users;
        this.reservations = reservations.reservations;
        this.totalRecords = reservations.totalDocuments;
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
          life: 3000,
        });
      },
      complete: () => {
        this.loading = false;
        this.matchUserId();
      },
    });
  }

  onSelectionChange(event: any) {
    console.log(event);
  }
  onSelectAllChange(event: any) {
    console.log(event);
  }

  matchUserId() {
    for (const reservation of this.reservations) {
      for (const user of this.users) {
        if (reservation.user == user.id) {
          reservation.user = user;
        }
      }
    }
  }

  handleReservation(reservation:Reservation,action: string) {
    this.webService.handleReservation(reservation, action).subscribe({
      next: () => {
        this.messageService.add({
          severity:'success',
          summary: 'Successful',
          detail: `Reservation ${action == 'reject' ? 'rejected' : 'approved'}`,
          life: 3000,
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.error,
          life: 3000,
        });
      },
      complete: ()=>{
        if (action == 'approve'){
          for (const r of this.reservations) {
            if (r.id == reservation.id) {
              r.status = 'APPROVED';
            }
          }
        } else{
          this.reservations = this.reservations.filter(r => r.id !== reservation.id)
        }
      }
    })
  }

  abortReservation(reservation: Reservation) {
    this.webService.onAbort(reservation).subscribe({
      next: () => {
        this.messageService.add({
          severity:'success',
          summary: 'Successful',
          detail: 'Reservation aborted',
          life: 3000,
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.error,
          life: 3000,
        });
      },
      complete: () => {
        this.reservations = this.reservations.filter(r => r.id !== reservation.id)
      }
    })
  }

  confirm(reservation: Reservation, action: string) {
    this.confirmationService.confirm({
      message: `Are you sure you want to ${action} this reservation?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        switch(action){
          case 'approve':
          case'reject':
            this.handleReservation(reservation, action);
            break;
          case 'abort':
            this.abortReservation(reservation);
            break;
        }
      },
    });
  }
}