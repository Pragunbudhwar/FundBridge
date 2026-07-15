import { useState } from 'react';

const defaultMilestones = [
  {
    name: 'Product validation',
    condition: 'Complete pilot with 3 enterprise customers',
    amount: '€200,000',
    date: '2025-03-31',
  },
  {
    name: 'Revenue traction',
    condition: 'Reach €50,000 monthly recurring revenue',
    amount: '€300,000',
    date: '2025-09-30',
  },
  {
    name: 'Stage 6 readiness',
    condition: 'Complete growth audit and investor reporting package',
    amount: '€500,000',
    date: '2026-03-31',
  },
];

export default function ProposalModal({ startup, onClose, onSubmit }) {
  const [step, setStep] = useState('form'); // 'form' | 'summary' | 'success'
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [fundingType, setFundingType] = useState('milestone');
  const [milestones, setMilestones] = useState(defaultMilestones);
  const [conditions, setConditions] = useState(
    'Monthly reporting, quarterly review meetings, and use-of-funds transparency required.'
  );

  function updateMilestone(i, field, value) {
    setMilestones((prev) => prev.map((m, idx) => (idx === i ? { ...m, [field]: value } : m)));
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    setStep('summary');
  }

  function handleFinalSubmit() {
    onSubmit({
      startup: startup.name,
      startupId: startup.id,
      amount: investmentAmount,
      fundingType,
      milestones: fundingType === 'milestone' ? milestones : null,
      conditions,
      taxRebate: startup.taxRebate,
      govEquity: startup.govEquity,
    });
    setStep('success');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 rounded-t-3xl px-8 py-5 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Investment Proposal</h2>
            <p className="text-sm text-slate-500">{startup.name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
            ✕
          </button>
        </div>

        <div className="px-8 py-6">
          {step === 'form' && (
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
              {/* Investment amount */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Investment Amount</label>
                <input
                  type="text"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder="e.g. €500,000"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400"
                />
              </div>

              {/* Funding structure */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Funding Structure</label>
                <div className="flex flex-col gap-3">
                  {[
                    { value: 'full', label: 'Invest full amount immediately' },
                    { value: 'milestone', label: 'Milestone-based funding' },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        fundingType === opt.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        value={opt.value}
                        checked={fundingType === opt.value}
                        onChange={() => setFundingType(opt.value)}
                        className="accent-blue-600"
                      />
                      <span className="text-sm font-medium text-slate-800">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Full amount explanation */}
              {fundingType === 'full' && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-700">
                    The full investment amount will be proposed as one upfront investment after agreement between the investor and startup.
                  </p>
                </div>
              )}

              {/* Milestone rows */}
              {fundingType === 'milestone' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Milestone Conditions</label>
                  <div className="flex flex-col gap-4">
                    {milestones.map((m, i) => (
                      <div key={i} className="bg-slate-50 rounded-2xl p-4 flex flex-col gap-3 border border-slate-200">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                            {i + 1}
                          </div>
                          <span className="text-sm font-semibold text-slate-700">Milestone {i + 1}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-slate-500 mb-1 block">Milestone name</label>
                            <input
                              value={m.name}
                              onChange={(e) => updateMilestone(i, 'name', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-slate-500 mb-1 block">Release amount</label>
                            <input
                              value={m.amount}
                              onChange={(e) => updateMilestone(i, 'amount', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Condition / requirement</label>
                          <input
                            value={m.condition}
                            onChange={(e) => updateMilestone(i, 'condition', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Target date</label>
                          <input
                            type="date"
                            value={m.date}
                            onChange={(e) => updateMilestone(i, 'date', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional conditions */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Investor Conditions</label>
                <textarea
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder-slate-400"
                  placeholder="Monthly reporting, quarterly review meetings, and use-of-funds transparency required."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-lg shadow-blue-200"
              >
                Review Proposal Summary →
              </button>
            </form>
          )}

          {step === 'summary' && (
            <div className="flex flex-col gap-5">
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Proposal Summary</h3>
                <div className="flex flex-col gap-3">
                  {[
                    { label: 'Startup', value: startup.name },
                    { label: 'Investment Amount', value: investmentAmount || '—' },
                    { label: 'Funding Type', value: fundingType === 'milestone' ? 'Milestone-based funding' : 'Full amount upfront' },
                    { label: 'Tax Rebate Eligibility', value: '✓ ' + startup.taxRebate },
                    { label: 'Government Equity Stake', value: startup.govEquity },
                    { label: 'Key Investor Conditions', value: conditions },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between gap-4 text-sm">
                      <span className="text-slate-500 flex-shrink-0">{row.label}</span>
                      <span className="text-slate-800 font-medium text-right">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {fundingType === 'milestone' && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
                  <p className="text-xs font-semibold text-indigo-700 mb-3">Milestone Schedule</p>
                  {milestones.map((m, i) => (
                    <div key={i} className="flex justify-between text-xs text-indigo-700 py-1 border-b border-indigo-100 last:border-0">
                      <span>{m.name}</span>
                      <span className="font-semibold">{m.amount}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('form')}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition-colors"
                >
                  ← Edit
                </button>
                <button
                  onClick={handleFinalSubmit}
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-lg shadow-blue-200"
                >
                  Send Proposal
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-6 flex flex-col items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-3xl">
                ✓
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Proposal Sent</h3>
                <p className="text-slate-500 text-sm mt-2 max-w-sm">
                  Proposal sent to {startup.name}. FundBridge will coordinate an introductory meeting between the investor and startup.
                </p>
              </div>

              <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Meeting Status</p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: 'Status', value: 'Meeting coordination pending', color: 'text-amber-600' },
                    { label: 'Participants', value: 'Investor, Startup, FundBridge' },
                    { label: 'Purpose', value: 'Review investment proposal and milestone conditions' },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between text-sm gap-4">
                      <span className="text-slate-500">{row.label}</span>
                      <span className={`font-medium text-right ${row.color || 'text-slate-800'}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
