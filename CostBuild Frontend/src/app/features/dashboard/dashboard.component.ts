import { Component, computed, signal, inject, AfterViewInit, ViewChild, ElementRef, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { EstimateService } from '../../core/services/estimate.service';
import { ProjectService } from '../../core/services/project.service';
import { AuthService } from '../../core/services/auth.service';
import { RateCardService } from '../../core/services/rate-card.service';
import { NotificationService } from '../../core/services/notification.service';
import { Estimate } from '../../core/models/estimate.model';
import { MetricCardComponent } from '../../shared/components/metric-card/metric-card.component';
import { AppIconComponent } from '../../shared/components/app-icon/app-icon.component';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MetricCardComponent,
    AppIconComponent,
    ConfirmationDialogComponent,
    EmptyStateComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  readonly estimateService = inject(EstimateService);
  readonly projectService = inject(ProjectService);
  readonly auth = inject(AuthService);
  readonly rateCard = inject(RateCardService);
  readonly router = inject(Router);
  private readonly notify = inject(NotificationService);

  @ViewChild('budgetChartCanvas') budgetChartCanvas?: ElementRef<HTMLCanvasElement>;
  private chartInstance: Chart | null = null;

  // Search & Filter state
  readonly searchQuery = signal<string>('');
  readonly categoryFilter = signal<string>('all');
  readonly sortBy = signal<'name' | 'budget' | 'date'>('date');
  readonly sortOrder = signal<'asc' | 'desc'>('desc');

  // Confirmation dialog state
  readonly isConfirmOpen = signal<boolean>(false);
  readonly estimateToDelete = signal<Estimate | null>(null);

  // Computed metrics from real stored records
  readonly totalEstimates = computed(() => this.estimateService.estimates().length);
  readonly totalProjects = computed(() => this.projectService.projects().length);

  readonly averageBudget = computed(() => {
    const list = this.estimateService.estimates();
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, e) => acc + e.totalBudget, 0);
    return Math.round(sum / list.length);
  });

  readonly greeting = computed(() => {
    const hour = new Date().getHours();
    const name = this.auth.currentUser()?.name?.split(' ')[0] || 'Builder';
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 17) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  });

  readonly filteredEstimates = computed(() => {
    let list = [...this.estimateService.estimates()];
    const query = this.searchQuery().toLowerCase().trim();
    const cat = this.categoryFilter();

    if (query) {
      list = list.filter(e =>
        e.projectName.toLowerCase().includes(query) ||
        e.category.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query)
      );
    }

    if (cat !== 'all') {
      list = list.filter(e => e.category === cat);
    }

    // Sort
    const sort = this.sortBy();
    const asc = this.sortOrder() === 'asc';

    list.sort((a, b) => {
      if (sort === 'name') {
        return asc ? a.projectName.localeCompare(b.projectName) : b.projectName.localeCompare(a.projectName);
      }
      if (sort === 'budget') {
        return asc ? a.totalBudget - b.totalBudget : b.totalBudget - a.totalBudget;
      }
      // date
      return asc
        ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return list;
  });

  constructor() {
    // Re-render chart when estimates change
    effect(() => {
      const estimates = this.estimateService.estimates();
      if (this.budgetChartCanvas && estimates) {
        this.renderChart();
      }
    });
  }

  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }

  renderChart(): void {
    if (!this.budgetChartCanvas) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }

    const estimates = this.estimateService.estimates().slice(0, 6);
    if (estimates.length === 0) return;

    const labels = estimates.map(e => e.projectName.length > 18 ? e.projectName.substring(0, 16) + '...' : e.projectName);
    const data = estimates.map(e => e.totalBudget);

    this.chartInstance = new Chart(this.budgetChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Estimated Budget (INR)',
          data,
          backgroundColor: '#F97316',
          hoverBackgroundColor: '#EA580C',
          borderRadius: 6,
          barPercentage: 0.6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const val = context.raw as number;
                return ` Budget: ${this.rateCard.formatCurrency(val, 'INR')}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (val) => {
                const num = Number(val);
                if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
                return `₹${num}`;
              }
            },
            grid: { color: '#F5F5F4' }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

  viewEstimate(id: string): void {
    this.router.navigate(['/app/estimates', id]);
  }

  editEstimate(estimate: Estimate): void {
    // Load into wizard draft and navigate to wizard
    this.estimateService.saveDraft({
      id: estimate.id,
      step: 1,
      overview: {
        projectName: estimate.projectName,
        category: estimate.category,
        description: estimate.description,
        targetAudience: estimate.targetAudience,
        industry: estimate.industry,
        objective: estimate.objective
      },
      features: estimate.features,
      techStack: estimate.techStack,
      parameters: { ...estimate.parameters, targetBudget: estimate.targetBudget },
      currency: estimate.currency
    });
    this.router.navigate(['/app/new-estimate']);
  }

  duplicateEstimate(id: string): void {
    this.estimateService.duplicateEstimate(id);
  }

  promptDelete(estimate: Estimate): void {
    this.estimateToDelete.set(estimate);
    this.isConfirmOpen.set(true);
  }

  confirmDelete(): void {
    const target = this.estimateToDelete();
    if (target) {
      this.estimateService.deleteEstimate(target.id);
    }
    this.isConfirmOpen.set(false);
    this.estimateToDelete.set(null);
  }

  cancelDelete(): void {
    this.isConfirmOpen.set(false);
    this.estimateToDelete.set(null);
  }

  trackAsProject(estimate: Estimate): void {
    const proj = this.projectService.createFromEstimate(estimate);
    this.router.navigate(['/app/projects', proj.id]);
  }
}
