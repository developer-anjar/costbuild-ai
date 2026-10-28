import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Scenario } from '../../../core/models/estimate.model';
import { RateCardService } from '../../../core/services/rate-card.service';
import { AppIconComponent } from '../app-icon/app-icon.component';

@Component({
  selector: 'app-scenario-comparison',
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  template: `
    <div class="scenarios-wrapper card">
      <div class="scenarios-header">
        <div>
          <span class="badge badge-lavender">STRATEGIC SCENARIOS</span>
          <h3 class="section-title">Lean MVP vs Startup Standard vs Growth Ready</h3>
          <p class="section-subtitle">Compare feature-driven scope options, effort, budget, and time-to-market</p>
        </div>
      </div>

      <div class="scenarios-grid">
        @for (scenario of scenarios; track scenario.id) {
          <div
            class="scenario-card"
            [class.selected]="selectedScenarioId === scenario.id"
            [class.recommended-border]="scenario.id === 'recommended'"
            (click)="selectScenario(scenario.id)"
          >
            <!-- Badge & Name -->
            <div class="card-top">
              <span class="scenario-badge" [class]="'badge-' + scenario.id">
                {{ scenario.badge }}
              </span>
              @if (selectedScenarioId === scenario.id) {
                <span class="active-check">
                  <app-icon name="check-circle" [size]="16" color="#EA580C" />
                  Active
                </span>
              }
            </div>

            <h4 class="scenario-name">{{ scenario.name }}</h4>
            <p class="scenario-desc">{{ scenario.description }}</p>

            <!-- Key Numbers -->
            <div class="scenario-pricing">
              <div class="pricing-label">BUDGET RANGE</div>
              <div class="price-val">
                {{ rateCard.formatCurrency(scenario.budgetMin, currency) }} &ndash; {{ rateCard.formatCurrency(scenario.budgetMax, currency) }}
              </div>
            </div>

            <div class="scenario-metrics">
              <div class="s-metric">
                <app-icon name="clock" [size]="14" color="#78716C" />
                <span>{{ scenario.timelineWeeks }} Weeks</span>
              </div>
              <div class="s-metric">
                <app-icon name="code" [size]="14" color="#78716C" />
                <span>{{ scenario.totalHours }} Hours</span>
              </div>
              <div class="s-metric">
                <app-icon name="layers" [size]="14" color="#78716C" />
                <span>{{ scenario.includedFeaturesCount }} Features</span>
              </div>
            </div>

            <div class="scope-summary">
              <strong>Scope Summary:</strong> {{ scenario.scopeSummary }}
            </div>

            <div class="tradeoffs-box">
              <span class="tradeoff-heading">Trade-offs & Decisions:</span>
              <ul class="tradeoff-list">
                @for (item of scenario.tradeoffs; track item) {
                  <li>
                    <app-icon name="check" [size]="12" color="#16A34A" />
                    <span>{{ item }}</span>
                  </li>
                }
              </ul>
            </div>

            <button
              type="button"
              class="btn btn-sm w-full mt-auto"
              [class.btn-primary]="selectedScenarioId === scenario.id"
              [class.btn-secondary]="selectedScenarioId !== scenario.id"
            >
              {{ selectedScenarioId === scenario.id ? 'Viewing Scenario' : 'Select ' + scenario.name }}
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .scenarios-wrapper {
      padding: 1.5rem;
      border-radius: var(--radius-lg);
      margin-bottom: 1.5rem;
    }

    .scenarios-header {
      margin-bottom: 1.5rem;
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--primary-text);
      margin: 0.35rem 0 0.15rem 0;
    }

    .section-subtitle {
      font-size: 0.85rem;
      color: var(--secondary-text);
    }

    .scenarios-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
    }

    @media (max-width: 992px) {
      .scenarios-grid {
        grid-template-columns: 1fr;
      }
    }

    .scenario-card {
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 1.35rem;
      background: var(--white);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      position: relative;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .scenario-card:hover {
      border-color: #FED7AA;
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .scenario-card.selected {
      border: 2px solid var(--primary-orange);
      background: #FFFDFB;
      box-shadow: 0 4px 16px rgba(249, 115, 22, 0.12);
    }

    .recommended-border {
      border-color: #DDD6FE;
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .scenario-badge {
      font-size: 0.725rem;
      font-weight: 700;
      padding: 0.2rem 0.55rem;
      border-radius: var(--radius-full);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .badge-mvp { background: #FEF3C7; color: #B45309; }
    .badge-recommended { background: var(--soft-orange); color: var(--deep-orange); }
    .badge-premium { background: var(--lavender); color: var(--lavender-accent); }

    .active-check {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--primary-orange);
    }

    .scenario-name {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--primary-text);
      margin-bottom: 0.35rem;
    }

    .scenario-desc {
      font-size: 0.8rem;
      color: var(--secondary-text);
      line-height: 1.4;
      margin-bottom: 1rem;
      min-height: 2.8em;
    }

    .scenario-pricing {
      background: var(--main-bg);
      border: 1px solid var(--border-light);
      padding: 0.75rem;
      border-radius: var(--radius-md);
      margin-bottom: 1rem;
    }

    .pricing-label {
      font-size: 0.675rem;
      font-weight: 700;
      color: var(--secondary-text);
      letter-spacing: 0.05em;
    }

    .price-val {
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--primary-text);
      margin-top: 0.2rem;
    }

    .scenario-metrics {
      display: flex;
      justify-content: space-between;
      padding-bottom: 0.85rem;
      border-bottom: 1px solid var(--border-light);
      margin-bottom: 0.85rem;
    }

    .s-metric {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.775rem;
      font-weight: 600;
      color: var(--secondary-text);
    }

    .scope-summary {
      font-size: 0.8rem;
      color: var(--primary-text);
      line-height: 1.4;
      margin-bottom: 1rem;
    }

    .tradeoffs-box {
      margin-bottom: 1.25rem;
    }

    .tradeoff-heading {
      display: block;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--secondary-text);
      margin-bottom: 0.4rem;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .tradeoff-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .tradeoff-list li {
      display: flex;
      align-items: flex-start;
      gap: 0.4rem;
      font-size: 0.775rem;
      color: var(--secondary-text);
      line-height: 1.35;
    }

    .w-full {
      width: 100%;
    }

    .mt-auto {
      margin-top: auto;
    }
  `]
})
export class ScenarioComparisonComponent {
  readonly rateCard = inject(RateCardService);

  @Input() scenarios: Scenario[] = [];
  @Input() currency: string = 'INR';
  @Input() selectedScenarioId: string = 'recommended';

  @Output() scenarioSelected = new EventEmitter<string>();

  selectScenario(id: string): void {
    this.selectedScenarioId = id;
    this.scenarioSelected.emit(id);
  }
}
