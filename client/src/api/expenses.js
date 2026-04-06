import { apiClient } from './client.js';

export async function listExpenses() {
  const res = await apiClient.get('/expenses');
  return res.data;
}

export async function createExpense(payload) {
  const res = await apiClient.post('/expenses', payload);
  return res.data;
}

export async function updateExpense(id, patch) {
  const res = await apiClient.patch(`/expenses/${id}`, patch);
  return res.data;
}

export async function deleteExpense(id) {
  const res = await apiClient.delete(`/expenses/${id}`);
  return res.data;
}
