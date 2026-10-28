import { Injectable, inject } from '@angular/core';
import {
  Estimate,
  ProjectFeature,
  TechnicalStack,
  ProjectParameters,
  DevelopmentPhase,
  TeamRecommendation,
  Scenario,
  AIInsight,
  ProjectCategory
} from '../models/estimate.model';
import { RateCardService } from './rate-card.service';

interface CostBreakdown {
  featureHours: number;
  totalHours: number;
  laborCost: number;
  additionalExpenses: number;
  subtotal: number;
  contingencyPercent: number;
  contingencyAmount: number;
  totalBudget: number;
}

@Injectable({
  providedIn: 'root'
})
export class EstimationEngineService {
  private readonly rateCard = inject(RateCardService);

  private readonly categoryMultipliers: Record<ProjectCategory, number> = {
    'SaaS Platform': 1.0,
    'E-commerce': 1.05,
    'Marketplace': 1.1,
    'Mobile Application': 1.1,
    'Business Management System': 1.05,
    'AI Application': 1.15,
    'Portfolio or Marketing Website': 0.9,
    'Internal Enterprise Tool': 1.0,
    'Other': 1.0
  };

  /**
   * Deterministically calculates a complete estimate based on inputs.
   */
  generateEstimate(input: {
    id?: string;
    projectName: string;
    description: string;
    category: ProjectCategory;
    targetAudience?: string;
    industry?: string;
    objective?: string;
    features: ProjectFeature[];
    techStack: TechnicalStack;
    parameters: ProjectParameters;
    currency?: string;
    targetBudget?: number | null;
  }): Estimate {
    const currency = input.currency || 'INR';
    const features = this.calculateFeatureHoursAndCosts(
      input.features,
      input.parameters,
      input.techStack,
      input.category,
      currency
    );
    const hourlyRateInr = this.rateCard.getHourlyRate(input.parameters.hiringModel, input.parameters.region);
    const hourlyRate = this.rateCard.convertFromInr(hourlyRateInr, currency);
    const targetBudget = input.targetBudget && input.targetBudget > 0 ? input.targetBudget : undefined;
    const estimates = this.calculateScenarioEstimates(
      features,
      input.parameters,
      input.techStack,
      hourlyRate,
      currency
    );
    const standardEstimate = estimates.standard;
    const phases = this.calculatePhases(standardEstimate.totalHours, hourlyRate, input.parameters.deliveryTimeline);
    const laborCost = standardEstimate.laborCost;
    const designPhase = phases.find(p => p.id === 'ui_ux');
    const testingPhase = phases.find(p => p.id === 'testing');
    const deploymentPhase = phases.find(p => p.id === 'deployment');

    const designCost = designPhase ? designPhase.cost : Math.round(laborCost * 0.14);
    const testingCost = testingPhase ? testingPhase.cost : Math.round(laborCost * 0.08);
    const deploymentCost = deploymentPhase ? deploymentPhase.cost : Math.round(laborCost * 0.04);
    const budgetRange = {
      min: Math.round(standardEstimate.totalBudget * 0.9),
      max: Math.round(standardEstimate.totalBudget * 1.15)
    };
    const timelineWeeks = this.calculateRealisticTimelineWeeks(
      standardEstimate.totalHours,
      input.parameters.deliveryTimeline,
      input.parameters.hiringModel
    );
    const team = this.calculateTeamRecommendations(
      standardEstimate.totalHours,
      timelineWeeks,
      hourlyRate,
      input.parameters.hiringModel
    );
    const insights = this.generateAIInsights(
      input.category,
      features,
      input.techStack,
      input.parameters,
      standardEstimate.totalBudget,
      currency,
      targetBudget,
      estimates.lean.totalBudget
    );
    const assumptions = this.generateAssumptions(
      input.parameters,
      input.techStack,
      standardEstimate.contingencyPercent
    );
    const confidenceScore = this.calculateConfidenceScore(features.length, input.techStack, input.parameters);

    const now = new Date().toISOString();

    return {
      id: input.id || 'est_' + Math.random().toString(36).substring(2, 9),
      projectName: input.projectName,
      description: input.description,
      category: input.category,
      targetAudience: input.targetAudience || 'General Users & Organizations',
      industry: input.industry || 'Technology / SaaS',
      objective: input.objective || 'Launch scalable, secure, and user-centric software solution.',
      features,
      techStack: input.techStack,
      parameters: input.parameters,
      currency,
      targetBudget,
      totalHours: standardEstimate.totalHours,
      laborCost,
      designCost,
      testingCost,
      deploymentCost,
      additionalExpenses: standardEstimate.additionalExpenses,
      subtotal: standardEstimate.subtotal,
      contingencyPercent: standardEstimate.contingencyPercent,
      contingencyAmount: standardEstimate.contingencyAmount,
      totalBudget: standardEstimate.totalBudget,
      budgetRange,
      timelineWeeks,
      confidenceScore,
      phases,
      team,
      scenarios: estimates.scenarios,
      insights,
      assumptions,
      createdAt: now,
      updatedAt: now
    };
  }

