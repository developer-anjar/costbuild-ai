import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { DevelopmentPhase } from '../../../core/models/estimate.model';
import { RateCardService } from '../../../core/services/rate-card.service';

Chart.register(...registerables);

@Component({
  selector: 'app-cost-breakdown-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container card">
      <div class="chart-header">
        <div>
          <h3 class="chart-title">Phase-Wise Cost Allocation</h3>
          <p class="chart-subtitle">Distribution across engineering lifecycle and handover</p>
        </div>
      </div>

      <div class="chart-layout">
        <!-- Chart Canvas -->
        <div class="canvas-wrap">
          <canvas #chartCanvas></canvas>
        </div>

        <!-- Legend / Breakdown Table -->
        <div class="phase-list">
          @for (phase of phases; track phase.id; let idx = $index) {
            <div class="phase-row">
              <div class="phase-info">
                <span class="color-badge" [style.background-color]="getColor(idx)"></span>
                <div>
                  <div class="phase-name">{{ phase.name }}</div>
                  <div class="phase-hours">{{ phase.hours }} hours &bull; {{ phase.percentage }}% of budget</div>
                </div>
              </div>
              <div class="phase-cost">
                {{ rateCard.formatCurrency(phase.cost, currency) }}
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      padding: 1.5rem;
      border-radius: var(--radius-lg);
      margin-bottom: 1.5rem;
    }

    .chart-header {
      margin-bottom: 1.5rem;
    }

    .chart-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--primary-text);
      margin-bottom: 0.2rem;
    }

    .chart-subtitle {
      font-size: 0.825rem;
      color: var(--secondary-text);
    }

    .chart-layout {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 2rem;
      align-items: center;
    }

    @media (max-width: 860px) {
      .chart-layout {
        grid-template-columns: 1fr;
      }
    }

    .canvas-wrap {
      width: 100%;
      max-width: 240px;
      height: 240px;
      margin: 0 auto;
      position: relative;
    }

    .phase-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .phase-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius-md);
      background: var(--main-bg);
      border: 1px solid var(--border-light);
      transition: background 0.15s ease;
    }

    .phase-row:hover {
      background: var(--secondary-bg);
    }

    .phase-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .color-badge {
      width: 10px;
      height: 10px;
      border-radius: 3px;
      flex-shrink: 0;
    }

    .phase-name {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--primary-text);
    }

    .phase-hours {
      font-size: 0.75rem;
      color: var(--secondary-text);
    }

    .phase-cost {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--primary-text);
    }
  `]
})
export class CostBreakdownChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  readonly rateCard = inject(RateCardService);

  @Input() phases: DevelopmentPhase[] = [];
  @Input() currency: string = 'INR';

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chartInstance: Chart | null = null;

  private readonly colors = [
    '#F97316', // Orange
    '#8B7CE8', // Lavender
    '#EA580C', // Deep Orange
    '#DDD6FE', // Soft Lavender
    '#16A34A', // Green
    '#D97706', // Amber
    '#38BDF8'  // Sky Blue
  ];

  getColor(index: number): string {
    return this.colors[index % this.colors.length];
  }

  ngAfterViewInit(): void {
    this.createOrUpdateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['phases'] && !changes['phases'].isFirstChange()) {
      this.createOrUpdateChart();
    }
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }

  private createOrUpdateChart(): void {
    if (!this.chartCanvas) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }

    const labels = this.phases.map(p => p.name);
    const data = this.phases.map(p => p.cost);
    const bgColors = this.phases.map((_, i) => this.getColor(i));

    this.chartInstance = new Chart(this.chartCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: bgColors,
          borderWidth: 2,
          borderColor: '#FFFFFF',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const val = context.raw as number;
                return ` ${this.rateCard.formatCurrency(val, this.currency)}`;
              }
            }
          }
        },
        cutout: '72%'
      }
    });
  }
}

