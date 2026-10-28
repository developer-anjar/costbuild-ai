import { Injectable, signal, inject } from '@angular/core';
import { Estimate } from '../models/estimate.model';
import { LocalStorageService } from './local-storage.service';
import { EstimationEngineService } from './estimation-engine.service';
import { NotificationService } from './notification.service';
import { createInitialDemoEstimates } from './demo-data.factory';
import { BackendApiService } from './backend-api.service';

const ESTIMATES_STORAGE_KEY = 'costbuild_estimates_v1';
const DRAFT_WIZARD_KEY = 'costbuild_wizard_draft';
const DEMO_ESTIMATES_REVISION_KEY = 'costbuild_demo_estimates_revision';
const DEMO_ESTIMATES_REVISION = 3;
const BACKEND_DEMO_ESTIMATES_REVISION_KEY = 'costbuild_backend_demo_estimates_revision';

@Injectable({
  providedIn: 'root'
})
export class EstimateService {
  private readonly storage = inject(LocalStorageService);
  private readonly engine = inject(EstimationEngineService);
  private readonly notify = inject(NotificationService);
  private readonly api = inject(BackendApiService);

  private readonly _estimates = signal<Estimate[]>([]);
  readonly estimates = this._estimates.asReadonly();

  private readonly _activeEstimate = signal<Estimate | null>(null);
  readonly activeEstimate = this._activeEstimate.asReadonly();

  // Wizard draft state
  private readonly _wizardDraft = signal<any | null>(
    this.storage.getItem<any | null>(DRAFT_WIZARD_KEY, null)
  );
  readonly wizardDraft = this._wizardDraft.asReadonly();

  constructor() {
    this.initEstimates();
  }

  private initEstimates(): void {
    const stored = this.storage.getItem<Estimate[] | null>(ESTIMATES_STORAGE_KEY, null);
    if (stored && Array.isArray(stored) && stored.length > 0) {
      const demoRevision = this.storage.getItem<number>(DEMO_ESTIMATES_REVISION_KEY, 0);
      if (demoRevision < DEMO_ESTIMATES_REVISION && stored.some(estimate => estimate.isSample)) {
        const demoEstimates = createInitialDemoEstimates(this.engine);
        const demoEstimatesById = new Map(demoEstimates.map(estimate => [estimate.id, estimate]));
        const updated = stored.map(estimate =>
          estimate.isSample ? (demoEstimatesById.get(estimate.id) ?? estimate) : estimate
        );
        this._estimates.set(updated);
        this.storage.setItem(ESTIMATES_STORAGE_KEY, updated);
      } else {
        this._estimates.set(stored);
      }
      this.storage.setItem(DEMO_ESTIMATES_REVISION_KEY, DEMO_ESTIMATES_REVISION);
    } else {
      // Seed with initial realistic demo estimates
      const demoEstimates = createInitialDemoEstimates(this.engine);
      this._estimates.set(demoEstimates);
      this.storage.setItem(ESTIMATES_STORAGE_KEY, demoEstimates);
      this.storage.setItem(DEMO_ESTIMATES_REVISION_KEY, DEMO_ESTIMATES_REVISION);
    }
    this.syncWithBackend();
  }

  private syncWithBackend(): void {
    this.api.list<Estimate>('estimates').subscribe({
      next: (remote) => {
        if (remote.length > 0) {
          const backendRevision = this.storage.getItem<number>(BACKEND_DEMO_ESTIMATES_REVISION_KEY, 0);
          if (backendRevision < DEMO_ESTIMATES_REVISION && remote.some(estimate => estimate.isSample)) {
            const refreshedSamples = new Map(
              createInitialDemoEstimates(this.engine).map(estimate => [estimate.id, estimate])
            );
            const updated = remote.map(estimate => {
              const refreshed = estimate.isSample ? refreshedSamples.get(estimate.id) : undefined;
              return refreshed
                ? { ...refreshed, createdAt: estimate.createdAt, updatedAt: estimate.updatedAt }
                : estimate;
            });
            this._estimates.set(updated);
            this.storage.setItem(ESTIMATES_STORAGE_KEY, updated);
            this.api.saveAll('estimates', updated).subscribe({
              next: () => this.storage.setItem(BACKEND_DEMO_ESTIMATES_REVISION_KEY, DEMO_ESTIMATES_REVISION),
              error: (error: unknown) => this.reportBackendError(error)
            });
            return;
          }
          this._estimates.set(remote);
          this.storage.setItem(ESTIMATES_STORAGE_KEY, remote);
          return;
        }
        this.api.saveAll('estimates', this._estimates()).subscribe({
          next: () => this.storage.setItem(BACKEND_DEMO_ESTIMATES_REVISION_KEY, DEMO_ESTIMATES_REVISION),
          error: (error: unknown) => this.reportBackendError(error)
        });
      },
      error: (error: unknown) => this.reportBackendError(error)
    });
  }

