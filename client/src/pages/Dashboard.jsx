import { useMemo } from 'react';
import { useExpenses } from '../hooks/useExpenses.js';
import StatCard from '../components/StatCard.jsx';
import CategoryPie from '../components/CategoryPie.jsx';
import SpendLineChart from '../components/SpendLineChart.jsx';
import { formatCurrency } from '../lib/format.js';

function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function daysAgo(n) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
}

export default function Dashboard() {
  const { data, isLoading, isError, error } = useExpenses();

  const stats = useMemo(() => {
    const expenses = data ?? [];
    const monthStart = startOfMonth();
    const thisMonth = expenses.filter((e) => new Date(e.date) >= monthStart);

    const total = thisMonth.reduce((sum, e) => sum + Number(e.amount || 0), 0);

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

    return { total, count: thisMonth.length, byCategory, byDay };
  }, [data]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">An overview of your spending.</p>
      </div>

      {isError && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
          Failed to load expenses: {error?.message || 'Unknown error'}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Spent this month"
          value={isLoading ? '—' : formatCurrency(stats.total)}
        />
        <StatCard
          title="Transactions"
          value={isLoading ? '—' : stats.count}
        />
        <StatCard
          title="Top category"
          value={
            isLoading || stats.byCategory.length === 0
              ? '—'
              : [...stats.byCategory].sort((a, b) => b.value - a.value)[0].name
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-slate-700 mb-2">By category (this month)</h2>
          <CategoryPie data={stats.byCategory} />
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-slate-700 mb-2">Last 30 days</h2>
          <SpendLineChart data={stats.byDay} />
        </div>
      </div>
    </div>
  );
}
