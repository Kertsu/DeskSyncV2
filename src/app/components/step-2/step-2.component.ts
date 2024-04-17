import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { ReservationService } from '../../services/reservation.service';
import { ReservationRequest } from '../../requests/ReservationRequest';
import { Router } from '@angular/router';
import { WebService } from '../../services/web.service';
import { Hotdesk } from '../../models/Hotdesk';
import { timeConvert } from '../../utils/reservation-time-converter.util';
declare const imageMapResize: any;
@Component({
  selector: 'app-step-2',
  templateUrl: './step-2.component.html',
  styleUrl: './step-2.component.css',
})
export class Step2Component implements OnInit {
  area!: number | undefined;
  subscription!: Subscription;
  date: Date[] | undefined;
  selectedDesk!: Hotdesk | undefined;
  selectedDate!: any;
  startTime!: string;
  endTime!: string;
  formGroup!: FormGroup;
  options: any[] = [];

  areaDataList = [
    {
      id: 1,
      imagePath: '../../assets/images/map/Area 1 Numbered.png',
      desks: [
        {
          deskNumber: 1,
          alt: 'Hotdesk 1',
          title: 'Hotdesk 1',
          coords: '135,1348,15,1168',
        },
        {
          deskNumber: 2,
          alt: 'Hotdesk 2',
          title: 'Hotdesk 2',
          coords: '140,1168,258,1348',
        },
        {
          deskNumber: 3,
          alt: 'Hotdesk 3',
          title: 'Hotdesk 3',
          coords: '260,1169,382,1348',
        },
        {
          deskNumber: 4,
          alt: 'Hotdesk 4',
          title: 'Hotdesk 4',
          coords: '642,1168,761,1346',
        },
        {
          deskNumber: 5,
          alt: 'Hotdesk 5',
          title: 'Hotdesk 5',
          coords: '763,1169,884,1346',
        },
        {
          deskNumber: 6,
          alt: 'Hotdesk 6',
          title: 'Hotdesk 6',
          coords: '887,1171,1007,1347',
        },
        {
          deskNumber: 7,
          alt: 'Hotdesk 7',
          title: 'Hotdesk 7',
          coords: '102,12,282,153',
        },
        {
          deskNumber: 8,
          alt: 'Hotdesk 8',
          title: 'Hotdesk 8',
          coords: '102,156,282,294',
        },
        {
          deskNumber: 9,
          alt: 'Hotdesk 9',
          title: 'Hotdesk 9',
          coords: '102,298,282,436',
        },
        {
          deskNumber: 10,
          alt: 'Hotdesk 10',
          title: 'Hotdesk 10',
          coords: '102,440,284,579',
        },
        {
          deskNumber: 11,
          alt: 'Hotdesk 11',
          title: 'Hotdesk 11',
          coords: '285,13,465,153',
        },
        {
          deskNumber: 12,
          alt: 'Hotdesk 12',
          title: 'Hotdesk 12',
          coords: '285,155,465,295',
        },
        {
          deskNumber: 13,
          alt: 'Hotdesk 13',
          title: 'Hotdesk 13',
          coords: '286,297,465,437',
        },
        {
          deskNumber: 14,
          alt: 'Hotdesk 14',
          title: 'Hotdesk 14',
          coords: '286,439,466,578',
        },
        {
          deskNumber: 15,
          alt: 'Hotdesk 15',
          title: 'Hotdesk 15',
          coords: '552,14,735,155',
        },
        {
          deskNumber: 16,
          alt: 'Hotdesk 16',
          title: 'Hotdesk 16',
          coords: '552,157,734,296',
        },
        {
          deskNumber: 17,
          alt: 'Hotdesk 17',
          title: 'Hotdesk 17',
          coords: '552,298,734,439',
        },
        {
          deskNumber: 18,
          alt: 'Hotdesk 18',
          title: 'Hotdesk 18',
          coords: '552,440,734,580',
        },
        {
          deskNumber: 19,
          alt: 'Hotdesk 19',
          title: 'Hotdesk 19',
          coords: '736,14,917,155',
        },
        {
          deskNumber: 20,
          alt: 'Hotdesk 20',
          title: 'Hotdesk 20',
          coords: '736,156,917,296',
        },
        {
          deskNumber: 21,
          alt: 'Hotdesk 21',
          title: 'Hotdesk 21',
          coords: '736,299,916,439',
        },
        {
          deskNumber: 22,
          alt: 'Hotdesk 22',
          title: 'Hotdesk 22',
          coords: '735,440,917,582',
        },
        {
          deskNumber: 23,
          alt: 'Hotdesk 23',
          title: 'Hotdesk 23',
          coords: '603,789,806,1031',
        },
        {
          deskNumber: 24,
          alt: 'Hotdesk 24',
          title: 'Hotdesk 24',
          coords: '807,791,1008,1029',
        },
        {
          deskNumber: 25,
          alt: 'Hotdesk 25',
          title: 'Hotdesk 25',
          coords: '214,1028,420,788',
        },
        {
          deskNumber: 26,
          alt: 'Hotdesk 26',
          title: 'Hotdesk 26',
          coords: '14,787,213,1028',
        },
      ],
    },
    {
      id: 2,
      imagePath: '../../assets/images/map/Area 2 Numbered.png',
      desks: [
        {
          deskNumber: 27,
          alt: 'Hotdesk 27',
          title: 'Hotdesk 27',
          coords: '8,313,144,174',
        },
        {
          deskNumber: 28,
          alt: 'Hotdesk 28',
          title: 'Hotdesk 28',
          coords: '296,173,158,310',
        },
        {
          deskNumber: 29,
          alt: 'Hotdesk 29',
          title: 'Hotdesk 29',
          coords: '437,174,299,310',
        },
        {
          deskNumber: 30,
          alt: 'Hotdesk 30',
          title: 'Hotdesk 30',
          coords: '448,173,588,312',
        },
        {
          deskNumber: 31,
          alt: 'Hotdesk 31',
          title: 'Hotdesk 31',
          coords: '590,173,727,310',
        },
        {
          deskNumber: 32,
          alt: 'Hotdesk 32',
          title: 'Hotdesk 32',
          coords: '739,172,880,311',
        },
        {
          deskNumber: 33,
          alt: 'Hotdesk 33',
          title: 'Hotdesk 33',
          coords: '9,326,145,463',
        },
        {
          deskNumber: 34,
          alt: 'Hotdesk 34',
          title: 'Hotdesk 34',
          coords: '159,323,297,463',
        },
        {
          deskNumber: 35,
          alt: 'Hotdesk 35',
          title: 'Hotdesk 35',
          coords: '298,323,438,463',
        },
        {
          deskNumber: 36,
          alt: 'Hotdesk 36',
          title: 'Hotdesk 36',
          coords: '449,323,587,463',
        },
        {
          deskNumber: 37,
          alt: 'Hotdesk 37',
          title: 'Hotdesk 37',
          coords: '590,322,730,463',
        },
        {
          deskNumber: 38,
          alt: 'Hotdesk 38',
          title: 'Hotdesk 38',
          coords: '741,324,879,465',
        },
        {
          deskNumber: 39,
          alt: 'Hotdesk 39',
          title: 'Hotdesk 39',
          coords: '8,628,148,768',
        },
        {
          deskNumber: 40,
          alt: 'Hotdesk 40',
          title: 'Hotdesk 40',
          coords: '159,629,297,768',
        },
        {
          deskNumber: 41,
          alt: 'Hotdesk 41',
          title: 'Hotdesk 41',
          coords: '298,630,436,767',
        },
        {
          deskNumber: 42,
          alt: 'Hotdesk 42',
          title: 'Hotdesk 42',
          coords: '449,629,587,767',
        },
        {
          deskNumber: 43,
          alt: 'Hotdesk 43',
          title: 'Hotdesk 43',
          coords: '589,628,727,767',
        },
        {
          deskNumber: 44,
          alt: 'Hotdesk 44',
          title: 'Hotdesk 44',
          coords: '739,629,878,769',
        },
        {
          deskNumber: 45,
          alt: 'Hotdesk 45',
          title: 'Hotdesk 45',
          coords: '6,780,146,919',
        },
        {
          deskNumber: 46,
          alt: 'Hotdesk 46',
          title: 'Hotdesk 46',
          coords: '158,780,296,920',
        },
        {
          deskNumber: 47,
          alt: 'Hotdesk 47',
          title: 'Hotdesk 47',
          coords: '299,780,439,920',
        },
        {
          deskNumber: 48,
          alt: 'Hotdesk 48',
          title: 'Hotdesk 48',
          coords: '450,781,588,920',
        },
        {
          deskNumber: 49,
          alt: 'Hotdesk 49',
          title: 'Hotdesk 49',
          coords: '589,781,726,919',
        },
        {
          deskNumber: 50,
          alt: 'Hotdesk 50',
          title: 'Hotdesk 50',
          coords: '740,781,880,918',
        },
        {
          deskNumber: 51,
          alt: 'Hotdesk 51',
          title: 'Hotdesk 51',
          coords: '9,1087,298,1283',
        },
        {
          deskNumber: 52,
          alt: 'Hotdesk 52',
          title: 'Hotdesk 52',
          coords: '304,1091,592,1279',
        },
        {
          deskNumber: 53,
          alt: 'Hotdesk 53',
          title: 'Hotdesk 53',
          coords: '600,1089,887,1281',
        },
      ],
    },
    {
      id: 3,
      imagePath: '../../assets/images/map/Area 3 Numbered.png',
      desks: [
        {
          deskNumber: 54,
          alt: 'Hotdesk 54',
          title: 'Hotdesk 54',
          coords: '152,179,293,319',
        },
        {
          deskNumber: 55,
          alt: 'Hotdesk 55',
          title: 'Hotdesk 55',
          coords: '304,179,442,319',
        },
        {
          deskNumber: 56,
          alt: 'Hotdesk 56',
          title: 'Hotdesk 56',
          coords: '441,179,583,321',
        },
        {
          deskNumber: 57,
          alt: 'Hotdesk 57',
          title: 'Hotdesk 57',
          coords: '595,179,733,319',
        },
        {
          deskNumber: 58,
          alt: 'Hotdesk 58',
          title: 'Hotdesk 58',
          coords: '735,180,873,319',
        },
        {
          deskNumber: 59,
          alt: 'Hotdesk 59',
          title: 'Hotdesk 59',
          coords: '886,180,1022,321',
        },
        {
          deskNumber: 60,
          alt: 'Hotdesk 60',
          title: 'Hotdesk 60',
          coords: '153,333,293,472',
        },
        {
          deskNumber: 61,
          alt: 'Hotdesk 61',
          title: 'Hotdesk 61',
          coords: '305,331,443,472',
        },
        {
          deskNumber: 62,
          alt: 'Hotdesk 62',
          title: 'Hotdesk 62',
          coords: '443,333,584,472',
        },
        {
          deskNumber: 63,
          alt: 'Hotdesk 63',
          title: 'Hotdesk 63',
          coords: '597,331,732,472',
        },
        {
          deskNumber: 64,
          alt: 'Hotdesk 64',
          title: 'Hotdesk 64',
          coords: '736,331,872,471',
        },
        {
          deskNumber: 65,
          alt: 'Hotdesk 65',
          title: 'Hotdesk 65',
          coords: '886,330,1024,472',
        },
        {
          deskNumber: 66,
          alt: 'Hotdesk 66',
          title: 'Hotdesk 66',
          coords: '153,637,293,776',
        },
        {
          deskNumber: 67,
          alt: 'Hotdesk 67',
          title: 'Hotdesk 67',
          coords: '305,636,442,776',
        },
        {
          deskNumber: 68,
          alt: 'Hotdesk 68',
          title: 'Hotdesk 68',
          coords: '445,637,583,775',
        },
        {
          deskNumber: 69,
          alt: 'Hotdesk 69',
          title: 'Hotdesk 69',
          coords: '594,636,732,775',
        },
        {
          deskNumber: 70,
          alt: 'Hotdesk 70',
          title: 'Hotdesk 70',
          coords: '735,636,873,775',
        },
        {
          deskNumber: 71,
          alt: 'Hotdesk 71',
          title: 'Hotdesk 71',
          coords: '887,635,1021,776',
        },
        {
          deskNumber: 72,
          alt: 'Hotdesk 72',
          title: 'Hotdesk 72',
          coords: '153,788,293,927',
        },
        {
          deskNumber: 73,
          alt: 'Hotdesk 73',
          title: 'Hotdesk 73',
          coords: '305,787,443,927',
        },
        {
          deskNumber: 74,
          alt: 'Hotdesk 74',
          title: 'Hotdesk 74',
          coords: '445,787,583,928',
        },
        {
          deskNumber: 75,
          alt: 'Hotdesk 75',
          title: 'Hotdesk 75',
          coords: '596,787,734,929',
        },
        {
          deskNumber: 76,
          alt: 'Hotdesk 76',
          title: 'Hotdesk 76',
          coords: '735,788,874,929',
        },
        {
          deskNumber: 77,
          alt: 'Hotdesk 77',
          title: 'Hotdesk 77',
          coords: '885,791,1025,928',
        },
        {
          deskNumber: 78,
          alt: 'Hotdesk 78',
          title: 'Hotdesk 78',
          coords: '146,1099,435,1291',
        },
        {
          deskNumber: 79,
          alt: 'Hotdesk 79',
          title: 'Hotdesk 79',
          coords: '443,1099,730,1289',
        },
        {
          deskNumber: 80,
          alt: 'Hotdesk 80',
          title: 'Hotdesk 80',
          coords: '735,1099,1024,1291',
        },
      ],
    },
  ];
  desks: Hotdesk[] = [];
  desk!: Hotdesk;
  reservations: any[] = [];

