import { motion, useReducedMotion } from 'motion/react';

/**
 * Hero illustration: a clean line/flat bridge connecting a "public funding"
 * side (a small institution/columns motif) to a "private capital" side
 * (an upward growth motif). The span draws itself in on load; the side motifs
 * and labels fade up; a single subtle capital token drifts across.
 *
 * Light, minimal, brand-palette (blue → indigo → emerald, left→right).
 * Geometry lives in a 920×320 viewBox. Reduced-motion renders it static.
 */

// Quadratic span: P0(175,225) — ctrl(460,90) — P2(745,225). Piers computed off it.
const SPAN = 'M 175 225 Q 460 90 745 225';

export default function BridgeIllustration() {
  const reduce = useReducedMotion();

  const draw = (delay = 0) =>
    reduce
      ? { initial: false }
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { duration: 1.4, delay, ease: 'easeInOut' },
        };

  const fade = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <svg viewBox="0 0 920 320" className="w-full h-auto" role="img"
        aria-label="A bridge connecting public funding to private capital">
        <defs>
          <linearGradient id="spanGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="52%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>

        {/* Soft background accents anchoring each side */}
        <circle cx="150" cy="198" r="98" fill="#eff6ff" />
        <circle cx="778" cy="198" r="98" fill="#ecfdf5" />

        {/* Ground line */}
        <line x1="70" y1="250" x2="850" y2="250" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="2 9" strokeLinecap="round" />

        {/* Piers under the span */}
        {[{ x: 317, y: 174 }, { x: 460, y: 157 }, { x: 602, y: 174 }].map((p, i) => (
          <motion.line key={i} x1={p.x} y1={p.y} x2={p.x} y2="250" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" {...fade(1 + i * 0.1)} />
        ))}

        {/* Main span */}
        <motion.path id="span" d={SPAN} fill="none" stroke="url(#spanGrad)" strokeWidth="5" strokeLinecap="round" {...draw(0.3)} />

        {/* PUBLIC — institution / columns (left) */}
        <motion.g {...fade(0.5)}>
          <rect x="92" y="236" width="100" height="9" rx="2.5" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2.5" />
          {[110, 130, 150, 170].map((x) => (
            <line key={x} x1={x} y1="196" x2={x} y2="236" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
          ))}
          <line x1="98" y1="192" x2="186" y2="192" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 96 192 L 142 160 L 188 192 Z" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" />
        </motion.g>

        {/* PRIVATE — growth bars + arrow (right) */}
        <motion.g {...fade(0.65)}>
          <rect x="730" y="236" width="100" height="9" rx="2.5" fill="#d1fae5" stroke="#10b981" strokeWidth="2.5" />
          <rect x="742" y="214" width="16" height="22" rx="2.5" fill="#a7f3d0" stroke="#10b981" strokeWidth="2" />
          <rect x="770" y="200" width="16" height="36" rx="2.5" fill="#6ee7b7" stroke="#10b981" strokeWidth="2" />
          <rect x="798" y="182" width="16" height="54" rx="2.5" fill="#34d399" stroke="#10b981" strokeWidth="2" />
          <path d="M 736 216 L 770 196 L 808 168" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 796 166 L 810 165 L 809 179" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.g>

        {/* Center validation node */}
        <motion.g {...fade(1.35)}>
          <circle cx="460" cy="157" r="15" fill="#ffffff" stroke="#6366f1" strokeWidth="3" />
          <path d="M 453 157 l 5 5 l 9 -10" fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </motion.g>

        {/* Labels */}
        <motion.g {...fade(0.95)}>
          <text x="142" y="278" textAnchor="middle" fontSize="13" fontWeight="700" letterSpacing="0.6" fill="#64748b">PUBLIC FUNDING</text>
          <text x="142" y="295" textAnchor="middle" fontSize="11" fill="#94a3b8">Stages 1–4</text>
          <text x="780" y="278" textAnchor="middle" fontSize="13" fontWeight="700" letterSpacing="0.6" fill="#64748b">PRIVATE CAPITAL</text>
          <text x="780" y="295" textAnchor="middle" fontSize="11" fill="#94a3b8">Stages 4–6</text>
        </motion.g>

        {/* Subtle capital token crossing the span */}
        {!reduce && (
          <circle r="5.5" fill="#6366f1" opacity="0.9">
            <animateMotion dur="6s" begin="1.8s" repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
              <mpath href="#span" />
            </animateMotion>
          </circle>
        )}
      </svg>
    </div>
  );
}
