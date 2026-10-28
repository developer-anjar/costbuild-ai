import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppIconComponent } from '../../shared/components/app-icon/app-icon.component';

@Component({
  selector: 'app-features-page',
  standalone: true,
  imports: [CommonModule, RouterLink, AppIconComponent],
  template: `
    <div class="page-container">
      <!-- Header -->
      <section class="page-hero text-center">
        <span class="badge badge-orange">PLATFORM DEEP DIVE</span>
        <h1 class="page-title">Enterprise Software Estimation Architecture</h1>
        <p class="page-subtitle">
          Explore the algorithmic models, rate-card frameworks, and risk analyses that power CostBuild AI.
        </p>
      </section>

      <!-- Deep Dive Grid -->
      <section class="features-detail-grid">
        <div class="feat-detail-card card">
          <div class="f-icon-box bg-soft-orange">
            <app-icon name="sparkles" [size]="24" color="#EA580C" />
          </div>
          <h3>1. AI Requirement Decomposition</h3>
          <p>
            Transforms abstract high-level concepts into modular capability units. Evaluates data persistence requirements, authentication hierarchies, real-time message brokering, and third-party webhooks.
          </p>
          <ul class="check-list">
            <li><app-icon name="check" [size]="14" color="#16A34A" /> Automated feature dependency mapping</li>
            <li><app-icon name="check" [size]="14" color="#16A34A" /> Edge-case and failure mode detection</li>
            <li><app-icon name="check" [size]="14" color="#16A34A" /> Suggested core vs optional feature classifications</li>
          </ul>
        </div>

        <div class="feat-detail-card card">
          <div class="f-icon-box bg-lavender">
            <app-icon name="calculator" [size]="24" color="#8B7CE8" />
          </div>
          <h3>2. Deterministic Rate-Card Modeling</h3>
          <p>
            Eliminates black-box random estimates. Calculates hours across 7 phases using calibrated labor rates for Freelancers, Small Agencies, Established Studios, and In-house Teams across 6 global regions.
          </p>
          <ul class="check-list">
            <li><app-icon name="check" [size]="14" color="#16A34A" /> Auditable, reconcilable math formulas</li>
            <li><app-icon name="check" [size]="14" color="#16A34A" /> Non-linear complexity weighting</li>
            <li><app-icon name="check" [size]="14" color="#16A34A" /> Built-in multi-currency conversion (INR, USD, EUR, GBP)</li>
          </ul>
        </div>

        <div class="feat-detail-card card">
          <div class="f-icon-box bg-soft-orange">
            <app-icon name="clock" [size]="24" color="#EA580C" />
          </div>
          <h3>3. Concurrency-Aware Timeline Planning</h3>
          <p>
            Unlike primitive calculators that simply sum all phase durations, CostBuild AI accounts for overlapping agile sprints where frontend, backend, and QA execute concurrently.
          </p>
          <ul class="check-list">
            <li><app-icon name="check" [size]="14" color="#16A34A" /> Realistic sprint roadmaps with overlap</li>
            <li><app-icon name="check" [size]="14" color="#16A34A" /> Critical path bottleneck identification</li>
            <li><app-icon name="check" [size]="14" color="#16A34A" /> Urgency buffers for fast-tracked delivery</li>
          </ul>
        </div>

        <div class="feat-detail-card card">
          <div class="f-icon-box bg-lavender">
            <app-icon name="users" [size]="24" color="#8B7CE8" />
          </div>
          <h3>4. Team Composition & Role Sizing</h3>
          <p>
            Recommends exact headcount and involvement weeks for Technical Architects, Frontend Engineers, Backend Developers, UI/UX Designers, QA Automation Engineers, and DevOps leads.
          </p>
          <ul class="check-list">
            <li><app-icon name="check" [size]="14" color="#16A34A" /> Monthly loaded compensation allocations</li>
            <li><app-icon name="check" [size]="14" color="#16A34A" /> Role-specific milestone assignments</li>
            <li><app-icon name="check" [size]="14" color="#16A34A" /> Scalable staffing ramps for growth phases</li>
          </ul>
        </div>

        <div class="feat-detail-card card">
          <div class="f-icon-box bg-soft-orange">
            <app-icon name="sliders" [size]="24" color="#EA580C" />
          </div>
          <h3>5. Three Strategic Scenario Models</h3>
          <p>
            Empowers stakeholders to make tradeoff decisions with three scenarios: Lean MVP (essential launch features), Startup Standard (a practical first release), and Growth Ready (complete planned scope).
          </p>
          <ul class="check-list">
            <li><app-icon name="check" [size]="14" color="#16A34A" /> Direct side-by-side scope comparisons</li>
            <li><app-icon name="check" [size]="14" color="#16A34A" /> Transparent architectural trade-offs</li>
            <li><app-icon name="check" [size]="14" color="#16A34A" /> One-click scenario switching</li>
          </ul>
        </div>

        <div class="feat-detail-card card">
          <div class="f-icon-box bg-lavender">
            <app-icon name="printer" [size]="24" color="#8B7CE8" />
          </div>
          <h3>6. Board-Ready Report Generation</h3>
          <p>
            Generate comprehensive documentation with browser print stylesheets, PDF downloads, and JSON machine-readable specifications ready for engineering teams or investors.
          </p>
          <ul class="check-list">
            <li><app-icon name="check" [size]="14" color="#16A34A" /> Dedicated browser printing and styling</li>
            <li><app-icon name="check" [size]="14" color="#16A34A" /> Export raw project data as JSON</li>
            <li><app-icon name="check" [size]="14" color="#16A34A" /> Direct conversion into execution projects</li>
          </ul>
        </div>
      </section>

      <!-- Bottom CTA Banner -->
      <section class="page-cta-banner card-orange text-center">
        <h2>Start Your Free Estimate Now</h2>
        <p>No credit card required. Experience all features with our 5-step wizard.</p>
        <a routerLink="/app/new-estimate" class="btn btn-primary btn-lg mt-3">
          <app-icon name="calculator" [size]="18" />
          Estimate My Project
        </a>
      </section>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 3.5rem 1.5rem 5rem;
    }

    .page-hero {
      max-width: 720px;
      margin: 0 auto 3.5rem;
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
    }

    .features-detail-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
      margin-bottom: 4rem;
    }

    @media (max-width: 860px) {
      .features-detail-grid {
        grid-template-columns: 1fr;
      }
    }

    .feat-detail-card {
      padding: 2.25rem;
    }

    .f-icon-box {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
    }

    .feat-detail-card h3 {
      font-size: 1.35rem;
      font-weight: 700;
      margin-bottom: 0.65rem;
    }

    .feat-detail-card p {
      font-size: 0.925rem;
      color: var(--secondary-text);
      line-height: 1.6;
      margin-bottom: 1.25rem;
    }

    .check-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .check-list li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: var(--primary-text);
      font-weight: 500;
    }

    .page-cta-banner {
      padding: 3.5rem 2rem;
      border-radius: var(--radius-xl);
    }

    .page-cta-banner h2 {
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
    }

    .page-cta-banner p {
      color: var(--secondary-text);
    }

    .mt-3 {
      margin-top: 1.5rem;
    }
  `]
})
export class FeaturesPageComponent {}
