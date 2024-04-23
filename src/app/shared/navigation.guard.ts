import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { UiService } from '../services/ui.service';
import { inject } from '@angular/core';
import { PasswordResetService } from '../utils/password-reset.service';
import { WebService } from '../services/web.service';
import { catchError, map, of } from 'rxjs';
import { ErrorService } from '../services/error.service';
import { ReservationService } from '../services/reservation.service';
import { ReservationRequest } from '../requests/ReservationRequest';

export const navigationGuard: CanActivateChildFn = (route, state) => {
  const uiService = inject(UiService);

  if (uiService.getMessageShown()) {
    console.log('Message shown, preventing routing and shaking the screen.');
    const alertSection = document.querySelector('.alert-section');
    const alertSectionText = document.querySelector('.alert-section-text');
    const resetButton = document.querySelector(
      'button.alert-section-reset[label="Reset"]'
    );

    console.log(alertSection);
    if (alertSection) {
      alertSection.classList.remove('surface-ground');
      alertSection.classList.add('bg-red-500');
      alertSectionText?.classList.add('text-white');
      alertSectionText?.classList.remove('text-color');
      resetButton?.classList.remove('text-color');
      resetButton?.classList.add('text-white');
    }

    setTimeout(() => {
      if (alertSection) {
        alertSection.classList.remove('bg-red-500');
        alertSection.classList.add('surface-ground');
        alertSectionText?.classList.remove('text-white');
        alertSectionText?.classList.add('text-color');
        resetButton?.classList.remove('text-white');
        resetButton?.classList.add('text-color');
      }
    }, 750);
    return false;
  }

  return true;
};

export const passwordResetGuard: CanActivateFn = (route, state) => {
  const passwordResetService = inject(PasswordResetService);
  const router = inject(Router);
  const isPasswordReset = passwordResetService.getPasswordResetStatus();

  if (!isPasswordReset) {
    router.navigate(['**']);
    return false;
  }

  passwordResetService.setPasswordResetStatus(false);
  return true;
};

export const passwordResetSuccessGuard: CanActivateFn = (route, state) => {
  const passwordResetService = inject(PasswordResetService);
  const router = inject(Router);
  const isPasswordResetSuccess =
    passwordResetService.getPasswordResetSuccessStatus();

  if (!isPasswordResetSuccess) {
    router.navigate(['**']);
    return false;
  }

  passwordResetService.setPasswordResetSuccessStatus(false);
  return true;
};

export const resetPasswordGuard: CanActivateFn = (route, state) => {
  const webService = inject(WebService);
  const router = inject(Router);
  const errorService = inject(ErrorService);

  const token = route.paramMap.get('token');
  const id = route.paramMap.get('id');

  if (token && id) {
    return webService.validateToken(token, id).pipe(
      map((res: any) => true),
      catchError((err) => {
        console.log(err);
        errorService.setErrorMessage(err.error.error);
        router.navigate(['/forgot-password']);
        return of(false);
      })
    );
  } else {
    router.navigate(['**']);
    return of(false);
  }
};

export const onboardingGuard: CanActivateFn = (route, state) => {
  const webService = inject(WebService);
  const router = inject(Router);
  const errorService = inject(ErrorService);

  return webService.getSelf().pipe(
    map((res: any) => {
      console.log(res);
      if (!res.user.passwordChangedAt) {
        router.navigate(['/onboarding']);
        return false;
      }
      return true;
    }),
    catchError((err) => {
      const errorMessage = err.error.error
      localStorage.removeItem('hdbsv2User')
      localStorage.removeItem('hdbsv2Token')
      errorService.setErrorMessage(errorMessage);
      router.navigate(['/login']);

      return of(false);
    })
  );
};

export const deskAreaGuard: CanActivateFn = (route, state) => {
  const reservationService = inject(ReservationService);
  const router = inject(Router);

  const reservation = reservationService.getReservation();

  if (reservation && reservation?.area) {
    return true;
  }
  router.navigate(['/hdbsv2/book']);
  return false;
};

export const confirmationGuard: CanActivateFn = (route, state) => {
  const reservationService = inject(ReservationService);
  const router = inject(Router);
  const reservation = reservationService.getReservation();


  if ((reservation?.area && reservation?.date && reservation?.startTime && reservation?.endTime && reservation?.deskNumber )) {
    return true;
  }
  router.navigate(['/hdbsv2/book/desk-area']);
  return false;
};