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

interface Desk {
  deskNumber: number;
  alt: string;
  title: string;
  coords: string;
  indicators: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  status?: string;
  clickable?: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  hovered?: boolean;
}
interface AreaData {
  id: number;
  imagePath: string;
  desks: Desk[];
}

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

  areaDataList: AreaData[] = [
    {
      id: 1,
      imagePath: '../../assets/images/map/office-area/Area 1 Numbered.png',
      desks: [
        {
          deskNumber: 1,
          alt: 'Hotdesk 1',
          title: 'Hotdesk 1',
          coords: '135,1348,15,1168',
          indicators: { top: 86.5, left: 6.6, width: 0, height: 3.5 },
          clickable: {
            top: 86.25,
            left: 1.2,
            height: 13,
            width: 11.8,
          },
        },
        {
          deskNumber: 2,
          alt: 'Hotdesk 2',
          title: 'Hotdesk 2',
          coords: '140,1168,258,1348',
          indicators: { top: 86.5, left: 18.75, width: 0, height: 3.5 },
          clickable: {
            top: 86.25,
            left: 13.2,
            height: 13,
            width: 11.8,
          },
        },
        {
          deskNumber: 3,
          alt: 'Hotdesk 3',
          title: 'Hotdesk 3',
          coords: '260,1169,382,1348',
          indicators: { top: 86.5, left: 30.75, width: 0, height: 3.5 },
          clickable: {
            top: 86.25,
            left: 25.2,
            height: 13,
            width: 11.8,
          },
        },
        {
          deskNumber: 4,
          alt: 'Hotdesk 4',
          title: 'Hotdesk 4',
          coords: '642,1168,761,1346',
          indicators: { top: 86.5, left: 68, width: 0, height: 3.5 },
          clickable: {
            top: 86.25,
            left: 62.5,
            height: 13,
            width: 11.8,
          },
        },
        {
          deskNumber: 5,
          alt: 'Hotdesk 5',
          title: 'Hotdesk 5',
          coords: '763,1169,884,1346',
          indicators: { top: 86.5, left: 79.9, width: 0, height: 3.5 },
          clickable: {
            top: 86.25,
            left: 74.7,
            height: 13,
            width: 11.8,
          },
        },
        {
          deskNumber: 6,
          alt: 'Hotdesk 6',
          title: 'Hotdesk 6',
          coords: '887,1171,1007,1347',
          indicators: { top: 86.5, left: 92.05, width: 0, height: 3.5 },
          clickable: {
            top: 86.25,
            left: 86.9,
            height: 13,
            width: 11.8,
          },
        },
        {
          deskNumber: 7,
          alt: 'Hotdesk 7',
          title: 'Hotdesk 7',
          coords: '102,12,282,153',
          indicators: { top: 1.75, left: 10.25, width: 0, height: 3.5 },
          clickable: {
            top: 1.125,
            left: 9.8,
            height: 10.5,
            width: 17.5,
          },
        },
        {
          deskNumber: 8,
          alt: 'Hotdesk 8',
          title: 'Hotdesk 8',
          coords: '102,156,282,294',
          indicators: { top: 11.75, left: 10.25, width: 0, height: 3.5 },
          clickable: {
            top: 11.5,
            left: 9.8,
            height: 10.5,
            width: 17.5,
          },
        },
        {
          deskNumber: 9,
          alt: 'Hotdesk 9',
          title: 'Hotdesk 9',
          coords: '102,298,282,436',
          indicators: { top: 22.5, left: 10.25, width: 0, height: 3.5 },
          clickable: {
            top: 22,
            left: 9.8,
            height: 10.5,
            width: 17.5,
          },
        },
        {
          deskNumber: 10,
          alt: 'Hotdesk 10',
          title: 'Hotdesk 10',
          coords: '102,440,284,579',
          indicators: { top: 33, left: 10.25, width: 0, height: 3.5 },
          clickable: {
            top: 32.5,
            left: 9.8,
            height: 10.5,
            width: 17.5,
          },
        },
        {
          deskNumber: 11,
          alt: 'Hotdesk 11',
          title: 'Hotdesk 11',
          coords: '285,13,465,153',
          indicators: { top: 1.75, left: 40.25, width: 0, height: 3.5 },
          clickable: {
            top: 1.125,
            left: 27.8,
            height: 10.5,
            width: 17.5,
          },
        },
        {
          deskNumber: 12,
          alt: 'Hotdesk 12',
          title: 'Hotdesk 12',
          coords: '285,155,465,295',
          indicators: { top: 11.75, left: 40.25, width: 0, height: 3.5 },
          clickable: {
            top: 11.5,
            left: 27.8,
            height: 10.5,
            width: 17.5,
          },
        },
        {
          deskNumber: 13,
          alt: 'Hotdesk 13',
          title: 'Hotdesk 13',
          coords: '286,297,465,437',
          indicators: { top: 22.5, left: 40.25, width: 0, height: 3.5 },
          clickable: {
            top: 22,
            left: 27.8,
            height: 10.5,
            width: 17.5,
          },
        },
        {
          deskNumber: 14,
          alt: 'Hotdesk 14',
          title: 'Hotdesk 14',
          coords: '286,439,466,578',
          indicators: { top: 33, left: 40.25, width: 0, height: 3.5 },
          clickable: {
            top: 32.5,
            left: 27.8,
            height: 10.5,
            width: 17.5,
          },
        },
        {
          deskNumber: 15,
          alt: 'Hotdesk 15',
          title: 'Hotdesk 15',
          coords: '552,14,735,155',
          indicators: { top: 1.75, left: 54.25, width: 0, height: 3.5 },
          clickable: {
            top: 1.125,
            left: 53.8,
            height: 10.5,
            width: 17.75,
          },
        },
        {
          deskNumber: 16,
          alt: 'Hotdesk 16',
          title: 'Hotdesk 16',
          coords: '552,157,734,296',
          indicators: { top: 11.75, left: 54.25, width: 0, height: 3.5 },
          clickable: {
            top: 11.5,
            left: 53.8,
            height: 10.5,
            width: 17.75,
          },
        },
        {
          deskNumber: 17,
          alt: 'Hotdesk 17',
          title: 'Hotdesk 17',
          coords: '552,298,734,439',
          indicators: { top: 22.5, left: 54.25, width: 0, height: 3.5 },
          clickable: {
            top: 22,
            left: 53.8,
            height: 10.5,
            width: 17.75,
          },
        },
        {
          deskNumber: 18,
          alt: 'Hotdesk 18',
          title: 'Hotdesk 18',
          coords: '552,440,734,580',
          indicators: { top: 33, left: 54.25, width: 0, height: 3.5 },
          clickable: {
            top: 32.5,
            left: 53.8,
            height: 10.5,
            width: 17.75,
          },
        },
        {
          deskNumber: 19,
          alt: 'Hotdesk 19',
          title: 'Hotdesk 19',
          coords: '736,14,917,155',
          indicators: { top: 1.75, left: 84.25, width: 0, height: 3.5 },
          clickable: {
            top: 1.125,
            left: 71.8,
            height: 10.5,
            width: 17.75,
          },
        },
        {
          deskNumber: 20,
          alt: 'Hotdesk 20',
          title: 'Hotdesk 20',
          coords: '736,156,917,296',
          indicators: { top: 11.75, left: 84.25, width: 0, height: 3.5 },
          clickable: {
            top: 11.5,
            left: 71.8,
            height: 10.5,
            width: 17.75,
          },
        },
        {
          deskNumber: 21,
          alt: 'Hotdesk 21',
          title: 'Hotdesk 21',
          coords: '736,299,916,439',
          indicators: { top: 22.5, left: 84.25, width: 0, height: 3.5 },
          clickable: {
            top: 22,
            left: 71.8,
            height: 10.5,
            width: 17.75,
          },
        },
        {
          deskNumber: 22,
          alt: 'Hotdesk 22',
          title: 'Hotdesk 22',
          coords: '735,440,917,582',
          indicators: { top: 33, left: 84.25, width: 0, height: 3.5 },
          clickable: {
            top: 32.5,
            left: 71.8,
            height: 10.5,
            width: 17.75,
          },
        },
        {
          deskNumber: 23,
          alt: 'Hotdesk 23',
          title: 'Hotdesk 23',
          coords: '603,789,806,1031',
          indicators: { top: 72.5, left: 65.6, width: 0, height: 3.5 },
          clickable: {
            top: 58.5,
            left: 59.25,
            height: 17.5,
            width: 19.5,
          },
        },
        {
          deskNumber: 24,
          alt: 'Hotdesk 24',
          title: 'Hotdesk 24',
          coords: '807,791,1008,1029',
          indicators: { top: 72.5, left: 87.6, width: 0, height: 3.5 },
          clickable: {
            top: 58.5,
            left: 78.8,
            height: 17.5,
            width: 19.5,
          },
        },
        {
          deskNumber: 25,
          alt: 'Hotdesk 25',
          title: 'Hotdesk 25',
          coords: '214,1028,420,788',
          indicators: { top: 72.5, left: 29.6, width: 0, height: 3.5 },
          clickable: {
            top: 58.5,
            left: 20.8,
            height: 17.5,
            width: 19.5,
          },
        },
        {
          deskNumber: 26,
          alt: 'Hotdesk 26',
          title: 'Hotdesk 26',
          coords: '14,787,213,1028',
          indicators: { top: 72.5, left: 7.6, width: 0, height: 3.5 },
          clickable: {
            top: 58.5,
            left: 1.25,
            height: 17.5,
            width: 19.5,
          },
        },
      ],
    },
    {
      id: 2,
      imagePath: '../../assets/images/map/office-area/Area 2 Numbered.png',
      desks: [
        {
          deskNumber: 27,
          alt: 'Hotdesk 27',
          title: 'Hotdesk 27',
          coords: '8,313,144,174',
          indicators: { top: 14.5, left: 1.75, width: 0, height: 3.5 },
          clickable: {
            top: 14.125,
            left: 1.25,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 28,
          alt: 'Hotdesk 28',
          title: 'Hotdesk 28',
          coords: '296,173,158,310',
          indicators: { top: 14.5, left: 23.8, width: 0, height: 3.5 },
          clickable: {
            top: 14.125,
            left: 15.25,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 29,
          alt: 'Hotdesk 29',
          title: 'Hotdesk 29',
          coords: '437,174,299,310',
          indicators: { top: 14.5, left: 29.25, width: 0, height: 3.5 },
          clickable: {
            top: 14.125,
            left: 28.75,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 30,
          alt: 'Hotdesk 30',
          title: 'Hotdesk 30',
          coords: '448,173,588,312',
          indicators: { top: 14.5, left: 51.35, width: 0, height: 3.5 },
          clickable: {
            top: 14.125,
            left: 42.75,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 31,
          alt: 'Hotdesk 31',
          title: 'Hotdesk 31',
          coords: '590,173,727,310',
          indicators: { top: 14.5, left: 56.9, width: 0, height: 3.5 },
          clickable: {
            top: 14.125,
            left: 56.3,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 32,
          alt: 'Hotdesk 32',
          title: 'Hotdesk 32',
          coords: '739,172,880,311',
          indicators: { top: 14.5, left: 79, width: 0, height: 3.5 },
          clickable: {
            top: 14.125,
            left: 70.3,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 33,
          alt: 'Hotdesk 33',
          title: 'Hotdesk 33',
          coords: '9,326,145,463',
          indicators: { top: 32.2, left: 1.75, width: 0, height: 3.5 },
          clickable: {
            top: 25.85,
            left: 1.25,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 34,
          alt: 'Hotdesk 34',
          title: 'Hotdesk 34',
          coords: '159,323,297,463',
          indicators: { top: 32.2, left: 23.8, width: 0, height: 3.5 },
          clickable: {
            top: 25.85,
            left: 15.25,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 35,
          alt: 'Hotdesk 35',
          title: 'Hotdesk 35',
          coords: '298,323,438,463',
          indicators: { top: 32.2, left: 29.25, width: 0, height: 3.5 },
          clickable: {
            top: 25.85,
            left: 28.75,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 36,
          alt: 'Hotdesk 36',
          title: 'Hotdesk 36',
          coords: '449,323,587,463',
          indicators: { top: 32.2, left: 51.35, width: 0, height: 3.5 },
          clickable: {
            top: 25.85,
            left: 42.75,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 37,
          alt: 'Hotdesk 37',
          title: 'Hotdesk 37',
          coords: '590,322,730,463',
          indicators: { top: 32.2, left: 56.9, width: 0, height: 3.5 },
          clickable: {
            top: 25.85,
            left: 56.3,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 38,
          alt: 'Hotdesk 38',
          title: 'Hotdesk 38',
          coords: '741,324,879,465',
          indicators: { top: 32.2, left: 79, width: 0, height: 3.5 },
          clickable: {
            top: 25.85,
            left: 70.3,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 39,
          alt: 'Hotdesk 39',
          title: 'Hotdesk 39',
          coords: '8,628,148,768',
          indicators: { top: 49.25, left: 1.75, width: 0, height: 3.5 },
          clickable: {
            top: 48.9,
            left: 1.25,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 40,
          alt: 'Hotdesk 40',
          title: 'Hotdesk 40',
          coords: '159,629,297,768',
          indicators: { top: 49.25, left: 23.8, width: 0, height: 3.5 },
          clickable: {
            top: 48.9,
            left: 15.25,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 41,
          alt: 'Hotdesk 41',
          title: 'Hotdesk 41',
          coords: '298,630,436,767',
          indicators: { top: 49.25, left: 29.25, width: 0, height: 3.5 },
          clickable: {
            top: 48.9,
            left: 28.8,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 42,
          alt: 'Hotdesk 42',
          title: 'Hotdesk 42',
          coords: '449,629,587,767',
          indicators: { top: 49.25, left: 51.35, width: 0, height: 3.5 },
          clickable: {
            top: 48.9,
            left: 42.8,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 43,
          alt: 'Hotdesk 43',
          title: 'Hotdesk 43',
          coords: '589,628,727,767',
          indicators: { top: 49.25, left: 56.9, width: 0, height: 3.5 },
          clickable: {
            top: 48.9,
            left: 56.3,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 44,
          alt: 'Hotdesk 44',
          title: 'Hotdesk 44',
          coords: '739,629,878,769',
          indicators: { top: 49.25, left: 79, width: 0, height: 3.5 },
          clickable: {
            top: 48.9,
            left: 70.3,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 45,
          alt: 'Hotdesk 45',
          title: 'Hotdesk 45',
          coords: '6,780,146,919',
          indicators: { top: 67, left: 1.75, width: 0, height: 3.5 },
          clickable: {
            top: 60.6,
            left: 1.25,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 46,
          alt: 'Hotdesk 46',
          title: 'Hotdesk 46',
          coords: '158,780,296,920',
          indicators: { top: 67, left: 23.8, width: 0, height: 3.5 },
          clickable: {
            top: 60.6,
            left: 15.25,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 47,
          alt: 'Hotdesk 47',
          title: 'Hotdesk 47',
          coords: '299,780,439,920',
          indicators: { top: 67, left: 29.25, width: 0, height: 3.5 },
          clickable: {
            top: 60.6,
            left: 28.8,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 48,
          alt: 'Hotdesk 48',
          title: 'Hotdesk 48',
          coords: '450,781,588,920',
          indicators: { top: 67, left: 51.35, width: 0, height: 3.5 },
          clickable: {
            top: 60.6,
            left: 42.8,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 49,
          alt: 'Hotdesk 49',
          title: 'Hotdesk 49',
          coords: '589,781,726,919',
          indicators: { top: 67, left: 56.9, width: 0, height: 3.5 },
          clickable: {
            top: 60.6,
            left: 56.3,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 50,
          alt: 'Hotdesk 50',
          title: 'Hotdesk 50',
          coords: '740,781,880,918',
          indicators: { top: 67, left: 79, width: 0, height: 3.5 },
          clickable: {
            top: 60.6,
            left: 70.3,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 51,
          alt: 'Hotdesk 51',
          title: 'Hotdesk 51',
          coords: '9,1087,298,1283',
          indicators: { top: 85.7, left: 7.35, width: 0, height: 3.5 },
          clickable: {
            top: 84.25,
            left: 1.25,
            height: 14.35,
            width: 27.5,
          },
        },
        {
          deskNumber: 52,
          alt: 'Hotdesk 52',
          title: 'Hotdesk 52',
          coords: '304,1091,592,1279',
          indicators: { top: 85.7, left: 35.5, width: 0, height: 3.5 },
          clickable: {
            top: 84.25,
            left: 29.35,
            height: 14.35,
            width: 27.5,
          },
        },
        {
          deskNumber: 53,
          alt: 'Hotdesk 53',
          title: 'Hotdesk 53',
          coords: '600,1089,887,1281',
          indicators: { top: 85.7, left: 63.35, width: 0, height: 3.5 },
          clickable: {
            top: 84.25,
            left: 57.35,
            height: 14.35,
            width: 27.5,
          },
        },
      ],
    },
    {
      id: 3,
      imagePath: '../../assets/images/map/office-area/Area 3 Numbered.png',
      desks: [
        {
          deskNumber: 54,
          alt: 'Hotdesk 54',
          title: 'Hotdesk 54',
          coords: '152,179,293,319',
          indicators: { top: 14.6, left: 16.25, width: 0, height: 3.5 },
          clickable: {
            top: 14.5,
            left: 15.25,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 55,
          alt: 'Hotdesk 55',
          title: 'Hotdesk 55',
          coords: '304,179,442,319',
          indicators: { top: 14.6, left: 38.5, width: 0, height: 3.5 },
          clickable: {
            top: 14.5,
            left: 29.75,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 56,
          alt: 'Hotdesk 56',
          title: 'Hotdesk 56',
          coords: '441,179,583,321',
          indicators: { top: 14.6, left: 43.9, width: 0, height: 3.5 },
          clickable: {
            top: 14.5,
            left: 43.25,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 57,
          alt: 'Hotdesk 57',
          title: 'Hotdesk 57',
          coords: '595,179,733,319',
          indicators: { top: 14.6, left: 66, width: 0, height: 3.5 },
          clickable: {
            top: 14.5,
            left: 57.25,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 58,
          alt: 'Hotdesk 58',
          title: 'Hotdesk 58',
          coords: '735,180,873,319',
          indicators: { top: 14.6, left: 71.5, width: 0, height: 3.5 },
          clickable: {
            top: 14.5,
            left: 71,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 59,
          alt: 'Hotdesk 59',
          title: 'Hotdesk 59',
          coords: '886,180,1022,321',
          indicators: { top: 14.6, left: 93.6, width: 0, height: 3.5 },
          clickable: {
            top: 14.5,
            left: 85,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 60,
          alt: 'Hotdesk 60',
          title: 'Hotdesk 60',
          coords: '153,333,293,472',
          indicators: { top: 32.35, left: 16.25, width: 0, height: 3.5 },
          clickable: {
            top: 25.95,
            left: 15.25,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 61,
          alt: 'Hotdesk 61',
          title: 'Hotdesk 61',
          coords: '305,331,443,472',
          indicators: { top: 32.35, left: 38.5, width: 0, height: 3.5 },
          clickable: {
            top: 25.95,
            left: 29.75,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 62,
          alt: 'Hotdesk 62',
          title: 'Hotdesk 62',
          coords: '443,333,584,472',
          indicators: { top: 32.35, left: 43.9, width: 0, height: 3.5 },
          clickable: {
            top: 25.95,
            left: 43.25,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 63,
          alt: 'Hotdesk 63',
          title: 'Hotdesk 63',
          coords: '597,331,732,472',
          indicators: { top: 32.35, left: 66, width: 0, height: 3.5 },
          clickable: {
            top: 25.95,
            left: 57.25,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 64,
          alt: 'Hotdesk 64',
          title: 'Hotdesk 64',
          coords: '736,331,872,471',
          indicators: { top: 32.35, left: 71.5, width: 0, height: 3.5 },
          clickable: {
            top: 25.95,
            left: 71,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 65,
          alt: 'Hotdesk 65',
          title: 'Hotdesk 65',
          coords: '886,330,1024,472',
          indicators: { top: 32.35, left: 93.6, width: 0, height: 3.5 },
          clickable: {
            top: 25.95,
            left: 85,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 66,
          alt: 'Hotdesk 66',
          title: 'Hotdesk 66',
          coords: '153,637,293,776',
          indicators: { top: 49.45, left: 16.25, width: 0, height: 3.5 },
          clickable: {
            top: 49.25,
            left: 15.4,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 67,
          alt: 'Hotdesk 67',
          title: 'Hotdesk 67',
          coords: '305,636,442,776',
          indicators: { top: 49.45, left: 38.5, width: 0, height: 3.5 },
          clickable: {
            top: 49.25,
            left: 29.75,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 68,
          alt: 'Hotdesk 68',
          title: 'Hotdesk 68',
          coords: '445,637,583,775',
          indicators: { top: 49.45, left: 43.9, width: 0, height: 3.5 },
          clickable: {
            top: 49.25,
            left: 43.5,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 69,
          alt: 'Hotdesk 69',
          title: 'Hotdesk 69',
          coords: '594,636,732,775',
          indicators: { top: 49.45, left: 66, width: 0, height: 3.5 },
          clickable: {
            top: 49.25,
            left: 57.3,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 70,
          alt: 'Hotdesk 70',
          title: 'Hotdesk 70',
          coords: '735,636,873,775',
          indicators: { top: 49.45, left: 71.5, width: 0, height: 3.5 },
          clickable: {
            top: 49.25,
            left: 70.75,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 71,
          alt: 'Hotdesk 71',
          title: 'Hotdesk 71',
          coords: '887,635,1021,776',
          indicators: { top: 49.45, left: 93.6, width: 0, height: 3.5 },
          clickable: {
            top: 49.25,
            left: 85,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 72,
          alt: 'Hotdesk 72',
          title: 'Hotdesk 72',
          coords: '153,788,293,927',
          indicators: { top: 67.2, left: 16.25, width: 0, height: 3.5 },
          clickable: {
            top: 60.8,
            left: 15.4,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 73,
          alt: 'Hotdesk 73',
          title: 'Hotdesk 73',
          coords: '305,787,443,927',
          indicators: { top: 67.2, left: 38.5, width: 0, height: 3.5 },
          clickable: {
            top: 60.8,
            left: 29.75,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 74,
          alt: 'Hotdesk 74',
          title: 'Hotdesk 74',
          coords: '445,787,583,928',
          indicators: { top: 67.2, left: 43.9, width: 0, height: 3.5 },
          clickable: {
            top: 60.8,
            left: 43.5,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 75,
          alt: 'Hotdesk 75',
          title: 'Hotdesk 75',
          coords: '596,787,734,929',
          indicators: { top: 67.2, left: 66, width: 0, height: 3.5 },
          clickable: {
            top: 60.8,
            left: 57.3,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 76,
          alt: 'Hotdesk 76',
          title: 'Hotdesk 76',
          coords: '735,788,874,929',
          indicators: { top: 67.2, left: 71.5, width: 0, height: 3.5 },
          clickable: {
            top: 60.8,
            left: 70.75,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 77,
          alt: 'Hotdesk 77',
          title: 'Hotdesk 77',
          coords: '885,791,1025,928',
          indicators: { top: 67.2, left: 93.6, width: 0, height: 3.5 },
          clickable: {
            top: 60.8,
            left: 85,
            height: 10.5,
            width: 13.5,
          },
        },
        {
          deskNumber: 78,
          alt: 'Hotdesk 78',
          title: 'Hotdesk 78',
          coords: '146,1099,435,1291',
          indicators: { top: 85.9, left: 21.1, width: 0, height: 3.5 },
          clickable: {
            top: 84.65,
            left: 15.25,
            height: 14.35,
            width: 27.5,
          },
        },
        {
          deskNumber: 79,
          alt: 'Hotdesk 79',
          title: 'Hotdesk 79',
          coords: '443,1099,730,1289',
          indicators: { top: 85.9, left: 49.1, width: 0, height: 3.5 },
          clickable: {
            top: 84.65,
            left: 43.25,
            height: 14.35,
            width: 27.5,
          },
        },
        {
          deskNumber: 80,
          alt: 'Hotdesk 80',
          title: 'Hotdesk 80',
          coords: '735,1099,1024,1291',
          indicators: { top: 85.9, left: 77.1, width: 0, height: 3.5 },
          clickable: {
            top: 84.65,
            left: 71.25,
            height: 14.35,
            width: 27.5,
          },
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

  params!: any;

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
    this.params = {
      area: this.area,
      sortField: 'deskNumber',
      sortOrder: 1,
    };

    this.initialize();

    this.formGroup.valueChanges.subscribe({
      next: (res: any) => {
        let self = this;
        if (res.date) {
          const { date, startTime, endTime } = timeConvert(new Date(res.date));
          this.selectedDate = date;
          this.startTime = startTime;
          this.endTime = endTime;

          this.getReservations(() => {
            this.getDesks(this.params);
            this.updateDeskStatus();
            self.selectedDesk = res.selectedDesk;
            if (self.selectedDesk) {
              this.isLoading = true;
              self.getDeskProperties(self.selectedDesk?.deskNumber);
            }
          });
        }
      },
    });
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

    sessionStorage.setItem('hdbsv2-desk', JSON.stringify(this.desk));

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
    this.options = this.desks.map((desk) => ({
      deskNumber: desk.deskNumber,
      title: desk.title,
    }));
  }

  reset() {
    this.formGroup.reset();
    this.selectedDate = undefined;
    this.selectedDesk = undefined;
  }

  getImage() {
    return `../../assets/images/map/desk-area/${this.desk.deskNumber}.png`;
  }

  getReservations(callback?: () => void) {
    const params = {
      date: this.selectedDate,
    };
    this.isLoading = true;
    this.webService.getReservations(params).subscribe({
      next: (res: any) => {
        this.reservations = res.reservations;
        if (callback) {
          callback();
        }
      },
      error: (err: any) => {},
    });
  }

  getDeskProperties(deskNumber: any) {
    for (const desk of this.desks) {
      if (deskNumber == desk.deskNumber) {
        this.desk = desk;
      }
    }
    this.isLoading = false;
  }

  updateDeskStatus() {
    for (const desk of this.desks) {
      if (desk.status === 'UNAVAILABLE') {
        desk.status = 'PERMANENTLY UNAVAILABLE';
        continue;
      }

      if (this.reservations.length == 0) {
        desk.status =
          desk.status === 'PERMANENTLY UNAVAILABLE'
            ? 'PERMANENTLY UNAVAILABLE'
            : 'AVAILABLE';
      }

      desk.status = desk.status === 'AVAILABLE' ? 'AVAILABLE' : desk.status;

      const reservation = this.reservations.find(
        (r) => r.deskNumber === desk.deskNumber
      );

      if (reservation) {
        if (reservation.mode == 1) {
          desk.status = 'TEMPORARILY UNAVAILABLE';
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

    const area = this.areaDataList.find(
      (areaData) =>
        areaData.id == this.reservationService.getReservation()?.area
    );
    if (area) {
      const updatedDesks = area.desks.map((desk) => {
        const deskStatus = this.desks.find(
          (d) => d.deskNumber === desk.deskNumber
        );
        if (deskStatus) {
          return { ...desk, status: deskStatus.status };
        }
        return desk;
      });
      area.desks = updatedDesks;
    }
  }

  getIndicatorColor(desk: any): string {
    if (desk.status == 'AVAILABLE') {
      return 'bg-available';
    } else if (desk.status == 'PERMANENTLY UNAVAILABLE') {
      return 'bg-permanently-unavailable';
    } else if (
      ['TEMPORARILY UNAVAILABLE', 'BOOKED', 'RESERVED', 'OCCUPIED'].includes(
        desk.status
      )
    ) {
      return 'bg-temporarily-unavailable';
    }
    return '';
  }

  initialize() {
    [this.minDate, this.maxDate] = this.getMinMax();

    this.getDesks(this.params);
  }

  getSeverity(status: string) {
    switch (status) {
      case 'AVAILABLE':
        return 'success';
      case 'PERMANENTLY UNAVAILABLE':
        return 'danger';
      case 'TEMPORARILY UNAVAILABLE':
      case 'BOOKED':
      case 'RESERVED':
      case 'OCCUPIED':
        return 'warning';
      default:
        return '';
    }
  }

  getDesks(params: any) {
    this.webService.getDesks(params).subscribe({
      next: (res: any) => {
        this.desks = res.desks;
      },
      error: (err: any) => {},
      complete: () => {
        this.getOptions();
      },
    });
  }

  deskExist(deskNumber: number): boolean {
    return this.desks.some((desk) => desk.deskNumber === deskNumber);
  }
}