  private calculateFeatureHoursAndCosts(
    features: ProjectFeature[],
    params: ProjectParameters,
    techStack: TechnicalStack,
    category: ProjectCategory,
    currency: string
  ): ProjectFeature[] {
    const categoryMult = this.categoryMultipliers[category] || 1.0;
    const platformMult = this.rateCard.getPlatformMultiplier(techStack.platform);
    const designMult = this.rateCard.getDesignMultiplier(params.designComplexity);
    const scaleMult = params.userScale === 'enterprise' ? 1.3 : params.userScale === 'growth' ? 1.12 : 1;
    const qualityMult = params.qualityExpectation === 'enterprise' ? 1.15 : params.qualityExpectation === 'mvp' ? 0.9 : 1;
    const hourlyRateInr = this.rateCard.getHourlyRate(params.hiringModel, params.region);
    const hourlyRate = this.rateCard.convertFromInr(hourlyRateInr, currency);

    return features.map((feature) => {
      const baseHours = feature.complexity === 'simple' ? 4 : feature.complexity === 'medium' ? 10 : 22;

      const adjustedHours = Math.max(1, Math.round(baseHours * categoryMult * platformMult * designMult * scaleMult * qualityMult));
      const estimatedCost = adjustedHours * hourlyRate;

      return {
        ...feature,
        estimatedHours: adjustedHours,
        estimatedCost
      };
    });
  }

  private calculatePhases(
    totalHours: number,
    hourlyRate: number,
    urgency: string
  ): DevelopmentPhase[] {
    const definitions: { id: string; name: string; description: string; pct: number; startPct: number; durationPct: number }[] = [
      {
        id: 'discovery',
        name: 'Discovery & Architecture Planning',
        description: 'Requirements validation, technical architecture, database schemas, and API contracts.',
        pct: 0.08,
        startPct: 0.0,
        durationPct: 0.18
      },
      {
        id: 'ui_ux',
        name: 'UI/UX Design & Design System',
        description: 'Wireframes, interactive Figma prototypes, component design tokens, and user journeys.',
        pct: 0.14,
        startPct: 0.1,
        durationPct: 0.28
      },
      {
        id: 'frontend',
        name: 'Frontend Development & Client Apps',
        description: 'Responsive views, state management, form validations, component hierarchy, and animations.',
        pct: 0.28,
        startPct: 0.25,
        durationPct: 0.55
      },
      {
        id: 'backend',
        name: 'Backend API & Business Logic',
        description: 'Microservices/monolith endpoints, authentication, database migrations, security, and jobs.',
        pct: 0.28,
        startPct: 0.25,
        durationPct: 0.55
      },
      {
        id: 'integration',
        name: 'Integrations & External APIs',
        description: 'Payment gateways, AI model endpoints, notification services, webhooks, and third parties.',
        pct: 0.10,
        startPct: 0.55,
        durationPct: 0.3
      },
      {
        id: 'testing',
        name: 'Quality Assurance & Automated Testing',
        description: 'Unit testing, integration tests, cross-browser validation, vulnerability scans, and bug triage.',
        pct: 0.08,
        startPct: 0.65,
        durationPct: 0.3
      },
      {
        id: 'deployment',
        name: 'Cloud Deployment & DevOps Handover',
        description: 'CI/CD pipeline configuration, SSL certificates, monitoring alerts, staging signoff, and production launch.',
        pct: 0.04,
        startPct: 0.85,
        durationPct: 0.15
      }
    ];

    let allocatedHours = 0;
    let allocatedCost = 0;
    return definitions.map((def, index) => {
      const isLast = index === definitions.length - 1;
      const hours = isLast ? totalHours - allocatedHours : Math.round(totalHours * def.pct);
      const cost = isLast
        ? totalHours * hourlyRate - allocatedCost
        : Math.round(hours * hourlyRate);
      allocatedHours += hours;
      allocatedCost += cost;
      return {
        id: def.id,
        name: def.name,
        description: def.description,
        hours,
        cost,
        percentage: Math.round(def.pct * 100),
        durationWeeks: 0, // set in timeline calculations
        startWeek: 0,
        endWeek: 0
      };
    });
  }

