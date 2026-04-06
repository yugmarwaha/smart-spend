import ExpenseForm from '../components/ExpenseForm.jsx';
import ExpenseList from '../components/ExpenseList.jsx';
import { useAddExpense } from '../hooks/useExpenses.js';

export default function Expenses() {
  const addMut = useAddExpense();

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
      </header>

      <section className="space-y-2 fade-up fade-up-1">
        <div className="text-xs text-fg-muted px-1">New transaction</div>
        <ExpenseForm
          onSubmit={(payload) => addMut.mutate(payload)}
          busy={addMut.isPending}
        />
        {addMut.isError && (
          <div className="text-xs text-negative px-1">
            {addMut.error?.message || 'Failed to add transaction'}
          </div>
        )}
      </section>

      <section className="fade-up fade-up-2">
        <ExpenseList />
      </section>
    </div>
  );
}
