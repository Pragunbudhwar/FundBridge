export default function StatCard({ label, value, sub, accent = 'blue' }) {
  const accents = {
    blue: 'bg-blue-500',
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-red-400',
    violet: 'bg-violet-500',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-2">
      <div className={`w-8 h-1 rounded-full ${accents[accent] || accents.blue}`} />
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      <p className="text-sm font-medium text-slate-600">{label}</p>
      {sub && <p className="text-xs text-slate-400">{sub}</p>}
    </div>
  );
}
