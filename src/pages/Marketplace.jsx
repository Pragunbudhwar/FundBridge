import { startups } from '../data/mockData';
import StartupCard from '../components/StartupCard';

export default function Marketplace({ onSelectStartup }) {
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

        {/* Filter row */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex gap-2">
            {['All Sectors', 'ClimateTech', 'HealthTech', 'DeepTech', 'AgriTech', 'Cybersecurity'].map((f) => (
              <span
                key={f}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-default border ${
                  f === 'All Sectors'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-colors'
                }`}
              >
                {f}
              </span>
            ))}
          </div>
          <div className="ml-auto text-sm text-slate-400">{startups.length} startups listed</div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups.map((startup) => (
            <StartupCard key={startup.id} startup={startup} onSelect={onSelectStartup} />
          ))}
        </div>

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
