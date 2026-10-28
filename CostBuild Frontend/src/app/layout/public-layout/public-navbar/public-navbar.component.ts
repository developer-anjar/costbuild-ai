import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppLogoComponent } from '../../../shared/components/app-logo/app-logo.component';
import { AppIconComponent } from '../../../shared/components/app-icon/app-icon.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, AppLogoComponent, AppIconComponent],
  template: `
    <header class="navbar-sticky">
      <div class="nav-container">
        <!-- Logo -->
        <app-logo [linkTo]="'/'" />

        <!-- Desktop Navigation Links -->
        <nav class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="nav-item">Overview</a>
          <a routerLink="/features" routerLinkActive="active" class="nav-item">Features</a>
          <a routerLink="/how-it-works" routerLinkActive="active" class="nav-item">How It Works</a>
          <a routerLink="/pricing" routerLinkActive="active" class="nav-item">Pricing</a>
        </nav>

        <!-- Right Action CTAs -->
        <div class="nav-actions">
          @if (auth.isAuthenticated()) {
            <a routerLink="/app/dashboard" class="btn btn-secondary btn-sm">
              <app-icon name="layout-dashboard" [size]="16" />
              Go to Workspace
            </a>
          } @else {
            <a routerLink="/login" class="btn btn-ghost btn-sm">Sign In</a>
            <button type="button" (click)="auth.loginDemo()" class="btn btn-lavender btn-sm">
              <app-icon name="sparkles" [size]="14" />
              Demo Login
            </button>
          }
          <a routerLink="/app/new-estimate" class="btn btn-primary btn-sm">
            <app-icon name="calculator" [size]="15" />
            Estimate Your Project
          </a>

          <!-- Mobile Hamburger Toggle -->
          <button class="mobile-toggle" (click)="toggleMobileMenu()" aria-label="Toggle navigation menu">
            <app-icon [name]="isMobileMenuOpen() ? 'x' : 'menu'" [size]="22" />
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      @if (isMobileMenuOpen()) {
        <div class="mobile-menu-drawer">
          <a routerLink="/" (click)="closeMenu()" class="mobile-link">Overview</a>
          <a routerLink="/features" (click)="closeMenu()" class="mobile-link">Features</a>
          <a routerLink="/how-it-works" (click)="closeMenu()" class="mobile-link">How It Works</a>
          <a routerLink="/pricing" (click)="closeMenu()" class="mobile-link">Pricing</a>

          <div class="mobile-divider"></div>

          @if (auth.isAuthenticated()) {
            <a routerLink="/app/dashboard" (click)="closeMenu()" class="btn btn-secondary w-full">
              Go to Workspace
            </a>
          } @else {
            <a routerLink="/login" (click)="closeMenu()" class="btn btn-secondary w-full">Sign In</a>
            <button type="button" (click)="auth.loginDemo(); closeMenu()" class="btn btn-lavender w-full">
              Demo Login
            </button>
          }

          <a routerLink="/app/new-estimate" (click)="closeMenu()" class="btn btn-primary w-full">
            Estimate Your Project
          </a>
        </div>
      }
    </header>
  `,
  styles: [`
    .navbar-sticky {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: rgba(255, 252, 250, 0.92);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      transition: all 0.2s ease;
    }

    .nav-container {
      max-width: 1240px;
      margin: 0 auto;
      padding: 0.85rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    @media (max-width: 880px) {
      .nav-links {
        display: none;
      }
    }

    .nav-item {
      font-size: 0.925rem;
      font-weight: 600;
      color: var(--secondary-text);
      transition: color 0.15s ease;
      position: relative;
    }

    .nav-item:hover, .nav-item.active {
      color: var(--primary-orange);
    }

    .nav-item.active::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--primary-orange);
      border-radius: 2px;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .mobile-toggle {
      display: none;
      padding: 0.4rem;
      border-radius: var(--radius-sm);
      color: var(--primary-text);
    }

    @media (max-width: 880px) {
      .mobile-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .mobile-menu-drawer {
      padding: 1.25rem 1.5rem 1.75rem;
      background: var(--white);
      border-bottom: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      animation: slideDown 0.2s ease;
    }

    .mobile-link {
      font-size: 1rem;
      font-weight: 600;
      color: var(--primary-text);
      padding: 0.4rem 0;
    }

    .mobile-divider {
      height: 1px;
      background: var(--border);
      margin: 0.5rem 0;
    }

    .w-full {
      width: 100%;
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class PublicNavbarComponent {
  readonly auth = inject(AuthService);
  readonly isMobileMenuOpen = signal<boolean>(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}

