import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AIInsight } from '../../../core/models/estimate.model';
import { AppIconComponent } from '../app-icon/app-icon.component';

@Component({
  selector: 'app-ai-insight-card',
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  template: `
    @if (insights) {
      <div class="ai-card card-lavender">
        <!-- Header -->
        <div class="ai-header">
          <div class="ai-badge-row">
            <span class="ai-pill">
              <app-icon name="sparkles" [size]="14" color="#8B7CE8" />
              AI ARCHITECTURAL INSIGHTS
            </span>
            <span class="disclaimer-tag">Decision-Support Model</span>
          </div>
          <p class="ai-complexity-text">{{ insights.complexityAssessment }}</p>
        </div>

        <!-- 4 Grid Sections -->
        <div class="ai-grid">
          <!-- Cost Drivers -->
          <div class="ai-column">
            <div class="col-header">
              <app-icon name="trending-up" [size]="16" color="#8B7CE8" />
              <h4>Primary Cost Drivers</h4>
            </div>
            <ul class="ai-list">
              @for (driver of insights.costDrivers; track driver) {
                <li>
                  <span class="bullet bullet-purple"></span>
                  <span>{{ driver }}</span>
                </li>
              }
            </ul>
          </div>

          <!-- Architecture & Delivery Risks -->
          <div class="ai-column">
            <div class="col-header">
              <app-icon name="alert-triangle" [size]="16" color="#D97706" />
              <h4>Identified Project Risks</h4>
            </div>
            <ul class="ai-list">
              @for (risk of insights.identifiedRisks; track risk) {
                <li>
                  <span class="bullet bullet-amber"></span>
                  <span>{{ risk }}</span>
                </li>
              }
            </ul>
          </div>

          <!-- Hidden Infrastructure & SaaS Costs -->
          <div class="ai-column">
            <div class="col-header">
              <app-icon name="layers" [size]="16" color="#8B7CE8" />
              <h4>Hidden & Operational Expenses</h4>
            </div>
            <ul class="ai-list">
              @for (hidden of insights.hiddenCosts; track hidden) {
                <li>
                  <span class="bullet bullet-purple"></span>
                  <span>{{ hidden }}</span>
                </li>
              }
            </ul>
          </div>

          <!-- Cost Optimization Opportunities -->
          <div class="ai-column">
            <div class="col-header">
              <app-icon name="zap" [size]="16" color="#16A34A" />
              <h4>Capital Optimization Tips</h4>
            </div>
            <ul class="ai-list">
              @for (tip of insights.costOptimizationSuggestions; track tip) {
                <li>
                  <span class="bullet bullet-green"></span>
                  <span>{{ tip }}</span>
                </li>
              }
            </ul>
          </div>
        </div>

        @if (insights.recommendedMvpScope && insights.recommendedMvpScope.length > 0) {
          <div class="mvp-chips-box">
            <span class="mvp-label">
              <app-icon name="shield-check" [size]="14" color="#8B7CE8" />
              Recommended Fast MVP Core:
            </span>
            <div class="chips-wrap">
              @for (f of insights.recommendedMvpScope; track f) {
                <span class="mvp-chip">{{ f }}</span>
              }
            </div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .ai-card {
      padding: 1.5rem;
      border-radius: var(--radius-lg);
      margin-bottom: 1.5rem;
      position: relative;
    }

    .ai-badge-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .ai-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.775rem;
      font-weight: 800;
      color: var(--lavender-accent);
      background: var(--lavender);
      border: 1px solid var(--lavender-border);
      padding: 0.25rem 0.65rem;
      border-radius: var(--radius-full);
      letter-spacing: 0.04em;
    }

    .disclaimer-tag {
      font-size: 0.725rem;
      color: var(--secondary-text);
      background: rgba(255, 255, 255, 0.7);
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-light);
    }

    .ai-complexity-text {
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--primary-text);
      line-height: 1.5;
      margin-bottom: 1.25rem;
    }

    .ai-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;
    }

    @media (max-width: 768px) {
      .ai-grid {
        grid-template-columns: 1fr;
      }
    }

    .ai-column {
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid var(--lavender-border);
      border-radius: var(--radius-md);
      padding: 1rem 1.15rem;
    }

    .col-header {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      margin-bottom: 0.65rem;
    }

    .col-header h4 {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--primary-text);
      margin: 0;
    }

    .ai-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .ai-list li {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      font-size: 0.825rem;
      color: var(--secondary-text);
      line-height: 1.4;
    }

    .bullet {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-top: 6px;
      flex-shrink: 0;
    }

    .bullet-purple { background: var(--lavender-accent); }
    .bullet-amber { background: var(--warning); }
    .bullet-green { background: var(--success); }

    .mvp-chips-box {
      margin-top: 1.25rem;
      padding-top: 1rem;
      border-top: 1px dashed var(--lavender-border);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .mvp-label {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--primary-text);
    }

    .chips-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .mvp-chip {
      font-size: 0.75rem;
      background: var(--white);
      border: 1px solid var(--lavender-border);
      color: var(--primary-text);
      padding: 0.2rem 0.55rem;
      border-radius: var(--radius-full);
      font-weight: 500;
    }
  `]
})
export class AIInsightCardComponent {
  @Input() insights?: AIInsight;
}

