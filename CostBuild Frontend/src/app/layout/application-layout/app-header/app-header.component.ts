import { Component, EventEmitter, Input, Output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppIconComponent } from '../../../shared/components/app-icon/app-icon.component';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, AppIconComponent],
  template: `
    <header class="app-top-header">
      <div class="header-left">
        <button class="toggle-btn" (click)="toggleSidebar.emit()" aria-label="Toggle sidebar navigation">
          <app-icon name="menu" [size]="20" />
        </button>

        <div class="breadcrumb-trail">
          <span class="system-tag">CostBuild AI</span>
          <span class="sep">/</span>
          <span class="current-module">{{ currentTitle }}</span>
        </div>
      </div>

      <div class="header-right">
        <!-- New Estimate primary CTA -->
        <a routerLink="/app/new-estimate" class="btn btn-primary btn-sm">
          <app-icon name="plus" [size]="15" />
          <span>New Estimate</span>
        </a>

        <!-- Notification Bell -->
        <div class="header-icon-action" (click)="showRecentNotification()" title="System Alerts">
          <app-icon name="info" [size]="18" color="#78716C" />
          <span class="notif-dot"></span>
        </div>

        <!-- User Profile Dropdown Trigger -->
        <div class="profile-menu-container">
          <button class="profile-btn" (click)="toggleProfileMenu()">
            <div class="avatar-circle">
              {{ auth.currentUser()?.name?.charAt(0) || 'U' }}
            </div>
            <span class="user-display-name">{{ auth.currentUser()?.name || 'User' }}</span>
            <app-icon name="chevron-down" [size]="14" />
          </button>

          <!-- Dropdown Popup -->
          @if (isProfileMenuOpen()) {
            <div class="profile-dropdown-menu" (click)="$event.stopPropagation()">
              <div class="dropdown-user-header">
                <span class="full-name">{{ auth.currentUser()?.name }}</span>
                <span class="email">{{ auth.currentUser()?.email }}</span>
                <span class="badge badge-lavender mt-1">{{ auth.currentUser()?.role }}</span>
              </div>

              <div class="dropdown-divider"></div>

              <a routerLink="/app/profile" (click)="closeProfileMenu()" class="dropdown-item">
                <app-icon name="user" [size]="16" />
                Profile Details
              </a>

              <a routerLink="/app/settings" (click)="closeProfileMenu()" class="dropdown-item">
                <app-icon name="settings" [size]="16" />
                Workspace Settings
              </a>

              <div class="dropdown-divider"></div>

              <button type="button" (click)="logout()" class="dropdown-item logout-item">
                <app-icon name="log-out" [size]="16" color="#DC2626" />
                Sign Out
              </button>
            </div>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    .app-top-header {
      height: 64px;
      background: var(--white);
      border-bottom: 1px solid var(--border);
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 90;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .toggle-btn {
      padding: 0.4rem;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text);
      transition: background 0.15s ease;
    }

    .toggle-btn:hover {
      background: var(--secondary-bg);
      color: var(--primary-text);
    }

    .breadcrumb-trail {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
    }

    .system-tag {
      color: var(--secondary-text);
      font-weight: 500;
    }

    .sep {
      color: var(--muted-text);
    }

    .current-module {
      font-weight: 700;
      color: var(--primary-text);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .header-icon-action {
      position: relative;
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .header-icon-action:hover {
      background: var(--secondary-bg);
    }

    .notif-dot {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--primary-orange);
    }

    .profile-menu-container {
      position: relative;
    }

    .profile-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.5rem;
      border-radius: var(--radius-md);
      transition: background 0.15s ease;
    }

    .profile-btn:hover {
      background: var(--secondary-bg);
    }

    .avatar-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--soft-orange);
      color: var(--deep-orange);
      border: 1px solid var(--orange-border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
    }

    .user-display-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--primary-text);
    }

    @media (max-width: 640px) {
      .user-display-name {
        display: none;
      }
    }

    .profile-dropdown-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      width: 230px;
      background: var(--white);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      padding: 0.65rem;
      animation: fadeIn 0.15s ease;
      z-index: 1000;
    }

    .dropdown-user-header {
      padding: 0.5rem 0.65rem;
      display: flex;
      flex-direction: column;
    }

    .full-name {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--primary-text);
    }

    .email {
      font-size: 0.75rem;
      color: var(--secondary-text);
    }

    .dropdown-divider {
      height: 1px;
      background: var(--border-light);
      margin: 0.4rem 0;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.55rem 0.65rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--secondary-text);
      border-radius: var(--radius-sm);
      transition: all 0.15s ease;
      width: 100%;
      text-align: left;
    }

    .dropdown-item:hover {
      background: var(--secondary-bg);
      color: var(--primary-text);
    }

    .logout-item {
      color: var(--error);
    }

    .logout-item:hover {
      background: var(--error-bg);
      color: var(--error);
    }

    .mt-1 {
      margin-top: 0.35rem;
      align-self: flex-start;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class AppHeaderComponent {
  readonly auth = inject(AuthService);
  private readonly notify = inject(NotificationService);

  @Input() currentTitle: string = 'Dashboard';
  @Output() toggleSidebar = new EventEmitter<void>();

  readonly isProfileMenuOpen = signal<boolean>(false);

  toggleProfileMenu(): void {
    this.isProfileMenuOpen.update(v => !v);
  }

  closeProfileMenu(): void {
    this.isProfileMenuOpen.set(false);
  }

  showRecentNotification(): void {
    this.notify.info('Engine benchmark calibrated. 5 sample enterprise rate cards active.');
  }

  logout(): void {
    this.closeProfileMenu();
    this.auth.logout();
  }
}

