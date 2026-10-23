'use client';

import { useState } from 'react';
import { Search, Download, Filter, Layers, HelpCircle, ArrowUpRight } from 'lucide-react';

export default function KeywordResearchPage() {
  const [seedKeyword, setSeedKeyword] = useState('seo audit checklist');
  const [activeTab, setActiveTab] = useState<'all' | 'questions' | 'clusters'>('all');

  const keywords = [
    { keyword: 'seo audit checklist', volume: 14200, cpc: 3.40, difficulty: 68, intent: 'INFORMATIONAL', cluster: 'Audit Guides' },
    { keyword: 'technical seo audit checklist 2026', volume: 4800, cpc: 4.10, difficulty: 55, intent: 'COMMERCIAL', cluster: 'Technical SEO' },
    { keyword: 'how to do a website seo audit', volume: 6600, cpc: 2.80, difficulty: 62, intent: 'INFORMATIONAL', cluster: 'Audit Guides' },
    { keyword: 'ecommerce seo audit checklist', volume: 3200, cpc: 5.20, difficulty: 58, intent: 'COMMERCIAL', cluster: 'Ecommerce' },
    { keyword: 'free seo audit checklist excel', volume: 2900, cpc: 1.50, difficulty: 42, intent: 'TRANSACTIONAL', cluster: 'Templates' },
    { keyword: 'what is included in a full seo audit', volume: 1800, cpc: 2.10, difficulty: 49, intent: 'INFORMATIONAL', cluster: 'Audit Guides' },
  ];

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Keyword,Volume,CPC,Difficulty,Intent,Cluster",
         ...keywords.map(k => `"${k.keyword}",${k.volume},${k.cpc},${k.difficulty},${k.intent},"${k.cluster}"`)].join("\n");
    const encoded = encodeURI(csvContent);
    const a = document.createElement("a");
    a.href = encoded;
    a.download = `keyword-research-${seedKeyword.replace(/\s+/g, '_')}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Search className="w-6 h-6 text-brandHighlight" />
            Keyword Intelligence & Clustering
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Discover related keywords, search intent classification, topic clusters, and export to CSV.
          </p>
        </div>
        <button
          onClick={handleExportCsv}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-2"
        >
          <Download className="w-3.5 h-3.5" /> Export to CSV
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="bg-card border border-cardBorder p-4 rounded-xl flex gap-3">
        <input
          type="text"
          value={seedKeyword}
          onChange={(e) => setSeedKeyword(e.target.value)}
          placeholder="Enter seed topic (e.g. generative engine optimization)..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-accent"
        />
        <button
          className="px-5 py-2.5 bg-accent hover:bg-accentHover text-white text-xs font-semibold rounded-lg flex items-center gap-2"
        >
          <Search className="w-3.5 h-3.5" /> Research Keyword
        </button>
      </div>

      {/* Keywords Table */}
      <div className="bg-card border border-cardBorder rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-gray-400 uppercase text-[10px] tracking-wider border-b border-cardBorder">
            <tr>
              <th className="py-3.5 px-4 font-semibold">Keyword Phrase</th>
              <th className="py-3.5 px-4 font-semibold">Monthly Volume</th>
              <th className="py-3.5 px-4 font-semibold">Est. CPC</th>
              <th className="py-3.5 px-4 font-semibold">Difficulty</th>
              <th className="py-3.5 px-4 font-semibold">Intent</th>
              <th className="py-3.5 px-4 font-semibold">Topic Cluster</th>
              <th className="py-3.5 px-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cardBorder">
            {keywords.map((kw, i) => (
              <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-white">{kw.keyword}</td>
                <td className="py-3.5 px-4 text-brandHighlight font-mono">{kw.volume.toLocaleString()}</td>
                <td className="py-3.5 px-4 text-gray-300 font-mono">${kw.cpc.toFixed(2)}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    kw.difficulty > 60 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {kw.difficulty} / 100
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-[10px] bg-slate-800 text-gray-300 px-2 py-0.5 rounded">
                    {kw.intent}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-gray-400">{kw.cluster}</td>
                <td className="py-3.5 px-4 text-right">
                  <a
                    href={`/documents/new?targetKeyword=${encodeURIComponent(kw.keyword)}`}
                    className="text-brandHighlight hover:text-white font-medium inline-flex items-center gap-1"
                  >
                    Create Doc <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
