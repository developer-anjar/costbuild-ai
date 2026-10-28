import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { AppIconComponent } from '../app-icon/app-icon.component';

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  template: `
    <div class="toast-viewport" aria-live="polite">
      @for (toast of notify.toasts(); track toast.id) {
        <div class="toast-card" [class]="'toast-' + toast.type">
          <div class="toast-icon">
            @switch (toast.type) {
              @case ('success') {
                <app-icon name="check-circle" [size]="18" color="#16A34A" />
              }
              @case ('error') {
                <app-icon name="alert-triangle" [size]="18" color="#DC2626" />
              }
              @case ('warning') {
                <app-icon name="alert-triangle" [size]="18" color="#D97706" />
              }
              @default {
                <app-icon name="info" [size]="18" color="#8B7CE8" />
              }
            }
          </div>

          <div class="toast-content">
            @if (toast.title) {
              <div class="toast-title">{{ toast.title }}</div>
            }
            <div class="toast-message">{{ toast.message }}</div>
          </div>

          <button class="toast-close" (click)="notify.dismiss(toast.id)" aria-label="Dismiss notification">
            <app-icon name="x" [size]="14" color="#A8A29E" />
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-viewport {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 400px;
      width: calc(100vw - 3rem);
      pointer-events: none;
    }

    .toast-card {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.85rem 1rem;
      border-radius: var(--radius-md);
      background: var(--white);
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border);
      animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .toast-success {
      border-left: 4px solid var(--success);
    }

    .toast-error {
      border-left: 4px solid var(--error);
    }

    .toast-warning {
      border-left: 4px solid var(--warning);
    }

    .toast-info {
      border-left: 4px solid var(--lavender-accent);
    }

    .toast-icon {
      margin-top: 0.15rem;
      flex-shrink: 0;
    }

    .toast-content {
      flex: 1;
      min-width: 0;
    }

    .toast-title {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--primary-text);
      line-height: 1.25;
      margin-bottom: 0.2rem;
    }

    .toast-message {
      font-size: 0.825rem;
      color: var(--secondary-text);
      line-height: 1.4;
    }

    .toast-close {
      flex-shrink: 0;
      padding: 0.25rem;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s ease;
    }

    .toast-close:hover {
      background: #F5F5F4;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-12px) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  `]
})
export class ToastNotificationComponent {
  readonly notify = inject(NotificationService);
}

