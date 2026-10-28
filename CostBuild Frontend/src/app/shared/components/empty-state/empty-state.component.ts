import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppIconComponent } from '../app-icon/app-icon.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  template: `
    <div class="empty-state-wrap">
      <div class="empty-icon-box">
        <app-icon [name]="icon" [size]="28" color="#EA580C" />
      </div>
      <h3 class="empty-title">{{ title }}</h3>
      <p class="empty-description">{{ description }}</p>
      @if (actionText) {
        <button type="button" class="btn btn-primary btn-sm" (click)="actionClicked.emit()">
          <app-icon name="plus" [size]="16" />
          {{ actionText }}
        </button>
      }
    </div>
  `,
  styles: [`
    .empty-state-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 3rem 1.5rem;
      border: 1px dashed var(--border);
      border-radius: var(--radius-lg);
      background: var(--white);
    }

    .empty-icon-box {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-md);
      background: var(--soft-orange);
      border: 1px solid var(--orange-border);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
    }

    .empty-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--primary-text);
      margin-bottom: 0.35rem;
    }

    .empty-description {
      font-size: 0.875rem;
      color: var(--secondary-text);
      max-width: 380px;
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon: string = 'file-text';
  @Input() title: string = 'No records found';
  @Input() description: string = 'Get started by creating your first software estimate with our five-step AI engine.';
  @Input() actionText?: string = 'Create First Estimate';
  @Output() actionClicked = new EventEmitter<void>();
}

