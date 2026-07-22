import { motion, useReducedMotion } from 'motion/react';
import {
  Landmark, Target, ShieldCheck, BadgeCheck, ArrowRight, TrendingUp,
  LineChart, Coins, Sparkles, Waypoints,
} from 'lucide-react';
import Reveal from '../components/Reveal';
import CountUp from '../components/CountUp';
import BridgeIllustration from '../components/BridgeIllustration';

const SECTORS = ['ClimateTech', 'HealthTech', 'DeepTech', 'AgriTech', 'Cybersecurity', 'FinTech', 'SpaceTech', 'BioTech'];

export default function Landing({ setPage }) {
  const reduce = useReducedMotion();

  const headline = ['De-risking the bridge', 'from public funding to', 'private capital.'];

  const stats = [
    { value: '10', label: 'Validated Startups' },
    { value: '30%', label: 'Tax Rebate Protection' },
    { value: '€1–8M', label: 'Stage 4 Valuations' },
  ];

  const bento = [
    {
      icon: ShieldCheck, title: 'Downside protection, by design',
      desc: 'If a startup fails after a ≥24-month hold, investors receive a 30% tax rebate under the §17 EStG pilot. Risk is structurally reduced, not just hoped away.',
      tile: 'bg-emerald-50 text-emerald-600', span: 'md:col-span-2 md:row-span-2', big: true,
    },
    { icon: Landmark, title: 'Government-validated', desc: 'Every startup cleared public stages 1–4 before listing. No cold sourcing.', tile: 'bg-blue-50 text-blue-600' },
    { icon: Target, title: 'Milestone control', desc: 'Release capital against conditions you set, tracked in real time.', tile: 'bg-indigo-50 text-indigo-600' },
    { icon: LineChart, title: 'Aligned upside', desc: 'The state keeps a passive equity stake — public and private incentives point the same way.', tile: 'bg-violet-50 text-violet-600' },
    { icon: Coins, title: 'Transparent economics', desc: 'Valuations, equity, and rebate math shown openly on every deal.', tile: 'bg-amber-50 text-amber-600' },
  ];

  const flowSteps = [
    { label: 'Government Support', sub: 'Stages 1–4', color: 'bg-blue-600', icon: Landmark },
    { label: 'FundBridge Validation', sub: 'Stage 4 checkpoint', color: 'bg-indigo-600', icon: BadgeCheck },
    { label: 'Private Investment', sub: 'Stages 4–6', color: 'bg-violet-600', icon: Target },
    { label: 'Growth / Exit', sub: 'Shared upside', color: 'bg-emerald-600', icon: TrendingUp },
  ];

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } };
  const item = reduce
    ? { hidden: {}, show: {} }
    : { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };

  return (
    <div className="bg-white">
      {/* ══ HERO (light, centered) ══ */}
      <section className="relative overflow-hidden bg-mesh">
        {/* soft floating orbs */}
        <div className="pointer-events-none absolute -top-24 left-1/4 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl animate-float" />
        <div className="pointer-events-none absolute top-0 right-1/4 w-96 h-96 rounded-full bg-indigo-300/15 blur-3xl animate-float-slow" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-8 text-center flex flex-col items-center">
          <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col items-center">
            {/* Eyebrow */}
            <motion.div variants={item}>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur border border-blue-200 px-4 py-1.5 text-sm text-blue-700 font-medium mb-8 shadow-sm">
                <BadgeCheck className="w-4 h-4" strokeWidth={2.2} />
                Government-validated startup bridge
              </div>
            </motion.div>

            {/* Wordmark lockup */}
            <motion.div variants={item} className="flex items-center gap-3 mb-7">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-[0_6px_20px_rgba(37,99,235,0.4)]">
                <Waypoints className="w-6 h-6 text-white" strokeWidth={2.4} />
              </div>
              <span className="text-3xl font-bold tracking-tight font-display text-slate-900">
                Fund<span className="text-blue-600">Bridge</span>
              </span>
            </motion.div>

            {/* Kinetic mask-reveal headline */}
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight font-display">
              {headline.map((line, li) => (
                <span key={li} className="block overflow-hidden pb-1.5">
                  <motion.span
                    className="block"
                    initial={reduce ? false : { y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.8, delay: 0.1 + li * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {li === 2
                      ? <span className="text-blue-600">private capital.</span>
                      : <span className="text-slate-900">{line}</span>}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p variants={item} className="mt-6 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              FundBridge moves government-backed startups from public support to private investment — with trust, transparency, milestone control, and real downside protection.
            </motion.p>

            <motion.div variants={item} className="mt-9 flex items-center justify-center gap-4 flex-wrap">
              <button
                onClick={() => setPage('marketplace')}
                className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-[var(--shadow-glow-blue)] transition-colors duration-200 flex items-center gap-2"
              >
                Explore Startups
                <ArrowRight className="w-5 h-5" strokeWidth={2.2} />
              </button>
              <button
                onClick={() => setPage('investor')}
                className="px-8 py-3.5 rounded-xl bg-white text-slate-700 font-semibold text-base border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors duration-200"
              >
                Investor Dashboard
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Bridge illustration */}
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative z-10 max-w-5xl mx-auto px-6 pb-20"
        >
          <BridgeIllustration />
        </motion.div>
      </section>

      {/* ══ TRUST MARQUEE ══ */}
      <section className="relative border-y border-slate-200 bg-slate-50/70 py-6 overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 max-w-7xl mx-auto px-6 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" strokeWidth={2.2} />
          Sectors validated through the FundBridge pilot
        </div>
        <div className="relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="flex shrink-0 gap-3 pr-3 animate-marquee">
            {[...SECTORS, ...SECTORS].map((s, i) => (
              <span key={i} className="whitespace-nowrap rounded-full bg-white border border-slate-200 px-4 py-1.5 text-sm text-slate-600 shadow-sm">{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY (BENTO) ══ */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <Reveal className="max-w-2xl mb-12">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Why FundBridge</p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight font-display">A safer bridge to private capital.</h2>
          <p className="text-slate-500 mt-4 text-lg leading-relaxed">Four structural guarantees that turn early-stage uncertainty into a governed, transparent asset class.</p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[minmax(150px,auto)] gap-4">
          {bento.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.08} className={`h-full ${card.span || ''}`}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className={`h-full rounded-3xl border border-slate-200 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-soft-lg)] transition-shadow duration-200 flex flex-col ${card.big ? 'bg-gradient-to-br from-emerald-50/60 to-white p-8' : 'bg-white p-6'}`}
              >
                <div className={`rounded-xl flex items-center justify-center ${card.tile} ${card.big ? 'w-14 h-14 mb-5' : 'w-11 h-11 mb-4'}`}>
                  <card.icon className={card.big ? 'w-7 h-7' : 'w-5 h-5'} strokeWidth={2} />
                </div>
                <h3 className={`font-semibold text-slate-900 ${card.big ? 'text-2xl mb-3' : 'text-base mb-1.5'}`}>{card.title}</h3>
                <p className={`text-slate-500 leading-relaxed ${card.big ? 'text-base' : 'text-sm'}`}>{card.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <Reveal>
          <div className="relative bg-mesh-soft bg-slate-50 rounded-[2rem] border border-slate-200 shadow-[var(--shadow-soft-md)] p-10 md:p-14 overflow-hidden">
            <div className="text-center mb-14 max-w-xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight font-display">How it works</h2>
              <p className="text-slate-500 mt-4 leading-relaxed">Public capital builds the foundation. FundBridge validates. Private capital funds the crossing to growth.</p>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-300 via-violet-300 to-emerald-300" />
              {flowSteps.map((step, i) => (
                <motion.div
                  key={step.label}
                  className="relative flex flex-col items-center text-center"
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className={`relative z-10 w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center text-white shadow-lg`}>
                    <step.icon className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-slate-800">{step.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{step.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ IMPACT STATS ══ */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1}>
              <div className="rounded-3xl border border-slate-200 bg-white shadow-[var(--shadow-soft)] p-8 text-center">
                <p className="text-5xl md:text-6xl font-bold text-blue-600 tracking-tight font-display">
                  <CountUp value={s.value} />
                </p>
                <p className="text-sm text-slate-500 mt-3">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ CTA (light gradient) ══ */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] px-8 py-16 md:py-20 text-center shadow-[var(--shadow-soft-lg)]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 animate-gradient" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight font-display">Ready to cross the bridge?</h2>
              <p className="text-blue-100 text-lg mb-9 max-w-lg mx-auto leading-relaxed">
                Browse government-backed startups seeking private investment for their stage 4–6 growth phase.
              </p>
              <button
                onClick={() => setPage('marketplace')}
                className="inline-flex items-center gap-2 px-10 py-4 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 shadow-lg transition-colors duration-200"
              >
                Explore Startups
                <ArrowRight className="w-5 h-5" strokeWidth={2.2} />
              </button>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
