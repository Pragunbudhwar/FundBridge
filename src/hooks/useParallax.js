import { useEffect } from 'react';
import { useMotionValue, useSpring, useReducedMotion } from 'motion/react';

/**
 * Tracks pointer position (normalized -0.5..0.5 from viewport center) as two
 * spring motion values. Multiply by a depth factor per layer for parallax.
 * Returns { mx, my } spring MotionValues. No-ops under reduced motion.
 */
export default function useParallax() {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mx = useSpring(x, { stiffness: 120, damping: 20 });
  const my = useSpring(y, { stiffness: 120, damping: 20 });

  useEffect(() => {
    if (reduce) return;
    function onMove(e) {
      x.set(e.clientX / window.innerWidth - 0.5);
      y.set(e.clientY / window.innerHeight - 0.5);
    }
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reduce, x, y]);

  return { mx, my };
}