  private calculateRealisticTimelineWeeks(totalHours: number, urgency: string, hiringModel: string): number {
    // Assuming team concurrency of 2.5 - 4.0 developers
    let concurrentDevCapacityHoursPerWeek = 80; // ~2 full-time devs
    if (hiringModel === 'established_agency' || hiringModel === 'in_house') {
      concurrentDevCapacityHoursPerWeek = 120; // 3+ devs parallel
    }
    if (urgency === 'urgent') {
      concurrentDevCapacityHoursPerWeek *= 1.35; // overtime & fast-track
    }

    const rawWeeks = totalHours / concurrentDevCapacityHoursPerWeek;
    // Add 2 weeks for planning & final QA buffer
    const finalWeeks = Math.max(3, Math.round(rawWeeks + 2));
    return finalWeeks;
  }

  private calculateTeamRecommendations(
    totalHours: number,
    timelineWeeks: number,
    hourlyRate: number,
    hiringModel: string
  ): TeamRecommendation[] {
    const hoursPerMonth = 160;
    const baseMonthlyRate = Math.round(hourlyRate * hoursPerMonth);

    const roles: TeamRecommendation[] = [
      {
        role: 'Tech Lead / Senior Architect',
        count: 1,
        involvementWeeks: timelineWeeks,
        monthlyRate: Math.round(baseMonthlyRate * 1.3),
        responsibilities: ['Architecture oversight', 'Code reviews', 'API contract design', 'Security and release approvals']
      },
      {
        role: 'Frontend Engineer',
        count: totalHours > 500 ? 2 : 1,
        involvementWeeks: Math.max(2, Math.round(timelineWeeks * 0.75)),
        monthlyRate: baseMonthlyRate,
        responsibilities: ['Responsive UI views', 'Design system integration', 'State management', 'Client-side performance']
      },
      {
        role: 'Backend Engineer',
        count: totalHours > 400 ? 2 : 1,
        involvementWeeks: Math.max(2, Math.round(timelineWeeks * 0.75)),
        monthlyRate: Math.round(baseMonthlyRate * 1.05),
        responsibilities: ['Core domain APIs', 'Database indexing', 'Third-party integrations', 'Performance optimization']
      },
      {
        role: 'UI/UX Designer',
        count: 1,
        involvementWeeks: Math.max(2, Math.round(timelineWeeks * 0.4)),
        monthlyRate: Math.round(baseMonthlyRate * 0.9),
        responsibilities: ['User journeys & wireframes', 'Interactive Figma prototype', 'Design assets', 'Usability testing']
      },
      {
        role: 'QA Automation Engineer',
        count: 1,
        involvementWeeks: Math.max(2, Math.round(timelineWeeks * 0.5)),
        monthlyRate: Math.round(baseMonthlyRate * 0.85),
        responsibilities: ['Test strategy', 'Automated E2E test scripts', 'Cross-browser validation', 'Bug tracking']
      },
      {
        role: 'DevOps / Cloud Engineer',
        count: 1,
        involvementWeeks: Math.max(1, Math.round(timelineWeeks * 0.25)),
        monthlyRate: Math.round(baseMonthlyRate * 1.15),
        responsibilities: ['CI/CD pipeline', 'Container orchestration', 'Cloud infrastructure as code', 'Monitoring setup']
      }
    ];

    return roles;
  }

