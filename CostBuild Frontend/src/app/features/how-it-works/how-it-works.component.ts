import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppIconComponent } from '../../shared/components/app-icon/app-icon.component';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule, RouterLink, AppIconComponent],
  template: `
    <div class="page-container">
      <!-- Header -->
      <section class="page-hero text-center">
        <span class="badge badge-lavender">ESTIMATION METHODOLOGY</span>
        <h1 class="page-title">How CostBuild AI Calculates Software Cost</h1>
        <p class="page-subtitle">
          A transparent, auditable breakdown of our 5-step estimation process, rate formulas, and sprint calculations.
        </p>
      </section>

      <!-- Step by Step Detailed Walkthrough -->
      <div class="steps-flow">
        <!-- Step 1 -->
        <div class="step-flow-item card">
          <div class="step-num-bubble">01</div>
          <div class="step-flow-content">
            <span class="step-phase-tag">STEP 1</span>
            <h3>Project Overview & Industry Classification</h3>
            <p>
              You select your software category (SaaS, Mobile, Marketplace, AI Application) and describe your objective. The system applies category-specific baseline architectural multipliers (for example, Marketplace applications incorporate dual seller/buyer authentication flows which naturally carry an initial 1.25x complexity index).
            </p>
            <div class="info-pill-row">
              <span class="info-pill">Category Complexity Matrix</span>
              <span class="info-pill">Objective Calibration</span>
            </div>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="step-flow-item card">
          <div class="step-num-bubble">02</div>
          <div class="step-flow-content">
            <span class="step-phase-tag">STEP 2</span>
            <h3>Requirements & Feature Complexity Sizing</h3>
            <p>
              Features are sized into standardized engineering effort units:
            </p>
            <div class="hours-breakdown-box">
              <div class="h-unit">
                <span class="h-tag badge-neutral">Simple (8–20 hours)</span>
                <p>Standard CRUD views, static pages, contact forms, profile fields.</p>
              </div>
              <div class="h-unit">
                <span class="h-tag badge-orange">Medium (20–50 hours)</span>
                <p>Payment webhooks, filtering queries, notification queues, dashboard charts.</p>
              </div>
              <div class="h-unit">
                <span class="h-tag badge-lavender">Complex (50–120 hours)</span>
                <p>Real-time WebSockets, algorithmic search, AI LLM pipelines, escrow payouts.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="step-flow-item card">
          <div class="step-num-bubble">03</div>
          <div class="step-flow-content">
            <span class="step-phase-tag">STEP 3</span>
            <h3>Technical Stack & Infrastructure Sizing</h3>
            <p>
              Platform choice (Web, iOS/Android, Multi-platform) and cloud architecture add deterministic coefficients. AI integration levels (basic prompt completion vs RAG vector indexing vs custom ML pipelines) add necessary engineering time and monthly infrastructure budget allowances.
            </p>
            <div class="info-pill-row">
              <span class="info-pill">Multi-Platform Scaling (1.65x)</span>
              <span class="info-pill">RAG / LLM Orchestration Buffer (+95h)</span>
            </div>
          </div>
        </div>

        <!-- Step 4 -->
        <div class="step-flow-item card">
          <div class="step-num-bubble">04</div>
          <div class="step-flow-content">
            <span class="step-phase-tag">STEP 4</span>
            <h3>Project Parameters & Regional Rate Cards</h3>
            <p>
              Select your delivery timeline (Flexible, Standard, Urgent), quality expectations, and hiring model (Freelancer, Small Agency, Established Studio, In-House). The rate card service computes blended hourly rates based on prevailing regional developer compensation indexes.
            </p>
          </div>
        </div>

        <!-- Step 5 -->
        <div class="step-flow-item card">
          <div class="step-num-bubble">05</div>
          <div class="step-flow-content">
            <span class="step-phase-tag">STEP 5</span>
            <h3>Synthesis, Phase Allocation & Contingency Buffering</h3>
            <p>
              The engine apportions the total hours across the complete 7-phase lifecycle: Discovery (8%), UI/UX Design (14%), Frontend (28%), Backend (28%), Integrations (10%), Testing & QA (8%), and Cloud Deployment (4%). A standard 15% contingency reserve is automatically added to safeguard against scope expansion.
            </p>
          </div>
        </div>
      </div>

      <!-- Bottom CTA Banner -->
      <section class="page-cta-banner card-lavender text-center">
        <h2>Experience the 5-Step Engine in Action</h2>
        <p>Build your first complete software estimation report right now.</p>
        <a routerLink="/app/new-estimate" class="btn btn-primary btn-lg mt-3">
          <app-icon name="calculator" [size]="18" />
          Launch Estimation Wizard
        </a>
      </section>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 960px;
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
      max-width: 680px;
      margin: 0 auto;
    }

    .steps-flow {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
      margin-bottom: 4rem;
    }

    .step-flow-item {
      padding: 2rem 2.25rem;
      display: flex;
      gap: 1.75rem;
      align-items: flex-start;
    }

    @media (max-width: 640px) {
      .step-flow-item {
        flex-direction: column;
        gap: 1rem;
      }
    }

    .step-num-bubble {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      background: var(--soft-orange);
      border: 1px solid var(--orange-border);
      color: var(--deep-orange);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .step-flow-content {
      flex: 1;
    }

    .step-phase-tag {
      font-size: 0.725rem;
      font-weight: 800;
      color: var(--primary-orange);
      letter-spacing: 0.05em;
    }

    .step-flow-content h3 {
      font-size: 1.35rem;
      font-weight: 700;
      margin: 0.25rem 0 0.5rem;
    }

    .step-flow-content p {
      font-size: 0.925rem;
      color: var(--secondary-text);
      line-height: 1.6;
    }

    .info-pill-row {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }

    .info-pill {
      font-size: 0.775rem;
      font-weight: 600;
      background: var(--main-bg);
      border: 1px solid var(--border);
      padding: 0.25rem 0.65rem;
      border-radius: var(--radius-full);
      color: var(--primary-text);
    }

    .hours-breakdown-box {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-top: 1.25rem;
    }

    @media (max-width: 768px) {
      .hours-breakdown-box {
        grid-template-columns: 1fr;
      }
    }

    .h-unit {
      background: var(--main-bg);
      border: 1px solid var(--border-light);
      padding: 1rem;
      border-radius: var(--radius-md);
    }

    .h-unit p {
      font-size: 0.8rem;
      margin-top: 0.4rem;
      line-height: 1.4;
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
export class HowItWorksComponent {}

