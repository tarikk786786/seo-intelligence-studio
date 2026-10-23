import { describe, it, expect } from 'vitest';
import { computeOptimizationScore } from '../packages/seo-engine/src/scoring-engine.js';
import { calculateFleschReadingEase } from '../packages/seo-engine/src/readability.js';

describe('SEO Scoring Engine', () => {
  it('calculates Flesch Reading Ease accurately', () => {
    const easyText = 'The cat sat on the mat. The sun was hot. We had fun.';
    const result = calculateFleschReadingEase(easyText);
    expect(result.score).toBeGreaterThan(70);
    expect(['Easy', 'Very Easy']).toContain(result.label);
  });

  it('computes explainable optimization score and penalizes keyword stuffing', () => {
    const normalText = `
      <h1>Generative Engine Optimization Guide</h1>
      <p>Generative engine optimization improves your AI visibility. Best practices and regular optimization guide content authors toward better performance.</p>
      <h2>Top Strategies</h2>
      <p>Content optimization requires thoughtful topic and entity coverage.</p>
    `;
    const scoreNormal = computeOptimizationScore(normalText, 'generative engine optimization');
    expect(scoreNormal.totalScore).toBeGreaterThan(40);
    expect(scoreNormal.keywordScore).toBeGreaterThan(10);

    // Stuffed text
    const stuffedText = `
      <h1>SEO SEO SEO</h1>
      <p>SEO SEO SEO SEO SEO SEO SEO SEO SEO SEO SEO SEO SEO SEO SEO SEO SEO SEO SEO SEO SEO SEO SEO SEO.</p>
    `;
    const scoreStuffed = computeOptimizationScore(stuffedText, 'SEO');
    expect(scoreStuffed.recommendations.some(r => r.includes('keyword stuffing') || r.includes('too high'))).toBe(true);
  });
});
