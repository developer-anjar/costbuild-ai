import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppLogoComponent } from '../../../shared/components/app-logo/app-logo.component';
import { AppIconComponent } from '../../../shared/components/app-icon/app-icon.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, AppLogoComponent, AppIconComponent],
  template: `
    <aside class="sidebar-aside" [class.collapsed]="isCollapsed">
      <!-- Sidebar Brand -->
      <div class="sidebar-brand">
        <app-logo [linkTo]="'/app/dashboard'" [size]="'sm'" />
      </div>

      <!-- Main Navigation Items -->
      <nav class="sidebar-nav">
        <div class="nav-section-title" [class.hidden]="isCollapsed">CORE WORKSPACE</div>

        <a routerLink="/app/dashboard" routerLinkActive="active" class="side-link" (click)="navigateItem()">
          <app-icon name="layout-dashboard" [size]="18" />
          <span class="link-label" [class.hidden]="isCollapsed">Overview</span>
        </a>

        <a routerLink="/app/new-estimate" routerLinkActive="active" class="side-link primary-action-link" (click)="navigateItem()">
          <app-icon name="plus" [size]="18" />
          <span class="link-label" [class.hidden]="isCollapsed">New Estimate</span>
        </a>

        <a routerLink="/app/estimates" routerLinkActive="active" class="side-link" (click)="navigateItem()">
          <app-icon name="file-text" [size]="18" />
          <span class="link-label" [class.hidden]="isCollapsed">My Estimates</span>
        </a>

        <a routerLink="/app/projects" routerLinkActive="active" class="side-link" (click)="navigateItem()">
          <app-icon name="folder-kanban" [size]="18" />
          <span class="link-label" [class.hidden]="isCollapsed">Projects</span>
        </a>

        <div class="nav-section-title" [class.hidden]="isCollapsed">CONFIGURATION</div>

        <a routerLink="/app/settings" routerLinkActive="active" class="side-link" (click)="navigateItem()">
          <app-icon name="settings" [size]="18" />
          <span class="link-label" [class.hidden]="isCollapsed">Settings</span>
        </a>

        <a routerLink="/app/profile" routerLinkActive="active" class="side-link" (click)="navigateItem()">
          <app-icon name="user" [size]="18" />
          <span class="link-label" [class.hidden]="isCollapsed">My Profile</span>
        </a>
      </nav>

      <!-- Sidebar Footer / User Profile summary -->
      <div class="sidebar-footer" [class.hidden]="isCollapsed">
        @if (auth.currentUser(); as user) {
          <div class="user-summary">
            <div class="user-avatar">
              {{ user.name.charAt(0) }}
            </div>
            <div class="user-info">
              <span class="u-name">{{ user.name }}</span>
              <span class="u-role">{{ user.role }} &bull; {{ user.organization }}</span>
            </div>
          </div>
        }
      </div>
    </aside>
  `,
  styles: [`
    .sidebar-aside {
      width: 250px;
      background: var(--white);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      height: 100vh;
      position: sticky;
      top: 0;
      transition: width 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 100;
    }

    .sidebar-aside.collapsed {
      width: 72px;
    }

    .sidebar-brand {
      padding: 1.25rem 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border-light);
      display: flex;
      align-items: center;
    }

    .sidebar-nav {
      flex: 1;
      padding: 1.25rem 0.85rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      overflow-y: auto;
    }

    .nav-section-title {
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--muted-text);
      letter-spacing: 0.05em;
      padding: 0.75rem 0.65rem 0.35rem;
    }

    .side-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.65rem 0.75rem;
      border-radius: var(--radius-md);
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--secondary-text);
      transition: all 0.15s ease;
    }

    .side-link:hover {
      background: var(--secondary-bg);
      color: var(--primary-text);
    }

    .side-link.active {
      background: var(--soft-orange);
      color: var(--deep-orange);
      border: 1px solid var(--orange-border);
    }

    .primary-action-link {
      color: var(--primary-orange);
    }

    .primary-action-link:hover {
      background: var(--soft-orange);
    }

    .link-label {
      white-space: nowrap;
    }

    .hidden {
      display: none !important;
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid var(--border-light);
      background: var(--main-bg);
    }

    .user-summary {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }

    .user-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: var(--lavender);
      color: var(--lavender-accent);
      border: 1px solid var(--lavender-border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
      flex-shrink: 0;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .u-name {
      font-size: 0.825rem;
      font-weight: 700;
      color: var(--primary-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .u-role {
      font-size: 0.725rem;
      color: var(--secondary-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `]
})
export class AppSidebarComponent {
  readonly auth = inject(AuthService);

  @Input() isCollapsed: boolean = false;
  @Output() itemClicked = new EventEmitter<void>();

  navigateItem(): void {
    this.itemClicked.emit();
  }
}