  private calculateScenarioEstimates(
    features: ProjectFeature[],
    params: ProjectParameters,
    tech: TechnicalStack,
    hourlyRate: number,
    currency: string
  ): { scenarios: Scenario[]; lean: CostBreakdown; standard: CostBreakdown; growth: CostBreakdown } {
    const leanFeatures = features.filter(feature => feature.priority === 'must_have' && feature.scope === 'mvp');
    const standardFeatures = features.filter(feature => feature.scope !== 'future');
    const lean = this.calculateCostBreakdown(leanFeatures.length ? leanFeatures : features, params, tech, hourlyRate, currency);
    const standard = this.calculateCostBreakdown(standardFeatures.length ? standardFeatures : features, params, tech, hourlyRate, currency);
    const growth = this.calculateCostBreakdown(features, params, tech, hourlyRate, currency);
    const timeline = (cost: CostBreakdown) =>
      this.calculateRealisticTimelineWeeks(cost.totalHours, params.deliveryTimeline, params.hiringModel);
    const uncertainty = 0.1;
    const featureNames = (items: ProjectFeature[]) => items.slice(0, 3).map(feature => feature.name);
    const format = (amount: number) => this.rateCard.formatCurrency(amount, currency);
    const deferredForLean = features.filter(feature => !leanFeatures.includes(feature));
    const deferredForStandard = features.filter(feature => !standardFeatures.includes(feature));

    return {
      lean,
      standard,
      growth,
      scenarios: [
        {
          id: 'mvp',
          name: 'Lean MVP',
          badge: 'Lowest Cost',
          description: 'Launch with only the essential workflows needed to validate demand.',
          budgetMin: Math.round(lean.totalBudget * (1 - uncertainty)),
          budgetMax: Math.round(lean.totalBudget * (1 + uncertainty)),
          timelineWeeks: timeline(lean),
          totalHours: lean.totalHours,
          scopeSummary: 'Must-have MVP features, reusable UI patterns, managed hosting, and essential testing.',
          tradeoffs: [
            `${deferredForLean.length} non-essential feature(s) postponed`,
            ...(deferredForLean.length
              ? [`Defer ${featureNames(deferredForLean).join(', ')}; save about ${format(Math.max(0, standard.totalBudget - lean.totalBudget))} versus Startup Standard`]
              : ['No optional features are included in this estimate']),
            'Add optional workflows after validating the first release with customers'
          ],
          includedFeaturesCount: (leanFeatures.length || features.length)
        },
        {
          id: 'recommended',
          name: 'Startup Standard',
          badge: 'Recommended',
          description: 'A practical first release with core workflows and selected useful follow-up features.',
          budgetMin: Math.round(standard.totalBudget * (1 - uncertainty)),
          budgetMax: Math.round(standard.totalBudget * (1 + uncertainty)),
          timelineWeeks: timeline(standard),
          totalHours: standard.totalHours,
          scopeSummary: 'All MVP and should-have features, standard QA, and a modest cloud setup.',
          tradeoffs: [
            `${deferredForStandard.length} future feature(s) left for a later release`,
            ...(deferredForStandard.length
              ? [`Postpone ${featureNames(deferredForStandard).join(', ')} to save about ${format(Math.max(0, growth.totalBudget - standard.totalBudget))} versus Growth Ready`]
              : ['The planned feature list is included']),
            'Keep integrations and hosting to managed services appropriate for an early-stage launch'
          ],
          includedFeaturesCount: (standardFeatures.length || features.length)
        },
        {
          id: 'premium',
          name: 'Growth Ready',
          badge: 'Full Planned Scope',
          description: 'Include the complete feature list with additional room for growth and operational polish.',
          budgetMin: Math.round(growth.totalBudget * (1 - uncertainty)),
          budgetMax: Math.round(growth.totalBudget * (1 + uncertainty)),
          timelineWeeks: timeline(growth),
          totalHours: growth.totalHours,
          scopeSummary: 'All planned features, including future-scope capabilities, plus standard QA and deployment.',
          tradeoffs: [
            'Higher initial investment to deliver the complete planned scope',
            'Future-scope features are included in the first delivery',
            'Scale infrastructure later based on actual usage instead of paying for it upfront'
          ],
          includedFeaturesCount: features.length
        }
      ]
    };
  }

