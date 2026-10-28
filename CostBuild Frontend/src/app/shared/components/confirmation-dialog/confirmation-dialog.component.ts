import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppIconComponent } from '../app-icon/app-icon.component';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  template: `
    @if (isOpen) {
      <div class="dialog-overlay" (click)="onCancel()">
        <div class="dialog-card" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
          <div class="dialog-header">
            <div class="icon-wrap" [class.danger]="isDanger">
              <app-icon [name]="isDanger ? 'alert-triangle' : 'info'" [size]="22" [color]="isDanger ? '#DC2626' : '#F97316'" />
            </div>
            <div>
              <h3 class="dialog-title">{{ title }}</h3>
              <p class="dialog-message">{{ message }}</p>
            </div>
          </div>

          <div class="dialog-actions">
            <button type="button" class="btn btn-secondary btn-sm" (click)="onCancel()">
              {{ cancelText }}
            </button>
            <button
              type="button"
              class="btn btn-sm"
              [class.btn-danger]="isDanger"
              [class.btn-primary]="!isDanger"
              (click)="onConfirm()"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(41, 37, 36, 0.45);
      backdrop-filter: blur(4px);
      z-index: 9998;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      animation: fadeIn 0.15s ease-out;
    }

    .dialog-card {
      background: var(--white);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      max-width: 440px;
      width: 100%;
      box-shadow: var(--shadow-lg);
      animation: popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .dialog-header {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .icon-wrap {
      width: 42px;
      height: 42px;
      border-radius: var(--radius-md);
      background: var(--soft-orange);
      border: 1px solid var(--orange-border);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .icon-wrap.danger {
      background: var(--error-bg);
      border-color: var(--error-border);
    }

    .dialog-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--primary-text);
      margin-bottom: 0.35rem;
    }

    .dialog-message {
      font-size: 0.875rem;
      color: var(--secondary-text);
      line-height: 1.45;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes popIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `]
})
export class ConfirmationDialogComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = 'Confirm Action';
  @Input() message: string = 'Are you sure you want to proceed with this action?';
  @Input() confirmText: string = 'Confirm';
  @Input() cancelText: string = 'Cancel';
  @Input() isDanger: boolean = false;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}