  private reportBackendError(error: unknown): void {
    console.error('Estimate backend request failed:', error);
    this.notify.error('Could not sync estimates with the backend. Local data is still available.');
  }

  getAll(): Estimate[] {
    return this._estimates();
  }

  getById(id: string): Estimate | undefined {
    return this._estimates().find(e => e.id === id);
  }

  setActiveEstimate(estimate: Estimate | null): void {
    this._activeEstimate.set(estimate);
  }

  saveEstimate(estimate: Estimate): void {
    const list = this._estimates();
    const existingIndex = list.findIndex(e => e.id === estimate.id);
    let updated: Estimate[];

    const toSave: Estimate = {
      ...estimate,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = toSave;
      this.notify.success(`Estimate "${toSave.projectName}" updated successfully.`);
    } else {
      updated = [toSave, ...list];
      this.notify.success(`New estimate "${toSave.projectName}" generated and saved.`);
    }

    this._estimates.set(updated);
    this.storage.setItem(ESTIMATES_STORAGE_KEY, updated);
    this.api.save('estimates', toSave).subscribe({
      error: (error: unknown) => this.reportBackendError(error)
    });
    this._activeEstimate.set(toSave);
  }

  duplicateEstimate(id: string): Estimate | null {
    const original = this.getById(id);
    if (!original) {
      this.notify.error('Original estimate not found to duplicate.');
      return null;
    }

    const duplicated: Estimate = {
      ...original,
      id: 'est_' + Math.random().toString(36).substring(2, 9),
      projectName: `${original.projectName} (Copy)`,
      isSample: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [duplicated, ...this._estimates()];
    this._estimates.set(updated);
    this.storage.setItem(ESTIMATES_STORAGE_KEY, updated);
    this.api.save('estimates', duplicated).subscribe({
      error: (error: unknown) => this.reportBackendError(error)
    });
    this.notify.success(`Estimate duplicated as "${duplicated.projectName}".`);
    return duplicated;
  }

  deleteEstimate(id: string): boolean {
    const target = this.getById(id);
    if (!target) return false;

    const filtered = this._estimates().filter(e => e.id !== id);
    this._estimates.set(filtered);
    this.storage.setItem(ESTIMATES_STORAGE_KEY, filtered);
    this.api.delete('estimates', id).subscribe({
      error: (error: unknown) => this.reportBackendError(error)
    });

    if (this._activeEstimate()?.id === id) {
      this._activeEstimate.set(null);
    }

    this.notify.info(`Estimate "${target.projectName}" was deleted.`);
    return true;
  }

  saveDraft(draftData: any): void {
    this._wizardDraft.set(draftData);
    this.storage.setItem(DRAFT_WIZARD_KEY, draftData);
  }

  clearDraft(): void {
    this._wizardDraft.set(null);
    this.storage.removeItem(DRAFT_WIZARD_KEY);
  }

  clearDemoData(): void {
    const current = this._estimates();
    const userOnly = current.filter(e => !e.isSample);
    this._estimates.set(userOnly);
    this.storage.setItem(ESTIMATES_STORAGE_KEY, userOnly);
    current.filter(e => e.isSample).forEach(estimate => {
      this.api.delete('estimates', estimate.id).subscribe({
        error: (error: unknown) => this.reportBackendError(error)
      });
    });
    this.notify.info('Demo sample estimates cleared. Workspace now shows user data only.');
  }

  resetToDemo(): void {
    const demoEstimates = createInitialDemoEstimates(this.engine);
    this._estimates.set(demoEstimates);
    this.storage.setItem(ESTIMATES_STORAGE_KEY, demoEstimates);
    this.storage.setItem(DEMO_ESTIMATES_REVISION_KEY, DEMO_ESTIMATES_REVISION);
    this.api.saveAll('estimates', demoEstimates).subscribe({
      error: (error: unknown) => this.reportBackendError(error)
    });
    this.notify.success('Workspace reset with standard demonstration data.');
  }
}
