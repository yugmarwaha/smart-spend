import { NavLink, Outlet, useLocation } from 'react-router-dom';

const navLinkClass = ({ isActive }) =>
  [
    'relative px-3 py-1.5 text-sm rounded-md transition-colors',
    isActive
      ? 'text-fg bg-surface-2'
      : 'text-fg-muted hover:text-fg hover:bg-surface/60',
  ].join(' ');

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-accent-2 grid place-items-center shadow-[0_0_0_1px_rgba(190,242,100,0.3),0_8px_24px_-8px_rgba(190,242,100,0.5)]">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0a0c05"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 17l6-6 4 4 8-8" />
          <path d="M14 7h7v7" />
        </svg>
      </div>
      <span className="text-[15px] font-semibold tracking-tight text-fg">
        SmartSpend
      </span>
    </div>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  const isDashboard = pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-bg text-fg">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-bg/70 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
          <Logo />

          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/expenses" className={navLinkClass}>
              Transactions
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-fg-muted">
              <span>Search</span>
              <span className="kbd">⌘K</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-surface-3 to-surface-2 border border-border-2 grid place-items-center text-xs font-medium text-fg-2">
              YM
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-10 fade-up">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between text-xs text-fg-muted">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
            <span>All systems operational</span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span>v0.1.0</span>
            <span>·</span>
            <span>{isDashboard ? 'Dashboard' : 'Transactions'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
