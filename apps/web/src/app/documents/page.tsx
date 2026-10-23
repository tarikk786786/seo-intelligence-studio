import Link from 'next/link';
import { FileText, Plus, ArrowUpRight, BarChart2 } from 'lucide-react';

export default function DocumentsListPage() {
  const sampleDocs = [
    {
      id: 'doc-1',
      title: 'Comprehensive Guide to Generative Engine Optimization (GEO)',
      targetKeyword: 'generative engine optimization',
      score: 84,
      wordCount: 1820,
      updatedAt: '10 mins ago',
    },
    {
      id: 'doc-2',
      title: 'Top 10 Enterprise SEO Strategies for 2026',
      targetKeyword: 'enterprise seo strategies',
      score: 72,
      wordCount: 1450,
      updatedAt: '2 hours ago',
    },
    {
      id: 'doc-3',
      title: 'How to Track Citations in AI Search Engines',
      targetKeyword: 'ai search engine citations',
      score: 91,
      wordCount: 2150,
      updatedAt: 'Yesterday',
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Content Editor Documents</h1>
          <p className="text-xs text-gray-400 mt-1">
            Create, benchmark, and optimize articles against top SERP competitors with real-time NLP scoring.
          </p>
        </div>
        <Link
          href="/documents/new"
          className="px-4 py-2 bg-accent hover:bg-accentHover text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Document
        </Link>
      </div>

      <div className="bg-card border border-cardBorder rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-gray-400 uppercase text-[10px] tracking-wider border-b border-cardBorder">
            <tr>
              <th className="py-3.5 px-4 font-semibold">Document Title</th>
              <th className="py-3.5 px-4 font-semibold">Target Keyword</th>
              <th className="py-3.5 px-4 font-semibold">Content Score</th>
              <th className="py-3.5 px-4 font-semibold">Word Count</th>
              <th className="py-3.5 px-4 font-semibold">Last Modified</th>
              <th className="py-3.5 px-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cardBorder">
            {sampleDocs.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-4 px-4 font-medium text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brandHighlight" />
                  {doc.title}
                </td>
                <td className="py-4 px-4 text-gray-300 font-mono text-[11px]">
                  {doc.targetKeyword}
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                    doc.score >= 80 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : doc.score >= 60 
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {doc.score} / 100
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-400">
                  {doc.wordCount.toLocaleString()} words
                </td>
                <td className="py-4 px-4 text-gray-400">
                  {doc.updatedAt}
                </td>
                <td className="py-4 px-4 text-right">
                  <Link
                    href={`/documents/new?id=${doc.id}&targetKeyword=${encodeURIComponent(doc.targetKeyword)}&title=${encodeURIComponent(doc.title)}`}
                    className="text-brandHighlight hover:text-white font-medium inline-flex items-center gap-1"
                  >
                    Open Editor <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
