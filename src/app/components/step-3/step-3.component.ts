import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';
import { Hotdesk } from '../../models/Hotdesk';
import { ReservationRequest } from '../../requests/ReservationRequest';
import { MessageService } from '../../utils/message.service';
import { ConfirmationService } from 'primeng/api';
import { WebService } from '../../services/web.service';

@Component({
  selector: 'app-step-3',
  templateUrl: './step-3.component.html',
  styleUrl: './step-3.component.css',
  providers: [ConfirmationService],
})
export class Step3Component implements OnInit{

  desk!: Hotdesk
  reservation!: ReservationRequest

  isLoading: boolean = false;

  constructor(private router: Router, private reservationService: ReservationService, private messageService: MessageService, private confirmationService: ConfirmationService, private webService: WebService) { }

  ngOnInit(): void {
      this.desk = JSON.parse(sessionStorage.getItem('hdbsv2-desk') as string)
      this.reservation = JSON.parse(sessionStorage.getItem('hdbsv2-reservation') as string)
  }

  back(){
    let reservation = this.reservationService.getReservation()

    reservation = {
      area: reservation?.area,
      date: undefined,
      startTime: undefined,
      endTime: undefined,
      deskNumber: undefined,
      mode: undefined
    }
   
    sessionStorage.removeItem('hdbsv2-desk')
    this.reservationService.setReservation(reservation)
    this.router.navigate(['/hdbsv2/book/desk-area'])
  }

  getImage(){
    return `../../assets/images/map/desk-area/${this.desk.deskNumber}.png`
  }

  voidReservation(){
    this.messageService.addMessage('success', '', 'Reservation voided successfully!', 3000);
    sessionStorage.clear()
    this.router.navigate(['/hdbsv2/book'])
  }

  confirm(event: Event){
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to void this reservation?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.voidReservation()
      },
      reject: () => {
      }
  });
  }

  reserve(){
    this.isLoading = true;
    const data: ReservationRequest = this.reservationService.getReservation() as ReservationRequest
    this.webService.onReserve(data).subscribe({
      next: (res) => {
        this.messageService.addMessage('success', '', 'Reservation made successfully!', 3000);
        sessionStorage.clear()
        this.router.navigate(['/hdbsv2/book'])
      },
      error: (err) => {
        this.messageService.addMessage('error', '', err.error.error, 3000);
        this.isLoading = false;
      }, complete: () => {
        this.isLoading = false;
      }
    })
  }
}