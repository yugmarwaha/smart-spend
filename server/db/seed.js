import { pool } from '../config/db.js';

const CATEGORIES = [
  'Food',
  'Transport',
  'Rent',
  'Entertainment',
  'Utilities',
  'Shopping',
  'Health',
  'Other',
];

function daysAgo(n) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

const SAMPLES = [
  { amount: 1850.0, category: 'Rent', date: daysAgo(28), note: 'Monthly rent' },
  { amount: 42.5, category: 'Food', date: daysAgo(26), note: 'Groceries' },
  { amount: 14.2, category: 'Transport', date: daysAgo(25), note: 'Subway pass' },
  { amount: 89.99, category: 'Shopping', date: daysAgo(22), note: 'New headphones cable' },
  { amount: 12.0, category: 'Food', date: daysAgo(20), note: 'Lunch' },
  { amount: 65.0, category: 'Utilities', date: daysAgo(18), note: 'Internet' },
  { amount: 28.75, category: 'Entertainment', date: daysAgo(15), note: 'Concert ticket' },
  { amount: 9.5, category: 'Food', date: daysAgo(12), note: 'Coffee + bagel' },
  { amount: 120.0, category: 'Health', date: daysAgo(10), note: 'Pharmacy' },
  { amount: 34.0, category: 'Transport', date: daysAgo(7), note: 'Uber' },
  { amount: 56.4, category: 'Food', date: daysAgo(5), note: 'Dinner with friends' },
  { amount: 18.0, category: 'Entertainment', date: daysAgo(3), note: 'Movie' },
  { amount: 22.3, category: 'Food', date: daysAgo(1), note: 'Takeout' },
  { amount: 7.5, category: 'Other', date: daysAgo(0), note: 'Tip jar' },
];

async function seed() {
  console.log('Clearing existing expenses for default-user…');
  await pool.query("DELETE FROM expenses WHERE user_id = 'default-user'");

  console.log(`Inserting ${SAMPLES.length} sample expenses…`);
  for (const s of SAMPLES) {
    await pool.query(
      `INSERT INTO expenses (amount, category, date, note)
       VALUES ($1, $2, $3, $4)`,
      [s.amount, s.category, s.date, s.note],
    );
  }
  console.log(`Available categories: ${CATEGORIES.join(', ')}`);
  console.log('Seed complete.');
  await pool.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
