const variants = {
  risk_medium: 'bg-amber-50 text-amber-700 border border-amber-200',
  risk_medium_high: 'bg-orange-50 text-orange-700 border border-orange-200',
  risk_high: 'bg-red-50 text-red-700 border border-red-200',
  risk_low: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  stage: 'bg-blue-50 text-blue-700 border border-blue-200',
  tax: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  equity: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  sector: 'bg-slate-100 text-slate-600 border border-slate-200',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
};

export default function Badge({ children, variant = 'sector', icon: Icon }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${variants[variant] || variants.sector}`}>
      {Icon && <Icon className="w-3 h-3" strokeWidth={2.2} />}
      {children}
    </span>
  );
}
