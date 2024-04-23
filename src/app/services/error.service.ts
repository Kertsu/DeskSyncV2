import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorMessageSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  errorMessage$: Observable<string | null> = this.errorMessageSubject.asObservable();

  constructor() { }

  setErrorMessage(message: string | null): void {
    this.errorMessageSubject.next(message);
  }

  clearErrorMessage(): void {
    this.errorMessageSubject.next(null);
  }
}


