import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { FormControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ReservationService } from '../../services/reservation.service';
import { timeConvert } from '../../utils/reservation-time-converter.util';
import { Hotdesk } from '../../models/Hotdesk';
import { Avatar } from 'primeng/avatar';
import { WebService } from '../../services/web.service';
import { ParamsBuilderService } from '../../services/params-builder.service';
import { forkJoin } from 'rxjs';

type ReservationHistoryType =
  | 'REJECTED'
  | 'CANCELED'
  | 'COMPLETED'
  | 'EXPIRED'
  | 'ABORTED';

interface ReservationHistory {
  id: string;
  _id: string;
  reservation: string;
  user: string;
  deskNumber: number;
  date: string;
  startTime: string;
  endTime: string;
  type: ReservationHistoryType;
  mode: number;
  __v: number;
}
interface ActiveUser {
  id: string;
  username: string;
  avatar: string;
  email: string;
  role: string;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  options: any;
  pieData: any;
  pieOptions: any;
  lineData: any;

  documentStyle!: any;
  textColor!: any;
  textColorSecondary!: any;
  surfaceBorder!: any;

  cardContent!: any[];

  date = new FormControl();

  recentActivities: any[] = [];
  recentReservations: any[] = [];

  activeUsers: ActiveUser[] = [
    {
      id: '65b480cd73497b0eecac836b',
      username: 'Kertsu',
      email: 'kurtddanielbigtas@student.laverdad.edu.ph',
      role: 'superadmin',
      avatar:
        'http://res.cloudinary.com/drlztlr1m/image/upload/v1706356600/hzomg9luobx6v8lvxdng.jpg',
    },
    {
      id: '65be6e9e31c19ca1cf414b9f',
      username: 'johnmarkfaeldonia',
      email: 'johnmarkfaeldonia@student.laverdad.edu.ph',
      role: 'user',
      avatar:
        'http://res.cloudinary.com/drlztlr1m/image/upload/v1706979188/oxbsppubd3rsabqwfxsr.jpg',
    },
    {
      id: '65be7149289699e84d2b9a56',
      username: 'jirehbelen',
      email: 'jirehbelen@student.laverdad.edu.ph',
      role: 'user',
      avatar:
        'http://res.cloudinary.com/drlztlr1m/image/upload/v1706979188/oxbsppubd3rsabqwfxsr.jpg',
    },
  ];

  selfReservations: any[] = [];


  deskStatisSticsIsLoading: boolean = false;
  reservationStatisticsIsLoading: boolean = false;
  // activeUsers: ActiveUser[] = []

  constructor(
    protected userService: UserService,
    private reservationService: ReservationService,
    private webService: WebService,
    private paramsBuilder: ParamsBuilderService
  ) {}

  ngOnInit() {
    this.deskStatisSticsIsLoading = true
    this.reservationStatisticsIsLoading = true

    const now = new Date();
    const { date } = timeConvert(now);

    const dateReset = date.split('T')[0] + 'T00:00:00.000Z';

    this.reservationService.getDesksAndReservations(
      { sortOrder: 1, sortField: 'deskNumber' },
      { date: dateReset },
      () => {
        const reservations = this.reservationService.reservations;
        const desks = this.reservationService.desks;
        const { updatedDesks } = this.reservationService.updateDesksStatus(
          reservations,
          desks
        );

        this.getDesksStatistics(updatedDesks);
      }
    );

    this.initialize();
    this.getReservationStatistics();

    if (
      this.userService.getUser()?.role === 'admin' ||
      this.userService.getUser()?.role === 'superadmin'
    ) {
      const params = {
        sortOrder: -1,
        sortField: 'createdAt',
        rows: 3,
        first: 0,
      };
      this.getMostRecentActivities(params);
    }

    if (this.userService.getUser()?.role === 'om') {
      const params = {
        sortOrder: -1,
        sortField: 'createdAt',
        rows: 3,
        first: 0,
      };
      this.getMostRecentReservations(params);
    }
  }

  getNextTwoWeeks() {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDate = new Date();
    const nextTwoWeeks = [];

    for (let i = 0; i < 14; i++) {
      const nextDate = new Date(
        currentDate.getTime() + i * 24 * 60 * 60 * 1000
      );
      const dayOfWeek = daysOfWeek[nextDate.getDay()];
      const dayOfMonth = nextDate.getDate();
      nextTwoWeeks.push(`${dayOfWeek}, ${dayOfMonth}`);
    }

    return nextTwoWeeks;
  }

