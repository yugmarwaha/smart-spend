import { useState } from 'react';
import ExpenseForm from './ExpenseForm.jsx';
import { useUpdateExpense, useDeleteExpense } from '../hooks/useExpenses.js';
import { formatCurrency, formatDate } from '../lib/format.js';
import { CATEGORY_COLORS } from '../lib/categories.js';

export default function ExpenseRow({ expense }) {
  const [editing, setEditing] = useState(false);
  const updateMut = useUpdateExpense();
  const deleteMut = useDeleteExpense();

  if (editing) {
    return (
      <tr>
        <td colSpan={5} className="py-3">
          <ExpenseForm
            initial={expense}
            submitLabel="Save changes"
            busy={updateMut.isPending}
            onCancel={() => setEditing(false)}
            onSubmit={(patch) =>
              updateMut.mutate(
                { id: expense.id, patch },
                { onSuccess: () => setEditing(false) },
              )
            }
          />
        </td>
      </tr>
    );
  }

  const handleDelete = () => {
    if (!confirm('Delete this transaction?')) return;
    deleteMut.mutate(expense.id);
  };

  const color = CATEGORY_COLORS[expense.category] || '#94a3b8';

  return (
    <tr className="group border-b border-border last:border-0 hover:bg-surface/50 transition-colors">
      <td className="py-3.5 pl-4 pr-3 font-mono text-xs text-fg-muted whitespace-nowrap">
        {formatDate(expense.date)}
      </td>
      <td className="py-3.5 px-3">
        <span
          className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md text-xs font-medium border"
          style={{
            color,
            borderColor: `${color}33`,
            backgroundColor: `${color}12`,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          {expense.category}
        </span>
      </td>
      <td className="py-3.5 px-3 text-sm text-fg-2 truncate max-w-[280px]">
        {expense.note || <span className="text-fg-dim">—</span>}
      </td>
      <td className="py-3.5 px-3 text-right font-mono tabular-nums text-sm font-medium text-fg">
        {formatCurrency(expense.amount)}
      </td>
      <td className="py-3.5 pl-3 pr-4 text-right whitespace-nowrap">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1">
          <button
            onClick={() => setEditing(true)}
            title="Edit"
            className="w-7 h-7 rounded-md grid place-items-center text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteMut.isPending}
            title="Delete"
            className="w-7 h-7 rounded-md grid place-items-center text-fg-muted hover:text-negative hover:bg-negative/10 transition-colors disabled:opacity-40"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}
