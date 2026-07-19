import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

/**
 * Animates a numeric value from 0 → target when scrolled into view.
 * Accepts formatted strings like "€8M", "30%", "€1–8M", "10", "72/100"
 * by splitting off a leading prefix and trailing suffix and only animating
 * the first numeric run. If no single number is found, it renders as-is.
 */
export default function CountUp({ value, duration = 1.4, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(null);

  const str = String(value);
  const match = str.match(/(\d[\d,]*\.?\d*)/); // first numeric run

  useEffect(() => {
    if (!inView || !match) return;
    const numeric = parseFloat(match[1].replace(/,/g, ''));

    if (reduce) {
      setDisplay(numeric);
      return;
    }

    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(numeric * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(numeric);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce]);

  // No number to animate → render the raw value
  if (!match) return <span ref={ref} className={className}>{str}</span>;

  const decimals = (match[1].split('.')[1] || '').length;
  const rendered =
    display === null
      ? match[1]
      : display.toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });

  const shown = str.replace(match[1], rendered);

  return <span ref={ref} className={className}>{shown}</span>;
}
