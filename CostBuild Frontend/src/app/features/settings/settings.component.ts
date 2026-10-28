import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../core/services/settings.service';
import { EstimateService } from '../../core/services/estimate.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { NotificationService } from '../../core/services/notification.service';
import { RateCardService } from '../../core/services/rate-card.service';
import { HiringModelKey } from '../../core/models/estimate.model';
import { AppIconComponent } from '../../shared/components/app-icon/app-icon.component';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, AppIconComponent, ConfirmationDialogComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  readonly settingsService = inject(SettingsService);
  readonly estimateService = inject(EstimateService);
  private readonly storage = inject(LocalStorageService);
  private readonly notify = inject(NotificationService);
  readonly rateCard = inject(RateCardService);

  readonly currency = signal<'INR' | 'USD' | 'EUR' | 'GBP'>(
    this.settingsService.settings().defaultCurrency
  );
  readonly defaultRegion = signal<string>(
    this.settingsService.settings().defaultRegion
  );
  readonly defaultHiringModel = signal<string>(
    this.settingsService.settings().defaultHiringModel
  );
  readonly emailNotifs = signal<boolean>(
    this.settingsService.settings().emailNotifications
  );
  readonly weeklyReports = signal<boolean>(
    this.settingsService.settings().weeklyReports
  );
  readonly hourlyRates = signal(this.rateCard.getBaseHourlyRates());
  readonly rateModels: { key: HiringModelKey; label: string }[] = [
    { key: 'freelancer', label: 'Freelancer' },
    { key: 'small_agency', label: 'Small agency' },
    { key: 'established_agency', label: 'Established agency' },
    { key: 'in_house', label: 'In-house team' },
    { key: 'mixed', label: 'Mixed team' }
  ];

  // Dialogs
  readonly isClearDemoOpen = signal<boolean>(false);
  readonly isResetDemoOpen = signal<boolean>(false);

  saveSettings(): void {
    const rates = this.hourlyRates();
    if (this.rateModels.some(({ key }) => !Number.isFinite(rates[key]) || rates[key] < 100 || rates[key] > 100000)) {
      this.notify.error('Hourly rates must be between ₹100 and ₹100,000.');
      return;
    }

    this.rateModels.forEach(({ key }) => this.rateCard.setBaseHourlyRate(key, rates[key]));
    this.settingsService.updateSettings({
      defaultCurrency: this.currency(),
      defaultRegion: this.defaultRegion(),
      defaultHiringModel: this.defaultHiringModel(),
      emailNotifications: this.emailNotifs(),
      weeklyReports: this.weeklyReports()
    });
    this.notify.success('System preferences saved successfully.');
  }

  updateHourlyRate(model: HiringModelKey, rate: number): void {
    this.hourlyRates.update(rates => ({ ...rates, [model]: rate }));
  }

  exportAllWorkspaceData(): void {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(this.storage.exportAllData());
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `costbuild_workspace_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      this.notify.success('Complete workspace data exported as JSON.');
    } catch {
      this.notify.error('Failed to export workspace data.');
    }
  }

  confirmClearDemo(): void {
    this.estimateService.clearDemoData();
    this.isClearDemoOpen.set(false);
  }

  confirmResetDemo(): void {
    this.estimateService.resetToDemo();
    this.isResetDemoOpen.set(false);
  }
}
