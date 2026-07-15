import Badge from './Badge';

function getRiskVariant(risk) {
  if (risk === 'High') return 'risk_high';
  if (risk === 'Medium-High') return 'risk_medium_high';
  return 'risk_medium';
}

function RiskBar({ score }) {
  const color = score >= 75 ? 'bg-red-400' : score >= 60 ? 'bg-amber-400' : 'bg-emerald-400';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs text-slate-500 font-medium">{score}/100</span>
    </div>
  );
}

export default function StartupCard({ startup, onSelect }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{startup.name}</h3>
          <p className="text-sm text-slate-500 mt-0.5">{startup.description}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="sector">{startup.sector}</Badge>
        <Badge variant="stage">{startup.stage}</Badge>
        <Badge variant={getRiskVariant(startup.risk)}>{startup.risk} Risk</Badge>
        <Badge variant="tax">
          <span className="text-emerald-600">✓</span> Tax Rebate {startup.taxRebate}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs text-slate-500">Funding Needed</p>
          <p className="text-base font-bold text-slate-900">{startup.fundingNeeded}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs text-slate-500">Stage 4 Valuation</p>
          <p className="text-base font-bold text-slate-900">{startup.valuation}</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-1">
          <span className="text-xs text-slate-500">Risk Score</span>
          <Badge variant="equity">Gov. equity {startup.govEquity}</Badge>
        </div>
        <RiskBar score={startup.riskScore} />
      </div>

      <button
        onClick={() => onSelect(startup)}
        className="mt-auto w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors duration-150"
      >
        View Startup
      </button>
    </div>
  );
}
