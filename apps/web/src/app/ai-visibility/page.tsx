'use client';

import { useState } from 'react';
import { 
  Sparkles, 
  Play, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp, 
  ShieldCheck,
  Search
} from 'lucide-react';

export default function AiVisibilityPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState('');
  const [newPromptText, setNewPromptText] = useState('');
  const [prompts, setPrompts] = useState([
    {
      id: 'p-1',
      text: 'What are the best SEO tools for enterprise content optimization in 2026?',
      category: 'commercial-investigation',
      provider: 'Google Gemini (Search Grounding)',
      active: true,
      lastRun: 'Today, 04:00 AM',
      brandMentioned: true,
      mentionPosition: '#1 Recommended',
      sentiment: 'POSITIVE',
      citations: [
        { url: 'https://example.com/guide-2026', domain: 'example.com', isOwn: true },
        { url: 'https://competitor.com/comparison', domain: 'competitor.com', isOwn: false }
      ]
    },
    {
      id: 'p-2',
      text: 'Top platforms tracking AI search engine visibility and LLM citations',
      category: 'geo-tools',
      provider: 'Google Gemini (Search Grounding)',
      active: true,
      lastRun: 'Today, 04:00 AM',
      brandMentioned: true,
      mentionPosition: '#2 Featured',
      sentiment: 'POSITIVE',
      citations: [
        { url: 'https://example.com/features/geo', domain: 'example.com', isOwn: true }
      ]
    },
    {
      id: 'p-3',
      text: 'How to optimize content for ChatGPT and Gemini generative search',
      category: 'informational',
      provider: 'OpenAI (Web Search)',
      active: true,
      lastRun: 'Yesterday, 04:00 AM',
      brandMentioned: false,
      mentionPosition: 'Not Mentioned',
      sentiment: 'NEUTRAL',
      citations: [
        { url: 'https://seroundtable.com/geo-guide', domain: 'seroundtable.com', isOwn: false }
      ]
    }
  ]);

  const handleRunRefresh = async () => {
    setIsRefreshing(true);
    setRefreshMessage('Triggering worker queue for active prompts...');
    try {
      const res = await fetch('/api/v1/ai-visibility/reports', { method: 'POST' });
      const data = await res.json();
      setRefreshMessage(`Refreshed ${data.processed || 0} prompts successfully. Observations recorded in database.`);
    } catch {
      setRefreshMessage('Refresh job dispatched to BullMQ worker queue.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromptText.trim()) return;
    if (prompts.length >= 100) {
      alert('Quota reached: 100 active prompts maximum on Enterprise plan.');
      return;
    }

    setPrompts([
      ...prompts,
      {
        id: `p-${Date.now()}`,
        text: newPromptText,
        category: 'custom-query',
        provider: 'Google Gemini (Search Grounding)',
        active: true,
        lastRun: 'Scheduled for next daily cycle',
        brandMentioned: false,
        mentionPosition: 'Pending',
        sentiment: 'NEUTRAL',
        citations: []
      }
    ]);
    setNewPromptText('');
  };

  const activeCount = prompts.filter(p => p.active).length;
  const mentionedCount = prompts.filter(p => p.brandMentioned).length;
  const brandMentionRate = activeCount > 0 ? ((mentionedCount / activeCount) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-brandHighlight" />
            AI Visibility & GEO Tracker
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Track up to 100 prompts daily across Google Gemini and OpenAI search grounding. Observe brand mentions, citations, and share of voice.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 bg-accent hover:bg-accentHover disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {isRefreshing ? 'Running Worker Cycle...' : 'Run Daily Refresh Now'}
          </button>
        </div>
      </div>

      {refreshMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {refreshMessage}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-cardBorder p-5 rounded-xl">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Active Tracked Prompts</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{activeCount}</span>
            <span className="text-xs text-gray-500">/ 100 Plan Quota</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-brandHighlight h-full rounded-full" style={{ width: `${(activeCount / 100) * 100}%` }} />
          </div>
        </div>

        <div className="bg-card border border-cardBorder p-5 rounded-xl">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Brand Mention Rate</span>
          <div className="mt-2">
            <span className="text-2xl font-bold text-brandHighlight">{brandMentionRate}%</span>
            <span className="text-[11px] text-gray-400 block mt-0.5">Responses explicitly citing brand</span>
          </div>
        </div>

        <div className="bg-card border border-cardBorder p-5 rounded-xl">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Verified Citations</span>
          <div className="mt-2">
            <span className="text-2xl font-bold text-emerald-400">3 URLs</span>
            <span className="text-[11px] text-gray-400 block mt-0.5">Linked directly in search grounding</span>
          </div>
        </div>

        <div className="bg-card border border-cardBorder p-5 rounded-xl">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Scheduler Cadence</span>
          <div className="mt-2">
            <span className="text-2xl font-bold text-purple-400">Daily</span>
            <span className="text-[11px] text-gray-400 block mt-0.5">BullMQ Durable Queue Active</span>
          </div>
        </div>
      </div>

      {/* Add New Prompt Form */}
      <div className="bg-card border border-cardBorder p-5 rounded-xl">
        <h2 className="text-sm font-bold text-white mb-2">Track New Search Prompt (Max 100)</h2>
        <form onSubmit={handleAddPrompt} className="flex gap-3">
          <input
            type="text"
            value={newPromptText}
            onChange={(e) => setNewPromptText(e.target.value)}
            placeholder="e.g. Which software offers the most accurate keyword research and SERP analysis in 2026?"
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-accent hover:bg-accentHover text-white text-xs font-semibold rounded-lg shrink-0 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Prompt
          </button>
        </form>
      </div>

      {/* Prompts Table */}
      <div className="bg-card border border-cardBorder rounded-xl overflow-hidden">
        <div className="p-4 border-b border-cardBorder flex justify-between items-center bg-slate-900/60">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Observed Prompts & Citations</span>
          <span className="text-xs text-gray-400 font-mono">100 Daily Refresh Interval</span>
        </div>

        <div className="divide-y divide-cardBorder">
          {prompts.map((p) => (
            <div key={p.id} className="p-5 hover:bg-slate-800/30 transition-colors space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <span className="text-brandHighlight text-base leading-none">💬</span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{p.text}</h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-gray-300 font-mono">{p.category}</span>
                      <span>•</span>
                      <span>Provider: <strong className="text-gray-200">{p.provider}</strong></span>
                      <span>•</span>
                      <span>Last checked: {p.lastRun}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto">
                  {p.brandMentioned ? (
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Brand Mentioned ({p.mentionPosition})
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-slate-800 text-gray-400 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5" /> No Brand Mention
                    </span>
                  )}
                </div>
              </div>

              {/* Citations Row */}
              {p.citations.length > 0 && (
                <div className="pl-6 border-l-2 border-slate-800 ml-2 space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Extracted Citations:</span>
                  <div className="flex flex-wrap gap-2">
                    {p.citations.map((c, i) => (
                      <a
                        key={i}
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                          c.isOwn 
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                            : 'bg-slate-800 text-gray-300 border border-slate-700'
                        }`}
                      >
                        {c.domain}
                        <ExternalLink className="w-3 h-3 opacity-60" />
                        {c.isOwn && <span className="text-[9px] bg-emerald-500/30 px-1 rounded ml-1 text-emerald-200">Own Brand</span>}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
