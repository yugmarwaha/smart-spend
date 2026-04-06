import { useId, useMemo, useState } from 'react';
import { CATEGORIES } from '../lib/categories.js';
import { useCategorySuggestion } from '../hooks/useCategorySuggestion.js';

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

function validate(form) {
  const errors = {};
  const amount = parseFloat(form.amount);
  if (form.amount === '') {
    errors.amount = 'Amount is required';
  } else if (!Number.isFinite(amount) || amount <= 0) {
    errors.amount = 'Must be greater than 0';
  } else if (amount > 1_000_000) {
    errors.amount = 'Suspiciously large — double check?';
  }

  if (!form.date) {
    errors.date = 'Date is required';
  } else {
    const d = new Date(form.date);
    if (Number.isNaN(d.getTime())) {
      errors.date = 'Invalid date';
    } else {
      const now = new Date();
      now.setHours(23, 59, 59, 999);
      if (d > now) errors.date = 'Date is in the future';
    }
  }

  if (form.note && form.note.length > 240) {
    errors.note = `Too long (${form.note.length}/240)`;
  }
  return errors;
}

export default function ExpenseForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = 'Add transaction',
  busy = false,
}) {
  const ids = {
    amount: useId(),
    category: useId(),
    date: useId(),
    note: useId(),
  };
  const [form, setForm] = useState(() => buildInitialForm(initial));
  const [touched, setTouched] = useState({});
  const [acceptedSuggestion, setAcceptedSuggestion] = useState(false);

  const errors = useMemo(() => validate(form), [form]);
  const isValid = Object.keys(errors).length === 0;

  const suggestion = useCategorySuggestion(form.note, {
    enabled: !initial && !acceptedSuggestion,
  });
  const showSuggestion =
    suggestion &&
    suggestion.category !== form.category &&
    suggestion.confidence >= 0.25;

  const acceptSuggestion = () => {
    if (!suggestion) return;
    setForm((f) => ({ ...f, category: suggestion.category }));
    setAcceptedSuggestion(true);
  };

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const blur = (key) => () => setTouched((t) => ({ ...t, [key]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ amount: true, date: true, note: true });
    if (!isValid) return;
    onSubmit({
      amount: parseFloat(form.amount),
      category: form.category,
      date: new Date(form.date).toISOString(),
      note: form.note.trim() || undefined,
    });
    if (!initial) {
      setForm(buildInitialForm(null));
      setTouched({});
      setAcceptedSuggestion(false);
    }
  };

  const handleNoteChange = (e) => {
    setAcceptedSuggestion(false);
    setForm((f) => ({ ...f, note: e.target.value }));
  };

  const fieldClass = (key) =>
    [
      'input',
      touched[key] && errors[key] ? '!border-negative focus:!border-negative' : '',
    ].join(' ');

  const errorFor = (key) =>
    touched[key] && errors[key] ? (
      <div className="text-xs text-negative mt-1">{errors[key]}</div>
    ) : null;

  return (
    <form onSubmit={handleSubmit} className="card p-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-12">
        <div className="sm:col-span-3">
          <label htmlFor={ids.amount} className="label block mb-1.5">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted text-sm">
              $
            </span>
            <input
              id={ids.amount}
              type="number"
              step="0.01"
              min="0"
              value={form.amount}
              onChange={update('amount')}
              onBlur={blur('amount')}
              placeholder="0.00"
              aria-invalid={!!(touched.amount && errors.amount)}
              className={`${fieldClass('amount')} pl-7 font-mono tabular-nums`}
            />
          </div>
          {errorFor('amount')}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor={ids.category} className="label block mb-1.5">Category</label>
          <select
            id={ids.category}
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
          <label htmlFor={ids.date} className="label block mb-1.5">Date</label>
          <input
            id={ids.date}
            type="date"
            value={form.date}
            onChange={update('date')}
            onBlur={blur('date')}
            aria-invalid={!!(touched.date && errors.date)}
            className={`${fieldClass('date')} font-mono`}
          />
          {errorFor('date')}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor={ids.note} className="label block mb-1.5">Note</label>
          <input
            id={ids.note}
            type="text"
            value={form.note}
            onChange={handleNoteChange}
            onBlur={blur('note')}
            placeholder="Optional"
            aria-invalid={!!(touched.note && errors.note)}
            className={fieldClass('note')}
          />
          {errorFor('note')}
          {showSuggestion && (
            <button
              type="button"
              onClick={acceptSuggestion}
              className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-fg-muted hover:text-fg transition-colors group"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
              </svg>
              Try{' '}
              <span className="text-fg-2 font-medium underline decoration-dotted underline-offset-2 group-hover:text-fg">
                {suggestion.category}
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mt-5 pt-4 border-t border-border">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-ghost">
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={busy || !isValid}
          className="btn btn-primary"
        >
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
