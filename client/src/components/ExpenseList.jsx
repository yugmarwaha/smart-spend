import { useExpenses } from '../hooks/useExpenses.js';
import ExpenseRow from './ExpenseRow.jsx';

export default function ExpenseList() {
  const { data, isLoading, isError, error } = useExpenses();

  if (isLoading) {
    return <div className="text-sm text-slate-500 py-8 text-center">Loading expenses...</div>;
  }

  if (isError) {
    return (
      <div className="text-sm text-red-600 py-8 text-center">
        Failed to load expenses: {error?.message || 'Unknown error'}
      </div>
    );
  }

  const expenses = data ?? [];

  if (expenses.length === 0) {
    return (
      <div className="text-sm text-slate-500 py-8 text-center">
        No expenses yet. Add your first one above.
      </div>
    );
  }

  const sorted = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Date</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Category</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Note</th>
            <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600">Amount</th>
            <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600"></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((e) => (
            <ExpenseRow key={e.id} expense={e} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
