import { useExpenses } from '../hooks/useExpenses.js';
import ExpenseRow from './ExpenseRow.jsx';
import { formatCurrency } from '../lib/format.js';
import { TableRowSkeleton } from './Skeleton.jsx';

function EmptyState() {
  return (
    <div className="card p-12 text-center">
      <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border-2 grid place-items-center mx-auto mb-4 text-fg-muted">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </div>
      <div className="text-fg font-medium">No transactions yet</div>
      <div className="text-sm text-fg-muted mt-1">
        Add your first transaction above to get started.
      </div>
    </div>
  );
}

export default function ExpenseList() {
  const { data, isLoading, isError, error } = useExpenses();

  if (isLoading) {
    return (
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <div className="h-4 w-32 bg-surface-2 rounded-md animate-pulse" />
          <div className="h-3 w-24 bg-surface-2 rounded-md animate-pulse mt-2" />
        </div>
        <table className="w-full">
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <TableRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="card p-6 border-negative/40">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-md bg-negative/10 border border-negative/30 grid place-items-center text-negative shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium text-fg">Failed to load transactions</div>
            <div className="text-xs text-fg-muted mt-0.5">
              {error?.message || 'Unknown error'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const expenses = data ?? [];

  if (expenses.length === 0) return <EmptyState />;

  const sorted = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const total = sorted.reduce((s, e) => s + Number(e.amount || 0), 0);

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-fg">All transactions</h3>
          <div className="text-xs text-fg-muted mt-0.5">
            {sorted.length} {sorted.length === 1 ? 'entry' : 'entries'} ·{' '}
            <span className="text-fg-2 font-mono tabular-nums">
              {formatCurrency(total)}
            </span>{' '}
            total
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="pl-4 pr-3 py-2.5 label font-medium">Date</th>
              <th className="px-3 py-2.5 label font-medium">Category</th>
              <th className="px-3 py-2.5 label font-medium">Note</th>
              <th className="px-3 py-2.5 label font-medium text-right">Amount</th>
              <th className="pl-3 pr-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((e) => (
              <ExpenseRow key={e.id} expense={e} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
