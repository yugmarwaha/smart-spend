import express from 'express';
import cors from 'cors';
import expensesRouter from './routes/expenses.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  app.use(cors({ origin: clientOrigin }));
  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({ message: 'SmartSpend API is running' });
  });

  app.get('/health', (req, res) => {
    res.json({ ok: true, uptime: process.uptime() });
  });

  app.use('/expenses', expensesRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
