import { describe, it, expect } from 'vitest';
import { EntitlementService, PLAN_PRESETS } from '../packages/shared-types/src/entitlements.js';

describe('Entitlement Policy Engine', () => {
  const enterprisePlan = PLAN_PRESETS.ENTERPRISE_SURFER;

  it('permits document creation within fair-use ceiling on Enterprise plan', () => {
    const check1 = EntitlementService.checkCanCreateDocument(500, enterprisePlan);
    expect(check1.allowed).toBe(true);

    const checkCeiling = EntitlementService.checkCanCreateDocument(100000, enterprisePlan);
    expect(checkCeiling.allowed).toBe(false);
  });

  it('enforces 100 max active AI prompts on Enterprise plan', () => {
    const checkWithin = EntitlementService.checkCanTrackPrompt(99, enterprisePlan);
    expect(checkWithin.allowed).toBe(true);

    const checkLimit = EntitlementService.checkCanTrackPrompt(100, enterprisePlan);
    expect(checkLimit.allowed).toBe(false);
    expect(checkLimit.reason).toContain('Maximum 100 active tracked prompts permitted');
  });

  it('blocks AI Visibility on Starter plan', () => {
    const starterPlan = PLAN_PRESETS.STARTER;
    const check = EntitlementService.checkCanTrackPrompt(1, starterPlan);
    expect(check.allowed).toBe(false);
    expect(check.reason).toContain('AI Visibility tracking is not enabled');
  });
});
