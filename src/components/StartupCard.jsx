import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight, Landmark } from 'lucide-react';
import Badge from './Badge';

const sectorAccent = {
  ClimateTech:  { bar: 'bg-emerald-500', avatar: 'bg-emerald-50 text-emerald-700', ring: 'ring-emerald-100' },
  HealthTech:   { bar: 'bg-blue-500',    avatar: 'bg-blue-50 text-blue-700',       ring: 'ring-blue-100' },
  DeepTech:     { bar: 'bg-violet-500',  avatar: 'bg-violet-50 text-violet-700',   ring: 'ring-violet-100' },
  AgriTech:     { bar: 'bg-amber-500',   avatar: 'bg-amber-50 text-amber-700',     ring: 'ring-amber-100' },
  Cybersecurity:{ bar: 'bg-slate-700',   avatar: 'bg-slate-100 text-slate-700',    ring: 'ring-slate-200' },
};

const defaultAccent = { bar: 'bg-blue-500', avatar: 'bg-blue-50 text-blue-700', ring: 'ring-blue-100' };

export default function StartupCard({ startup, onSelect }) {
  const accent = sectorAccent[startup.sector] ?? defaultAccent;
  const initials = startup.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group h-full bg-white rounded-2xl border border-slate-200 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-soft-lg)] hover:border-slate-300 transition-shadow duration-300 flex flex-col overflow-hidden cursor-pointer"
      onClick={() => onSelect(startup)}
    >
      {/* Top accent bar */}
      <div className={`h-1 w-full ${accent.bar}`} />

      <div className="p-6 flex flex-col gap-5 flex-1">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl ${accent.avatar} ring-2 ${accent.ring} flex items-center justify-center text-sm font-bold flex-shrink-0`}>
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
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">Funding Needed</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">{startup.fundingNeeded}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">Valuation</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">{startup.valuation}</p>
          </div>
        </div>

        {/* Government equity */}
        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Landmark className="w-3.5 h-3.5 text-indigo-500" strokeWidth={2.2} />
            Gov. passive equity
          </span>
          <span className="text-sm font-bold text-slate-900">{startup.govEquity}</span>
        </div>
      </div>

      {/* Footer button */}
      <div className="px-6 pb-6">
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(startup); }}
          className="w-full py-2.5 rounded-xl bg-slate-900 group-hover:bg-blue-600 text-white text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1.5"
        >
          View Startup
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.2} />
        </button>
      </div>
    </motion.div>
  );
}