  getPastTwoWeeks() {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDate = new Date();
    const pastTwoWeeks = [];
    const dates = [];

    for (let i = 0; i < 14; i++) {
      const pastDate = new Date(
        currentDate.getTime() - i * 24 * 60 * 60 * 1000
      );
      const { date } = timeConvert(pastDate);
      const resetDate = date.split('T')[0] + 'T00:00:00.000Z';
      const dayOfWeek = daysOfWeek[pastDate.getDay()];
      const dayOfMonth = pastDate.getDate();
      dates.push(resetDate);
      pastTwoWeeks.unshift(`${dayOfWeek}, ${dayOfMonth}`);
    }

    return { pastTwoWeeks, dates };
  }

  getSeverity(status: string, mode: string) {
    if (mode === 'reservations') {
      switch (status) {
        case 'PENDING':
          return 'danger';
        case 'APPROVED':
          return 'info';
        case 'STARTED':
          return 'success';
        default:
          return;
      }
    }
    switch (status) {
      case 'failed':
        return 'danger';
      case 'success':
        return 'success';
      default:
        return;
    }
  }

  getDateNow() {
    const currentDate = new Date();
    return currentDate.toLocaleDateString();
  }

  initialize() {
    this.documentStyle = getComputedStyle(document.documentElement);
    this.textColor = this.documentStyle.getPropertyValue('--text-color');
    this.textColorSecondary = this.documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    this.surfaceBorder =
      this.documentStyle.getPropertyValue('--surface-border');

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: this.textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: this.textColorSecondary,
          },
          grid: {
            color: this.surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: this.textColorSecondary,
          },
          grid: {
            color: this.surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };

