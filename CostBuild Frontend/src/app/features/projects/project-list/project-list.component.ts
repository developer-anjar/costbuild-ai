import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';
import { RateCardService } from '../../../core/services/rate-card.service';
import { Project, ProjectStatus } from '../../../core/models/project.model';
import { AppIconComponent } from '../../../shared/components/app-icon/app-icon.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    AppIconComponent,
    ConfirmationDialogComponent,
    EmptyStateComponent
  ],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent {
  readonly projectService = inject(ProjectService);
  readonly rateCard = inject(RateCardService);
  readonly router = inject(Router);

  readonly searchQuery = signal<string>('');
  readonly statusFilter = signal<string>('all');
  readonly isConfirmOpen = signal<boolean>(false);
  readonly projectToDelete = signal<Project | null>(null);

  readonly filteredProjects = computed(() => {
    let list = [...this.projectService.projects()];
    const q = this.searchQuery().toLowerCase().trim();
    const st = this.statusFilter();

    if (q) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (st !== 'all') {
      list = list.filter(p => p.status === st);
    }

    return list;
  });

  openProject(id: string): void {
    this.router.navigate(['/app/projects', id]);
  }

  updateProjectStatus(projectId: string, newStatus: ProjectStatus, event: Event): void {
    event.stopPropagation();
    this.projectService.updateStatus(projectId, newStatus);
  }

  promptDelete(project: Project, event: Event): void {
    event.stopPropagation();
    this.projectToDelete.set(project);
    this.isConfirmOpen.set(true);
  }

  confirmDelete(): void {
    const target = this.projectToDelete();
    if (target) {
      this.projectService.deleteProject(target.id);
    }
    this.isConfirmOpen.set(false);
    this.projectToDelete.set(null);
  }

  cancelDelete(): void {
    this.isConfirmOpen.set(false);
    this.projectToDelete.set(null);
  }

  getStatusBadgeClass(status: ProjectStatus): string {
    switch (status) {
      case 'in_progress': return 'badge-orange';
      case 'completed': return 'badge-success';
      case 'planning': return 'badge-lavender';
      case 'on_hold': return 'badge-warning';
      default: return 'badge-neutral';
    }
  }

  formatStatus(status: ProjectStatus): string {
    return status.replace(/_/g, ' ').toUpperCase();
  }
}

