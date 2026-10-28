import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EstimateService } from '../../core/services/estimate.service';
import { ProjectService } from '../../core/services/project.service';
import { RateCardService } from '../../core/services/rate-card.service';
import { ReportExportService } from '../../core/services/report-export.service';
import { NotificationService } from '../../core/services/notification.service';
import { Estimate, ProjectFeature } from '../../core/models/estimate.model';
import { AppIconComponent } from '../../shared/components/app-icon/app-icon.component';
import { BudgetRangeComponent } from '../../shared/components/budget-range/budget-range.component';
import { CostBreakdownChartComponent } from '../../shared/components/cost-breakdown-chart/cost-breakdown-chart.component';
import { TimelineVisualizationComponent } from '../../shared/components/timeline-visualization/timeline-visualization.component';
import { AIInsightCardComponent } from '../../shared/components/ai-insight-card/ai-insight-card.component';
import { ScenarioComparisonComponent } from '../../shared/components/scenario-comparison/scenario-comparison.component';

@Component({
  selector: 'app-estimate-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AppIconComponent,
    BudgetRangeComponent,
    CostBreakdownChartComponent,
    TimelineVisualizationComponent,
    AIInsightCardComponent,
    ScenarioComparisonComponent
  ],
  templateUrl: './estimate-report.component.html',
  styleUrl: './estimate-report.component.scss'
})
export class EstimateReportComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly estimateService = inject(EstimateService);
  private readonly projectService = inject(ProjectService);
  readonly rateCard = inject(RateCardService);
  readonly exportService = inject(ReportExportService);
  private readonly notify = inject(NotificationService);

  readonly estimate = signal<Estimate | null>(null);
  readonly selectedScenarioId = signal<string>('recommended');
  readonly featureFilter = signal<string>('all'); // all | must_have | should_have | complex
  readonly featureSort = signal<'cost' | 'hours' | 'name'>('cost');
  readonly showCompareModal = signal<boolean>(false);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const found = this.estimateService.getById(id);
        if (found) {
          this.estimate.set(found);
          this.estimateService.setActiveEstimate(found);
        } else {
          this.notify.error('Estimate not found.');
          this.router.navigate(['/app/estimates']);
        }
      }
    });
  }

  // Active scenario data
  readonly currentScenario = computed(() => {
    const est = this.estimate();
    if (!est) return null;
    return est.scenarios.find(s => s.id === this.selectedScenarioId()) || est.scenarios[1];
  });

  // Filtered and sorted features
  readonly displayedFeatures = computed(() => {
    const est = this.estimate();
    if (!est) return [];

    let list = [...est.features];
    const filter = this.featureFilter();

    if (filter === 'must_have') {
      list = list.filter(f => f.priority === 'must_have');
    } else if (filter === 'should_have') {
      list = list.filter(f => f.priority === 'should_have');
    } else if (filter === 'complex') {
      list = list.filter(f => f.complexity === 'complex');
    }

    const sort = this.featureSort();
    list.sort((a, b) => {
      if (sort === 'hours') return b.estimatedHours - a.estimatedHours;
      if (sort === 'name') return a.name.localeCompare(b.name);
      return b.estimatedCost - a.estimatedCost;
    });

    return list;
  });

  onScenarioChange(scenarioId: string): void {
    this.selectedScenarioId.set(scenarioId);
    this.notify.info(`Switched view to ${scenarioId.toUpperCase()} Scenario.`);
  }

  duplicateThisEstimate(): void {
    const est = this.estimate();
    if (!est) return;
    const duplicated = this.estimateService.duplicateEstimate(est.id);
    if (duplicated) {
      this.router.navigate(['/app/estimates', duplicated.id]);
    }
  }

  editInWizard(): void {
    const est = this.estimate();
    if (!est) return;
    this.estimateService.saveDraft({
      id: est.id,
      step: 1,
      overview: {
        projectName: est.projectName,
        category: est.category,
        description: est.description,
        targetAudience: est.targetAudience,
        industry: est.industry,
        objective: est.objective
      },
      features: est.features,
      techStack: est.techStack,
      parameters: { ...est.parameters, targetBudget: est.targetBudget },
      currency: est.currency,
    });
    this.router.navigate(['/app/new-estimate']);
  }

  trackAsProject(): void {
    const est = this.estimate();
    if (!est) return;
    const proj = this.projectService.createFromEstimate(est);
    this.router.navigate(['/app/projects', proj.id]);
  }

  saveChanges(): void {
    const est = this.estimate();
    if (est) {
      this.estimateService.saveEstimate(est);
    }
  }

  copyLink(): void {
    const est = this.estimate();
    if (est) {
      this.exportService.copySummaryToClipboard(est);
    }
  }

  exportPdf(): void {
    this.exportService.printReport();
  }

  exportJson(): void {
    const est = this.estimate();
    if (est) {
      this.exportService.exportAsJson(est);
    }
  }
}
