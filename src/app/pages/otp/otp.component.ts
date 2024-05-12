import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../../services/error.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NavigationService } from '../../shared/navigation.service';
import { WebService } from '../../services/web.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {
  // TODO - set the otp flag to false


  isSubmitted: boolean = false;
  isLoading: boolean = false;
  errorMessage!: string | null;
  infoMessage!: string | null;
  sessionErrorMessage!: string | null;

  timer: number = 60;
  

  otpForm = this.fb.group({
    verificationCode: ['', Validators.required],
  });
  
  constructor(
    protected navigationService: NavigationService,
    private fb: FormBuilder,
    protected errorService: ErrorService,
    private webService: WebService,
    private router: Router
  ){}

  ngOnInit(): void {
      this.otpForm.valueChanges.subscribe({
        next: (res) => console.log(res)
      })
  }

  verify() {
    this.isLoading = true
    const otp = this.otpForm.get('verificationCode')?.value

    if (otp){
      this.webService.verifyOTP(otp).subscribe({
        next: (res: any) => {
          console.log(res);
          this.errorMessage = null
          this.isLoading = false;
          this.router.navigate(['/hdbsv2/dashboard']);
        },
        error: (err: any) => {
          console.log(err);
          this.errorMessage = err.error.error
          this.infoMessage = null
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      })
    }
  }
  resend() {
    let intervalId = setInterval(() => {
      this.timer--;
      if (this.timer === 0) {
        clearInterval(intervalId);
        this.timer = 60; 
      }
    }, 1000);

    this.webService.resendOTP().subscribe({
      next: (res: any) => {
        this.errorMessage = null
        this.infoMessage = res.message
      },
      error: (err: any) => {
        this.errorMessage = err.error.error
        this.infoMessage = null
      },
    })
  }
}
