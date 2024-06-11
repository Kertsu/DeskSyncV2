import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Reservation } from '../../models/Reservation';
import { ParamsBuilderService } from '../../services/params-builder.service';
import { WebService } from '../../services/web.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-manage-issues',
  templateUrl: './manage-issues.component.html',
  styleUrl: './manage-issues.component.css',
  providers: [MessageService, ConfirmationService, DatePipe],
})
export class ManageIssuesComponent {
loading: boolean = false;
  totalRecords!: number;
  selectAll: boolean = false;

  deskReports: any[] = [];

  selectedDeskReports!: any[] | null;

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

  // resolveSelectedDeskReports() {
  //   this.confirmationService.confirm({
  //     message: 'Are you sure you want to delete the selected desk reports?',
  //     header: 'Confirm',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       this.deskReports = this.deskReports.filter(
  //         (val) => !this.selectedDeskReports?.includes(val)
  //       );
  //       this.selectedDeskReports = null;
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Successful',
  //         detail: 'DeskReports Deleted',
  //         life: 3000,
  //       });
  //     },
  //   });
  // }

  markAsResolved(report: any) {
    this.confirmationService.confirm({
      message: `Are you sure you want to mark this report as resolved?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.webService.handleReport(report.id, 'resolve').subscribe({
          next: (res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: res.message,
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
            this.selectedDeskReports = null;
            this.deskReports.map((deskReport) => {
              if (deskReport.id === report.id) {
                deskReport.status = 'RESOLVED';
              }
            })
          },
        });
      },
    });
  }

  getImage(report: any) {
    return `../../assets/images/map/desk-area/${report.deskNumber}.png`;
  }

  loadDeskReports(event: any) {
    this.loading = true;
    const eventParams = { mode: 1, ...event };
    const params = this.paramsBuilder.buildParams(eventParams);

    this.webService.getReports(params).subscribe({
      next: (res: any) => {
        this.deskReports = res.reports;
        this.totalRecords = res.totalDocuments;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
  onSelectionChange(event: any) {
  }
  onSelectAllChange(event: any) {
  }
}
