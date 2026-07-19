import { motion } from 'motion/react';
import CountUp from './CountUp';

export default function StatCard({ label, value, sub, accent = 'blue', icon: Icon, animate = true }) {
  const accents = {
    blue:    { bar: 'from-blue-400 to-blue-600',       tile: 'bg-blue-50 text-blue-600' },
    indigo:  { bar: 'from-indigo-400 to-indigo-600',   tile: 'bg-indigo-50 text-indigo-600' },
    emerald: { bar: 'from-emerald-400 to-emerald-600', tile: 'bg-emerald-50 text-emerald-600' },
    amber:   { bar: 'from-amber-400 to-amber-500',     tile: 'bg-amber-50 text-amber-600' },
    red:     { bar: 'from-red-300 to-red-500',         tile: 'bg-red-50 text-red-500' },
    violet:  { bar: 'from-violet-400 to-violet-600',   tile: 'bg-violet-50 text-violet-600' },
  };
  const a = accents[accent] || accents.blue;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-soft-md)] p-6 flex flex-col gap-2 transition-shadow duration-200"
    >
      <div className="flex items-center justify-between">
        <div className={`h-1.5 w-8 rounded-full bg-gradient-to-r ${a.bar}`} />
        {Icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.tile}`}>
            <Icon className="w-4 h-4" strokeWidth={2} />
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900 mt-1 tracking-tight font-display">
        {animate ? <CountUp value={value} /> : value}
      </p>
      <p className="text-sm font-medium text-slate-600">{label}</p>
      {sub && <p className="text-xs text-slate-400">{sub}</p>}
    </motion.div>
  );
}
