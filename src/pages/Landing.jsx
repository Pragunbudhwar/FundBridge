export default function Landing({ setPage }) {
  const valueCards = [
    {
      icon: '🏛️',
      title: 'Trust',
      desc: 'Every startup on FundBridge was validated and supported by the German government through stages 1–4. No cold sourcing.',
      color: 'blue',
    },
    {
      icon: '🎯',
      title: 'Control',
      desc: 'Investors set milestone-based funding conditions, review risk scores, and track startup progress in real time.',
      color: 'indigo',
    },
    {
      icon: '🛡️',
      title: 'Safety',
      desc: 'If a startup fails, investors receive a 30% tax rebate as downside protection. Risk is structurally reduced.',
      color: 'emerald',
    },
  ];

  const flowSteps = [
    { label: 'Government Support', sub: 'Stages 1–4', color: 'bg-blue-600' },
    { label: 'FundBridge Validation', sub: 'Stage 4 checkpoint', color: 'bg-indigo-600' },
    { label: 'Private Investment', sub: 'Stages 4–6', color: 'bg-violet-600' },
    { label: 'Growth / Exit', sub: 'Shared upside', color: 'bg-emerald-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 text-sm text-blue-700 font-medium mb-8">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
          Government-validated startup bridge
        </div>

        <h1 className="text-5xl font-bold text-slate-900 leading-tight tracking-tight max-w-3xl mx-auto">
          De-risking the bridge from{' '}
          <span className="text-blue-600">public startup funding</span>{' '}
          to private capital.
        </h1>

        <p className="mt-6 text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          FundBridge helps government-backed startups move from public support to private investment with trust, transparency, milestone control, and downside protection.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage('marketplace')}
            className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-200 transition-all duration-150 hover:shadow-xl hover:shadow-blue-200"
          >
            Explore Startups
          </button>
          <button
            onClick={() => setPage('investor')}
            className="px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base border border-slate-200 transition-colors duration-150"
          >
            Investor Dashboard
          </button>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          {[
            { value: '10', label: 'Validated Startups' },
            { value: '30%', label: 'Tax Rebate Protection' },
            { value: '€1–8M', label: 'Stage 4 Valuations' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <p className="text-3xl font-bold text-blue-600">{s.value}</p>
              <p className="text-sm text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Value Cards */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Why FundBridge?</h2>
          <p className="text-slate-500 mt-2">Three pillars that make the bridge possible.</p>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {valueCards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 hover:shadow-md transition-shadow duration-200"
            >
              <div className="text-3xl mb-4">{card.icon}</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{card.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">How FundBridge Works</h2>
            <p className="text-slate-500 mt-2 max-w-xl mx-auto">
              Government supports startups from stage 1–4. FundBridge validates them at stage 4. Private investors fund the stage 4–6 growth phase. If the startup succeeds, both investors and the government benefit. If it fails, investors receive downside protection.
            </p>
          </div>

          {/* Flow */}
          <div className="flex items-center justify-center gap-0 overflow-x-auto">
            {flowSteps.map((step, i) => (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center text-center min-w-[140px]">
                  <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                    {i + 1}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-800">{step.label}</p>
                  <p className="text-xs text-slate-400">{step.sub}</p>
                </div>
                {i < flowSteps.length - 1 && (
                  <div className="flex items-center mx-2 text-slate-300 text-xl mb-4">→</div>
                )}
              </div>
            ))}
          </div>

          {/* Outcome row */}
          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
              <p className="text-sm font-semibold text-emerald-800 mb-1">✓ If startup succeeds</p>
              <p className="text-sm text-emerald-700">Investors receive growth returns. Government benefits through its passive equity stake. Taxpayer capital is repaid with upside.</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <p className="text-sm font-semibold text-blue-800 mb-1">🛡 If startup fails</p>
              <p className="text-sm text-blue-700">Investors receive a 30% tax rebate on their investment, structurally reducing downside risk. FundBridge absorbs the reputational cost.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-14 text-white shadow-xl shadow-blue-200">
          <h2 className="text-3xl font-bold mb-3">Ready to explore validated startups?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-lg mx-auto">
            Browse government-backed startups seeking private investment for their stage 4–6 growth phase.
          </p>
          <button
            onClick={() => setPage('marketplace')}
            className="px-10 py-3.5 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors duration-150 shadow"
          >
            Explore Startups
          </button>
        </div>
      </section>
    </div>
  );
}