  private calculateCostBreakdown(
    features: ProjectFeature[],
    params: ProjectParameters,
    tech: TechnicalStack,
    hourlyRate: number,
    currency: string
  ): CostBreakdown {
    const featureHours = features.reduce((sum, feature) => sum + feature.estimatedHours, 0);
    const aiHours = tech.aiRequirements === 'basic_prompting'
      ? 8
      : tech.aiRequirements === 'rag_fine_tuning'
        ? 20
        : tech.aiRequirements === 'custom_ml_pipeline'
          ? 45
          : 0;
    const testingMultiplier = params.testingLevel === 'automated_e2e' ? 1.18 : params.testingLevel === 'standard' ? 1.08 : 1;
    const urgencyMultiplier = params.deliveryTimeline === 'urgent' ? 1.15 : params.deliveryTimeline === 'flexible' ? 1 : 1.05;
    const totalHours = Math.max(1, Math.ceil((featureHours + aiHours) * 1.25 * testingMultiplier * urgencyMultiplier));
    const laborCost = totalHours * hourlyRate;
    const deploymentInr = params.deploymentType === 'multi_region_k8s'
      ? 6000
      : params.deploymentType === 'serverless'
        ? 1500
        : 2500;
    const aiSetupInr = tech.aiRequirements === 'basic_prompting'
      ? 1000
      : tech.aiRequirements === 'rag_fine_tuning'
        ? 3000
        : tech.aiRequirements === 'custom_ml_pipeline'
          ? 8000
          : 0;
    const maintenanceCost = params.maintenanceIncluded ? Math.round(laborCost * 0.1) : 0;
    const additionalExpenses = this.rateCard.convertFromInr(deploymentInr + aiSetupInr, currency) + maintenanceCost;
    const subtotal = laborCost + additionalExpenses;
    const contingencyPercent = params.deliveryTimeline === 'urgent' ? 15 : 10;
    const contingencyAmount = Math.round(subtotal * contingencyPercent / 100);

    return {
      featureHours,
      totalHours,
      laborCost,
      additionalExpenses,
      subtotal,
      contingencyPercent,
      contingencyAmount,
      totalBudget: subtotal + contingencyAmount
    };
  }

