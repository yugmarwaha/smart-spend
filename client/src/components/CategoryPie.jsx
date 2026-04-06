import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { CATEGORY_COLORS } from '../lib/categories.js';
import { formatCurrency } from '../lib/format.js';

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-surface border border-border-strong rounded-lg px-3 py-2 shadow-2xl">
      <div className="text-xs text-fg-muted">{name}</div>
      <div className="font-mono tabular-nums text-sm text-fg font-medium">
        {formatCurrency(value)}
      </div>
    </div>
  );
}

export default function CategoryPie({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-16 text-sm text-fg-muted">
        No data to display
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.value, 0);
  const sorted = [...data].sort((a, b) => b.value - a.value);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
      <div className="sm:col-span-2 relative">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={sorted}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={88}
              innerRadius={62}
              paddingAngle={2}
              stroke="#08090b"
              strokeWidth={2}
            >
              {sorted.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={CATEGORY_COLORS[entry.name] || '#94a3b8'}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider text-fg-muted">
              Total
            </div>
            <div className="font-mono tabular-nums text-base font-semibold text-fg mt-0.5">
              {formatCurrency(total)}
            </div>
          </div>
        </div>
      </div>
      <ul className="sm:col-span-3 space-y-2">
        {sorted.map((d) => {
          const pct = total ? (d.value / total) * 100 : 0;
          return (
            <li key={d.name} className="group">
              <div className="flex items-baseline justify-between gap-3 text-xs mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-sm flex-none"
                    style={{ backgroundColor: CATEGORY_COLORS[d.name] || '#94a3b8' }}
                  />
                  <span className="text-fg-2 truncate">{d.name}</span>
                </div>
                <div className="flex items-baseline gap-2 font-mono tabular-nums">
                  <span className="text-fg-muted">{pct.toFixed(0)}%</span>
                  <span className="text-fg">{formatCurrency(d.value)}</span>
                </div>
              </div>
              <div className="h-1 rounded-full bg-surface-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: CATEGORY_COLORS[d.name] || '#94a3b8',
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
