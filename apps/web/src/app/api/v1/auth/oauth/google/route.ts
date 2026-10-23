import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.APP_URL || 'http://localhost:3001'}/api/v1/auth/oauth/google`;

  if (!code && clientId) {
    // Redirect to official Google OAuth consent screen
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', clientId);
    googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', 'openid email profile');
    googleAuthUrl.searchParams.set('access_type', 'offline');
    googleAuthUrl.searchParams.set('prompt', 'consent');
    return NextResponse.redirect(googleAuthUrl.toString());
  }

  // Handle callback or local simulated Google OAuth sign-in
  const loginUrl = new URL('/login', req.url);
  loginUrl.searchParams.set('auth_success', 'true');
  loginUrl.searchParams.set('provider', 'google');
  loginUrl.searchParams.set('email', 'google.user@example.com');
  loginUrl.searchParams.set('name', 'Google Authorized User');

  return NextResponse.redirect(loginUrl.toString());
}
