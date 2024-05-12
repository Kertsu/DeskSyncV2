import { Component } from '@angular/core';
import { ErrorService } from '../../services/error.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NavigationService } from '../../shared/navigation.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent {
  isSubmitted: boolean = false;
  isLoading: boolean = false;
  errorMessage!: string | null;
  sessionErrorMessage!: string | null;

  otpForm = this.fb.group({
    verificationCode: ['', Validators.required],
  });
  
  constructor(
    protected navigationService: NavigationService,
    private fb: FormBuilder,
    protected errorService: ErrorService
  ){}

  
  verify() {}
}
