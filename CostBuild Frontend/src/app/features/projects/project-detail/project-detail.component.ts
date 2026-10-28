import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';
import { EstimateService } from '../../../core/services/estimate.service';
import { RateCardService } from '../../../core/services/rate-card.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Project, ProjectStatus } from '../../../core/models/project.model';
import { AppIconComponent } from '../../../shared/components/app-icon/app-icon.component';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, AppIconComponent],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly projectService = inject(ProjectService);
  private readonly estimateService = inject(EstimateService);
  readonly rateCard = inject(RateCardService);
  private readonly notify = inject(NotificationService);

  readonly project = signal<Project | null>(null);
  readonly editedNotes = signal<string>('');
  readonly editedStartDate = signal<string>('');
  readonly editedTargetDate = signal<string>('');

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const found = this.projectService.getById(id);
        if (found) {
          this.project.set(found);
          this.editedNotes.set(found.notes || '');
          this.editedStartDate.set(found.startDate || '');
          this.editedTargetDate.set(found.targetDate || '');
        } else {
          this.notify.error('Project not found.');
          this.router.navigate(['/app/projects']);
        }
      }
    });
  }

  toggleFeature(featureId: string): void {
    const proj = this.project();
    if (!proj) return;
    this.projectService.toggleFeatureCompletion(proj.id, featureId);
    this.project.set(this.projectService.getById(proj.id) || null);
  }

  isFeatureCompleted(featureId: string): boolean {
    const proj = this.project();
    if (!proj || !proj.completedFeatures) return false;
    return proj.completedFeatures.includes(featureId);
  }

  updateStatus(status: ProjectStatus): void {
    const proj = this.project();
    if (!proj) return;
    this.projectService.updateStatus(proj.id, status);
    this.project.set(this.projectService.getById(proj.id) || null);
  }

  saveDetails(): void {
    const proj = this.project();
    if (!proj) return;
    this.projectService.updateProject({
      ...proj,
      notes: this.editedNotes(),
      startDate: this.editedStartDate(),
      targetDate: this.editedTargetDate()
    });
    this.project.set(this.projectService.getById(proj.id) || null);
    this.notify.success('Project details saved.');
  }

  get completionPercentage(): number {
    const proj = this.project();
    if (!proj || !proj.estimate || proj.estimate.features.length === 0) return 0;
    const completed = proj.completedFeatures?.length || 0;
    return Math.round((completed / proj.estimate.features.length) * 100);
  }
}

