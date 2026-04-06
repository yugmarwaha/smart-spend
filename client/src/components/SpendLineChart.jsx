import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../lib/format.js';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-surface border border-border-strong rounded-lg px-3 py-2 shadow-2xl">
      <div className="text-xs text-fg-muted">{label}</div>
      <div className="font-mono tabular-nums text-sm text-fg font-medium">
        {formatCurrency(payload[0].value)}
      </div>
    </div>
  );
}

export default function SpendLineChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-16 text-sm text-fg-muted">
        No data to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 12, right: 8, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bef264" stopOpacity={0.35} />
            <stop offset="60%" stopColor="#bef264" stopOpacity={0.05} />
            <stop offset="100%" stopColor="#bef264" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          stroke="#1f2126"
          strokeDasharray="0"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{
            fontSize: 10,
            fill: '#5b5f67',
            fontFamily: 'Geist Mono, monospace',
          }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          minTickGap={32}
        />
        <YAxis
          tick={{
            fontSize: 10,
            fill: '#5b5f67',
            fontFamily: 'Geist Mono, monospace',
          }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `$${v}`}
          width={48}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: '#bef264', strokeWidth: 1, strokeDasharray: '3 3' }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#bef264"
          strokeWidth={2}
          fill="url(#spendGradient)"
          dot={false}
          activeDot={{
            r: 5,
            fill: '#bef264',
            stroke: '#08090b',
            strokeWidth: 2,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
