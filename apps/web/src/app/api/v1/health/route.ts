import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    platform: 'SEO Intelligence Studio',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    entitlements: {
      unlimitedDocuments: true,
      maxTrackedAiPrompts: 100,
      dailyRefreshCadence: 'durable-worker-active',
      unlimitedBrandSpaces: true,
      extensionSupport: 'manifest-v3-verified',
    }
  });
}
