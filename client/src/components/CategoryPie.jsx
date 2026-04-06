import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CATEGORY_COLORS } from '../lib/categories.js';
import { formatCurrency } from '../lib/format.js';

export default function CategoryPie({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-sm text-slate-500 text-center py-12">No data</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={90}
          innerRadius={50}
          paddingAngle={2}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#64748b'} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => formatCurrency(v)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
