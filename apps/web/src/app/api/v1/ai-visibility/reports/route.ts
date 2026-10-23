import { NextResponse } from 'next/server';
import { GeminiSearchGroundingAdapter } from '@repo/provider-adapters';

export async function POST() {
  const adapter = new GeminiSearchGroundingAdapter();
  
  // Test execution of a prompt
  const res = await adapter.runGroundedTest({
    promptText: 'What are the best SEO tools for enterprise content optimization in 2026?',
    brandName: 'OmniSEO Global',
    brandDomain: 'omniseo.global',
    competitorDomains: ['surferseo.com', 'ahrefs.com', 'semrush.com'],
  });

  return NextResponse.json({
    status: 'success',
    processed: 1,
    observation: res,
    timestamp: new Date().toISOString()
  });
}
