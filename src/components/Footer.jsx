import { Waypoints, ShieldCheck } from 'lucide-react';

const columns = [
  {
    title: 'Product',
    links: ['Startup Marketplace', 'Investor Dashboard', 'Government Dashboard', 'Milestone Funding'],
  },
  {
    title: 'Program',
    links: ['How FundBridge Works', 'Stage 4 Validation', '§17 EStG Rebate', 'Federal Innovation Office'],
  },
  {
    title: 'Legal',
    links: ['Privacy Policy', 'Terms of Service', 'Regulatory Notice', 'Imprint'],
  },
];

export default function Footer({ setPage }) {
  const go = (page) => () => setPage?.(page);

  return (
    <footer className="relative overflow-hidden bg-ink text-slate-300">
      {/* top hairline glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <button onClick={go('home')} className="flex items-center gap-2.5 group mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-[0_4px_12px_rgba(37,99,235,0.45)]">
                <Waypoints className="w-4 h-4 text-white" strokeWidth={2.4} />
              </div>
              <span className="text-white font-semibold text-lg tracking-tight font-display">
                Fund<span className="text-blue-400">Bridge</span>
              </span>
            </button>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              De-risking the bridge from public startup funding to private capital — with trust, milestone control, and downside protection.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full glass-dark px-3 py-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2.2} />
              <span className="text-xs font-medium text-slate-300">Pilot Program · 2024/25</span>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">{col.title}</p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">{link}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
            FundBridge is a pilot demonstration. Tax rebate eligibility is governed by the §17 EStG pilot regulation and requires a verified insolvency filing and a ≥24-month holding period. Not investment advice.
          </p>
          <p className="text-xs text-slate-500 whitespace-nowrap">© 2026 FundBridge</p>
        </div>
      </div>
    </footer>
  );
}
