import { useState, useRef, useEffect } from 'react';
import { startups } from '../data/mockData';
import StartupCard from '../components/StartupCard';

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
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 text-sm text-blue-700 font-medium mb-4">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            Stage 4 · Government validated
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Startup Marketplace</h1>
          <p className="text-slate-500 mt-2 text-lg max-w-xl">
            All startups below completed government-supported stages 1–4 and are seeking private investment to reach stage 6.
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-8" ref={containerRef}>
          <div className="relative">
            {/* Input wrapper */}
            <div className={`flex items-center gap-3 bg-white border rounded-2xl px-4 py-3 shadow-sm transition-all duration-150 ${dropdownOpen ? 'border-blue-400 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'}`}>
              {/* Search icon */}
              <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>

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
            {dropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-lg z-20 overflow-hidden">
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
              </div>
            )}
          </div>
        </div>

        {/* Cards grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((startup) => (
              <StartupCard key={startup.id} startup={startup} onSelect={onSelectStartup} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-2xl mb-4">🔍</div>
            <p className="text-slate-700 font-semibold text-base">No startups found</p>
            <p className="text-slate-400 text-sm mt-1">Try a different search term or sector.</p>
            <button onClick={clearAll} className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
              Clear search
            </button>
          </div>
        )}

        {/* Bottom notice */}
        <div className="mt-12 bg-white border border-slate-200 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-lg flex-shrink-0">ℹ</div>
          <div>
            <p className="text-sm font-semibold text-slate-800">About FundBridge listings</p>
            <p className="text-sm text-slate-500 mt-1">
              All startups listed here have been independently validated at stage 4 by FundBridge in cooperation with the Federal Agency for Innovation. Government retains a passive equity stake (1–10%) based on stage 4 valuation. All investors are eligible for the 30% tax rebate on failure as per §17 EStG pilot regulation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
