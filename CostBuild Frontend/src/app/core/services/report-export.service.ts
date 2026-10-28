import { Injectable, inject } from '@angular/core';
import { Estimate } from '../models/estimate.model';
import { NotificationService } from './notification.service';
import { RateCardService } from './rate-card.service';

@Injectable({
  providedIn: 'root'
})
export class ReportExportService {
  private readonly notify = inject(NotificationService);
  private readonly rateCard = inject(RateCardService);

  printReport(): void {
    window.print();
  }

  exportAsJson(estimate: Estimate): void {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(estimate, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `${estimate.projectName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_estimate.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      this.notify.success('Estimate specification exported as JSON.');
    } catch (e) {
      this.notify.error('Failed to export JSON file.');
      console.error(e);
    }
  }

  copySummaryToClipboard(estimate: Estimate): void {
    const text = `
=========================================
COSTBUILD AI ESTIMATION REPORT
Project: ${estimate.projectName}
Category: ${estimate.category}
=========================================
Total Estimated Budget: ${this.rateCard.formatCurrency(estimate.totalBudget, estimate.currency)}
Budget Range: ${this.rateCard.formatCurrency(estimate.budgetRange.min, estimate.currency)} - ${this.rateCard.formatCurrency(estimate.budgetRange.max, estimate.currency)}
Estimated Timeline: ${estimate.timelineWeeks} Weeks
Total Engineering Hours: ${estimate.totalHours} Hours
Confidence Level: ${estimate.confidenceScore}%

KEY PHASES:
${estimate.phases.map(p => `- ${p.name}: ${p.hours} hrs (${this.rateCard.formatCurrency(p.cost, estimate.currency)})`).join('\n')}

TECHNOLOGY STACK:
Platform: ${estimate.techStack.platform}
Frontend: ${estimate.techStack.frontend}
Backend: ${estimate.techStack.backend}
Database: ${estimate.techStack.database}
AI: ${estimate.techStack.aiRequirements}

Generated with CostBuild AI (Decision-support illustrative output).
    `.trim();

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.notify.success('Report summary copied to clipboard!');
      }).catch(() => {
        this.notify.warning('Please allow clipboard permissions.');
      });
    }
  }
}

