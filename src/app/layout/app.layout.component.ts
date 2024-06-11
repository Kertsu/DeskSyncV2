import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { LayoutService } from './service/app.layout.service';
import { AppSidebarComponent } from './app.sidebar.component';
import { AppTopBarComponent } from './app.topbar.component';
import { SocketService } from '../services/socket.service';
import { UserService } from '../services/user.service';
import { WebService } from '../services/web.service';
import { Message } from 'primeng/api';
import { MessageService } from '../utils/message.service';
import { NetworkService } from '../services/network.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { driver, Driver } from 'driver.js';
import { User } from '../models/User';
import { ReservationService } from '../services/reservation.service';
import { ReservationRequest } from '../requests/ReservationRequest';
import { Step2Component } from '../components/step-2/step-2.component';
import { Calendar } from 'primeng/calendar';
import { timeConvert } from '../utils/reservation-time-converter.util';

@Component({
  selector: 'app-layout',
  templateUrl: './app.layout.component.html',
  styleUrls: ['../../styles.css'],
  providers: [DialogService],
})
export class AppLayoutComponent implements OnDestroy, OnInit, AfterViewInit {
  overlayMenuOpenSubscription: Subscription;

  menuOutsideClickListener: any;

  profileMenuOutsideClickListener: any;

  messages: Message[] = [];
  messageSubscription!: Subscription;

  prevNetworkStatus: boolean | null = null;
  isLoading: boolean = false;

  driverObj!: Driver;

  @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;

  @ViewChild(AppTopBarComponent) appTopbar!: AppTopBarComponent;

