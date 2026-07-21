/**
 * Animated aurora field for dark cinematic sections. Drifting, blurred
 * color blobs over an ink base, with a faint dot-grid overlay. Purely
 * decorative — pointer-events-none, sits behind content. Drift animations
 * are CSS and auto-freeze under prefers-reduced-motion (see index.css).
 */
export default function Aurora({ className = '' }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {/* Ink base gradient */}
      <div className="absolute inset-0 bg-[#070b18]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1224] via-[#070b18] to-[#070b18]" />

      {/* Drifting aurora blobs */}
      <div className="aurora-blob animate-drift w-[42rem] h-[42rem] -top-40 -left-32 bg-blue-600/25" />
      <div className="aurora-blob animate-drift-rev w-[38rem] h-[38rem] top-10 right-[-8rem] bg-indigo-500/25" />
      <div className="aurora-blob animate-drift-slow w-[34rem] h-[34rem] bottom-[-12rem] left-1/3 bg-violet-600/20" />
      <div className="aurora-blob animate-drift w-[22rem] h-[22rem] top-1/3 left-1/2 bg-cyan-400/10" />

      {/* Dot-grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-70" />

      {/* Vignette to keep edges deep */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_90%_at_50%_0%,transparent_40%,rgba(3,6,16,0.7)_100%)]" />
    </div>
  );
}
