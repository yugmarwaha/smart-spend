import { useEffect, useState } from 'react';
import { predictCategory } from '../api/ml.js';

/**
 * Debounced category suggestion based on note text.
 * Returns null when the note is empty or the ML service is unreachable.
 */
export function useCategorySuggestion(note, { enabled = true, delay = 350 } = {}) {
  const [suggestion, setSuggestion] = useState(null);
  const trimmed = note.trim();
  const shouldFetch = enabled && trimmed.length >= 3;

  useEffect(() => {
    if (!shouldFetch) {
      // Clear any stale suggestion via the setter (allowed in cleanup-style flow)
      let cancelled = false;
      Promise.resolve().then(() => {
        if (!cancelled) setSuggestion(null);
      });
      return () => {
        cancelled = true;
      };
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const result = await predictCategory(trimmed);
        if (!cancelled) setSuggestion(result);
      } catch {
        if (!cancelled) setSuggestion(null);
      }
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmed, shouldFetch, delay]);

  return shouldFetch ? suggestion : null;
}
