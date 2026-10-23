'use client';

import { useState } from 'react';
import { Briefcase, Plus, Globe, Users, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function BrandSpacesPage() {
  const [brands, setBrands] = useState([
    {
      id: 'brand-1',
      name: 'OmniSEO Global',
      domain: 'omniseo.global',
      country: 'US',
      language: 'English',
      competitors: ['surferseo.com', 'ahrefs.com', 'semrush.com'],
      trackedPrompts: 18,
      documentsCount: 42,
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandDomain, setNewBrandDomain] = useState('');
  const [newBrandCompetitors, setNewBrandCompetitors] = useState('');

  const handleCreateBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName || !newBrandDomain) return;

    setBrands([
      ...brands,
      {
        id: `brand-${Date.now()}`,
        name: newBrandName,
        domain: newBrandDomain,
        country: 'US',
        language: 'English',
        competitors: newBrandCompetitors.split(',').map(s => s.trim()).filter(Boolean),
        trackedPrompts: 0,
        documentsCount: 0,
      }
    ]);

    setNewBrandName('');
    setNewBrandDomain('');
    setNewBrandCompetitors('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-brandHighlight" />
            Brand Spaces
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Unlimited* Brand Spaces. Manage domains, target markets, competitor tracking, and AI prompt sets per brand.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-accent hover:bg-accentHover text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          + New Brand Space
        </button>
      </div>

      {/* Brand Spaces Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((b) => (
          <div key={b.id} className="bg-card border border-cardBorder rounded-xl p-5 space-y-4 hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-white">{b.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-brandHighlight font-mono mt-0.5">
                  <Globe className="w-3.5 h-3.5" /> {b.domain}
                </div>
              </div>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded font-semibold border border-emerald-500/20">
                Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase">Market</span>
                <span className="text-gray-200 font-medium">{b.country} ({b.language})</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase">Tracked Prompts</span>
                <span className="text-brandHighlight font-bold">{b.trackedPrompts} / 100</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block mb-1.5">
                Tracked Competitors:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {b.competitors.map((comp, idx) => (
                  <span key={idx} className="text-[11px] bg-slate-800 text-gray-300 px-2 py-0.5 rounded font-mono">
                    {comp}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-cardBorder pt-3 flex justify-between items-center text-xs">
              <span className="text-gray-400">{b.documentsCount} Documents</span>
              <a href="/documents" className="text-brandHighlight hover:text-white font-medium flex items-center gap-1">
                Open Workspace <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-cardBorder w-full max-w-md rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Create New Brand Space</h3>
            <form onSubmit={handleCreateBrand} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 block mb-1 font-semibold">Brand Name</label>
                <input
                  type="text"
                  required
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  placeholder="e.g. Acme Corporation"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1 font-semibold">Primary Domain</label>
                <input
                  type="text"
                  required
                  value={newBrandDomain}
                  onChange={(e) => setNewBrandDomain(e.target.value)}
                  placeholder="e.g. acme.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1 font-semibold">Competitor Domains (comma separated)</label>
                <input
                  type="text"
                  value={newBrandCompetitors}
                  onChange={(e) => setNewBrandCompetitors(e.target.value)}
                  placeholder="e.g. competitor1.com, competitor2.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent hover:bg-accentHover text-white rounded font-semibold"
                >
                  Create Brand Space
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
