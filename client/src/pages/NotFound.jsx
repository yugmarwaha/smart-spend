import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-2 bg-surface text-xs text-fg-muted mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-negative" />
        Error 404
      </div>
      <h1 className="text-5xl font-semibold tracking-tight text-fg mb-3">
        Page not found
      </h1>
      <p className="text-fg-muted max-w-md mx-auto mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to Dashboard
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
