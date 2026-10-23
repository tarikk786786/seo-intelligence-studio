'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  KeyRound, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Copy, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

function LoginFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Handle redirect from OAuth
  useEffect(() => {
    const isSuccess = searchParams.get('auth_success');
    const provider = searchParams.get('provider');
    const oauthEmail = searchParams.get('email');
    const oauthName = searchParams.get('name');

    if (isSuccess && oauthEmail) {
      handleDirectLogin(oauthEmail, oauthName || 'Authorized User', provider || 'oauth');
    }
  }, [searchParams]);

  const handleDirectLogin = async (userEmail: string, userName: string, providerName: string) => {
    setIsLoading(true);
    setStatusMessage(`Authenticating with ${providerName.toUpperCase()}...`);
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, name: userName, provider: providerName }),
      });
      const data = await res.json();
      if (data.authenticated) {
        setActiveSession(data);
        setStatusMessage(`Successfully authenticated as ${userEmail}!`);
        // Notify chrome extension if present
        if (typeof window !== 'undefined' && (window as any).chrome?.storage) {
          (window as any).chrome.storage.local.set({
            apiKey: data.token,
            apiUrl: 'http://localhost:3001',
            user: data.user,
          });
        }
      }
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    handleDirectLogin(email, email.split('@')[0], 'credentials');
  };

  const copyToken = () => {
    if (activeSession?.token) {
      navigator.clipboard.writeText(activeSession.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-cardBorder rounded-2xl p-8 space-y-6 shadow-2xl">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-accent to-brandHighlight flex items-center justify-center font-bold text-white text-2xl mx-auto shadow-lg shadow-accent/25">
            ✦
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Access SEO Intelligence Studio</h1>
          <p className="text-xs text-gray-400">
            Sign in to access SEO Intelligence Studio and Chrome Extension Sync.
          </p>
        </div>

        {statusMessage && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-lg text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* If Active Session Exists: Display Session & Extension Token */}
        {activeSession ? (
          <div className="space-y-4 pt-2">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-white">Active Session Token</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono">
                  ENTERPRISE
                </span>
              </div>
              <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-gray-300 overflow-hidden">
                <span className="truncate flex-1">{activeSession.token}</span>
                <button
                  onClick={copyToken}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-gray-200 rounded flex items-center gap-1 text-[10px] shrink-0 font-sans"
                >
                  <Copy className="w-3 h-3" /> {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="text-[11px] text-gray-400 space-y-0.5">
                <div>User: <strong>{activeSession.user.name}</strong> ({activeSession.user.email})</div>
                <div>Workspace: <strong>{activeSession.workspace.name}</strong></div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => router.push('/')}
                className="flex-1 py-2.5 bg-accent hover:bg-accentHover text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5"
              >
                Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* OAuth & Login Form */
          <div className="space-y-4">
            {/* Google OAuth Button */}
            <a
              href="/api/v1/auth/oauth/google"
              className="w-full py-2.5 px-4 bg-white hover:bg-gray-100 text-gray-900 text-xs font-semibold rounded-lg flex items-center justify-center gap-3 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Continue with Google
            </a>

            {/* Amazon OAuth Button */}
            <a
              href="/api/v1/auth/oauth/amazon"
              className="w-full py-2.5 px-4 bg-[#FF9900] hover:bg-[#e68a00] text-gray-900 text-xs font-semibold rounded-lg flex items-center justify-center gap-3 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.42 15.65c-2.45 1.8-6 2.76-9.08 2.76-4.32 0-8.21-1.63-11.14-4.36-.23-.21-.02-.5.25-.34 3.16 1.84 7.06 2.95 11.08 2.95 2.75 0 5.78-.65 8.51-2.01.42-.21.78.27.38 1z"/>
                <path d="M16.57 14.15c-.31-.4-.63-.8-.94-1.21-.19-.24-.04-.44.22-.38 1.4.34 2.8.69 4.2 1.03.3.07.41.35.19.57-1.12 1.12-2.24 2.24-3.36 3.36-.23.23-.48.13-.41-.17.18-.76.36-1.52.54-2.28 0-.01-.01-.02-.02-.03-.14-.29-.29-.59-.42-.89z"/>
              </svg>
              Continue with Amazon
            </a>

            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-slate-800"></div>
              <span className="px-3 text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Or enterprise email</span>
              <div className="flex-1 border-t border-slate-800"></div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">Corporate Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">Password / Security Key</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-accent hover:bg-accentHover disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all mt-4"
              >
                <KeyRound className="w-3.5 h-3.5" />
                {isLoading ? 'Authorizing...' : 'Sign In & Get Studio Access'}
              </button>
            </form>
          </div>
        )}

        <div className="text-center pt-2 space-y-1">
          <p className="text-[11px] text-gray-500">
            Secure enterprise workspace for SEO, SERP Analysis, and AI Visibility.
          </p>
          <a
            href="https://tarikislam.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-sky-400 hover:text-sky-300 font-medium inline-flex items-center gap-1"
          >
            <span>Made by tarikislam.in</span>
            <span className="text-[10px]">✦</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center text-gray-400 text-xs">Loading Studio Access Portal...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
