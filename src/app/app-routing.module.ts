import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BookComponent } from './pages/book/book.component';
import { Step1Component } from './components/step-1/step-1.component';
import { Step2Component } from './components/step-2/step-2.component';
import { Step3Component } from './components/step-3/step-3.component';
import { FaqsComponent } from './pages/faqs/faqs.component';
import { GuidesComponent } from './pages/guides/guides.component';
import { LogsComponent } from './pages/logs/logs.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ManageUsersComponent } from './pages/manage-users/manage-users.component';
import { ManageReservationsComponent } from './pages/manage-reservations/manage-reservations.component';
import { ManageDeskUnavailabilitiesComponent } from './pages/manage-desk-unavailabilities/manage-desk-unavailabilities.component';
import { authGuard, guestGuard, hasAccess, isAdmin } from './shared/auth.guard';
import { ManageDesksComponent } from './pages/manage-desks/manage-desks.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { SuccessResetComponent } from './pages/success-reset/success-reset.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CheckEmailComponent } from './pages/check-email/check-email.component';
import {
  confirmationGuard,
  dashboardGuard_onboarding,
  dashboardGuard_otp,
  deskAreaGuard,
  navigationGuard,
  onboardingGuard,
  otpGuard,
  passwordResetGuard,
  passwordResetSuccessGuard,
  resetPasswordGuard,
} from './shared/navigation.guard';
import { OnboardingComponent } from './pages/onboarding/onboarding.component';
import { ReservationsComponent } from './pages/reservations/reservations.component';
import { HistoryComponent } from './pages/history/history.component';
import { OtpComponent } from './pages/otp/otp.component';
import { ReportComponent } from './pages/report/report.component';
import { ManageIssuesComponent } from './pages/manage-issues/manage-issues.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authGuard],
  },
  {
    path: 'reset-password/:token/:id',
    component: ResetPasswordComponent,
    canActivate: [authGuard, resetPasswordGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [authGuard],
  },
  {
    path: 'check-email',
    component: CheckEmailComponent,
    canActivate: [authGuard, passwordResetGuard],
  },
  {
    path: 'changed-password',
    component: SuccessResetComponent,
    canActivate: [authGuard, passwordResetSuccessGuard],
  },
  {
    path: 'onboarding',
    component: OnboardingComponent,
    canActivate: [onboardingGuard],
  },
  { path: 'verify', component: OtpComponent, canActivate: [otpGuard] },
  {
    path: 'hdbsv2',
    canActivate: [guestGuard, dashboardGuard_onboarding, dashboardGuard_otp],
    canActivateChild: [navigationGuard],
    component: AppLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'book',
        component: BookComponent,
        children: [
          { path: '', redirectTo: 'office-area', pathMatch: 'full' },
          { path: 'office-area', component: Step1Component },
          {
            path: 'desk-area',
            component: Step2Component,
            canActivate: [deskAreaGuard],
          },
          {
            path: 'confirmation',
            component: Step3Component,
            canActivate: [confirmationGuard],
          },
        ],
      },
      { path: 'logs', component: LogsComponent, canActivate: [isAdmin] },
      {
        path: 'manage-users',
        component: ManageUsersComponent,
        canActivate: [isAdmin],
      },
      {
        path: 'manage-reservations',
        component: ManageReservationsComponent,
        canActivate: [hasAccess],
      },
      {
        path: 'manage-desks',
        component: ManageDesksComponent,
        canActivate: [hasAccess],
      },
      {
        path: 'manage-unavailabilities',
        component: ManageDeskUnavailabilitiesComponent,
        canActivate: [hasAccess],
      },
      {
        path: 'manage-issues',
        component: ManageIssuesComponent,
        canActivate: [isAdmin],
      },
      { path: 'faqs', component: FaqsComponent },
      { path: 'guides', component: GuidesComponent },
      {
        path: 'profile',
        component: ProfileComponent,
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
