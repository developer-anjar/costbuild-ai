import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { EstimateService } from '../../core/services/estimate.service';
import { EstimationEngineService } from '../../core/services/estimation-engine.service';
import { NotificationService } from '../../core/services/notification.service';
import { RateCardService } from '../../core/services/rate-card.service';
import {
  ProjectCategory,
  ProjectFeature,
  FeatureComplexity,
  FeaturePriority,
  FeatureScope,
  PlatformType,
  RegionKey,
  HiringModelKey,
  DeliveryTimelineKey,
  DesignComplexityKey,
  TechnicalStack,
  ProjectParameters
} from '../../core/models/estimate.model';
import { AppIconComponent } from '../../shared/components/app-icon/app-icon.component';

@Component({
  selector: 'app-estimate-wizard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, AppIconComponent],
  templateUrl: './estimate-wizard.component.html',
  styleUrl: './estimate-wizard.component.scss'
})
export class EstimateWizardComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly estimateService = inject(EstimateService);
  private readonly engine = inject(EstimationEngineService);
  private readonly notify = inject(NotificationService);
  private readonly router = inject(Router);
  readonly rateCard = inject(RateCardService);

  readonly currentStep = signal<number>(1);
  readonly isGenerating = signal<boolean>(false);
  readonly generatingStepMessage = signal<string>('Initializing requirement analysis...');

  // Step 1 Form
  readonly step1Form: FormGroup = this.fb.group({
    projectName: ['', [Validators.required, Validators.minLength(3)]],
    category: ['SaaS Platform' as ProjectCategory, [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(15)]],
    targetAudience: ['Enterprise teams and startup operators', [Validators.required]],
    industry: ['Technology / Cloud Services', [Validators.required]],
    objective: ['Build a scalable, reliable software foundation to drive revenue.']
  });

  // Step 2 Features List
  readonly features = signal<ProjectFeature[]>([]);
  readonly newFeatureName = signal<string>('');
  readonly newFeatureDesc = signal<string>('');
  readonly newFeatureComplexity = signal<FeatureComplexity>('medium');
  readonly newFeaturePriority = signal<FeaturePriority>('must_have');
  readonly newFeatureScope = signal<FeatureScope>('mvp');

  // Step 3 Technical Configuration Form
  readonly step3Form: FormGroup = this.fb.group({
    platform: ['web' as PlatformType, [Validators.required]],
    frontend: ['Angular', [Validators.required]],
    backend: ['Node.js (NestJS)', [Validators.required]],
    database: ['PostgreSQL', [Validators.required]],
    authentication: ['JWT & OAuth (Google/GitHub)', [Validators.required]],
    integrationsText: ['Stripe, SendGrid, Sentry'],
    aiRequirements: ['none'],
    hosting: ['Cloud Managed (AWS ECS / Google Cloud Run)']
  });

  // Step 4 Parameters Form
  readonly step4Form: FormGroup = this.fb.group({
    targetBudget: [null, [Validators.min(0)]],
    region: ['india' as RegionKey, [Validators.required]],
    hiringModel: ['small_agency' as HiringModelKey, [Validators.required]],
    deliveryTimeline: ['standard' as DeliveryTimelineKey, [Validators.required]],
    qualityExpectation: ['standard', [Validators.required]],
    designComplexity: ['standard' as DesignComplexityKey, [Validators.required]],
    userScale: ['growth', [Validators.required]],
    maintenanceIncluded: [true],
    testingLevel: ['standard', [Validators.required]],
    deploymentType: ['standard_cloud', [Validators.required]]
  });

  // Example chip presets for Step 1
  readonly exampleProjects = [
    {
      title: 'E-commerce Platform',
      category: 'E-commerce' as ProjectCategory,
      desc: 'B2C online storefront with product catalog, cart, discount vouchers, payment gateway, and customer order tracking.'
    },
    {
      title: 'Food Delivery Platform',
      category: 'Mobile Application' as ProjectCategory,
      desc: 'On-demand mobile delivery connecting diners, restaurants, and freelance couriers with real-time GPS tracking and instant payouts.'
    },
    {
      title: 'AI SaaS Dashboard',
      category: 'AI Application' as ProjectCategory,
      desc: 'AI-assisted analytics workspace offering natural language query generation, subscription billing, and multi-tenant security.'
    },
    {
      title: 'Student Management System',
      category: 'Business Management System' as ProjectCategory,
      desc: 'Institutional administration portal for attendance, grade reports, tuition fees, faculty scheduling, and parent notifications.'
    }
  ];

  // Suggested features for Step 2
  readonly suggestedFeatures = [
    { name: 'Authentication & SSO', desc: 'Secure email/password, social logins, and password reset flows', complexity: 'simple', priority: 'must_have' },
    { name: 'User Management & Roles', desc: 'Granular permissions, profile editing, and team invitations', complexity: 'medium', priority: 'must_have' },
    { name: 'Analytics & Reporting Dashboard', desc: 'Real-time metrics, Chart.js visualizations, and date range filters', complexity: 'medium', priority: 'must_have' },
    { name: 'Payment Gateway Integration', desc: 'Stripe or Razorpay checkout, subscription webhooks, and invoice receipts', complexity: 'complex', priority: 'must_have' },
    { name: 'Instant Push & Email Notifications', desc: 'Transactional emails and in-app alert center', complexity: 'simple', priority: 'should_have' },
    { name: 'AI LLM Assistant Integration', desc: 'Generative AI completions, prompt templates, and streaming responses', complexity: 'complex', priority: 'should_have' },
    { name: 'Admin Operations Portal', desc: 'User moderation, audit logs, and system configuration toggles', complexity: 'medium', priority: 'must_have' },
    { name: 'Faceted Search & Filters', desc: 'Multi-attribute fast indexed query search', complexity: 'medium', priority: 'should_have' },
    { name: 'Reports & Data Export (PDF/CSV)', desc: 'Background report generation and spreadsheet export', complexity: 'simple', priority: 'should_have' },
    { name: 'Third-Party Webhooks & Integrations', desc: 'External REST API integration and automated sync jobs', complexity: 'medium', priority: 'nice_to_have' }
  ];

  ngOnInit(): void {
    // Check for draft from landing page or previous session
    const draft = this.estimateService.wizardDraft();
    if (draft) {
      if (draft.overview) {
        this.step1Form.patchValue(draft.overview);
      }
      if (draft.features && Array.isArray(draft.features) && draft.features.length > 0) {
        this.features.set(draft.features);
      } else {
        this.seedInitialFeatures();
      }
      if (draft.techStack) {
        this.step3Form.patchValue(draft.techStack);
      }
      if (draft.parameters) {
        this.step4Form.patchValue(draft.parameters);
      }
    } else {
      this.seedInitialFeatures();
    }
  }

  private seedInitialFeatures(): void {
    this.features.set([
      { id: 'f_auth', name: 'Authentication & Session Security', description: 'User registration, login, and password recovery', complexity: 'simple', priority: 'must_have', scope: 'mvp', estimatedHours: 4, estimatedCost: 0 },
      { id: 'f_dash', name: 'Core Application Dashboard', description: 'Overview of key records and recent activity', complexity: 'medium', priority: 'must_have', scope: 'mvp', estimatedHours: 10, estimatedCost: 0 },
      { id: 'f_pay', name: 'Payment & Checkout Processing', description: 'Payment-provider checkout and payment confirmation', complexity: 'complex', priority: 'must_have', scope: 'mvp', estimatedHours: 22, estimatedCost: 0 },
      { id: 'f_notif', name: 'Email Notifications', description: 'Transactional email updates for key account and payment events', complexity: 'simple', priority: 'should_have', scope: 'full', estimatedHours: 4, estimatedCost: 0 }
    ]);
  }

  applyExamplePreset(preset: typeof this.exampleProjects[0]): void {
    this.step1Form.patchValue({
      projectName: preset.title,
      category: preset.category,
      description: preset.desc
    });
    this.notify.info(`Preset applied: ${preset.title}`);
  }

  addSuggestedFeature(sug: any): void {
    const existing = this.features().find(f => f.name.toLowerCase() === sug.name.toLowerCase());
    if (existing) {
      this.notify.warning(`Feature "${sug.name}" is already in your requirements list.`);
      return;
    }

    const feature: ProjectFeature = {
      id: 'f_' + Math.random().toString(36).substring(2, 7),
      name: sug.name,
      description: sug.desc,
      complexity: sug.complexity as FeatureComplexity,
      priority: sug.priority as FeaturePriority,
      scope: 'mvp',
      estimatedHours: 0,
      estimatedCost: 0
    };

    this.features.update(f => [...f, feature]);
    this.notify.success(`Added "${feature.name}"`);
  }

  addCustomFeature(): void {
    const name = this.newFeatureName().trim();
    if (!name) {
      this.notify.warning('Please enter a feature name.');
      return;
    }

    const feature: ProjectFeature = {
      id: 'f_' + Math.random().toString(36).substring(2, 7),
      name,
      description: this.newFeatureDesc().trim() || 'Custom user-specified capability requirement',
      complexity: this.newFeatureComplexity(),
      priority: this.newFeaturePriority(),
      scope: this.newFeatureScope(),
      estimatedHours: 0,
      estimatedCost: 0
    };

    this.features.update(f => [...f, feature]);
    this.newFeatureName.set('');
    this.newFeatureDesc.set('');
    this.notify.success(`Feature "${feature.name}" added.`);
  }

  removeFeature(id: string): void {
    this.features.update(list => list.filter(f => f.id !== id));
  }

  updateFeatureComplexity(id: string, complexity: FeatureComplexity): void {
    this.features.update(list =>
      list.map(f => (f.id === id ? { ...f, complexity } : f))
    );
  }

  updateFeaturePriority(id: string, priority: FeaturePriority): void {
    this.features.update(list =>
      list.map(f => (f.id === id ? { ...f, priority } : f))
    );
  }

  goToStep(step: number): void {
    if (step < this.currentStep()) {
      this.currentStep.set(step);
      return;
    }

    // Validate step before advancing
    if (this.currentStep() === 1) {
      if (this.step1Form.invalid) {
        this.step1Form.markAllAsTouched();
        this.notify.warning('Please complete the project name and description.');
        return;
      }
    } else if (this.currentStep() === 2) {
      if (this.features().length === 0) {
        this.notify.warning('Please add at least one feature to estimate.');
        return;
      }
    } else if (this.currentStep() === 3) {
      if (this.step3Form.invalid) {
        this.step3Form.markAllAsTouched();
        return;
      }
    } else if (this.currentStep() === 4) {
      if (this.step4Form.invalid) {
        this.step4Form.markAllAsTouched();
        return;
      }
    }

    this.saveDraftState();
    this.currentStep.set(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private saveDraftState(): void {
    this.estimateService.saveDraft({
      step: this.currentStep(),
      overview: this.step1Form.value,
      features: this.features(),
      techStack: this.step3Form.value,
      parameters: this.step4Form.value
    });
  }

  generateEstimate(): void {
    this.isGenerating.set(true);

    const steps = [
      'Decomposing feature modules and API contracts...',
      'Evaluating regional developer rate card benchmarks...',
      'Calculating concurrency-adjusted sprint timeline...',
      'Simulating Lean MVP vs Startup Standard build scenarios...',
      'Generating AI risk analysis and cost drivers...',
      'Finalizing board-ready estimation report...'
    ];

    let currentMsgIdx = 0;
    const interval = setInterval(() => {
      currentMsgIdx++;
      if (currentMsgIdx < steps.length) {
        this.generatingStepMessage.set(steps[currentMsgIdx]);
      }
    }, 400);

    setTimeout(() => {
      clearInterval(interval);
      this.isGenerating.set(false);

      const overview = this.step1Form.value;
      const techVal = this.step3Form.value;
      const paramsVal = this.step4Form.value;

      const techStack: TechnicalStack = {
        platform: techVal.platform,
        frontend: techVal.frontend,
        backend: techVal.backend,
        database: techVal.database,
        authentication: techVal.authentication,
        integrations: techVal.integrationsText ? techVal.integrationsText.split(',').map((s: string) => s.trim()) : [],
        aiRequirements: techVal.aiRequirements,
        hosting: techVal.hosting
      };

      const parameters: ProjectParameters = {
        region: paramsVal.region,
        hiringModel: paramsVal.hiringModel,
        deliveryTimeline: paramsVal.deliveryTimeline,
        qualityExpectation: paramsVal.qualityExpectation,
        designComplexity: paramsVal.designComplexity,
        userScale: paramsVal.userScale,
        maintenanceIncluded: paramsVal.maintenanceIncluded,
        testingLevel: paramsVal.testingLevel,
        deploymentType: paramsVal.deploymentType
      };

      const generated = this.engine.generateEstimate({
        projectName: overview.projectName,
        category: overview.category,
        description: overview.description,
        targetAudience: overview.targetAudience,
        industry: overview.industry,
        objective: overview.objective,
        features: this.features(),
        techStack,
        parameters,
        currency: 'INR',
        targetBudget: Number(paramsVal.targetBudget) > 0 ? Number(paramsVal.targetBudget) : undefined
      });

      this.estimateService.saveEstimate(generated);
      this.estimateService.clearDraft();
      this.router.navigate(['/app/estimates', generated.id]);
    }, 2400);
  }

  // Feature stats computed
  get mustHaveCount(): number {
    return this.features().filter(f => f.priority === 'must_have').length;
  }

  get complexCount(): number {
    return this.features().filter(f => f.complexity === 'complex').length;
  }
}
