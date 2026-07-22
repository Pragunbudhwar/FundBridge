import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight, Landmark } from 'lucide-react';
import Badge from './Badge';

// Sector identity lives only in the initials-avatar tint (no colored strips).
const sectorAvatar = {
  ClimateTech:  'bg-emerald-50 text-emerald-700 ring-emerald-100',
  HealthTech:   'bg-blue-50 text-blue-700 ring-blue-100',
  DeepTech:     'bg-violet-50 text-violet-700 ring-violet-100',
  AgriTech:     'bg-amber-50 text-amber-700 ring-amber-100',
  Cybersecurity:'bg-slate-100 text-slate-700 ring-slate-200',
};

const defaultAvatar = 'bg-blue-50 text-blue-700 ring-blue-100';

export default function StartupCard({ startup, onSelect }) {
  const avatar = sectorAvatar[startup.sector] ?? defaultAvatar;
  const initials = startup.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group h-full bg-white rounded-2xl border border-slate-200 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-soft-lg)] hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
      onClick={() => onSelect(startup)}
    >
      <div className="p-7 flex flex-col gap-5 flex-1">
        {/* Header */}
        <div className="flex items-start gap-3.5">
          <div className={`w-11 h-11 rounded-xl ${avatar} ring-2 flex items-center justify-center text-sm font-bold flex-shrink-0`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-slate-900 leading-snug">{startup.name}</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2 min-h-[2rem]">{startup.description}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="sector">{startup.sector}</Badge>
          <Badge variant="stage">{startup.stage}</Badge>
          <Badge variant="tax" icon={ShieldCheck}>Tax Rebate</Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">Funding Needed</p>
            <p className="text-lg font-bold text-slate-900 mt-1">{startup.fundingNeeded}</p>
          </div>
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">Valuation</p>
            <p className="text-lg font-bold text-slate-900 mt-1">{startup.valuation}</p>
          </div>
        </div>

        {/* Government equity */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Landmark className="w-3.5 h-3.5 text-indigo-500" strokeWidth={2.2} />
            Gov. passive equity
          </span>
          <span className="text-sm font-bold text-slate-900">{startup.govEquity}</span>
        </div>
      </div>

      {/* Footer button */}
      <div className="px-7 pb-7">
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(startup); }}
          className="w-full py-2.5 rounded-xl bg-slate-900 group-hover:bg-blue-600 text-white text-sm font-medium transition-colors duration-300 flex items-center justify-center gap-1.5"
        >
          View Startup
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.2} />
        </button>
      </div>
    </motion.div>
  );
}
