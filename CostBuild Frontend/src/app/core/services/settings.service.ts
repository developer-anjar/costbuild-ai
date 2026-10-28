import { Injectable, signal, inject } from '@angular/core';
import { AppSettings } from '../models/project.model';
import { LocalStorageService } from './local-storage.service';
import { BackendApiService } from './backend-api.service';
import { NotificationService } from './notification.service';

const SETTINGS_KEY = 'costbuild_settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly storage = inject(LocalStorageService);
  private readonly api = inject(BackendApiService);
  private readonly notify = inject(NotificationService);

  private readonly defaultSettings: AppSettings = {
    defaultCurrency: 'INR',
    defaultRegion: 'india',
    defaultHiringModel: 'small_agency',
    emailNotifications: true,
    weeklyReports: false,
    autoSaveDrafts: true
  };

  private readonly _settings = signal<AppSettings>(
    this.storage.getItem<AppSettings>(SETTINGS_KEY, this.defaultSettings)
  );

  readonly settings = this._settings.asReadonly();

  constructor() {
    this.api.list<AppSettings & { id: string }>('settings').subscribe({
      next: (remote) => {
        if (remote.length > 0) {
          const { id: _id, ...settings } = remote[0];
          this._settings.set(settings);
          this.storage.setItem(SETTINGS_KEY, settings);
          return;
        }
        this.persistToBackend(this._settings());
      },
      error: (error: unknown) => this.reportBackendError(error)
    });
  }

  updateSettings(newSettings: Partial<AppSettings>): void {
    const updated = { ...this._settings(), ...newSettings };
    this._settings.set(updated);
    this.storage.setItem(SETTINGS_KEY, updated);
    this.persistToBackend(updated);
  }

  resetToDefaults(): void {
    this._settings.set(this.defaultSettings);
    this.storage.setItem(SETTINGS_KEY, this.defaultSettings);
    this.persistToBackend(this.defaultSettings);
  }

  private persistToBackend(settings: AppSettings): void {
    this.api.save('settings', { id: 'default', ...settings }).subscribe({
      error: (error: unknown) => this.reportBackendError(error)
    });
  }

  private reportBackendError(error: unknown): void {
    console.error('Settings backend request failed:', error);
    this.notify.error('Could not sync settings with the backend. Local settings are still available.');
  }
}
