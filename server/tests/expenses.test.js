import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';
import request from 'supertest';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// IMPORTANT: set env before importing the app so config/db.js picks it up
process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  'postgres://yugmarwaha@localhost:5432/smartspend_test';
process.env.CLIENT_ORIGIN = 'http://localhost:5173';

let app;
let pool;

beforeAll(async () => {
  const appModule = await import('../app.js');
  const dbModule = await import('../config/db.js');
  app = appModule.createApp();
  pool = dbModule.pool;

  const sql = await readFile(join(__dirname, '..', 'db', 'schema.sql'), 'utf8');
  await pool.query(sql);
});

afterAll(async () => {
  await pool.query("DELETE FROM expenses WHERE user_id = 'default-user'");
  await pool.end();
});

beforeEach(async () => {
  await pool.query("DELETE FROM expenses WHERE user_id = 'default-user'");
});

describe('GET /health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});

describe('expenses CRUD', () => {
  const sample = {
    amount: 12.5,
    category: 'Food',
    date: '2026-04-01T12:00:00.000Z',
    note: 'lunch',
  };

  it('creates and lists', async () => {
    const create = await request(app).post('/expenses').send(sample);
    expect(create.status).toBe(201);
    expect(create.body.id).toBeDefined();
    expect(create.body.amount).toBe(12.5);
    expect(create.body.category).toBe('Food');

    const list = await request(app).get('/expenses');
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].note).toBe('lunch');
  });

  it('updates an expense', async () => {
    const create = await request(app).post('/expenses').send(sample);
    const id = create.body.id;

    const patch = await request(app)
      .patch(`/expenses/${id}`)
      .send({ amount: 20, note: 'dinner' });
    expect(patch.status).toBe(200);
    expect(patch.body.amount).toBe(20);
    expect(patch.body.note).toBe('dinner');
    expect(patch.body.category).toBe('Food');
  });

  it('deletes an expense', async () => {
    const create = await request(app).post('/expenses').send(sample);
    const del = await request(app).delete(`/expenses/${create.body.id}`);
    expect(del.status).toBe(200);
    expect(del.body.ok).toBe(true);

    const list = await request(app).get('/expenses');
    expect(list.body).toHaveLength(0);
  });

  it('rejects invalid category', async () => {
    const res = await request(app)
      .post('/expenses')
      .send({ ...sample, category: 'Bogus' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/category/i);
  });

  it('rejects negative amount', async () => {
    const res = await request(app)
      .post('/expenses')
      .send({ ...sample, amount: -5 });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/amount/i);
  });

  it('returns 404 deleting non-existent id', async () => {
    const res = await request(app).delete('/expenses/9999999');
    expect(res.status).toBe(404);
  });

  it('returns 400 for invalid id', async () => {
    const res = await request(app).delete('/expenses/abc');
    expect(res.status).toBe(400);
  });
});
