'use client';

import { useState } from 'react';
import { Plug, ShieldCheck, AlertCircle, CheckCircle2, KeyRound, ExternalLink, RefreshCw } from 'lucide-react';

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState([
    {
      id: 'gsc',
      name: 'Google Search Console',
      category: 'Organic Performance',
      description: 'Ingest verified property impressions, clicks, average ranking position, and CTR.',
      status: 'CONFIGURED',
      statusText: 'OAuth Credentials Verified',
      lastSync: 'Today, 02:30 AM',
    },
    {
      id: 'gemini',
      name: 'Google Gemini Search Grounding',
      category: 'AI Visibility (GEO)',
      description: 'Provides live grounded web citations and brand mention analysis for scheduled prompts.',
      status: 'CONFIGURED',
      statusText: 'API Key Active',
      lastSync: 'Live',
    },
    {
      id: 'serpapi',
      name: 'SerpAPI / SERP Engine',
      category: 'Rank & Search Engine Data',
      description: 'Fetches real-time search engine result pages across 100+ geographic locations and devices.',
      status: 'CONFIGURED',
      statusText: 'Connected & Verified',
      lastSync: '10 mins ago',
    },
    {
      id: 'google-ads',
      name: 'Google Ads API',
      category: 'Keyword Volumes',
      description: 'Pulls official monthly search volume, competition metrics, and historical CPC estimates.',
      status: 'UNCONFIGURED',
      statusText: 'Requires Developer Token',
      lastSync: 'Never',
    },
    {
      id: 'wordpress',
      name: 'WordPress REST Publishing',
      category: 'Content CMS',
      description: 'Synchronize optimized documents directly as drafts or published articles in your WordPress site.',
      status: 'UNCONFIGURED',
      statusText: 'Requires Application Password',
      lastSync: 'Never',
    },
    {
      id: 'pagespeed',
      name: 'Google PageSpeed Insights & CrUX',
      category: 'Core Web Vitals',
      description: 'Evaluates real-user Core Web Vitals (LCP, INP, CLS) and diagnostic performance scores.',
      status: 'CONFIGURED',
      statusText: 'Public API Ready',
      lastSync: 'Today, 01:00 AM',
    },
    {
      id: 'webhooks',
      name: 'Outbound Webhooks',
      category: 'Event Notifications',
      description: 'Dispatches signed HMAC-SHA256 payloads when daily AI refreshes or SERP analyses complete.',
      status: 'CONFIGURED',
      statusText: '1 Active Endpoint',
      lastSync: 'Live',
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Plug className="w-6 h-6 text-brandHighlight" />
            Integrations & Data Sources
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Connect verified search data providers, AI grounding engines, CMS publishing endpoints, and webhooks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item) => (
          <div key={item.id} className="bg-card border border-cardBorder rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-sm font-bold text-white">{item.name}</h3>
                  <span className="text-[10px] text-gray-400 font-mono uppercase">{item.category}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                  item.status === 'CONFIGURED'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {item.statusText}
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="border-t border-cardBorder pt-3 flex justify-between items-center text-xs">
              <span className="text-[11px] text-gray-500">Last Sync: {item.lastSync}</span>
              <button className="text-brandHighlight hover:text-white font-medium text-xs">
                Configure →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
