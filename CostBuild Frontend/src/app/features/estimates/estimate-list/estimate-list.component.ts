import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EstimateService } from '../../../core/services/estimate.service';
import { ProjectService } from '../../../core/services/project.service';
import { RateCardService } from '../../../core/services/rate-card.service';
import { Estimate } from '../../../core/models/estimate.model';
import { AppIconComponent } from '../../../shared/components/app-icon/app-icon.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-estimate-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    AppIconComponent,
    ConfirmationDialogComponent,
    EmptyStateComponent
  ],
  templateUrl: './estimate-list.component.html',
  styleUrl: './estimate-list.component.scss'
})
export class EstimateListComponent {
  readonly estimateService = inject(EstimateService);
  private readonly projectService = inject(ProjectService);
  readonly rateCard = inject(RateCardService);
  readonly router = inject(Router);

  // Filters & State
  readonly searchQuery = signal<string>('');
  readonly categoryFilter = signal<string>('all');
  readonly budgetFilter = signal<string>('all'); // all | under_10l | 10l_to_30l | over_30l
  readonly sortBy = signal<'date' | 'budget' | 'name'>('date');
  readonly sortDirection = signal<'asc' | 'desc'>('desc');
  readonly viewMode = signal<'grid' | 'list'>('grid');

  // Confirmation modal
  readonly isConfirmOpen = signal<boolean>(false);
  readonly estimateToDelete = signal<Estimate | null>(null);

  readonly filteredEstimates = computed(() => {
    let list = [...this.estimateService.estimates()];
    const query = this.searchQuery().toLowerCase().trim();
    const cat = this.categoryFilter();
    const bud = this.budgetFilter();

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

    if (bud === 'under_10l') {
      list = list.filter(e => e.totalBudget < 1000000);
    } else if (bud === '10l_to_30l') {
      list = list.filter(e => e.totalBudget >= 1000000 && e.totalBudget <= 3000000);
    } else if (bud === 'over_30l') {
      list = list.filter(e => e.totalBudget > 3000000);
    }

    const sort = this.sortBy();
    const asc = this.sortDirection() === 'asc';

    list.sort((a, b) => {
      if (sort === 'name') {
        return asc ? a.projectName.localeCompare(b.projectName) : b.projectName.localeCompare(a.projectName);
      }
      if (sort === 'budget') {
        return asc ? a.totalBudget - b.totalBudget : b.totalBudget - a.totalBudget;
      }
      return asc
        ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return list;
  });

  openEstimate(id: string): void {
    this.router.navigate(['/app/estimates', id]);
  }

  duplicateEstimate(id: string): void {
    this.estimateService.duplicateEstimate(id);
  }

  editEstimate(estimate: Estimate): void {
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

  trackAsProject(estimate: Estimate): void {
    const proj = this.projectService.createFromEstimate(estimate);
    this.router.navigate(['/app/projects', proj.id]);
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
}
