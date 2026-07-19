import { motion } from 'motion/react';
import { Landmark, BarChart3, Handshake, ShieldCheck, Building2, Wallet, LineChart, Coins } from 'lucide-react';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import Reveal from '../components/Reveal';
import { startups } from '../data/mockData';

function getRiskVariant(risk) {
  if (risk === 'High') return 'risk_high';
  if (risk === 'Medium-High') return 'risk_medium_high';
  return 'risk_medium';
}

const transferredStartups = startups.map((s) => ({
  ...s,
  investorInterest: s.riskScore < 65 ? 'Active' : s.riskScore < 75 ? 'Reviewing' : 'Pending',
}));

const missionItems = [
  { icon: Landmark, text: 'Public money exits at stage 4' },
  { icon: BarChart3, text: 'Passive equity retained for upside' },
  { icon: Handshake, text: 'Private capital bridges stage 4–6' },
  { icon: ShieldCheck, text: 'Investor rebate limits political risk' },
];

export default function GovernmentDashboard() {
  const totalFunding = startups.reduce((a, s) => a + s.fundingAmount, 0);
  const totalEquity = startups.reduce((a, s) => a + s.govEquityNum, 0);

  return (
    <div className="min-h-screen bg-mesh-soft bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <Reveal className="mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5 text-sm text-indigo-700 font-medium mb-4">
            <Landmark className="w-4 h-4" strokeWidth={2.2} />
            Federal Innovation Office · FundBridge Program
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight font-display">Government Dashboard</h1>
          <p className="text-slate-500 mt-3 text-lg">Startup transfer pipeline and passive equity oversight.</p>
        </Reveal>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard label="Startups Transferred" value="5" accent="blue" icon={Building2} />
          <StatCard label="Private Capital Attracted" value={`€${(totalFunding / 1000000).toFixed(1)}M`} sub="total funding sought" accent="indigo" icon={Wallet} />
          <StatCard label="Gov. Equity Held" value={`${totalEquity}%`} sub="across all startups" accent="violet" icon={BarChart3} />
          <StatCard label="Potential Public Upside" value="€6.8M" sub="at current valuations" accent="emerald" icon={LineChart} />
          <StatCard label="Tax Rebate Exposure" value="€2.1M" sub="30% of total funding" accent="amber" icon={Coins} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Startup table */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Reveal>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-[var(--shadow-soft)] overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h3 className="text-base font-semibold text-slate-900">Transferred Startups</h3>
                  <p className="text-sm text-slate-500 mt-0.5">All stage 4 validated startups now open for private investment.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        {['Startup', 'Gov. Equity', 'Funding Needed', 'Investor Interest', 'Risk'].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {transferredStartups.map((s, i) => (
                        <motion.tr
                          key={s.id}
                          initial={{ opacity: 0, x: -8 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3) }}
                          className={`border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                        >
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-semibold text-slate-900">{s.name}</p>
                              <p className="text-xs text-slate-400">{s.sector}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="equity">{s.govEquity}</Badge>
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-800">{s.fundingNeeded}</td>
                          <td className="px-4 py-3">
                            <Badge
                              variant={
                                s.investorInterest === 'Active'
                                  ? 'success'
                                  : s.investorInterest === 'Reviewing'
                                  ? 'pending'
                                  : 'sector'
                              }
                            >
                              {s.investorInterest}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={getRiskVariant(s.risk)}>{s.risk}</Badge>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Reveal>

            {/* Equity overview */}
            <Reveal>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-[var(--shadow-soft)] p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-4">Government Equity Overview</h3>
                <div className="flex flex-col gap-3">
                  {startups.map((s) => {
                    const equityValue = ((s.valuationAmount * s.govEquityNum) / 100).toLocaleString('en-EU', {
                      style: 'currency',
                      currency: 'EUR',
                      maximumFractionDigits: 0,
                    });
                    return (
                      <div key={s.id} className="flex items-center gap-4">
                        <div className="w-32 text-sm font-medium text-slate-700 flex-shrink-0">{s.name}</div>
                        <div className="flex-1">
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-indigo-500 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${s.govEquityNum * 10}%` }}
                              viewport={{ once: true, amount: 0.6 }}
                              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                            />
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-sm font-bold text-slate-900">{s.govEquity}</span>
                          <span className="text-xs text-slate-400 ml-1">({equityValue})</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            {/* Mission card */}
            <Reveal>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-[var(--shadow-soft)] p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-3">FundBridge Mission</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  FundBridge allows the government to reduce direct funding pressure while keeping passive upside participation in startups it supported early.
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  {missionItems.map((mItem) => (
                    <div key={mItem.text} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                        <mItem.icon className="w-3.5 h-3.5" strokeWidth={2.2} />
                      </span>
                      <span className="mt-0.5">{mItem.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Risk exposure */}
            <Reveal>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-[var(--shadow-soft)] p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-4">Fiscal Risk Exposure</h3>
                <div className="flex flex-col gap-3">
                  {[
                    { label: 'Total funding pipeline', value: `€${(totalFunding / 1000000).toFixed(2)}M`, color: 'text-slate-900' },
                    { label: 'Max rebate liability (30%)', value: '€2.07M', color: 'text-amber-600' },
                    { label: 'Expected claims (est. 20%)', value: '€414K', color: 'text-amber-500' },
                    { label: 'Equity upside potential', value: '€6.8M+', color: 'text-emerald-600' },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between text-sm">
                      <span className="text-slate-500">{row.label}</span>
                      <span className={`font-semibold ${row.color}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Program status */}
            <Reveal>
              <div className="relative overflow-hidden rounded-2xl p-6 text-white shadow-[var(--shadow-soft-md)]">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 animate-gradient" />
                <div className="relative">
                  <p className="text-sm font-semibold mb-3">Program Status</p>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: 'Stage', value: 'Pilot — 2024/25' },
                      { label: 'Startups active', value: '5' },
                      { label: 'Regulation basis', value: '§17 EStG pilot' },
                      { label: 'Review date', value: 'Q4 2025' },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between text-sm">
                        <span className="text-indigo-200">{row.label}</span>
                        <span className="font-semibold text-white">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
