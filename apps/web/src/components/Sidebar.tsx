'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Search, 
  Sparkles, 
  BarChart3, 
  Plug, 
  Briefcase, 
  Compass, 
  HeadphonesIcon, 
  KeyRound 
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Brand Spaces', href: '/brands', icon: Briefcase },
  { name: 'Content Editor', href: '/documents', icon: FileText },
  { name: 'Keyword Research', href: '/keywords', icon: Search },
  { name: 'SERP Analyzer', href: '/serp', icon: BarChart3 },
  { name: 'AI Visibility (GEO)', href: '/ai-visibility', icon: Sparkles },
  { name: 'Integrations Hub', href: '/integrations', icon: Plug },
  { name: 'Onboarding', href: '/onboarding', icon: Compass },
  { name: 'CSM & Support', href: '/admin/csm', icon: HeadphonesIcon },
  { name: 'Account & Login', href: '/login', icon: KeyRound },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-cardBorder bg-card min-h-screen flex flex-col justify-between p-4">
      <div>
        <div className="flex items-center gap-3 px-2 py-4 mb-4 border-b border-cardBorder">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-accent to-brandHighlight flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-accent/20">
            ✦
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide text-white">SEO Studio</h1>
            <p className="text-[11px] text-gray-400">Enterprise Plan</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-accent/20 text-brandHighlight border border-accent/30'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brandHighlight' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-cardBorder pt-3 px-2 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-gray-400 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Studio Engine Live</span>
          </div>
          <span className="text-[10px] bg-slate-800 text-gray-300 px-2 py-0.5 rounded font-mono">v1.0.0</span>
        </div>
        <a
          href="https://tarikislam.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-sky-950/40 border border-sky-500/20 text-[11px] text-gray-300 hover:text-white hover:border-sky-500/40 transition-colors group"
        >
          <span className="font-semibold text-sky-400 group-hover:text-sky-300">Made by tarikislam.in</span>
          <span className="text-[10px] text-sky-400">✦</span>
        </a>
      </div>
    </aside>
  );
}