  isLoading: boolean = false;

  minDate!: Date;
  maxDate!: Date;

  reservation: ReservationRequest | null | undefined;

  constructor(
    private reservationService: ReservationService,
    private router: Router,
    private webService: WebService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.reservation = this.reservationService.getReservation();
    this.area = this.reservation?.area;

    this.formGroup = this.fb.group({
      date: new FormControl(null, [Validators.required]),
      selectedDesk: new FormControl(null, [Validators.required]),
    });

    this.formGroup.valueChanges.subscribe({
      next: (res: any) => {
        console.log(res, 'res');
        let self = this;
        if (res.date) {
          const { date, startTime, endTime } = timeConvert(new Date(res.date));
          this.selectedDate = date;
          this.startTime = startTime;
          this.endTime = endTime;

          this.getReservations(() => {
            self.selectedDesk = res.selectedDesk;
            self.getDeskProperties(self.selectedDesk?.deskNumber);
          });
        }
      },
    });

    this.initialize();
  }

  handleSelectDesk(desk: Hotdesk) {
    this.formGroup
      .get('selectedDesk')
      ?.setValue({ deskNumber: desk.deskNumber, title: desk.title });
  }

  confirm() {
    const reservation: ReservationRequest = {
      area: this.area,
      date: this.selectedDate,
      startTime: this.startTime,
      endTime: this.endTime,
      deskNumber: this.selectedDesk?.deskNumber,
      mode: 0,
    };

    sessionStorage.setItem('hdbsv2-desk', JSON.stringify(this.desk))

    this.reservationService.setReservation(reservation);
    this.router.navigate(['/hdbsv2/book/confirmation']);
  }

