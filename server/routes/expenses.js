import { Router } from 'express';
import { pool } from '../config/db.js';
import { HttpError } from '../middleware/errorHandler.js';

const router = Router();

// TODO: replace with authenticated user once auth lands
const CURRENT_USER = 'default-user';

const ALLOWED_CATEGORIES = new Set([
  'Food',
  'Transport',
  'Rent',
  'Entertainment',
  'Utilities',
  'Shopping',
  'Health',
  'Other',
]);

function rowToExpense(row) {
  return {
    id: String(row.id),
    amount: Number(row.amount),
    category: row.category,
    date: row.date instanceof Date ? row.date.toISOString() : row.date,
    note: row.note ?? undefined,
  };
}

function validateExpenseInput(body, { partial = false } = {}) {
  const out = {};

  if (body.amount !== undefined) {
    const n = Number(body.amount);
    if (!Number.isFinite(n) || n < 0) {
      throw new HttpError(400, 'amount must be a non-negative number');
    }
    out.amount = n;
  } else if (!partial) {
    throw new HttpError(400, 'amount is required');
  }

  if (body.category !== undefined) {
    if (typeof body.category !== 'string' || !ALLOWED_CATEGORIES.has(body.category)) {
      throw new HttpError(400, `category must be one of: ${[...ALLOWED_CATEGORIES].join(', ')}`);
    }
    out.category = body.category;
  } else if (!partial) {
    throw new HttpError(400, 'category is required');
  }

  if (body.date !== undefined) {
    const d = new Date(body.date);
    if (Number.isNaN(d.getTime())) {
      throw new HttpError(400, 'date must be a valid ISO date string');
    }
    out.date = d.toISOString();
  } else if (!partial) {
    throw new HttpError(400, 'date is required');
  }

  if (body.note !== undefined) {
    if (body.note === null || body.note === '') {
      out.note = null;
    } else if (typeof body.note !== 'string') {
      throw new HttpError(400, 'note must be a string');
    } else {
      out.note = body.note.trim() || null;
    }
  }

  return out;
}

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

// GET /expenses
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      `SELECT id, amount, category, date, note
       FROM expenses
       WHERE user_id = $1
       ORDER BY date DESC, id DESC`,
      [CURRENT_USER],
    );
    res.json(rows.map(rowToExpense));
  }),
);

// POST /expenses
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const data = validateExpenseInput(req.body);
    const { rows } = await pool.query(
      `INSERT INTO expenses (user_id, amount, category, date, note)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, amount, category, date, note`,
      [CURRENT_USER, data.amount, data.category, data.date, data.note ?? null],
    );
    res.status(201).json(rowToExpense(rows[0]));
  }),
);

// PATCH /expenses/:id
router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new HttpError(400, 'invalid id');
    }
    const data = validateExpenseInput(req.body, { partial: true });
    if (Object.keys(data).length === 0) {
      throw new HttpError(400, 'no fields to update');
    }

    const sets = [];
    const values = [];
    let i = 1;
    for (const [key, value] of Object.entries(data)) {
      sets.push(`${key} = $${i++}`);
      values.push(value);
    }
    values.push(id, CURRENT_USER);

    const { rows } = await pool.query(
      `UPDATE expenses
       SET ${sets.join(', ')}
       WHERE id = $${i++} AND user_id = $${i}
       RETURNING id, amount, category, date, note`,
      values,
    );
    if (rows.length === 0) throw new HttpError(404, 'expense not found');
    res.json(rowToExpense(rows[0]));
  }),
);

// DELETE /expenses/:id
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new HttpError(400, 'invalid id');
    }
    const { rowCount } = await pool.query(
      `DELETE FROM expenses WHERE id = $1 AND user_id = $2`,
      [id, CURRENT_USER],
    );
    if (rowCount === 0) throw new HttpError(404, 'expense not found');
    res.json({ ok: true });
  }),
);

export default router;
