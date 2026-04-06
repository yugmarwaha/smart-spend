export default function StatCard({ title, value, hint, trend, icon }) {
  const trendPositive = trend && trend.startsWith('+');
  const trendNegative = trend && trend.startsWith('-');

  return (
    <div className="card p-5 group hover:border-border-strong transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="label">{title}</div>
        {icon && (
          <div className="w-7 h-7 rounded-md bg-surface-2 border border-border-2 grid place-items-center text-fg-muted group-hover:text-accent transition-colors">
            {icon}
          </div>
        )}
      </div>
      <div className="font-sans text-3xl font-semibold tracking-tight tabular-nums text-fg">
        {value}
      </div>
      <div className="flex items-center gap-2 mt-2 text-xs">
        {trend && (
          <span
            className={[
              'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md font-medium tabular-nums',
              trendPositive && 'text-positive bg-positive/10',
              trendNegative && 'text-negative bg-negative/10',
              !trendPositive && !trendNegative && 'text-fg-muted bg-surface-2',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {trend}
          </span>
        )}
        {hint && <span className="text-fg-muted">{hint}</span>}
      </div>
    </div>
  );
}