  back() {
    sessionStorage.clear();
    this.router.navigate(['/hdbsv2/book']);
  }

  getMinMax() {
    let today = new Date();
    let minDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 2
    );
    let maxDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 16
    );

    return [minDate, maxDate];
  }

  getOptions() {
    for (const desk of this.desks) {
      const option = {
        deskNumber: desk.deskNumber,
        title: desk.title,
      };

      this.options.push(option);
    }
  }

  reset() {
    this.formGroup.reset();
    this.selectedDate = undefined;
    this.selectedDesk = undefined;
  }

  getImage() {
    return `../../assets/images/map/individual/${this.desk.deskNumber}.png`;
  }

  getReservations(callback?: () => void) {
    const params = {
      date: this.selectedDate,
    };
    this.isLoading = true;
    this.webService.getReservations(params).subscribe({
      next: (res: any) => {
        console.log('reservations', res)
        this.reservations = res.reservations;
        if (callback) {
          callback();
        }
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  getDeskProperties(deskNumber: any) {
    this.updateDeskStatus();
    for (const desk of this.desks) {
      if (deskNumber == desk.deskNumber) {
        this.desk = desk;
      }
    }
    this.isLoading = false;
  }

  updateDeskStatus() {
    for (const desk of this.desks) {
      if (this.reservations.length == 0) {
        desk.status =
          desk.status == 'UNAVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE';
      }

      const reservation = this.reservations.find(
        (r) => r.deskNumber === desk.deskNumber
      );
      console.log(reservation);

      if (reservation) {
        if (reservation.mode == 1) {
          desk.status = 'TEMPORARILY UNAVAILABLE';
          break;
        } else {
          switch (reservation.status) {
            case 'PENDING':
              desk.status = 'BOOKED';
              break;
            case 'APPROVED':
              desk.status = 'RESERVED';
              break;
            case 'STARTED':
              desk.status = 'OCCUPIED';
              break;
          }
        }
      }
    }
  }

  initialize() {
    setTimeout(() => {
      imageMapResize();
    }, 300);

    [this.minDate, this.maxDate] = this.getMinMax();

    const params = {
      area: this.area,
      sortField: 'deskNumber',
      sortOrder: 1,
    };
    this.webService.getDesks(params).subscribe({
      next: (res: any) => {
        this.desks = res.desks;
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        this.getOptions();
      },
    });
  }
}