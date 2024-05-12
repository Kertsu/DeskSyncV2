import { Component, OnInit } from '@angular/core';
import { useAnimation, transition, trigger } from '@angular/animations';
import { tada } from 'ng-animate';
import confetti from 'canvas-confetti';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorService } from '../../services/error.service';
import { WebService } from '../../services/web.service';
import { PasswordResetService } from '../../utils/password-reset.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css'],
  animations: [trigger('tada', [transition('* => *', useAnimation(tada))])],
})
export class OnboardingComponent implements OnInit {
  isLoading: boolean = false;
  errorMessage!: string | null;

  changePasswordForm!: FormGroup;

  constructor(
    private webService: WebService,
    private router: Router,
    private errorService: ErrorService,
    private fb: FormBuilder,
    protected userService: UserService
  ) {}

  ngOnInit(): void {
    this.fireworks();

    this.changePasswordForm = this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  fireworks() {
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const self = this;

    const interval: any = setInterval(function () {
      const x1 = self.randomInRange(0.1, 0.3);
      const x2 = self.randomInRange(0.7, 0.9);
      const y = Math.random() - 0.2;
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: x1, y } });
      confetti({ ...defaults, particleCount, origin: { x: x2, y } });
    }, 250);
  }

  randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  resetPassword() {
    this.isLoading = true;
    const password = this.changePasswordForm.get('password')?.value;
    const confirmPassword =
      this.changePasswordForm.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      this.isLoading = false;
      return;
    }

    const data = {
      password,
      confirmPassword,
    };

    this.webService.onboardingChangePassword(data).subscribe({
      next: (res: any) => {
        console.log(res);
        this.userService.setDeviceToken(res.deviceToken)
        this.changePasswordForm.reset();
        this.errorMessage = null;
        this.router.navigate(['/hdbsv2/dashboard']);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.error.error;
        this.errorService.setErrorMessage(this.errorMessage);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}