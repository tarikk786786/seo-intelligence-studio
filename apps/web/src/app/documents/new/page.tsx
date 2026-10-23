'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { computeOptimizationScore } from '@repo/seo-engine';
import { 
  Sparkles, 
  Download, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Heading1, 
  Heading2, 
  Heading3,
  Save
} from 'lucide-react';

export default function DocumentEditorPage() {
  const searchParams = useSearchParams();
  const initialKeyword = searchParams.get('targetKeyword') || 'generative engine optimization';
  const initialTitle = searchParams.get('title') || 'Generative Engine Optimization (GEO): Complete Playbook';

  const [title, setTitle] = useState(initialTitle);
  const [targetKeyword, setTargetKeyword] = useState(initialKeyword);
  const [content, setContent] = useState(`<h1>Generative Engine Optimization (GEO): Complete Playbook</h1>
<p>Generative Engine Optimization (GEO) is the next evolution of search marketing. As AI-powered search engines like Google Gemini and OpenAI Search transform how users discover information, digital marketers must optimize not just for traditional search ranking positions, but for AI citations, direct brand mentions, and grounding sources.</p>

<h2>Understanding Generative Engine Optimization</h2>
<p>Unlike conventional SEO which focuses heavily on blue links and meta tags, generative engine optimization requires content to be authoritative, factual, and easily parsed by Large Language Models. When an AI search engine synthesizes an answer, it extracts key concepts from top grounding chunks.</p>

<h2>Best Practices for AI Visibility</h2>
<p>To maximize brand citations and visibility, organizations should implement structured content hierarchies, answer direct user queries concisely in the opening paragraphs, and maintain high factual density. Incorporating primary research and verifiable data significantly increases the probability of receiving attribution links.</p>

<h2>Content Optimization and Entity Coverage</h2>
<p>Optimizing content for both human readers and generative engines requires maintaining natural keyword density while ensuring comprehensive topical coverage of related semantic entities.</p>`);

  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const [saveStatus, setSaveStatus] = useState('Saved to workspace');

  // Real-time calculation of Optimization Score
  const scoreBreakdown = useMemo(() => {
    return computeOptimizationScore(content, targetKeyword);
  }, [content, targetKeyword]);

  // URL import handler
  const handleImport = async () => {
    if (!importUrl) return;
    setIsImporting(true);
    setImportError('');
    try {
      const res = await fetch(`/api/v1/page-audit?url=${encodeURIComponent(importUrl)}`);
      const data = await res.json();
      if (!res.ok || data.error) {
        setImportError(data.error || 'Failed to import page');
      } else {
        if (data.title) setTitle(data.title);
        if (data.cleanText) {
          setContent(`<h1>${data.title}</h1>\n<p>${data.cleanText.slice(0, 3000)}</p>`);
        }
      }
    } catch (err: any) {
      setImportError(err.message);
    } finally {
      setIsImporting(false);
    }
  };

  // Export handler
  const handleExport = (format: 'html' | 'md') => {
    const blob = new Blob([content], { type: format === 'html' ? 'text/html' : 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cardBorder pb-4">
        <div className="flex-1 max-w-xl">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-xl font-bold text-white border-b border-transparent hover:border-slate-700 focus:border-accent focus:outline-none transition-colors"
            placeholder="Document Title..."
          />
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
            <span>Target Keyword:</span>
            <input
              type="text"
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-brandHighlight font-mono text-xs focus:outline-none focus:border-accent"
            />
            <span className="text-[11px] text-emerald-400">• {saveStatus}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('html')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded border border-slate-700 flex items-center gap-1.5 text-gray-200"
          >
            <Download className="w-3.5 h-3.5" /> Export HTML
          </button>
          <button
            onClick={() => handleExport('md')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded border border-slate-700 flex items-center gap-1.5 text-gray-200"
          >
            <Download className="w-3.5 h-3.5" /> Export MD
          </button>
        </div>
      </div>

      {/* URL Ingestion Bar */}
      <div className="bg-card border border-cardBorder p-3 rounded-lg flex flex-col sm:flex-row gap-2 items-center text-xs">
        <Globe className="w-4 h-4 text-brandHighlight hidden sm:block" />
        <span className="font-semibold text-gray-300 whitespace-nowrap">Import Existing URL:</span>
        <input
          type="url"
          value={importUrl}
          onChange={(e) => setImportUrl(e.target.value)}
          placeholder="https://example.com/article-to-optimize"
          className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
        />
        <button
          onClick={handleImport}
          disabled={isImporting || !importUrl}
          className="px-3 py-1.5 bg-accent hover:bg-accentHover disabled:opacity-50 text-white font-semibold rounded whitespace-nowrap"
        >
          {isImporting ? 'Importing...' : 'Fetch & Ingest'}
        </button>
        {importError && <span className="text-red-400 text-[11px]">{importError}</span>}
      </div>

      {/* Main Grid: Editor + Optimization Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Area */}
        <div className="lg:col-span-2 bg-card border border-cardBorder rounded-xl flex flex-col h-[750px] overflow-hidden">
          {/* Format Toolbar */}
          <div className="border-b border-cardBorder p-2.5 bg-slate-900/80 flex items-center gap-2 text-xs text-gray-300">
            <span className="text-[11px] font-semibold text-gray-400 mr-2">Formatting:</span>
            <button
              onClick={() => setContent(prev => prev + '\n<h1>New Heading 1</h1>\n<p>Content...</p>')}
              className="p-1.5 hover:bg-slate-800 rounded text-gray-300 hover:text-white"
              title="Add H1"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setContent(prev => prev + '\n<h2>New Subheading (H2)</h2>\n<p>Content...</p>')}
              className="p-1.5 hover:bg-slate-800 rounded text-gray-300 hover:text-white"
              title="Add H2"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setContent(prev => prev + '\n<h3>Section Header (H3)</h3>\n<p>Content...</p>')}
              className="p-1.5 hover:bg-slate-800 rounded text-gray-300 hover:text-white"
              title="Add H3"
            >
              <Heading3 className="w-4 h-4" />
            </button>
          </div>

          {/* Text Area */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 w-full p-6 bg-transparent text-gray-200 font-sans text-sm leading-relaxed resize-none focus:outline-none"
            placeholder="Write your article or paste HTML / Markdown here..."
          />
        </div>

        {/* Real-Time Optimization Sidebar (Surfer Grade) */}
        <div className="bg-card border border-cardBorder rounded-xl p-5 flex flex-col h-[750px] overflow-y-auto space-y-6">
          {/* Score Header */}
          <div className="border-b border-cardBorder pb-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Optimization Score</span>
              <span className="text-[10px] text-gray-400">Target: 80+</span>
            </div>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black ${
                scoreBreakdown.totalScore >= 80 
                  ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500' 
                  : scoreBreakdown.totalScore >= 60 
                  ? 'bg-amber-500/20 text-amber-400 border-2 border-amber-500'
                  : 'bg-red-500/20 text-red-400 border-2 border-red-500'
              }`}>
                {scoreBreakdown.totalScore}
              </div>
              <div className="text-xs space-y-0.5">
                <div className="font-semibold text-white">
                  {scoreBreakdown.totalScore >= 80 ? 'Well Optimized for SERP' : 'Improvement Recommended'}
                </div>
                <div className="text-gray-400">
                  Readability: <span className="text-brandHighlight font-medium">{scoreBreakdown.readability.label}</span>
                </div>
                <div className="text-gray-400">
                  Entity Coverage: <span className="text-emerald-400 font-medium">{scoreBreakdown.entityCoveragePercentage}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Score Sub-components */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Score Breakdown</div>
            
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-300">
                <span>NLP Entity Coverage (35 pts max)</span>
                <span className="font-semibold text-brandHighlight">{scoreBreakdown.entityScore} / 35</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div className="bg-brandHighlight h-full rounded-full" style={{ width: `${(scoreBreakdown.entityScore / 35) * 100}%` }} />
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-300">
                <span>Target Keyword Density (25 pts max)</span>
                <span className="font-semibold text-brandHighlight">{scoreBreakdown.keywordScore} / 25</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div className="bg-brandHighlight h-full rounded-full" style={{ width: `${(scoreBreakdown.keywordScore / 25) * 100}%` }} />
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-300">
                <span>Heading & Word Structure (20 pts max)</span>
                <span className="font-semibold text-brandHighlight">{scoreBreakdown.structureScore} / 20</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div className="bg-brandHighlight h-full rounded-full" style={{ width: `${(scoreBreakdown.structureScore / 20) * 100}%` }} />
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-300">
                <span>Flesch Readability (20 pts max)</span>
                <span className="font-semibold text-brandHighlight">{scoreBreakdown.readabilityScore} / 20</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div className="bg-brandHighlight h-full rounded-full" style={{ width: `${(scoreBreakdown.readabilityScore / 20) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Optimization Actions</div>
            {scoreBreakdown.recommendations.length === 0 ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                All top recommendations satisfied!
              </div>
            ) : (
              <div className="space-y-2">
                {scoreBreakdown.recommendations.map((rec, i) => (
                  <div key={i} className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-lg text-xs text-gray-300 flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
