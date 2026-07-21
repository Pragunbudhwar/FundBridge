import { motion, useReducedMotion } from 'motion/react';
import { Landmark, TrendingUp } from 'lucide-react';

/**
 * The signature hero visual: FundBridge's brand metaphor made literal.
 * A suspension-bridge SVG where glowing "capital" pulses flow left→right,
 * from public funding, across the FundBridge span, to private capital.
 *
 * Bridge geometry lives in a 900×420 viewBox; HTML labels are overlaid with
 * percentage positioning so the typography stays crisp. Pulses use SVG
 * <animateMotion> along the deck path (reliable in evergreen browsers) and
 * are omitted entirely under prefers-reduced-motion.
 */

const DECK = 'M 150 250 C 330 150, 570 150, 750 250';
const CABLE = 'M 150 250 C 330 70, 570 70, 750 250';
// Hanger x-positions along the span (vertical lines cable→deck)
const HANGERS = [255, 330, 405, 450, 495, 570, 645];

// Sample y on the two symmetric cubic arcs (control pts share x-shape) so hangers
// connect cable→deck. Both are cubic Beziers with P0=(150,250), P3=(750,250);
// deck controls y=150, cable controls y=70. We approximate y(x) by the Bezier in t.
function bezierY(x, cY) {
  const t = (x - 150) / 600; // x is monotic enough across the span for a visual hanger
  const mt = 1 - t;
  return mt * mt * mt * 250 + 3 * mt * mt * t * cY + 3 * mt * t * t * cY + t * t * t * 250;
}

export default function BridgeFlow() {
  const reduce = useReducedMotion();

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <svg viewBox="0 0 900 420" className="w-full h-auto" role="img" aria-label="Capital flowing across the FundBridge span">
        <defs>
          <linearGradient id="deckGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          <radialGradient id="pulseGrad">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="60%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nodeGlow">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
          <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient node glows */}
        <circle cx="150" cy="250" r="120" fill="url(#nodeGlow)" />
        <circle cx="750" cy="250" r="120" fill="url(#nodeGlow)" />

        {/* Towers */}
        {[255, 645].map((x) => (
          <line key={x} x1={x} y1={bezierY(x, 70) - 6} x2={x} y2={bezierY(x, 150) + 4}
            stroke="#334155" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
        ))}

        {/* Main cable */}
        <path d={CABLE} fill="none" stroke="#475569" strokeWidth="2.5" opacity="0.6" />

        {/* Hangers */}
        {HANGERS.map((x) => (
          <line key={x} x1={x} y1={bezierY(x, 70)} x2={x} y2={bezierY(x, 150)}
            stroke="#475569" strokeWidth="1.25" opacity="0.4" />
        ))}

        {/* Deck — glow underlay + crisp gradient stroke */}
        <path d={DECK} fill="none" stroke="#1d4ed8" strokeWidth="10" opacity="0.25" filter="url(#glow)" />
        <path id="deck" d={DECK} fill="none" stroke="url(#deckGrad)" strokeWidth="4" strokeLinecap="round" />

        {/* End anchor pads */}
        {[150, 750].map((x) => (
          <circle key={x} cx={x} cy="250" r="10" fill="#0b1120" stroke="url(#deckGrad)" strokeWidth="3" />
        ))}

        {/* Flowing capital pulses */}
        {!reduce && [0, 0.75, 1.5, 2.25].map((begin, i) => (
          <circle key={i} r={i % 2 ? 5 : 6.5} fill="url(#pulseGrad)" filter="url(#glow)">
            <animateMotion dur="3s" begin={`${begin}s`} repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
              <mpath href="#deck" />
            </animateMotion>
          </circle>
        ))}
      </svg>

      {/* Crisp HTML labels overlaid on the bridge */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left — Public */}
        <motion.div
          initial={reduce ? false : { opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute left-[3%] top-[58%] -translate-y-1/2 text-left"
        >
          <div className="inline-flex items-center gap-1.5 rounded-lg glass-dark px-2.5 py-1.5 mb-1.5">
            <Landmark className="w-3.5 h-3.5 text-blue-300" strokeWidth={2.2} />
            <span className="text-[11px] font-semibold text-blue-100">Public Funding</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Stages 1–4</p>
        </motion.div>

        {/* Center — FundBridge hub */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.45 }}
          className="absolute left-1/2 top-[26%] -translate-x-1/2 -translate-y-1/2 text-center"
        >
          <div className="rounded-xl glass-dark px-3.5 py-2 shadow-[0_8px_32px_rgba(37,99,235,0.35)]">
            <span className="text-xs font-bold text-white tracking-tight">Fund<span className="text-blue-300">Bridge</span></span>
            <p className="text-[9px] text-slate-400 mt-0.5">Stage 4 validation</p>
          </div>
        </motion.div>

        {/* Right — Private */}
        <motion.div
          initial={reduce ? false : { opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="absolute right-[3%] top-[58%] -translate-y-1/2 text-right"
        >
          <div className="inline-flex items-center gap-1.5 rounded-lg glass-dark px-2.5 py-1.5 mb-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-300" strokeWidth={2.2} />
            <span className="text-[11px] font-semibold text-emerald-100">Private Capital</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Stages 4–6</p>
        </motion.div>
      </div>
    </div>
  );
}
