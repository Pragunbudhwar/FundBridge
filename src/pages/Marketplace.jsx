import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SearchX, Info, BadgeCheck } from 'lucide-react';
import { startups } from '../data/mockData';
import StartupCard from '../components/StartupCard';
import Reveal from '../components/Reveal';

const SECTORS = ['ClimateTech', 'HealthTech', 'DeepTech', 'AgriTech', 'Cybersecurity'];

export default function Marketplace({ onSelectStartup }) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestedSectors = query
    ? SECTORS.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    : SECTORS;

  const filtered = startups.filter((s) => {
    const matchesSector = activeFilter ? s.sector === activeFilter : true;
    const matchesQuery = query
      ? s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.sector.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase())
      : true;
    return matchesSector && matchesQuery;
  });

  function selectSector(sector) {
    setActiveFilter(sector);
    setQuery('');
    setDropdownOpen(false);
    inputRef.current?.blur();
  }

  function clearAll() {
    setActiveFilter(null);
    setQuery('');
    inputRef.current?.focus();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero band */}
      <div className="relative overflow-hidden bg-mesh border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-14 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-blue-200 rounded-full px-4 py-1.5 text-sm text-blue-700 font-medium mb-5 shadow-sm">
              <BadgeCheck className="w-4 h-4" strokeWidth={2.2} />
              Stage 4 · Government validated
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight font-display">Startup Marketplace</h1>
            <p className="text-slate-500 mt-4 text-lg max-w-2xl mx-auto leading-relaxed">
              Every startup here completed government-supported stages 1–4 and is now seeking private investment to reach stage 6.
            </p>
            <div className="mt-8 flex items-center justify-center gap-8">
              {[
                { value: startups.length, label: 'Live startups' },
                { value: '30%', label: 'Rebate protection' },
                { value: '1–10%', label: 'Gov. equity' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-bold text-slate-900 font-display">{s.value}</p>
                  <p className="text-xs text-slate-400 uppercase tracking-wide mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Search bar — command-style, overlapping the hero band */}
        <div className="mb-10 -mt-[4.5rem] relative z-10 max-w-3xl mx-auto" ref={containerRef}>
          <div className="relative">
            {/* Input wrapper */}
            <div className={`flex items-center gap-3 bg-white border rounded-2xl px-5 py-4 shadow-[var(--shadow-soft-lg)] transition-all duration-200 ${dropdownOpen ? 'border-blue-400 ring-4 ring-blue-100' : 'border-slate-200 hover:border-slate-300'}`}>
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" strokeWidth={2} />

              {/* Active sector chip */}
              {activeFilter && (
                <span className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs font-medium px-2.5 py-1 rounded-lg flex-shrink-0">
                  {activeFilter}
                  <button
                    onClick={clearAll}
                    className="hover:text-blue-200 transition-colors leading-none"
                    aria-label="Remove filter"
                  >
                    ×
                  </button>
                </span>
              )}

              {/* Text input */}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveFilter(null);
                  setDropdownOpen(true);
                }}
                onFocus={() => setDropdownOpen(true)}
                placeholder={activeFilter ? 'Refine results...' : 'Search by startup name, sector, or description...'}
                className="flex-1 text-sm text-slate-700 placeholder-slate-400 outline-none bg-transparent min-w-0"
              />

              {/* Clear button */}
              {(query || activeFilter) && (
                <button onClick={clearAll} className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0 text-lg leading-none">
                  ×
                </button>
              )}

              {/* Count badge */}
              <span className="text-xs text-slate-400 flex-shrink-0 border-l border-slate-100 pl-3">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Dropdown */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-[var(--shadow-soft-lg)] z-20 overflow-hidden"
                >
                  {suggestedSectors.length > 0 && (
                    <div className="p-3">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
                        {query ? 'Matching sectors' : 'Browse by sector'}
                      </p>
                      <div className="flex flex-col gap-0.5">
                        {suggestedSectors.map((sector) => {
                          const count = startups.filter((s) => s.sector === sector).length;
                          const sectorIcons = {
                            ClimateTech: '🌱',
                            HealthTech: '🩺',
                            DeepTech: '⚛️',
                            AgriTech: '🌾',
                            Cybersecurity: '🔐',
                          };
                          return (
                            <button
                              key={sector}
                              onMouseDown={() => selectSector(sector)}
                              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-left transition-colors ${activeFilter === sector ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
                            >
                              <span className="flex items-center gap-2.5">
                                <span>{sectorIcons[sector]}</span>
                                {sector}
                              </span>
                              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{count}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {query && (
                    <>
                      <div className="border-t border-slate-100 mx-3" />
                      <div className="p-3">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">Startups</p>
                        {startups
                          .filter(
                            (s) =>
                              s.name.toLowerCase().includes(query.toLowerCase()) ||
                              s.description.toLowerCase().includes(query.toLowerCase())
                          )
                          .slice(0, 4)
                          .map((s) => (
                            <button
                              key={s.id}
                              onMouseDown={() => {
                                setDropdownOpen(false);
                                setQuery('');
                                onSelectStartup(s);
                              }}
                              className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm text-left text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              <span className="font-medium">{s.name}</span>
                              <span className="text-xs text-slate-400">{s.sector}</span>
                            </button>
                          ))}
                        {startups.filter(
                          (s) =>
                            s.name.toLowerCase().includes(query.toLowerCase()) ||
                            s.description.toLowerCase().includes(query.toLowerCase())
                        ).length === 0 && suggestedSectors.length === 0 && (
                          <p className="text-sm text-slate-400 px-3 py-2">No results for "{query}"</p>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Cards grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filtered.map((startup, i) => (
              <Reveal key={startup.id} delay={Math.min(i * 0.06, 0.4)} className="h-full">
                <StartupCard startup={startup} onSelect={onSelectStartup} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
              <SearchX className="w-6 h-6" strokeWidth={2} />
            </div>
            <p className="text-slate-700 font-semibold text-base">No startups found</p>
            <p className="text-slate-400 text-sm mt-1">Try a different search term or sector.</p>
            <button onClick={clearAll} className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
              Clear search
            </button>
          </div>
        )}

        {/* Bottom notice */}
        <Reveal className="mt-12">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-[var(--shadow-soft)] p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
              <Info className="w-5 h-5" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">About FundBridge listings</p>
              <p className="text-sm text-slate-500 mt-1">
                All startups listed here have been independently validated at stage 4 by FundBridge in cooperation with the Federal Agency for Innovation. Government retains a passive equity stake (1–10%) based on stage 4 valuation. All investors are eligible for the 30% tax rebate on failure as per §17 EStG pilot regulation.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
