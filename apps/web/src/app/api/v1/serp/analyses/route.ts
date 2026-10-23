import { NextRequest, NextResponse } from 'next/server';
import { SerpApiAdapter } from '@repo/provider-adapters';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get('keyword');
  const country = searchParams.get('country') || 'US';
  const language = searchParams.get('language') || 'en';
  const device = (searchParams.get('device') as 'desktop' | 'mobile') || 'desktop';

  if (!keyword) {
    return NextResponse.json({ error: 'Query parameter "keyword" is required.' }, { status: 400 });
  }

  const adapter = new SerpApiAdapter();
  const serpResponse = await adapter.fetchSerp({
    keyword,
    country,
    language,
    device,
  });

  return NextResponse.json(serpResponse);
}
