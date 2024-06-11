import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WebService } from '../../services/web.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorService } from '../../services/error.service';
import { PasswordResetService } from '../../utils/password-reset.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit{
  isLoading: boolean = false;
  errorMessage!: string | null;

  forgotPasswordForm!: FormGroup;

  constructor(private fb: FormBuilder, private webService: WebService, private errorService: ErrorService, private router: Router, private passwordResetService: PasswordResetService){
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]]
    })
  }

  ngOnInit(): void {

    this.errorService.errorMessage$.subscribe(
      res => {
        this.errorMessage = res
      }
      
    )
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formData = this.forgotPasswordForm.value;

    this.webService.onForgotPassword(formData.email).subscribe({
      next: (res: any) => {
        
      },
      error: (error) => {
        this.isLoading = false
      }, complete: () => {
        this.isLoading = false;
        this.passwordResetService.setPasswordResetStatus(true)
        this.router.navigate(['/check-email'])
      }
    })
  }

}