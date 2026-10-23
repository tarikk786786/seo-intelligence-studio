'use client';

import { useState } from 'react';
import { HeadphonesIcon, ShieldCheck, Mail, Calendar, MessageSquare, Plus } from 'lucide-react';

export default function CustomerSuccessPage() {
  const [tickets, setTickets] = useState([
    { id: 'TICK-101', subject: 'Increase soft-limit for fair-use documents storage', status: 'RESOLVED', priority: 'NORMAL', created: '2 days ago' },
    { id: 'TICK-102', subject: 'Assistance setting up custom webhook endpoint for Daily AI Refreshes', status: 'IN_PROGRESS', priority: 'HIGH', created: 'Yesterday' }
  ]);

  const [newSubject, setNewSubject] = useState('');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;
    setTickets([
      ...tickets,
      {
        id: `TICK-${Date.now().toString().slice(-3)}`,
        subject: newSubject,
        status: 'OPEN',
        priority: 'NORMAL',
        created: 'Just now'
      }
    ]);
    setNewSubject('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <HeadphonesIcon className="w-6 h-6 text-brandHighlight" />
          Dedicated Customer Success Portal
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Direct concierge access to your assigned Customer Success Manager, enterprise SLA, and priority support tickets.
        </p>
      </div>

      {/* CSM Card */}
      <div className="bg-card border border-cardBorder rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-accent to-brandHighlight flex items-center justify-center font-bold text-white text-xl shadow-lg">
            CS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Enterprise Concierge Success Desk</h2>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded font-semibold border border-emerald-500/20">
                Assigned
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-0.5">Primary Account Manager: <strong>Sarah Jenkins</strong> (Lead Technical Strategist)</p>
            <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-brandHighlight" /> s.jenkins@seointelligence.studio</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-brandHighlight" /> Response SLA: &lt; 2 Hours</span>
            </div>
          </div>
        </div>

        <a
          href="mailto:s.jenkins@seointelligence.studio"
          className="px-4 py-2 bg-accent hover:bg-accentHover text-white text-xs font-semibold rounded-lg shadow-sm"
        >
          Schedule Strategy Call
        </a>
      </div>

      {/* Tickets Section */}
      <div className="bg-card border border-cardBorder rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-white">Support & Entitlement Requests</h3>
        </div>

        <form onSubmit={handleCreateTicket} className="flex gap-2 text-xs">
          <input
            type="text"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="Open a new priority ticket with your CSM..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Open Ticket
          </button>
        </form>

        <div className="divide-y divide-cardBorder">
          {tickets.map((t) => (
            <div key={t.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-mono text-gray-400 mr-2">[{t.id}]</span>
                <span className="font-semibold text-white">{t.subject}</span>
                <span className="text-gray-500 block text-[11px] mt-0.5">Created: {t.created}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                t.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
              }`}>
                {t.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
