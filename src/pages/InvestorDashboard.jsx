import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import ProgressBar from '../components/ProgressBar';
import { portfolioStartups } from '../data/mockData';

function getRiskVariant(risk) {
  if (risk === 'High') return 'risk_high';
  if (risk === 'Medium-High') return 'risk_medium_high';
  return 'risk_medium';
}

export default function InvestorDashboard({ proposal }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Investor Dashboard</h1>
          <p className="text-slate-500 mt-2">Your portfolio and proposal activity.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Invested" value="€1.3M" accent="blue" />
          <StatCard label="Startups Funded" value="2" sub="via FundBridge" accent="indigo" />
          <StatCard label="Avg. Risk Score" value="72/100" accent="amber" />
          <StatCard label="Tax Rebate Protection" value="€390K" sub="30% of portfolio" accent="emerald" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Portfolio */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-base font-semibold text-slate-900 mb-5">Portfolio Startups</h3>
              <div className="flex flex-col gap-4">
                {portfolioStartups.map((s) => (
                  <div key={s.id} className="border border-slate-100 rounded-2xl p-4 bg-slate-50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-slate-900">{s.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{s.fundingType}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-slate-900">{s.invested}</span>
                        <Badge variant={getRiskVariant(s.riskStatus)}>{s.riskStatus} Risk</Badge>
                      </div>
                    </div>
                    <ProgressBar label="Milestone Progress" progress={s.milestoneProgress} color="indigo" />
                  </div>
                ))}
              </div>
            </div>

            {/* Success / Failure simulation */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-base font-semibold text-slate-900 mb-4">Success / Failure Simulation</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                  <p className="text-sm font-semibold text-emerald-800 mb-2">📈 If startup succeeds</p>
                  <p className="text-sm text-emerald-700 leading-relaxed">
                    Investor receives upside from growth or exit. Government benefits through its passive equity stake. Returns compound with startup stage progression.
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                  <p className="text-sm font-semibold text-blue-800 mb-2">🛡 If startup fails</p>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    Investor receives 30% tax rebate protection, reducing downside risk. On a €500K investment, that's €150K returned via tax relief.
                  </p>
                </div>
              </div>

              {/* Visual example */}
              <div className="mt-4 bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Example: €500K Investment</p>
                <div className="flex flex-col gap-2">
                  {[
                    { scenario: 'Success (3x exit)', return: '+€1,000,000', color: 'text-emerald-600' },
                    { scenario: 'Breakeven', return: '€0', color: 'text-slate-600' },
                    { scenario: 'Failure (with rebate)', return: '-€350,000 net', color: 'text-amber-600' },
                    { scenario: 'Failure (no rebate)', return: '-€500,000', color: 'text-red-600' },
                  ].map((row) => (
                    <div key={row.scenario} className="flex justify-between text-sm">
                      <span className="text-slate-600">{row.scenario}</span>
                      <span className={`font-semibold ${row.color}`}>{row.return}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            {/* Proposal activity */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-base font-semibold text-slate-900 mb-4">Proposal Activity</h3>

              {proposal ? (
                <div className="flex flex-col gap-3">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-2">
                    <span className="text-emerald-600 text-sm font-semibold">✓ Proposal sent</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: 'Startup', value: proposal.startup },
                      { label: 'Amount', value: proposal.amount },
                      { label: 'Type', value: proposal.fundingType === 'milestone' ? 'Milestone-based' : 'Full amount' },
                      { label: 'Tax Rebate', value: proposal.taxRebate },
                      { label: 'Gov. Equity', value: proposal.govEquity },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between text-sm">
                        <span className="text-slate-500">{row.label}</span>
                        <span className="font-medium text-slate-800">{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <p className="text-xs font-semibold text-amber-700">Next step</p>
                    <p className="text-xs text-amber-600 mt-1">FundBridge meeting coordination in progress</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-3xl mb-3">📋</div>
                  <p className="text-sm text-slate-500">No proposals created yet.</p>
                  <p className="text-xs text-slate-400 mt-1">Select a startup to create your first investment proposal.</p>
                </div>
              )}
            </div>

            {/* Protection summary */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
              <p className="text-sm font-semibold mb-3">Portfolio Protection</p>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Invested', value: '€1.3M' },
                  { label: '30% rebate cover', value: '€390K' },
                  { label: 'Net max downside', value: '€910K' },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between text-sm">
                    <span className="text-blue-200">{row.label}</span>
                    <span className="font-semibold text-white">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-px bg-blue-500" />
              <p className="text-xs text-blue-200 mt-3">Tax rebate protection applies to all FundBridge-listed startups per pilot regulation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
