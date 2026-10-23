export interface PlanEntitlements {
  planTier: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  unlimitedDocuments: boolean;
  maxDocumentsSoftLimit: number;
  aiVisibilityEnabled: boolean;
  maxActiveAiPrompts: number;
  dailyPromptRefreshEnabled: boolean;
  unlimitedBrandSpaces: boolean;
  maxBrandSpacesSoftLimit: number;
  advancedSerpAnalysis: boolean;
  integrationsEnabled: boolean;
  personalizedOnboarding: boolean;
  dedicatedCsmAssigned: boolean;
  apiAccessEnabled: boolean;
  rateLimitPerMinute: number;
}

export const PLAN_PRESETS: Record<string, PlanEntitlements> = {
  ENTERPRISE_SURFER: {
    planTier: 'ENTERPRISE',
    unlimitedDocuments: true,
    maxDocumentsSoftLimit: 100000,
    aiVisibilityEnabled: true,
    maxActiveAiPrompts: 100,
    dailyPromptRefreshEnabled: true,
    unlimitedBrandSpaces: true,
    maxBrandSpacesSoftLimit: 5000,
    advancedSerpAnalysis: true,
    integrationsEnabled: true,
    personalizedOnboarding: true,
    dedicatedCsmAssigned: true,
    apiAccessEnabled: true,
    rateLimitPerMinute: 600,
  },
  PROFESSIONAL: {
    planTier: 'PROFESSIONAL',
    unlimitedDocuments: false,
    maxDocumentsSoftLimit: 100,
    aiVisibilityEnabled: true,
    maxActiveAiPrompts: 25,
    dailyPromptRefreshEnabled: true,
    unlimitedBrandSpaces: false,
    maxBrandSpacesSoftLimit: 5,
    advancedSerpAnalysis: true,
    integrationsEnabled: true,
    personalizedOnboarding: false,
    dedicatedCsmAssigned: false,
    apiAccessEnabled: true,
    rateLimitPerMinute: 120,
  },
  STARTER: {
    planTier: 'STARTER',
    unlimitedDocuments: false,
    maxDocumentsSoftLimit: 15,
    aiVisibilityEnabled: false,
    maxActiveAiPrompts: 0,
    dailyPromptRefreshEnabled: false,
    unlimitedBrandSpaces: false,
    maxBrandSpacesSoftLimit: 1,
    advancedSerpAnalysis: false,
    integrationsEnabled: false,
    personalizedOnboarding: false,
    dedicatedCsmAssigned: false,
    apiAccessEnabled: false,
    rateLimitPerMinute: 30,
  }
};

export class EntitlementService {
  static checkCanCreateDocument(currentDocCount: number, entitlements: PlanEntitlements): { allowed: boolean; reason?: string } {
    if (entitlements.unlimitedDocuments) {
      if (currentDocCount >= entitlements.maxDocumentsSoftLimit) {
        return { allowed: false, reason: 'Fair-use document storage ceiling reached. Please contact your Customer Success Manager for quota extension.' };
      }
      return { allowed: true };
    }
    if (currentDocCount >= entitlements.maxDocumentsSoftLimit) {
      return { allowed: false, reason: `Plan limit reached (${entitlements.maxDocumentsSoftLimit} documents). Upgrade to Enterprise for Unlimited* documents.` };
    }
    return { allowed: true };
  }

  static checkCanTrackPrompt(currentActivePrompts: number, entitlements: PlanEntitlements): { allowed: boolean; reason?: string } {
    if (!entitlements.aiVisibilityEnabled) {
      return { allowed: false, reason: 'AI Visibility tracking is not enabled on this plan.' };
    }
    if (currentActivePrompts >= entitlements.maxActiveAiPrompts) {
      return { allowed: false, reason: `Prompt limit reached. Maximum ${entitlements.maxActiveAiPrompts} active tracked prompts permitted on this plan.` };
    }
    return { allowed: true };
  }

  static checkCanCreateBrandSpace(currentCount: number, entitlements: PlanEntitlements): { allowed: boolean; reason?: string } {
    if (entitlements.unlimitedBrandSpaces) {
      if (currentCount >= entitlements.maxBrandSpacesSoftLimit) {
        return { allowed: false, reason: 'Fair-use Brand Space capacity reached. Contact administrator.' };
      }
      return { allowed: true };
    }
    if (currentCount >= entitlements.maxBrandSpacesSoftLimit) {
      return { allowed: false, reason: `Brand Space limit reached (${entitlements.maxBrandSpacesSoftLimit}). Upgrade to Enterprise for Unlimited* Brand Spaces.` };
    }
    return { allowed: true };
  }

  static checkFeatureAccess(feature: keyof PlanEntitlements, entitlements: PlanEntitlements): boolean {
    return Boolean(entitlements[feature]);
  }
}
