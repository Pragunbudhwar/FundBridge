export default function Navbar({ currentPage, setPage }) {
  const links = [
    { label: 'Home', page: 'home' },
    { label: 'Startups', page: 'marketplace' },
    { label: 'Investor Dashboard', page: 'investor' },
    { label: 'Government Dashboard', page: 'government' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => setPage('home')}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
            <span className="text-white text-xs font-bold">FB</span>
          </div>
          <span className="text-slate-900 font-semibold text-lg tracking-tight">
            Fund<span className="text-blue-600">Bridge</span>
          </span>
        </button>

        <div className="flex items-center gap-1">
          {links.map((link) => (
            <button
              key={link.page}
              onClick={() => setPage(link.page)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                currentPage === link.page
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
