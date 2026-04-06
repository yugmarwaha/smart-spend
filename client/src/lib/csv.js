function escapeCell(v) {
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (s.includes('"') || s.includes(',') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function expensesToCsv(expenses) {
  const headers = ['id', 'date', 'category', 'amount', 'note'];
  const rows = expenses.map((e) =>
    [
      e.id,
      new Date(e.date).toISOString(),
      e.category,
      Number(e.amount).toFixed(2),
      e.note ?? '',
    ]
      .map(escapeCell)
      .join(','),
  );
  return [headers.join(','), ...rows].join('\n');
}

export function exportExpensesCsv(expenses, filename = 'expenses.csv') {
  const csv = expensesToCsv(expenses);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
