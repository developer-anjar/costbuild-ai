import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AppIconComponent } from '../../../shared/components/app-icon/app-icon.component';
import { AppLogoComponent } from '../../../shared/components/app-logo/app-logo.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, AppIconComponent, AppLogoComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notify = inject(NotificationService);

  readonly loginForm: FormGroup = this.fb.group({
    email: ['alex.vance@costbuild.ai', [Validators.required, Validators.email]],
    password: ['DemoPass123!', [Validators.required, Validators.minLength(6)]],
    rememberMe: [true]
  });

  readonly showPassword = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);
  readonly showForgotModal = signal<boolean>(false);
  readonly resetEmail = signal<string>('');

  toggleShowPassword(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.notify.warning('Please correct the validation errors in the login form.');
      return;
    }

    this.isLoading.set(true);
    const { email, password, rememberMe } = this.loginForm.value;

    setTimeout(() => {
      this.isLoading.set(false);
      this.auth.login(email, password, rememberMe);
      this.router.navigate(['/app/dashboard']);
    }, 450);
  }

  loginWithDemo(): void {
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      this.auth.loginDemo();
    }, 300);
  }

  sendSimulatedReset(): void {
    if (!this.resetEmail()) {
      this.notify.warning('Please enter your email address for password recovery.');
      return;
    }
    this.notify.info(`Demo notice: Simulated password recovery link sent to ${this.resetEmail()}. No real email is dispatched.`);
    this.showForgotModal.set(false);
    this.resetEmail.set('');
  }
}