  constructor(
    public layoutService: LayoutService,
    public renderer: Renderer2,
    public router: Router,
    private socketService: SocketService,
    private userService: UserService,
    private webService: WebService,
    private messageService: MessageService,
    private networkService: NetworkService,
    private reservationService: ReservationService
  ) {
    this.overlayMenuOpenSubscription =
      this.layoutService.overlayOpen$.subscribe(() => {
        if (!this.menuOutsideClickListener) {
          this.menuOutsideClickListener = this.renderer.listen(
            'document',
            'click',
            (event) => {
              const isOutsideClicked = !(
                this.appSidebar.el.nativeElement.isSameNode(event.target) ||
                this.appSidebar.el.nativeElement.contains(event.target) ||
                this.appTopbar.menuButton.nativeElement.isSameNode(
                  event.target
                ) ||
                this.appTopbar.menuButton.nativeElement.contains(event.target)
              );

              if (isOutsideClicked) {
                this.hideMenu();
              }
            }
          );
        }

        if (!this.profileMenuOutsideClickListener) {
          this.profileMenuOutsideClickListener = this.renderer.listen(
            'document',
            'click',
            (event) => {
              const isOutsideClicked = !(
                this.appTopbar.menu.nativeElement.isSameNode(event.target) ||
                this.appTopbar.menu.nativeElement.contains(event.target) ||
                this.appTopbar.topbarMenuButton.nativeElement.isSameNode(
                  event.target
                ) ||
                this.appTopbar.topbarMenuButton.nativeElement.contains(
                  event.target
                )
              );

              if (isOutsideClicked) {
                this.hideProfileMenu();
              }
            }
          );
        }

        if (this.layoutService.state.staticMenuMobileActive) {
          this.blockBodyScroll();
        }
      });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.hideMenu();
        this.hideProfileMenu();
      });

    this.messageSubscription = this.messageService
      .onAddMessage()
      .subscribe((res) => {
        console.log(res);
        this.messages = res;
      });
  }

  hideMenu() {
    this.layoutService.state.overlayMenuActive = false;
    this.layoutService.state.staticMenuMobileActive = false;
    this.layoutService.state.menuHoverActive = false;
    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
      this.menuOutsideClickListener = null;
    }
    this.unblockBodyScroll();
  }

  hideProfileMenu() {
    this.layoutService.state.profileSidebarVisible = false;
    if (this.profileMenuOutsideClickListener) {
      this.profileMenuOutsideClickListener();
      this.profileMenuOutsideClickListener = null;
    }
  }

  blockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.add('blocked-scroll');
    } else {
      document.body.className += ' blocked-scroll';
    }
  }

  unblockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.remove('blocked-scroll');
    } else {
      document.body.className = document.body.className.replace(
        new RegExp(
          '(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)',
          'gi'
        ),
        ' '
      );
    }
  }

  get containerClass() {
    return {
      'layout-theme-light': this.layoutService.config().colorScheme === 'light',
      'layout-theme-dark': this.layoutService.config().colorScheme === 'dark',
      'layout-overlay': this.layoutService.config().menuMode === 'overlay',
      'layout-static': this.layoutService.config().menuMode === 'static',
      'layout-static-inactive':
        this.layoutService.state.staticMenuDesktopInactive &&
        this.layoutService.config().menuMode === 'static',
      'layout-overlay-active': this.layoutService.state.overlayMenuActive,
      'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
      'p-input-filled': this.layoutService.config().inputStyle === 'filled',
      'p-ripple-disabled': !this.layoutService.config().ripple,
    };
  }

  ngOnDestroy() {
    if (this.overlayMenuOpenSubscription) {
      this.overlayMenuOpenSubscription.unsubscribe();
    }

    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
    }

    this.messages = [];
  }

  ngOnInit(): void {
    this.socketService.connect();

    this.webService.getSelf().subscribe({
      next: (res: any) => {
        this.userService.setUser(res.user);
      },
      error: (error) => {
        setTimeout(() => {}, 1000);
        if (error)
          this.messageService.addMessage(
            'error',
            'Error',
            'Token has expired',
            1500
          );
        setTimeout(() => {
          this.userService.logout();
        }, 1000);
      },
      complete: () => {
        const user = this.userService.getUser();
        this.onboard(user);

        this.socketService.emit('live', user);
      },
    });

    this.networkService.isOnline().subscribe((res) => {
      if (this.prevNetworkStatus !== null && res !== this.prevNetworkStatus) {
        if (res) {
          this.messages = [
            {
              severity: 'info',
              life: 10000,
              summary: 'Your connection is restored',
              icon: 'pi pi-wifi',
            },
          ];
        } else {
          this.messages = [
            {
              severity: 'info',
              life: 10000,
              summary: 'You are currently offline',
              icon: 'pi pi-globe',
            },
          ];
        }
      }
      this.prevNetworkStatus = res;
    });
  }

  ngAfterViewInit(): void {}

  onboard(user: User) {
    let dateToSelect;
    const currentDate = new Date();

    this.driverObj = driver({
      allowClose: false,
      showProgress: true,
      steps: [
        {
          element: '[app-menuitem]:not([root=true]):nth-child(1) ul>li',
          popover: {
            title: 'Dashboard',
            description: `This is your dashboard page`,
          },
        },
        {
          element: '#dashboard',
          popover: {
            title: 'Dashboard Tab',
            description: `A brief overview of your account is shown here.`,
          },
        },
        {
          element:
            '[app-menuitem]:not([root=true]):nth-child(1) ul>li:nth-child(2)',
          popover: {
            title: 'Book',
            description: `This is where you can book a hotdesk`,
            onNextClick: () => {
              this.router.navigate(['/hdbsv2/book']);
              setTimeout(() => {
                this.driverObj.moveNext();
              }, 200);
            },
          },
        },
        {
          element: '[usemap="#image-map"]',
          popover: {
            title: 'Office map',
            description: `You can directly choose your preferred area on this map`,
          },
        },
        {
          element: '[label="Next"]',
          popover: {
            title: 'Proceed',
            description: `After selecting an area, click next to continue`,
            onNextClick: () => {
              const reservation: ReservationRequest = {
                area: 1,
                date: undefined,
                startTime: undefined,
                endTime: undefined,
                deskNumber: undefined,
                mode: undefined,
              };

              this.reservationService.setReservation(reservation);
              this.router.navigate(['hdbsv2/book/desk-area']);

              setTimeout(() => {
                this.driverObj.moveNext();
              }, 200);
            },
          },
        },
        {
          element: '[formcontrolname="date"]',
          popover: {
            title: 'Calendar',
            description: `Open the calendar first`,
            onNextClick: () => {
              const button = document.querySelector(
                '[formcontrolname="date"] > span > button'
              ) as HTMLButtonElement;
              button.click();

              setTimeout(() => {
                this.driverObj.moveNext();
              }, 150);
            },
          },
        },
        {
          element: '.p-datepicker-touch-ui',
          popover: {
            title: 'Date',
            description: `Select your preffered date to see available desks`,
            onNextClick: () => {
              const date = currentDate.getDate();
              dateToSelect = date + 3;

              const button = document.querySelector(
                `td[aria-label="${dateToSelect}"] > span`
              ) as HTMLElement;
              button.click();

              setTimeout(() => {
                this.driverObj.moveNext();
              }, 200);
            },
          },
        },
        {
          element: '[usemap="#image-map"]',
          popover: {
            title: 'Desk map',
            description: `You can directly choose your preferred desk on this area`,
            onNextClick: () => {
              const desk = document.querySelector(
                '[ng-reflect-content="Hotdesk 1"]'
              ) as HTMLElement;

              desk.click();

              setTimeout(() => {
                this.driverObj.moveNext();
              }, 300);
            },
          },
        },
        {
          element: '[label="Book for this desk"]',
          popover: {
            title: 'Book',
            description: `Click to proceed to the final step`,
            onNextClick: () => {
              const dateToReserve = currentDate.getDate() + 3;

              const { startTime, endTime, date } = timeConvert(
                new Date(dateToReserve)
              );
              const reservation: ReservationRequest = {
                area: 1,
                date,
                startTime,
                endTime,
                deskNumber: 1,
                mode: 0,
              };

              sessionStorage.setItem(
                'hdbsv2-desk',
                JSON.stringify({
                  _id: {
                    $oid: '65af29abeb78e1b74b94428a',
                  },
                  title: 'Hotdesk 1',
                  deskNumber: 1,
                  workspaceEssentials: [
                    'Desk Organizer',
                    'Noise-Canceling Headphones',
                    'Desk Plants',
                  ],
                  status: 'AVAILABLE',
                  createdAt: {
                    $date: '2024-01-23T02:51:23.637Z',
                  },
                  updatedAt: {
                    $date: '2024-04-22T08:37:30.339Z',
                  },
                  __v: 1,
                  area: 1,
                })
              );

              this.reservationService.setReservation(reservation);
              this.router.navigate(['/hdbsv2/book/confirmation']);

              setTimeout(() => {
                this.driverObj.moveNext();
              }, 200);
            },
          },
        },
        {
          element: 'p-button[label="Back"]',
          popover: {
            title: 'Back to previous step',
            description: `You can go back to the previous step`,
          },
        },
        {
          element: 'p-button[label="Void"]',
          popover: {
            title: 'Void',
            description: `If ever you want to cancel your reservation, you can click void.`,
          },
        },
        {
          element: 'p-button[label="Reserve"]',
          popover: {
            title: 'Final step',
            description: `Easy as that. Go start booking now!`,
            onNextClick: () => {
              this.router.navigate(['/hdbsv2/'])

              setTimeout(() => {
                this.driverObj.destroy()
                sessionStorage.clear()
              }, 100);
            }
          },
        },
      ],
    });

    if (!user.hasOnboard) {
      this.driverObj.drive();
    }
  }
}
