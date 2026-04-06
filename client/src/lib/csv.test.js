import { describe, it, expect } from 'vitest';
import { expensesToCsv } from './csv.js';

describe('expensesToCsv', () => {
  it('produces a header row and one row per expense', () => {
    const csv = expensesToCsv([
      {
        id: '1',
        date: '2026-04-01T12:00:00.000Z',
        category: 'Food',
        amount: 12.5,
        note: 'lunch',
      },
      {
        id: '2',
        date: '2026-04-02T12:00:00.000Z',
        category: 'Transport',
        amount: 4,
        note: null,
      },
    ]);
    const lines = csv.split('\n');
    expect(lines).toHaveLength(3);
    expect(lines[0]).toBe('id,date,category,amount,note');
    expect(lines[1]).toContain('Food');
    expect(lines[1]).toContain('12.50');
    expect(lines[1]).toContain('lunch');
    expect(lines[2]).toContain('Transport');
  });

  it('escapes commas and quotes', () => {
    const csv = expensesToCsv([
      {
        id: '1',
        date: '2026-04-01T12:00:00.000Z',
        category: 'Food',
        amount: 9,
        note: 'tea, biscuits, "earl grey"',
      },
    ]);
    expect(csv).toContain('"tea, biscuits, ""earl grey"""');
  });

  it('handles empty list', () => {
    const csv = expensesToCsv([]);
    expect(csv).toBe('id,date,category,amount,note');
  });
});
