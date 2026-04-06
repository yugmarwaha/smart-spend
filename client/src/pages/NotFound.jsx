import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-16">
      <h1 className="text-3xl font-semibold mb-2">404</h1>
      <p className="text-slate-500 mb-4">That page doesn't exist.</p>
      <Link to="/" className="text-slate-900 underline">
        Back to Dashboard
      </Link>
    </div>
  );
}
