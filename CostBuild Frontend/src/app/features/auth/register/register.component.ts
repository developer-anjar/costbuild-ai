import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UserRole } from '../../../core/models/project.model';
import { AppIconComponent } from '../../../shared/components/app-icon/app-icon.component';
import { AppLogoComponent } from '../../../shared/components/app-logo/app-logo.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, AppIconComponent, AppLogoComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notify = inject(NotificationService);

  readonly roles: UserRole[] = ['Founder', 'Developer', 'Freelancer', 'Agency', 'Student'];
  readonly showPassword = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);

  readonly registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    role: ['Founder' as UserRole, [Validators.required]],
    organization: [''],
    terms: [false, [Validators.requiredTrue]]
  }, {
    validators: this.passwordMatchValidator
  });

  private passwordMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  toggleShowPassword(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.notify.warning('Please fill all required fields and accept the terms to create your account.');
      return;
    }

    this.isLoading.set(true);
    const { name, email, role, organization } = this.registerForm.value;

    setTimeout(() => {
      this.isLoading.set(false);
      this.auth.register({ name, email, role, organization });
      this.router.navigate(['/app/dashboard']);
    }, 500);
  }
}

