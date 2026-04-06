import axios from 'axios';

const baseURL = import.meta.env.VITE_ML_URL || 'http://localhost:8000';

export const mlClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 4000,
});

export async function predictCategory(note) {
  const res = await mlClient.post('/predict-category', { note });
  return res.data; // { category, confidence, alternatives }
}
