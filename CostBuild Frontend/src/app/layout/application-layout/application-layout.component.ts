import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppSidebarComponent } from './app-sidebar/app-sidebar.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { ToastNotificationComponent } from '../../shared/components/toast-notification/toast-notification.component';

@Component({
  selector: 'app-application-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AppSidebarComponent, AppHeaderComponent, ToastNotificationComponent],
  template: `
    <div class="app-shell">
      <app-toast-notification />

      <!-- Fixed / Collapsible Sidebar -->
      <app-sidebar [isCollapsed]="isSidebarCollapsed()" (itemClicked)="onSidebarItemClick()" />

      <!-- Main Panel -->
      <div class="app-main-panel">
        <app-header (toggleSidebar)="toggleSidebar()" />

        <!-- Router View Container -->
        <main class="app-main-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      min-height: 100vh;
      background: var(--main-bg);
      position: relative;
    }

    .app-main-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      background: var(--main-bg);
    }

    .app-main-content {
      flex: 1;
      padding: 1.75rem 2rem 3rem;
      max-width: 1400px;
      width: 100%;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      .app-main-content {
        padding: 1.25rem 1rem 2.5rem;
      }
    }
  `]
})
export class ApplicationLayoutComponent {
  readonly isSidebarCollapsed = signal<boolean>(false);

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(v => !v);
  }

  onSidebarItemClick(): void {
    if (window.innerWidth < 768) {
      this.isSidebarCollapsed.set(true);
    }
  }
}

