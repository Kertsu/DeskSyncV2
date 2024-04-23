import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Hotdesk } from '../models/Hotdesk';
import { ReservationRequest } from '../requests/ReservationRequest';
import { Reservation } from '../models/Reservation';
import { User } from '../models/User';

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
  baseSwitchUrl: string = 'http://localhost:5000/api/switch';

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

  registerUser(email: string){
    return this.http.post(`${this.baseUserURL}/register`, {email})
  }

  deleteUser(user: User){
    return this.http.delete(`${this.baseUserURL}/${user.id || user._id}`)
  }

  // DESK
  getDesks(params?: any) {
    return this.http.get(`${this.baseHotdeskURL}`, { params });
  }

  createHotdesk(desk: { deskNumber: number; essentials: string[] }) {
    return this.http.post(`${this.baseHotdeskURL}`, desk);
  }

  updateHotdesk(desk: Hotdesk, data: { essentials: string[]; status: string }) {
    return this.http.put(`${this.baseHotdeskURL}/${desk.id}`, data);
  }

  deleteHotdesk(desk: Hotdesk) {
    return this.http.delete(`${this.baseHotdeskURL}/${desk.id}`);
  }

  // RESERVATION
  onReserve(data: ReservationRequest) {
    return this.http.post(`${this.baseReservationURL}/reserve`, data);
  }

  getUnavailabilities(params?: any) {
    return this.http.get(`${this.baseReservationURL}`, { params });
  }

  onAbort(reservation: Reservation) {
    return this.http.delete(
      `${this.baseReservationURL}/abort/${reservation.id}`
    );
  }

  getReservations(params?: any) {
    return this.http.get(`${this.baseReservationURL}/`, { params });
  }

  handleReservation(reservation: Reservation, action: string) {
    return this.http.patch(
      `${this.baseReservationURL}/${reservation.id}/action/${action}`,
      {}
    );
  }

  // AUDIT TRAILS

  // SWITCH
  getSwitchValue() {
    return this.http.get(`${this.baseSwitchUrl}`);
  }

  handleSwitch(autoAccepting: boolean){
    return this.http.put(`${this.baseSwitchUrl}`, { autoAccepting  });
  }
}
