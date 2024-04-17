import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BookComponent } from './pages/book/book.component';
import { FaqsComponent } from './pages/faqs/faqs.component';
import { GuidesComponent } from './pages/guides/guides.component';
import { LogsComponent } from './pages/logs/logs.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ManageUsersComponent } from './pages/manage-users/manage-users.component';
import { ManageReservationsComponent } from './pages/manage-reservations/manage-reservations.component';
import { ManageDeskUnavailabilitiesComponent } from './pages/manage-desk-unavailabilities/manage-desk-unavailabilities.component';
import { ManageDesksComponent } from './pages/manage-desks/manage-desks.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { SuccessResetComponent } from './pages/success-reset/success-reset.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CheckEmailComponent } from './pages/check-email/check-email.component';
import { OnboardingComponent } from './pages/onboarding/onboarding.component';
import { Step1Component } from './components/step-1/step-1.component';
import { Step2Component } from './components/step-2/step-2.component';
import { Step3Component } from './components/step-3/step-3.component'; 
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    BookComponent,
    FaqsComponent,
    GuidesComponent,
    LogsComponent,
    ProfileComponent,
    ManageUsersComponent,
    ManageReservationsComponent,
    ManageDeskUnavailabilitiesComponent,
    ManageDesksComponent,
    ResetPasswordComponent,
    SuccessResetComponent,
    ForgotPasswordComponent,
    NotFoundComponent,
    CheckEmailComponent,
    OnboardingComponent,
    Step1Component,
    Step2Component,
    Step3Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
