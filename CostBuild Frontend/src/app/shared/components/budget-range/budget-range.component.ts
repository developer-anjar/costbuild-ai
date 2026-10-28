import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RateCardService } from '../../../core/services/rate-card.service';

@Component({
  selector: 'app-budget-range',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="budget-range-card card">
      <div class="range-header">
        <div>
          <span class="range-subtitle">ESTIMATED BUDGET SPREAD</span>
          <h2 class="range-target">{{ rateCard.formatCurrency(recommended, currency) }}</h2>
          <span class="range-target-label">Recommended Baseline (±15% variance model)</span>
        </div>
        <div class="confidence-badge">
          <span class="confidence-val">{{ confidenceScore }}%</span>
          <span class="confidence-txt">Confidence Indicator</span>
        </div>
      </div>

      <!-- Visual Progress Slider Track -->
      <div class="range-track-container">
        <div class="range-track">
          <div class="track-fill"></div>
          <div class="pin pin-min" style="left: 10%;">
            <div class="pin-dot"></div>
            <div class="pin-label">
              <span class="label-name">Minimum</span>
              <span class="label-val">{{ rateCard.formatCurrency(min, currency) }}</span>
            </div>
          </div>
          <div class="pin pin-mid" style="left: 55%;">
            <div class="pin-dot active"></div>
            <div class="pin-label">
              <span class="label-name active">Target</span>
              <span class="label-val active">{{ rateCard.formatCurrency(recommended, currency) }}</span>
            </div>
          </div>
          <div class="pin pin-max" style="left: 90%;">
            <div class="pin-dot"></div>
            <div class="pin-label">
              <span class="label-name">Premium</span>
              <span class="label-val">{{ rateCard.formatCurrency(max, currency) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="range-footer">
        <span class="footer-note">
          Based on sprint velocity, regional rate card, and non-linear complexity weighting.
        </span>
      </div>
    </div>
  `,
  styles: [`
    .budget-range-card {
      padding: 1.5rem;
      border-radius: var(--radius-lg);
      margin-bottom: 1.5rem;
    }

    .range-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .range-subtitle {
      font-size: 0.775rem;
      font-weight: 700;
      color: var(--secondary-text);
      letter-spacing: 0.05em;
    }

    .range-target {
      font-size: 2.25rem;
      font-weight: 800;
      color: var(--primary-orange);
      line-height: 1.1;
      margin: 0.2rem 0;
      letter-spacing: -0.03em;
    }

    .range-target-label {
      font-size: 0.8rem;
      color: var(--secondary-text);
    }

    .confidence-badge {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      background: var(--soft-orange);
      border: 1px solid var(--orange-border);
      padding: 0.5rem 0.85rem;
      border-radius: var(--radius-md);
    }

    .confidence-val {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--deep-orange);
      line-height: 1;
    }

    .confidence-txt {
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--deep-orange);
    }

    .range-track-container {
      padding: 1rem 1rem 3rem 1rem;
    }

    .range-track {
      position: relative;
      height: 8px;
      background: #E7E5E4;
      border-radius: 9999px;
    }

    .track-fill {
      position: absolute;
      left: 10%;
      right: 10%;
      top: 0;
      bottom: 0;
      background: linear-gradient(90deg, #FED7AA 0%, #F97316 50%, #8B7CE8 100%);
      border-radius: 9999px;
    }

    .pin {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .pin-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--white);
      border: 3px solid #A8A29E;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }

    .pin-dot.active {
      width: 18px;
      height: 18px;
      border-color: var(--primary-orange);
      background: var(--white);
      box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.2);
    }

    .pin-label {
      position: absolute;
      top: 20px;
      white-space: nowrap;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .label-name {
      font-size: 0.725rem;
      color: var(--secondary-text);
      font-weight: 600;
    }

    .label-name.active {
      color: var(--primary-orange);
      font-weight: 700;
    }

    .label-val {
      font-size: 0.825rem;
      font-weight: 700;
      color: var(--primary-text);
    }

    .label-val.active {
      font-size: 0.95rem;
      color: var(--deep-orange);
      font-weight: 800;
    }

    .range-footer {
      border-top: 1px solid var(--border-light);
      padding-top: 0.75rem;
      margin-top: 0.5rem;
    }

    .footer-note {
      font-size: 0.75rem;
      color: var(--muted-text);
    }
  `]
})
export class BudgetRangeComponent {
  readonly rateCard = inject(RateCardService);

  @Input() min: number = 0;
  @Input() recommended: number = 0;
  @Input() max: number = 0;
  @Input() currency: string = 'INR';
  @Input() confidenceScore: number = 85;
}

