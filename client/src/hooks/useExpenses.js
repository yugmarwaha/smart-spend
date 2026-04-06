import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../api/expenses.js';

const EXPENSES_KEY = ['expenses'];

export function useExpenses() {
  return useQuery({
    queryKey: EXPENSES_KEY,
    queryFn: listExpenses,
  });
}

function useInvalidateExpenses() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: EXPENSES_KEY });
}

export function useAddExpense() {
  const invalidate = useInvalidateExpenses();
  return useMutation({
    mutationFn: createExpense,
    onSuccess: invalidate,
  });
}

export function useUpdateExpense() {
  const invalidate = useInvalidateExpenses();
  return useMutation({
    mutationFn: ({ id, patch }) => updateExpense(id, patch),
    onSuccess: invalidate,
  });
}

export function useDeleteExpense() {
  const invalidate = useInvalidateExpenses();
  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: invalidate,
  });
}
