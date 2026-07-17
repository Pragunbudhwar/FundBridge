import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import ProgressBar from '../components/ProgressBar';
import { portfolioStartups } from '../data/mockData';

// ─── Eligibility engine ───────────────────────────────────────────────────────

const REBATE_RATE = 0.30;
const HOLDING_REQUIRED_MONTHS = 24;

function getMonthsHeld(investedSince) {
  const start = new Date(investedSince);
  const now = new Date();
  return (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
}

function getUnlockDate(investedSince) {
  const d = new Date(investedSince);
  d.setMonth(d.getMonth() + HOLDING_REQUIRED_MONTHS);
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

function computeRebate(s) {
  const monthsHeld = getMonthsHeld(s.investedSince);
  const eligible = monthsHeld >= HOLDING_REQUIRED_MONTHS;
  const rebateAmount = Math.round(s.investedAmount * REBATE_RATE);
  return {
    monthsHeld,
    eligible,
    rebateAmount,
    unlockDate: eligible ? null : getUnlockDate(s.investedSince),
    monthsRemaining: Math.max(0, HOLDING_REQUIRED_MONTHS - monthsHeld),
  };
}

// ─────────────────────────────────────────────────────────────────────────────

function getRiskVariant(risk) {
  if (risk === 'High') return 'risk_high';
  if (risk === 'Medium-High') return 'risk_medium_high';
  return 'risk_medium';
}

function fmt(amount) {
  if (amount >= 1_000_000) return `€${(amount / 1_000_000).toFixed(1)}M`;
  return `€${Math.round(amount / 1000)}K`;
}

export default function InvestorDashboard({ proposal }) {
  const rebates = portfolioStartups.map(computeRebate);
  const eligibleTotal = rebates.filter(r => r.eligible).reduce((sum, r) => sum + r.rebateAmount, 0);
  const lockedTotal = rebates.filter(r => !r.eligible).reduce((sum, r) => sum + r.rebateAmount, 0);
  const totalInvested = portfolioStartups.reduce((sum, s) => sum + s.investedAmount, 0);

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
          <StatCard label="Total Invested" value={fmt(totalInvested)} accent="blue" />
          <StatCard label="Startups Funded" value={portfolioStartups.length.toString()} sub="via FundBridge" accent="indigo" />
          <StatCard
            label="Avg. Risk Score"
            value={`${Math.round(portfolioStartups.reduce((s, p) => s + p.riskScore, 0) / portfolioStartups.length)}/100`}
            accent="amber"
          />
          <StatCard
            label="Tax Rebate Eligible"
            value={fmt(eligibleTotal)}
            sub={lockedTotal > 0 ? `${fmt(lockedTotal)} locked · 30% rate` : '30% rate · fully eligible'}
            accent="emerald"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left column */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Portfolio Startups */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-base font-semibold text-slate-900 mb-5">Portfolio Startups</h3>
              <div className="flex flex-col gap-4">
                {portfolioStartups.map((s, i) => {
                  const r = rebates[i];
                  return (
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

                      {/* Tax rebate status */}
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        {r.eligible ? (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500">Tax Rebate</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-emerald-600">✓ Eligible</span>
                              <span className="text-xs font-bold text-slate-900">{fmt(r.rebateAmount)}</span>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-slate-500">Tax Rebate</span>
                              <span className="text-xs font-medium text-amber-600">Unlocks {r.unlockDate} · {r.monthsRemaining} months remaining</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                                  style={{ width: `${(r.monthsHeld / HOLDING_REQUIRED_MONTHS) * 100}%` }}
                                />
                              </div>
                              <span className="text-[11px] text-slate-400 tabular-nums flex-shrink-0">{r.monthsHeld}/{HOLDING_REQUIRED_MONTHS} mo.</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Success / Failure Simulation */}
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
                    Investors who held for ≥24 months receive a 30% tax rebate under §17 EStG. Positions not yet at the 24-month threshold are not covered.
                  </p>
                </div>
              </div>

              <div className="mt-4 bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Example: €500K · GreenCell AI (eligible)</p>
                <div className="flex flex-col gap-2">
                  {[
                    { scenario: 'Success (3× exit)', result: '+€1,000,000', color: 'text-emerald-600' },
                    { scenario: 'Breakeven', result: '€0', color: 'text-slate-600' },
                    { scenario: 'Failure — rebate applies (≥24 mo.)', result: '-€350,000 net', color: 'text-amber-600' },
                    { scenario: 'Failure — no rebate (<24 mo.)', result: '-€500,000', color: 'text-red-600' },
                  ].map((row) => (
                    <div key={row.scenario} className="flex justify-between text-sm">
                      <span className="text-slate-600">{row.scenario}</span>
                      <span className={`font-semibold ${row.color}`}>{row.result}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">

            {/* Proposal Activity */}
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

            {/* Tax Rebate Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-slate-900">Tax Rebate Eligibility</h3>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-1 rounded-full">§17 EStG</span>
              </div>

              {/* Criteria */}
              <div className="flex flex-col gap-2 mb-5">
                {[
                  { label: 'Holding period ≥ 24 months', met: true },
                  { label: 'FundBridge-listed startup', met: true },
                  { label: 'Invested under pilot scheme', met: true },
                ].map((c) => (
                  <div key={c.label} className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="text-emerald-500 font-bold">✓</span>
                    {c.label}
                  </div>
                ))}
              </div>

              {/* Per-position breakdown */}
              <div className="flex flex-col gap-3 mb-5">
                {portfolioStartups.map((s, i) => {
                  const r = rebates[i];
                  return (
                    <div key={s.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-slate-800">{s.name}</span>
                        {r.eligible ? (
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">Eligible</span>
                        ) : (
                          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">Pending</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span>{s.invested} · {r.monthsHeld} months held</span>
                        <span className={r.eligible ? 'font-bold text-emerald-600' : 'text-slate-400'}>
                          {r.eligible ? fmt(r.rebateAmount) : `${fmt(r.rebateAmount)} locked`}
                        </span>
                      </div>
                      {!r.eligible && (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full"
                              style={{ width: `${(r.monthsHeld / HOLDING_REQUIRED_MONTHS) * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 tabular-nums flex-shrink-0">{r.monthsHeld}/{HOLDING_REQUIRED_MONTHS} mo</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Eligible now</span>
                  <span className="font-bold text-emerald-600">{fmt(eligibleTotal)}</span>
                </div>
                {lockedTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Locked (pending)</span>
                    <span className="font-medium text-amber-500">{fmt(lockedTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm border-t border-slate-100 pt-2 mt-1">
                  <span className="text-slate-700 font-medium">Total potential</span>
                  <span className="font-bold text-slate-900">{fmt(eligibleTotal + lockedTotal)}</span>
                </div>
              </div>

              <div className="mt-4 bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Under §17 EStG pilot regulation, investors holding FundBridge positions for ≥24 months receive a 30% tax rebate on loss if a startup fails. Eligibility resets if the position is sold or transferred before the threshold.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
