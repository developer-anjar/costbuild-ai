import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppIconComponent } from '../../shared/components/app-icon/app-icon.component';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterLink, AppIconComponent],
  template: `
    <div class="page-container">
      <!-- Hero -->
      <section class="page-hero text-center">
        <span class="badge badge-orange">DEMONSTRATION TIERS</span>
        <h1 class="page-title">Predictable Pricing for High-Stakes Planning</h1>
        <p class="page-subtitle">
          Save tens of thousands in engineering miscalculations. Choose the tier that matches your project volume.
        </p>

        <!-- Billing Cycle Toggle -->
        <div class="billing-toggle">
          <button
            type="button"
            class="toggle-btn"
            [class.active]="billingCycle() === 'monthly'"
            (click)="billingCycle.set('monthly')"
          >Monthly Billing</button>
          <button
            type="button"
            class="toggle-btn"
            [class.active]="billingCycle() === 'annual'"
            (click)="billingCycle.set('annual')"
          >
            Annual Billing
            <span class="save-tag">SAVE 20%</span>
          </button>
        </div>
      </section>

      <!-- Pricing Cards -->
      <div class="pricing-cards-grid">
        <!-- Free Starter -->
        <div class="pricing-card card">
          <div class="p-card-header">
            <h3 class="plan-title">Free Starter</h3>
            <p class="plan-sub">For indie developers & early concepts.</p>
            <div class="plan-price">
              <span class="price-symbol">₹</span>
              <span class="price-val">0</span>
              <span class="price-period">/ month</span>
            </div>
          </div>

          <div class="plan-divider"></div>

          <ul class="features-list">
            <li><app-icon name="check" [size]="15" color="#16A34A" /> 3 Full Estimates / Month</li>
            <li><app-icon name="check" [size]="15" color="#16A34A" /> Basic Rate Card Benchmarks</li>
            <li><app-icon name="check" [size]="15" color="#16A34A" /> MVP Scenario Generation</li>
            <li><app-icon name="check" [size]="15" color="#16A34A" /> Clean Browser Printing</li>
            <li class="muted-feat"><app-icon name="x" [size]="15" color="#A8A29E" /> Advanced AI Risk Insights</li>
            <li class="muted-feat"><app-icon name="x" [size]="15" color="#A8A29E" /> Unlimited Project Tracking</li>
          </ul>

          <a routerLink="/register" class="btn btn-secondary w-full mt-auto">Create Free Account</a>
        </div>

        <!-- Pro Tier (Featured) -->
        <div class="pricing-card card featured-pro">
          <div class="featured-ribbon">RECOMMENDED FOR FOUNDERS</div>
          <div class="p-card-header">
            <h3 class="plan-title">Professional</h3>
            <p class="plan-sub">For startups, consultants, and founders.</p>
            <div class="plan-price">
              <span class="price-symbol">₹</span>
              <span class="price-val text-orange">
                {{ billingCycle() === 'annual' ? '1,999' : '2,499' }}
              </span>
              <span class="price-period">/ month</span>
            </div>
          </div>

          <div class="plan-divider"></div>

          <ul class="features-list">
            <li><app-icon name="check" [size]="15" color="#16A34A" /> Unlimited Saved Estimates</li>
            <li><app-icon name="check" [size]="15" color="#16A34A" /> AI Architecture & Risk Engine</li>
            <li><app-icon name="check" [size]="15" color="#16A34A" /> 3 Interactive Scenarios (MVP/Rec/Ent)</li>
            <li><app-icon name="check" [size]="15" color="#16A34A" /> High-Resolution PDF & JSON Exports</li>
            <li><app-icon name="check" [size]="15" color="#16A34A" /> Tracked Projects & Milestone Checklists</li>
            <li><app-icon name="check" [size]="15" color="#16A34A" /> Team Role & Hourly Compensation Breakdown</li>
          </ul>

          <a routerLink="/app/new-estimate" class="btn btn-primary w-full mt-auto">
            Start Professional Demo
          </a>
        </div>

        <!-- Agency & Team -->
        <div class="pricing-card card">
          <div class="p-card-header">
            <h3 class="plan-title">Agency & Studio</h3>
            <p class="plan-sub">For digital agencies and software shops.</p>
            <div class="plan-price">
              <span class="price-symbol">₹</span>
              <span class="price-val">
                {{ billingCycle() === 'annual' ? '6,499' : '7,999' }}
              </span>
              <span class="price-period">/ month</span>
            </div>
          </div>

          <div class="plan-divider"></div>

          <ul class="features-list">
            <li><app-icon name="check" [size]="15" color="#16A34A" /> Unlimited Workspace Seats</li>
            <li><app-icon name="check" [size]="15" color="#16A34A" /> Custom Agency Rate Cards</li>
            <li><app-icon name="check" [size]="15" color="#16A34A" /> White-Label Client Proposals</li>
            <li><app-icon name="check" [size]="15" color="#16A34A" /> API Access to Benchmark Engine</li>
            <li><app-icon name="check" [size]="15" color="#16A34A" /> Priority Architectural Review</li>
          </ul>

          <a routerLink="/register" class="btn btn-secondary w-full mt-auto">Contact Studio Sales</a>
        </div>
      </div>

      <!-- Feature Comparison Matrix -->
      <section class="comparison-section card">
        <h3 class="comp-title">Feature Comparison Matrix</h3>
        <div class="comp-table">
          <div class="comp-row comp-head">
            <span>Capability</span>
            <span>Free Starter</span>
            <span class="text-orange">Professional</span>
            <span>Agency & Studio</span>
          </div>

          <div class="comp-row">
            <span>Monthly Estimates</span>
            <span>3</span>
            <span class="font-bold">Unlimited</span>
            <span class="font-bold">Unlimited</span>
          </div>
          <div class="comp-row">
            <span>Deterministic Math Engine</span>
            <span><app-icon name="check" [size]="16" color="#16A34A" /></span>
            <span><app-icon name="check" [size]="16" color="#16A34A" /></span>
            <span><app-icon name="check" [size]="16" color="#16A34A" /></span>
          </div>
          <div class="comp-row">
            <span>AI Architecture Insights & Hidden Costs</span>
            <span>Limited</span>
            <span><app-icon name="check" [size]="16" color="#16A34A" /></span>
            <span><app-icon name="check" [size]="16" color="#16A34A" /></span>
          </div>
          <div class="comp-row">
            <span>Interactive MVP Scenarios</span>
            <span>1 Scenario</span>
            <span class="font-bold">3 Scenarios</span>
            <span class="font-bold">3 Scenarios</span>
          </div>
          <div class="comp-row">
            <span>PDF & JSON Machine Exports</span>
            <span>Browser Print</span>
            <span><app-icon name="check" [size]="16" color="#16A34A" /></span>
            <span><app-icon name="check" [size]="16" color="#16A34A" /></span>
          </div>
          <div class="comp-row">
            <span>Execution Project Tracking</span>
            <span>1 Project</span>
            <span class="font-bold">Unlimited</span>
            <span class="font-bold">Unlimited</span>
          </div>
        </div>
      </section>

      <!-- Note -->
      <div class="disclaimer-bottom text-center">
        <p>Notice: This pricing page is a demonstration. No real financial payments or charges occur on CostBuild AI.</p>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 3.5rem 1.5rem 5rem;
    }

    .page-hero {
      margin-bottom: 3.5rem;
    }

    .page-title {
      font-size: 2.75rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      margin: 0.75rem 0 0.85rem;
      line-height: 1.15;
    }

    .page-subtitle {
      font-size: 1.1rem;
      color: var(--secondary-text);
      line-height: 1.6;
      max-width: 600px;
      margin: 0 auto 2rem;
    }

    .billing-toggle {
      display: inline-flex;
      background: var(--white);
      border: 1px solid var(--border);
      padding: 0.35rem;
      border-radius: var(--radius-full);
      box-shadow: var(--shadow-sm);
    }

    .toggle-btn {
      padding: 0.5rem 1.25rem;
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--secondary-text);
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .toggle-btn.active {
      background: var(--primary-orange);
      color: var(--white);
      box-shadow: 0 2px 6px rgba(249, 115, 22, 0.25);
    }

    .save-tag {
      font-size: 0.65rem;
      background: var(--soft-orange);
      color: var(--deep-orange);
      padding: 0.15rem 0.4rem;
      border-radius: var(--radius-full);
    }

    .pricing-cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      margin-bottom: 4rem;
    }

    @media (max-width: 900px) {
      .pricing-cards-grid {
        grid-template-columns: 1fr;
      }
    }

    .pricing-card {
      padding: 2.5rem 2rem;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .featured-pro {
      border: 2px solid var(--primary-orange);
      box-shadow: 0 14px 30px -4px rgba(249, 115, 22, 0.16);
      transform: scale(1.03);
    }

    @media (max-width: 900px) {
      .featured-pro {
        transform: none;
      }
    }

    .featured-ribbon {
      position: absolute;
      top: -13px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--primary-orange);
      color: var(--white);
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-full);
    }

    .plan-title {
      font-size: 1.35rem;
      font-weight: 800;
      margin-bottom: 0.35rem;
    }

    .plan-sub {
      font-size: 0.85rem;
      color: var(--secondary-text);
      margin-bottom: 1.25rem;
    }

    .plan-price {
      display: flex;
      align-items: baseline;
      gap: 0.2rem;
    }

    .price-symbol {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--primary-text);
    }

    .price-val {
      font-size: 2.5rem;
      font-weight: 900;
      line-height: 1;
      letter-spacing: -0.03em;
    }

    .price-period {
      font-size: 0.85rem;
      color: var(--secondary-text);
      font-weight: 500;
    }

    .plan-divider {
      height: 1px;
      background: var(--border-light);
      margin: 1.5rem 0;
    }

    .features-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      margin-bottom: 2rem;
    }

    .features-list li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: var(--primary-text);
      font-weight: 500;
    }

    .muted-feat {
      color: var(--muted-text) !important;
    }

    .comparison-section {
      padding: 2.5rem;
      margin-bottom: 3rem;
    }

    .comp-title {
      font-size: 1.5rem;
      font-weight: 800;
      margin-bottom: 1.5rem;
    }

    .comp-table {
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      overflow-x: auto;
    }

    .comp-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      padding: 0.85rem 1.25rem;
      border-bottom: 1px solid var(--border-light);
      align-items: center;
      font-size: 0.875rem;
      min-width: 600px;
    }

    .comp-head {
      background: #FAFAF9;
      font-weight: 700;
      font-size: 0.8rem;
      color: var(--secondary-text);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .font-bold {
      font-weight: 700;
    }

    .disclaimer-bottom {
      font-size: 0.8rem;
      color: var(--muted-text);
    }

    .w-full {
      width: 100%;
    }

    .mt-auto {
      margin-top: auto;
    }
  `]
})
export class PricingComponent {
  readonly billingCycle = signal<'monthly' | 'annual'>('monthly');
}

