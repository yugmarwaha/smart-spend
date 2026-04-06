import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  listExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../api/expenses.js';

const EXPENSES_KEY = ['expenses'];

function errorMessage(err, fallback) {
  return err?.response?.data?.error || err?.message || fallback;
}

export function useExpenses() {
  return useQuery({
    queryKey: EXPENSES_KEY,
    queryFn: listExpenses,
  });
}

export function useAddExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createExpense,
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: EXPENSES_KEY });
      const previous = qc.getQueryData(EXPENSES_KEY);
      const optimistic = {
        id: `optimistic-${Date.now()}`,
        amount: Number(payload.amount),
        category: payload.category,
        date: payload.date,
        note: payload.note,
        __optimistic: true,
      };
      qc.setQueryData(EXPENSES_KEY, (old = []) => [optimistic, ...old]);
      return { previous };
    },
    onError: (err, _payload, ctx) => {
      if (ctx?.previous) qc.setQueryData(EXPENSES_KEY, ctx.previous);
      toast.error(errorMessage(err, 'Failed to add transaction'));
    },
    onSuccess: () => {
      toast.success('Transaction added');
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: EXPENSES_KEY });
    },
  });
}

export function useUpdateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => updateExpense(id, patch),
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: EXPENSES_KEY });
      const previous = qc.getQueryData(EXPENSES_KEY);
      qc.setQueryData(EXPENSES_KEY, (old = []) =>
        old.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      );
      return { previous };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(EXPENSES_KEY, ctx.previous);
      toast.error(errorMessage(err, 'Failed to update transaction'));
    },
    onSuccess: () => {
      toast.success('Transaction updated');
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: EXPENSES_KEY });
    },
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteExpense,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: EXPENSES_KEY });
      const previous = qc.getQueryData(EXPENSES_KEY);
      qc.setQueryData(EXPENSES_KEY, (old = []) =>
        old.filter((e) => e.id !== id),
      );
      return { previous };
    },
    onError: (err, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(EXPENSES_KEY, ctx.previous);
      toast.error(errorMessage(err, 'Failed to delete transaction'));
    },
    onSuccess: () => {
      toast.success('Transaction deleted');
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: EXPENSES_KEY });
    },
  });
}
