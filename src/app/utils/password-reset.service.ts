import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {

  private isPasswordReset: boolean = false;

  constructor() { }

  setPasswordResetStatus(status: boolean): void {
    this.isPasswordReset = status;
  }

  getPasswordResetStatus(): boolean {
    return this.isPasswordReset;
  }
  private isPasswordResetSuccess: boolean = false;

  setPasswordResetSuccessStatus(status: boolean): void {
    this.isPasswordResetSuccess = status;
  }

  getPasswordResetSuccessStatus(): boolean {
    return this.isPasswordResetSuccess;
  }
}