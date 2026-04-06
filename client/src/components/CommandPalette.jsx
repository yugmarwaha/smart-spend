import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { useExpenses, useDeleteExpense } from '../hooks/useExpenses.js';
import { CATEGORY_COLORS } from '../lib/categories.js';
import { formatCurrency, formatDate } from '../lib/format.js';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { data } = useExpenses();
  const deleteMut = useDeleteExpense();

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const close = () => {
    setOpen(false);
    setSearch('');
  };

  const go = (path) => {
    navigate(path);
    close();
  };

  if (!open) return null;

  const expenses = data ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 bg-black/50 backdrop-blur-sm"
      onClick={close}
    >
      <Command
        label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-surface border border-border-strong rounded-xl shadow-2xl overflow-hidden fade-up"
      >
        <div className="flex items-center px-4 border-b border-border">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fg-muted">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search transactions or jump to a page…"
            className="w-full bg-transparent border-0 outline-none px-3 py-4 text-sm text-fg placeholder:text-fg-dim"
          />
          <span className="kbd">esc</span>
        </div>

        <Command.List className="max-h-[60vh] overflow-y-auto p-2">
          <Command.Empty className="px-3 py-8 text-center text-sm text-fg-muted">
            No results.
          </Command.Empty>

          <Command.Group heading="Pages" className="text-fg-muted text-[10px] uppercase tracking-wider px-2 py-1">
            <Command.Item
              onSelect={() => go('/')}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-fg-2 cursor-pointer aria-selected:bg-surface-2 aria-selected:text-fg"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="9" rx="1" />
                <rect x="14" y="3" width="7" height="5" rx="1" />
                <rect x="14" y="12" width="7" height="9" rx="1" />
                <rect x="3" y="16" width="7" height="5" rx="1" />
              </svg>
              Dashboard
            </Command.Item>
            <Command.Item
              onSelect={() => go('/expenses')}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-fg-2 cursor-pointer aria-selected:bg-surface-2 aria-selected:text-fg"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
              Transactions
            </Command.Item>
          </Command.Group>

          {expenses.length > 0 && (
            <Command.Group heading="Transactions" className="text-fg-muted text-[10px] uppercase tracking-wider px-2 pt-3 pb-1">
              {expenses.slice(0, 50).map((e) => {
                const color = CATEGORY_COLORS[e.category] || '#94a3b8';
                return (
                  <Command.Item
                    key={e.id}
                    value={`${e.note || ''} ${e.category} ${e.amount}`}
                    onSelect={() => {
                      navigate('/expenses');
                      close();
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm cursor-pointer aria-selected:bg-surface-2 group"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-none"
                      style={{ backgroundColor: color }}
                    />
                    <span className="flex-1 truncate text-fg-2 group-aria-selected:text-fg">
                      {e.note || <em className="text-fg-dim">no note</em>}
                    </span>
                    <span className="text-xs text-fg-muted">{e.category}</span>
                    <span className="font-mono tabular-nums text-xs text-fg">
                      {formatCurrency(e.amount)}
                    </span>
                    <span className="text-xs text-fg-dim font-mono w-16 text-right">
                      {formatDate(e.date)}
                    </span>
                  </Command.Item>
                );
              })}
            </Command.Group>
          )}
        </Command.List>

        <div className="px-4 py-2 border-t border-border flex items-center justify-between text-xs text-fg-muted">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="kbd">↑↓</span> navigate
            </span>
            <span className="flex items-center gap-1">
              <span className="kbd">↵</span> select
            </span>
          </div>
          <span>{deleteMut.isPending ? 'deleting…' : ''}</span>
        </div>
      </Command>
    </div>
  );
}
