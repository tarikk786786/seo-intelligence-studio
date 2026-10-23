import { NextRequest, NextResponse } from 'next/server';
import { db } from '@repo/database';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email || 'user@example.com').trim().toLowerCase();
    const name = body.name || email.split('@')[0];
    const provider = body.provider || 'email'; // 'google', 'amazon', or 'email'

    // Find or create user
    let user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email,
          name,
          role: 'OWNER',
        },
      });

      // Create primary organization
      const org = await db.organization.create({
        data: {
          name: `${name}'s Organization`,
          slug: `org-${crypto.randomBytes(4).toString('hex')}`,
          members: {
            create: {
              userId: user.id,
              role: 'OWNER',
            },
          },
        },
      });

      // Create primary workspace with Enterprise plan
      const workspace = await db.workspace.create({
        data: {
          name: `${name}'s Workspace`,
          slug: `ws-${crypto.randomBytes(4).toString('hex')}`,
          organizationId: org.id,
          planTier: 'ENTERPRISE',
        },
      });

      // Create default Brand Space
      await db.brandSpace.create({
        data: {
          workspaceId: workspace.id,
          name: `${name} Brand`,
          primaryDomain: `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          targetCountry: 'US',
          targetLanguage: 'en',
          onboardingDone: true,
        },
      });
    }

    // Get user's primary workspace
    const orgMembership = await db.organizationMember.findFirst({
      where: { userId: user.id },
      include: {
        organization: {
          include: {
            workspaces: {
              include: {
                brandSpaces: true,
              },
            },
          },
        },
      },
    });

    const activeWorkspace = orgMembership?.organization.workspaces[0];
    const activeBrandSpace = activeWorkspace?.brandSpaces[0];

    // Generate or fetch access key
    const rawSecret = `sec_live_${crypto.randomBytes(24).toString('hex')}`;
    const keyHash = crypto.createHash('sha256').update(rawSecret).digest('hex');

    if (activeWorkspace) {
      await db.apiKey.create({
        data: {
          workspaceId: activeWorkspace.id,
          name: `${provider.toUpperCase()} Session Key`,
          keyPrefix: rawSecret.slice(0, 16),
          keyHash,
          scopes: 'read,write,admin',
        },
      });
    }

    const sessionData = {
      authenticated: true,
      token: rawSecret,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      workspace: {
        id: activeWorkspace?.id || 'ws_default',
        name: activeWorkspace?.name || 'Enterprise Workspace',
        planTier: activeWorkspace?.planTier || 'ENTERPRISE',
      },
      brandSpace: {
        id: activeBrandSpace?.id || 'bs_default',
        name: activeBrandSpace?.name || 'Default Brand Space',
        domain: activeBrandSpace?.primaryDomain || 'example.com',
      },
      provider,
      issuedAt: new Date().toISOString(),
    };

    const res = NextResponse.json(sessionData);
    // Set secure cookie
    res.cookies.set('studio_session_token', rawSecret, {
      httpOnly: false, // Accessible to client for extension sync
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
    });

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: `Login error: ${err.message}` }, { status: 500 });
  }
}
