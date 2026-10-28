import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppIconComponent } from '../app-icon/app-icon.component';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  template: `
    <div class="metric-card card">
      <div class="metric-header">
        <span class="metric-label">{{ label }}</span>
        <div class="metric-icon" [class]="'icon-' + (iconBg || 'orange')">
          <app-icon [name]="icon" [size]="18" [color]="getIconColor()" />
        </div>
      </div>

      <div class="metric-value-wrap">
        <h3 class="metric-value">{{ value }}</h3>
      </div>

      <div class="metric-footer">
        @if (trend) {
          <span class="trend-badge" [class.trend-positive]="trend.positive" [class.trend-negative]="!trend.positive">
            <app-icon [name]="trend.positive ? 'trending-up' : 'trending-down'" [size]="13" />
            {{ trend.value }}
          </span>
        }
        @if (badge) {
          <span class="badge badge-lavender">{{ badge }}</span>
        }
        @if (subtext) {
          <span class="metric-subtext">{{ subtext }}</span>
        }
      </div>
    </div>
  `,
  styles: [`
    .metric-card {
      padding: 1.25rem 1.35rem;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 120px;
    }

    .metric-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.65rem;
    }

    .metric-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--secondary-text);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .metric-icon {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon-orange {
      background: var(--soft-orange);
      border: 1px solid var(--orange-border);
    }

    .icon-lavender {
      background: var(--lavender);
      border: 1px solid var(--lavender-border);
    }

    .icon-green {
      background: var(--success-bg);
      border: 1px solid var(--success-border);
    }

    .icon-neutral {
      background: #F5F5F4;
      border: 1px solid var(--border);
    }

    .metric-value {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--primary-text);
      letter-spacing: -0.03em;
      line-height: 1.1;
    }

    .metric-footer {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.65rem;
      flex-wrap: wrap;
    }

    .trend-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.15rem 0.45rem;
      border-radius: var(--radius-full);
    }

    .trend-positive {
      background: var(--success-bg);
      color: var(--success);
      border: 1px solid var(--success-border);
    }

    .trend-negative {
      background: var(--warning-bg);
      color: var(--warning);
      border: 1px solid var(--warning-border);
    }

    .metric-subtext {
      font-size: 0.775rem;
      color: var(--secondary-text);
    }
  `]
})
export class MetricCardComponent {
  @Input() label: string = '';
  @Input() value: string = '';
  @Input() subtext?: string;
  @Input() icon: string = 'calculator';
  @Input() iconBg: 'orange' | 'lavender' | 'green' | 'neutral' = 'orange';
  @Input() trend?: { value: string; positive: boolean };
  @Input() badge?: string;

  getIconColor(): string {
    switch (this.iconBg) {
      case 'orange': return '#EA580C';
      case 'lavender': return '#8B7CE8';
      case 'green': return '#16A34A';
      default: return '#78716C';
    }
  }
}

