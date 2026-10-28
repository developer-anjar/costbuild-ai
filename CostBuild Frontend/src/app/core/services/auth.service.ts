import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserRole } from '../models/project.model';
import { LocalStorageService } from './local-storage.service';
import { NotificationService } from './notification.service';

const AUTH_USER_KEY = 'costbuild_auth_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storage = inject(LocalStorageService);
  private readonly router = inject(Router);
  private readonly notify = inject(NotificationService);

  private readonly defaultDemoUser: User = {
    id: 'user_alex_vance',
    name: 'Alex Vance',
    email: 'alex.vance@costbuild.ai',
    role: 'Founder',
    organization: 'Vance Innovations',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString()
  };

  private readonly _currentUser = signal<User | null>(
    this.storage.getItem<User | null>(AUTH_USER_KEY, this.defaultDemoUser)
  );

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = signal<boolean>(!!this._currentUser());

  login(email: string, _password: string, rememberMe: boolean = true): boolean {
    const user: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      role: 'Founder',
      organization: 'Startup Studio',
      createdAt: new Date().toISOString()
    };

    this._currentUser.set(user);
    this.isAuthenticated.set(true);

    if (rememberMe) {
      this.storage.setItem(AUTH_USER_KEY, user);
    }

    this.notify.success(`Welcome back, ${user.name}!`);
    return true;
  }

  loginDemo(): void {
    this._currentUser.set(this.defaultDemoUser);
    this.isAuthenticated.set(true);
    this.storage.setItem(AUTH_USER_KEY, this.defaultDemoUser);
    this.notify.success('Signed in with Demo Account (Alex Vance)');
    this.router.navigate(['/app/dashboard']);
  }

  register(data: { name: string; email: string; role: UserRole; organization?: string }): boolean {
    const user: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: data.name,
      email: data.email,
      role: data.role,
      organization: data.organization || 'My Company',
      createdAt: new Date().toISOString()
    };

    this._currentUser.set(user);
    this.isAuthenticated.set(true);
    this.storage.setItem(AUTH_USER_KEY, user);
    this.notify.success(`Account registered successfully. Welcome, ${user.name}!`);
    return true;
  }

  updateProfile(updates: Partial<User>): void {
    const current = this._currentUser();
    if (!current) return;
    const updated = { ...current, ...updates };
    this._currentUser.set(updated);
    this.storage.setItem(AUTH_USER_KEY, updated);
    this.notify.success('Profile details saved successfully.');
  }

  logout(): void {
    this._currentUser.set(null);
    this.isAuthenticated.set(false);
    this.storage.removeItem(AUTH_USER_KEY);
    this.notify.info('You have been signed out.');
    this.router.navigate(['/login']);
  }
}

