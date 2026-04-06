import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import CommandPalette from './CommandPalette.jsx';

const navLinkClass = ({ isActive }) =>
  [
    'relative px-3 py-1.5 text-sm rounded-md transition-colors',
    isActive
      ? 'text-fg bg-surface-2'
      : 'text-fg-muted hover:text-fg hover:bg-surface/60',
  ].join(' ');

const mobileLinkClass = ({ isActive }) =>
  [
    'block px-4 py-3 text-base rounded-lg transition-colors',
    isActive
      ? 'text-fg bg-surface-2'
      : 'text-fg-2 hover:text-fg hover:bg-surface',
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeDrawer = () => setMobileOpen(false);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-bg text-fg">
      <CommandPalette />
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-bg/70 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4 sm:gap-6">
          <Logo />

          <nav className="hidden sm:flex items-center gap-1">
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
            <div className="hidden sm:grid w-8 h-8 rounded-full bg-gradient-to-br from-surface-3 to-surface-2 border border-border-2 place-items-center text-xs font-medium text-fg-2">
              YM
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="sm:hidden w-9 h-9 rounded-md grid place-items-center text-fg-2 hover:text-fg hover:bg-surface-2 transition-colors"
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="sm:hidden fixed inset-0 top-14 z-30 bg-bg/95 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        >
          <nav
            className="border-b border-border p-4 space-y-1 bg-bg"
            onClick={(e) => e.stopPropagation()}
          >
            <NavLink to="/" end className={mobileLinkClass} onClick={closeDrawer}>
              Dashboard
            </NavLink>
            <NavLink to="/expenses" className={mobileLinkClass} onClick={closeDrawer}>
              Transactions
            </NavLink>
          </nav>
        </div>
      )}

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 fade-up">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between text-xs text-fg-muted">
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
