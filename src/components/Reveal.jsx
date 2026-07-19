import { motion, useReducedMotion } from 'motion/react';

/**
 * Scroll-triggered fade-up wrapper. Fires once when the element enters view.
 * Respects prefers-reduced-motion (renders static). Pass `delay` for stagger,
 * `y` to tune travel, and `as` is handled via motion.<tag> through `className`.
 */
export default function Reveal({ children, delay = 0, y = 24, className = '', once = true }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
