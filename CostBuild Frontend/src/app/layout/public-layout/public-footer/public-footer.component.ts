import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppLogoComponent } from '../../../shared/components/app-logo/app-logo.component';
import { AppIconComponent } from '../../../shared/components/app-icon/app-icon.component';

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, AppLogoComponent, AppIconComponent],
  template: `
    <footer class="public-footer">
      <div class="footer-top">
        <div class="footer-brand-col">
          <app-logo size="md" [showTagline]="true" />
          <p class="brand-desc">
            CostBuild AI empowers founders, product architects, and engineering agencies to calculate realistic software budgets, timelines, and team structures before writing a single line of code.
          </p>
          <div class="disclaimer-callout">
            <app-icon name="info" [size]="15" color="#EA580C" />
            <span>Estimates generated are illustrative decision-support projections, not guaranteed fixed-bid contract quotes.</span>
          </div>
        </div>

        <div class="footer-links-grid">
          <div class="links-column">
            <h4 class="col-title">Platform</h4>
            <a routerLink="/features">AI Requirement Analysis</a>
            <a routerLink="/features">Deterministic Rate Cards</a>
            <a routerLink="/how-it-works">5-Step Wizard</a>
            <a routerLink="/pricing">Pricing & Tiers</a>
            <a routerLink="/app/new-estimate">Project Cost Calculator</a>
          </div>

          <div class="links-column">
            <h4 class="col-title">Product</h4>
            <a routerLink="/app/dashboard">Demo Workspace</a>
            <a routerLink="/app/estimates">Estimation Library</a>
            <a routerLink="/app/projects">Tracked Projects</a>
            <a routerLink="/how-it-works">Methodology & Formulas</a>
          </div>

          <div class="links-column">
            <h4 class="col-title">Account & Demo</h4>
            <a routerLink="/login">Sign In</a>
            <a routerLink="/register">Create Account</a>
            <a routerLink="/app/settings">System Preferences</a>
            <a routerLink="/app/profile">Profile Management</a>
          </div>

          <div class="links-column">
            <h4 class="col-title">Legal & Notice</h4>
            <a href="javascript:void(0)" (click)="showDemoNotice('Privacy Policy')">Privacy Policy (Demo)</a>
            <a href="javascript:void(0)" (click)="showDemoNotice('Terms of Service')">Terms of Service (Demo)</a>
            <a href="javascript:void(0)" (click)="showDemoNotice('Cookie Settings')">Cookie Preferences</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-copy">
          &copy; {{ currentYear }} CostBuild AI. All rights reserved. Crafted for founders and development teams.
        </div>
        <div class="footer-meta">
          <span class="status-indicator"></span>
          <span>Engine v2.5 Online &bull; Deterministic Benchmark Database</span>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .public-footer {
      background: var(--white);
      border-top: 1px solid var(--border);
      padding: 4.5rem 1.5rem 2.5rem;
    }

    .footer-top {
      max-width: 1240px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 360px 1fr;
      gap: 3.5rem;
      margin-bottom: 3.5rem;
    }

    @media (max-width: 960px) {
      .footer-top {
        grid-template-columns: 1fr;
        gap: 2.5rem;
      }
    }

    .brand-desc {
      font-size: 0.875rem;
      color: var(--secondary-text);
      line-height: 1.6;
      margin: 1rem 0 1.25rem;
    }

    .disclaimer-callout {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      background: var(--soft-orange);
      border: 1px solid var(--orange-border);
      border-radius: var(--radius-md);
      padding: 0.75rem 0.85rem;
      font-size: 0.775rem;
      color: var(--deep-orange);
      line-height: 1.4;
    }

    .footer-links-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }

    @media (max-width: 768px) {
      .footer-links-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
      }
    }

    .col-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--primary-text);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1.15rem;
    }

    .links-column {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .links-column a {
      font-size: 0.85rem;
      color: var(--secondary-text);
      transition: color 0.15s ease;
    }

    .links-column a:hover {
      color: var(--primary-orange);
    }

    .footer-bottom {
      max-width: 1240px;
      margin: 0 auto;
      padding-top: 2rem;
      border-top: 1px solid var(--border-light);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .footer-copy {
      font-size: 0.825rem;
      color: var(--secondary-text);
    }

    .footer-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: var(--secondary-text);
    }

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--success);
      box-shadow: 0 0 0 2px var(--success-border);
    }
  `]
})
export class PublicFooterComponent {
  readonly currentYear = new Date().getFullYear();

  showDemoNotice(doc: string): void {
    alert(`${doc} Demonstration Notice:\n\nThis application is a demonstration product for CostBuild AI. No personal data or live billing contracts are collected.`);
  }
}

