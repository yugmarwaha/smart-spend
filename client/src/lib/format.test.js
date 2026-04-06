import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate } from './format.js';

describe('formatCurrency', () => {
  it('formats numbers as USD', () => {
    expect(formatCurrency(12.5)).toBe('$12.50');
    expect(formatCurrency(1850)).toBe('$1,850.00');
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('handles non-numeric input as zero', () => {
    expect(formatCurrency('abc')).toBe('$0.00');
    expect(formatCurrency(null)).toBe('$0.00');
    expect(formatCurrency(undefined)).toBe('$0.00');
  });
});

describe('formatDate', () => {
  it('formats ISO strings to short date', () => {
    const out = formatDate('2026-04-01T12:00:00.000Z');
    expect(out).toMatch(/Apr/);
    expect(out).toMatch(/2026/);
  });

  it('handles empty/invalid input', () => {
    expect(formatDate('')).toBe('');
    expect(formatDate(null)).toBe('');
    expect(formatDate('not-a-date')).toBe('');
  });
});
