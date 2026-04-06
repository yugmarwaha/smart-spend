export function Skeleton({ className = '', style }) {
  return (
    <div
      className={`bg-surface-2 rounded-md animate-pulse ${className}`}
      style={style}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-7 rounded-md" />
      </div>
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="py-4 pl-4 pr-3"><Skeleton className="h-3 w-20" /></td>
      <td className="py-4 px-3"><Skeleton className="h-5 w-20 rounded-md" /></td>
      <td className="py-4 px-3"><Skeleton className="h-3 w-40" /></td>
      <td className="py-4 px-3"><Skeleton className="h-3 w-16 ml-auto" /></td>
      <td className="py-4 pl-3 pr-4"></td>
    </tr>
  );
}
