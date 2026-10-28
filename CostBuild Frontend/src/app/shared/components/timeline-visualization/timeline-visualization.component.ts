import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevelopmentPhase } from '../../../core/models/estimate.model';
import { AppIconComponent } from '../app-icon/app-icon.component';

@Component({
  selector: 'app-timeline-visualization',
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  template: `
    <div class="timeline-card card">
      <div class="timeline-header">
        <div>
          <h3 class="timeline-title">Delivery Roadmap & Phase Overlap</h3>
          <p class="timeline-subtitle">Agile two-week sprints with concurrent frontend and backend delivery</p>
        </div>
        <div class="badge badge-orange">
          <app-icon name="clock" [size]="14" />
          {{ totalWeeks }} Weeks Total Duration
        </div>
      </div>

      <!-- Gantt Weeks Header -->
      <div class="gantt-container">
        <div class="gantt-header-row">
          <div class="col-phase-name">Lifecycle Phase</div>
          <div class="col-gantt-bars">
            <div class="weeks-axis">
              @for (w of weekList; track w) {
                <span class="week-marker">W{{ w }}</span>
              }
            </div>
          </div>
        </div>

        <!-- Gantt Phase Bars -->
        <div class="gantt-body">
          @for (phase of timelinePhases; track phase.id) {
            <div class="gantt-row">
              <div class="col-phase-name">
                <span class="p-title">{{ phase.name }}</span>
                <span class="p-meta">{{ phase.hours }} hrs &bull; W{{ phase.startWeek }} - W{{ phase.endWeek }}</span>
              </div>
              <div class="col-gantt-bars bar-track">
                <div
                  class="gantt-bar"
                  [style.left.%]="phase.leftPct"
                  [style.width.%]="phase.widthPct"
                  [class]="'bar-' + phase.id"
                >
                  <span class="bar-label">{{ phase.durationWeeks }}w</span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <div class="timeline-footnote">
        <app-icon name="info" [size]="14" color="#8B7CE8" />
        <span>Phases execute concurrently in sprint increments. Final production hardening occurs in parallel with user acceptance testing.</span>
      </div>
    </div>
  `,
  styles: [`
    .timeline-card {
      padding: 1.5rem;
      border-radius: var(--radius-lg);
      margin-bottom: 1.5rem;
    }

    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .timeline-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--primary-text);
      margin-bottom: 0.2rem;
    }

    .timeline-subtitle {
      font-size: 0.825rem;
      color: var(--secondary-text);
    }

    .gantt-container {
      overflow-x: auto;
      min-width: 100%;
      margin-bottom: 1.25rem;
    }

    .gantt-header-row {
      display: flex;
      align-items: center;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border);
      min-width: 600px;
    }

    .col-phase-name {
      width: 200px;
      flex-shrink: 0;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--secondary-text);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .col-gantt-bars {
      flex: 1;
      position: relative;
    }

    .weeks-axis {
      display: flex;
      justify-content: space-between;
      padding: 0 0.5rem;
    }

    .week-marker {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--muted-text);
    }

    .gantt-body {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      padding-top: 0.85rem;
      min-width: 600px;
    }

    .gantt-row {
      display: flex;
      align-items: center;
    }

    .p-title {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--primary-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 0.75rem;
    }

    .p-meta {
      display: block;
      font-size: 0.725rem;
      color: var(--secondary-text);
    }

    .bar-track {
      background: var(--main-bg);
      height: 28px;
      border-radius: var(--radius-sm);
      position: relative;
      border: 1px solid var(--border-light);
    }

    .gantt-bar {
      position: absolute;
      top: 3px;
      bottom: 3px;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      background: var(--primary-orange);
      box-shadow: 0 2px 4px rgba(249, 115, 22, 0.25);
    }

    .bar-discovery { background: #F97316; }
    .bar-ui_ux { background: #8B7CE8; }
    .bar-frontend { background: #EA580C; }
    .bar-backend { background: #7C3AED; }
    .bar-integration { background: #D97706; }
    .bar-testing { background: #16A34A; }
    .bar-deployment { background: #0284C7; }

    .bar-label {
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--white);
      padding: 0 0.35rem;
    }

    .timeline-footnote {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.775rem;
      color: var(--secondary-text);
      background: var(--lavender-bg);
      padding: 0.65rem 0.85rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--lavender-border);
    }
  `]
})
export class TimelineVisualizationComponent {
  @Input() totalWeeks: number = 12;
  @Input() phases: DevelopmentPhase[] = [];

  get weekList(): number[] {
    const list: number[] = [];
    const count = Math.max(4, this.totalWeeks);
    for (let i = 1; i <= count; i++) {
      list.push(i);
    }
    return list;
  }

  get timelinePhases() {
    const total = Math.max(4, this.totalWeeks);

    // Overlapping realistic schedules
    const scheduleOffsets: Record<string, { startPct: number; durationPct: number }> = {
      discovery: { startPct: 0.0, durationPct: 0.25 },
      ui_ux: { startPct: 0.12, durationPct: 0.35 },
      frontend: { startPct: 0.30, durationPct: 0.55 },
      backend: { startPct: 0.25, durationPct: 0.60 },
      integration: { startPct: 0.55, durationPct: 0.30 },
      testing: { startPct: 0.68, durationPct: 0.28 },
      deployment: { startPct: 0.88, durationPct: 0.12 }
    };

    return this.phases.map(p => {
      const config = scheduleOffsets[p.id] || { startPct: 0.2, durationPct: 0.4 };
      const startWeek = Math.max(1, Math.round(config.startPct * total) + 1);
      const durationWeeks = Math.max(1, Math.round(config.durationPct * total));
      const endWeek = Math.min(total, startWeek + durationWeeks);

      const leftPct = (config.startPct * 100);
      const widthPct = Math.max(8, (config.durationPct * 100));

      return {
        ...p,
        startWeek,
        endWeek,
        durationWeeks,
        leftPct,
        widthPct: Math.min(100 - leftPct, widthPct)
      };
    });
  }
}

