import { NextRequest, NextResponse } from 'next/server';
import { auditPage } from '@repo/provider-adapters';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'Query parameter "url" is required.' }, { status: 400 });
  }

  const result = await auditPage(targetUrl);
  return NextResponse.json(result);
}