    this.pieOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: this.textColor,
          },
        },
      },
    };
  }

  getDesksStatistics(desks: Hotdesk[]) {
    const availableDesksCount = desks.filter(
      (desk) => desk.status === 'AVAILABLE'
    ).length;
    const unavailableDesksCount = desks.filter((desk) => {
      switch (desk.status) {
        case 'PERMANENTLY UNAVAILABLE':
        case 'BOOKED':
        case 'RESERVED':
        case 'OCCUPIED':
          return true;
        default:
          return false;
      }
    }).length;
    const underMaintenanceDesksCount = desks.filter(
      (desk) => desk.status === 'TEMPORARILY UNAVAILABLE'
    ).length;

    this.cardContent = [
      {
        title: 'Total Desks',
        count: desks.length,
        icon: 'user',
      },
      {
        title: 'Available Desks',
        count: availableDesksCount,
        icon: 'tablet',
      },
      {
        title: 'Unavailable Desks',
        count: unavailableDesksCount,
        icon: 'desktop',
      },
      {
        title: 'Under Maintenance',
        count: underMaintenanceDesksCount,
        icon: 'book',
      },
    ];

    this.pieData = {
      labels: ['Available Desks', 'Unavailable Desks', 'Under Maintenance'],
      datasets: [
        {
          data: [
            availableDesksCount,
            unavailableDesksCount,
            underMaintenanceDesksCount,
          ],
          backgroundColor: [
            this.documentStyle.getPropertyValue('--primary-400'),
            this.documentStyle.getPropertyValue('--primary-700'),
            this.documentStyle.getPropertyValue('--primary-900'),
          ],
          hoverBackgroundColor: [
            this.documentStyle.getPropertyValue('--primary-200'),
            this.documentStyle.getPropertyValue('--primary-600'),
            this.documentStyle.getPropertyValue('--primary-800'),
          ],
        },
      ],
    };
    this.deskStatisSticsIsLoading = false;
  }

  getReservationStatistics() {
    const dates = this.getPastTwoWeeks().dates;
    const startDate = dates[0];
    const endDate = dates[dates.length - 1];

    const masterParams = this.paramsBuilder.buildParams({
      startDate,
      endDate,
      mode: 0,
    });

    const selfParams = this.paramsBuilder.buildParams({
      sortOrder: -1,
      sortField: 'createdAt',
      mode: 0,
      first: 0,
      rows: 15,
    });
    if (this.userService.getUser()?.role == 'user') {
      this.webService.getSelfReservations(selfParams).subscribe({
        next: (res: any) => {
          this.selfReservations = res.reservations;
        },
        error: (err) => {
        },
        complete: () => {
          this.reservationStatisticsIsLoading = false;
        }
      });
    } else {
      forkJoin([
        this.webService.getSelfReservations(selfParams),
        this.webService.getHistory(masterParams),
      ]).subscribe({
        next: ([selfReservationRes, masterHistoryRes]: [any, any]) => {
          const selfReservations: any = selfReservationRes.reservations;
          const masterHistory: ReservationHistory[] =
            masterHistoryRes.reservations;

          this.selfReservations = selfReservations;

          const typeCounts: Record<ReservationHistoryType, number[]> = {
            REJECTED: Array(14).fill(0),
            CANCELED: Array(14).fill(0),
            COMPLETED: Array(14).fill(0),
            EXPIRED: Array(14).fill(0),
            ABORTED: Array(14).fill(0),
          };

          dates.forEach((date, index) => {
            masterHistory.forEach((reservation: ReservationHistory) => {
              const reservationDate =
                new Date(reservation.date).toISOString().split('T')[0] +
                'T00:00:00.000Z';
              if (reservationDate === date) {
                const type: ReservationHistoryType = reservation.type;
                typeCounts[type][index]++;
              }
            });
          });

          this.lineData = {
            labels: this.getPastTwoWeeks().pastTwoWeeks,
            datasets: [
              {
                label: 'REJECTED',
                data: typeCounts.REJECTED,
                borderColor: this.documentStyle.getPropertyValue('--red-300'),
                tension: 0.4,
                backgroundColor:
                  this.documentStyle.getPropertyValue('--red-300'),
              },
              {
                label: 'CANCELED',
                data: typeCounts.CANCELED,
                borderColor:
                  this.documentStyle.getPropertyValue('--orange-200'),
                tension: 0.4,
                backgroundColor:
                  this.documentStyle.getPropertyValue('--orange-200'),
              },
              {
                label: 'COMPLETED',
                data: typeCounts.COMPLETED,
                borderColor:
                  this.documentStyle.getPropertyValue('--primary-300'),
                tension: 0.4,
                backgroundColor:
                  this.documentStyle.getPropertyValue('--primary-300'),
              },
              {
                label: 'EXPIRED',
                data: typeCounts.EXPIRED,
                borderColor:
                  this.documentStyle.getPropertyValue('--purple-300'),
                tension: 0.4,
                backgroundColor:
                  this.documentStyle.getPropertyValue('--purple-300'),
              },
              {
                label: 'ABORTED',
                data: typeCounts.ABORTED,
                borderColor: this.documentStyle.getPropertyValue('--pink-300'),
                tension: 0.4,
                backgroundColor:
                  this.documentStyle.getPropertyValue('--pink-300'),
              },
            ],
          };
        },
        error: (err) => {
          
        },
        complete: () => {
          this.reservationStatisticsIsLoading = false;
        },
      });
    }
  }

  getImage(reservation: any) {
    return `../../assets/images/map/desk-area/${reservation.deskNumber}.png`;
  }

  getStyleForDate(date: any): string {
    const reservation = this.selfReservations.find(
      (reservation) =>
        new Date(reservation.startTime).getDate() === date.day &&
        new Date(reservation.startTime).getMonth() === date.month &&
        new Date(reservation.startTime).getFullYear() === date.year
    );

    if (reservation) {
      if (reservation.status === 'PENDING') {
        return 'bg-red-100 line-through text-red-500';
      } else if (reservation.status === 'STARTED') {
        return 'bg-green-100 line-through text-green-500';
      } else if (reservation.status === 'APPROVED') {
        return 'bg-primary-100 line-through text-primary-500';
      }
    }

    return '';
  }

  getMostRecentActivities(params: any) {
    params = this.paramsBuilder.buildParams(params);

    this.webService.getTrails(params).subscribe({
      next: (res: any) => {
        this.recentActivities = res.trails;
      },
      error: (err) => {
      },
    });
  }

  getMostRecentReservations(params: any) {
    params = this.paramsBuilder.buildParams(params);
    this.webService.getReservations(params).subscribe({
      next: (res: any) => {
        this.recentReservations = res.reservations;
      },
      error: (err) => {
      },
    });
  }
}
