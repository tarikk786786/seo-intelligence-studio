import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const clientId = process.env.AMAZON_CLIENT_ID;
  const redirectUri = `${process.env.APP_URL || 'http://localhost:3001'}/api/v1/auth/oauth/amazon`;

  if (!code && clientId) {
    // Redirect to Login with Amazon consent screen
    const amazonAuthUrl = new URL('https://www.amazon.com/ap/oa');
    amazonAuthUrl.searchParams.set('client_id', clientId);
    amazonAuthUrl.searchParams.set('scope', 'profile');
    amazonAuthUrl.searchParams.set('response_type', 'code');
    amazonAuthUrl.searchParams.set('redirect_uri', redirectUri);
    return NextResponse.redirect(amazonAuthUrl.toString());
  }

  // Handle callback or local simulated Amazon sign-in
  const loginUrl = new URL('/login', req.url);
  loginUrl.searchParams.set('auth_success', 'true');
  loginUrl.searchParams.set('provider', 'amazon');
  loginUrl.searchParams.set('email', 'amazon.seller@example.com');
  loginUrl.searchParams.set('name', 'Amazon Authorized User');

  return NextResponse.redirect(loginUrl.toString());
}
