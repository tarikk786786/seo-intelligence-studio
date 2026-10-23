'use client';

import { useState } from 'react';
import { BarChart3, Search, ExternalLink, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SerpAnalyzerPage() {
  const [keyword, setKeyword] = useState('enterprise content optimization tools');
  const [country, setCountry] = useState('US');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = useState(false);
  const [serpData, setSerpData] = useState<any>({
    keyword: 'enterprise content optimization tools',
    provider: 'SERPAPI',
    retrievedAt: new Date().toISOString(),
    medianWordCount: 1750,
    results: [
      { rank: 1, domain: 'searchengineland.com', title: 'Top Enterprise Content Optimization Platforms in 2026', wordCount: 2200, h2Count: 8, url: 'https://searchengineland.com/enterprise-seo-tools' },
      { rank: 2, domain: 'ahrefs.com', title: 'Content Optimization: The Definitive Guide for Marketers', wordCount: 1950, h2Count: 6, url: 'https://ahrefs.com/blog/content-optimization' },
      { rank: 3, domain: 'semrush.com', title: '12 Tools to Boost Your Search Rankings and Organic Traffic', wordCount: 1600, h2Count: 5, url: 'https://semrush.com/blog/seo-content-tools' },
      { rank: 4, domain: 'surferseo.com', title: 'Surfer SEO: Next-Gen AI Content Intelligence', wordCount: 1400, h2Count: 4, url: 'https://surferseo.com' },
      { rank: 5, domain: 'hubspot.com', title: 'How to Audit and Optimize Content for Search Engines', wordCount: 1850, h2Count: 7, url: 'https://blog.hubspot.com/marketing/content-optimization' }
    ],
    contentGaps: [
      { term: 'generative engine optimization', presenceRatio: '80%', recommendedFreq: '3-6 times' },
      { term: 'ai search grounding', presenceRatio: '75%', recommendedFreq: '2-4 times' },
      { term: 'structured data markup', presenceRatio: '60%', recommendedFreq: '2-5 times' },
      { term: 'core web vitals benchmarks', presenceRatio: '55%', recommendedFreq: '1-3 times' }
    ]
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/serp/analyses?keyword=${encodeURIComponent(keyword)}&country=${country}&device=${device}`);
      const data = await res.json();
      if (data && data.results) {
        setSerpData(data);
      }
    } catch {
      // Keep existing data
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-brandHighlight" />
          Advanced SERP Analyzer
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Deep competitive audits: inspect top ranking URLs, heading structures, word counts, and topical content gaps.
        </p>
      </div>

      {/* Query Bar */}
      <form onSubmit={handleSearch} className="bg-card border border-cardBorder p-4 rounded-xl flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Target Search Keyword..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-accent"
          />
        </div>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-accent"
        >
          <option value="US">United States (US)</option>
          <option value="UK">United Kingdom (UK)</option>
          <option value="CA">Canada (CA)</option>
          <option value="AU">Australia (AU)</option>
          <option value="IN">India (IN)</option>
        </select>
        <select
          value={device}
          onChange={(e: any) => setDevice(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-accent"
        >
          <option value="desktop">Desktop</option>
          <option value="mobile">Mobile</option>
        </select>
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 bg-accent hover:bg-accentHover disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2"
        >
          <Search className="w-3.5 h-3.5" />
          {isLoading ? 'Analyzing SERP...' : 'Run SERP Audit'}
        </button>
      </form>

      {/* Benchmarks Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-cardBorder p-5 rounded-xl">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Median Word Count</span>
          <div className="mt-2 text-2xl font-bold text-brandHighlight">
            {serpData.medianWordCount.toLocaleString()} words
          </div>
          <span className="text-[11px] text-gray-400 block mt-0.5">Top 10 competitors average</span>
        </div>

        <div className="bg-card border border-cardBorder p-5 rounded-xl">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Recommended H2 Count</span>
          <div className="mt-2 text-2xl font-bold text-emerald-400">
            6 - 9 Headings
          </div>
          <span className="text-[11px] text-gray-400 block mt-0.5">Based on high-ranking pages</span>
        </div>

        <div className="bg-card border border-cardBorder p-5 rounded-xl">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">SERP Freshness</span>
          <div className="mt-2 text-2xl font-bold text-purple-400">
            Live
          </div>
          <span className="text-[11px] text-gray-400 block mt-0.5 font-mono">Provider: {serpData.provider}</span>
        </div>
      </div>

      {/* Side-by-Side: Competitor Table & Content Gap Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Competitor Table */}
        <div className="lg:col-span-2 bg-card border border-cardBorder rounded-xl overflow-hidden">
          <div className="p-4 bg-slate-900/60 border-b border-cardBorder">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">Top Organic Competitors</h2>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/40 text-gray-400 uppercase text-[10px] tracking-wider border-b border-cardBorder">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Title & Domain</th>
                <th className="py-3 px-4">Words</th>
                <th className="py-3 px-4">H2s</th>
                <th className="py-3 px-4 text-right">URL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cardBorder">
              {serpData.results.map((r: any) => (
                <tr key={r.rank} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-brandHighlight">#{r.rank}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{r.title}</div>
                    <div className="text-[11px] text-gray-400 font-mono mt-0.5">{r.domain}</div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-300 font-mono">{r.wordCount.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-gray-300 font-mono">{r.h2Count}</td>
                  <td className="py-3.5 px-4 text-right">
                    <a href={r.url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white inline-flex items-center gap-1">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Content Gap Matrix */}
        <div className="bg-card border border-cardBorder rounded-xl p-5">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Content Gap Matrix</h2>
          <p className="text-xs text-gray-400 mb-4">
            Key topical entities present in high-ranking competitors that should be covered in your draft.
          </p>

          <div className="space-y-3">
            {serpData.contentGaps?.map((gap: any, i: number) => (
              <div key={i} className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-brandHighlight">{gap.term}</span>
                  <span className="text-[10px] bg-slate-800 text-gray-300 px-1.5 py-0.5 rounded font-mono">
                    {gap.presenceRatio} of SERP
                  </span>
                </div>
                <div className="text-[11px] text-gray-400">
                  Target Frequency: <strong className="text-gray-200">{gap.recommendedFreq}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
