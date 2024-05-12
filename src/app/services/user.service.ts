import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorService } from './error.service';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private router: Router, private errorService: ErrorService) {}

  setUser(user: any) {
    localStorage.setItem('hdbsv2User', JSON.stringify(user));
  }

  setToken(token: string) {
    localStorage.setItem('hdbsv2Token', token);
  }

  getUser() {
    return JSON.parse((localStorage.getItem('hdbsv2User') || null) as string);
  }

  logout() {
    localStorage.removeItem('hdbsv2User');
    localStorage.removeItem('hdbsv2Token');
    sessionStorage.clear()

    this.errorService.clearErrorMessage()

    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('hdbsv2Token') || '';
  }

  isLoggedIn() {
    return this.getToken() != null && this.getToken() != '';
  }

  setDeviceToken(deviceToken: string){
    localStorage.setItem('hdbsv2DeviceToken', deviceToken);
  }
}