import { useMemo, useState } from 'react';
import ExpenseForm from '../components/ExpenseForm.jsx';
import ExpenseList from '../components/ExpenseList.jsx';
import { useAddExpense, useExpenses } from '../hooks/useExpenses.js';
import { CATEGORIES } from '../lib/categories.js';
import { exportExpensesCsv } from '../lib/csv.js';

const RANGES = {
  all: { label: 'All time', days: null },
  '7d': { label: 'Last 7 days', days: 7 },
  '30d': { label: 'Last 30 days', days: 30 },
  '90d': { label: 'Last 90 days', days: 90 },
};

function applyFilter(expenses, filter) {
  const q = filter.search.trim().toLowerCase();
  const cutoff = filter.range !== 'all' ? Date.now() - RANGES[filter.range].days * 86400000 : null;
  return expenses.filter((e) => {
    if (filter.category !== 'all' && e.category !== filter.category) return false;
    if (cutoff !== null && new Date(e.date).getTime() < cutoff) return false;
    if (q) {
      const hay = `${e.note || ''} ${e.category}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export default function Expenses() {
  const addMut = useAddExpense();
  const { data } = useExpenses();
  const [filter, setFilter] = useState({
    category: 'all',
    range: 'all',
    search: '',
  });

  const filtered = useMemo(() => applyFilter(data ?? [], filter), [data, filter]);
  const hasActiveFilter =
    filter.category !== 'all' || filter.range !== 'all' || filter.search !== '';

  const clearFilters = () =>
    setFilter({ category: 'all', range: 'all', search: '' });

  const handleExport = () => {
    if (filtered.length === 0) return;
    exportExpensesCsv(filtered, `smartspend-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs text-fg-muted mb-1">Activity</div>
          <h1 className="text-2xl font-semibold tracking-tight text-fg">
            Transactions
          </h1>
          <p className="text-sm text-fg-muted mt-1">
            Record and manage every expense.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          disabled={filtered.length === 0}
          className="btn btn-ghost disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Export CSV
        </button>
      </header>

      <section className="space-y-2 fade-up fade-up-1">
        <div className="text-xs text-fg-muted px-1">New transaction</div>
        <ExpenseForm
          onSubmit={(payload) => addMut.mutate(payload)}
          busy={addMut.isPending}
        />
      </section>

      <section className="card p-4 fade-up fade-up-2">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="label block mb-1.5">Search</label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={filter.search}
                onChange={(e) => setFilter((f) => ({ ...f, search: e.target.value }))}
                placeholder="Search notes or category…"
                className="input pl-9"
              />
            </div>
          </div>

          <div className="min-w-[160px]">
            <label className="label block mb-1.5">Category</label>
            <select
              value={filter.category}
              onChange={(e) => setFilter((f) => ({ ...f, category: e.target.value }))}
              className="input cursor-pointer"
            >
              <option value="all">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-[160px]">
            <label className="label block mb-1.5">Date range</label>
            <select
              value={filter.range}
              onChange={(e) => setFilter((f) => ({ ...f, range: e.target.value }))}
              className="input cursor-pointer"
            >
              {Object.entries(RANGES).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilter && (
            <button
              type="button"
              onClick={clearFilters}
              className="btn btn-ghost"
            >
              Clear
            </button>
          )}
        </div>
      </section>

      <section className="fade-up fade-up-3">
        <ExpenseList expenses={filtered} totalCount={data?.length ?? 0} />
      </section>
    </div>
  );
}
