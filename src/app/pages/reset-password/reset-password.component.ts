import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebService } from '../../services/web.service';
import { ErrorService } from '../../services/error.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordResetService } from '../../utils/password-reset.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  isLoading: boolean = false;
  errorMessage!: string | null;

  token!: string | null;
  id!: string | null;

  submitted: boolean = false

  resetPasswordForm!: FormGroup

  constructor(private route: ActivatedRoute, private webService: WebService, private router: Router, private errorService: ErrorService, private fb: FormBuilder, private passwordResetService: PasswordResetService) { }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    })     

    this.route.paramMap.subscribe(params => {
      this.token = params.get('token');
      this.id = params.get('id');
    });
  }

  resetPassword() {
    this.submitted = true;
    this.isLoading = true
    const password = this.resetPasswordForm.get('password')?.value;
    const confirmPassword = this.resetPasswordForm.get('confirmPassword')?.value;
    if (password !== confirmPassword){
      this.errorMessage = "Passwords do not match";
      this.submitted = false
      this.isLoading = false
      return
    }

    const params = {
      token: this.token,
      id: this.id
    }

    const data = {
      password,
      confirmPassword
    }
    this.webService.onResetPassword(params as {token: string, id: string}, data).subscribe({
      next: (res: any) => {
        console.log(res);
        this.resetPasswordForm.reset();
        this.errorMessage = null;
        this.passwordResetService.setPasswordResetSuccessStatus(true);
        this.router.navigate(['/changed-password'])
      },
      error: error => {
        this.isLoading= false
        this.errorMessage = error.error.error;
        this.errorService.setErrorMessage(this.errorMessage)
      },
      complete: () => {
        this.isLoading = false
      }
    })


    
  }

}