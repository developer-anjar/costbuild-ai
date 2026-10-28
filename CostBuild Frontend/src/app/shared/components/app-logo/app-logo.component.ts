import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a [routerLink]="linkTo" class="app-logo flex items-center gap-2.5 group">
      <div class="logo-mark" [class.logo-mark-lg]="size === 'lg'">
        <svg viewBox="0 0 32 32" fill="none" class="w-full h-full">
          <!-- Outer squircle -->
          <rect width="32" height="32" rx="9" fill="url(#logo-grad)" />
          <!-- Inner architect grid & cost spark -->
          <path d="M8 22V10L16 6L24 10V22L16 26L8 22Z" stroke="#FFFFFF" stroke-width="2" stroke-linejoin="round" />
          <path d="M16 6V26" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="2 2" stroke-opacity="0.8" />
          <path d="M8 10L24 22" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.6" />
          <path d="M24 10L8 22" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.6" />
          <circle cx="16" cy="16" r="3" fill="#FFFFFF" />
          <defs>
            <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stop-color="#F97316" />
              <stop offset="1" stop-color="#EA580C" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div class="logo-text">
        <span class="brand-name">CostBuild</span>
        <span class="brand-ai">AI</span>
        @if (showTagline) {
          <span class="brand-tagline">Know Your Software Cost Before You Build</span>
        }
      </div>
    </a>
  `,
  styles: [`
    .app-logo {
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
      text-decoration: none;
      cursor: pointer;
    }

    .logo-mark {
      width: 34px;
      height: 34px;
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(249, 115, 22, 0.28);
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .logo-mark-lg {
      width: 44px;
      height: 44px;
      border-radius: 12px;
    }

    .app-logo:hover .logo-mark {
      transform: scale(1.05);
    }

    .logo-text {
      display: flex;
      align-items: baseline;
      gap: 0.25rem;
      line-height: 1;
    }

    .brand-name {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--primary-text);
      letter-spacing: -0.03em;
    }

    .brand-ai {
      font-size: 0.8rem;
      font-weight: 800;
      padding: 0.15rem 0.4rem;
      border-radius: 5px;
      background: var(--lavender);
      color: var(--lavender-accent);
      border: 1px solid var(--lavender-border);
      letter-spacing: 0.05em;
    }

    .brand-tagline {
      display: block;
      font-size: 0.7rem;
      color: var(--secondary-text);
      margin-top: 0.15rem;
    }
  `]
})
export class AppLogoComponent {
  @Input() linkTo: string = '/';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showTagline: boolean = false;
}

