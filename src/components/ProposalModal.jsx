import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Check, ArrowRight, Plus, Trash2, CheckCircle2, AlertCircle, Scale } from 'lucide-react';

const defaultMilestones = [
  { name: 'Product validation', condition: 'Complete pilot with 3 enterprise customers', amount: 200000, date: '2025-03-31' },
  { name: 'Revenue traction', condition: 'Reach €50,000 monthly recurring revenue', amount: 300000, date: '2025-09-30' },
  { name: 'Stage 6 readiness', condition: 'Complete growth audit and investor reporting package', amount: 500000, date: '2026-03-31' },
];

// Stacked allocation-bar segment colors (complete class strings — Tailwind-safe)
const barColors = ['bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-sky-500'];

function parseAmount(v) {
  const n = parseInt(String(v).replace(/[^\d]/g, ''), 10);
  return isNaN(n) ? 0 : n;
}
function fmtEuro(n) {
  return '€' + (n || 0).toLocaleString('en-US');
}

export default function ProposalModal({ startup, onClose, onSubmit }) {
  const [step, setStep] = useState('form'); // 'form' | 'summary' | 'success'
  const [investmentAmount, setInvestmentAmount] = useState('€1,000,000');
  const [fundingType, setFundingType] = useState('milestone');
  const [milestones, setMilestones] = useState(defaultMilestones);
  const [conditions, setConditions] = useState(
    'Monthly reporting, quarterly review meetings, and use-of-funds transparency required.'
  );

  // ── Milestone allocation engine ──
  const targetAmount = parseAmount(investmentAmount);
  const allocated = milestones.reduce((s, m) => s + (Number(m.amount) || 0), 0);
  const remaining = targetAmount - allocated;
  const fullyAllocated = targetAmount > 0 && remaining === 0;
  const canSubmit = targetAmount > 0 && (fundingType === 'full' || fullyAllocated);

  function updateMilestone(i, field, value) {
    setMilestones((prev) => prev.map((m, idx) => (idx === i ? { ...m, [field]: value } : m)));
  }
  function addMilestone() {
    setMilestones((prev) => [...prev, { name: `Milestone ${prev.length + 1}`, condition: '', amount: 0, date: '' }]);
  }
  function removeMilestone(i) {
    setMilestones((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));
  }
  function distributeEvenly() {
    if (targetAmount <= 0) return;
    const n = milestones.length;
    const base = Math.round(targetAmount / n / 1000) * 1000;
    setMilestones((prev) =>
      prev.map((m, idx) => ({ ...m, amount: idx === n - 1 ? targetAmount - base * (n - 1) : base }))
    );
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setStep('summary');
  }

  function handleFinalSubmit() {
    onSubmit({
      startup: startup.name,
      startupId: startup.id,
      amount: fmtEuro(targetAmount),
      fundingType,
      milestones: fundingType === 'milestone' ? milestones : null,
      conditions,
      taxRebate: startup.taxRebate,
      govEquity: startup.govEquity,
    });
    setStep('success');
  }

  // Allocation status chip content
  const statusChip = targetAmount <= 0
    ? { text: 'Enter an investment amount', cls: 'bg-slate-100 text-slate-500 border-slate-200', icon: AlertCircle }
    : fullyAllocated
      ? { text: 'Fully allocated', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 }
      : remaining > 0
        ? { text: `${fmtEuro(remaining)} unallocated`, cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertCircle }
        : { text: `${fmtEuro(-remaining)} over budget`, cls: 'bg-red-50 text-red-700 border-red-200', icon: AlertCircle };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 rounded-t-3xl px-8 py-5 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight font-display">Investment Proposal</h2>
            <p className="text-sm text-slate-500">{startup.name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
            <X className="w-4 h-4" strokeWidth={2.2} />
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
                        fundingType === opt.value ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
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

              {/* Milestone schedule */}
              {fundingType === 'milestone' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-slate-700">Milestone Schedule</label>
                    <button
                      type="button"
                      onClick={distributeEvenly}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Scale className="w-3.5 h-3.5" strokeWidth={2.2} />
                      Distribute evenly
                    </button>
                  </div>

                  {/* Allocation tracker */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs text-slate-500">
                        <span className="font-semibold text-slate-800">{fmtEuro(allocated)}</span> of {fmtEuro(targetAmount)} allocated
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${statusChip.cls}`}>
                        <statusChip.icon className="w-3 h-3" strokeWidth={2.4} />
                        {statusChip.text}
                      </span>
                    </div>
                    {/* Stacked allocation bar */}
                    <div className="h-3 rounded-full bg-slate-200 overflow-hidden flex">
                      {milestones.map((m, i) => {
                        const pct = targetAmount > 0 ? Math.min(((Number(m.amount) || 0) / targetAmount) * 100, 100) : 0;
                        return (
                          <motion.div
                            key={i}
                            className={`${barColors[i % barColors.length]} h-full border-r border-white/60 last:border-r-0`}
                            initial={false}
                            animate={{ width: `${pct}%` }}
                            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Milestone rows */}
                  <div className="flex flex-col gap-4">
                    {milestones.map((m, i) => (
                      <div key={i} className="bg-white rounded-2xl p-4 flex flex-col gap-3 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full ${barColors[i % barColors.length]} text-white flex items-center justify-center text-xs font-bold`}>
                              {i + 1}
                            </div>
                            <span className="text-sm font-semibold text-slate-700">Milestone {i + 1}</span>
                          </div>
                          {milestones.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMilestone(i)}
                              className="text-slate-300 hover:text-red-500 transition-colors p-1"
                              aria-label="Remove milestone"
                            >
                              <Trash2 className="w-4 h-4" strokeWidth={2} />
                            </button>
                          )}
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
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">€</span>
                              <input
                                inputMode="numeric"
                                value={m.amount === 0 ? '' : String(m.amount)}
                                onChange={(e) => updateMilestone(i, 'amount', parseAmount(e.target.value))}
                                placeholder="0"
                                className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white tabular-nums"
                              />
                            </div>
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

                  {/* Add milestone */}
                  <button
                    type="button"
                    onClick={addMilestone}
                    className="mt-4 w-full py-2.5 rounded-xl border border-dashed border-slate-300 text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/40 transition-colors text-sm font-medium flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" strokeWidth={2.2} />
                    Add milestone
                  </button>
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

              {/* Submit — gated on a balanced schedule */}
              <div>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    canSubmit
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Review Proposal Summary
                  <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
                </button>
                {!canSubmit && fundingType === 'milestone' && (
                  <p className="text-xs text-slate-400 text-center mt-2">
                    {targetAmount <= 0
                      ? 'Enter an investment amount to build the milestone schedule.'
                      : 'Milestone amounts must add up to the total investment before you can continue.'}
                  </p>
                )}
              </div>
            </form>
          )}

          {step === 'summary' && (
            <div className="flex flex-col gap-5">
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Proposal Summary</h3>
                <div className="flex flex-col gap-3">
                  {[
                    { label: 'Startup', value: startup.name },
                    { label: 'Investment Amount', value: fmtEuro(targetAmount) },
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
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-indigo-700">Milestone Schedule</p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3 h-3" strokeWidth={2.4} /> Balanced
                    </span>
                  </div>
                  {milestones.map((m, i) => (
                    <div key={i} className="flex justify-between text-xs text-indigo-700 py-1.5 border-b border-indigo-100 last:border-0">
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${barColors[i % barColors.length]}`} />
                        {m.name}
                      </span>
                      <span className="font-semibold tabular-nums">{fmtEuro(m.amount)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-xs font-bold text-indigo-900 pt-2.5 mt-1 border-t border-indigo-200">
                    <span>Total</span>
                    <span className="tabular-nums">{fmtEuro(allocated)}</span>
                  </div>
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
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.05 }}
                className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"
              >
                <Check className="w-8 h-8" strokeWidth={2.5} />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight font-display">Proposal Sent</h3>
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
      </motion.div>
    </motion.div>
  );
}
