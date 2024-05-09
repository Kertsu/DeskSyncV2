import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SocketService } from '../../services/socket.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WebService } from '../../services/web.service';
import { NavigationService } from '../../shared/navigation.service';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isSubmitted: boolean = false;
  isLoading: boolean = false;
  errorMessage!: string | null;
  sessionErrorMessage!: string | null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
    ,private webService: WebService,
    protected navigationService: NavigationService,
    protected errorService: ErrorService
  ) {
    
  }


  loginForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', Validators.required],
  });

  login() {
    this.changeStatus(true);

    const data = {
      email : this.loginForm.get('email')?.value ?? '',
      password : this.loginForm.get('password')?.value ?? ''
    }

    this.webService.onLoginUser(data).subscribe({
      next: (res: any) => {
        console.log(res);
        this.changeStatus(false);
        this.userService.setToken(res.user.token)
        this.router.navigate(['/hdbsv2/dashboard'])
      },
      error: error => {
        console.log(error)
        this.errorMessage = error.error.error || error.error
        this.changeStatus(false)

        setTimeout(() => {
          this.errorMessage = null
        }, 3000);
      }
    })

  }

  changeStatus(value: boolean) {
    this.isLoading = value;
    this.isSubmitted = value;
  }
}