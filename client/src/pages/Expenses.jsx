import ExpenseForm from '../components/ExpenseForm.jsx';
import ExpenseList from '../components/ExpenseList.jsx';
import { useAddExpense } from '../hooks/useExpenses.js';

export default function Expenses() {
  const addMut = useAddExpense();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Expenses</h1>
        <p className="text-sm text-slate-500 mt-1">Add and manage your expenses.</p>
      </div>
      <ExpenseForm onSubmit={(payload) => addMut.mutate(payload)} busy={addMut.isPending} />
      <ExpenseList />
    </div>
  );
}
