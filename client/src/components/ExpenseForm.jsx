import { useState } from 'react';
import { CATEGORIES } from '../lib/categories.js';

const todayISO = () => new Date().toISOString().slice(0, 10);

const buildInitialForm = (initial) => {
  if (!initial) {
    return { amount: '', category: CATEGORIES[0], date: todayISO(), note: '' };
  }
  return {
    amount: String(initial.amount ?? ''),
    category: initial.category ?? CATEGORIES[0],
    date: (initial.date ?? todayISO()).slice(0, 10),
    note: initial.note ?? '',
  };
};

export default function ExpenseForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = 'Add expense',
  busy = false,
}) {
  const [form, setForm] = useState(() => buildInitialForm(initial));

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) return;
    onSubmit({
      amount,
      category: form.category,
      date: new Date(form.date).toISOString(),
      note: form.note.trim() || undefined,
    });
    if (!initial) setForm(buildInitialForm(null));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 rounded-lg p-4 grid gap-3 sm:grid-cols-5"
    >
      <div className="sm:col-span-1">
        <label className="block text-xs font-medium text-slate-600 mb-1">Amount</label>
        <input
          type="number"
          step="0.01"
          min="0"
          required
          value={form.amount}
          onChange={update('amount')}
          className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          placeholder="0.00"
        />
      </div>
      <div className="sm:col-span-1">
        <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
        <select
          value={form.category}
          onChange={update('category')}
          className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-1">
        <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
        <input
          type="date"
          required
          value={form.date}
          onChange={update('date')}
          className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-slate-600 mb-1">Note</label>
        <input
          type="text"
          value={form.note}
          onChange={update('note')}
          className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          placeholder="Optional"
        />
      </div>
      <div className="sm:col-span-5 flex gap-2 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-sm rounded-md border border-slate-300 hover:bg-slate-100"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={busy}
          className="px-3 py-1.5 text-sm rounded-md bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {busy ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
