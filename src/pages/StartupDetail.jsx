import Badge from '../components/Badge';
import ProgressBar from '../components/ProgressBar';

function getRiskVariant(risk) {
  if (risk === 'High') return 'risk_high';
  if (risk === 'Medium-High') return 'risk_medium_high';
  return 'risk_medium';
}

const flowSteps = [
  { label: 'Stage 1–4', sub: 'Government Support', color: 'bg-blue-600' },
  { label: 'Stage 4', sub: 'FundBridge Validation', color: 'bg-indigo-600' },
  { label: 'Stage 4–6', sub: 'Private Investment', color: 'bg-violet-600' },
  { label: 'Stage 6', sub: 'Growth / Exit', color: 'bg-emerald-600' },
];

const progressColors = ['blue', 'indigo', 'emerald'];

export default function StartupDetail({ startup, onBack, onPropose }) {
  if (!startup) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium mb-8 transition-colors"
        >
          ← Back to Marketplace
        </button>

        {/* Top header */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="sector">{startup.sector}</Badge>
                <Badge variant="stage">{startup.stage}</Badge>
                <Badge variant={getRiskVariant(startup.risk)}>{startup.risk} Risk</Badge>
                <Badge variant="tax">
                  <span>✓</span> Tax Rebate {startup.taxRebate}
                </Badge>
                <Badge variant="equity">Gov. Equity {startup.govEquity}</Badge>
                {startup.founded && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                    Founded {startup.founded}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-slate-900">{startup.name}</h1>
              <p className="text-slate-500 mt-2 text-base max-w-xl">{startup.longDescription}</p>
            </div>
            <button
              onClick={onPropose}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-200 transition-all duration-150 hover:shadow-xl whitespace-nowrap"
            >
              Create Investment Proposal
            </button>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Stage 4 Valuation', value: startup.valuation },
              { label: 'Funding to Stage 6', value: startup.fundingNeeded },
              { label: 'Risk Score', value: `${startup.riskScore}/100` },
              { label: 'Gov. Passive Equity', value: startup.govEquity },
            ].map((m) => (
              <div key={m.label} className="bg-slate-50 rounded-2xl p-4">
                <p className="text-xs text-slate-500">{m.label}</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{m.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Traction KPIs */}
        {startup.traction && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Traction &amp; KPIs</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Team Size', value: `${startup.traction.teamSize} people`, icon: '👥' },
                { label: 'Revenue', value: startup.traction.revenueLabel, icon: '📈' },
                { label: 'Customers', value: startup.traction.customersLabel, icon: '🏢' },
                { label: 'Key Partnerships', value: startup.traction.partnershipsLabel, icon: '🤝' },
              ].map((kpi) => {
                const isPreRevenue = kpi.label === 'Revenue' && kpi.value === 'Pre-revenue';
                return (
                  <div key={kpi.label} className={`rounded-xl p-4 flex flex-col gap-1 ${isPreRevenue ? 'bg-amber-50' : 'bg-slate-50'}`}>
                    <span className="text-lg">{kpi.icon}</span>
                    <p className="text-xs text-slate-500 mt-1">{kpi.label}</p>
                    {isPreRevenue ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full w-fit mt-0.5">
                        Pre-revenue
                      </span>
                    ) : (
                      <p className="text-sm font-semibold text-slate-800">{kpi.value}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Achievements */}
            {startup.achievements && startup.achievements.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-4">Key Achievements</h3>
                <ul className="flex flex-col gap-3">
                  {startup.achievements.map((achievement, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">{achievement}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Milestone progress */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-base font-semibold text-slate-900 mb-5">Milestone Progress</h3>
              <div className="flex flex-col gap-5">
                {startup.milestones.map((m, i) => (
                  <ProgressBar
                    key={m.name}
                    label={m.name}
                    progress={m.progress}
                    color={progressColors[i]}
                  />
                ))}
              </div>
            </div>

            {/* Recent Updates */}
            {startup.recentUpdates && startup.recentUpdates.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-5">Recent Updates</h3>
                <div className="flex flex-col gap-0">
                  {startup.recentUpdates.map((update, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                        {i < startup.recentUpdates.length - 1 && (
                          <div className="w-px flex-1 bg-slate-200 my-1" />
                        )}
                      </div>
                      <div className="pb-5">
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{update.date}</span>
                        <p className="text-sm font-semibold text-slate-800 mt-2">{update.title}</p>
                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">{update.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stage flow */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-base font-semibold text-slate-900 mb-6">Funding Journey</h3>
              <div className="flex items-start justify-between gap-2 overflow-x-auto">
                {flowSteps.map((step, i) => (
                  <div key={step.label} className="flex items-center">
                    <div className="flex flex-col items-center text-center min-w-[110px]">
                      <div className={`w-10 h-10 rounded-full ${step.color} flex items-center justify-center text-white font-bold text-sm shadow`}>
                        {i + 1}
                      </div>
                      <p className="mt-2 text-xs font-semibold text-slate-800">{step.label}</p>
                      <p className="text-xs text-slate-400">{step.sub}</p>
                    </div>
                    {i < flowSteps.length - 1 && (
                      <span className="text-slate-300 mx-1 mb-5 text-lg">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Investor protection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                <p className="text-sm font-semibold text-emerald-800 mb-1">🛡 30% Tax Rebate Protection</p>
                <p className="text-sm text-emerald-700">If this startup fails, investors receive a 30% tax rebate on capital invested, reducing net downside risk significantly.</p>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
                <p className="text-sm font-semibold text-indigo-800 mb-1">🏛 Government Passive Equity</p>
                <p className="text-sm text-indigo-700">The government holds a passive {startup.govEquity} stake based on stage 4 valuation ({startup.valuation}), aligning public and private upside.</p>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            {/* Government support history */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-base font-semibold text-slate-900 mb-4">Government Support History</h3>
              <div className="flex flex-col gap-3">
                {startup.govHistory.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-sm text-slate-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk overview */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-base font-semibold text-slate-900 mb-4">Risk Overview</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500">Risk level</span>
                <Badge variant={getRiskVariant(startup.risk)}>{startup.risk}</Badge>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-500">Risk score</span>
                <span className="text-sm font-semibold text-slate-800">{startup.riskScore}/100</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${startup.riskScore >= 75 ? 'bg-red-400' : startup.riskScore >= 60 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                  style={{ width: `${startup.riskScore}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-3">Lower is better. Score reflects stage completion, market traction, and regulatory exposure.</p>
            </div>

            {/* CTA card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
              <p className="text-base font-semibold mb-2">Ready to invest?</p>
              <p className="text-sm text-blue-100 mb-4">Create a milestone-based or full investment proposal for {startup.name}.</p>
              <button
                onClick={onPropose}
                className="w-full py-2.5 rounded-xl bg-white text-blue-700 font-semibold text-sm hover:bg-blue-50 transition-colors duration-150"
              >
                Create Investment Proposal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
