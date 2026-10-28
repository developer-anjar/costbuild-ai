import { EstimationEngineService } from './estimation-engine.service';
import { Estimate, ProjectFeature, ProjectParameters, TechnicalStack } from '../models/estimate.model';

export function createInitialDemoEstimates(engine: EstimationEngineService): Estimate[] {
  const foodDeliveryFeatures: ProjectFeature[] = [
    { id: 'fd_1', name: 'Order Status and Delivery Tracking', description: 'Show order progress and share a delivery location while an order is active.', complexity: 'medium', priority: 'must_have', scope: 'mvp', estimatedHours: 0, estimatedCost: 0 },
    { id: 'fd_2', name: 'Restaurant Menu and Availability', description: 'Let restaurant staff manage menu items, prices, opening hours, and sold-out items.', complexity: 'medium', priority: 'must_have', scope: 'mvp', estimatedHours: 0, estimatedCost: 0 },
    { id: 'fd_3', name: 'Online Payments and Refunds', description: 'Accept online payments and support order cancellations and basic refunds through a payment provider.', complexity: 'complex', priority: 'must_have', scope: 'mvp', estimatedHours: 0, estimatedCost: 0 },
    { id: 'fd_4', name: 'Delivery Partner Order Handoff', description: 'Assign an order to an available courier and record pickup and delivery status.', complexity: 'medium', priority: 'must_have', scope: 'mvp', estimatedHours: 0, estimatedCost: 0 },
    { id: 'fd_5', name: 'Order Confirmation Notifications', description: 'Send order confirmations and status updates by push notification or email.', complexity: 'simple', priority: 'must_have', scope: 'mvp', estimatedHours: 0, estimatedCost: 0 },
    { id: 'fd_6', name: 'Restaurant Operations Dashboard', description: 'Give restaurant staff a view of incoming orders, preparation status, and completed orders.', complexity: 'medium', priority: 'must_have', scope: 'mvp', estimatedHours: 0, estimatedCost: 0 },
    { id: 'fd_7', name: 'Customer Ratings and Feedback', description: 'Allow customers to rate completed orders and leave a short review.', complexity: 'simple', priority: 'should_have', scope: 'full', estimatedHours: 0, estimatedCost: 0 },
    { id: 'fd_8', name: 'Cart, Checkout, and Delivery Fees', description: 'Calculate the order total, delivery fee, taxes, and any basic discount code.', complexity: 'medium', priority: 'must_have', scope: 'mvp', estimatedHours: 0, estimatedCost: 0 },
    { id: 'fd_9', name: 'Repeat Orders and Saved Favourites', description: 'Let returning customers reorder from their recent orders or saved restaurants.', complexity: 'simple', priority: 'nice_to_have', scope: 'future', estimatedHours: 0, estimatedCost: 0 }
  ];

  const fdTech: TechnicalStack = {
    platform: 'mobile',
    frontend: 'Flutter mobile app (single codebase)',
    backend: 'Node.js (NestJS)',
    database: 'PostgreSQL',
    authentication: 'Email/phone sign-in with OTP',
    integrations: ['Razorpay', 'Google Maps', 'Firebase Cloud Messaging'],
    aiRequirements: 'none',
    hosting: 'AWS managed application services'
  };

  const fdParams: ProjectParameters = {
    region: 'india',
    hiringModel: 'small_agency',
    deliveryTimeline: 'standard',
    qualityExpectation: 'standard',
    designComplexity: 'standard',
    userScale: 'early_stage',
    maintenanceIncluded: false,
    testingLevel: 'standard',
    deploymentType: 'standard_cloud'
  };

  const foodDelivery = engine.generateEstimate({
    id: 'est_food_delivery',
    projectName: 'Local Restaurant Ordering App',
    description: 'A first release for a group of neighbourhood restaurants to publish menus, accept online orders, and coordinate local deliveries.',
    category: 'Mobile Application',
    targetAudience: 'Local restaurant customers, restaurant staff, and delivery partners',
    industry: 'Food & Beverage',
    objective: 'Launch online ordering for a small restaurant group in one city.',
    features: foodDeliveryFeatures,
    techStack: fdTech,
    parameters: fdParams,
    currency: 'INR'
  });
  foodDelivery.isSample = true;

  const lmsFeatures: ProjectFeature[] = [
    { id: 'lms_1', name: 'Course Catalog and Lesson Pages', description: 'Publish courses with lesson content, downloadable resources, and basic access controls.', complexity: 'medium', priority: 'must_have', scope: 'mvp', estimatedHours: 0, estimatedCost: 0 },
    { id: 'lms_2', name: 'Student Enrolment and Progress', description: 'Track enrolments, lesson completion, and course progress for each student.', complexity: 'medium', priority: 'must_have', scope: 'mvp', estimatedHours: 0, estimatedCost: 0 },
    { id: 'lms_3', name: 'Hosted Lesson Video Playback', description: 'Embed hosted lesson videos and restrict course pages to enrolled students.', complexity: 'medium', priority: 'must_have', scope: 'mvp', estimatedHours: 0, estimatedCost: 0 },
    { id: 'lms_4', name: 'Course Completion Certificates', description: 'Generate a downloadable certificate when a student completes a course.', complexity: 'simple', priority: 'should_have', scope: 'full', estimatedHours: 0, estimatedCost: 0 },
    { id: 'lms_5', name: 'Practice Quizzes', description: 'Create short quizzes with multiple-choice questions and show scores after submission.', complexity: 'medium', priority: 'should_have', scope: 'full', estimatedHours: 0, estimatedCost: 0 },
    { id: 'lms_6', name: 'Student Questions and Announcements', description: 'Provide a basic course discussion area and let instructors post updates.', complexity: 'medium', priority: 'should_have', scope: 'full', estimatedHours: 0, estimatedCost: 0 },
    { id: 'lms_7', name: 'Course Payments and Enrolment', description: 'Collect a one-time course payment and enrol the student after successful checkout.', complexity: 'medium', priority: 'must_have', scope: 'mvp', estimatedHours: 0, estimatedCost: 0 }
  ];

  const lmsTech: TechnicalStack = {
    platform: 'web',
    frontend: 'Angular',
    backend: 'Spring Boot',
    database: 'PostgreSQL',
    authentication: 'Email and password with password reset',
    integrations: ['Razorpay', 'AWS S3-compatible video hosting', 'Email provider'],
    aiRequirements: 'none',
    hosting: 'AWS managed application services'
  };

  const lmsParams: ProjectParameters = {
    region: 'india',
    hiringModel: 'small_agency',
    deliveryTimeline: 'standard',
    qualityExpectation: 'standard',
    designComplexity: 'standard',
    userScale: 'early_stage',
    maintenanceIncluded: false,
    testingLevel: 'standard',
    deploymentType: 'standard_cloud'
  };

  const lms = engine.generateEstimate({
    id: 'est_ai_lms',
    projectName: 'Coaching Institute Learning Portal',
    description: 'A course portal for a regional coaching institute to publish recorded lessons, manage student enrolments, and track course progress.',
    category: 'SaaS Platform',
    targetAudience: 'Students, instructors, and course administrators',
    industry: 'Education and Training',
    objective: 'Move course materials and student progress tracking into one easy-to-manage portal.',
    features: lmsFeatures,
    techStack: lmsTech,
    parameters: lmsParams,
    currency: 'INR'
  });
  lms.isSample = true;

  const marketplaceFeatures: ProjectFeature[] = [
    { id: 'mp_1', name: 'Seller Registration and Review', description: 'Collect seller contact and business details, then let an administrator approve each account.', complexity: 'medium', priority: 'must_have', scope: 'mvp', estimatedHours: 0, estimatedCost: 0 },
    { id: 'mp_2', name: 'Seller Orders and Commission Records', description: 'Record order totals and the platform commission for administrator review and settlement.', complexity: 'complex', priority: 'must_have', scope: 'mvp', estimatedHours: 0, estimatedCost: 0 },
    { id: 'mp_3', name: 'Product Catalog and Stock', description: 'Let sellers manage product details, prices, images, and available stock.', complexity: 'medium', priority: 'must_have', scope: 'mvp', estimatedHours: 0, estimatedCost: 0 },
    { id: 'mp_4', name: 'Product Search and Category Filters', description: 'Help customers find products by name, category, and price range.', complexity: 'medium', priority: 'must_have', scope: 'mvp', estimatedHours: 0, estimatedCost: 0 },
    { id: 'mp_5', name: 'Order Confirmation and Shipping Updates', description: 'Send order confirmations and store shipment details from the chosen courier service.', complexity: 'medium', priority: 'must_have', scope: 'mvp', estimatedHours: 0, estimatedCost: 0 },
    { id: 'mp_6', name: 'Returns and Refund Requests', description: 'Allow a customer to request a return and let an administrator record the resolution.', complexity: 'medium', priority: 'should_have', scope: 'full', estimatedHours: 0, estimatedCost: 0 },
    { id: 'mp_7', name: 'Customer Questions for Sellers', description: 'Provide a simple form for pre-purchase questions, routed to the seller by email.', complexity: 'simple', priority: 'nice_to_have', scope: 'future', estimatedHours: 0, estimatedCost: 0 }
  ];

  const mpTech: TechnicalStack = {
    platform: 'web',
    frontend: 'Angular',
    backend: 'Spring Boot',
    database: 'PostgreSQL',
    authentication: 'Email sign-in with seller and administrator roles',
    integrations: ['Razorpay', 'Shiprocket', 'Cloud object storage'],
    aiRequirements: 'none',
    hosting: 'AWS managed application services'
  };

  const mpParams: ProjectParameters = {
    region: 'india',
    hiringModel: 'small_agency',
    deliveryTimeline: 'standard',
    qualityExpectation: 'standard',
    designComplexity: 'standard',
    userScale: 'early_stage',
    maintenanceIncluded: false,
    testingLevel: 'standard',
    deploymentType: 'standard_cloud'
  };

  const marketplace = engine.generateEstimate({
    id: 'est_marketplace',
    projectName: 'Curated Local Sellers Marketplace',
    description: 'A small online marketplace for local makers, with seller approval, product listings, customer checkout, and basic order administration.',
    category: 'Marketplace',
    targetAudience: 'Independent local sellers and online shoppers',
    industry: 'Retail and E-commerce',
    objective: 'Help a curated group of local sellers reach customers through one storefront.',
    features: marketplaceFeatures,
    techStack: mpTech,
    parameters: mpParams,
    currency: 'INR'
  });
  marketplace.isSample = true;

  const saasInvFeatures: ProjectFeature[] = [
    { id: 'inv_1', name: 'Barcode Lookup and Stock Counts', description: 'Find products by barcode and record stock counts using a phone camera or USB scanner.', complexity: 'medium', priority: 'must_have', scope: 'mvp', estimatedHours: 0, estimatedCost: 0 },
    { id: 'inv_2', name: 'Stock Across Two Locations', description: 'View on-hand quantities at each location and record stock transfers between them.', complexity: 'medium', priority: 'must_have', scope: 'mvp', estimatedHours: 0, estimatedCost: 0 },
    { id: 'inv_3', name: 'Low-Stock Alerts', description: 'Flag items below a user-defined reorder level for staff follow-up.', complexity: 'simple', priority: 'must_have', scope: 'mvp', estimatedHours: 0, estimatedCost: 0 },
    { id: 'inv_4', name: 'Purchase Orders and Suppliers', description: 'Maintain supplier details and create purchase orders that staff can mark as received.', complexity: 'medium', priority: 'should_have', scope: 'full', estimatedHours: 0, estimatedCost: 0 },
    { id: 'inv_5', name: 'Staff Roles and Permissions', description: 'Separate administrator access from day-to-day stock updates by warehouse staff.', complexity: 'simple', priority: 'must_have', scope: 'mvp', estimatedHours: 0, estimatedCost: 0 },
    { id: 'inv_6', name: 'Stock and Movement Reports', description: 'Review current quantities and export stock movement reports as CSV.', complexity: 'simple', priority: 'must_have', scope: 'mvp', estimatedHours: 0, estimatedCost: 0 }
  ];

  const saasInvTech: TechnicalStack = {
    platform: 'web',
    frontend: 'Angular',
    backend: 'Django (Python)',
    database: 'PostgreSQL',
    authentication: 'Email sign-in with role-based access',
    integrations: ['CSV import and export', 'Transactional email'],
    aiRequirements: 'none',
    hosting: 'DigitalOcean managed services'
  };

  const saasInvParams: ProjectParameters = {
    region: 'india',
    hiringModel: 'small_agency',
    deliveryTimeline: 'standard',
    qualityExpectation: 'standard',
    designComplexity: 'minimal',
    userScale: 'early_stage',
    maintenanceIncluded: true,
    testingLevel: 'standard',
    deploymentType: 'standard_cloud'
  };

  const saasInventory = engine.generateEstimate({
    id: 'est_saas_inventory',
    projectName: 'Inventory for a Two-Location Distributor',
    description: 'A straightforward stock and purchasing system for a small distributor that needs visibility across two warehouses.',
    category: 'Business Management System',
    targetAudience: 'Warehouse staff, purchasing staff, and the business owner',
    industry: 'Wholesale Distribution',
    objective: 'Replace separate spreadsheets with a shared view of stock, transfers, and reorders.',
    features: saasInvFeatures,
    techStack: saasInvTech,
    parameters: saasInvParams,
    currency: 'INR'
  });
  saasInventory.isSample = true;

  const portfolioFeatures: ProjectFeature[] = [
    { id: 'port_1', name: 'Project Case Studies', description: 'Show selected projects with images, a short brief, and the work delivered.', complexity: 'simple', priority: 'must_have', scope: 'mvp', estimatedHours: 0, estimatedCost: 0 },
    { id: 'port_2', name: 'Contact and Enquiry Form', description: 'Collect prospective client details and send enquiries to the site owner by email.', complexity: 'simple', priority: 'must_have', scope: 'mvp', estimatedHours: 0, estimatedCost: 0 },
    { id: 'port_3', name: 'Editable Articles', description: 'Publish occasional articles through a lightweight content editor.', complexity: 'simple', priority: 'should_have', scope: 'full', estimatedHours: 0, estimatedCost: 0 },
    { id: 'port_4', name: 'Client Testimonials', description: 'Display a small set of client quotes and attribution on the site.', complexity: 'simple', priority: 'should_have', scope: 'full', estimatedHours: 0, estimatedCost: 0 },
    { id: 'port_5', name: 'Mobile-Friendly and Search-Ready Pages', description: 'Make pages responsive and include page titles, descriptions, and optimized images.', complexity: 'simple', priority: 'must_have', scope: 'mvp', estimatedHours: 0, estimatedCost: 0 }
  ];

  const portTech: TechnicalStack = {
    platform: 'web',
    frontend: 'Astro',
    backend: 'Managed form service',
    database: 'None required for launch',
    authentication: 'None',
    integrations: ['Email form notifications', 'Basic website analytics'],
    aiRequirements: 'none',
    hosting: 'Cloudflare Pages'
  };

  const portParams: ProjectParameters = {
    region: 'india',
    hiringModel: 'freelancer',
    deliveryTimeline: 'flexible',
    qualityExpectation: 'standard',
    designComplexity: 'standard',
    userScale: 'early_stage',
    maintenanceIncluded: false,
    testingLevel: 'basic',
    deploymentType: 'serverless'
  };

  const portfolio = engine.generateEstimate({
    id: 'est_freelance_portfolio',
    projectName: 'Independent Consultant Portfolio',
    description: 'A compact professional website for an independent consultant to present past work and receive new client enquiries.',
    category: 'Portfolio or Marketing Website',
    targetAudience: 'Prospective clients and professional referrals',
    industry: 'Professional Services',
    objective: 'Create a clear online presence that makes it easy for prospective clients to get in touch.',
    features: portfolioFeatures,
    techStack: portTech,
    parameters: portParams,
    currency: 'INR'
  });
  portfolio.isSample = true;

  return [foodDelivery, lms, marketplace, saasInventory, portfolio];
}
