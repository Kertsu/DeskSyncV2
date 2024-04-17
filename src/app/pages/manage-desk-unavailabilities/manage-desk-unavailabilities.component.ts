import { Component, ViewChild } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Reservation } from '../../models/Reservation';
import { WebService } from '../../services/web.service';
import { ParamsBuilderService } from '../../services/params-builder.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-manage-desk-unavailabilities',
  templateUrl: './manage-desk-unavailabilities.component.html',
  styleUrl: './manage-desk-unavailabilities.component.css',
  providers: [MessageService, ConfirmationService, DatePipe],
})
export class ManageDeskUnavailabilitiesComponent {
  loading: boolean = false;
  totalRecords!: number;
  selectAll: boolean = false;

  unavailabilities: Reservation[] = [];

  selectedUnavailabilities!: any[] | null;

  submitted: boolean = false;

  @ViewChild('dt') dt: Table | undefined;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private webService: WebService,
    private paramsBuilder: ParamsBuilderService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {}

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  deleteSelectedUnavailabilities() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected unavailabilities?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.unavailabilities = this.unavailabilities.filter(
          (val) => !this.selectedUnavailabilities?.includes(val)
        );
        this.selectedUnavailabilities = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Unavailabilities Deleted',
          life: 3000,
        });
      },
    });
  }

  liftUnavailability(unavailability: Reservation) {
    const date = this.datePipe.transform(unavailability.date, 'mediumDate');
    this.confirmationService.confirm({
      message: `Are you sure you want to lift the suspension of Hotdesk ${unavailability.deskNumber} on ${date}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.webService.onAbort(unavailability).subscribe({
          next: (res: any) => {
            console.log(res);
          },
          error: (error) => {
            console.log(error);
          },
          complete: () => {
            this.selectedUnavailabilities = null;
            this.unavailabilities = this.unavailabilities.filter(u => unavailability.id !== u.id)
            this.totalRecords = this.unavailabilities.length
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Suspension lifted',
              life: 3000,
            });
          },
        });
      },
    });
  }

  getImage(unavailability: any) {
    return `../../assets/images/map/individual/${unavailability.deskNumber}.png`;
  }

  loadUnavailabilities(event: any) {
    this.loading = true;
    const eventParams = { mode: 1, ...event };
    const params = this.paramsBuilder.buildParams(eventParams);
    this.webService.getUnavailabilities(params).subscribe({
      next: (res: any) => {
        this.unavailabilities = res.reservations;
        this.totalRecords = res.totalDocuments;
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
  onSelectionChange(event: any) {
    console.log(event);
  }
  onSelectAllChange(event: any) {
    console.log(event);
  }
}