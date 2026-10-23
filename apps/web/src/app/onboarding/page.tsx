'use client';

import { useState } from 'react';
import { Compass, CheckCircle2, ArrowRight, ShieldCheck, Download, Sparkles, Globe } from 'lucide-react';

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { num: 1, title: 'Workspace & Plan', desc: 'Enterprise Unlimited* Plan verified' },
    { num: 2, title: 'Brand Space & Domain', desc: 'Configure primary brand domain and locale' },
    { num: 3, title: 'Competitors', desc: 'Identify 3-5 main search rivals' },
    { num: 4, title: 'Data Providers', desc: 'Verify Gemini Grounding & SERP APIs' },
    { num: 5, title: 'AI Visibility Prompts', desc: 'Add initial prompts for daily tracking' },
    { num: 6, title: 'Chrome Extension', desc: 'Load unpacked Manifest V3 extension' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Compass className="w-6 h-6 text-brandHighlight" />
          Personalized Onboarding Wizard
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Follow these structured milestones to configure your workspace, brand space, AI visibility schedules, and browser extension.
        </p>
      </div>

      {/* Stepper Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {steps.map((s) => (
          <button
            key={s.num}
            onClick={() => setCurrentStep(s.num)}
            className={`p-3 rounded-xl border text-left transition-all ${
              currentStep === s.num
                ? 'bg-accent/20 border-accent text-white'
                : currentStep > s.num
                ? 'bg-slate-900 border-slate-800 text-emerald-400'
                : 'bg-card border-cardBorder text-gray-400 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span>Step {s.num}</span>
              {currentStep > s.num && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </div>
            <div className="text-[11px] font-semibold truncate">{s.title}</div>
          </button>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-card border border-cardBorder rounded-xl p-8 space-y-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Step 1: Workspace & Entitlements Verification</h2>
            <p className="text-xs text-gray-300">
              Your organization is provisioned on the <strong>Enterprise Plan</strong> with all requested entitlements:
            </p>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-xs space-y-2 text-gray-300">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Unlimited* Documents (Subject to standard fair-use)
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Track AI Visibility with 100 Tracked AI Prompts
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> 100 Daily Prompt Refresh Cadence via BullMQ Worker
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Unlimited* Brand Spaces
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Advanced SERP Analysis & Content Gap Matrix
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Dedicated Customer Success Manager Assigned
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> REST API Access & Scoped Keys
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4 text-xs">
            <h2 className="text-lg font-bold text-white">Step 2: Primary Brand Space Configuration</h2>
            <p className="text-gray-300">Enter your official website and locale settings:</p>
            <div className="space-y-3">
              <div>
                <label className="text-gray-300 block mb-1 font-semibold">Primary Brand Domain</label>
                <input
                  type="text"
                  defaultValue="omniseo.global"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-gray-300 block mb-1 font-semibold">Target Search Market</label>
                <select className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white">
                  <option>United States (English)</option>
                  <option>United Kingdom (English)</option>
                  <option>Global (Multi-region)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4 text-xs">
            <h2 className="text-lg font-bold text-white">Step 3: Competitor Benchmark Domains</h2>
            <p className="text-gray-300">
              Add your primary organic and generative search competitors for Share of Voice and citation benchmarking:
            </p>
            <div className="space-y-2">
              <input type="text" defaultValue="surferseo.com" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono" />
              <input type="text" defaultValue="ahrefs.com" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono" />
              <input type="text" defaultValue="semrush.com" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono" />
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4 text-xs">
            <h2 className="text-lg font-bold text-white">Step 4: Connect Live Search & AI Grounding Providers</h2>
            <p className="text-gray-300">
              To guarantee 100% authentic data, provide your API keys in <code>.env</code>:
            </p>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono text-[11px] text-gray-300 space-y-1">
              <div>GEMINI_API_KEY="AIzaSy..." <span className="text-emerald-400"># Enables Google Search Grounding & citations</span></div>
              <div>SERP_PROVIDER_API_KEY="..." <span className="text-emerald-400"># Enables real SERP ranks & organic listings</span></div>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-4 text-xs">
            <h2 className="text-lg font-bold text-white">Step 5: Schedule AI Visibility Prompts</h2>
            <p className="text-gray-300">
              You are entitled to track up to <strong>100 active prompts</strong> with daily automated refresh cycles:
            </p>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-gray-300">
              ✓ Initial seed prompts loaded from Brand Space topics.<br />
              ✓ Next daily refresh cycle scheduled at midnight UTC via persistent worker.
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-4 text-xs">
            <h2 className="text-lg font-bold text-white">Step 6: Chrome Extension Companion (Manifest V3)</h2>
            <p className="text-gray-300">
              Install the extension to activate Keyword Surfer-style in-SERP floating search volumes and one-click on-page SEO audits:
            </p>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2 text-gray-300">
              <div>1. Open Google Chrome and navigate to: <code>chrome://extensions</code></div>
              <div>2. Toggle <strong>"Developer mode"</strong> in the top-right corner.</div>
              <div>3. Click <strong>"Load unpacked"</strong>.</div>
              <div>4. Select the directory: <code>apps/extension/.output/chrome-mv3</code></div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-cardBorder">
          <button
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-gray-300 text-xs font-semibold rounded-lg"
          >
            Back
          </button>
          {currentStep < 6 ? (
            <button
              onClick={() => setCurrentStep(prev => Math.min(6, prev + 1))}
              className="px-5 py-2 bg-accent hover:bg-accentHover text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              Continue to Step {currentStep + 1} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <a
              href="/"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              Finish Onboarding & Open Dashboard <CheckCircle2 className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
