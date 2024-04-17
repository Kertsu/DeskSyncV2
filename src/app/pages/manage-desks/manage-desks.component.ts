import { Component, ViewChild } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { WebService } from '../../services/web.service';
import { ParamsBuilderService } from '../../services/params-builder.service';
import { Hotdesk } from '../../models/Hotdesk';
import { ReservationRequest } from '../../requests/ReservationRequest';
import { timeConvert } from '../../utils/reservation-time-converter.util';
@Component({
  selector: 'app-manage-desks',
  templateUrl: './manage-desks.component.html',
  styleUrl: './manage-desks.component.css',
  providers: [MessageService, ConfirmationService],
})
export class ManageDesksComponent {
  deskDialog: boolean = false;
  editDialog: boolean = false;

  areas: any = [];

  desks: Hotdesk[] = [];

  desk!: Hotdesk;

  selectedDesks!: Hotdesk[] | null;

  submitted: boolean = false;

  createForm: FormGroup;
  editForm: FormGroup;

  loading: boolean = false;
  totalRecords!: number;
  selectAll: boolean = false;

  minDate!: Date;

  wsEssentials = [
    { label: 'Desk Organizer' },
    { label: 'Noise-Canceling Headphones' },
    { label: 'Desk Plants' },
    { label: 'Personalized Nameplate' },
    { label: 'Cubicle Mirror' },
    { label: 'Footrest' },
    { label: 'Desk Lamp' },
    { label: 'Bulletin Board' },
    { label: 'Mini Fridge' },
    { label: 'Task Lighting' },
    { label: 'Whiteboard' },
    { label: 'Under-Desk Storage' },
    { label: 'Cubicle Shelf' },
    { label: 'Cubicle Privacy Screen' },
    { label: 'Ergonomic Chair Cushion' },
  ];

  @ViewChild('dt') dt: Table | undefined;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private webService: WebService,
    private paramsBuilder: ParamsBuilderService
  ) {
    this.createForm = new FormGroup({
      deskNumber: new FormControl(null, [Validators.required]),
      essentials: new FormControl(null, [
        Validators.required,
        this.limitSelection.bind(this),
      ]),
    });
    this.editForm = new FormGroup({
      status: new FormControl(null, [Validators.required]),
      essentials: new FormControl(null, [
        Validators.required,
        this.limitSelection.bind(this),
      ]),
      date: new FormControl(null),
    });
  }

  ngOnInit() {
    let today = new Date();
    let minDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    this.minDate = minDate;

    this.areas = [
      { name: 'Workstation', number: 1 },
      { name: 'Left-Wing Main Office', number: 2 },
      { name: 'Right-Wing Main Office', number: 3 },
    ];
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  openNew() {
    this.desk = {};
    this.submitted = false;
    this.deskDialog = true;
  }

  deleteSelectedDesks() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected desks?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.desks = this.desks.filter(
          (val) => !this.selectedDesks?.includes(val)
        );
        this.selectedDesks = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Desks Deleted',
          life: 3000,
        });
      },
    });
  }

  editDesk(desk: any) {
    this.editForm.get('status')?.setValue({ name: desk.status });
    this.editForm.get('essentials')?.setValue(
      desk.workspaceEssentials.map((essential: any) => ({
        label: essential,
      }))
    );

    this.desk = { ...desk };
    this.editDialog = true;
    console.log(this.desk);
  }

  deleteDesk(desk: Hotdesk) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + desk.title + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.webService.deleteHotdesk(desk).subscribe({
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error.error,
              life: 3000,
            });
          },
          complete: () => {
            this.desks = this.desks.filter((val) => val.id !== desk.id);
            this.desk = {};
            this.totalRecords = this.desks.length
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Desk Deleted',
              life: 3000,
            });
          },
        });
      },
    });
  }

  hideDialog() {
    this.createForm.reset();
    this.editForm.reset();
    this.deskDialog = false;
    this.editDialog = false;
    this.submitted = false;
  }

  saveDesk() {
    if (this.editForm.get('status')?.value.name === 'UNAVAILABLE') {
      this.editForm.get('date')?.setValue(null);
    }

    if (this.editForm.get('date')?.value !== null) {
      const { startTime, endTime, date } = timeConvert(
        this.editForm.get('date')?.value
      );

      // const unavailableDate = this.datePipe.transform(
      //   `${formattedDate}T00:00:00.000Z`,
      //   'mediumDate'
      // );

      const data: ReservationRequest = {
        date,
        startTime,
        endTime,
        deskNumber: this.desk.deskNumber as number,
        mode: 1,
      };

      this.webService.onReserve(data).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.error,
            life: 3000,
          });
        },
        complete: () => {
          this.editDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Desk Updated',
            life: 3000,
          });
          this.desk = {};
        },
      });
    } else {
      const data = {
        status: this.editForm.get('status')?.value.name,
        essentials: this.editForm
          .get('essentials')
          ?.value.map((essential: { label: string }) => essential.label),
      };
      this.webService.updateHotdesk(this.desk, data).subscribe({
        next: (res: any) => {},
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.error,
            life: 3000,
          });
        },
        complete: () => {
          this.editDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Desk Updated',
            life: 3000,
          });

          for (const desk of this.desks) {
            if (desk.id == this.desk.id) {
              desk.status = this.editForm.get('status')?.value.name;
              desk.workspaceEssentials = this.editForm
                .get('essentials')
                ?.value.map((essential: { label: string }) => essential.label);
              break;
            }
          }
          this.desk = {};
        },
      });
    }
  }

  loadDesks(event: any) {
    console.log(event);
    this.loading = true;
    const params = this.paramsBuilder.buildParams(event);
    this.webService.getDesks(params).subscribe((res: any) => {
      console.log(res.desks);
      this.desks = res.desks;
      this.totalRecords = res.totalDocuments;
      this.loading = false;
    });
  }

  onSelectionChange(value = []) {
    this.selectAll = value.length === this.totalRecords;
    this.selectedDesks = value;
  }

  onSelectAllChange(event: any) {
    const checked = event.checked;

    if (checked) {
      this.webService
        .getDesks('http://localhost:8000/api/hotdesks')
        .subscribe((res: any) => {
          if (res.success) {
            console.log(res);
            this.selectedDesks = res.desks;
            this.selectAll = true;
          }
        });
    } else {
      this.selectedDesks = [];
      this.selectAll = false;
    }
  }

  getImage(desk: any) {
    return `../../assets/images/map/individual/${desk.deskNumber}.png`;
  }

  getArea(area: number) {
    switch (area) {
      case 1:
        return 'Workstation';
      case 2:
        return 'Left-Wing Main Office';
      case 3:
        return 'Right-Wing Main Office';
      default:
        return;
    }
  }

  createDesk() {
    if (this.createForm.valid) {
      this.deskDialog = false;
      const { deskNumber, essentials } = this.createForm.value;
      const desk = {
        deskNumber,
        essentials: essentials.map((essential: any) => essential.label),
      };
      this.webService.createHotdesk(desk).subscribe({
        next: (res: any) => {
          console.log(res);
          this.desks.unshift(res.desk);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.error,
            life: 3000,
          });
        },
        complete: () => {
          this.createForm.reset();
          this.submitted = false;
          this.totalRecords = this.desks.length
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Desk Created',
            life: 3000,
          });
        },
      });
    } else {
      console.log('Form is invalid!');
    }
  }

  limitSelection(control: FormControl): { [key: string]: boolean } | null {
    const selectedItems = control.value;
    if (selectedItems && selectedItems.length > 3) {
      return { maxSelection: true };
    }
    return null;
  }
}