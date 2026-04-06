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
  submitLabel = 'Add transaction',
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
    <form onSubmit={handleSubmit} className="card p-5">
      <div className="grid gap-4 sm:grid-cols-12">
        <div className="sm:col-span-3">
          <label className="label block mb-1.5">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted text-sm">
              $
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={form.amount}
              onChange={update('amount')}
              placeholder="0.00"
              className="input pl-7 font-mono tabular-nums"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label className="label block mb-1.5">Category</label>
          <select
            value={form.category}
            onChange={update('category')}
            className="input cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <label className="label block mb-1.5">Date</label>
          <input
            type="date"
            required
            value={form.date}
            onChange={update('date')}
            className="input font-mono"
          />
        </div>

        <div className="sm:col-span-3">
          <label className="label block mb-1.5">Note</label>
          <input
            type="text"
            value={form.note}
            onChange={update('note')}
            placeholder="Optional"
            className="input"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mt-5 pt-4 border-t border-border">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-ghost">
            Cancel
          </button>
        )}
        <button type="submit" disabled={busy} className="btn btn-primary">
          {busy ? (
            'Saving…'
          ) : (
            <>
              {submitLabel}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
