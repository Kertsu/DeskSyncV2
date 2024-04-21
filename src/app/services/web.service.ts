import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Hotdesk } from '../models/Hotdesk';
import { ReservationRequest } from '../requests/ReservationRequest';
import { Reservation } from '../models/Reservation';

interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class WebService {
  baseUserURL: string = 'http://localhost:5000/api/users';
  baseHotdeskURL: string = 'http://localhost:5000/api/hotdesks';
  baseReservationURL: string = 'http://localhost:5000/api/reservations';

  constructor(private http: HttpClient) {}

  // USER

  onLoginUser(userData: any) {
    return this.http.post(`${this.baseUserURL}/login`, userData);
  }

  onForgotPassword(email: string) {
    return this.http.post(`${this.baseUserURL}/forgot-password`, { email });
  }

  getSelf() {
    return this.http.get(`${this.baseUserURL}/self`);
  }

  getNotifications(skip: number) {
    const limit = skip;

    const page = Math.floor(skip / limit) + 1;
    return this.http.get(
      `${this.baseUserURL}/self/notifications?page=${page}&limit=${limit}`
    );
  }

  getUsers(params?: any) {
    return this.http.get(`${this.baseUserURL}`, { params });
  }

  validateToken(token: string, id: any) {
    return this.http.get(
      `${this.baseUserURL}/reset-password/validate/${token}/${id}`
    );
  }

  onResetPassword(
    params: { token: string; id: string },
    data: ResetPasswordData
  ) {
    return this.http.patch(
      `${this.baseUserURL}/reset-password/${params.token}/${params.id}`,
      data
    );
  }

  onboardingChangePassword(data: ResetPasswordData) {
    return this.http.patch(
      `${this.baseUserURL}/onboarding/change-password`,
      data
    );
  }

  // DESK
  getDesks(params?: any) {
    return this.http.get(`${this.baseHotdeskURL}`, { params });
  }

  createHotdesk(desk: {deskNumber: number, essentials: string[]}){
    return this.http.post(`${this.baseHotdeskURL}`, desk)
  }

  updateHotdesk(desk: Hotdesk, data: {essentials: string[], status: string}){
    return this.http.put(`${this.baseHotdeskURL}/${desk.id}`, data)
  }

  deleteHotdesk(desk: Hotdesk){
    return this.http.delete(`${this.baseHotdeskURL}/${desk.id}`)
  }

  // RESERVATION
  onReserve(data: ReservationRequest){
    return this.http.post(`${this.baseReservationURL}/reserve`, data)
  }

  getUnavailabilities(params? : any){
    return this.http.get(`${this.baseReservationURL}`, { params });
  }

  onAbort(reservation: Reservation){
    return this.http.delete(`${this.baseReservationURL}/abort/${reservation.id}`)
  }

  getReservations(params?: any){
    return this.http.get(`${this.baseReservationURL}/`, {params})
  }

  handleReservation(reservation: Reservation, action: string){
    return this.http.patch(`${this.baseReservationURL}/${reservation.id}/action/${action}`, {})
  }

  // AUDIT TRAILS
}