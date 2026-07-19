import { motion, useReducedMotion } from 'motion/react';
import { Landmark, Target, ShieldCheck, BadgeCheck, ArrowRight, TrendingUp } from 'lucide-react';
import Reveal from '../components/Reveal';
import CountUp from '../components/CountUp';

export default function Landing({ setPage }) {
  const reduce = useReducedMotion();

  const valueCards = [
    {
      icon: Landmark,
      title: 'Trust',
      desc: 'Every startup on FundBridge was validated and supported by the German government through stages 1–4. No cold sourcing.',
      tile: 'bg-blue-50 text-blue-600',
    },
    {
      icon: Target,
      title: 'Control',
      desc: 'Investors set milestone-based funding conditions, review risk scores, and track startup progress in real time.',
      tile: 'bg-indigo-50 text-indigo-600',
    },
    {
      icon: ShieldCheck,
      title: 'Safety',
      desc: 'If a startup fails, investors receive a 30% tax rebate as downside protection. Risk is structurally reduced.',
      tile: 'bg-emerald-50 text-emerald-600',
    },
  ];

  const flowSteps = [
    { label: 'Government Support', sub: 'Stages 1–4', color: 'bg-blue-600' },
    { label: 'FundBridge Validation', sub: 'Stage 4 checkpoint', color: 'bg-indigo-600' },
    { label: 'Private Investment', sub: 'Stages 4–6', color: 'bg-violet-600' },
    { label: 'Growth / Exit', sub: 'Shared upside', color: 'bg-emerald-600' },
  ];

  const stats = [
    { value: '10', label: 'Validated Startups' },
    { value: '30%', label: 'Tax Rebate Protection' },
    { value: '€1–8M', label: 'Stage 4 Valuations' },
  ];

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
  };
  const item = reduce
    ? { hidden: {}, show: {} }
    : {
        hidden: { opacity: 0, y: 22 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-mesh">
        {/* Floating accent orbs */}
        <div className="pointer-events-none absolute -top-24 -left-16 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl animate-float" />
        <div className="pointer-events-none absolute top-10 right-0 w-96 h-96 rounded-full bg-indigo-300/20 blur-3xl animate-float-slow" />

        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center"
          >
            <motion.div variants={item}>
              <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-blue-200 rounded-full px-4 py-1.5 text-sm text-blue-700 font-medium mb-8 shadow-sm">
                <BadgeCheck className="w-4 h-4" strokeWidth={2.2} />
                Government-validated startup bridge
              </div>
            </motion.div>

            <motion.h1
              variants={item}
              className="text-5xl md:text-6xl font-bold text-slate-900 leading-[1.08] tracking-tight max-w-3xl mx-auto font-display"
            >
              De-risking the bridge from{' '}
              <span className="text-blue-600">public startup funding</span>{' '}
              to private capital.
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed"
            >
              FundBridge helps government-backed startups move from public support to private investment with trust, transparency, milestone control, and downside protection.
            </motion.p>

            <motion.div variants={item} className="mt-10 flex items-center justify-center gap-4 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                onClick={() => setPage('marketplace')}
                className="group px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-[var(--shadow-glow-blue)] transition-colors duration-150 flex items-center gap-2"
              >
                Explore Startups
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.2} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                onClick={() => setPage('investor')}
                className="px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base border border-slate-200 shadow-sm transition-colors duration-150"
              >
                Investor Dashboard
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Floating stat cards */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-16 grid grid-cols-3 gap-4 md:gap-6 max-w-2xl mx-auto"
          >
            {stats.map((s) => (
              <motion.div
                key={s.label}
                variants={item}
                whileHover={{ y: -5 }}
                className="bg-white/80 backdrop-blur rounded-2xl border border-slate-200 shadow-[var(--shadow-soft-md)] p-5"
              >
                <p className="text-3xl md:text-4xl font-bold text-blue-600 tracking-tight font-display">
                  <CountUp value={s.value} />
                </p>
                <p className="text-sm text-slate-500 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Value Cards */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <Reveal className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight font-display">Why FundBridge?</h2>
          <p className="text-slate-500 mt-3 text-lg">Three pillars that make the bridge possible.</p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {valueCards.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="h-full bg-white rounded-2xl border border-slate-200 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-soft-md)] p-8 transition-shadow duration-200"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${card.tile}`}>
                  <card.icon className="w-6 h-6" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{card.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <Reveal>
          <div className="relative bg-white rounded-3xl border border-slate-200 shadow-[var(--shadow-soft-md)] p-10 overflow-hidden bg-mesh-soft">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight font-display">How FundBridge Works</h2>
              <p className="text-slate-500 mt-3 max-w-xl mx-auto leading-relaxed">
                Government supports startups from stage 1–4. FundBridge validates them at stage 4. Private investors fund the stage 4–6 growth phase. If the startup succeeds, both investors and the government benefit. If it fails, investors receive downside protection.
              </p>
            </div>

            {/* Flow */}
            <div className="flex items-center justify-center gap-0 overflow-x-auto pb-2">
              {flowSteps.map((step, i) => (
                <motion.div
                  key={step.label}
                  className="flex items-center"
                  initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex flex-col items-center text-center min-w-[140px]">
                    <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                      {i + 1}
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-800">{step.label}</p>
                    <p className="text-xs text-slate-400">{step.sub}</p>
                  </div>
                  {i < flowSteps.length - 1 && (
                    <motion.div
                      className="flex items-center mx-2 text-slate-300 mb-6"
                      initial={reduce ? false : { opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 + 0.2 }}
                    >
                      <ArrowRight className="w-5 h-5" strokeWidth={2} />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Outcome row */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                <p className="text-sm font-semibold text-emerald-800 mb-1 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" strokeWidth={2.2} /> If startup succeeds
                </p>
                <p className="text-sm text-emerald-700">Investors receive growth returns. Government benefits through its passive equity stake. Taxpayer capital is repaid with upside.</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                <p className="text-sm font-semibold text-blue-800 mb-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" strokeWidth={2.2} /> If startup fails
                </p>
                <p className="text-sm text-blue-700">Investors receive a 30% tax rebate on their investment, structurally reducing downside risk. FundBridge absorbs the reputational cost.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl p-14 text-white shadow-[var(--shadow-soft-lg)]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 animate-gradient" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight font-display">Ready to explore validated startups?</h2>
              <p className="text-blue-100 text-lg mb-8 max-w-lg mx-auto">
                Browse government-backed startups seeking private investment for their stage 4–6 growth phase.
              </p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                onClick={() => setPage('marketplace')}
                className="group inline-flex items-center gap-2 px-10 py-3.5 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors duration-150 shadow-lg"
              >
                Explore Startups
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.2} />
              </motion.button>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
