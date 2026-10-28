import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/project.model';
import { AppIconComponent } from '../../shared/components/app-icon/app-icon.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, AppIconComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  readonly auth = inject(AuthService);

  readonly name = signal<string>('');
  readonly email = signal<string>('');
  readonly role = signal<UserRole>('Founder');
  readonly organization = signal<string>('');

  readonly roles: UserRole[] = ['Founder', 'Developer', 'Freelancer', 'Agency', 'Student'];

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (user) {
      this.name.set(user.name);
      this.email.set(user.email);
      this.role.set(user.role);
      this.organization.set(user.organization || '');
    }
  }

  saveProfile(): void {
    this.auth.updateProfile({
      name: this.name(),
      email: this.email(),
      role: this.role(),
      organization: this.organization()
    });
  }

  logout(): void {
    this.auth.logout();
  }
}