  private generateAIInsights(
    category: ProjectCategory,
    features: ProjectFeature[],
    tech: TechnicalStack,
    params: ProjectParameters,
    budget: number,
    currency: string,
    targetBudget?: number,
    leanBudget?: number
  ): AIInsight {
    const complexFeatures = features.filter(f => f.complexity === 'complex');
    const mustHaveFeatures = features.filter(f => f.priority === 'must_have');

    let complexityText = `${category} estimate based on ${features.length} scoped features, adjusted for delivery complexity and team rates. `;
    if (complexFeatures.length > 3) {
      complexityText += `${complexFeatures.length} complex features (${complexFeatures.slice(0, 3).map(f => f.name).join(', ')}) are the main effort drivers. `;
    }

    if (tech.aiRequirements !== 'none') {
      complexityText += `AI capability (${tech.aiRequirements.replace(/_/g, ' ')}) adds implementation and initial setup cost.`;
    } else {
      complexityText += `The estimate assumes a conventional managed application stack, not enterprise-scale infrastructure.`;
    }

    const complexCost = complexFeatures.reduce((sum, feature) => sum + feature.estimatedCost, 0);
    const featureCost = features.reduce((sum, feature) => sum + feature.estimatedCost, 0);
    const optionalFeatures = features
      .filter(feature => feature.priority !== 'must_have' || feature.scope !== 'mvp')
      .sort((a, b) => b.estimatedCost - a.estimatedCost);
    const costDrivers = [
      `${complexFeatures.length} complex feature(s) account for ${featureCost ? Math.round(complexCost / featureCost * 100) : 0}% of feature-level development cost`,
      `${tech.platform.replace(/_/g, ' ')} delivery with ${params.designComplexity.replace(/_/g, ' ')} design`,
      `${params.testingLevel.replace(/_/g, ' ')} QA and ${params.deliveryTimeline.replace(/_/g, ' ')} delivery`,
      `${params.hiringModel.replace(/_/g, ' ')} rates in ${params.region.replace(/_/g, ' ')}`
    ];

    const identifiedRisks = [
      'Changes to requirements after development begins may add hours and cost',
      'Payment, messaging, maps, and other third-party usage fees depend on provider plans',
      tech.aiRequirements !== 'none' ? 'AI provider usage charges vary with traffic and model choice' : 'Hosting and database plans may need to increase as usage grows',
      params.deliveryTimeline === 'urgent' ? 'Fast delivery leaves less time for review and may increase rework' : 'Delayed content or feedback can extend the delivery schedule'
    ];

    const hiddenCosts = [
      'Domain, payment gateway, email, maps, and other provider charges are usage-dependent',
      'Cloud hosting and database bills recur after the included initial setup',
      'App store registration fees apply only if native apps are published',
      'Ongoing support or maintenance beyond the selected estimate is not included unless selected'
    ];

    const recommendedMvpScope = mustHaveFeatures.length > 0
      ? mustHaveFeatures.map(f => f.name)
      : features.slice(0, 4).map(f => f.name);

    const costOptimizationSuggestions = [];
    if (targetBudget && budget > targetBudget) {
      const currentScope = features.filter(feature => feature.scope !== 'future');
      let projectedCost = budget;
      const hourlyRate = this.rateCard.convertFromInr(
        this.rateCard.getHourlyRate(params.hiringModel, params.region),
        currency
      );
      for (const feature of optionalFeatures) {
        if (projectedCost <= targetBudget) break;
        const index = currentScope.findIndex(item => item.id === feature.id);
        if (index < 0) continue;
        const before = projectedCost;
        currentScope.splice(index, 1);
        projectedCost = this.calculateCostBreakdown(currentScope, params, tech, hourlyRate, currency).totalBudget;
        const saving = Math.max(0, before - projectedCost);
        costOptimizationSuggestions.push(
          `Postpone ${feature.name} to save about ${this.rateCard.formatCurrency(saving, currency)}.`
        );
      }

      if (projectedCost > targetBudget) {
        costOptimizationSuggestions.push(
          `The Lean MVP estimate starts at about ${this.rateCard.formatCurrency(leanBudget ?? projectedCost, currency)}. To meet your target, simplify a must-have feature or negotiate a lower delivery rate.`
        );
      } else {
        costOptimizationSuggestions.push(
          `These scope changes bring the estimate to about ${this.rateCard.formatCurrency(projectedCost, currency)}, within your ${this.rateCard.formatCurrency(targetBudget, currency)} target.`
        );
      }
    } else if (optionalFeatures.length > 0) {
      const optionalCost = features
        .filter(feature => optionalFeatures.some(optional => optional.id === feature.id))
        .reduce((sum, feature) => sum + feature.estimatedCost, 0);
      costOptimizationSuggestions.push(
        `If the Startup Standard estimate exceeds your budget, postpone ${optionalFeatures.slice(0, 3).map(feature => feature.name).join(', ')} first; these features account for about ${this.rateCard.formatCurrency(optionalCost, currency)} in feature development.`
      );
    } else {
      costOptimizationSuggestions.push('Keep the MVP focused on the listed must-have features; add new requirements only after validating the first release.');
    }
    costOptimizationSuggestions.push(
      'Use managed hosting and established UI components, and defer bespoke infrastructure until usage requires it.'
    );

    return {
      complexityAssessment: complexityText,
      costDrivers,
      identifiedRisks,
      hiddenCosts,
      recommendedMvpScope,
      costOptimizationSuggestions
    };
  }

  private generateAssumptions(params: ProjectParameters, tech: TechnicalStack, contingency: number): string[] {
    return [
      `The ${params.hiringModel.replace(/_/g, ' ')} rate uses the configurable ${params.region.replace(/_/g, ' ')} hourly rate card.`,
      `Effort includes a 25% allowance for planning, integration, testing, and release work.`,
      `A ${contingency}% contingency is included for ordinary scope and delivery uncertainty.`,
      `Infrastructure is a modest initial setup estimate; recurring provider bills are excluded.`,
      params.maintenanceIncluded ? 'One initial maintenance reserve is included in additional expenses.' : 'Post-launch maintenance is not included.',
      `All estimates are illustrative decision-support models and should be calibrated with final engineering statements of work.`
    ];
  }

  private calculateConfidenceScore(featureCount: number, tech: TechnicalStack, params: ProjectParameters): number {
    let score = 88;
    if (featureCount >= 8) score += 3;
    if (featureCount < 3) score -= 8;
    if (tech.aiRequirements === 'custom_ml_pipeline') score -= 5;
    if (params.deliveryTimeline === 'urgent') score -= 4;
    return Math.max(65, Math.min(95, score));
  }
}
