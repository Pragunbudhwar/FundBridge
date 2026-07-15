export default function ProgressBar({ label, progress, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-500',
    emerald: 'bg-emerald-500',
    indigo: 'bg-indigo-500',
    amber: 'bg-amber-500',
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-600">{label}</span>
        <span className="text-sm font-semibold text-slate-800">{progress}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colors[color] || colors.blue}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
