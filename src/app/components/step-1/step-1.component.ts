import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UiService } from '../../services/ui.service';
import { Subscription } from 'rxjs';
import { MessageService } from '../../utils/message.service';
import { ReservationService } from '../../services/reservation.service';
import { ReservationRequest } from '../../requests/ReservationRequest';

interface Area {
  name: string;
  number: number;
}

@Component({
  selector: 'app-step-1',
  templateUrl: './step-1.component.html',
  styleUrl: './step-1.component.css',
})
export class Step1Component implements OnInit, OnDestroy {
  areas!: Area[];
  form!: FormGroup;
  area: string = '';
  areaNumber!: number | undefined;

  formSubscription!: Subscription;

  mapAreas = [
    {
      id: 1,
      alt: 'Workstation',
      title: 'Workstation',
      coords: '1024,33,2037,1684',
      shape: 'rect',
      clickable: {
        top: 1.3,
        left: 25.95,
        height: 43.9,
        width: 24.525,
      },
    },
    {
      id: 2,
      alt: 'Left-Wing Main Office',
      title: 'Left-Wing Main Office',
      coords: '29,1698,1067,2984',
      shape: 'rect',
      clickable: {
        top: 56.25,
        left: 1,
        width: 25.54,
        height: 42.6,
      },
    },
    {
      id: 3,
      alt: 'Right-Wing Main Office',
      title: 'Right-Wing Main Office',
      coords: '1952,1694,2979,2984',
      shape: 'rect',
      clickable: {
        top: 56.25,
        left: 49,
        height: 42.6,
        width: 25.25,
      },
    },
  ];

  constructor(
    private router: Router,
    private uiService: UiService,
    private messageService: MessageService,
    private reservationService: ReservationService
  ) {
    this.areas = [
      { name: 'Workstation', number: 1 },
      { name: 'Left-Wing Main Office', number: 2 },
      { name: 'Right-Wing Main Office', number: 3 },
    ];

    this.form = new FormGroup({
      selectedArea: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {

    this.formSubscription = this.form.valueChanges.subscribe((res) => {
      if (res.selectedArea) {
        this.area = res.selectedArea.name;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  handleSelectArea(area: number) {
    this.areaNumber = area;

    switch (area) {
      case 1:
        this.area = 'Workstation';
        break;
      case 2:
        this.area = 'Left-Wing Main Office';
        break;
      case 3:
        this.area = 'Right-Wing Main Office';
        break;
    }
    this.form
      .get('selectedArea')
      ?.setValue({ name: this.area, number: this.areaNumber });
  }

  reset() {
    this.form.reset();
    this.area = '';
    this.areaNumber = undefined;
  }

  next() {
    if (this.form.valid) {
      const reservation: ReservationRequest = {
        area: this.areaNumber,
        date: undefined,
        startTime: undefined,
        endTime: undefined,
        deskNumber: undefined,
        mode: undefined,
      };

      this.reservationService.setReservation(reservation);
      this.router.navigate(['hdbsv2/book/desk-area']);
    } else {
      this.messageService.addMessage('info', '', 'Area cannot be empty', 3000);
    }
  }
}
