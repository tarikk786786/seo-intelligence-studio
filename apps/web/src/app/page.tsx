import Link from 'next/link';
import { 
  FileText, 
  Sparkles, 
  Briefcase, 
  BarChart3, 
  Search, 
  ShieldCheck, 
  ArrowUpRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Workspace Overview</h1>
          <p className="text-sm text-gray-400 mt-1">
            Real-time organic search intelligence, content optimization benchmarks, and AI engine visibility.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/documents/new"
            className="px-4 py-2 bg-accent hover:bg-accentHover text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2"
          >
            <FileText className="w-3.5 h-3.5" />
            + New Document
          </Link>
          <Link
            href="/ai-visibility"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-200 text-xs font-semibold rounded-lg border border-slate-700 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-brandHighlight" />
            Track AI Prompts
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-cardBorder p-5 rounded-xl">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Brand Spaces</span>
            <div className="p-2 bg-blue-500/10 rounded-lg text-brandHighlight">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">Unlimited*</span>
            <span className="text-xs text-gray-400 block mt-1">1 Active space configured</span>
          </div>
        </div>

        <div className="bg-card border border-cardBorder p-5 rounded-xl">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Content Documents</span>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">Unlimited*</span>
            <span className="text-xs text-gray-400 block mt-1">Live TF-IDF entity scoring</span>
          </div>
        </div>

        <div className="bg-card border border-cardBorder p-5 rounded-xl">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Tracked AI Prompts</span>
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">100 Max</span>
            <span className="text-xs text-gray-400 block mt-1">Daily scheduled refresh</span>
          </div>
        </div>

        <div className="bg-card border border-cardBorder p-5 rounded-xl">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Integrations Health</span>
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">Configured</span>
            <span className="text-xs text-gray-400 block mt-1">Google Grounding & SERP ready</span>
          </div>
        </div>
      </div>

      {/* Main Grid: AI Visibility & Recent Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Visibility Card */}
        <div className="lg:col-span-2 bg-card border border-cardBorder rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brandHighlight" />
                AI Visibility & Brand Citations (GEO)
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Observed responses across Google Gemini Search Grounding & OpenAI Search.
              </p>
            </div>
            <Link
              href="/ai-visibility"
              className="text-xs font-semibold text-brandHighlight hover:text-white flex items-center gap-1"
            >
              View Full Tracker <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-5">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-gray-400">Brand Mention Rate</div>
                <div className="text-xl font-bold text-brandHighlight mt-1">78.5%</div>
                <span className="text-[10px] text-emerald-400">↑ +4.2% vs last cycle</span>
              </div>
              <div className="border-x border-slate-800">
                <div className="text-xs text-gray-400">Share of Voice</div>
                <div className="text-xl font-bold text-purple-400 mt-1">62.0%</div>
                <span className="text-[10px] text-gray-400">vs tracked competitors</span>
              </div>
              <div>
                <div className="text-xs text-gray-400">Citation Attribution</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">45.0%</div>
                <span className="text-[10px] text-gray-400">responses citing domain</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Recent Observations Sample
            </h3>
            <div className="space-y-2">
              <div className="p-3 bg-slate-900/40 border border-slate-800/80 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <span className="font-medium text-gray-200">"What are the best SEO tools for enterprise content optimization in 2026?"</span>
                  <div className="text-[11px] text-gray-400 mt-0.5 flex gap-2">
                    <span className="text-brandHighlight">Provider: Google Gemini Grounding</span>
                    <span>•</span>
                    <span className="text-emerald-400">Mentioned: Yes (Position #1)</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded border border-emerald-500/20 font-medium">
                  Verified Citation
                </span>
              </div>

              <div className="p-3 bg-slate-900/40 border border-slate-800/80 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <span className="font-medium text-gray-200">"Top platforms tracking AI search engine visibility and LLM citations"</span>
                  <div className="text-[11px] text-gray-400 mt-0.5 flex gap-2">
                    <span className="text-brandHighlight">Provider: Google Gemini Grounding</span>
                    <span>•</span>
                    <span className="text-emerald-400">Mentioned: Yes</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded border border-emerald-500/20 font-medium">
                  Verified Citation
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Launch & Status */}
        <div className="space-y-6">
          <div className="bg-card border border-cardBorder rounded-xl p-6">
            <h2 className="text-base font-bold text-white mb-2">Chrome Extension</h2>
            <p className="text-xs text-gray-400 mb-4">
              Access the Keyword Surfer equivalent directly inside Google Search results and run on-page technical audits.
            </p>
            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-xs mb-4">
              <div className="flex justify-between items-center text-gray-300">
                <span>Build Status:</span>
                <span className="text-emerald-400 font-semibold">Manifest V3 Ready</span>
              </div>
              <div className="text-[11px] text-gray-400 mt-1">
                Output: <code>apps/extension/.output/chrome-mv3</code>
              </div>
            </div>
            <Link
              href="/onboarding"
              className="block w-full py-2.5 text-center bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
            >
              Extension Setup Instructions
            </Link>
          </div>

          <div className="bg-card border border-cardBorder rounded-xl p-6">
            <h2 className="text-base font-bold text-white mb-2">Customer Success Manager</h2>
            <div className="flex items-center gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded-lg mt-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center font-bold text-brandHighlight">
                CS
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Enterprise Concierge Team</div>
                <div className="text-[11px] text-gray-400">Dedicated Account Support</div>
                <div className="text-[10px] text-brandHighlight mt-0.5">success@seointelligence.studio</div>
              </div>
            </div>
            <Link
              href="/admin/csm"
              className="mt-4 block text-center text-xs text-brandHighlight hover:underline font-medium"
            >
              Open Customer Success Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
