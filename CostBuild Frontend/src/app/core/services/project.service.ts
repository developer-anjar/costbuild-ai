import { Injectable, signal, inject } from '@angular/core';
import { Project, ProjectStatus } from '../models/project.model';
import { Estimate } from '../models/estimate.model';
import { LocalStorageService } from './local-storage.service';
import { NotificationService } from './notification.service';
import { EstimateService } from './estimate.service';
import { BackendApiService } from './backend-api.service';

const PROJECTS_STORAGE_KEY = 'costbuild_projects_v1';
const DEMO_PROJECTS_REVISION_KEY = 'costbuild_demo_projects_revision';
const DEMO_PROJECTS_REVISION = 3;
const BACKEND_DEMO_PROJECTS_REVISION_KEY = 'costbuild_backend_demo_projects_revision';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly storage = inject(LocalStorageService);
  private readonly notify = inject(NotificationService);
  private readonly estimateService = inject(EstimateService);
  private readonly api = inject(BackendApiService);

  private readonly _projects = signal<Project[]>([]);
  readonly projects = this._projects.asReadonly();

  private readonly _activeProject = signal<Project | null>(null);
  readonly activeProject = this._activeProject.asReadonly();

  constructor() {
    this.initProjects();
  }

  private initProjects(): void {
    const stored = this.storage.getItem<Project[] | null>(PROJECTS_STORAGE_KEY, null);
    const demoProjects: Project[] = [
      {
        id: 'proj_fd_1',
        estimateId: 'est_food_delivery',
        name: 'Local Restaurant Ordering Pilot',
        description: 'First release of online ordering for a small group of neighbourhood restaurants.',
        category: 'Mobile Application',
        status: 'in_progress',
        budget: this.estimateService.getById('est_food_delivery')?.totalBudget ?? 100000,
        timelineWeeks: this.estimateService.getById('est_food_delivery')?.timelineWeeks ?? 12,
        startDate: '2026-09-01',
        targetDate: '2026-12-08',
        completedFeatures: ['fd_2', 'fd_5', 'fd_8'],
        notes: 'Menu setup and checkout are in review. The team is testing order notifications with restaurant staff.',
        createdAt: '2026-09-01T10:00:00.000Z',
        updatedAt: '2026-10-25T14:30:00.000Z'
      },
      {
        id: 'proj_lms_2',
        estimateId: 'est_ai_lms',
        name: 'Coaching Institute Course Portal',
        description: 'Course enrolment and progress tracking for a regional coaching institute.',
        category: 'SaaS Platform',
        status: 'planning',
        budget: this.estimateService.getById('est_ai_lms')?.totalBudget ?? 70000,
        timelineWeeks: this.estimateService.getById('est_ai_lms')?.timelineWeeks ?? 10,
        startDate: '2026-11-02',
        targetDate: '2027-01-25',
        completedFeatures: ['lms_2'],
        notes: 'The course structure and student progress workflow have been agreed with instructors.',
        createdAt: '2026-10-12T09:00:00.000Z',
        updatedAt: '2026-10-27T16:00:00.000Z'
      }
    ];

    if (stored && Array.isArray(stored) && stored.length > 0) {
      const demoRevision = this.storage.getItem<number>(DEMO_PROJECTS_REVISION_KEY, 0);
      const demoProjectIds = new Set(demoProjects.map(project => project.id));
      const hasDemoProjects = stored.some(project => demoProjectIds.has(project.id));

      if (demoRevision < DEMO_PROJECTS_REVISION && hasDemoProjects) {
        const demoProjectsById = new Map(demoProjects.map(project => [project.id, project]));
        const updated = stored.map(project => demoProjectsById.get(project.id) ?? project);
        this._projects.set(updated);
        this.storage.setItem(PROJECTS_STORAGE_KEY, updated);
      } else {
        this._projects.set(stored);
      }
      this.storage.setItem(DEMO_PROJECTS_REVISION_KEY, DEMO_PROJECTS_REVISION);
    } else {
      // Seed with initial demo projects
      this._projects.set(demoProjects);
      this.storage.setItem(PROJECTS_STORAGE_KEY, demoProjects);
      this.storage.setItem(DEMO_PROJECTS_REVISION_KEY, DEMO_PROJECTS_REVISION);
    }
    this.syncWithBackend();
  }

  private syncWithBackend(): void {
    this.api.list<Project>('projects').subscribe({
      next: (remote) => {
        if (remote.length > 0) {
          const backendRevision = this.storage.getItem<number>(BACKEND_DEMO_PROJECTS_REVISION_KEY, 0);
          const demoProjectIds = new Set(this._projects().map(project => project.id));
          if (backendRevision < DEMO_PROJECTS_REVISION && remote.some(project => demoProjectIds.has(project.id))) {
            const seeds = new Map(this._projects().map(project => [project.id, project]));
            const updated = remote.map(project => {
              const seed = seeds.get(project.id);
              return seed
                ? {
                    ...seed,
                    status: project.status,
                    completedFeatures: project.completedFeatures,
                    notes: project.notes,
                    createdAt: project.createdAt,
                    updatedAt: project.updatedAt
                  }
                : project;
            });
            this._projects.set(updated);
            this.storage.setItem(PROJECTS_STORAGE_KEY, updated);
            this.api.saveAll('projects', updated).subscribe({
              next: () => this.storage.setItem(BACKEND_DEMO_PROJECTS_REVISION_KEY, DEMO_PROJECTS_REVISION),
              error: (error: unknown) => this.reportBackendError(error)
            });
            return;
          }
          this._projects.set(remote);
          this.storage.setItem(PROJECTS_STORAGE_KEY, remote);
          return;
        }
        this.api.saveAll('projects', this._projects()).subscribe({
          next: () => this.storage.setItem(BACKEND_DEMO_PROJECTS_REVISION_KEY, DEMO_PROJECTS_REVISION),
          error: (error: unknown) => this.reportBackendError(error)
        });
      },
      error: (error: unknown) => this.reportBackendError(error)
    });
  }

  private reportBackendError(error: unknown): void {
    console.error('Project backend request failed:', error);
    this.notify.error('Could not sync projects with the backend. Local data is still available.');
  }

  getAll(): Project[] {
    return this._projects();
  }

  getById(id: string): Project | undefined {
    const proj = this._projects().find(p => p.id === id);
    if (proj && !proj.estimate) {
      proj.estimate = this.estimateService.getById(proj.estimateId);
    }
    return proj;
  }

  createFromEstimate(estimate: Estimate, initialStatus: ProjectStatus = 'planning'): Project {
    const newProject: Project = {
      id: 'proj_' + Math.random().toString(36).substring(2, 9),
      estimateId: estimate.id,
      name: `${estimate.projectName} Execution`,
      description: estimate.description,
      category: estimate.category,
      status: initialStatus,
      budget: estimate.totalBudget,
      timelineWeeks: estimate.timelineWeeks,
      completedFeatures: [],
      notes: `Project generated from estimate ${estimate.projectName}. Initial budget allocated at ₹${estimate.totalBudget.toLocaleString('en-IN')}.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimate
    };

    const updated = [newProject, ...this._projects()];
    this._projects.set(updated);
    this.storage.setItem(PROJECTS_STORAGE_KEY, updated);
    this.api.save('projects', newProject).subscribe({
      error: (error: unknown) => this.reportBackendError(error)
    });
    this.notify.success(`Tracked project "${newProject.name}" created successfully.`);
    return newProject;
  }

  updateProject(project: Project): void {
    const list = this._projects();
    const index = list.findIndex(p => p.id === project.id);
    if (index >= 0) {
      const updatedList = [...list];
      updatedList[index] = {
        ...project,
        updatedAt: new Date().toISOString()
      };
      this._projects.set(updatedList);
      this.storage.setItem(PROJECTS_STORAGE_KEY, updatedList);
      this.api.save('projects', updatedList[index]).subscribe({
        error: (error: unknown) => this.reportBackendError(error)
      });
      this._activeProject.set(updatedList[index]);
      this.notify.success(`Project "${project.name}" updated.`);
    }
  }

  toggleFeatureCompletion(projectId: string, featureId: string): void {
    const project = this.getById(projectId);
    if (!project) return;

    const completed = new Set(project.completedFeatures || []);
    if (completed.has(featureId)) {
      completed.delete(featureId);
    } else {
      completed.add(featureId);
    }

    project.completedFeatures = Array.from(completed);
    this.updateProject(project);
  }

  updateStatus(projectId: string, status: ProjectStatus): void {
    const project = this.getById(projectId);
    if (!project) return;
    project.status = status;
    this.updateProject(project);
  }

  deleteProject(projectId: string): boolean {
    const target = this.getById(projectId);
    if (!target) return false;

    const filtered = this._projects().filter(p => p.id !== projectId);
    this._projects.set(filtered);
    this.storage.setItem(PROJECTS_STORAGE_KEY, filtered);
    this.api.delete('projects', projectId).subscribe({
      error: (error: unknown) => this.reportBackendError(error)
    });

    if (this._activeProject()?.id === projectId) {
      this._activeProject.set(null);
    }

    this.notify.info(`Project "${target.name}" was removed.`);
    return true;
  }
}
