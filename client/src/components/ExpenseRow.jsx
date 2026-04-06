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
        <td colSpan={5} className="p-3 bg-slate-50">
          <ExpenseForm
            initial={expense}
            submitLabel="Save"
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
    if (!confirm('Delete this expense?')) return;
    deleteMut.mutate(expense.id);
  };

  return (
    <tr className="border-t border-slate-200 hover:bg-slate-50">
      <td className="px-3 py-2 text-sm">{formatDate(expense.date)}</td>
      <td className="px-3 py-2 text-sm">
        <span
          className="inline-block w-2 h-2 rounded-full mr-2 align-middle"
          style={{ backgroundColor: CATEGORY_COLORS[expense.category] || '#64748b' }}
        />
        {expense.category}
      </td>
      <td className="px-3 py-2 text-sm text-slate-600">{expense.note || '—'}</td>
      <td className="px-3 py-2 text-sm text-right font-medium">
        {formatCurrency(expense.amount)}
      </td>
      <td className="px-3 py-2 text-sm text-right">
        <button
          onClick={() => setEditing(true)}
          className="text-slate-600 hover:text-slate-900 mr-3"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={deleteMut.isPending}
          className="text-red-600 hover:text-red-800 disabled:opacity-50"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
