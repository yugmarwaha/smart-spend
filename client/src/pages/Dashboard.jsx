import { useMemo } from 'react';
import { useExpenses } from '../hooks/useExpenses.js';
import StatCard from '../components/StatCard.jsx';
import CategoryPie from '../components/CategoryPie.jsx';
import SpendLineChart from '../components/SpendLineChart.jsx';
import { formatCurrency } from '../lib/format.js';

function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function startOfPrevMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth() - 1, 1);
}
function daysAgo(n) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
}

const monthLabel = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
}).format(new Date());

const Icon = {
  wallet: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h16v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7" />
      <circle cx="17" cy="13" r="1" />
    </svg>
  ),
  list: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  ),
  trend: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M14 7h7v7" />
    </svg>
  ),
  tag: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <path d="M7 7h.01" />
    </svg>
  ),
};

export default function Dashboard() {
  const { data, isLoading, isError, error } = useExpenses();

  const stats = useMemo(() => {
    const expenses = data ?? [];
    const monthStart = startOfMonth();
    const prevMonthStart = startOfPrevMonth();

    const thisMonth = expenses.filter((e) => new Date(e.date) >= monthStart);
    const lastMonth = expenses.filter((e) => {
      const d = new Date(e.date);
      return d >= prevMonthStart && d < monthStart;
    });

    const total = thisMonth.reduce((s, e) => s + Number(e.amount || 0), 0);
    const prevTotal = lastMonth.reduce((s, e) => s + Number(e.amount || 0), 0);
    const delta = prevTotal ? ((total - prevTotal) / prevTotal) * 100 : 0;
    const deltaStr = prevTotal
      ? `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}%`
      : null;

    const byCategory = Object.entries(
      thisMonth.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + Number(e.amount || 0);
        return acc;
      }, {}),
    ).map(([name, value]) => ({ name, value }));

    const cutoff = daysAgo(29);
    const dayBuckets = {};
    for (let i = 29; i >= 0; i--) {
      const d = daysAgo(i);
      const key = d.toISOString().slice(0, 10);
      dayBuckets[key] = 0;
    }
    expenses.forEach((e) => {
      const d = new Date(e.date);
      if (d < cutoff) return;
      const key = d.toISOString().slice(0, 10);
      if (key in dayBuckets) dayBuckets[key] += Number(e.amount || 0);
    });
    const byDay = Object.entries(dayBuckets).map(([key, value]) => ({
      label: key.slice(5),
      value: Math.round(value * 100) / 100,
    }));

    const top = [...byCategory].sort((a, b) => b.value - a.value)[0];
    const avg = thisMonth.length ? total / thisMonth.length : 0;

    return {
      total,
      count: thisMonth.length,
      byCategory,
      byDay,
      topCategory: top?.name ?? '—',
      avg,
      deltaStr,
    };
  }, [data]);

  const valOrDash = (v) => (isLoading ? '—' : v);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs text-fg-muted mb-1">Overview</div>
          <h1 className="text-2xl font-semibold tracking-tight text-fg">
            Dashboard
          </h1>
          <p className="text-sm text-fg-muted mt-1">
            {monthLabel} · spending at a glance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-ghost">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M7 12h10M10 18h4" />
            </svg>
            Filter
          </button>
          <button className="btn btn-ghost">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Export
          </button>
        </div>
      </header>

      {isError && (
        <div className="card p-4 border-negative/40 flex items-start gap-3">
          <div className="w-6 h-6 rounded-md bg-negative/10 border border-negative/30 grid place-items-center text-negative shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <div className="text-sm">
            <div className="text-fg font-medium">Could not load data</div>
            <div className="text-fg-muted text-xs mt-0.5">
              {error?.message || 'Unknown error'}
            </div>
          </div>
        </div>
      )}

      {/* Stat grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="fade-up fade-up-1">
          <StatCard
            title="Total spent"
            value={valOrDash(formatCurrency(stats.total))}
            trend={stats.deltaStr}
            hint="vs. last month"
            icon={Icon.wallet}
          />
        </div>
        <div className="fade-up fade-up-2">
          <StatCard
            title="Transactions"
            value={valOrDash(stats.count)}
            hint="this month"
            icon={Icon.list}
          />
        </div>
        <div className="fade-up fade-up-3">
          <StatCard
            title="Average"
            value={valOrDash(formatCurrency(stats.avg))}
            hint="per transaction"
            icon={Icon.trend}
          />
        </div>
        <div className="fade-up fade-up-4">
          <StatCard
            title="Top category"
            value={valOrDash(stats.topCategory)}
            hint="by total spend"
            icon={Icon.tag}
          />
        </div>
      </section>

      {/* Chart row */}
      <section className="grid gap-4 lg:grid-cols-3">
        <article className="card p-5 lg:col-span-2 fade-up fade-up-3">
          <header className="flex items-baseline justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-fg">Spending over time</h2>
              <div className="text-xs text-fg-muted mt-0.5">Last 30 days</div>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="px-2 py-1 rounded-md bg-surface-2 text-fg border border-border-2">
                30D
              </span>
              <span className="px-2 py-1 rounded-md text-fg-muted hover:text-fg cursor-pointer">
                90D
              </span>
              <span className="px-2 py-1 rounded-md text-fg-muted hover:text-fg cursor-pointer">
                1Y
              </span>
            </div>
          </header>
          <SpendLineChart data={stats.byDay} />
        </article>

        <article className="card p-5 fade-up fade-up-4">
          <header className="mb-4">
            <h2 className="text-sm font-semibold text-fg">By category</h2>
            <div className="text-xs text-fg-muted mt-0.5">{monthLabel}</div>
          </header>
          <CategoryPie data={stats.byCategory} />
        </article>
      </section>
    </div>
  );
}
