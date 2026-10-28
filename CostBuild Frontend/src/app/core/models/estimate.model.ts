export type ProjectCategory =
  | 'SaaS Platform'
  | 'E-commerce'
  | 'Marketplace'
  | 'Mobile Application'
  | 'Business Management System'
  | 'AI Application'
  | 'Portfolio or Marketing Website'
  | 'Internal Enterprise Tool'
  | 'Other';

export type FeatureComplexity = 'simple' | 'medium' | 'complex';
export type FeaturePriority = 'must_have' | 'should_have' | 'nice_to_have';
export type FeatureScope = 'mvp' | 'full' | 'future';

export interface ProjectFeature {
  id: string;
  name: string;
  description: string;
  complexity: FeatureComplexity;
  priority: FeaturePriority;
  scope: FeatureScope;
  estimatedHours: number;
  estimatedCost: number;
  category?: string;
}

export type PlatformType = 'web' | 'mobile' | 'desktop' | 'multi_platform';

export interface TechnicalStack {
  platform: PlatformType;
  frontend: string;
  backend: string;
  database: string;
  authentication: string;
  integrations: string[];
  aiRequirements: 'none' | 'basic_prompting' | 'rag_fine_tuning' | 'custom_ml_pipeline';
  hosting: string;
}

export type RegionKey =
  | 'india'
  | 'us_canada'
  | 'western_europe'
  | 'eastern_europe'
  | 'latam'
  | 'southeast_asia';

export type HiringModelKey =
  | 'freelancer'
  | 'small_agency'
  | 'established_agency'
  | 'in_house'
  | 'mixed';

export type DeliveryTimelineKey = 'flexible' | 'standard' | 'urgent';
export type QualityExpectationKey = 'mvp' | 'standard' | 'enterprise';
export type DesignComplexityKey = 'minimal' | 'standard' | 'premium_custom';
export type UserScaleKey = 'early_stage' | 'growth' | 'enterprise';
export type TestingLevelKey = 'basic' | 'standard' | 'automated_e2e';
export type DeploymentTypeKey = 'standard_cloud' | 'serverless' | 'multi_region_k8s';

export interface ProjectParameters {
  region: RegionKey;
  hiringModel: HiringModelKey;
  deliveryTimeline: DeliveryTimelineKey;
  qualityExpectation: QualityExpectationKey;
  designComplexity: DesignComplexityKey;
  userScale: UserScaleKey;
  maintenanceIncluded: boolean;
  testingLevel: TestingLevelKey;
  deploymentType: DeploymentTypeKey;
}

export interface DevelopmentPhase {
  id: string;
  name: string;
  description: string;
  hours: number;
  cost: number;
  percentage: number;
  durationWeeks: number;
  startWeek: number;
  endWeek: number;
}

export interface TeamRecommendation {
  role: string;
  count: number;
  involvementWeeks: number;
  monthlyRate: number;
  responsibilities: string[];
}

export interface Scenario {
  id: 'mvp' | 'recommended' | 'premium';
  name: string;
  badge: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  timelineWeeks: number;
  totalHours: number;
  scopeSummary: string;
  tradeoffs: string[];
  includedFeaturesCount: number;
}

export interface AIInsight {
  complexityAssessment: string;
  costDrivers: string[];
  identifiedRisks: string[];
  hiddenCosts: string[];
  recommendedMvpScope: string[];
  costOptimizationSuggestions: string[];
}

export interface Estimate {
  id: string;
  projectName: string;
  description: string;
  category: ProjectCategory;
  targetAudience: string;
  industry: string;
  objective: string;
  features: ProjectFeature[];
  techStack: TechnicalStack;
  parameters: ProjectParameters;
  currency: string;
  targetBudget?: number;
  totalHours: number;
  laborCost: number;
  designCost: number;
  testingCost: number;
  deploymentCost: number;
  additionalExpenses: number;
  subtotal: number;
  contingencyPercent: number;
  contingencyAmount: number;
  totalBudget: number;
  budgetRange: { min: number; max: number };
  timelineWeeks: number;
  confidenceScore: number;
  phases: DevelopmentPhase[];
  team: TeamRecommendation[];
  scenarios: Scenario[];
  insights: AIInsight;
  assumptions: string[];
  createdAt: string;
  updatedAt: string;
  isSample?: boolean;
}
