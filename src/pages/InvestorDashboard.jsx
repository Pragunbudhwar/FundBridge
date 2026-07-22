import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown, FileText, Check, Loader2, X, AlertTriangle, Download,
  ArrowRight, TrendingUp, ShieldCheck, ClipboardList, Circle, LineChart,
} from 'lucide-react';
import Reveal from '../components/Reveal';
import { portfolioStartups } from '../data/mockData';

// ─── Eligibility engine ───────────────────────────────────────────────────────

const REBATE_RATE = 0.30;
const HOLDING_REQUIRED_MONTHS = 24;

const GENERATION_STEPS = [
  'Verifying insolvency status with FundBridge registry...',
  'Pulling investor and startup details...',
  'Calculating rebate amount under §17 EStG...',
  'Pre-filling Form FB-TAX-01...',
  'Claim form ready.',
];

function getMonthsHeld(investedSince) {
  const start = new Date(investedSince);
  const now = new Date();
  return (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
}

function getEligibilityDate(investedSince) {
  const d = new Date(investedSince);
  d.setMonth(d.getMonth() + HOLDING_REQUIRED_MONTHS);
  return d;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmt(amount) {
  if (amount >= 1_000_000) return `€${(amount / 1_000_000).toFixed(1)}M`;
  return `€${Math.round(amount / 1000)}K`;
}

function fmtFull(amount) {
  return `€${amount.toLocaleString('en-DE')}`;
}

function computeRebate(s) {
  const monthsHeld = getMonthsHeld(s.investedSince);
  const eligible = monthsHeld >= HOLDING_REQUIRED_MONTHS;
  const eligibilityDate = getEligibilityDate(s.investedSince);
  return {
    monthsHeld,
    eligible,
    rebateAmount: Math.round(s.investedAmount * REBATE_RATE),
    eligibilityDate: eligibilityDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    monthsRemaining: Math.max(0, HOLDING_REQUIRED_MONTHS - monthsHeld),
  };
}

function getClaimRequirements(startup, rebate, isSubmitted) {
  return [
    {
      label: 'Holding period ≥ 24 months',
      met: rebate.eligible,
      note: rebate.eligible
        ? `${rebate.monthsHeld} months held — threshold met`
        : `${rebate.monthsRemaining} months remaining until ${rebate.eligibilityDate}`,
    },
    {
      label: 'Official insolvency filing in FundBridge registry',
      met: !!startup.isInsolvent,
      note: startup.isInsolvent
        ? `Filed ${formatDate(startup.insolvencyDate)} · Ref: ${startup.insolvencyRef}`
        : 'Required at the time of claim — startup must enter official insolvency',
    },
    {
      label: 'Completed Form FB-TAX-01 (FundBridge Claim Form)',
      met: isSubmitted,
      note: isSubmitted
        ? 'Submitted via FundBridge investor portal'
        : startup.isInsolvent && rebate.eligible
          ? 'Click "File Tax Rebate Claim" below to generate and submit'
          : 'Available once insolvency is filed and holding period is met',
    },
    {
      label: 'Bank statement proving original investment transfer',
      met: true,
      note: 'On file — matched to transaction reference',
    },
    {
      label: 'Tax advisor sign-off confirming §17 EStG applicability',
      met: !!startup.taxAdvisorSignoff,
      note: startup.taxAdvisorSignoff || 'Required from a certified German tax advisor (Steuerberater)',
    },
  ];
}

// ─── Shared UI helpers ────────────────────────────────────────────────────────

function Chevron({ open }) {
  return (
    <ChevronDown
      className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
      strokeWidth={2}
    />
  );
}

function SectionToggle({ label, open, onToggle, rightBadge, icon: Icon }) {
  return (
    <button onClick={onToggle}
      className={`w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50/70 transition-colors duration-150 ${open ? 'bg-slate-50/70' : ''}`}>
      <div className="flex items-center gap-3">
        {Icon && (
          <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4" strokeWidth={2} />
          </span>
        )}
        <span className="text-sm font-semibold text-slate-800">{label}</span>
        {rightBadge}
      </div>
      <Chevron open={open} />
    </button>
  );
}

function DetailRow({ label, value, mono = false }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">{label}</span>
      <span className={`text-sm text-slate-800 ${mono ? 'font-mono' : 'font-medium'}`}>{value}</span>
    </div>
  );
}

const milestoneStatusStyle = {
  Released:                'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'In Review':             'bg-amber-50 text-amber-700 border border-amber-200',
  Pending:                 'bg-slate-100 text-slate-500 border border-slate-200',
  Upcoming:                'bg-slate-50 text-slate-400 border border-slate-100',
  'Cancelled — Insolvency':'bg-red-50 text-red-400 border border-red-100',
};

const rebateStatusStyle = {
  'Eligible':              'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Locked':                'bg-amber-50 text-amber-700 border border-amber-200',
  'Requirements Pending':  'bg-orange-50 text-orange-700 border border-orange-200',
  'Claim in review':       'bg-blue-50 text-blue-700 border border-blue-200',
  'Paid':                  'bg-indigo-50 text-indigo-700 border border-indigo-200',
};

function rebateStatusExplanation(startup, rebate, isSubmitted) {
  if (isSubmitted) return `Your claim has been successfully submitted to FundBridge. Reference: CL-2026-${startup.startupDetails.fundBridgeId.slice(-3).toUpperCase()}-7291. Our tax team will review and contact you within 6–8 weeks.`;
  const map = {
    'Eligible': `All conditions met. ${startup.name} entered official insolvency on ${formatDate(startup.insolvencyDate)}. You may now file your §17 EStG rebate claim through FundBridge.`,
    'Locked': `This position was opened on ${formatDate(startup.investedSince)}. The 24-month holding requirement will be met on ${rebate.eligibilityDate}. No rebate is available before this date.`,
    'Requirements Pending': `The 24-month holding period has been met (${rebate.monthsHeld} months). However, ${startup.name} has not entered official insolvency. The §17 EStG rebate only becomes claimable upon a verified insolvency filing in the FundBridge registry.`,
    'Claim in review': `Your rebate claim is under review by the FundBridge tax office. Estimated processing time: 6–8 weeks.`,
    'Paid': `Rebate of ${fmt(rebate.rebateAmount)} has been paid to your registered bank account.`,
  };
  return map[startup.taxRebateStatus] ?? '';
}

// ─── Modals ───────────────────────────────────────────────────────────────────

function GeneratingModal({ startup, currentStep }) {
  return (
    <motion.div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-blue-600" strokeWidth={2} />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Generating Claim Form</p>
            <p className="text-xs text-slate-500 font-mono">{startup.name} · Form FB-TAX-01</p>
          </div>
        </div>
        <div className="flex flex-col gap-3.5">
          {GENERATION_STEPS.map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              {i < currentStep ? (
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </span>
              ) : i === currentStep ? (
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin flex-shrink-0" strokeWidth={2.4} />
              ) : (
                <span className="w-5 h-5 rounded-full border-2 border-slate-200 flex-shrink-0" />
              )}
              <span className={`text-sm ${i <= currentStep ? 'text-slate-700' : 'text-slate-300'} ${i === currentStep ? 'font-medium' : ''}`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ClaimFormModal({ startup, rebate, onSubmit, onClose }) {
  const [declared, setDeclared] = useState(false);
  const claimRef = `CL-2026-${startup.startupDetails.fundBridgeId.slice(-3).toUpperCase()}-7291`;
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <motion.div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 flex-shrink-0">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">FundBridge · Tax Relief Office</p>
            <h2 className="text-lg font-bold text-slate-900">Form FB-TAX-01 — Tax Rebate Claim</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-5">

          {/* Claim reference */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
            <DetailRow label="Generated Claim Reference" value={claimRef} mono />
            <DetailRow label="Submission Date" value={today} />
            <DetailRow label="Processing Office" value="FundBridge Tax Relief Office, Berlin" />
            <DetailRow label="Applicable Regulation" value="§17 EStG — Pilot Regulation 2022" />
          </div>

          {/* Section 1: Claimant */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Section 1 — Claimant (Investor)</p>
            <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-100 rounded-xl p-4">
              <DetailRow label="Full Name" value={startup.investor.name} />
              <DetailRow label="Investor ID" value={startup.investor.investorId} mono />
              <DetailRow label="Tax Identification Number" value={startup.investor.taxId} mono />
              <DetailRow label="Bank Account (IBAN)" value={startup.investor.bankAccount} mono />
            </div>
          </div>

          {/* Section 2: Investment */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Section 2 — Investment Details</p>
            <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-100 rounded-xl p-4">
              <DetailRow label="Startup Name" value={startup.name} />
              <DetailRow label="FundBridge ID" value={startup.startupDetails.fundBridgeId} mono />
              <DetailRow label="Investment Date" value={formatDate(startup.investedSince)} />
              <DetailRow label="Total Amount Invested" value={fmtFull(startup.investedAmount)} />
              <DetailRow label="Funding Type" value={startup.fundingType} />
              <DetailRow label="Months Held at Insolvency" value={`${rebate.monthsHeld} months`} />
            </div>
          </div>

          {/* Section 3: Insolvency */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Section 3 — Insolvency Verification</p>
            <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-100 rounded-xl p-4">
              <DetailRow label="Official Insolvency Date" value={formatDate(startup.insolvencyDate)} />
              <DetailRow label="FundBridge Insolvency Reference" value={startup.insolvencyRef} mono />
              <DetailRow label="Registered Startup Stage" value={startup.startupDetails.stage} />
              <DetailRow label="Registration Number" value={startup.startupDetails.registrationNumber} mono />
            </div>
          </div>

          {/* Section 4: Rebate calculation */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Section 4 — Rebate Calculation</p>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col gap-2">
              {[
                { label: 'Total Amount Invested', value: fmtFull(startup.investedAmount), bold: false },
                { label: 'Applicable Rebate Rate (§17 EStG)', value: `${(REBATE_RATE * 100).toFixed(0)}%`, bold: false },
              ].map(r => (
                <div key={r.label} className="flex justify-between text-sm">
                  <span className="text-slate-500">{r.label}</span>
                  <span className="font-semibold text-slate-700">{r.value}</span>
                </div>
              ))}
              <div className="border-t border-slate-200 my-1" />
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Gross Tax Rebate</span>
                <span className="font-bold text-emerald-600">{fmtFull(rebate.rebateAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Application Method</span>
                <span className="font-medium text-slate-600">Direct offset against income tax liability</span>
              </div>
              <div className="border-t border-slate-200 my-1" />
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-slate-700">Net Maximum Loss (after rebate)</span>
                <span className="text-slate-900">{fmtFull(startup.investedAmount - rebate.rebateAmount)}</span>
              </div>
            </div>
          </div>

          {/* Section 5: Tax advisor */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Section 5 — Tax Advisor Sign-off</p>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <DetailRow label="Certified Tax Advisor (Steuerberater)" value={startup.taxAdvisorSignoff} />
            </div>
          </div>

          {/* Declaration */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={declared}
                onChange={e => setDeclared(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer flex-shrink-0"
              />
              <p className="text-sm text-blue-800 leading-relaxed">
                I, <strong>{startup.investor.name}</strong>, confirm that the information provided in this claim is accurate and complete to the best of my knowledge, and that I am the beneficial owner of the investment described above. I understand that providing false information may result in legal consequences under German tax law.
              </p>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => declared && onSubmit(claimRef)}
            disabled={!declared}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center gap-2 ${declared
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            Submit Claim to FundBridge
            <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SuccessModal({ claimRef, startup, rebate, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
        initial={{ opacity: 0, scale: 0.9, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      >
        <motion.div
          className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.1 }}
        >
          <Check className="w-7 h-7" strokeWidth={2.5} />
        </motion.div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Claim Successfully Filed</h2>
        <p className="text-sm text-slate-500 leading-relaxed mb-5">
          Your §17 EStG tax rebate claim for <strong>{startup.name}</strong> has been submitted to FundBridge and is now under review. Our tax team will contact you at the registered investor address within <strong>6–8 weeks</strong>.
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 text-left flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Claim Reference</span>
            <span className="font-mono font-semibold text-slate-800">{claimRef}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Rebate Amount</span>
            <span className="font-bold text-emerald-600">{fmt(rebate.rebateAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Status</span>
            <span className="font-semibold text-blue-600">Claim in review</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors duration-150">
          Back to Dashboard
        </button>
      </motion.div>
    </motion.div>
  );
}

function ReviewTimeline({ submittedAt }) {
  const steps = [
    { label: 'Submitted', date: submittedAt, state: 'done' },
    { label: 'Under Review', date: null, state: 'active' },
    { label: 'Approved', date: null, state: 'pending' },
    { label: 'Paid', date: null, state: 'pending' },
  ];
  return (
    <div className="relative flex items-start justify-between pt-1">
      <div className="absolute top-3 left-4 right-4 h-0.5 bg-slate-200 z-0" />
      {steps.map((step, i) => (
        <motion.div
          key={step.label}
          className="flex flex-col items-center gap-1.5 z-10 flex-1"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.12 }}
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2
            ${step.state === 'done' ? 'bg-emerald-500 border-emerald-500 text-white'
            : step.state === 'active' ? 'bg-blue-500 border-blue-500 text-white'
            : 'bg-white border-slate-200 text-slate-400'}`}>
            {step.state === 'done' ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : step.state === 'active' ? (
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            ) : ''}
          </div>
          <p className={`text-xs font-medium text-center ${step.state === 'pending' ? 'text-slate-400' : 'text-slate-700'}`}>
            {step.label}
          </p>
          {step.date && <p className="text-[10px] text-slate-400 text-center">{step.date}</p>}
          {step.state === 'active' && <p className="text-[10px] text-blue-500 text-center font-medium">In progress</p>}
        </motion.div>
      ))}
    </div>
  );
}

// ─── Investment Registration ──────────────────────────────────────────────────

function InvestmentRegistration({ startup }) {
  return (
    <div className="flex flex-col gap-6 pt-2">
      {startup.isInsolvent && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-3.5">
          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" strokeWidth={2.2} />
          <p className="text-sm text-red-700 leading-relaxed">
            <strong>{startup.name}</strong> entered official insolvency on <strong>{formatDate(startup.insolvencyDate)}</strong>.
            FundBridge Reference: <span className="font-mono">{startup.insolvencyRef}</span>.
            No further milestone payments will be released.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Investor Details</p>
          <div className="grid grid-cols-1 gap-3">
            <DetailRow label="Full Name" value={startup.investor.name} />
            <DetailRow label="Investor ID" value={startup.investor.investorId} mono />
            <DetailRow label="Tax ID" value={startup.investor.taxId} mono />
            <DetailRow label="Bank Account (IBAN)" value={startup.investor.bankAccount} mono />
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Startup Details</p>
          <div className="grid grid-cols-1 gap-3">
            <DetailRow label="Company Name" value={startup.name} />
            <DetailRow label="Registration Number" value={startup.startupDetails.registrationNumber} mono />
            <DetailRow label="FundBridge ID" value={startup.startupDetails.fundBridgeId} mono />
            <DetailRow label="Startup Stage" value={startup.startupDetails.stage} />
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Payment History</p>
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Milestone', 'Amount', 'Currency', 'Payment Date', 'Transaction Ref.', 'Proof of Payment'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {startup.payments.map((p, i) => (
                <tr key={p.reference} className={i < startup.payments.length - 1 ? 'border-b border-slate-100' : ''}>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">{p.milestone}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{fmt(p.amount)}</td>
                  <td className="px-4 py-3 text-slate-500">{p.currency}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(p.date)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.reference}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium">
                      <Download className="w-3 h-3" strokeWidth={2} />
                      {p.proof}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Milestone Tracker</p>
        <div className="flex flex-col gap-3">
          {startup.milestones.map((m) => (
            <div key={m.id} className="flex gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-sm font-bold text-slate-600 shadow-sm">
                {m.id}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <p className="text-sm font-semibold text-slate-900">{m.name}</p>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${milestoneStatusStyle[m.status] || milestoneStatusStyle.Upcoming}`}>
                    {m.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-2">{m.conditions}</p>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  {m.approvalDate
                    ? <span>Approved: <span className="text-slate-600 font-medium">{formatDate(m.approvalDate)}</span></span>
                    : <span className="text-slate-300">Not yet approved</span>
                  }
                  {m.releasedAmount && (
                    <span>Released: <span className="text-emerald-600 font-semibold">{fmt(m.releasedAmount)}</span></span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tax Rebate Section ───────────────────────────────────────────────────────

function TaxRebateSection({ startup, rebate, isSubmitted, claimInfo, onStartClaim }) {
  const displayStatus = isSubmitted ? 'Claim in review' : startup.taxRebateStatus;
  const statusStyle = rebateStatusStyle[displayStatus] || rebateStatusStyle['Locked'];
  const explanation = rebateStatusExplanation(startup, rebate, isSubmitted);
  const requirements = getClaimRequirements(startup, rebate, isSubmitted);
  const canFileClaim = startup.taxRebateStatus === 'Eligible' && !isSubmitted;

  return (
    <div className="flex flex-col gap-5 pt-2">

      {/* 1. Current status */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Current Rebate Status</p>
        <div className="flex items-start gap-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${statusStyle}`}>
            {displayStatus}
          </span>
          <p className="text-sm text-slate-600 leading-relaxed">{explanation}</p>
        </div>
      </div>

      {/* Review timeline (post-submission) */}
      {isSubmitted && claimInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-[11px] font-bold text-blue-500 uppercase tracking-wider">Claim Review Progress</p>
            <span className="font-mono text-xs text-blue-600 font-semibold">{claimInfo.reference}</span>
          </div>
          <ReviewTimeline submittedAt={claimInfo.submittedAt} />
        </div>
      )}

      {/* 2. Holding-period timeline */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">Holding-Period Timeline</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 mb-4">
          <DetailRow label="Investment Date" value={formatDate(startup.investedSince)} />
          <DetailRow label="Amount Invested" value={fmt(startup.investedAmount)} />
          <DetailRow label="Months Held" value={`${rebate.monthsHeld} months`} />
          <DetailRow label="Eligibility Date" value={rebate.eligibilityDate} />
          <DetailRow label="Months Remaining" value={rebate.eligible ? '— Threshold met' : `${rebate.monthsRemaining} months`} />
          <DetailRow label="Required Threshold" value="24 months (§17 EStG)" />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${rebate.eligible ? 'bg-emerald-500' : 'bg-amber-400'}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((rebate.monthsHeld / HOLDING_REQUIRED_MONTHS) * 100, 100)}%` }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <span className="text-xs font-semibold text-slate-500 tabular-nums flex-shrink-0">{rebate.monthsHeld}/{HOLDING_REQUIRED_MONTHS} mo.</span>
          {rebate.eligible && (
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 flex-shrink-0">
              <Check className="w-3.5 h-3.5" strokeWidth={3} /> Met
            </span>
          )}
        </div>
      </div>

      {/* 3. Full rebate calculation */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">Full Rebate Calculation</p>
        <div className="flex flex-col gap-2">
          {[
            { label: 'Total Amount Invested', value: fmt(startup.investedAmount) },
            { label: 'Tax Rebate Rate (§17 EStG)', value: `${(REBATE_RATE * 100).toFixed(0)}%` },
          ].map(r => (
            <div key={r.label} className="flex justify-between text-sm">
              <span className="text-slate-500">{r.label}</span>
              <span className="font-semibold text-slate-700">{r.value}</span>
            </div>
          ))}
          <div className="border-t border-slate-200 my-1" />
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Gross Tax Rebate</span>
            <span className={`font-bold ${rebate.eligible ? 'text-emerald-600' : 'text-slate-400'}`}>{fmt(rebate.rebateAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Applied Against Tax Liability</span>
            <span className="font-medium text-slate-500">Direct offset</span>
          </div>
          <div className="border-t border-slate-200 my-1" />
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-slate-700">Net Maximum Loss (after rebate)</span>
            <span className="text-slate-900">{fmt(startup.investedAmount - rebate.rebateAmount)}</span>
          </div>
        </div>
      </div>

      {/* 4. Claim requirements */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">Claim Requirements</p>
        <div className="flex flex-col gap-3">
          {requirements.map((req) => (
            <div key={req.label} className="flex items-start gap-3">
              <span className="mt-0.5 flex-shrink-0">
                {req.met
                  ? <Check className="w-4 h-4 text-emerald-500" strokeWidth={3} />
                  : <Circle className="w-4 h-4 text-slate-300" strokeWidth={2} />}
              </span>
              <div>
                <p className={`text-sm font-medium ${req.met ? 'text-slate-800' : 'text-slate-500'}`}>{req.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{req.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* File claim button */}
      {canFileClaim && (
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          onClick={onStartClaim}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors duration-150 shadow-[var(--shadow-glow-blue)] flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" strokeWidth={2.2} />
          File Tax Rebate Claim
        </motion.button>
      )}
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export default function InvestorDashboard({ proposal }) {
  const rebates = portfolioStartups.map(computeRebate);
  const [openSections, setOpenSections] = useState({});
  const [claimFlow, setClaimFlow] = useState(null);
  // claimFlow: null | { startupId, state: 'generating'|'form', step: number }
  const [submittedClaims, setSubmittedClaims] = useState({});
  // submittedClaims: { [startupId]: { reference, submittedAt } }
  const [showSuccess, setShowSuccess] = useState(null);
  // showSuccess: null | { startupId, claimRef }

  // Advance generation steps
  useEffect(() => {
    if (!claimFlow || claimFlow.state !== 'generating') return;
    if (claimFlow.step >= GENERATION_STEPS.length - 1) {
      const t = setTimeout(() => setClaimFlow(cf => ({ ...cf, state: 'form' })), 800);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setClaimFlow(cf => ({ ...cf, step: cf.step + 1 })), 750);
    return () => clearTimeout(t);
  }, [claimFlow?.state, claimFlow?.step]);

  function toggle(key) {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function startClaim(startupId) {
    setClaimFlow({ startupId, state: 'generating', step: 0 });
  }

  function handleSubmitClaim(claimRef) {
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    setSubmittedClaims(prev => ({ ...prev, [claimFlow.startupId]: { reference: claimRef, submittedAt: today } }));
    setShowSuccess({ startupId: claimFlow.startupId, claimRef });
    setClaimFlow(null);
  }

  function closeSuccess() {
    setShowSuccess(null);
  }

  const eligibleTotal = rebates.filter(r => r.eligible).reduce((sum, r) => sum + r.rebateAmount, 0);
  const lockedTotal   = rebates.filter(r => !r.eligible).reduce((sum, r) => sum + r.rebateAmount, 0);
  const totalInvested = portfolioStartups.reduce((sum, s) => sum + s.investedAmount, 0);

  // Account holder (same investor across all positions)
  const investor = portfolioStartups[0].investor;
  const investorInitials = investor.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  // Find startup objects for modals
  const claimStartup = claimFlow ? portfolioStartups.find(s => s.id === claimFlow.startupId) : null;
  const claimRebate  = claimFlow ? rebates[portfolioStartups.findIndex(s => s.id === claimFlow.startupId)] : null;
  const successStartup = showSuccess ? portfolioStartups.find(s => s.id === showSuccess.startupId) : null;
  const successRebate  = showSuccess ? rebates[portfolioStartups.findIndex(s => s.id === showSuccess.startupId)] : null;

  return (
    <div className="min-h-screen bg-mesh-soft bg-slate-50">

      {/* ── Modals ── */}
      <AnimatePresence>
        {claimFlow?.state === 'generating' && claimStartup && (
          <GeneratingModal startup={claimStartup} currentStep={claimFlow.step} />
        )}
        {claimFlow?.state === 'form' && claimStartup && claimRebate && (
          <ClaimFormModal
            startup={claimStartup}
            rebate={claimRebate}
            onSubmit={handleSubmitClaim}
            onClose={() => setClaimFlow(null)}
          />
        )}
        {showSuccess && successStartup && successRebate && (
          <SuccessModal
            claimRef={showSuccess.claimRef}
            startup={successStartup}
            rebate={successRebate}
            onClose={closeSuccess}
          />
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">

        {/* Personalized account header */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-lg font-bold font-display shadow-[0_6px_20px_rgba(37,99,235,0.35)] flex-shrink-0">
                {investorInitials}
              </div>
              <div>
                <p className="text-sm text-slate-400">Welcome back,</p>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight font-display leading-tight">{investor.name}</h1>
                <p className="text-xs text-slate-400 mt-1 font-mono">{investor.investorId} · Member since 2022</p>
              </div>
            </div>
            <div className="flex items-stretch rounded-2xl border border-slate-200 bg-white shadow-[var(--shadow-soft)] divide-x divide-slate-100 self-start">
              {[
                { label: 'Total Invested', value: fmt(totalInvested) },
                { label: 'Positions', value: String(portfolioStartups.length) },
                { label: 'Rebate Eligible', value: fmt(eligibleTotal) },
              ].map((stat) => (
                <div key={stat.label} className="px-5 py-3 text-center">
                  <p className="text-lg font-bold text-slate-900 font-display">{stat.value}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 whitespace-nowrap">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Proposal activity (slim) */}
        <Reveal className="mb-10">
          {proposal ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-[var(--shadow-soft)] p-5 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4" strokeWidth={2.4} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Proposal sent to {proposal.startup}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{proposal.amount} · {proposal.fundingType === 'milestone' ? 'Milestone-based' : 'Full amount'} · meeting coordination in progress</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Pending meeting</span>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-[var(--shadow-soft)] px-5 py-4 flex items-center gap-3 text-sm text-slate-400">
              <ClipboardList className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
              No active proposals — open a startup to create your first investment proposal.
            </div>
          )}
        </Reveal>

        {/* Portfolio */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Your Portfolio</h2>
          <span className="text-sm text-slate-400">{portfolioStartups.length} positions</span>
        </div>
        <div className="flex flex-col gap-5">
                {portfolioStartups.map((s, i) => {
                  const r = rebates[i];
                  const regKey = `${s.id}-reg`;
                  const taxKey = `${s.id}-tax`;
                  const isSubmitted = !!submittedClaims[s.id];
                  const claimInfo = submittedClaims[s.id] || null;

                  const companyInitials = s.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                  const rebateChip = isSubmitted ? 'Claim in review' : s.taxRebateStatus;
                  return (
                    <motion.div
                      key={s.id}
                      whileHover={{ y: -2 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                      className={`bg-white rounded-2xl border shadow-[var(--shadow-soft)] overflow-hidden ${s.isInsolvent ? 'border-red-200' : 'border-slate-200'}`}
                    >
                      {/* Company header */}
                      <div className="p-5">
                        <div className="flex items-start gap-3.5">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${s.isInsolvent ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-700'}`}>
                            {companyInitials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-slate-900">{s.name}</h3>
                              {s.isInsolvent && (
                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">Insolvent</span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">{s.fundingType} · {s.startupDetails.fundBridgeId}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-lg font-bold text-slate-900 leading-none">{s.invested}</p>
                            <span className={`inline-block mt-2 text-[11px] font-semibold px-2 py-0.5 rounded-full ${rebateStatusStyle[rebateChip] || rebateStatusStyle['Locked']}`}>
                              {rebateChip}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-medium text-slate-500">Milestone progress</span>
                            <span className="text-xs font-semibold text-slate-700">{s.milestoneProgress}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${s.isInsolvent ? 'bg-amber-400' : 'bg-indigo-500'}`}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${s.milestoneProgress}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Collapsible components */}
                      <div className="border-t border-slate-100 divide-y divide-slate-100">
                        <div>
                          <SectionToggle
                            label="Investment Details"
                            icon={FileText}
                            open={openSections[regKey]}
                            onToggle={() => toggle(regKey)}
                            rightBadge={
                              <span className="text-[11px] font-medium text-slate-400">
                                {s.payments.length} payment{s.payments.length !== 1 ? 's' : ''} · {s.milestones.filter(m => m.status === 'Released').length}/5 milestones
                              </span>
                            }
                          />
                          <AnimatePresence initial={false}>
                            {openSections[regKey] && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="overflow-hidden"
                              >
                                <div className="px-5 pb-5">
                                  <InvestmentRegistration startup={s} />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div>
                          <SectionToggle
                            label="Tax Rebate"
                            icon={ShieldCheck}
                            open={openSections[taxKey]}
                            onToggle={() => toggle(taxKey)}
                            rightBadge={
                              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${rebateStatusStyle[rebateChip] || rebateStatusStyle['Locked']}`}>
                                {rebateChip}
                              </span>
                            }
                          />
                          <AnimatePresence initial={false}>
                            {openSections[taxKey] && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="overflow-hidden"
                              >
                                <div className="px-5 pb-5">
                                  <TaxRebateSection
                                    startup={s}
                                    rebate={r}
                                    isSubmitted={isSubmitted}
                                    claimInfo={claimInfo}
                                    onStartClaim={() => startClaim(s.id)}
                                  />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
        </div>

        {/* Portfolio insights (collapsed) */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-[var(--shadow-soft)] overflow-hidden">
          <SectionToggle
            label="Portfolio insights"
            icon={LineChart}
            open={openSections['insights']}
            onToggle={() => toggle('insights')}
            rightBadge={<span className="text-[11px] text-slate-400">Scenarios &amp; rebate rollup</span>}
          />
          <AnimatePresence initial={false}>
            {openSections['insights'] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="border-t border-slate-100 p-6 flex flex-col gap-8">
                  {/* Success / Failure simulation */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-4">Success / Failure Simulation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                        <p className="text-sm font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" strokeWidth={2.2} /> If startup succeeds
                        </p>
                        <p className="text-sm text-emerald-700 leading-relaxed">Investor receives upside from growth or exit. Government benefits through its passive equity stake.</p>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                        <p className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4" strokeWidth={2.2} /> If startup fails
                        </p>
                        <p className="text-sm text-blue-700 leading-relaxed">Investors who held for ≥24 months and meet all §17 EStG conditions receive a 30% tax rebate. File via FundBridge.</p>
                      </div>
                    </div>
                    <div className="mt-4 bg-slate-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Example: €350K · Solaris Dynamics (eligible)</p>
                      <div className="flex flex-col gap-2">
                        {[
                          { scenario: 'Success (3× exit)', result: '+€700,000', color: 'text-emerald-600' },
                          { scenario: 'Breakeven', result: '€0', color: 'text-slate-600' },
                          { scenario: 'Failure — rebate applies (≥24 mo. + insolvency)', result: '-€245,000 net', color: 'text-amber-600' },
                          { scenario: 'Failure — no rebate (<24 mo.)', result: '-€350,000', color: 'text-red-600' },
                        ].map((row) => (
                          <div key={row.scenario} className="flex justify-between text-sm">
                            <span className="text-slate-600">{row.scenario}</span>
                            <span className={`font-semibold ${row.color}`}>{row.result}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Rebate rollup */}
                  <div className="border-t border-slate-100 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-slate-900">Rebate Rollup</h3>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-1 rounded-full">§17 EStG</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                      {portfolioStartups.map((s, i) => {
                        const r = rebates[i];
                        const subm = !!submittedClaims[s.id];
                        const displayStatus = subm ? 'Claim in review' : s.taxRebateStatus;
                        return (
                          <div key={s.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                            <p className="text-sm font-medium text-slate-800 mb-1.5">{s.name}</p>
                            <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${rebateStatusStyle[displayStatus] || rebateStatusStyle['Locked']}`}>
                              {displayStatus}
                            </span>
                            <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                              <span>{s.invested} · {r.monthsHeld} mo</span>
                              <span className={r.eligible ? 'font-bold text-emerald-600' : 'text-slate-400'}>
                                {r.eligible ? fmt(r.rebateAmount) : `${fmt(r.rebateAmount)} locked`}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex flex-col gap-2 max-w-sm">
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
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
