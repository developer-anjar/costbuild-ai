import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { ApplicationLayoutComponent } from './layout/application-layout/application-layout.component';

export const routes: Routes = [
  // Public Routes Shell
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/landing/landing.component').then(m => m.LandingComponent),
        title: 'CostBuild AI — Know Your Software Cost Before You Build'
      },
      {
        path: 'features',
        loadComponent: () =>
          import('./features/features-page/features-page.component').then(m => m.FeaturesPageComponent),
        title: 'Platform Architecture & Features — CostBuild AI'
      },
      {
        path: 'how-it-works',
        loadComponent: () =>
          import('./features/how-it-works/how-it-works.component').then(m => m.HowItWorksComponent),
        title: 'How It Works & Estimation Methodology — CostBuild AI'
      },
      {
        path: 'pricing',
        loadComponent: () =>
          import('./features/pricing/pricing.component').then(m => m.PricingComponent),
        title: 'Pricing & Demonstration Tiers — CostBuild AI'
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(m => m.LoginComponent),
        title: 'Sign In — CostBuild AI'
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then(m => m.RegisterComponent),
        title: 'Create Account — CostBuild AI'
      }
    ]
  },

  // Authenticated Application Shell
  {
    path: 'app',
    component: ApplicationLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard — CostBuild AI'
      },
      {
        path: 'new-estimate',
        loadComponent: () =>
          import('./features/estimate-wizard/estimate-wizard.component').then(m => m.EstimateWizardComponent),
        title: 'New Estimation Wizard — CostBuild AI'
      },
      {
        path: 'estimates',
        loadComponent: () =>
          import('./features/estimates/estimate-list/estimate-list.component').then(m => m.EstimateListComponent),
        title: 'My Estimates — CostBuild AI'
      },
      {
        path: 'estimates/:id',
        loadComponent: () =>
          import('./features/estimate-report/estimate-report.component').then(m => m.EstimateReportComponent),
        title: 'Estimation Report — CostBuild AI'
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/projects/project-list/project-list.component').then(m => m.ProjectListComponent),
        title: 'Tracked Projects — CostBuild AI'
      },
      {
        path: 'projects/:id',
        loadComponent: () =>
          import('./features/projects/project-detail/project-detail.component').then(m => m.ProjectDetailComponent),
        title: 'Project Workspace — CostBuild AI'
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then(m => m.SettingsComponent),
        title: 'Workspace Settings — CostBuild AI'
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile.component').then(m => m.ProfileComponent),
        title: 'User Profile — CostBuild AI'
      }
    ]
  },

  // Fallback Wildcard
  {
    path: '**',
    redirectTo: ''
  }
];
