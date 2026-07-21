import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Waypoints } from 'lucide-react';

export default function Navbar({ currentPage, setPage }) {
  const links = [
    { label: 'Home', page: 'home' },
    { label: 'Startups', page: 'marketplace' },
    { label: 'Investor Dashboard', page: 'investor' },
    { label: 'Government Dashboard', page: 'government' },
  ];

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 border-slate-200 shadow-[0_4px_24px_rgba(15,23,42,0.06)]'
          : 'bg-white/70 border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => setPage('home')}
          className="flex items-center gap-2.5 group"
        >
          <motion.div
            whileHover={{ scale: 1.08, rotate: -6 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-[0_4px_12px_rgba(37,99,235,0.35)]"
          >
            <Waypoints className="w-4 h-4 text-white" strokeWidth={2.4} />
          </motion.div>
          <span className="font-semibold text-lg tracking-tight font-display text-slate-900">
            Fund<span className="text-blue-600">Bridge</span>
          </span>
        </button>

        <div className="flex items-center gap-1">
          {links.map((link) => {
            const active = currentPage === link.page;
            return (
              <button
                key={link.page}
                onClick={() => setPage(link.page)}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  active ? 'text-blue-700' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-lg bg-blue-50"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
