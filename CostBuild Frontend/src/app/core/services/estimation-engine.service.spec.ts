import { TestBed } from '@angular/core/testing';
import { Estimate } from '../models/estimate.model';
import { createInitialDemoEstimates } from './demo-data.factory';
import { EstimationEngineService } from './estimation-engine.service';
import { RateCardService } from './rate-card.service';

describe('EstimationEngineService', () => {
  let engine: EstimationEngineService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [EstimationEngineService, RateCardService]
    });
    engine = TestBed.inject(EstimationEngineService);
  });

  function getDemoEstimates(): Estimate[] {
    return createInitialDemoEstimates(engine);
  }

  it('keeps Indian startup demo estimates within the requested budget ranges', () => {
    const budgets: Record<string, [number, number]> = {
      est_freelance_portfolio: [8000, 25000],
      est_ai_lms: [35000, 90000],
      est_marketplace: [40000, 100000],
      est_saas_inventory: [20000, 60000],
      est_food_delivery: [50000, 120000]
    };

    for (const estimate of getDemoEstimates()) {
      const [minimum, maximum] = budgets[estimate.id];
      expect(estimate.totalBudget)
        .withContext(`${estimate.projectName} total budget`)
        .toBeGreaterThanOrEqual(minimum);
      expect(estimate.totalBudget)
        .withContext(`${estimate.projectName} total budget`)
        .toBeLessThanOrEqual(maximum);
    }
  });

  it('provides named options and a cost breakdown that reconciles to the estimate total', () => {
    for (const estimate of getDemoEstimates()) {
      expect(estimate.scenarios.map(scenario => scenario.name)).toEqual([
        'Lean MVP',
        'Startup Standard',
        'Growth Ready'
      ]);
      expect(estimate.subtotal).toBe(estimate.laborCost + estimate.additionalExpenses);
      expect(estimate.totalBudget).toBe(estimate.subtotal + estimate.contingencyAmount);
      expect(estimate.totalHours).toBeGreaterThan(0);
    }
  });

  it('uses configurable hourly rates when estimating costs', () => {
    const rateCard = TestBed.inject(RateCardService);
    const estimateAtDefaultRate = getDemoEstimates().find(item => item.id === 'est_freelance_portfolio');
    expect(estimateAtDefaultRate).toBeDefined();

    rateCard.setBaseHourlyRate('freelancer', 1000);
    const estimateAtHigherRate = getDemoEstimates().find(item => item.id === 'est_freelance_portfolio');

    expect(estimateAtHigherRate?.totalBudget).toBeGreaterThan(estimateAtDefaultRate!.totalBudget);
  });

  it('suggests postponing optional features when the Startup Standard scope exceeds the target', () => {
    const estimate = getDemoEstimates().find(item => item.id === 'est_freelance_portfolio');
    expect(estimate).toBeDefined();

    const budgetLimitedEstimate = engine.generateEstimate({
      id: 'budget-limited-portfolio',
      projectName: estimate!.projectName,
      description: estimate!.description,
      category: estimate!.category,
      features: estimate!.features,
      techStack: estimate!.techStack,
      parameters: estimate!.parameters,
      currency: estimate!.currency,
      targetBudget: 10000
    });

    expect(budgetLimitedEstimate.insights.costOptimizationSuggestions.some(
      suggestion => suggestion.startsWith('Postpone ')
    )).toBeTrue();
  });
});
