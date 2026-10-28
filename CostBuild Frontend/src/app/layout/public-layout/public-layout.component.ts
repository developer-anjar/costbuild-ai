import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PublicNavbarComponent } from './public-navbar/public-navbar.component';
import { PublicFooterComponent } from './public-footer/public-footer.component';
import { ToastNotificationComponent } from '../../shared/components/toast-notification/toast-notification.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, PublicNavbarComponent, PublicFooterComponent, ToastNotificationComponent],
  template: `
    <div class="public-layout-shell">
      <app-toast-notification />
      <app-public-navbar />
      <main class="public-content">
        <router-outlet />
      </main>
      <app-public-footer />
    </div>
  `,
  styles: [`
    .public-layout-shell {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--main-bg);
    }

    .public-content {
      flex: 1;
    }
  `]
})
export class PublicLayoutComponent {}

